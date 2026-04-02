import { ActualFraudReview } from "@/components/actual-fraud-review";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { OrderRecord } from "@/lib/types";

type OrdersTableProps = {
  orders: OrderRecord[];
  customerId: number;
};

export function OrdersTable({ orders, customerId }: OrdersTableProps) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 font-medium">Order</th>
              <th className="px-5 py-4 font-medium">Placed</th>
              <th className="px-5 py-4 font-medium">Payment</th>
              <th className="px-5 py-4 font-medium">Device</th>
              <th className="px-5 py-4 font-medium">Total</th>
              <th className="px-5 py-4 font-medium">Risk</th>
              <th className="px-5 py-4 font-medium">Pred. fraud</th>
              <th className="px-5 py-4 font-medium">Human review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.orderId} className="text-slate-700">
                <td className="px-5 py-4 font-medium text-slate-950">
                  #{order.orderId}
                </td>
                <td className="px-5 py-4">{formatDateTime(order.orderDatetime)}</td>
                <td className="px-5 py-4 capitalize">{order.paymentMethod}</td>
                <td className="px-5 py-4 capitalize">{order.deviceType}</td>
                <td className="px-5 py-4">{formatCurrency(order.orderTotal)}</td>
                <td className="px-5 py-4">{order.riskScore}/100</td>
                <td className="px-5 py-4">
                  {order.isFraud ? (
                    <span className="font-medium text-rose-700">Yes</span>
                  ) : (
                    <span className="text-slate-500">No</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <ActualFraudReview
                    key={`${customerId}-${order.orderId}-af-${order.actualFraud === null ? "n" : order.actualFraud ? "t" : "f"}`}
                    orderId={order.orderId}
                    customerId={customerId}
                    initialActualFraud={order.actualFraud}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
