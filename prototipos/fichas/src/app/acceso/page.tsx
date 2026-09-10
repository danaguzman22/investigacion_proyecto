type AccessPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AccessPage({
  searchParams,
}: AccessPageProps) {
  const params = await searchParams;

  const error = params.error;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-10 text-white">
      <div className="w-full max-w-md">
        {/* ENCABEZADO */}

        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            NEXUS
          </p>

          <h1 className="text-4xl font-black tracking-tight">
            Tu ficha
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Identificate para acceder a la información
            correspondiente a tu rol.
          </p>
        </div>

        {/* TARJETA */}

        <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
          <form
            action="/api/login"
            method="POST"
            className="space-y-5"
          >
            {/* USUARIO */}

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-bold text-slate-200"
              >
                Usuario
              </label>

              <input
                id="username"
                name="username"
                type="text"
                required
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="username"
                placeholder="Ej: toro"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-slate-900
                  px-4
                  py-4
                  text-base
                  text-white
                  outline-none
                  transition
                  placeholder:text-slate-600
                  focus:border-sky-500
                  focus:ring-2
                  focus:ring-sky-500/20
                "
              />
            </div>

            {/* CONTRASEÑA */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-slate-200"
              >
                Contraseña
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Ingresá tu contraseña"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-slate-900
                  px-4
                  py-4
                  text-base
                  text-white
                  outline-none
                  transition
                  placeholder:text-slate-600
                  focus:border-sky-500
                  focus:ring-2
                  focus:ring-sky-500/20
                "
              />
            </div>

            {/* ERRORES */}

            {error === "1" && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                Usuario o contraseña incorrectos.
              </div>
            )}

            {error === "config" && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                No se pudo iniciar sesión. Revisá la
                configuración del sistema.
              </div>
            )}

            {/* BOTÓN */}

            <button
              type="submit"
              className="
                w-full
                rounded-2xl
                bg-white
                px-5
                py-4
                text-base
                font-black
                text-slate-950
                transition
                hover:bg-slate-200
                active:scale-[0.98]
              "
            >
              Ingresar a mi ficha
            </button>
          </form>
        </section>

        {/* ROLES */}

        <div className="mt-7 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-600">
            Dirección · Comercial · Ingeniería
          </p>

          <p className="mt-1 text-xs uppercase tracking-widest text-slate-600">
            Producción · Finanzas
          </p>
        </div>
      </div>
    </main>
  );
}