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
def index(request:Request):
    return templates.TemplateResponse(
        request, 
        "index.html",
        {
            "sys": {"name": "SHAViewer TERMINAL", "version": "v1.4"},
        },
        )

@app.get("/analize")
def analize_window(request: Request):
    return templates.TemplateResponse(
        request,
        "detail.html",
        {
            "source": "123",
            "encoded": "100101101",
            "blocks": [11001, 100111, 110],
            "step_1": ["1sf123", "31fg1"],
            "step_2": ["4421414f", "124ffasf"],
            "step_3": ["317gg77g1", "fds121fs"],
            "step_4": ["1312hfi1", "321hfad091"],
            "step_5": ["313nsdaka", "123hsduifhh1"],
        },
        )