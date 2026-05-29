from sqlmodel import select, Session
from sqlmodel import select
from typing import Annotated
import bcrypt
from model import Usuarios, UsuarioCria, UsuarioUpdate
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from database import get_session

from autenticacao.security import (
    gerar_hash_senha, criar_token_acesso, obter_usuario_atual
)

router = APIRouter()


# Rotas do usuário
@router.post('/usuarios') #Criando a rotinha de cadastro
def cadastrar_usuario(usuario: UsuarioCria, session: Annotated[Session, Depends(get_session)]):#recebe os dados enviados que estão na classe de usuários (com o session, se conecta com o banco)


    usuario_existente = session.exec(
        select(Usuarios).where(Usuarios.email == usuario.email)).first()
    #verifica se o usuário já existe antes de cadastrar(evita recadastramento desnecessário)
    if usuario_existente:
        raise HTTPException(400, "E-mail já cadastrado")
    
    novo_usuario = Usuarios(
        nome=usuario.nome,
        email=usuario.email,
        senha_hash=gerar_hash_senha(usuario.senha) # Transforma a senha em texto claro em um hash seguro
    )

    session.add(novo_usuario) # Diz que quer salvar o usuário, m s só salva de verdade...
    session.commit()#aqui
    session.refresh(novo_usuario) #atualiza as coisa com os dados do banco

    return novo_usuario.model_dump(exclude={"senha_hash"}) #Agora o usuário cadastrado é retornado (com o ID gerado pelo banco)

@router.post('/login')
def login(dados: Annotated[OAuth2PasswordRequestForm, Depends()], session: Annotated[Session, Depends(get_session)]):
    usuario = session.exec(
    select(Usuarios).where(Usuarios.email == dados.username)).first()

    if not usuario or not bcrypt.checkpw(dados.password.encode('utf-8'), usuario.senha_hash.encode('utf-8')):
        raise HTTPException(401, "E-mail ou senha incorretos")
        
    #cria o Token JWT para manter a aplicação stateless (sem estado)
    token_acesso = criar_token_acesso({"sub": usuario.email})
    
    refresh_token = criar_token_acesso({"sub": usuario.email})
    
    return {
        "access_token": token_acesso,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.get('/usuarios/me')
def perfil_usuario(usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)]):
    # O .model_dump() transforma o objeto do banco em um dicionário Python comum,
    # garantindo que o FastAPI consiga ler e exibir todos os campos no JSON.
    return usuario_atual.model_dump(exclude={"senha_hash"})

@router.put('/usuarios/')
def atualizar_usuario(
    usuario: UsuarioUpdate,
    session: Annotated[Session, Depends(get_session)],  # Movido para antes do 'usuario_atual' para corrigir o linter
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)]
):
    if usuario.email is not None:
        usuario_atual.email = usuario.email
    if usuario.nome is not None:
        usuario_atual.nome = usuario.nome

    if usuario.senha:
        usuario_atual.senha_hash = gerar_hash_senha(usuario.senha)

    session.add(usuario_atual)
    session.commit()
    session.refresh(usuario_atual)

    return usuario_atual.model_dump(exclude={"senha_hash"})

@router.delete("/usuarios")
def deletar_usuario(
    session: Annotated[Session, Depends(get_session)],  # Movido para antes do 'usuario_atual' para corrigir o linter
    usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)]
):

    session.delete(usuario_atual)

    session.commit()

    return {"mensagem": "Conta deletada com sucesso"}