from sqlmodel import Session, select

from models.usuario_model import Usuarios


class UsuarioRepository:
    """Responsável exclusivamente pelo acesso aos usuários no banco."""

    def __init__(self, session: Session):
        self.session = session

    def buscar_por_email(self, email: str) -> Usuarios | None:
        return self.session.exec(
            select(Usuarios).where(Usuarios.email == email)
        ).first()

    def criar(self, usuario: Usuarios) -> Usuarios:
        self.session.add(usuario)
        self.session.commit()
        self.session.refresh(usuario)
        return usuario

    def salvar(self, usuario: Usuarios) -> Usuarios:
        self.session.add(usuario)
        self.session.commit()
        self.session.refresh(usuario)
        return usuario

    def excluir(self, usuario: Usuarios) -> None:
        self.session.delete(usuario)
        self.session.commit()
