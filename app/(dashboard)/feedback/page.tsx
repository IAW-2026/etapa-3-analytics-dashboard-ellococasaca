import { getFeedbackMetrics } from "@/lib/feedback";
import {
  MessageSquare,
  Star,
  AlertTriangle,
  Clock,
} from "lucide-react";
import KpiCard from "@/components/feedback/KpiCard";
import RatingChart from "@/components/feedback/RatingChart";
import StatusDonut from "@/components/feedback/StatusDonut";
import ReviewsOverTimeChart from "@/components/feedback/ReviewsOverTimeChart";
import TopTable from "@/components/feedback/TopTable";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  let metrics;
  try {
    metrics = await getFeedbackMetrics();
  } catch (error) {
    return (
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Feedback</h1>
          <p className="mt-1 text-slate-500">Reseñas y calificaciones.</p>
        </header>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-medium">No se pudieron cargar los datos de Feedback.</p>
          <p className="mt-1 text-sm">
            {error instanceof Error ? error.message : "Error desconocido"}
          </p>
        </div>
      </div>
    );
  }

  const avgRating =
    metrics.kpis.averageRating > 0
      ? metrics.kpis.averageRating.toFixed(1) + " / 5"
      : "—";

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Feedback</h1>
          <p className="mt-1 text-slate-500">Reseñas y calificaciones.</p>
        </div>
        <a
          href={process.env.NEXT_PUBLIC_FEEDBACK_APP_URL ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Abrir panel
        </a>
      </header>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Total de reseñas"
          value={metrics.kpis.totalReviews}
          icon={MessageSquare}
          accent="bg-slate-100 text-slate-700"
        />
        <KpiCard
          label="Calificación promedio"
          value={avgRating}
          icon={Star}
          accent="bg-amber-100 text-amber-700"
        />
        <KpiCard
          label="Reportes abiertos"
          value={metrics.kpis.openReports}
          icon={AlertTriangle}
          accent="bg-red-100 text-red-700"
        />
        <KpiCard
          label="Elegibilidades pendientes"
          value={metrics.kpis.eligibilitiesPending}
          icon={Clock}
          accent="bg-blue-100 text-blue-700"
        />
      </div>

      {/* Charts row */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-slate-900">
            Distribución de calificaciones
          </h2>
          <RatingChart data={metrics.ratingDistribution} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-slate-900">
            Reseñas por estado
          </h2>
          <StatusDonut data={metrics.reviewsByStatus} />
        </div>
      </div>

      {/* Reviews over time */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-slate-900">Reseñas en el tiempo</h2>
        <ReviewsOverTimeChart data={metrics.reviewsOverTime} />
      </div>

      {/* Top sellers + top products */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 font-semibold text-slate-900">Top vendedores</h2>
          <TopTable entries={metrics.topSellers} idLabel="Vendedor" />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 font-semibold text-slate-900">Top productos</h2>
          <TopTable entries={metrics.topProducts} idLabel="Producto" />
        </div>
      </div>
    </div>
  );
}
