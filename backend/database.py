from sqlmodel import Session, SQLModel, create_engine
from fastapi import Depends
from typing import Annotated

# DATABASE_URL = "mysql+pymysql://root:@localhost/seuchecklist"
# engine = create_engine(DATABASE_URL, echo=True)

# nova (SQLITE) ---
# cria um arquivo chamado 'banco.db' na raiz do seu projeto
DATABASE_URL = "sqlite:///banco.db" 

# O 'check_same_thread' é necessário para o SQLite funcionar corretamente com o FastAPI
engine = create_engine(
    DATABASE_URL, 
    echo=True, 
    connect_args={"check_same_thread": False}
)

def create_db():
    # Importa os modelos para que sejam registrados no SQLModel.metadata
    from models.tarefa_model import Tarefas
    from models.usuario_model import Usuarios

    SQLModel.metadata.create_all(engine) # Cria as tabelas no arquivo SQLite se não existirem


def get_session():
    with Session(engine) as session: # Conexão com SQLite aberta
        yield session # Conexão entregue
