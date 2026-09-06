from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from autenticacao.security import criar_token_acesso, obter_usuario_atual
from database import get_session
from models.usuario_model import Usuarios
from repositories.usuario_repository import UsuarioRepository
from schemas.usuario_schema import UsuarioCria, UsuarioUpdate
from services.usuario_service import (
    CredenciaisInvalidasError,
    EmailJaCadastradoError,
    UsuarioService,
)

router = APIRouter()


@router.post('/usuarios')
def cadastrar_usuario(
    usuario: UsuarioCria,
    session: Annotated[Session, Depends(get_session)],
):
    try:
        novo_usuario = UsuarioService(UsuarioRepository(session)).cadastrar(usuario)
    except EmailJaCadastradoError as erro:
        raise HTTPException(status_code=400, detail=str(erro)) from erro

    return novo_usuario.model_dump(exclude={"senha_hash"})


@router.post('/login')
def login(
    dados: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[Session, Depends(get_session)],
):
    try:
        usuario = UsuarioService(UsuarioRepository(session)).autenticar(
            dados.username, dados.password
        )
    except CredenciaisInvalidasError as erro:
        raise HTTPException(status_code=401, detail=str(erro)) from erro

    token_acesso = criar_token_acesso({"sub": usuario.email})
    refresh_token = criar_token_acesso({"sub": usuario.email})

    return {
        "access_token": token_acesso,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.get('/usuarios/me')
def perfil_usuario(
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)],
):
    return usuario_atual.model_dump(exclude={"senha_hash"})


@router.put('/usuarios/')
def atualizar_usuario(
    usuario: UsuarioUpdate,
    session: Annotated[Session, Depends(get_session)],
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)],
):
    try:
        usuario_atual = UsuarioService(UsuarioRepository(session)).atualizar(
            usuario_atual, usuario
        )
    except EmailJaCadastradoError as erro:
        raise HTTPException(status_code=400, detail=str(erro)) from erro

    return usuario_atual.model_dump(exclude={"senha_hash"})


@router.delete('/usuarios')
def deletar_usuario(
    session: Annotated[Session, Depends(get_session)],
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)],
):
    UsuarioService(UsuarioRepository(session)).excluir(usuario_atual)
    return {"mensagem": "Conta deletada com sucesso"}
