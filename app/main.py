from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from utils.templates import templates

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
