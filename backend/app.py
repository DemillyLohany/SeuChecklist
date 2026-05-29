from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.database import create_db
from backend.rotas.usuarios import router as usuarios_router
from backend.rotas.tarefas import router as tarefas_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"status": "API top"}


# Rotas
app.include_router(usuarios_router)
app.include_router(tarefas_router)


# Próximas etapas:

# - Backend seguinte: Tarefas
# - Implementar NextJS como ferramenta do Frontend das rotas acima.

# ----- Relatório 3
# Ponto 1: Finalizar os protótipos de Tela - Demilly Lohany Gonçalves de Medeiros
# Ponto 2: Implementação de logout - Demilly Lohany Gonçalves de Medeiros
# Ponto 3: Segurança de dados - Filipe Silva Souza Marcelino
# Ponto 4: CRUD de tarefas - Camila Thaís Silva Medeiros
# Ponto 5: Interface Front-end(cadastro/login/tarefas) - Filipe Silva Souza Marcelino
# Ponto 6: Comunicação NextJs com FastAPI - Camila Thaís Silva Medeiros




# npm run dev 