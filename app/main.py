from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from utils.templates import templates
from utils import sha_generator, sha_handler

from pydantic import BaseModel

from config import BASE_DIR

import json


app = FastAPI()
app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static")),
    name='static'
)

class analyzeSteps(BaseModel):
    steps: str = ""

@app.get('/')
def index(request:Request):
    return templates.TemplateResponse(
        request, 
        "index.html",
        {
            "sys": {"name": "SHAViewer TERMINAL", "version": "v1.4"},
        },
        )

@app.post("/api/analyze")
def analyze(payload: dict):
    text = payload.get("input", "")

    # Сбросить старые шаги, иначе они будут накапливаться
    sha_handler = sha_handler.StepFabricator()

    sha_generator.sha_256(text.encode())

    data = json.loads(f"static/data.json".read_text(encoding="utf-8"))
    return JSONResponse(data)