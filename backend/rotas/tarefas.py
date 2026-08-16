from sqlmodel import select, Session
from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from datetime import datetime, timezone
from models.usuario_model import Usuarios
from models.tarefa_model import Tarefas
from schemas.tarefa_schema import TarefasCria, TarefasUpdate
from autenticacao.security import obter_usuario_atual
from database import get_session

router = APIRouter()

# CRUD de tarefas

# Criar tarefas - create (não vou explicar pra q serve cada coisa pq já tem no cadastro de usuario)
@router.post('/tarefas', response_model=Tarefas)
def criar_tarefas(
    tarefa: TarefasCria,
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)],
    session: Annotated[Session, Depends(get_session)]
) -> Tarefas:

    if usuario_atual.id is None:
        raise HTTPException(status_code=400, detail="Usuário inválido")

    nova_tarefa = Tarefas(
        titulo=tarefa.titulo,
        data_entrega=tarefa.data_entrega,
        usuario_id=usuario_atual.id
    )

    session.add(nova_tarefa)
    session.commit()
    session.refresh(nova_tarefa)

    return nova_tarefa


# Ler tarefas - read
@router.get('/tarefas', response_model=list[Tarefas])
def ler_tarefas(
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)],
    session: Annotated[Session, Depends(get_session)]
) -> list[Tarefas]:

    lista = session.exec(
        select(Tarefas).where(Tarefas.usuario_id == usuario_atual.id)
    ).all()

    return list(lista)


# Ler uma tarefa específica - read by id
@router.get('/tarefas/{id}', response_model=Tarefas)
def buscar_tarefa(
    id: int,
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)],
    session: Annotated[Session, Depends(get_session)]
) -> Tarefas:

    tarefa = session.get(Tarefas, id)

    if tarefa is None:
        raise HTTPException(status_code=404, detail='Tarefa não encontrada')

    if tarefa.usuario_id != usuario_atual.id:
        raise HTTPException(status_code=403, detail='Sem permissão')

    return tarefa


# Atualizar tarefas - update
@router.put("/tarefas/{id}", response_model=Tarefas)
def atualizar_tarefas(
    id: int,
    tarefa: TarefasUpdate,
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)],
    session: Annotated[Session, Depends(get_session)]
) -> Tarefas:

    tarefaUpdate = session.get(Tarefas, id)

    if tarefaUpdate is None:
        raise HTTPException(status_code=404, detail='Tarefa não encontrada')

    if tarefaUpdate.usuario_id != usuario_atual.id:
        raise HTTPException(status_code=403, detail='Sem permissão')  # mensagem de avisinho

    # pega apenas os campos enviados para atualizar
    dados_atualizar = tarefa.model_dump(exclude_unset=True)

    # atualiza os campos necessários dentro de 'dados_atualizar'
    for chave, valor in dados_atualizar.items():
        setattr(tarefaUpdate, chave, valor)

    if dados_atualizar.get("status") == "Concluída":
        tarefaUpdate.data_entrega_real = datetime.now(timezone.utc)

    session.commit()
    session.refresh(tarefaUpdate)

    return tarefaUpdate


# Deletar tarefas - delete
@router.delete('/tarefas/{id}', response_model=dict)
def deletar_tarefas(
    id: int,
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)],
    session: Annotated[Session, Depends(get_session)]
):

    tarefa = session.get(Tarefas, id)

    if tarefa is None:
        raise HTTPException(status_code=404, detail='A Tarefa não foi encontrada')

    if tarefa.usuario_id != usuario_atual.id:
        raise HTTPException(status_code=403, detail='Sem permissão')

    session.delete(tarefa)  # deleta a tarefa
    session.commit()

    return {"Mensagem": "Tarefa removida com sucesso"}