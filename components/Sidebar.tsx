"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Store,
  CreditCard,
  Truck,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const generalLinks: NavLink[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
];

const appLinks: NavLink[] = [
  { href: "/shipping", label: "Shipping", icon: Truck },
  { href: "/buyer", label: "Buyer", icon: ShoppingCart },
  { href: "/seller", label: "Seller", icon: Store },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  function NavItem({ href, label, icon: Icon }: NavLink) {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          active
            ? "bg-red-600 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  }

  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-900 px-4 py-6">
      <div className="mb-8 px-3">
        <h1 className="text-lg font-bold text-white">El Loco Casaca</h1>
        <p className="text-xs text-slate-400">Analytics Dashboard</p>
      </div>

      <nav className="flex flex-1 flex-col gap-6">
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            General
          </p>
          <div className="flex flex-col gap-1">
            {generalLinks.map((link) => (
              <NavItem key={link.href} {...link} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Aplicaciones
          </p>
          <div className="flex flex-col gap-1">
            {appLinks.map((link) => (
              <NavItem key={link.href} {...link} />
            ))}
          </div>
        </div>
      </nav>

      <div className="px-3 pt-6">
        <p className="text-xs text-slate-500">IAW-2026 - Etapa 3</p>
      </div>
    </aside>
  );
}