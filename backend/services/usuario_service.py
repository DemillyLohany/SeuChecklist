import bcrypt

from autenticacao.security import gerar_hash_senha
from models.usuario_model import Usuarios
from repositories.usuario_repository import UsuarioRepository
from schemas.usuario_schema import UsuarioCria, UsuarioUpdate


class EmailJaCadastradoError(Exception):
    pass


class CredenciaisInvalidasError(Exception):
    pass


class UsuarioNaoEncontradoError(Exception):
    pass


class UsuarioService:
    """Concentra as regras de negócio e os casos de uso de usuários."""

    def __init__(self, repository: UsuarioRepository):
        self.repository = repository

    def cadastrar(self, dados: UsuarioCria) -> Usuarios:
        if self.repository.buscar_por_email(dados.email):
            raise EmailJaCadastradoError("E-mail já cadastrado")

        usuario = Usuarios(
            nome=dados.nome,
            email=dados.email,
            senha_hash=gerar_hash_senha(dados.senha),
        )
        return self.repository.criar(usuario)

    def autenticar(self, email: str, senha: str) -> Usuarios:
        usuario = self.repository.buscar_por_email(email)
        if not usuario or not bcrypt.checkpw(
            senha.encode("utf-8"), usuario.senha_hash.encode("utf-8")
        ):
            raise CredenciaisInvalidasError("E-mail ou senha incorretos")
        return usuario

    def atualizar(self, usuario: Usuarios, dados: UsuarioUpdate) -> Usuarios:
        if dados.email is not None and dados.email != usuario.email:
            existente = self.repository.buscar_por_email(dados.email)
            if existente and existente.id != usuario.id:
                raise EmailJaCadastradoError("E-mail já cadastrado")
            usuario.email = dados.email

        if dados.nome is not None:
            usuario.nome = dados.nome
        if dados.senha:
            usuario.senha_hash = gerar_hash_senha(dados.senha)

        return self.repository.salvar(usuario)

    def excluir(self, usuario: Usuarios) -> None:
        self.repository.excluir(usuario)
