# Grabaciones de reuniones

Transcripciones de las reuniones del equipo de investigacion. Son la **fuente** de
la que salen las conclusiones, los pendientes y los indicadores que estan en
`asistente-reuniones/proyecto-gamificacion/`.

## Como se nombran los archivos

```
AAAA-MM-DD-<tema-corto>.md
```

Ejemplos:
- `2026-08-12-alineacion-inicial.md`
- `2026-09-02-diseno-piloto-vsm.md`

La fecha va primero para que la carpeta quede ordenada cronologicamente sola.

## Que lleva adentro cada archivo

Un encabezado corto y despues la transcripcion tal cual:

```markdown
# Reunion AAAA-MM-DD — <tema>

- **Fecha:** AAAA-MM-DD
- **Duracion:** X min
- **Participantes:** N
- **Frentes tratados:** marco-teorico, piloto-vsm
- **Procesada:** si / no

---

<transcripcion>
```

El campo **Procesada** dice si el asistente ya extrajo de ahi las conclusiones y
pendientes. Sirve para no procesar dos veces lo mismo ni saltearse una.

## ESTE REPOSITORIO ES PUBLICO

Cualquiera en internet puede leer estos archivos. Una transcripcion cruda es lo mas
sensible que hay en el repo: tiene todo lo que se dijo, incluidos comentarios al
pasar.

**Antes de subir una transcripcion hay que revisarla.** No pueden quedar:

- Nombres, legajos, mails o telefonos de **estudiantes o participantes del piloto**
- Resultados individuales identificables
- Datos de salud, situacion personal o cualquier dato sensible de terceros
- Credenciales, claves de API, links privados
- Comentarios sobre personas que no esten en la reunion

**Como se resuelve:** reemplazar por rol o inicial — "Estudiante 1", "la docente de
la catedra", "E.G." — en vez de borrar la linea entera, para que la transcripcion
siga siendo legible.

Los nombres de los **integrantes del equipo** pueden quedar: son autores del
proyecto y ya figuran en el historial del repo.
