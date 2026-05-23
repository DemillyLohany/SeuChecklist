from sqlmodel import SQLModel, Field, create_engine, Relationship
from datetime import datetime, date, timezone
from decimal import Decimal
from typing import Optional, List
from enum import Enum

# Classes Usuário
class UsuarioCria(SQLModel):
    nome: str
    email: str
    senha: str

class UsuarioLogin(SQLModel):
    email: str
    senha: str

class UsuarioUpdate(SQLModel):
    # atualizar é apcional e não precisa ser de tudo, pode ser de somente um dado
    nome: Optional[str] = None  
    email: Optional[str] = None
    senha: Optional[str] = None

class Usuarios(SQLModel, table=True):
    __tablename__: str = 'usuarios'
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    email: str = Field(sa_column_kwargs={"unique": True})
    senha_hash: str = Field(max_length=72) 

    tarefas: List["Tarefas"] = Relationship(back_populates="usuario")

# Classes Tarefa
class StatusTarefa(str, Enum):
    # para definir uma validação rigorosa para os valores do status
    pendente = "Pendente"
    em_andamento = "Em Andamento"
    concluida = "Concluída"

class TarefasCria(SQLModel):
    titulo: str
    status: StatusTarefa = StatusTarefa.pendente
    data_entrega: Optional[date] = None

class TarefasUpdate(SQLModel):
    titulo: Optional[str] = None
    status: Optional[StatusTarefa] = None
    data_entrega: Optional[date] = None

class Tarefas(SQLModel, table=True):
    __tablename__: str = 'tarefas'
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key='usuarios.id')
    titulo: str
    status: str 
    criado_em: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    data_entrega: Optional[date] = None
    data_entrega_real: Optional[datetime] = None

    usuario: Optional["Usuarios"] = Relationship(back_populates="tarefas")

