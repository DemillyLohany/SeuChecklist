'use client';

import { useEffect, useState } from 'react';

import Footer from '../components/footer';
import Header from '../components/header';
import styles from './tarefas.module.css';

const ENDERECO_API = 'http://localhost:8000';

function formatarData(data) {
  if (!data) {
    return '';
  }

  const dataCurta = String(data).slice(0, 10);
  const [ano, mes, dia] = dataCurta.split('-');

  if (!ano || !mes || !dia) {
    return '';
  }

  return `${dia}/${mes}/${ano}`;
}

function pegarDataDeHoje() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

async function fazerRequisicao(caminho, opcoes = {}) {
  const token = window.localStorage.getItem('access_token');

  if (!token) {
    throw new Error('Faça login novamente para acessar suas tarefas.');
  }

  const cabecalhos = {
    ...opcoes.headers,
    Authorization: `Bearer ${token}`,
  };

  if (opcoes.body) {
    cabecalhos['Content-Type'] = 'application/json';
  }

  let resposta;

  try {
    resposta = await fetch(`${ENDERECO_API}${caminho}`, {
      ...opcoes,
      headers: cabecalhos,
    });
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Confira se o backend está rodando.'
    );
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    if (typeof dados?.detail === 'string') {
      throw new Error(dados.detail);
    }

    throw new Error('Não foi possível concluir a operação.');
  }

  return dados;
}

