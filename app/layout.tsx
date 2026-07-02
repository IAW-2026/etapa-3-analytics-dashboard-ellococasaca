import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Analytics Dashboard - El Loco Casaca",
  description: "Métricas y reportes del sistema completo",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className={`${geist.className} bg-slate-50 text-slate-900`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
