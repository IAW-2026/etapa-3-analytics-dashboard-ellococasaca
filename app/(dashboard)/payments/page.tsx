import { getPaymentMetrics, PaymentMetrics, STATUS_BADGE } from '@/lib/payments';
import PaymentStatusBarChart from '@/components/payments/PaymentStatusBarChart';
import PaymentTypeDonut from '@/components/payments/PaymentTypeDonut';

function KpiCard({ title, value, subtext, accent }: { title: string; value: string | number; subtext: string; accent: string }) {
  const isCurrency = typeof value === 'string' && value.startsWith('ARS');

  return (
    <div className={`rounded-3xl border border-slate-200 p-5 shadow-sm ${accent}`}>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className={`mt-4 font-semibold text-slate-900 ${isCurrency ? 'text-2xl' : 'text-3xl'}`}>{value}</p>
      <p className="mt-2 text-sm text-slate-500">{subtext}</p>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const metrics: PaymentMetrics = await getPaymentMetrics();
  const formatCurrency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
  const totalAmount = formatCurrency.format(metrics.totalProcessedAmount);
  const avgCharge = metrics.avgChargeAmount > 0 ? formatCurrency.format(metrics.avgChargeAmount) : '—';
  const avgPayout = metrics.avgPayoutAmount > 0 ? formatCurrency.format(metrics.avgPayoutAmount) : '—';
  const approvalRate = metrics.totalCharges > 0 ? `${((metrics.kpis.aprobado / metrics.totalCharges) * 100).toFixed(1)}%` : '0%';

  const kpis = [
    {
      title: 'Transacciones totales',
      value: metrics.totalTransactions,
      subtext: 'Cargos y pagos procesados',
      accent: 'bg-slate-50',
    },
    {
      title: 'Volumen procesado',
      value: totalAmount,
      subtext: 'Suma de cargos y pagos',
      accent: 'bg-sky-50',
    },
    {
      title: 'Aprobación de cargos',
      value: approvalRate,
      subtext: 'Porcentaje de cargos aprobados',
      accent: 'bg-emerald-50',
    },
    {
      title: 'Promedio de cargo',
      value: avgCharge,
      subtext: 'Ticket promedio por cargo',
      accent: 'bg-indigo-50',
    },
  ];

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-sky-500">Pagos</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Analytics de Pagos</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Visualiza el estado de los pagos, el volumen procesado y las últimas transacciones de cargos y pagos.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-950/5 to-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
          Últimos datos disponibles
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Comportamiento</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Transacciones por estado</h2>
            </div>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Total {metrics.totalTransactions}
            </span>
          </div>
          <PaymentStatusBarChart data={metrics.byStatus} />
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Mezcla</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Cargos vs Pagos</h2>
            </div>
            <PaymentTypeDonut data={metrics.typeBreakdown} />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Resumen rápido</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-sky-600">Total facturado</p>
                <p className="mt-3 text-xl font-semibold leading-tight text-slate-900">{formatCurrency.format(metrics.totalChargeAmount)}</p>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">Total pagado</p>
                <p className="mt-3 text-xl font-semibold leading-tight text-slate-900">{formatCurrency.format(metrics.totalPayoutAmount)}</p>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-indigo-600">Promedio cargo</p>
                <p className="mt-3 text-xl font-semibold leading-tight text-slate-900">{avgCharge}</p>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">Promedio pago</p>
                <p className="mt-3 text-xl font-semibold leading-tight text-slate-900">{avgPayout}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Cargos recientes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Creado</th>
                  <th className="px-4 py-3">Comprador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {metrics.recentCharges.map((charge) => (
                  <tr key={charge.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{charge.id}</td>
                    <td className="px-4 py-3 text-slate-700">{formatCurrency.format(charge.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[charge.status]}`}>
                        {charge.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{new Date(charge.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-700">{charge.buyer_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Pagos recientes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Creado</th>
                  <th className="px-4 py-3">Vendedor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {metrics.recentPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{payout.id}</td>
                    <td className="px-4 py-3 text-slate-700">{formatCurrency.format(payout.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[payout.status]}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{new Date(payout.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-700">{payout.seller_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
