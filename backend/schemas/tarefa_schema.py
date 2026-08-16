from sqlmodel import SQLModel, Field, create_engine, Relationship
from datetime import datetime, date, timezone
from decimal import Decimal
from typing import Optional, List
from typing import TYPE_CHECKING, List, Optional
from models.tarefa_model import StatusTarefa 

class TarefasCria(SQLModel):
    titulo: str
    data_entrega: Optional[date] = None

class TarefasUpdate(SQLModel):
    titulo: Optional[str] = None
    status: Optional[StatusTarefa] = None
    data_entrega: Optional[date] = None
