const PAYMENTS_APP_URL = process.env.PAYMENTS_APP_URL;

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
  pendiente: "#94a3b8",
  aprobado: "#22c55e",
  pagado: "#3b82f6",
  rechazado: "#ef4444",
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

export type PaymentTypeDatum = {
  name: string;
  value: number;
  color: string;
};

interface RawCharge {
  id: string;
  amount: string;
  status: PaymentStatus;
  created_at: string;
  buyer_id: string;
  product_id?: string | null;
  shipping_status?: string | null;
  metadata?: unknown;
  charge_id_ref?: string | null;
}

interface RawPayout {
  id: string;
  amount: string;
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
  totalChargeAmount: number;
  totalPayoutAmount: number;
  totalProcessedAmount: number;
  avgChargeAmount: number;
  avgPayoutAmount: number;
  kpis: { aprobado: number; pagado: number; rechazado: number; pendiente: number };
  byStatus: StatusDatum[];
  typeBreakdown: PaymentTypeDatum[];
  recentCharges: ProcessedCharge[];
  recentPayouts: ProcessedPayout[];
};

type PaymentItem = ProcessedCharge | ProcessedPayout;

export async function getPaymentMetrics(): Promise<PaymentMetrics> {
  let rawCharges: RawCharge[] = [];
  let rawPayouts: RawPayout[] = [];

  if (!PAYMENTS_APP_URL) {
    throw new Error("Falta la variable de entorno PAYMENTS_APP_URL");
  }

  try {
    const res = await fetch(`${PAYMENTS_APP_URL}/api/analytics`, {
      cache: "no-store",
      headers: {
        "x-inter-service-secret": process.env.INTER_SERVICE_SECRET || "",
      },
    });
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
    counts[t.status as PaymentStatus] = (counts[t.status as PaymentStatus] ?? 0) + 1;
  }

  const totalChargeAmount = charges.reduce((sum, charge) => sum + charge.amount, 0);
  const totalPayoutAmount = payouts.reduce((sum, payout) => sum + payout.amount, 0);
  const totalProcessedAmount = totalChargeAmount + totalPayoutAmount;

  const byStatus: StatusDatum[] = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: counts[status],
    color: STATUS_COLORS[status],
  }));

  const typeBreakdown: PaymentTypeDatum[] = [
    { name: 'Cargos', value: charges.length, color: '#3b82f6' },
    { name: 'Pagos', value: payouts.length, color: '#10b981' },
  ];

  return {
    totalCharges: charges.length,
    totalPayouts: payouts.length,
    totalTransactions: allTransactions.length,
    totalChargeAmount,
    totalPayoutAmount,
    totalProcessedAmount,
    avgChargeAmount: charges.length ? totalChargeAmount / charges.length : 0,
    avgPayoutAmount: payouts.length ? totalPayoutAmount / payouts.length : 0,
    kpis: {
      aprobado: counts.aprobado,
      pagado: counts.pagado,
      rechazado: counts.rechazado,
      pendiente: counts.pendiente,
    },
    byStatus,
    typeBreakdown,
    recentCharges: charges.slice(0, 5),
    recentPayouts: payouts.slice(0, 5),
  };
}
