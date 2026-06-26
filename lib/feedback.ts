import { auth } from "@clerk/nextjs/server";

const FEEDBACK_APP_URL = process.env.FEEDBACK_APP_URL;

type RawAnalytics = {
  reviews?: {
    total?: number;
    byStatus?: {
      PUBLISHED?: number;
      HIDDEN?: number;
      DELETED?: number;
      PENDING?: number;
    };
    moderated?: number;
    last7Days?: number;
    last30Days?: number;
    averageRating?: number;
    ratingDistribution?: {
      1?: number;
      2?: number;
      3?: number;
      4?: number;
      5?: number;
    };
  };
  reports?: {
    total?: number;
    byStatus?: { OPEN?: number; RESOLVED?: number; DISMISSED?: number };
    last7Days?: number;
    last30Days?: number;
  };
  eligibilities?: {
    total?: number;
    consumed?: number;
    pending?: number;
  };
  topSellers?: Array<{
    sellerId?: string;
    averageRating?: number;
    totalReviews?: number;
  }>;
  topProducts?: Array<{
    productId?: string;
    averageRating?: number;
    totalReviews?: number;
  }>;
  reviewsOverTime?: Array<{ date?: string; count?: number }>;
};

export type RatingDatum = { star: number; count: number; color: string };
export type StatusDatum = { label: string; count: number; color: string };
export type TopEntry = { id: string; averageRating: number; totalReviews: number };
export type TimeEntry = { date: string; count: number };

export type FeedbackMetrics = {
  kpis: {
    totalReviews: number;
    averageRating: number;
    openReports: number;
    eligibilitiesPending: number;
  };
  ratingDistribution: RatingDatum[];
  reviewsByStatus: StatusDatum[];
  reportsByStatus: StatusDatum[];
  topSellers: TopEntry[];
  topProducts: TopEntry[];
  reviewsOverTime: TimeEntry[];
};

const RATING_COLORS: Record<number, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#facc15",
  4: "#84cc16",
  5: "#22c55e",
};

export async function getFeedbackMetrics(): Promise<FeedbackMetrics> {
  if (!FEEDBACK_APP_URL) {
    throw new Error("Falta la variable de entorno FEEDBACK_APP_URL");
  }

  const { getToken } = await auth();
  const token = await getToken();

  const res = await fetch(`${FEEDBACK_APP_URL}/api/analytics`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`La API de Feedback respondió ${res.status}`);
  }

  const raw: RawAnalytics = await res.json();

  const reviews = raw.reviews ?? {};
  const reports = raw.reports ?? {};
  const eligibilities = raw.eligibilities ?? {};
  const byStatusReviews = reviews.byStatus ?? {};
  const byStatusReports = reports.byStatus ?? {};
  const ratingDist = (reviews.ratingDistribution ?? {}) as Record<number, number>;

  const ratingDistribution: RatingDatum[] = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: ratingDist[star] ?? 0,
    color: RATING_COLORS[star],
  }));

  const reviewsByStatus: StatusDatum[] = [
    { label: "Publicada", count: byStatusReviews.PUBLISHED ?? 0, color: "#22c55e" },
    { label: "Pendiente", count: byStatusReviews.PENDING ?? 0, color: "#facc15" },
    { label: "Oculta", count: byStatusReviews.HIDDEN ?? 0, color: "#94a3b8" },
    { label: "Eliminada", count: byStatusReviews.DELETED ?? 0, color: "#ef4444" },
  ];

  const reportsByStatus: StatusDatum[] = [
    { label: "Abierto", count: byStatusReports.OPEN ?? 0, color: "#ef4444" },
    { label: "Resuelto", count: byStatusReports.RESOLVED ?? 0, color: "#22c55e" },
    { label: "Descartado", count: byStatusReports.DISMISSED ?? 0, color: "#94a3b8" },
  ];

  const topSellers: TopEntry[] = (raw.topSellers ?? []).map((s) => ({
    id: s.sellerId ?? "—",
    averageRating: s.averageRating ?? 0,
    totalReviews: s.totalReviews ?? 0,
  }));

  const topProducts: TopEntry[] = (raw.topProducts ?? []).map((p) => ({
    id: p.productId ?? "—",
    averageRating: p.averageRating ?? 0,
    totalReviews: p.totalReviews ?? 0,
  }));

  const reviewsOverTime: TimeEntry[] = (raw.reviewsOverTime ?? []).map((r) => ({
    date: r.date ?? "",
    count: r.count ?? 0,
  }));

  return {
    kpis: {
      totalReviews: reviews.total ?? 0,
      averageRating: reviews.averageRating ?? 0,
      openReports: byStatusReports.OPEN ?? 0,
      eligibilitiesPending: eligibilities.pending ?? 0,
    },
    ratingDistribution,
    reviewsByStatus,
    reportsByStatus,
    topSellers,
    topProducts,
    reviewsOverTime,
  };
}
