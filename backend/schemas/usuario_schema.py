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



