from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, date, timezone
from typing import Optional
from enum import Enum
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from .usuario_model import Usuarios # isso só roda para o editor de código, não para o Python executando


class StatusTarefa(str, Enum):
    # para definir uma validação rigorosa para os valores do status
    pendente = "Pendente"
    em_andamento = "Em Andamento"
    concluida = "Concluída"

class Tarefas(SQLModel, table=True):
    __tablename__: str = 'tarefas'
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key='usuarios.id')
    titulo: str
    status: StatusTarefa = Field(default=StatusTarefa.pendente)
    criado_em: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    data_entrega: Optional[date] = None
    data_entrega_real: Optional[datetime] = None

    usuario: Optional["Usuarios"] = Relationship(back_populates="tarefas")

