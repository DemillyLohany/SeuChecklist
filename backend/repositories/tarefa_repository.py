from sqlmodel import Session, select

from models.tarefa_model import Tarefas


class TarefaRepository:
    """Responsável exclusivamente pelo acesso às tarefas no banco."""

    def __init__(self, session: Session):
        self.session = session

    def criar(self, tarefa: Tarefas) -> Tarefas:
        self.session.add(tarefa)
        self.session.commit()
        self.session.refresh(tarefa)
        return tarefa

    def listar_por_usuario(self, usuario_id: int) -> list[Tarefas]:
        resultado = self.session.exec(
            select(Tarefas).where(Tarefas.usuario_id == usuario_id)
        ).all()
        return list(resultado)

    def buscar_por_id(self, tarefa_id: int) -> Tarefas | None:
        return self.session.get(Tarefas, tarefa_id)

    def salvar(self, tarefa: Tarefas) -> Tarefas:
        self.session.add(tarefa)
        self.session.commit()
        self.session.refresh(tarefa)
        return tarefa

    def excluir(self, tarefa: Tarefas) -> None:
        self.session.delete(tarefa)
        self.session.commit()
