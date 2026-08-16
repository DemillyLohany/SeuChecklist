from sqlmodel import SQLModel, Field, create_engine, Relationship
from datetime import datetime, date, timezone
from decimal import Decimal
from typing import Optional, List
from enum import Enum
from typing import TYPE_CHECKING, List, Optional

if TYPE_CHECKING:
    from .tarefa_model import Tarefas  # isso só roda para o editor de código, não para o Python executando

class Usuarios(SQLModel, table=True):
    __tablename__: str = 'usuarios'
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    email: str = Field(sa_column_kwargs={"unique": True})
    senha_hash: str = Field(max_length=72) 

    tarefas: List["Tarefas"] = Relationship(back_populates="usuario")



