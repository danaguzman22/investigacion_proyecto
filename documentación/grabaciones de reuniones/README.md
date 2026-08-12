# Grabaciones de reuniones

Transcripciones de las reuniones del equipo de investigacion. Son la **fuente** de
la que salen las conclusiones, los pendientes y los indicadores que estan en
`asistente-reuniones/proyecto-gamificacion/`.

## Aca va texto, no audio

Los archivos de audio y video **no se versionan** (ver `.gitignore`). El repo es
publico y compartido: un audio queda para siempre en el historial, lo descarga todo
el equipo en cada clon, y publica las voces de la reunion.

Los audios se guardan en el OneDrive del proyecto:
`OneDrive - frsr.utn.edu.ar\AA INDUSTRIAL\Gamificacion\Avance reuiniones\`

**Como se transcribe:** hay un Whisper local instalado en `C:\whisper-local`
(en la maquina de Joaquin). Transcribe sin subir el audio a ningun servicio:

```
C:\whisper-local\venv\Scripts\python.exe C:\whisper-local\transcribir.py <audio> <salida.md> medium
```

El asistente lo corre solo cuando le pasas un audio.

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