function LinhaTarefa({
  tarefa,
  aoConcluir,
  aoExcluir,
  aoEditar,
}) {
  const concluida = tarefa.status === 'Concluída';

  return (
    <article className={styles.taskRow}>
      <button
        className={`${styles.check} ${
          concluida ? styles.checked : ''
        }`}
        type="button"
        aria-label={
          concluida
            ? 'Reabrir tarefa'
            : 'Concluir tarefa'
        }
        onClick={() => aoConcluir(tarefa.id)}
      >
        {concluida && (
          <i
            className="fa-solid fa-check"
            aria-hidden="true"
          />
        )}
      </button>

      <strong className={styles.taskTitle}>
        {tarefa.titulo}
      </strong>

      <div className={styles.taskDates}>
        {tarefa.data_entrega && (
          <span>
            Prazo: {formatarData(tarefa.data_entrega)}
          </span>
        )}

        {concluida && tarefa.data_entrega_real && (
          <span>
            Conclusão:{' '}
            {formatarData(tarefa.data_entrega_real)}
          </span>
        )}
      </div>

      <div className={styles.rowActions}>
        <button
          type="button"
          aria-label="Editar tarefa"
          onClick={() => aoEditar(tarefa.id)}
        >
          <i
            className="fa-regular fa-pen-to-square"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          aria-label="Excluir tarefa"
          onClick={() => aoExcluir(tarefa.id)}
        >
          <i
            className="fa-regular fa-trash-can"
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}

function PainelTarefas({
  titulo,
  tarefas,
  classe,
  carregando,
  aoConcluir,
  aoExcluir,
  aoEditar,
}) {
  return (
    <section className={`${styles.panel} ${classe}`}>
      <h2>{titulo}</h2>

      <div className={styles.panelRows}>
        {carregando && (
          <p className={styles.noTasks}>
            Carregando tarefas...
          </p>
        )}

        {!carregando &&
          tarefas.map((tarefa) => (
            <LinhaTarefa
              key={tarefa.id}
              tarefa={tarefa}
              aoConcluir={aoConcluir}
              aoExcluir={aoExcluir}
              aoEditar={aoEditar}
            />
          ))}

        {!carregando && tarefas.length === 0 && (
          <p className={styles.noTasks}>
            Nenhuma tarefa cadastrada.
          </p>
        )}
      </div>

      {!carregando && tarefas.length > 0 && (
        <div
          className={styles.more}
          aria-hidden="true"
        >
          •••
        </div>
      )}
    </section>
  );
}

export default function PaginaTarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [pomodoroRodando, setPomodoroRodando] =
    useState(false);
  const [segundosPomodoro, setSegundosPomodoro] =
    useState(25 * 60);
  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);
  const [carregandoTarefas, setCarregandoTarefas] =
    useState(true);
  const [salvandoTarefa, setSalvandoTarefa] =
    useState(false);
  const [erroDaApi, setErroDaApi] = useState('');
  const [erroDoFormulario, setErroDoFormulario] =
    useState('');
  const [errosFormulario, setErrosFormulario] =
    useState({});

  const [dadosFormulario, setDadosFormulario] = useState({
    titulo: '',
    prazo: '',
    prioridade: 'Média',
    descricao: '',
  });

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarTarefas() {
      try {
        const dados = await fazerRequisicao('/tarefas');

        if (!Array.isArray(dados)) {
          throw new Error('A resposta da API não está correta.');
        }

        if (componenteAtivo) {
          setTarefas(dados);
        }
      } catch (erro) {
        if (componenteAtivo) {
          setErroDaApi(erro.message);
        }
      } finally {
        if (componenteAtivo) {
          setCarregandoTarefas(false);
        }
      }
    }

    carregarTarefas();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  useEffect(() => {
    if (!pomodoroRodando) {
      return undefined;
    }

    const temporizador = window.setInterval(() => {
      setSegundosPomodoro((segundosAtuais) => {
        if (segundosAtuais <= 1) {
          setPomodoroRodando(false);
          return 25 * 60;
        }

        return segundosAtuais - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(temporizador);
    };
  }, [pomodoroRodando]);

  function mostrarTempoPomodoro() {
    const minutos = Math.floor(segundosPomodoro / 60);
    const segundos = segundosPomodoro % 60;

    return `${String(minutos).padStart(2, '0')}:${String(
      segundos,
    ).padStart(2, '0')}`;
  }

  function atualizarCampo(campo, valor) {
    setDadosFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      [campo]: valor,
    }));

    setErrosFormulario((errosAtuais) => ({
      ...errosAtuais,
      [campo]: '',
    }));

    setErroDoFormulario('');
  }

  function limparFormulario() {
    setDadosFormulario({
      titulo: '',
      prazo: '',
      prioridade: 'Média',
      descricao: '',
    });

    setErrosFormulario({});
    setErroDoFormulario('');
    setMostrarFormulario(false);
  }

  function validarFormulario() {
    const novosErros = {};

    if (!dadosFormulario.titulo.trim()) {
      novosErros.titulo = 'Informe o nome da tarefa.';
    }

    setErrosFormulario(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  async function cadastrarTarefa(evento) {
    evento.preventDefault();

    if (!validarFormulario()) {
      document.getElementById('nome-tarefa')?.focus();
      return;
    }

    if (salvandoTarefa) {
      return;
    }

    setErroDoFormulario('');
    setSalvandoTarefa(true);

    try {
      const tarefaSalva = await fazerRequisicao('/tarefas', {
        method: 'POST',
        body: JSON.stringify({
          titulo: dadosFormulario.titulo.trim(),
          data_entrega: dadosFormulario.prazo || null,
        }),
      });

      setTarefas((tarefasAtuais) => [
        ...tarefasAtuais,
        tarefaSalva,
      ]);

      limparFormulario();
    } catch (erro) {
      setErroDoFormulario(erro.message);
    } finally {
      setSalvandoTarefa(false);
    }
  }

  async function concluirTarefa(id) {
    const tarefa = tarefas.find(
      (tarefaAtual) => tarefaAtual.id === id,
    );

    if (!tarefa) {
      return;
    }

    const novoStatus =
      tarefa.status === 'Concluída'
        ? 'Pendente'
        : 'Concluída';

    setErroDaApi('');

    try {
      const tarefaAtualizada = await fazerRequisicao(
        `/tarefas/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            status: novoStatus,
          }),
        },
      );

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((tarefaAtual) =>
          tarefaAtual.id === id
            ? tarefaAtualizada
            : tarefaAtual,
        ),
      );
    } catch (erro) {
      setErroDaApi(erro.message);
    }
  }

  async function excluirTarefa(id) {
    setErroDaApi('');

    try {
      await fazerRequisicao(`/tarefas/${id}`, {
        method: 'DELETE',
      });

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.filter(
          (tarefaAtual) => tarefaAtual.id !== id,
        ),
      );
    } catch (erro) {
      setErroDaApi(erro.message);
    }
  }

  async function editarTarefa(id) {
    const tarefa = tarefas.find(
      (tarefaAtual) => tarefaAtual.id === id,
    );

    if (!tarefa) {
      return;
    }

    const novoTitulo = window.prompt(
      'Edite o nome da tarefa:',
      tarefa.titulo,
    );

    if (!novoTitulo || !novoTitulo.trim()) {
      return;
    }

    setErroDaApi('');

    try {
      const tarefaAtualizada = await fazerRequisicao(
        `/tarefas/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            titulo: novoTitulo.trim(),
          }),
        },
      );

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((tarefaAtual) =>
          tarefaAtual.id === id
            ? tarefaAtualizada
            : tarefaAtual,
        ),
      );
    } catch (erro) {
      setErroDaApi(erro.message);
    }
  }

  const dataDeHoje = pegarDataDeHoje();

  const tarefasConcluidas = tarefas.filter(
    (tarefa) => tarefa.status === 'Concluída',
  );

  const tarefasAtrasadas = tarefas.filter(
    (tarefa) =>
      tarefa.status !== 'Concluída' &&
      tarefa.data_entrega &&
      String(tarefa.data_entrega).slice(0, 10) <
        dataDeHoje,
  );

  const tarefasAFazer = tarefas.filter((tarefa) => {
    const estaConcluida = tarefa.status === 'Concluída';
    const estaAtrasada =
      tarefa.data_entrega &&
      String(tarefa.data_entrega).slice(0, 10) <
        dataDeHoje;

    return !estaConcluida && !estaAtrasada;
  });

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.filterBar}>
        <strong>Filtrar por:</strong>

        <button type="button">
          <i
            className="fa-regular fa-pen-to-square"
            aria-hidden="true"
          />
          Importância e urgência
        </button>
      </div>

      <main className={styles.main}>
        <section className={styles.topArea}>
          <div className={styles.pomodoro}>
            <span className={styles.pomodoroLabel}>
              Pomodoro
            </span>

            <strong aria-live="polite">
              {mostrarTempoPomodoro()}
            </strong>

            <i
              className="fa-regular fa-clock"
              aria-hidden="true"
            />

            <div className={styles.timerButtons}>
              <button
                type="button"
                aria-label="Iniciar Pomodoro"
                onClick={() =>
                  setPomodoroRodando(true)
                }
              >
                <i
                  className="fa-solid fa-play"
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                aria-label="Pausar Pomodoro"
                onClick={() =>
                  setPomodoroRodando(false)
                }
              >
                <i
                  className="fa-solid fa-pause"
                  aria-hidden="true"
                />
              </button>
            </div>

            <span className={styles.srOnly}>
              {pomodoroRodando
                ? 'Pomodoro iniciado'
                : 'Pomodoro pausado'}
            </span>
          </div>

          <div className={styles.titleBlock}>
            <h1>
              <i
                className="fa-regular fa-square-check"
                aria-hidden="true"
              />
              Lista de Afazeres
            </h1>
          </div>

          <button
            className={styles.addButton}
            type="button"
            onClick={() => {
              setErrosFormulario({});
              setErroDoFormulario('');
              setMostrarFormulario(true);
            }}
          >
            <i
              className="fa-solid fa-plus"
              aria-hidden="true"
            />
            Adicionar
          </button>
        </section>

        {erroDaApi && !mostrarFormulario && (
          <p className={styles.apiError} role="alert">
            {erroDaApi}
          </p>
        )}

        <section className={styles.columns}>
          <PainelTarefas
            titulo="A fazer"
            tarefas={tarefasAFazer}
            classe={styles.doingPanel}
            carregando={carregandoTarefas}
            aoConcluir={concluirTarefa}
            aoExcluir={excluirTarefa}
            aoEditar={editarTarefa}
          />

          <div className={styles.sidePanels}>
            <PainelTarefas
              titulo="Atrasadas"
              tarefas={tarefasAtrasadas}
              classe={styles.latePanel}
              carregando={carregandoTarefas}
              aoConcluir={concluirTarefa}
              aoExcluir={excluirTarefa}
              aoEditar={editarTarefa}
            />

            <PainelTarefas
              titulo="Concluídas"
              tarefas={tarefasConcluidas}
              classe={styles.donePanel}
              carregando={carregandoTarefas}
              aoConcluir={concluirTarefa}
              aoExcluir={excluirTarefa}
              aoEditar={editarTarefa}
            />
          </div>
        </section>
      </main>

      {mostrarFormulario && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              limparFormulario();
            }
          }}
        >
          <section
            className={styles.taskModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-nova-tarefa"
          >
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>
                  Cadastro de tarefa
                </p>

                <h2 id="titulo-nova-tarefa">
                  Cadastrar tarefa
                </h2>
              </div>

              <button
                className={styles.closeButton}
                type="button"
                aria-label="Fechar formulário"
                onClick={limparFormulario}
              >
                <i
                  className="fa-solid fa-xmark"
                  aria-hidden="true"
                />
              </button>
            </div>

            <form
              className={styles.taskForm}
              onSubmit={cadastrarTarefa}
              noValidate
            >
              <label htmlFor="nome-tarefa">
                Nome da tarefa

                <input
                  id="nome-tarefa"
                  className={
                    errosFormulario.titulo
                      ? styles.inputError
                      : ''
                  }
                  type="text"
                  value={dadosFormulario.titulo}
                  onChange={(evento) =>
                    atualizarCampo(
                      'titulo',
                      evento.target.value,
                    )
                  }
                  placeholder="Digite o nome da tarefa"
                  required
                  autoFocus
                  aria-invalid={Boolean(
                    errosFormulario.titulo,
                  )}
                  aria-describedby={
                    errosFormulario.titulo
                      ? 'erro-nome-tarefa'
                      : undefined
                  }
                />

                {errosFormulario.titulo && (
                  <span
                    id="erro-nome-tarefa"
                    className={styles.fieldError}
                    role="alert"
                  >
                    {errosFormulario.titulo}
                  </span>
                )}
              </label>

              <div className={styles.formGrid}>
                <label htmlFor="prazo-tarefa">
                  Prazo

                  <input
                    id="prazo-tarefa"
                    type="date"
                    value={dadosFormulario.prazo}
                    onChange={(evento) =>
                      atualizarCampo(
                        'prazo',
                        evento.target.value,
                      )
                    }
                  />
                </label>

                <label htmlFor="prioridade-tarefa">
                  Prioridade

                  <select
                    id="prioridade-tarefa"
                    value={dadosFormulario.prioridade}
                    onChange={(evento) =>
                      atualizarCampo(
                        'prioridade',
                        evento.target.value,
                      )
                    }
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </label>
              </div>

              <label htmlFor="descricao-tarefa">
                Descrição

                <textarea
                  id="descricao-tarefa"
                  value={dadosFormulario.descricao}
                  onChange={(evento) =>
                    atualizarCampo(
                      'descricao',
                      evento.target.value,
                    )
                  }
                  placeholder="Adicione uma descrição opcional"
                  rows={4}
                />
              </label>

              <p className={styles.formNote}>
                
              </p>

              {erroDoFormulario && (
                <p
                  className={styles.apiError}
                  role="alert"
                >
                  {erroDoFormulario}
                </p>
              )}

              <div className={styles.formActions}>
                <button
                  className={styles.cancelButton}
                  type="button"
                  onClick={limparFormulario}
                >
                  Cancelar
                </button>

                <button
                  className={styles.submitButton}
                  type="submit"
                  disabled={salvandoTarefa}
                >
                  <i
                    className="fa-solid fa-plus"
                    aria-hidden="true"
                  />
                  {salvandoTarefa
                    ? 'Salvando...'
                    : 'Cadastrar tarefa'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}