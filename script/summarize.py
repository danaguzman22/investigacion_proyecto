import os
import subprocess
import urllib.request
import json
from datetime import datetime

# 1. Obtener la API Key
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY no configurada.")
    exit(1)

# 2. Obtener el último commit y autor
commit_msg = subprocess.check_output(["git", "log", "-1", "--pretty=format:%s"]).decode("utf-8")
commit_author = subprocess.check_output(["git", "log", "-1", "--pretty=format:%an"]).decode("utf-8")

# 3. Obtener el diff de los cambios
try:
    git_diff = subprocess.check_output(["git", "diff", "HEAD~1", "HEAD"]).decode("utf-8", errors="ignore")
except Exception:
    git_diff = "Nuevos archivos o cambios generales agregados."

# Limitar tamaño de diff para evitar excesos
if len(git_diff) > 4000:
    git_diff = git_diff[:4000] + "\n...[diff truncado]"

# 4. Armar el Prompt para la IA
prompt = f"""
Sos un Agente Técnico de Documentación para el proyecto de investigación de Juego de Roles.
Analizá los siguientes cambios realizados en el repositorio y redactá una entrada de bitácora profesional, clara y sintética en español.

Detalles del commit:
- Mensaje: {commit_msg}
- Autor: {commit_author}
- Cambios realizados (git diff):
{git_diff}

Formato requerido (en Markdown):
- Un título representativo del avance.
- Un resumen ejecutivo (2 o 3 oraciones) de lo que se avanzó o investigó.
- Viñetas con los puntos técnicos/funcionales más destacados.

Respondé ÚNICAMENTE con el bloque Markdown listo para agregar a la bitácora.
"""

# 5. Consulta a la API de Gemini
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
payload = {
    "contents": [{"parts": [{"text": prompt}]}]
}

req = urllib.request.Request(
    url, 
    data=json.dumps(payload).encode("utf-8"), 
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode("utf-8"))
        summary = result["candidates"][0]["content"]["parts"][0]["text"]
except Exception as e:
    print(f"Error consultando a Gemini: {e}")
    exit(1)

# 6. Actualizar el archivo BITACORA.md
fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M")
nueva_entrada = f"\n\n### 📝 Registro del {fecha_actual}\n**Contribuidor:** {commit_author}\n\n{summary}\n\n---"

bitacora_path = "BITACORA.md"
if not os.path.exists(bitacora_path):
    with open(bitacora_path, "w", encoding="utf-8") as f:
        f.write("# 📑 Bitácora de Investigación y Desarrollo\n*Actualizada automáticamente por el Agente de IA*\n\n---")

with open(bitacora_path, "a", encoding="utf-8") as f:
    f.write(nueva_entrada)

print("Bitácora actualizada correctamente por la IA.")