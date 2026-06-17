import { DISCOVERY_OPTIONS, type DiscoveryChannel, type Review, type ReturnVisit } from "@/lib/types";

// NOTE: "returned" only reflects customers who re-scanned the QR and filled the
// return-visit form. It is a re-engagement proxy, not true store footfall.

export interface RetentionStats {
  totalCustomers: number;
  returned: number;
  churned: number;
  retentionRate: number; // 0–100
  churnRate: number; // 0–100
}

export function retentionStats(reviews: Review[], returns: ReturnVisit[]): RetentionStats {
  const totalCustomers = reviews.length;
  const reviewPhones = new Set(reviews.map((r) => r.phone_number));
  const returnedPhones = new Set(
    returns.map((v) => v.phone_number).filter((p) => reviewPhones.has(p))
  );
  const returned = returnedPhones.size;
  const churned = Math.max(totalCustomers - returned, 0);
  const retentionRate = totalCustomers ? Math.round((returned / totalCustomers) * 100) : 0;
  const churnRate = totalCustomers ? 100 - retentionRate : 0;
  return { totalCustomers, returned, churned, retentionRate, churnRate };
}

export interface AtRiskCustomer extends Review {
  reasons: string[];
}

// Flag reviews likely to churn: poor staff experience, perceived pricier, or left negative feedback.
export function atRiskCustomers(reviews: Review[]): AtRiskCustomer[] {
  const flagged: AtRiskCustomer[] = [];
  for (const r of reviews) {
    const reasons: string[] = [];
    if (r.staff_rating <= 2) reasons.push("Low staff rating");
    if (r.price_rating >= 4) reasons.push("Felt prices were high");
    if (r.staff_feedback && r.staff_feedback.trim()) reasons.push("Left negative feedback");
    if (reasons.length) flagged.push({ ...r, reasons });
  }
  // Worst first: lowest staff rating, then highest (worst) price perception.
  return flagged.sort(
    (a, b) => a.staff_rating - b.staff_rating || b.price_rating - a.price_rating
  );
}

export interface ChannelRetentionRow {
  channel: DiscoveryChannel;
  acquired: number;
  returned: number;
  returnRate: number; // 0–100
}

export function channelRetention(reviews: Review[], returns: ReturnVisit[]): ChannelRetentionRow[] {
  const returnedPhones = new Set(returns.map((v) => v.phone_number));
  return DISCOVERY_OPTIONS.map((channel) => {
    const inChannel = reviews.filter((r) => r.discovery_channel === channel);
    const acquired = inChannel.length;
    const returned = inChannel.filter((r) => returnedPhones.has(r.phone_number)).length;
    const returnRate = acquired ? Math.round((returned / acquired) * 100) : 0;
    return { channel, acquired, returned, returnRate };
  });
}

// Counts of ratings 1–5 for a given numeric field.
export function ratingDistribution(
  reviews: Review[],
  field: "staff_rating" | "price_rating"
): { rating: number; count: number }[] {
  return [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: reviews.filter((r) => r[field] === rating).length,
  }));
}

export interface WeekBucket {
  weekLabel: string;
  count: number;
  avgStaff: number;
}

// Weekly buckets (Mondays) of review volume + average staff rating, oldest → newest.
export function reviewsOverTime(reviews: Review[], weeks = 8): WeekBucket[] {
  const now = new Date();
  const startOfWeek = (d: Date) => {
    const x = new Date(d);
    const day = (x.getDay() + 6) % 7; // Monday = 0
    x.setHours(0, 0, 0, 0);
    x.setDate(x.getDate() - day);
    return x;
  };

  const buckets: WeekBucket[] = [];
  const thisWeek = startOfWeek(now);
  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date(thisWeek);
    start.setDate(start.getDate() - i * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const inWeek = reviews.filter((r) => {
      const t = new Date(r.created_at).getTime();
      return t >= start.getTime() && t < end.getTime();
    });
    const avgStaff = inWeek.length
      ? inWeek.reduce((s, r) => s + r.staff_rating, 0) / inWeek.length
      : 0;
    buckets.push({
      weekLabel: start.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      count: inWeek.length,
      avgStaff: Math.round(avgStaff * 10) / 10,
    });
  }
  return buckets;
}
