import { auth } from "@clerk/nextjs/server";

const BUYER_APP_URL = process.env.BUYER_APP_URL;
const INTER_SERVICE_SECRET = process.env.INTER_SERVICE_SECRET;

export type BuyerRecent = {
  clerkId: string;
  email: string;
  name: string;
  createdAt: string;
};

export type OrderRecent = {
  id: string;
  externalOrderId: string;
  userId: string;
  cartId: string;
  status: "PENDING" | "PAID" | "REJECTED";
  totalAmount: number;
  trackingId: string | null;
  createdAt: string;
};

export type BuyerMetrics = {
  buyers: {
    total: number;
    recent: BuyerRecent[];
  };
  carts: {
    total: number;
    active: number;
    totalItemsInActive: number;
  };
  orders: {
    total: number;
    volume: number;
    byStatus: {
      PENDING: number;
      PAID: number;
      REJECTED: number;
    };
    recent: OrderRecent[];
  };
};

export async function getBuyerMetrics(): Promise<BuyerMetrics> {
  if (!BUYER_APP_URL) {
    throw new Error("Falta la variable de entorno BUYER_APP_URL");
  }

  if (!INTER_SERVICE_SECRET) {
    throw new Error("Falta la variable de entorno INTER_SERVICE_SECRET");
  }

  // 🔐 Clerk auth (usuario del dashboard)
  const { getToken } = await auth();
  const token = await getToken();

  const url = `${BUYER_APP_URL}/api/analytics`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      // auth usuario (dashboard)
      ...(token ? { Authorization: `Bearer ${token}` } : {}),

      // auth server-to-server (API protection)
      "x-inter-service-secret": INTER_SERVICE_SECRET,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[BUYER_ANALYTICS_ERROR]", res.status, text);
    throw new Error(`Buyer Analytics API error (${res.status})`);
  }

  return res.json();
}
