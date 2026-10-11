import type { Review, ReturnVisit } from "@/lib/types";
import { averageRating, isComplaint, isPriceComplaint } from "@/lib/analytics";

export type PeriodType = "week" | "month";

// The store runs on East Africa Time (UTC+3, no daylight saving), so weeks and
// months start at local midnight, not UTC midnight.
const EAT_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface Period {
  type: PeriodType;
  /** Local start date, YYYY-MM-DD. Weeks start on Monday. */
  key: string;
  label: string;
  /** UTC instants: start inclusive, end exclusive. */
  start: number;
  end: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

function eatMidnight(y: number, m0: number, d: number): number {
  return Date.UTC(y, m0, d) - EAT_OFFSET_MS;
}

function eatDate(ms: number) {
  const x = new Date(ms + EAT_OFFSET_MS);
  return { y: x.getUTCFullYear(), m0: x.getUTCMonth(), d: x.getUTCDate(), dow: x.getUTCDay() };
}

function fmt(ms: number, opts: Intl.DateTimeFormatOptions): string {
  return new Date(ms + EAT_OFFSET_MS).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });
}

function makePeriod(type: PeriodType, year: number, month0: number, day: number): Period {
  // Callers may pass out-of-range parts (day -2, month -1); normalise via the instant.
  const start = eatMidnight(year, month0, day);
  const { y, m0, d } = eatDate(start);
  if (type === "month") {
    return {
      type,
      key: `${y}-${pad(m0 + 1)}-01`,
      label: fmt(start, { month: "long", year: "numeric" }),
      start,
      end: eatMidnight(y, m0 + 1, 1),
    };
  }
  const end = start + 7 * DAY_MS;
  const last = end - DAY_MS;
  const sameMonth = eatDate(start).m0 === eatDate(last).m0;
  const from = fmt(start, sameMonth ? { day: "numeric" } : { day: "numeric", month: "short" });
  return {
    type,
    key: `${y}-${pad(m0 + 1)}-${pad(d)}`,
    label: `${from} – ${fmt(last, { day: "numeric", month: "short", year: "numeric" })}`,
    start,
    end,
  };
}

/** Parses a period key (YYYY-MM-DD), snapping it to the start of its week or month. */
export function periodFromKey(type: PeriodType, key: string): Period | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!m) return null;
  const [y, m0, d] = [Number(m[1]), Number(m[2]) - 1, Number(m[3])];
  if (m0 < 0 || m0 > 11 || d < 1 || d > 31) return null;
  if (type === "month") return makePeriod("month", y, m0, 1);
  const dow = eatDate(eatMidnight(y, m0, d)).dow;
  return makePeriod("week", y, m0, d - ((dow + 6) % 7));
}

export function currentPeriod(type: PeriodType, now = Date.now()): Period {
  const t = eatDate(now);
  if (type === "month") return makePeriod("month", t.y, t.m0, 1);
  return makePeriod("week", t.y, t.m0, t.d - ((t.dow + 6) % 7));
}

export function previousPeriod(p: Period): Period {
  const s = eatDate(p.start);
  return p.type === "month"
    ? makePeriod("month", s.y, s.m0 - 1, 1)
    : makePeriod("week", s.y, s.m0, s.d - 7);
}

/** The current period followed by earlier ones, newest first. */
export function recentPeriods(type: PeriodType, count: number, now = Date.now()): Period[] {
  const out = [currentPeriod(type, now)];
  while (out.length < count) out.push(previousPeriod(out[out.length - 1]));
  return out;
}

function inPeriod<T extends { created_at: string }>(rows: T[], p: Period): T[] {
  return rows.filter((r) => {
    const t = new Date(r.created_at).getTime();
    return t >= p.start && t < p.end;
  });
}

const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 1000) / 10 : 0);

export type ComplaintType = "Staff rating" | "Price";

export interface ComplaintRow {
  review: Review;
  types: ComplaintType[];
}

export interface CountRow {
  label: string;
  count: number;
}

export interface ComplaintReport {
  period: Period;
  previous: Period;
  totalReviews: number;
  /** Reviews under 4 staff stars. */
  complaints: number;
  complaintRate: number;
  previousTotal: number;
  previousComplaints: number;
  /** Null when the previous period had no reviews to compare against. */
  previousComplaintRate: number | null;
  priceComplaints: number;
  priceComplaintRate: number;
  /** Staff complaints where the customer gave no reason. */
  complaintsWithoutReason: number;
  averageStaffRating: number;
  returnVisits: number;
  ratingBreakdown: CountRow[];
  complaintsByChannel: CountRow[];
  /** Staff and price complaints, worst first. */
  rows: ComplaintRow[];
  reviews: Review[];
}

export function buildComplaintReport(
  allReviews: Review[],
  allReturns: ReturnVisit[],
  period: Period
): ComplaintReport {
  const previous = previousPeriod(period);
  const reviews = inPeriod(allReviews, period).sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const prevReviews = inPeriod(allReviews, previous);

  const staff = reviews.filter(isComplaint);
  const price = reviews.filter(isPriceComplaint);
  const prevComplaints = prevReviews.filter(isComplaint).length;

  const rows: ComplaintRow[] = reviews
    .filter((r) => isComplaint(r) || isPriceComplaint(r))
    .map((review) => ({
      review,
      types: [
        ...(isComplaint(review) ? (["Staff rating"] as const) : []),
        ...(isPriceComplaint(review) ? (["Price"] as const) : []),
      ],
    }))
    .sort(
      (a, b) =>
        a.review.staff_rating - b.review.staff_rating ||
        b.review.price_rating - a.review.price_rating
    );

  const byChannel = new Map<string, number>();
  for (const { review } of rows) {
    byChannel.set(review.discovery_channel, (byChannel.get(review.discovery_channel) ?? 0) + 1);
  }

  return {
    period,
    previous,
    totalReviews: reviews.length,
    complaints: staff.length,
    complaintRate: pct(staff.length, reviews.length),
    previousTotal: prevReviews.length,
    previousComplaints: prevComplaints,
    previousComplaintRate: prevReviews.length ? pct(prevComplaints, prevReviews.length) : null,
    priceComplaints: price.length,
    priceComplaintRate: pct(price.length, reviews.length),
    complaintsWithoutReason: staff.filter((r) => !r.staff_feedback?.trim()).length,
    averageStaffRating: averageRating(reviews),
    returnVisits: inPeriod(allReturns, period).length,
    ratingBreakdown: [5, 4, 3, 2, 1].map((stars) => ({
      label: `${stars} star${stars === 1 ? "" : "s"}`,
      count: reviews.filter((r) => r.staff_rating === stars).length,
    })),
    complaintsByChannel: [...byChannel.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    rows,
    reviews,
  };
}

export const PRICE_LABELS: Record<number, string> = {
  1: "Much cheaper",
  2: "A bit cheaper",
  3: "About the same",
  4: "A bit pricier",
  5: "Much pricier",
};

/** Local date and time for display and export, e.g. "29 Sep 2026, 15:45". */
export function formatEat(iso: string): string {
  return new Date(new Date(iso).getTime() + EAT_OFFSET_MS).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}
