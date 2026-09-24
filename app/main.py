from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from utils.templates import templates

app = FastAPI()


@app.get('/')
def helloWorld(request:Request):
    return templates.TemplateResponse(request, "index.html")