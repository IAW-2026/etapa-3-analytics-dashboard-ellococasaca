import Link from "next/link";
import {
  Truck,
  ShoppingCart,
  Store,
  CreditCard,
  MessageSquare,
} from "lucide-react";

const sections = [
  { href: "/shipping", label: "Shipping", desc: "Envíos y tracking", icon: Truck, live: true },
  { href: "/buyer", label: "Buyer", desc: "Compradores y pedidos", icon: ShoppingCart, live: false },
  { href: "/seller", label: "Seller", desc: "Vendedores y catálogo", icon: Store, live: false },
  { href: "/payments", label: "Payments", desc: "Pagos y payouts", icon: CreditCard, live: true },
  { href: "/feedback", label: "Feedback", desc: "Reseñas y calificaciones", icon: MessageSquare, live: true },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard general</h1>
        <p className="mt-1 text-slate-500">
          Métricas consolidadas del sistema El Loco Casaca.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ href, label, desc, icon: Icon, live }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-red-50 group-hover:text-red-600">
                <Icon size={20} />
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  live ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {live ? "Conectado" : "Pendiente"}
              </span>
            </div>
            <h2 className="font-semibold text-slate-900">{label}</h2>
            <p className="text-sm text-slate-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}