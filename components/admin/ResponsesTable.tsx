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
    return <p className="text-gray-500 text-center py-8">No reviews yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="py-3 pr-4">Date</th>
            <th className="py-3 pr-4">Phone</th>
            <th className="py-3 pr-4">Found us via</th>
            <th className="py-3 pr-4">Price</th>
            <th className="py-3 pr-4">Staff</th>
            <th className="py-3 pr-4">Purchase reason</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="py-3 pr-4 whitespace-nowrap text-gray-500">
                {new Date(r.created_at).toLocaleDateString()}
              </td>
              <td className="py-3 pr-4 font-mono">{maskPhone(r.phone_number)}</td>
              <td className="py-3 pr-4">
                {r.discovery_channel}
                {r.discovery_other && (
                  <span className="text-gray-400"> — {r.discovery_other}</span>
                )}
              </td>
              <td className="py-3 pr-4 text-yellow-500">{stars(r.price_rating)}</td>
              <td className="py-3 pr-4">
                <span className="text-yellow-500">{stars(r.staff_rating)}</span>
                {r.staff_feedback && (
                  <p className="text-xs text-gray-400 mt-1">{r.staff_feedback}</p>
                )}
              </td>
              <td className="py-3 pr-4 max-w-xs truncate">{r.purchase_reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
