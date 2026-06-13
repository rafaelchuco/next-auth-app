import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import NavLinks from "@/components/NavLinks";
import SessionProvider from "@/components/SessionProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Auth App",
  description: "Autenticación segura con Google y NextAuth",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased">
        <SessionProvider session={session}>
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
            <nav className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-6 px-5">
              <Link className="text-lg font-bold tracking-tight" href="/">
                Next Auth App
              </Link>

              <div className="flex items-center gap-5 text-sm font-medium">
                <NavLinks />
              </div>
            </nav>
          </header>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
