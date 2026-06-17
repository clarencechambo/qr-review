import type { Review } from "@/lib/types";
import { sentimentForRating } from "@/lib/analytics";
import Stars from "@/components/admin/Stars";
import { IconUser } from "@/components/admin/icons";

interface ReviewCardProps {
  review: Review;
}

function maskPhone(phone: string) {
  if (phone.length < 4) return "Customer";
  return "•••• " + phone.slice(-4);
}

// Deterministic accent colour per customer so avatars feel distinct.
const AVATAR_COLORS = ["#E8174B", "#00ADDE", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
function avatarColor(phone: string) {
  let h = 0;
  for (let i = 0; i < phone.length; i++) h = (h * 31 + phone.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const sentiment = sentimentForRating(review.staff_rating);
  const atRisk = review.staff_rating <= 2;
  const color = avatarColor(review.phone_number);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}1a`, color }}
        >
          <IconUser />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900 leading-tight">{maskPhone(review.phone_number)}</p>
              <p className="text-xs text-gray-400">
                {new Date(review.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Stars value={review.staff_rating} />
              <span
                className="rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{ backgroundColor: `${sentiment.color}1a`, color: sentiment.color }}
              >
                {sentiment.key}
              </span>
            </div>
          </div>

          {review.purchase_reason && (
            <p className="text-sm text-gray-700 mt-3">{review.purchase_reason}</p>
          )}

          {review.staff_feedback && (
            <div
              className="mt-3 rounded-xl px-3 py-2 text-sm italic"
              style={{ backgroundColor: "#E8174B0d", color: "#9f1239" }}
            >
              &ldquo;{review.staff_feedback}&rdquo;
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              Found us: {review.discovery_channel}
              {review.discovery_other ? ` — ${review.discovery_other}` : ""}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              Price: {review.price_rating}/5
            </span>
            {atRisk && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{ backgroundColor: "#E8174B1a", color: "#C9123E" }}
              >
                At risk
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
