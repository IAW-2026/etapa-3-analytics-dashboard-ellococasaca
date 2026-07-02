import { type TopEntry } from "@/lib/feedback";

type Props = {
  entries: TopEntry[];
  idLabel: string;
};

export default function TopTable({ entries, idLabel }: Props) {
  if (entries.length === 0) {
    return <p className="py-4 text-sm text-slate-400">Sin datos</p>;
  }

  return (
    <div className="divide-y divide-slate-100">
      <div className="flex items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <span>{idLabel}</span>
        <div className="flex gap-8">
          <span>Prom.</span>
          <span>Reseñas</span>
        </div>
      </div>
      {entries.map((e) => (
        <div key={e.id} className="flex items-center justify-between py-3">
          <p className="font-mono text-sm font-medium text-slate-900">{e.id}</p>
          <div className="flex items-center gap-8">
            <span className="w-12 text-right text-sm font-semibold text-amber-600">
              ★ {e.averageRating.toFixed(1)}
            </span>
            <span className="w-12 text-right text-sm text-slate-500">{e.totalReviews}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
