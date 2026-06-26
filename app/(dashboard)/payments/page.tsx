import { getPaymentMetrics, PaymentMetrics, STATUS_BADGE, PaymentStatus } from '@/lib/payments';

type AnalyticsCharge = {
  id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  buyer_id: string;
};

type AnalyticsPayout = {
  id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  seller_id: string;
};

function KpiCard({ title, value, subtext }: { title: string, value: string | number, subtext: string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-gray-400">{subtext}</p>
    </div>
  )
}

export default async function AnalyticsPage() {
  const metrics: PaymentMetrics = await getPaymentMetrics();

  const kpis = [
    { title: "Total Transactions", value: metrics.totalTransactions, subtext: "Charges + Payouts" },
    { title: "Total Charges", value: metrics.totalCharges, subtext: "Customer payments" },
    { title: "Total Payouts", value: metrics.totalPayouts, subtext: "Seller withdrawals" },
    { title: "Approval Rate", value: `${metrics.kpis.aprobado > 0 ? ((metrics.kpis.aprobado / metrics.totalCharges) * 100).toFixed(2) : 0}%`, subtext: "Of all charges" },
  ]

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <h1 className="text-2xl font-semibold mb-4">Analytics</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-2">Recent Charges</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Amount</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Created At</th>
                <th className="py-2 px-4 border-b text-left">Buyer ID</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recentCharges && (metrics.recentCharges as AnalyticsCharge[]).map((charge: AnalyticsCharge) => (
                <tr key={charge.id}>
                  <td className="py-2 px-4 border-b">{charge.id}</td>
                  <td className="py-2 px-4 border-b">${charge.amount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_BADGE[charge.status]}`}>
                      {charge.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{new Date(charge.created_at).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{charge.buyer_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Recent Payouts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Amount</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Created At</th>
                <th className="py-2 px-4 border-b text-left">Seller ID</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recentPayouts && (metrics.recentPayouts as AnalyticsPayout[]).map((payout: AnalyticsPayout) => (
                <tr key={payout.id}>
                  <td className="py-2 px-4 border-b">{payout.id}</td>
                  <td className="py-2 px-4 border-b">${payout.amount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_BADGE[payout.status]}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{new Date(payout.created_at).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{payout.seller_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
