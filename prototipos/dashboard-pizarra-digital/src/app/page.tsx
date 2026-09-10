import Image from "next/image";
import Link from "next/link";

import {
  ExternalLink,
  LockKeyhole,
  Monitor,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">

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
          bg-slate-950/35
          backdrop-blur-[2px]
        "
      />

      {/* CONTENIDO */}

      <div
        className="
          relative
          z-20
          flex
          min-h-screen
          items-center
          justify-center
          px-6
          py-10
        "
      >
        <section
          className="
            w-full
            max-w-5xl
            overflow-hidden
            rounded-[28px]
            border
            border-white/50
            bg-white/[0.84]
            shadow-[0_30px_90px_rgba(15,23,42,0.35)]
            backdrop-blur-2xl
          "
        >
          {/* CABECERA */}

          <div
            className="
              border-b
              border-slate-200/80
              px-8
              pb-7
              pt-9
              text-center
            "
          >
            <Image
              src="/logo.png"
              alt="Nexus"
              width={360}
              height={130}
              priority
              className="
                mx-auto
                h-auto
                w-[300px]
                object-contain
              "
            />

            <div
              className="
                mt-5
                flex
                flex-wrap
                items-center
                justify-center
                gap-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-slate-500
              "
            >
              <span>Analiza</span>
              <span>|</span>

              <span>Decide</span>
              <span>|</span>

              <span>Ejecuta</span>
              <span>|</span>

              <span>Evoluciona</span>
            </div>

            <h1
              className="
                mt-6
                text-3xl
                font-black
                text-[#0b3159]
                md:text-4xl
              "
            >
              Tablero de simulación
            </h1>

            <p
              className="
                mx-auto
                mt-3
                max-w-xl
                text-slate-600
              "
            >
              Seleccioná la vista que
              querés utilizar.
            </p>
          </div>

          {/* OPCIONES */}

          <div
            className="
              grid
              gap-5
              p-7
              md:grid-cols-2
              md:p-9
            "
          >
            {/* MASTER */}

            <Link
              href="/master"
              className="
                group
                rounded-2xl
                bg-[#0b3159]
                p-7
                text-white
                shadow-xl
                transition
                hover:-translate-y-1
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/10
                    text-sky-300
                  "
                >
                  <LockKeyhole
                    size={30}
                  />
                </div>

                <ExternalLink
                  size={20}
                  className="text-white/40"
                />
              </div>

              <p
                className="
                  mt-7
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.20em]
                  text-blue-200
                "
              >
                Acceso restringido
              </p>

              <h2
                className="
                  mt-2
                  text-3xl
                  font-black
                "
              >
                Master
              </h2>

              <p
                className="
                  mt-3
                  text-sm
                  leading-relaxed
                  text-blue-100/80
                "
              >
                Controlá la partida,
                indicadores, metas,
                semanas y temporizador.
              </p>

              <p
                className="
                  mt-7
                  font-bold
                  text-sky-300
                "
              >
                Abrir Master →
              </p>
            </Link>

            {/* DISPLAY */}

            <Link
              href="/display"
              className="
                group
                rounded-2xl
                border
                border-white/60
                bg-white/70
                p-7
                shadow-xl
                backdrop-blur-xl
                transition
                hover:-translate-y-1
                hover:bg-white/90
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#0b3159]/10
                    text-[#0b3159]
                  "
                >
                  <Monitor
                    size={30}
                  />
                </div>

                <ExternalLink
                  size={20}
                  className="text-slate-400"
                />
              </div>

              <p
                className="
                  mt-7
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.20em]
                  text-slate-500
                "
              >
                Vista pública
              </p>

              <h2
                className="
                  mt-2
                  text-3xl
                  font-black
                  text-[#0b3159]
                "
              >
                Display
              </h2>

              <p
                className="
                  mt-3
                  text-sm
                  leading-relaxed
                  text-slate-600
                "
              >
                Visualizá indicadores,
                metas, evolución y
                resultados de la partida.
              </p>

              <p
                className="
                  mt-7
                  font-bold
                  text-[#0b3159]
                "
              >
                Abrir Display →
              </p>
            </Link>
          </div>

          {/* FOOTER */}

          <footer
            className="
              flex
              flex-wrap
              items-center
              justify-between
              gap-3
              border-t
              border-slate-200/80
              px-8
              py-4
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.20em]
              text-slate-500
            "
          >
            <span>
              NEXUS | Simulación empresarial
            </span>

            <span>
              Personas | Procesos | Resultados
            </span>
          </footer>
        </section>
      </div>
    </main>
  );
}