from sqlmodel import Session, SQLModel, create_engine

from fastapi import Depends

from typing import Annotated

DATABASE_URL = "mysql+pymysql://root:@localhost/seuchecklist" # Diz onde está o banco para acesso

engine = create_engine(DATABASE_URL, echo=True) # Cria a engine, ou seja, a ferramenta que possibilita a conexão com o banco


def create_db():

    # Importa os modelos para que sejam registrados no SQLModel.metadata
    from models.tarefa_model import Tarefas
    from models.usuario_model import Usuarios

    SQLModel.metadata.create_all(engine) # Cria as tabelas definidas nos modelos se elas ainda não existirem


def get_session():

    with Session(engine) as session: # Conexão com MySQL aberta

        yield session # Conexão entregue