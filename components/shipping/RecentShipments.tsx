import { type Shipment, STATUS_LABELS, STATUS_BADGE } from "@/lib/shipping";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "recién";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

export default function RecentShipments({ shipments }: { shipments: Shipment[] }) {
  return (
    <div className="divide-y divide-slate-100">
      {shipments.map((s) => (
        <div key={s.id} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-slate-900">{s.orderId}</p>
            <p className="text-xs text-slate-400">{s.trackingCode}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[s.status]}`}>
              {STATUS_LABELS[s.status]}
            </span>
            <span className="text-xs text-slate-400">{timeAgo(s.updatedAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}