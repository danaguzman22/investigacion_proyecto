# Asistente de reuniones

Sistema de memoria de reuniones del proyecto de investigacion. Cada sesion de trabajo
deja registradas sus conclusiones y pendientes, y cada sesion nueva arranca con un
resumen del estado.

Vive dentro del repo del equipo, en su propia subcarpeta. **No toca la raiz**:
`BITACORA.md`, `README.md`, `script/` y `.github/` son del equipo y de su agente
automatico de documentacion.

## Como usarlo

Abrir Claude Code parado en esta carpeta y pedirle que arranque o cierre una sesion:

```
arranca sesion de proyecto-gamificacion
```

Al terminar la reunion, decirle **"cerra la sesion"**. Ahi escribe los archivos,
muestra lo que anoto para validar, y recien despues lo sube.

## Estructura

```
CLAUDE.md                      reglas generales del asistente
KPIS.md                        definicion de TAE, ROTI y RTE
.claude/agents/                definicion del subagente
proyecto-gamificacion/
  CLAUDE-proyecto.md           contexto del proyecto de investigacion
  kpis.md                      valores de los indicadores, una fila por sesion
  <frente-de-trabajo>/
    conclusiones.md            hechos y decisiones tomadas (acumulativo)
    pendientes.md              tareas y preguntas abiertas
    log-sesiones.md            resumen de 3-5 lineas por sesion
```

## Frentes de trabajo

- `marco-teorico/` — revision de literatura, hipotesis, diseno metodologico
- `piloto-vsm/` — Piloto 1 (escenario METANOR S.A.), instrumentos y mediciones
- `plataforma-ia/` — arquitectura del juego, modulos de IA, prototipo virtual
- `beca-y-entregables/` — informes de avance, cronograma, compromisos con la beca

## Convenciones

- Se distingue siempre CONCLUSION (decidido) de PENDIENTE (abierto).
- Cada entrada lleva fecha y fuente.
- No se borra historial: lo obsoleto se marca `[superado]`.
- Una sesion cerrada = un commit.

## Este repositorio es publico

Cualquiera puede leerlo. **No registrar datos personales de estudiantes o
participantes, resultados individuales identificables, ni credenciales.** Los datos
de investigacion van agregados y anonimizados.
