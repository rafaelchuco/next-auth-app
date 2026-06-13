import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google OAuth 2.0",
  github: "GitHub OAuth",
  credentials: "Email / Contraseña",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signIn");
  }

  const provider = (session.user as { provider?: string }).provider ?? "credentials";
  const providerLabel = PROVIDER_LABELS[provider] ?? provider;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300 md:p-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
          Sesión activa
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Dashboard</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Bienvenido,{" "}
          <span className="font-semibold text-white">
            {session.user.name ?? session.user.email}
          </span>
          . Tu autenticación funciona correctamente.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          ["Proveedor", providerLabel],
          ["Sesión", "JWT segura"],
          ["Protección", "Servidor y proxy"],
        ].map(([label, value]) => (
          <article
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            key={label}
          >
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-xl font-bold">{value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
