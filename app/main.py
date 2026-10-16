from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from utils.templates import templates
from utils import sha_generator, sha_handler

from config import BASE_DIR, USER_FILE, DATA_FILE

import json


app = FastAPI()
app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static")),
    name='static'
)


@app.get('/')
def index(request:Request):

    records = []
    if USER_FILE.exists():
        records = json.loads(USER_FILE.read_text(encoding='utf-8'))
    return templates.TemplateResponse(
        request, 
        "index.html",
        {
            "sys": {"name": "SHAViewer TERMINAL", "version": "v1.4"},
            "records": records
        },
        )

@app.post("/api/analyze")
def analyze(payload: dict):
    text = payload.get("input", "").strip()
    if not text:
        return JSONResponse({"error": "empty input"}, status_code=400)
    sha_generator.sha_256(text.encode())

    data = json.loads(DATA_FILE.read_text(encoding='utf-8'))

    return JSONResponse(data)

@app.post("/api/register")
def register(payload:dict):
    username = payload.get("username", "").strip()
    email = payload.get("email", "").strip()
    password = payload.get("password", "").strip()

    if not username or not password:
        return JSONResponse({"error": "Логин и пароль обязательны"}, status_code=400)
    
    hash_bytes = sha_generator.sha_256(password.encode())
    hash_hex = hash_bytes.hex()

    if USER_FILE.exists():
        users = json.loads(USER_FILE.read_text(encoding='utf-8'))
    else:
        users = []

    id = len(users) + 1
    users.append({
        "id": id,
        "name": username,
        "role": hash_hex,
        "status": "ACTIVE",
        "passwd": hash_hex,
    })

    USER_FILE.write_text(
        json.dumps(users, ensure_ascii=False, indent=2), 
        encoding='utf-8'
        )
    return JSONResponse({"status": "ok", "users":users})

