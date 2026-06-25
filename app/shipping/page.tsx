import { getShippingMetrics } from "@/lib/shipping";
import { Package, Truck, CheckCircle2, XCircle } from "lucide-react";
import KpiCard from "@/components/shipping/KpiCard";
import StatusBarChart from "@/components/shipping/StatusBarChart";
import StatusDonut from "@/components/shipping/StatusDonut";
import RecentShipments from "@/components/shipping/RecentShipments";
export const dynamic = "force-dynamic";

export default async function ShippingPage() {
  let metrics;
  try {
    metrics = await getShippingMetrics();
  } catch (error) {
    return (
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Shipping</h1>
          <p className="mt-1 text-slate-500">Métricas de envíos y tracking.</p>
        </header>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-medium">No se pudieron cargar los datos de Shipping.</p>
          <p className="mt-1 text-sm">
            {error instanceof Error ? error.message : "Error desconocido"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shipping</h1>
          <p className="mt-1 text-slate-500">Métricas de envíos y tracking.</p>
        </div>
        <a
          href="https://proyecto-c-shipping2-ellococasaca.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
         >
          Abrir panel
        </a>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total de envíos" value={metrics.total} icon={Package} accent="bg-slate-100 text-slate-700" />
        <KpiCard label="En tránsito" value={metrics.kpis.inTransit} icon={Truck} accent="bg-blue-100 text-blue-700" />
        <KpiCard label="Entregados" value={metrics.kpis.delivered} icon={CheckCircle2} accent="bg-green-100 text-green-700" />
        <KpiCard label="Cancelados" value={metrics.kpis.canceled} icon={XCircle} accent="bg-red-100 text-red-700" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-slate-900">Envíos por estado</h2>
          <StatusBarChart data={metrics.byStatus} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-slate-900">Distribución</h2>
          <StatusDonut data={metrics.byStatus} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-2 font-semibold text-slate-900">Últimos envíos</h2>
        <RecentShipments shipments={metrics.recent} />
      </div>
    </div>
  );
}