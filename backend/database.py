import os
from collections.abc import Generator
from pathlib import Path

from dotenv import load_dotenv
from sqlmodel import Session, create_engine

PASTA_PROJETO = Path(__file__).resolve().parents[1]
PASTA_BACKEND = Path(__file__).resolve().parent

load_dotenv(PASTA_PROJETO / ".env")

# se DATABASE_URL nao estiver configurada, usa o SQLite do projeto.
CAMINHO_BANCO = PASTA_BACKEND / "banco.db"
URL_PADRAO = f"sqlite:///{CAMINHO_BANCO.as_posix()}"
DATABASE_URL = os.getenv("DATABASE_URL") or URL_PADRAO

argumentos_conexao = {}
if DATABASE_URL.startswith("sqlite"):
    argumentos_conexao["check_same_thread"] = False

engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    connect_args=argumentos_conexao,
)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session