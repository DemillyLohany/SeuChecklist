from pydantic import EmailStr
from sqlmodel import SQLModel, Field, create_engine, Relationship
from datetime import datetime, date, timezone
from decimal import Decimal
from typing import Optional, List
from enum import Enum

# Classes Usuário
class UsuarioCria(SQLModel):
    nome: str = Field(min_length=3, max_length=50)
    email: EmailStr
    senha: str = Field(min_length=8)

class UsuarioLogin(SQLModel):
    email: EmailStr
    senha: str

class UsuarioUpdate(SQLModel):
    # atualizar é apcional e não precisa ser de tudo, pode ser de somente um dado
    nome: Optional[str] = None  
    email: Optional[EmailStr] = None
    senha: Optional[str] = None



