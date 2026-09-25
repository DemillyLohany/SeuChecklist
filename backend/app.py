from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import create_db

# Importa os modelos para registrá-los no SQLModel
from models.tarefa_model import Tarefas
from models.usuario_model import Usuarios

from rotas.tarefas import router as tarefas_router
from rotas.usuarios import router as usuarios_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    yield


app = FastAPI(lifespan=lifespan)

# Configuração do CORS permitindo tanto localhost quanto 127.0.0.1
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)


@app.get("/")
def home():
    return {"status": "API top"}


# Rotas
app.include_router(usuarios_router)
app.include_router(tarefas_router)