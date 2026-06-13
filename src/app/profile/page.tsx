import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signIn");
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 md:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <UserAvatar
            image={session.user.image}
            name={session.user.name}
            size={96}
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Cuenta de Google
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Perfil</h1>
          </div>
        </div>

        <dl className="mt-10 grid gap-5">
          <div className="rounded-2xl bg-slate-50 p-5">
            <dt className="text-sm font-medium text-slate-500">Nombre</dt>
            <dd className="mt-1 text-lg font-semibold">
              {session.user.name ?? "No disponible"}
            </dd>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <dt className="text-sm font-medium text-slate-500">
              Correo electrónico
            </dt>
            <dd className="mt-1 break-all text-lg font-semibold">
              {session.user.email ?? "No disponible"}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
