import { getBuyerMetrics } from "@/lib/buyer";
import {
  Users,
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";
import KpiCard from "@/components/feedback/KpiCard";
import OrderStatusDonut from "@/components/buyer/OrderStatusDonut";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  REJECTED: "Rechazado",
};

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  PAID: "bg-green-100 text-green-700 border border-green-200",
  REJECTED: "bg-red-100 text-red-700 border border-red-200",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PAID: "#22c55e",
  REJECTED: "#ef4444",
};

export default async function BuyerAnalyticsPage() {
  let metrics;

  try {
    metrics = await getBuyerMetrics();
  } catch (error) {
    return (
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Buyer Analytics
          </h1>
          <p className="mt-1 text-slate-500">
            Compradores, carritos y órdenes de compra de la Buyer App.
          </p>
        </header>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-medium">
            No se pudieron cargar los datos de la Buyer App.
          </p>
          <p className="mt-1 text-sm">
            {error instanceof Error ? error.message : "Error desconocido"}
          </p>
        </div>
      </div>
    );
  }

  const { buyers, carts, orders } = metrics;

  const formatCurrency = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const avgOrderValue =
    orders.total > 0 ? orders.volume / orders.total : 0;

  // Prepare chart data for OrderStatusDonut
  const orderStatusData = Object.entries(orders.byStatus || {}).map(
    ([status, count]) => ({
      name: STATUS_LABELS[status] ?? status,
      value: count,
      color: STATUS_COLORS[status] ?? "#64748b",
    })
  );

  return (
    <main className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-red-600 font-semibold">
            Compradores
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Buyer Analytics
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Estadísticas clave del marketplace referentes a compradores, carritos y órdenes de compra.
          </p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm self-start sm:self-auto">
          Últimos datos sincronizados
        </div>
      </header>

      {/* KPI Cards: General metrics */}
      <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Total Compradores"
          value={buyers.total}
          icon={Users}
          accent="bg-blue-100 text-blue-700"
        />

        <KpiCard
          label="Órdenes de Compra"
          value={orders.total}
          icon={ShoppingBag}
          accent="bg-indigo-100 text-indigo-700"
        />

        <KpiCard
          label="Volumen Transaccionado"
          value={formatCurrency.format(orders.volume)}
          icon={DollarSign}
          accent="bg-green-100 text-green-700"
        />

        <KpiCard
          label="Ticket Promedio"
          value={formatCurrency.format(avgOrderValue)}
          icon={TrendingUp}
          accent="bg-amber-100 text-amber-700"
        />
      </section>

      {/* KPI Cards: Carts metrics */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Carritos creados
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {carts.total}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Carritos Activos
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {carts.active}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Items en Carritos Activos
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {carts.totalItemsInActive}
            </p>
          </div>
        </div>
      </section>

      {/* Charts & Detail section */}
      <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Status distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="text-lg font-semibold text-slate-950 mb-1">
            Órdenes por Estado
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Distribución según estado de pago y aprobación.
          </p>
          <OrderStatusDonut data={orderStatusData} />
        </div>

        {/* Carts Status summary and fast indicators */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 mb-1">
              Análisis de Carritos
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Métricas de conversión y uso de los carritos del sistema.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tasa de Conversión (Órdenes / Carritos)
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {carts.total > 0
                    ? `${((orders.total / carts.total) * 100).toFixed(1)}%`
                    : "0.0%"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Porcentaje de carritos creados que resultaron en orden.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Promedio Items en Activos
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {carts.active > 0
                    ? (carts.totalItemsInActive / carts.active).toFixed(1)
                    : "0"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Promedio de productos por cada carrito activo actualmente.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-sm text-slate-500">
            <span>Carritos inactivos o abandonados</span>
            <span className="font-semibold text-slate-800">
              {Math.max(0, carts.total - carts.active)}
            </span>
          </div>
        </div>
      </section>

      {/* Recent data tables */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Buyers Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950 mb-1">
            Compradores Recientes
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Últimos usuarios registrados en la Buyer App.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-2">Nombre</th>
                  <th className="pb-3 px-2">Email</th>
                  <th className="pb-3 pl-2 text-right">Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {buyers.recent?.length > 0 ? (
                  buyers.recent.map((buyer) => (
                    <tr key={buyer.clerkId} className="hover:bg-slate-50/50">
                      <td className="py-3 pr-2 font-medium text-slate-950">
                        {buyer.name || "—"}
                      </td>
                      <td className="py-3 px-2 text-slate-600 truncate max-w-[150px]">
                        {buyer.email}
                      </td>
                      <td className="py-3 pl-2 text-right text-slate-500 text-xs whitespace-nowrap">
                        {new Date(buyer.createdAt).toLocaleDateString("es-AR")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400 text-sm">
                      No hay compradores registrados recientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950 mb-1">
            Pedidos Recientes
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Últimas transacciones creadas en la Buyer App.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-2">Orden</th>
                  <th className="pb-3 px-2">Total</th>
                  <th className="pb-3 px-2">Estado</th>
                  <th className="pb-3 pl-2 text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.recent?.length > 0 ? (
                  orders.recent.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50">
                      <td className="py-3 pr-2 font-medium text-slate-950">
                        <span className="block font-mono text-xs text-slate-800">
                          {order.externalOrderId}
                        </span>
                        {order.trackingId && (
                          <span className="block text-[10px] text-slate-400">
                            Track: {order.trackingId}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-slate-950 font-medium">
                        {formatCurrency.format(order.totalAmount)}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            STATUS_BADGE[order.status] ?? "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="py-3 pl-2 text-right text-slate-500 text-xs whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("es-AR")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400 text-sm">
                      No hay pedidos registrados recientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}