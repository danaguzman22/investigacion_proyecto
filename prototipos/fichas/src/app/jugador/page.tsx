import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  getFicha,
  type RoleId,
} from "@/lib/fichas";

import {
  PLAYER_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

const roleStyles: Record<
  RoleId,
  {
    emoji: string;
    border: string;
    accent: string;
    badge: string;
  }
> = {
  buho: {
    emoji: "🦉",
    border: "border-blue-500/40",
    accent: "text-blue-300",
    badge: "bg-blue-500/15 text-blue-200",
  },

  zorro: {
    emoji: "🦊",
    border: "border-orange-500/40",
    accent: "text-orange-300",
    badge: "bg-orange-500/15 text-orange-200",
  },

  castor: {
    emoji: "🦫",
    border: "border-emerald-500/40",
    accent: "text-emerald-300",
    badge: "bg-emerald-500/15 text-emerald-200",
  },

  toro: {
    emoji: "🐂",
    border: "border-red-500/40",
    accent: "text-red-300",
    badge: "bg-red-500/15 text-red-200",
  },

  ardilla: {
    emoji: "🐿️",
    border: "border-amber-500/40",
    accent: "text-amber-300",
    badge: "bg-amber-500/15 text-amber-200",
  },
};

export default async function JugadorPage() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore
      .get(PLAYER_COOKIE_NAME)
      ?.value;

  const role =
    verifySessionToken(token);

  /*
   * Si no existe una sesión válida,
   * el jugador vuelve al acceso.
   */
  if (!role) {
    redirect("/acceso");
  }

  /*
   * El servidor obtiene únicamente
   * la ficha correspondiente al rol.
   */
  const ficha =
    getFicha(role);

  if (!ficha) {
    redirect("/acceso");
  }

  const style =
    roleStyles[role];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto w-full max-w-md">

        {/* ENCABEZADO */}

        <header className="mb-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">
            NEXUS
          </p>

          <p className="mt-4 text-6xl">
            {style.emoji}
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase tracking-tight">
            {ficha.personaje}
          </h1>

          <div
            className={`
              mx-auto
              mt-2
              inline-flex
              rounded-full
              px-4
              py-1.5
              text-xs
              font-black
              uppercase
              tracking-widest
              ${style.badge}
            `}
          >
            {ficha.area}
          </div>
        </header>

        {/* FICHA */}

        <section
          className={`
            overflow-hidden
            rounded-3xl
            border
            bg-slate-900
            shadow-2xl
            ${style.border}
          `}
        >

          {/* DESCRIPCIÓN */}

          <div className="border-b border-white/10 p-5">
            <p
              className={`
                mb-2
                text-xs
                font-black
                uppercase
                tracking-widest
                ${style.accent}
              `}
            >
              Tu rol
            </p>

            <p className="text-sm leading-6 text-slate-300">
              {ficha.descripcion}
            </p>
          </div>

          {/* RESPONSABILIDADES */}

          <div className="border-b border-white/10 p-5">
            <p
              className={`
                mb-4
                text-xs
                font-black
                uppercase
                tracking-widest
                ${style.accent}
              `}
            >
              Responsabilidades
            </p>

            <div className="space-y-3">
              {ficha.responsabilidades.map(
                (responsabilidad) => (
                  <div
                    key={responsabilidad}
                    className="flex gap-3"
                  >
                    <span
                      className={`
                        mt-0.5
                        font-black
                        ${style.accent}
                      `}
                    >
                      •
                    </span>

                    <p className="text-sm leading-5 text-slate-300">
                      {responsabilidad}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* FOCO */}

          <div className="border-b border-white/10 p-5">
            <p
              className={`
                mb-4
                text-xs
                font-black
                uppercase
                tracking-widest
                ${style.accent}
              `}
            >
              Prestá atención a
            </p>

            <div className="flex flex-wrap gap-2">
              {ficha.foco.map(
                (item) => (
                  <span
                    key={item}
                    className="
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.05]
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-slate-300
                    "
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          {/* FORMA DE PENSAR */}

          <div className="border-b border-white/10 p-5">
            <p
              className={`
                mb-3
                text-xs
                font-black
                uppercase
                tracking-widest
                ${style.accent}
              `}
            >
              Tu mirada
            </p>

            <p className="text-sm italic leading-6 text-slate-300">
              “{ficha.estilo}”
            </p>
          </div>

          {/* INFORMACIÓN PRIVADA */}

{(
  ficha.motivacion ||
  ficha.objetivoSecreto ||
  ficha.restriccion ||
  (ficha.informacionPrivada &&
    ficha.informacionPrivada.length > 0)
) && (
  <div className="border-b border-white/10 p-5">
    <div className="mb-4 flex items-center justify-between">
      <p
        className={`
          text-xs
          font-black
          uppercase
          tracking-widest
          ${style.accent}
        `}
      >
        Información privada
      </p>

      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
        Solo vos
      </span>
    </div>

    <div className="space-y-4">

      {ficha.motivacion && (
        <div className="rounded-2xl bg-white/[0.05] p-4">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            Motivación
          </p>

          <p className="text-sm leading-6 text-slate-200">
            {ficha.motivacion}
          </p>
        </div>
      )}

      {ficha.objetivoSecreto && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] p-4">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-amber-300">
            Objetivo secreto
          </p>

          <p className="text-sm leading-6 text-slate-200">
            {ficha.objetivoSecreto}
          </p>
        </div>
      )}

      {ficha.restriccion && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.07] p-4">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-300">
            Restricción
          </p>

          <p className="text-sm leading-6 text-slate-200">
            {ficha.restriccion}
          </p>
        </div>
      )}

      {ficha.informacionPrivada &&
        ficha.informacionPrivada.length > 0 && (
          <div className="rounded-2xl bg-white/[0.05] p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Información que solo vos conocés
            </p>

            <div className="space-y-2">
              {ficha.informacionPrivada.map(
                (informacion) => (
                  <div
                    key={informacion}
                    className="flex gap-3"
                  >
                    <span className={style.accent}>
                      •
                    </span>

                    <p className="text-sm leading-5 text-slate-300">
                      {informacion}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

    </div>
  </div>
)}

          {/* ATRIBUTOS */}

          <div className="p-5">
            <p
              className={`
                mb-4
                text-xs
                font-black
                uppercase
                tracking-widest
                ${style.accent}
              `}
            >
              Atributos
            </p>

            <div className="space-y-3">
              {ficha.atributos.map(
                (atributo) => (
                  <div
                    key={atributo.nombre}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      bg-white/[0.05]
                      px-4
                      py-3
                    "
                  >
                    <span className="text-sm font-semibold text-slate-300">
                      {atributo.nombre}
                    </span>

                    <span
                      className={`
                        text-xl
                        font-black
                        ${style.accent}
                      `}
                    >
                      +{atributo.valor}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

        </section>

          <form
            action="/api/logout"
            method="POST"
            className="mt-6"
            >
            <button
                type="submit"
                className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.05]
                px-5
                py-4
                text-sm
                font-bold
                text-slate-300
                transition
                hover:bg-white/[0.10]
                hover:text-white
                active:scale-[0.98]
                "
            >
                Salir / Cambiar jugador
            </button>
            </form>

                    <p className="mt-5 text-center text-[10px] uppercase tracking-widest text-slate-600">
                        Información privada de tu rol
        </p>
      </div>
    </main>
  );
}