"use client";

import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubAvailable, setGithubAvailable] = useState(false);

  useEffect(() => {
    getProviders().then((providers) => {
      setGithubAvailable(Boolean(providers?.github));
    });
  }, []);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error.startsWith("LOCKED:")) {
        const mins = res.error.split(":")[1];
        setError(`Cuenta bloqueada por demasiados intentos. Inténtalo en ${mins} min.`);
      } else {
        setError("Email o contraseña incorrectos.");
      }
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center px-5 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Acceso seguro
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Inicia sesión</h1>
          <p className="mt-3 text-slate-600">Usa tus credenciales o un proveedor externo.</p>
        </div>

        {/* Credentials form */}
        <form onSubmit={handleCredentials} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Iniciando sesión…" : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-blue-600 hover:underline">
            Regístrate
          </Link>
        </p>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs font-medium text-slate-400">O continúa con</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        {/* OAuth buttons */}
        <div className="space-y-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <FaGoogle aria-hidden="true" />
            Continuar con Google
          </button>
          {githubAvailable && (
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              <FaGithub aria-hidden="true" />
              Continuar con GitHub
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
