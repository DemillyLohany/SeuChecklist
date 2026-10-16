from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# os modelos sao importados para ficarem registrados no sqlmodel
from models.tarefa_model import Tarefas
from models.usuario_model import Usuarios

from rotas.tarefas import router as tarefas_router
from rotas.usuarios import router as usuarios_router

app = FastAPI(
    title="SeuChecklist API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def inicio():
    return {"status": "API online"}


app.include_router(usuarios_router)
app.include_router(tarefas_router)