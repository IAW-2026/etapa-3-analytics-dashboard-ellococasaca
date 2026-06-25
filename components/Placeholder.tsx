import { Construction } from "lucide-react";

export default function Placeholder({
  title,
  owner,
}: {
  title: string;
  owner: string;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-slate-500">Sección en construcción.</p>
      </header>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
        <Construction size={40} className="mb-4 text-slate-400" />
        <p className="font-medium text-slate-600">
          Esta sección la completa {owner}.
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Acá van las métricas de {title}.
        </p>
      </div>
    </div>
  );
}