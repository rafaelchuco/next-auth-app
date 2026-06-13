"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
      onClick={() => signOut({ callbackUrl: "/signIn" })}
      type="button"
    >
      Cerrar sesión
    </button>
  );
}
