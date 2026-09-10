import Image from "next/image";
import Link from "next/link";

import {
  LockKeyhole,
  ArrowLeft,
} from "lucide-react";

type AccessPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AccessMasterPage({
  searchParams,
}: AccessPageProps) {
  const params =
    await searchParams;

  const wrongPassword =
    params.error === "1";

  const configurationError =
    params.error === "config";

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">

      {/* FONDO */}

      <div
        className="
          fixed
          inset-0
          z-0
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage:
            "url('/fondo.png')",
        }}
      />

      <div
        className="
          fixed
          inset-0
          z-10
          bg-slate-950/45
          backdrop-blur-[2px]
        "
      />

      {/* LOGIN */}

      <section
        className="
          relative
          z-20
          w-full
          max-w-[460px]
          rounded-[28px]
          border
          border-white/50
          bg-white/[0.88]
          p-8
          shadow-[0_30px_90px_rgba(15,23,42,0.40)]
          backdrop-blur-2xl
        "
      >
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Nexus"
            width={300}
            height={110}
            priority
            className="
              h-auto
              w-[250px]
              object-contain
            "
          />
        </div>

        <div
          className="
            mt-7
            flex
            justify-center
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-[#0b3159]
              text-sky-300
              shadow-lg
            "
          >
            <LockKeyhole
              size={28}
            />
          </div>
        </div>

        <div className="mt-5 text-center">

          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-slate-500
            "
          >
            Acceso restringido
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-black
              text-[#0b3159]
            "
          >
            Panel Master
          </h1>

          <p
            className="
              mt-2
              text-sm
              leading-relaxed
              text-slate-500
            "
          >
            Ingresá la contraseña para
            administrar la simulación.
          </p>

        </div>

        {/* ERROR */}

        {wrongPassword && (
          <div
            className="
              mt-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-center
              text-sm
              font-semibold
              text-red-700
            "
          >
            Contraseña incorrecta.
          </div>
        )}

        {configurationError && (
          <div
            className="
              mt-6
              rounded-xl
              border
              border-amber-200
              bg-amber-50
              px-4
              py-3
              text-center
              text-sm
              font-semibold
              text-amber-700
            "
          >
            Falta configurar el acceso
            al Master.
          </div>
        )}

        {/* FORMULARIO */}

        <form
          action="/api/master-login"
          method="POST"
          className="mt-7"
        >
          <label
            htmlFor="password"
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.12em]
              text-slate-600
            "
          >
            Contraseña
          </label>

          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            placeholder="Ingresá la contraseña"
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4
              py-3
              text-base
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-[#0b3159]
              focus:ring-4
              focus:ring-blue-100
            "
          />

          <button
            type="submit"
            className="
              mt-5
              w-full
              rounded-xl
              bg-[#0b3159]
              px-5
              py-3
              text-sm
              font-bold
              uppercase
              tracking-[0.10em]
              text-white
              shadow-lg
              transition
              hover:bg-[#124775]
            "
          >
            Ingresar al Master
          </button>
        </form>

        <Link
          href="/"
          className="
            mt-6
            flex
            items-center
            justify-center
            gap-2
            text-sm
            font-semibold
            text-slate-500
            transition
            hover:text-[#0b3159]
          "
        >
          <ArrowLeft size={16} />

          Volver al inicio
        </Link>
      </section>
    </main>
  );
}