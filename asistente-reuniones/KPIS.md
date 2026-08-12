# KPIS.md — Indicadores de reuniones

Definicion unica de los tres indicadores. `CLAUDE.md` y el subagente apuntan aca:
no duplicar estas formulas en otros archivos.

Los valores calculados de cada proyecto van en `<proyecto>/kpis.md`.

---

## 1. TAE — Tasa de Acuerdos Ejecutados

Mide la eficiencia del equipo para transformar las discusiones en avances reales
antes de la sesion siguiente.

```
TAE = (tareas entregadas / tareas comprometidas en la sesion anterior) x 100
```

- **Meta:** por encima del 80%.
- **Ejemplo:** se comprometieron 8 tareas y se entregaron 6 -> (6/8) x 100 = 75%.

**De donde salen los datos:** de `pendientes.md`. Para que esto sea calculable,
cada pendiente se anota con la sesion en la que se comprometio:

```
- [ ] (comprometido 06-08) Definir CRM definitivo a integrar.
```

Al cerrar la sesion, el denominador es la cantidad de pendientes con
`(comprometido <fecha de la sesion anterior>)`, y el numerador es cuantos de esos
se resolvieron en esta sesion (los que se mueven a `conclusiones.md`).

**Reglas de calculo:**
- Se cuentan solo las tareas comprometidas en la sesion **inmediatamente anterior**.
  Una tarea que viene arrastrada de tres sesiones atras sigue contando como
  comprometida en la ultima, porque se re-comprometio.
- Una tarea entregada a medias **no cuenta como entregada**. Sin fracciones.
- Si no hubo sesion anterior (primera reunion del proyecto), el TAE no existe:
  se anota `s/d` (sin dato), no 0% ni 100%.
- Se calcula por frente de trabajo y tambien un total del proyecto.

---

## 2. ROTI — Return on Time Invested

Mide la percepcion de valor de la reunion. Termometro inmediato de si la sesion
aporto o fue tiempo perdido.

```
ROTI = suma de las puntuaciones / cantidad de participantes que votaron
```

- **Meta:** promedio minimo de 4.0.
- **Ejemplo:** votos 5, 4, 4, 3, 5, 4 -> suma 25, 25/6 = 4.16.

**Escala de votacion (1 a 5), al final de la reunion:**

| Voto | Significado |
|------|-------------|
| 1 | Perdida total de tiempo. No se aprendio ni se resolvio nada. |
| 2 | Poco util. Se pudo haber resuelto con un correo. |
| 3 | Neutro. Aporto algo, pero fue demasiado larga o dispersa. |
| 4 | Buena. Se aclararon dudas y se definieron los pasos a seguir. |
| 5 | Excelente. Muy productiva, resolutiva y motivadora. |

**De donde salen los datos:** hay que **preguntarlos al cerrar la sesion**. No se
infieren del tono de la conversacion ni del animo percibido: es un dato que dan
las personas, no el agente.

**Reglas de calculo:**
- El divisor es la cantidad de personas que efectivamente votaron, no la cantidad
  de convocados.
- Se guardan los votos individuales ademas del promedio: un 4.0 con votos
  `5,5,2` no significa lo mismo que con `4,4,4`.
- Si nadie voto, se anota `s/d`. Nunca estimar.

---

## 3. RTE — Ratio de Tiempo de Enfoque

Vigila que el tiempo de reunion no se coma el tiempo real de trabajo.

```
RTE = horas-reunion totales / horas totales dedicadas al proyecto
```

Ambos numeros son **horas-persona**: una reunion de 2 h con 6 participantes son
12 horas-reunion, no 2.

- **Meta:** que las reuniones representen **menos del 15%** del tiempo total.
- **Ejemplo:** 2 h x 6 personas = 12 horas-reunion; el equipo dedico 60 horas-persona
  al proyecto esa semana -> 12/60 = 0.20, es decir 20%.

**De donde salen los datos:**
- Horas-reunion: duracion de la sesion x cantidad de participantes. El agente
  puede calcularlo si se le dice cuanto duro y cuantos hubo.
- Horas totales del proyecto: **no las puede saber el agente**. Hay que
  preguntarlas al cerrar la sesion. Es el dato mas dificil de sostener del set.

**Reglas de calculo:**
- Las horas de reunion estan **incluidas** en las horas totales del proyecto
  (el denominador es todo el tiempo dedicado, reuniones incluidas).
- Se expresa como porcentaje con un decimal.
- Si no hay dato de horas totales, se anota `s/d` y se registra igual la cantidad
  de horas-reunion, para poder calcularlo despues si aparece el dato.

---

## Regla que vale para los tres

**Nunca inventar un numero.** Si falta un dato, va `s/d` y se explica que falta.
Un KPI estimado es peor que un KPI ausente: se ve igual de confiable en la tabla
y no lo es.

Esto es la misma regla anti-sesgo del proyecto de ventas: separar HECHO (dato que
alguien reporto) de INFERENCIA (interpretacion del agente). Los KPIs son siempre
hechos reportados.
