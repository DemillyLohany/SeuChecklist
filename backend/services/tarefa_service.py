from datetime import datetime, timezone

from models.tarefa_model import StatusTarefa, Tarefas
from repositories.tarefa_repository import TarefaRepository
from schemas.tarefa_schema import TarefasCria, TarefasUpdate


class UsuarioInvalidoError(Exception):
    pass


class TarefaNaoEncontradaError(Exception):
    pass


class TarefaSemPermissaoError(Exception):
    pass


class TarefaService:
    """Concentra as regras de negócio e os casos de uso de tarefas."""

    def __init__(self, repository: TarefaRepository):
        self.repository = repository

    def criar(self, dados: TarefasCria, usuario_id: int | None) -> Tarefas:
        if usuario_id is None:
            raise UsuarioInvalidoError("Usuário inválido")

        nova_tarefa = Tarefas(
            titulo=dados.titulo,
            data_entrega=dados.data_entrega,
            usuario_id=usuario_id,
        )
        return self.repository.criar(nova_tarefa)

    def listar(self, usuario_id: int | None) -> list[Tarefas]:
        if usuario_id is None:
            raise UsuarioInvalidoError("Usuário inválido")
        return self.repository.listar_por_usuario(usuario_id)

    def buscar_do_usuario(self, tarefa_id: int, usuario_id: int | None) -> Tarefas:
        tarefa = self._buscar(tarefa_id)
        self._verificar_dono(tarefa, usuario_id)
        return tarefa

    def atualizar(
        self,
        tarefa_id: int,
        dados: TarefasUpdate,
        usuario_id: int | None,
    ) -> Tarefas:
        tarefa = self.buscar_do_usuario(tarefa_id, usuario_id)
        dados_atualizar = dados.model_dump(exclude_unset=True)

        for campo, valor in dados_atualizar.items():
            setattr(tarefa, campo, valor)

        if dados_atualizar.get("status") == StatusTarefa.concluida:
            tarefa.data_entrega_real = datetime.now(timezone.utc)

        return self.repository.salvar(tarefa)

    def excluir(self, tarefa_id: int, usuario_id: int | None) -> None:
        tarefa = self.buscar_do_usuario(tarefa_id, usuario_id)
        self.repository.excluir(tarefa)

    def _buscar(self, tarefa_id: int) -> Tarefas:
        tarefa = self.repository.buscar_por_id(tarefa_id)
        if tarefa is None:
            raise TarefaNaoEncontradaError("Tarefa não encontrada")
        return tarefa

    @staticmethod
    def _verificar_dono(tarefa: Tarefas, usuario_id: int | None) -> None:
        if usuario_id is None or tarefa.usuario_id != usuario_id:
            raise TarefaSemPermissaoError("Sem permissão")
