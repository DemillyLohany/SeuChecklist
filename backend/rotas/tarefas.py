from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import Annotated
from models.usuario_model import Usuarios
from models.tarefa_model import Tarefas
from schemas.tarefa_schema import TarefasCria, TarefasUpdate
from autenticacao.security import obter_usuario_atual
from database import get_session
from repositories.tarefa_repository import TarefaRepository
from services.tarefa_service import (
    TarefaNaoEncontradaError,
    TarefaSemPermissaoError,
    TarefaService,
    UsuarioInvalidoError,
)

router = APIRouter()

# CRUD de tarefas

# Criar tarefas - create (não vou explicar pra q serve cada coisa pq já tem no cadastro de usuario)
@router.post('/tarefas', response_model=Tarefas)
def criar_tarefas(
    tarefa: TarefasCria,
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)],
    session: Annotated[Session, Depends(get_session)]
) -> Tarefas:

    try:
        return TarefaService(TarefaRepository(session)).criar(tarefa, usuario_atual.id)
    except UsuarioInvalidoError as erro:
        raise HTTPException(status_code=400, detail=str(erro)) from erro


# Ler tarefas - read
@router.get('/tarefas', response_model=list[Tarefas])
def ler_tarefas(
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)],
    session: Annotated[Session, Depends(get_session)]
) -> list[Tarefas]:

    try:
        return TarefaService(TarefaRepository(session)).listar(usuario_atual.id)
    except UsuarioInvalidoError as erro:
        raise HTTPException(status_code=400, detail=str(erro)) from erro


# Ler uma tarefa específica - read by id
@router.get('/tarefas/{id}', response_model=Tarefas)
def buscar_tarefa(
    id: int,
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)],
    session: Annotated[Session, Depends(get_session)]
) -> Tarefas:

    try:
        return TarefaService(TarefaRepository(session)).buscar_do_usuario(id, usuario_atual.id)
    except TarefaNaoEncontradaError as erro:
        raise HTTPException(status_code=404, detail=str(erro)) from erro
    except TarefaSemPermissaoError as erro:
        raise HTTPException(status_code=403, detail=str(erro)) from erro


# Atualizar tarefas - update
@router.put("/tarefas/{id}", response_model=Tarefas)
def atualizar_tarefas(
    id: int,
    tarefa: TarefasUpdate,
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)],
    session: Annotated[Session, Depends(get_session)]
) -> Tarefas:

    try:
        return TarefaService(TarefaRepository(session)).atualizar(
            id, tarefa, usuario_atual.id
        )
    except TarefaNaoEncontradaError as erro:
        raise HTTPException(status_code=404, detail=str(erro)) from erro
    except TarefaSemPermissaoError as erro:
        raise HTTPException(status_code=403, detail=str(erro)) from erro


# Deletar tarefas - delete
@router.delete('/tarefas/{id}', response_model=dict)
def deletar_tarefas(
    id: int,
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)],
    session: Annotated[Session, Depends(get_session)]
):

    try:
        TarefaService(TarefaRepository(session)).excluir(id, usuario_atual.id)
    except TarefaNaoEncontradaError as erro:
        raise HTTPException(status_code=404, detail=str(erro)) from erro
    except TarefaSemPermissaoError as erro:
        raise HTTPException(status_code=403, detail=str(erro)) from erro

    return {"Mensagem": "Tarefa removida com sucesso"}