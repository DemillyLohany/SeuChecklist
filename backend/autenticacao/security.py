from typing import Annotated
from sqlmodel import Session, create_engine, select
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import bcrypt
import os

from model import Usuarios
from database import get_session

engine = create_engine("sqlite:///database.db")

SessionDep = Annotated[Session, Depends(get_session)]

#chave secreta do projeto pra o token
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_seguro_so_para_dev")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def gerar_hash_senha(password: str) -> str:
    #transforma a string em bytes, gera o salt e o hash
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hash_bytes = bcrypt.hashpw(pwd_bytes, salt)
    return hash_bytes.decode('utf-8') # Salva no banco como string


#o fastAPI buscará o token no cabeçalho 'Autorization: Bearer <token>'
oauth2_sistema = OAuth2PasswordBearer(tokenUrl='/login')

def obter_usuario_atual(
    session: Annotated[Session, Depends(get_session)], # Tipo explícito aqui
    token: Annotated[str, Depends(oauth2_sistema)]
):
    try:
        dados_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = dados_token.get("sub")

        if email is None:
            raise HTTPException(401, "Token Inválido")

    except JWTError:
        raise HTTPException(401, "Token inválido ou expirado")

    # O editor vai reconhecer o 'session' como um objeto Session do SQLModel perfeitamente
    usuario = session.exec(select(Usuarios).where(Usuarios.email == email)).first()

    if usuario is None:
        raise HTTPException(401, "Usuário não encontrado ou foi deletado")

    return usuario


#função pra criar o token de acesso que vai ser utilizado
def criar_token_acesso(dados: dict):
    para_codificar = dados.copy()
    expiracao = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    para_codificar.update({"exp": expiracao})
    return jwt.encode(para_codificar, SECRET_KEY, algorithm=ALGORITHM)