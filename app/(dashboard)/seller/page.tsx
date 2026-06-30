import { getSellerMetrics } from "@/lib/seller";

import {
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Receipt,
  TrendingUp,
} from "lucide-react";

import KpiCard from "@/components/feedback/KpiCard";
import SalesTrendChart from "@/components/seller/salesTrendChart";
import StatusDonut from "@/components/seller/statusDonut";
import TopProductsTable from "@/components/seller/topProductsTable";

export const dynamic = "force-dynamic";

export default async function SellerAnalyticsPage() {
  let metrics;

  try {
    metrics = await getSellerMetrics();
  } catch (error) {
    return (
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Seller Analytics
          </h1>

          <p className="mt-1 text-slate-500">
            Ventas, pedidos e inventario.
          </p>
        </header>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-medium">
            No se pudieron cargar los datos del Seller App.
          </p>

          <p className="mt-1 text-sm">
            {error instanceof Error
              ? error.message
              : "Error desconocido"}
          </p>
        </div>
      </div>
    );
  }

  const { kpis } = metrics;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Seller Analytics
          </h1>

          <p className="mt-1 text-slate-500">
            Ventas, pedidos e inventario.
          </p>
        </div>
      </header>

      {/* KPIs principales */}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Pedidos"
          value={kpis.totalOrders}
          icon={ShoppingCart}
          accent="bg-blue-100 text-blue-700"
        />

        <KpiCard
          label="Ingresos"
          value={`$${kpis.totalRevenue.toLocaleString("es-AR")}`}
          icon={DollarSign}
          accent="bg-green-100 text-green-700"
        />

        <KpiCard
          label="Productos"
          value={kpis.totalProducts}
          icon={Package}
          accent="bg-purple-100 text-purple-700"
        />

        <KpiCard
          label="Stock bajo"
          value={kpis.lowStockProducts}
          icon={AlertTriangle}
          accent="bg-red-100 text-red-700"
        />
      </div>

      {/* KPIs secundarios */}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Pendientes"
          value={kpis.pendingOrders}
          icon={Clock}
          accent="bg-yellow-100 text-yellow-700"
        />

        <KpiCard
          label="Entregados"
          value={kpis.deliveredOrders}
          icon={CheckCircle}
          accent="bg-emerald-100 text-emerald-700"
        />

        <KpiCard
          label="Ingresos completados"
          value={`$${kpis.completedRevenue.toLocaleString("es-AR")}`}
          icon={TrendingUp}
          accent="bg-cyan-100 text-cyan-700"
        />

        <KpiCard
          label="Ticket promedio"
          value={`$${kpis.averageOrderValue.toFixed(2)}`}
          icon={Receipt}
          accent="bg-indigo-100 text-indigo-700"
        />
      </div>

      {/* Charts */}

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-slate-900">
            Pedidos por estado
          </h2>

          <StatusDonut
            data={metrics.statusBreakdown}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-slate-900">
            Evolución de ingresos
          </h2>

          <SalesTrendChart
            data={metrics.salesTrend}
          />
        </div>
      </div>

      {/* Top productos */}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-slate-900">
          Productos más vendidos
        </h2>

        <TopProductsTable
          products={metrics.topProducts}
        />
      </div>
    </div>
  );
}