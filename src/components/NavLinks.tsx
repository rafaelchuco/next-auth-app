"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import UserAvatar from "@/components/UserAvatar";

export default function NavLinks() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <>
        <Link
          className="text-slate-600 transition hover:text-slate-950"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className="rounded-full bg-slate-950 px-4 py-2 text-white transition hover:bg-slate-700"
          href="/signIn"
        >
          Iniciar sesión
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        className="text-slate-600 transition hover:text-slate-950"
        href="/dashboard"
      >
        Dashboard
      </Link>
      <Link
        className="text-slate-600 transition hover:text-slate-950"
        href="/profile"
      >
        Perfil
      </Link>
      <LogoutButton />
      <UserAvatar image={session.user.image} name={session.user.name} />
    </>
  );
}
