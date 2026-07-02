import { type LucideIcon } from "lucide-react";

type KpiCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: string;
};

export default function KpiCard({ label, value, icon: Icon, accent }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}