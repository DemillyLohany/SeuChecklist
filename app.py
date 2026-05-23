from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated, TypeAlias
from sqlmodel import Session, select
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt

from database import create_db, get_session
from model import Usuarios, UsuarioLogin, UsuarioCria, UsuarioUpdate, Tarefas, TarefasCria, TarefasUpdate

from passlib.context import CryptContext

#define o algoritmo de hash pra senha_hash (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def gerar_hash_senha(password: str):
    return pwd_context.hash(password)

SessionDep: TypeAlias = Annotated[Session, Depends(get_session)]

# chave secreta do projeto pra o token
SECRET_KEY = "sua_chave_secreta_hipermega_protegida_por_camila_demilly_filipe"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# O FastAPI buscará o token no cabeçalho 'Autorization: Bearer <token>'
oauth2_sistema = OAuth2PasswordBearer(tokenUrl='/login')

def obter_usuario_atual(token: Annotated[str, Depends(oauth2_sistema)], session: SessionDep):
    # Serve para decodificar o token JWT para extrair úteis
    # se o token tiver algo errado, o servidor vai gerar um erro
    try:
        dados_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # "sub"(subject) serve para identificar o dono do token
        email: str = dados_token.get("sub")

        if email is None:
            raise HTTPException(401, "Token Inválido")
    
    except JWTError:
        raise HTTPException(401, "Token inválido ou expirado")
    usuario = session.exec(select(Usuarios).where(Usuarios.email == email)).first()

    if usuario is None:
        raise HTTPException (401, "Usuário não encontrado")
        
    return usuario

# função pra criar o token de acesso que vai ser utilizado
def criar_token_acesso(dados: dict):
    para_codificar = dados.copy()
    expiracao = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    para_codificar.update({"exp": expiracao})
    return jwt.encode(para_codificar, SECRET_KEY, algorithm=ALGORITHM)

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    yield

app = FastAPI(lifespan=lifespan)

# rota raiz
@app.get("/")
def home():
    return {"ok": True}

# Rotas do usuário
@app.post('/usuarios') #Criando a rotinha de cadastro
def cadastrar_usuario(usuario: UsuarioCria, session: SessionDep):#recebe os dados enviados que estão na classe de usuários (com o session, se conecta com o banco)
    novo_usuario = Usuarios(
        nome=usuario.nome,
        email=usuario.email,
        senha_hash=gerar_hash_senha(usuario.senha) # Transforma a senha em texto claro em um hash seguro
    )

    session.add(novo_usuario) # Diz que quer salvar o usuário, m s só salva de verdade...
    session.commit()#aqui
    session.refresh(novo_usuario) #atualiza as coisa com os dados do banco

    return novo_usuario #Agora o usuário cadastrado é retornado (com o ID gerado pelo banco)

@app.post('/login')
def login(dados: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep):
    usuario = session.exec(
    select(Usuarios).where(Usuarios.email == dados.username)).first()

    if not usuario or not pwd_context.verify(dados.password, usuario.senha_hash):
        raise HTTPException(401,"E-mail ou senha incorretos")
    
    #cria o Token JWT para manter a aplicação stateless (sem estado)
    token = criar_token_acesso(dados={"sub": usuario.email})
    
    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get('/usuarios')
def perfil_usuario(usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)]):
    usuario = usuario_atual
    
    return usuario

@app.put('/usuarios/')
def atualizar_usuario(usuario:UsuarioUpdate,usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)], 
session: SessionDep) -> Usuarios:
    if usuario.email is not None:
        usuario_atual.email = usuario.email
    if usuario.nome is not None:
        usuario_atual.nome = usuario.nome

    if usuario.senha:
        usuario_atual.senha_hash = gerar_hash_senha(usuario.senha)

    session.add(usuario_atual)
    session.commit()
    session.refresh(usuario_atual)

    return usuario_atual

@app.delete("/usuarios")
def deletar_usuario(usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)], session: Session = Depends(get_session)):
    usuario = usuario_atual
    
    session.delete(usuario)

    session.commit()

    return {"mensagem": "Conta deletada com sucesso"}

# Ponto 4: CRUD de tarefas
# Criar tarefas - create (não vou explicar pra q serve cada coisa pq já tem no cadastr de usuario)
@app.post('/tarefas')
def criar_tarefas(tarefa:TarefasCria, usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)], session: Session = Depends(get_session)) -> Tarefas:
    nova_tarefa = Tarefas(
        titulo = tarefa.titulo,
        status = tarefa.status,
        data_entrega = tarefa.data_entrega,
        usuario_id = usuario_atual.id
        )
    
    session.add(nova_tarefa)
    session.commit()
    session.refresh(nova_tarefa)
    return nova_tarefa

# Ler tarefas - read
@app.get('/tarefas')
def ler_tarefas(usuario_atual: Annotated[Usuarios,Depends(obter_usuario_atual)],session: SessionDep) -> list[Tarefas]:
    lista = session.exec(
        select(Tarefas).where(Tarefas.usuario_id == usuario_atual.id)
    ).all() #pega as tarefas tudin do usuario logado e põe numa lista
    return lista 

# Atualizar tarefas - update
@app.put('/tarefas/{id}')
def atualizar_tarefas(id:int, tarefa:TarefasUpdate, usuario_atual: Annotated[Usuarios,Depends(obter_usuario_atual)], session: Session = Depends(get_session)) -> Tarefas:
    tarefaUpdate = session.get(Tarefas,id) 

    if tarefaUpdate is None:
        raise HTTPException(404, 'Tarefa não encontrada')
    
    if tarefaUpdate.usuario_id != usuario_atual.id:
        raise HTTPException(403,'Sem permissão') #mensagem de avisinho
    
    # pega apenas os campos enviados para atualizar
    dados_atualizar = tarefa.dict(exclude_unset=True)

    # atualiiza os campos dentro necessários de 'dados_atualizar' 
    for chave, valor in dados_atualizar.items():
        setattr(tarefaUpdate, chave, valor)

    session.commit()
    session.refresh(tarefaUpdate)
    return tarefaUpdate
    
# Deletar tarefas - delete
@app.delete('/tarefas/{id}')
def deletar_tarefas (id:int, usuario_atual: Annotated[Usuarios, Depends(obter_usuario_atual)], sessao: Session = Depends(get_session)):
    tarefa = sessao.get(Tarefas, id)

    if tarefa is None:
        raise HTTPException(404,'A Tarefa não foi encontrada')
    
    if tarefa.usuario_id != usuario_atual.id:
        raise HTTPException(403,'Sem permissão')

    sessao.delete(tarefa)#deleta a tarefa
    sessao.commit()
    return {"Mensagem": "Tarefa removida com sucesso"}

# Próximas etapas:

# - Backend seguinte: Tarefas
# - Proteção de Rotas(usando Depends): pras rotas de tarefas (tipo editar) só funcionem 
#   se o usuário enviar esse access_token aí no cabeçalho da requisição. 
# - Implementar NextJS como ferramenta do Frontend das rotas acima.

# ----- Relatório 3
# Ponto 1: Finalizar os protótipos de Tela - Demilly Lohany Gonçalves de Medeiros
# Ponto 2: Implementação de logout - Demilly Lohany Gonçalves de Medeiros
# Ponto 3: Segurança de dados - Filipe Silva Souza Marcelino
# Ponto 4: CRUD de tarefas - Camila Thaís Silva Medeiros
# Ponto 5: Interface Front-end(cadastro/login/tarefas) - Filipe Silva Souza Marcelino
# Ponto 6: Comunicação NextJs com FastAPI - Camila Thaís Silva Medeiros


