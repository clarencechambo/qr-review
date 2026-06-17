import type { Review } from "@/lib/types";

interface ResponsesTableProps {
  reviews: Review[];
}

function maskPhone(phone: string) {
  if (phone.length < 4) return "****";
  return phone.slice(0, -4).replace(/\d/g, "*") + phone.slice(-4);
}

function stars(n: number) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export default function ResponsesTable({ reviews }: ResponsesTableProps) {
  if (reviews.length === 0) {
    return <p className="text-gray-400 text-center py-8">No reviews yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-gray-500">
            <th className="py-3 pr-4 font-semibold">Date</th>
            <th className="py-3 pr-4 font-semibold">Phone</th>
            <th className="py-3 pr-4 font-semibold">Found us via</th>
            <th className="py-3 pr-4 font-semibold">Price</th>
            <th className="py-3 pr-4 font-semibold">Staff</th>
            <th className="py-3 pr-4 font-semibold">Purchase reason</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => {
            const atRisk = r.staff_rating <= 2;
            return (
              <tr
                key={r.id}
                className="border-b border-gray-100 hover:bg-gray-50"
                style={atRisk ? { backgroundColor: "#E8174B0d" } : undefined}
              >
                <td className="py-3 pr-4 whitespace-nowrap text-gray-500">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4 font-mono text-gray-900">{maskPhone(r.phone_number)}</td>
                <td className="py-3 pr-4 text-gray-700">
                  {r.discovery_channel}
                  {r.discovery_other && (
                    <span className="text-gray-400"> — {r.discovery_other}</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-yellow-500 whitespace-nowrap">{stars(r.price_rating)}</td>
                <td className="py-3 pr-4">
                  <span className="text-yellow-500 whitespace-nowrap">{stars(r.staff_rating)}</span>
                  {r.staff_feedback && (
                    <p className="text-xs text-gray-500 mt-1 italic">&ldquo;{r.staff_feedback}&rdquo;</p>
                  )}
                </td>
                <td className="py-3 pr-4 max-w-xs truncate text-gray-700">{r.purchase_reason}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
