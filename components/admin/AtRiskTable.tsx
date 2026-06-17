import type { AtRiskCustomer } from "@/lib/analytics";

interface AtRiskTableProps {
  customers: AtRiskCustomer[];
}

function maskPhone(phone: string) {
  if (phone.length < 4) return "****";
  return phone.slice(0, -4).replace(/\d/g, "*") + phone.slice(-4);
}

function stars(n: number) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export default function AtRiskTable({ customers }: AtRiskTableProps) {
  if (customers.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-6 text-center">
        No at-risk customers — everyone's happy so far.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-gray-500">
            <th className="py-3 pr-4 font-semibold">Date</th>
            <th className="py-3 pr-4 font-semibold">Phone</th>
            <th className="py-3 pr-4 font-semibold">Staff</th>
            <th className="py-3 pr-4 font-semibold">Price</th>
            <th className="py-3 pr-4 font-semibold">Why at risk</th>
            <th className="py-3 pr-4 font-semibold">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 pr-4 whitespace-nowrap text-gray-500">
                {new Date(c.created_at).toLocaleDateString()}
              </td>
              <td className="py-3 pr-4 font-mono text-gray-900">{maskPhone(c.phone_number)}</td>
              <td className="py-3 pr-4 text-yellow-500 whitespace-nowrap">{stars(c.staff_rating)}</td>
              <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">{c.price_rating}/5</td>
              <td className="py-3 pr-4">
                <div className="flex flex-wrap gap-1">
                  {c.reasons.map((reason) => (
                    <span
                      key={reason}
                      className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: "#E8174B1a", color: "#C9123E" }}
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-3 pr-4 max-w-xs text-gray-600 italic">
                {c.staff_feedback ? `"${c.staff_feedback}"` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
