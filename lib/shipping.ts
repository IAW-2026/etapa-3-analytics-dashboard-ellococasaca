export type ShipmentStatus =
  | "PENDING"
  | "PREPARING"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELED";

export type Shipment = {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  status: ShipmentStatus;
  trackingCode: string;
  estimatedDelivery: string;
  updatedAt: string;
};

type ShipmentsResponse = {
  data: Shipment[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const STATUS_ORDER: ShipmentStatus[] = [
  "PENDING",
  "PREPARING",
  "SHIPPED",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELED",
];

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  PENDING: "Pendiente",
  PREPARING: "Preparando",
  SHIPPED: "Despachado",
  IN_TRANSIT: "En tránsito",
  DELIVERED: "Entregado",
  CANCELED: "Cancelado",
};

export const STATUS_COLORS: Record<ShipmentStatus, string> = {
  PENDING: "#94a3b8",
  PREPARING: "#facc15",
  SHIPPED: "#38bdf8",
  IN_TRANSIT: "#3b82f6",
  DELIVERED: "#22c55e",
  CANCELED: "#ef4444",
};


export const STATUS_BADGE: Record<ShipmentStatus, string> = {
  PENDING: "bg-slate-100 text-slate-600",
  PREPARING: "bg-yellow-100 text-yellow-700",
  SHIPPED: "bg-sky-100 text-sky-700",
  IN_TRANSIT: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELED: "bg-red-100 text-red-700",
};

const API_URL = process.env.SHIPPING_API_URL;

async function fetchPage(page: number): Promise<ShipmentsResponse> {
  const res = await fetch(`${API_URL}/api/shipments?page=${page}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    throw new Error(`La API de Shipping respondió ${res.status}`);
  }
  return res.json();
}

async function fetchAllShipments(): Promise<Shipment[]> {
  if (!API_URL) {
    throw new Error("Falta la variable de entorno SHIPPING_API_URL");
  }

  const first = await fetchPage(1);
  const all = [...first.data];

  for (let page = 2; page <= first.totalPages; page++) {
    const next = await fetchPage(page);
    all.push(...next.data);
  }

  const unique = new Map(all.map((s) => [s.id, s]));
  const result = Array.from(unique.values());

  if (result.length < first.total) {
    console.warn(
      `[SHIPPING] Traje ${result.length} de ${first.total} envíos. ` +
        `Revisá que el endpoint respete el parámetro ?page.`
    );
  }

  return result;
}

export type StatusDatum = {
  status: ShipmentStatus;
  label: string;
  count: number;
  color: string;
};

export type ShippingMetrics = {
  total: number;
  kpis: { delivered: number; inTransit: number; canceled: number; pending: number };
  byStatus: StatusDatum[];
  recent: Shipment[];
};

export async function getShippingMetrics(): Promise<ShippingMetrics> {
  const shipments = await fetchAllShipments();

  const counts = {} as Record<ShipmentStatus, number>;
  for (const status of STATUS_ORDER) counts[status] = 0;
  for (const s of shipments) counts[s.status] = (counts[s.status] ?? 0) + 1;

  const byStatus: StatusDatum[] = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: counts[status],
    color: STATUS_COLORS[status],
  }));

  return {
    total: shipments.length,
    kpis: {
      delivered: counts.DELIVERED,
      inTransit: counts.IN_TRANSIT,
      canceled: counts.CANCELED,
      pending: counts.PENDING,
    },
    byStatus,
    recent: shipments.slice(0, 5),
  };
}