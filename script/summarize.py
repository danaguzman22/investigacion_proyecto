import json
import os
import subprocess
import urllib.request
from datetime import datetime

# 1. Obtener el Token automático de GitHub
token = os.environ.get("GITHUB_TOKEN")
if not token:
    print("Error: GITHUB_TOKEN no configurada.")
    exit(1)

# 2. Obtener el último commit y autor
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

# 3. Consultar a GitHub Models (GPT-4o-mini)
url = "https://models.inference.ai.azure.com/chat/completions?api-version=2024-05-01-preview"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}",
}

prompt = (
    "Genera un resumen técnico ultra corto (máximo 2 oraciones) en español para una bitácora de desarrollo. "
    f"Autor: {commit_author}\nMensaje de commit: {commit_msg}\nCambios:\n{git_diff}"
)

payload = {
    "messages": [{"role": "user", "content": prompt}],
    "model": "gpt-4o-mini",
}

req = urllib.request.Request(
    url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST"
)

try:
    with urllib.request.urlopen(req) as response:
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