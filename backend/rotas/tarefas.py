
from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlmodel import select
from datetime import datetime, timezone

from backend.model import Tarefas, TarefasCria, TarefasUpdate, Usuarios
from backend.autenticacao.security import obter_usuario_atual, SessionDep

router = APIRouter()

# Ponto 4: CRUD de tarefas
# Criar tarefas - create (não vou explicar pra q serve cada coisa pq já tem no cadastro de usuario)
@router.post('/tarefas', response_model=Tarefas)
def criar_tarefas(tarefa:TarefasCria, usuario_atual: 
Annotated[Usuarios, Depends(obter_usuario_atual)], 
session: SessionDep) -> Tarefas:

    if usuario_atual.id is None:
        raise HTTPException(400, "Usuário inválido")
        
    nova_tarefa = Tarefas(
        titulo = tarefa.titulo, data_entrega = tarefa.data_entrega,
        usuario_id = usuario_atual.id
)
    
    session.add(nova_tarefa)
    session.commit()
    session.refresh(nova_tarefa)
    return nova_tarefa

# Ler tarefas - read
@router.get('/tarefas', response_model=list[Tarefas])
def ler_tarefas(usuario_atual: Annotated[Usuarios,Depends(obter_usuario_atual)], session: SessionDep) -> list[Tarefas]:
    lista = session.exec(
        select(Tarefas).where(Tarefas.usuario_id == usuario_atual.id)
    ).all() #pega as tarefas tudin do usuario logado e põe numa lista
    return list(lista)

# Atualizar tarefas - update
@router.put('/tarefas/{id}')
def atualizar_tarefas(id:int, tarefa:TarefasUpdate, 
    usuario_atual: Annotated[Usuarios,Depends(obter_usuario_atual)], 
    session: SessionDep) -> Tarefas:
    tarefaUpdate = session.get(Tarefas,id) 

    if tarefaUpdate is None:
        raise HTTPException(404, 'Tarefa não encontrada')
    
    if tarefaUpdate.usuario_id != usuario_atual.id:
        raise HTTPException(403,'Sem permissão') #mensagem de avisinho
    
    # pega apenas os campos enviados para atualizar
    dados_atualizar = tarefa.model_dump(exclude_unset=True)

    # atualiiza os campos dentro necessários de 'dados_atualizar' 
    for chave, valor in dados_atualizar.items():
        setattr(tarefaUpdate, chave, valor)

    if dados_atualizar.get("status") == "Concluída":
        tarefaUpdate.data_entrega_real = datetime.now(timezone.utc)

    session.commit()
    session.refresh(tarefaUpdate)
    return tarefaUpdate
    
# Deletar tarefas - delete
@router.delete('/tarefas/{id}', response_model=dict)
def deletar_tarefas (id:int, usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)], session: SessionDep):
    tarefa = session.get(Tarefas, id)

    if tarefa is None:
        raise HTTPException(404,'A Tarefa não foi encontrada')
    
    if tarefa.usuario_id != usuario_atual.id:
        raise HTTPException(403,'Sem permissão')

    session.delete(tarefa)#deleta a tarefa
    session.commit()
    return {"Mensagem": "Tarefa removida com sucesso"}