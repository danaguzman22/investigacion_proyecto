import json
import os
import re
import subprocess
import urllib.request
from datetime import datetime

# 1. Obtener Variables de Entorno
groq_key = os.environ.get("GROQ_API_KEY")
clickup_key = os.environ.get("CLICKUP_API_KEY")

if not groq_key:
    print("Error: GROQ_API_KEY no configurada.")
    exit(1)

# 2. Obtener datos de Git
try:
    commit_msg = subprocess.check_output(
        ["git", "log", "-1", "--pretty=format:%s"]
    ).decode("utf-8")
    commit_author = subprocess.check_output(
        ["git", "log", "-1", "--pretty=format:%an"]
    ).decode("utf-8")
    git_diff = subprocess.check_output(
        ["git", "diff", "HEAD~1", "HEAD"]
    ).decode("utf-8")
except Exception:
    commit_msg = "Actualización de archivos"
    commit_author = "Colaborador"
    git_diff = "Cambios generales en el proyecto."

if len(git_diff) > 1000:
    git_diff = git_diff[:1000] + "\n...[diff truncado]"

# 3. Consulta a Groq API
url_groq = "https://api.groq.com/openai/v1/chat/completions"
headers_groq = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {groq_key}",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
}

prompt = (
    "Genera un resumen técnico ultra corto (máximo 2 oraciones) en español para una bitácora de desarrollo. "
    f"Autor: {commit_author}\nMensaje de commit: {commit_msg}\nCambios:\n{git_diff}"
)

payload_groq = {
    "messages": [{"role": "user", "content": prompt}],
    "model": "llama-3.3-70b-versatile",
}

req_groq = urllib.request.Request(
    url_groq,
    data=json.dumps(payload_groq).encode("utf-8"),
    headers=headers_groq,
    method="POST",
)

try:
    with urllib.request.urlopen(req_groq) as response:
        result = json.loads(response.read().decode("utf-8"))
        resumen = result["choices"][0]["message"]["content"].strip()
except Exception as e:
    print(f"Error consultando la IA: {e}")
    exit(1)

# 4. Escribir en BITACORA.md
fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
entrada = (
    f"### [{fecha}] - {commit_msg}\n**Autor:** {commit_author}\n\n{resumen}\n\n---\n"
)

try:
    with open("BITACORA.md", "a", encoding="utf-8") as f:
        f.write(entrada)
    print("BITACORA.md actualizada exitosamente.")
except Exception as e:
    print(f"Error al escribir en BITACORA.md: {e}")
    exit(1)

# 5. Actualizar la Descripción en ClickUp (si hay ID en el commit)
match = re.search(r"#([a-zA-Z0-9]+)", commit_msg)
if match and clickup_key:
    task_id = match.group(1)
    url_clickup = f"https://api.clickup.com/api/v2/task/{task_id}"
    headers_clickup = {
        "Content-Type": "application/json",
        "Authorization": clickup_key,
    }

    # Asigna la descripción formateada
    desc_texto = (
        f"**Última actualización de desarrollo:**\n\n"
        f"{resumen}\n\n"
        f"--- \n*Registrado por IA el {fecha} ({commit_author})*"
    )

    payload_clickup = {"markdown_description": desc_texto}

    req_clickup = urllib.request.Request(
        url_clickup,
        data=json.dumps(payload_clickup).encode("utf-8"),
        headers=headers_clickup,
        method="PUT",
    )

    try:
        with urllib.request.urlopen(req_clickup) as resp:
            if resp.status == 200:
                print(
                    f"Descripción de la tarea #{task_id} actualizada en ClickUp."
                )
    except Exception as e:
        print(f"No se pudo actualizar ClickUp para la tarea #{task_id}: {e}")