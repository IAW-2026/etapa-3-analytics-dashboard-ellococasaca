import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Analytics Dashboard - El Loco Casaca",
  description: "Métricas y reportes del sistema completo",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="es">
        <body className={`${geist.className} bg-slate-50 text-slate-900`}>
          {userId ? (
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
          ) : (
            children
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}