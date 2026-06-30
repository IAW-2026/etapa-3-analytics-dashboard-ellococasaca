import { auth } from "@clerk/nextjs/server";

const SELLER_APP_URL = process.env.SELLER_APP_URL;
const INTER_SERVICE_SECRET = process.env.INTER_SERVICE_SECRET;

type RawAnalytics = {
  success: boolean;
  rangeDays: number;
  scope: { sellerId?: string } | { global: true };

  summary: {
    totalOrders: number;
    totalRevenue: number;
    completedRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
    averageOrderValue: number;
    totalProducts: number;
    lowStockProducts: number;
    activeSellers: number;
  };

  statusBreakdown: Array<{
    status: "PENDING" | "PREPARED" | "SHIPPED" | "IN_TRANSIT" | "DELIVERED";
    count: number;
  }>;

  salesTrend: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;

  topProducts: Array<{
    id: string;
    title: string;
    unitsSold: number;
    revenue: number;
  }>;
};

export type SellerMetrics = {
  scope: RawAnalytics["scope"];

  kpis: {
    totalOrders: number;
    totalRevenue: number;
    completedRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
    averageOrderValue: number;
    totalProducts: number;
    lowStockProducts: number;
    activeSellers: number;
  };

  statusBreakdown: Array<{
    label: string;
    count: number;
    color: string;
  }>;

  salesTrend: RawAnalytics["salesTrend"];

  topProducts: RawAnalytics["topProducts"];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PREPARED: "#3b82f6",
  SHIPPED: "#8b5cf6",
  IN_TRANSIT: "#06b6d4",
  DELIVERED: "#22c55e",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PREPARED: "Preparado",
  SHIPPED: "Despachado",
  IN_TRANSIT: "En tránsito",
  DELIVERED: "Entregado",
};

export async function getSellerMetrics(
  days = 30,
  sellerId?: string
): Promise<SellerMetrics> {
  if (!SELLER_APP_URL) {
    throw new Error("Falta SELLER_APP_URL en .env");
  }

  if (!INTER_SERVICE_SECRET) {
    throw new Error("Falta INTER_SERVICE_SECRET en .env");
  }

  // 🔐 Clerk auth (usuario del dashboard)
  const { getToken } = await auth();
  const token = await getToken();

  const url = new URL(`${SELLER_APP_URL}/api/analytics`);

  url.searchParams.set("days", String(days));

  if (sellerId) {
    url.searchParams.set("sellerId", sellerId);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      // auth usuario (dashboard)
      ...(token ? { Authorization: `Bearer ${token}` } : {}),

      // auth server-to-server (API protection)
      "x-inter-service-secret": INTER_SERVICE_SECRET,
    },
    cache: "no-store",
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("[ANALYTICS_ERROR]", res.status, text);
    throw new Error(`Analytics API error (${res.status})`);
  }

  const raw: RawAnalytics = JSON.parse(text);

  if (!raw?.success) {
    throw new Error("Invalid analytics response");
  }

  return {
    scope: raw.scope,

    kpis: {
      totalOrders: raw.summary.totalOrders ?? 0,
      totalRevenue: raw.summary.totalRevenue ?? 0,
      completedRevenue: raw.summary.completedRevenue ?? 0,
      pendingOrders: raw.summary.pendingOrders ?? 0,
      deliveredOrders: raw.summary.deliveredOrders ?? 0,
      averageOrderValue: raw.summary.averageOrderValue ?? 0,
      totalProducts: raw.summary.totalProducts ?? 0,
      lowStockProducts: raw.summary.lowStockProducts ?? 0,
      activeSellers: raw.summary.activeSellers ?? 0,
    },

    statusBreakdown: raw.statusBreakdown.map((item) => ({
      label: STATUS_LABELS[item.status] ?? item.status,
      count: item.count,
      color: STATUS_COLORS[item.status] ?? "#64748b",
    })),

    salesTrend: raw.salesTrend,

    topProducts: raw.topProducts,
  };
}