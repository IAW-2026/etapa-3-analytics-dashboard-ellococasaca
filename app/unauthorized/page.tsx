import { UserButton } from "@clerk/nextjs";
import { ShieldOff } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-900/40">
        <ShieldOff size={32} className="text-red-400" />
      </div>
      <p className="text-sm font-semibold uppercase tracking-widest text-red-400">
        Acceso denegado
      </p>
      <h1 className="mt-3 text-3xl font-bold text-white">
        Se requiere rol admin
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
        Tu cuenta no tiene permisos para acceder al dashboard. Contactá a un
        administrador para que te asigne el rol <strong className="text-slate-300">admin</strong>.
      </p>
      <div className="mt-8">
        <UserButton />
      </div>
    </div>
  );
}
