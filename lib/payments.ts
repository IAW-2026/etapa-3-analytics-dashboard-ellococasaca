export type PaymentStatus =
  | "pendiente"
  | "aprobado"
  | "rechazado"
  | "pagado";

export const STATUS_ORDER: PaymentStatus[] = [
  "pendiente",
  "aprobado",
  "pagado",
  "rechazado",
];

export const STATUS_LABELS: Record<PaymentStatus, string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  pagado: "Pagado",
};

export const STATUS_COLORS: Record<PaymentStatus, string> = {
  pendiente: "#94a3b8", // Slate
  aprobado: "#22c55e",  // Green (like DELIVERED)
  pagado: "#3b82f6",     // Blue (like IN_TRANSIT)
  rechazado: "#ef4444", // Red (like CANCELED)
};

export const STATUS_BADGE: Record<PaymentStatus, string> = {
  pendiente: "bg-slate-100 text-slate-600",
  aprobado: "bg-green-100 text-green-700",
  pagado: "bg-blue-100 text-blue-700",
  rechazado: "bg-red-100 text-red-700",
};

export type StatusDatum = {
  status: PaymentStatus;
  label: string;
  count: number;
  color: string;
};

interface RawCharge {
  id: string;
  amount: string; // From Prisma Decimal type
  status: PaymentStatus;
  created_at: string;
  buyer_id: string;
  product_id?: string | null;
  shipping_status?: string | null;
  metadata?: unknown; // Assuming Json can be anything
  charge_id_ref?: string | null;
}

interface RawPayout {
  id: string;
  amount: string; // From Prisma Decimal type
  status: PaymentStatus;
  created_at: string;
  seller_id: string;
}

export interface ProcessedCharge {
  id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  buyer_id: string;
  product_id?: string | null;
  shipping_status?: string | null;
  metadata?: unknown;
  charge_id_ref?: string | null;
  type: 'charge';
}

export interface ProcessedPayout {
  id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  seller_id: string;
  type: 'payout';
}

export type PaymentMetrics = {
  totalCharges: number;
  totalPayouts: number;
  totalTransactions: number;
  kpis: { aprobado: number; pagado: number; rechazado: number; pendiente: number };
  byStatus: StatusDatum[];
  recentCharges: ProcessedCharge[];
  recentPayouts: ProcessedPayout[];
};

type PaymentItem = ProcessedCharge | ProcessedPayout;

export async function getPaymentMetrics(): Promise<PaymentMetrics> {
  let rawCharges: RawCharge[] = [];
  let rawPayouts: RawPayout[] = [];

  try {
    const res = await fetch("https://proyecto-c-payments2-ellococasaca.vercel.app/api/analytics", { cache: "no-store" });
    if (!res.ok) {
      console.error(`Failed to fetch analytics data: ${res.status}`);
    } else {
      const data = await res.json();
      rawCharges = data.charges;
      rawPayouts = data.payouts;
    }
  } catch (error) {
    console.error("Failed to parse analytics data:", error);
  }

  const charges: ProcessedCharge[] = (rawCharges || []).map((c: RawCharge) => ({
    ...c,
    amount: parseFloat(c.amount),
    type: 'charge',
  }));
  const payouts: ProcessedPayout[] = (rawPayouts || []).map((p: RawPayout) => ({
    ...p,
    amount: parseFloat(p.amount),
    type: 'payout',
  }));

  const allTransactions: PaymentItem[] = [...charges, ...payouts];

  const counts = {} as Record<PaymentStatus, number>;
  for (const status of STATUS_ORDER) counts[status] = 0;

  for (const t of allTransactions) {
      if (t.type === 'charge') {
          counts[t.status as PaymentStatus] = (counts[t.status as PaymentStatus] ?? 0) + 1;
      } else if (t.type === 'payout') {
          const status = t.status === 'pagado' ? 'pagado' : t.status;
          counts[status as PaymentStatus] = (counts[status as PaymentStatus] ?? 0) + 1;
      }
  }



  const byStatus: StatusDatum[] = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: counts[status],
    color: STATUS_COLORS[status],
  }));

  return {
    totalCharges: charges.length,
    totalPayouts: payouts.length,
    totalTransactions: allTransactions.length,
    kpis: {
      aprobado: counts.aprobado,
      pagado: counts.pagado,
      rechazado: counts.rechazado,
      pendiente: counts.pendiente,
    },
    byStatus,
    recentCharges: charges.slice(0, 5),
    recentPayouts: payouts.slice(0, 5),
  };
}
