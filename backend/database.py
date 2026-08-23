from sqlmodel import Session, SQLModel, create_engine
from fastapi import Depends
from typing import Annotated

DATABASE_URL = "mysql+pymysql://root:1Corintios13.4@localhost:3306/seuchecklist" #Diz onde está o banco para acesso

engine = create_engine(DATABASE_URL, echo=True) # Cro+ia a engine, ou seja, a feramenta que possibilita a conexão com o banco


def create_db():
    SQLModel.metadata.create_all(engine) # Cria as tabelas definidas nos modelos se elas ainda não existirem


def get_session():
    with Session(engine) as session: # Conexão com MySQL aberta
        yield session # Conexão entregue