from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from utils.templates import templates

from config import BASE_DIR

app = FastAPI()
app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static")),
    name='static'
)

@app.get('/')
def helloWorld(request:Request):
    return templates.TemplateResponse(
        request, 
        "index.html",
        {
            "sys": {"name": "SHAViewer TERMINAL", "version": "v1.0"},
        },
        )