import { formatDateTime, formatPercent } from "@/lib/format";
import type { PriorityQueueRow } from "@/lib/types";

type PriorityQueueTableProps = {
  rows: PriorityQueueRow[];
};

function labelClasses(label: PriorityQueueRow["lateDeliveryLabel"]) {
  if (label === "High") {
    return "bg-rose-100 text-rose-700";
  }

  if (label === "Medium") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-emerald-100 text-emerald-700";
}

export function PriorityQueueTable({ rows }: PriorityQueueTableProps) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 font-medium">Priority</th>
              <th className="px-5 py-4 font-medium">Customer</th>
              <th className="px-5 py-4 font-medium">Order</th>
              <th className="px-5 py-4 font-medium">Carrier</th>
              <th className="px-5 py-4 font-medium">Transit</th>
              <th className="px-5 py-4 font-medium">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={row.orderId} className="text-slate-700">
                <td className="px-5 py-4 font-medium text-slate-950">
                  {index + 1}
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-950">{row.customerName}</p>
                  <p className="text-slate-500">Customer #{row.customerId}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-950">#{row.orderId}</p>
                  <p className="text-slate-500">{formatDateTime(row.orderDatetime)}</p>
                </td>
                <td className="px-5 py-4">
                  <p>{row.carrier}</p>
                  <p className="capitalize text-slate-500">{row.shippingMethod}</p>
                </td>
                <td className="px-5 py-4">
                  {row.actualDays}/{row.promisedDays} days
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-950">
                      {formatPercent(row.lateDeliveryRisk)}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${labelClasses(row.lateDeliveryLabel)}`}
                    >
                      {row.lateDeliveryLabel}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
