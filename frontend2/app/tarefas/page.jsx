'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import Footer from '../components/footer';
import Header from '../components/header';
import styles from './tarefas.module.css';

const ENDERECO_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const PRIORIDADES = ['Alta', 'Média', 'Baixa'];

const ORDENACOES = [
  { valor: 'criacao', rotulo: 'Mais recentes' },
  { valor: 'prazo', rotulo: 'Prazo mais próximo' },
  { valor: 'importancia', rotulo: 'Importância e urgência' },
];

// pega o token que foi salvo no login
function obterToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem('access_token');
}

function formatarData(valor) {
  if (!valor) {
    return '';
  }

  const dataCurta = String(valor).slice(0, 10);
  const [ano, mes, dia] = dataCurta.split('-');

  if (!ano || !mes || !dia) {
    return '';
  }

  return `${dia}/${mes}/${ano}`;
}

function pegarDataDeHoje() {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${hoje.getFullYear()}-${mes}-${dia}`;
}

async function chamarApi(caminho, opcoes = {}) {
  const token = obterToken();

  if (!token) {
    const erro = new Error('Faça login para acessar suas tarefas.');
    erro.semToken = true;
    throw erro;
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
      'Não foi possível conectar ao servidor. Confira se o backend está rodando.'
    );
  }

  if (resposta.status === 401) {
    const erro = new Error('Sua sessão expirou. Entre novamente para continuar.');
    erro.semToken = true;
    throw erro;
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    if (typeof dados?.detail === 'string') {
      throw new Error(dados.detail);
    }

    if (Array.isArray(dados?.detail)) {
      throw new Error(dados.detail[0]?.msg || 'Confira os dados enviados.');
    }

    throw new Error('Não foi possível concluir a operação.');
  }

  return dados;
}

const CLASSE_PRIORIDADE = {
  Alta: styles.prioridadeAlta,
  Média: styles.prioridadeMedia,
  Baixa: styles.prioridadeBaixa,
};

const FORMULARIO_VAZIO = {
  titulo: '',
  descricao: '',
  prioridade: 'Média',
  data_entrega: '',
};

function IconeLapis() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4L18.5 9.5a2.8 2.8 0 0 0-4-4L4 16z" />
      <path d="m13.8 6.2 4 4" />
    </svg>
  );
}

function IconeLixeira() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
    </svg>
  );
}

function LinhaTarefa({ tarefa, ocupada, aoConcluir, aoEditar, aoExcluir }) {
  const concluida = tarefa.status === 'Concluída';
  const processando = ocupada === tarefa.id;

  return (
    <li className={`${styles.itemTarefa} ${concluida ? styles.itemConcluido : ''}`}>
      <button
        type="button"
        className={`${styles.botaoCheck} ${concluida ? styles.botaoCheckFeito : ''}`}
        aria-label={concluida ? `Reabrir ${tarefa.titulo}` : `Concluir ${tarefa.titulo}`}
        aria-pressed={concluida}
        disabled={processando}
        onClick={() => aoConcluir(tarefa)}
      >
        {concluida ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7" />
          </svg>
        ) : null}
      </button>

      <div className={styles.corpoTarefa}>
        <p className={styles.nomeTarefa}>{tarefa.titulo}</p>

        {tarefa.descricao ? (
          <p className={styles.descricaoTarefa}>{tarefa.descricao}</p>
        ) : null}

        <div className={styles.datasTarefa}>
          <span>
            {tarefa.data_entrega
              ? `Prazo: ${formatarData(tarefa.data_entrega)}`
              : 'Sem prazo definido'}
          </span>

          {concluida && tarefa.data_entrega_real ? (
            <span>Conclusão: {formatarData(tarefa.data_entrega_real)}</span>
          ) : null}
        </div>
      </div>

      <div className={styles.ladoDireito}>
        <span
          className={`${styles.etiquetaPrioridade} ${
            CLASSE_PRIORIDADE[tarefa.prioridade] || styles.prioridadeMedia
          }`}
        >
          {tarefa.prioridade || 'Média'}
        </span>

        <div className={styles.acoesTarefa}>
          <button
            type="button"
            aria-label={`Editar ${tarefa.titulo}`}
            title="Editar"
            onClick={() => aoEditar(tarefa)}
          >
            <IconeLapis />
          </button>

          <button
            type="button"
            aria-label={`Excluir ${tarefa.titulo}`}
            title="Excluir"
            disabled={processando}
            onClick={() => aoExcluir(tarefa)}
          >
            <IconeLixeira />
          </button>
        </div>
      </div>
    </li>
  );
}

function PainelTarefas({
  titulo,
  vazio,
  tarefas,
  carregando,
  classe,
  extra,
  ocupada,
  aoConcluir,
  aoEditar,
  aoExcluir,
}) {
  return (
    <section className={`${styles.painel} ${classe || ''}`} aria-label={titulo}>
      <header className={styles.painelCabecalho}>
        <h2>
          {titulo}
          <span className={styles.contadorPainel}>{carregando ? '·' : tarefas.length}</span>
        </h2>

        {extra}
      </header>

      {carregando ? (
        <p className={styles.painelCarregando}>Carregando suas tarefas…</p>
      ) : tarefas.length === 0 ? (
        <p className={styles.painelVazio}>{vazio}</p>
      ) : (
        <ul className={styles.listaTarefas}>
          {tarefas.map((tarefa) => (
            <LinhaTarefa
              key={tarefa.id}
              tarefa={tarefa}
              ocupada={ocupada}
              aoConcluir={aoConcluir}
              aoEditar={aoEditar}
              aoExcluir={aoExcluir}
            />
          ))}
        </ul>
      )}

      <span className={styles.pontinhosPainel} aria-hidden="true">
        •••
      </span>
    </section>
  );
}

export default function PaginaTarefas() {
  const router = useRouter();

  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [ocupada, setOcupada] = useState(null);
  const [erro, setErro] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('todas');
  const [ordenacao, setOrdenacao] = useState('criacao');
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [erroDoFormulario, setErroDoFormulario] = useState('');
  const [errosDeCampo, setErrosDeCampo] = useState({});
  const [dadosDoFormulario, setDadosDoFormulario] = useState(FORMULARIO_VAZIO);

  const tratarFalha = useCallback(
    (falha) => {
      if (falha?.semToken) {
        router.push('/login');
        return;
      }

      setErro(falha.message);
    },
    [router]
  );

  const carregarTarefas = useCallback(async () => {
    setCarregando(true);
    setErro('');

    const parametros = new URLSearchParams();

    if (filtroPrioridade !== 'todas') {
      parametros.set('prioridade', filtroPrioridade);
    }

    parametros.set('ordenar', ordenacao);

    try {
      const resposta = await chamarApi(`/tarefas?${parametros.toString()}`);

      if (!Array.isArray(resposta)) {
        throw new Error('A resposta do servidor não está no formato esperado.');
      }

      setTarefas(resposta);
    } catch (falha) {
      if (falha.semToken) {
        router.push('/login');
        return;
      }

      setTarefas([]);
      setErro(falha.message);
    } finally {
      setCarregando(false);
    }
  }, [filtroPrioridade, ordenacao, router]);

  useEffect(() => {
    carregarTarefas();
  }, [carregarTarefas]);

  useEffect(() => {
    if (!formularioAberto) {
      return undefined;
    }

    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape') {
        setFormularioAberto(false);
      }
    }

    document.addEventListener('keydown', aoPressionarTecla);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', aoPressionarTecla);
      document.body.style.overflow = '';
    };
  }, [formularioAberto]);

  const dataDeHoje = pegarDataDeHoje();

  const { concluidas, atrasadas, aFazer, taxaDeConclusao } = useMemo(() => {
    const estaAtrasada = (tarefa) =>
      tarefa.status !== 'Concluída' &&
      tarefa.data_entrega &&
      String(tarefa.data_entrega).slice(0, 10) < dataDeHoje;

    const listaConcluidas = tarefas.filter((tarefa) => tarefa.status === 'Concluída');
    const listaAtrasadas = tarefas.filter(estaAtrasada);
    const listaAFazer = tarefas.filter(
      (tarefa) => tarefa.status !== 'Concluída' && !estaAtrasada(tarefa)
    );

    return {
      concluidas: listaConcluidas,
      atrasadas: listaAtrasadas,
      aFazer: listaAFazer,
      taxaDeConclusao: tarefas.length
        ? Math.round((listaConcluidas.length / tarefas.length) * 100)
        : 0,
    };
  }, [tarefas, dataDeHoje]);

  function abrirFormulario() {
    setDadosDoFormulario(FORMULARIO_VAZIO);
    setErrosDeCampo({});
    setErroDoFormulario('');
    setFormularioAberto(true);
  }

  function fecharFormulario() {
    setFormularioAberto(false);
    setErrosDeCampo({});
    setErroDoFormulario('');
  }

  function atualizarCampo(campo, valor) {
    setDadosDoFormulario((atual) => ({ ...atual, [campo]: valor }));
    setErrosDeCampo((atual) => ({ ...atual, [campo]: '' }));
    setErroDoFormulario('');
  }

  async function cadastrarTarefa(evento) {
    evento.preventDefault();

    if (salvando) {
      return;
    }

    const titulo = dadosDoFormulario.titulo.trim();

    if (!titulo) {
      setErrosDeCampo({ titulo: 'Informe o nome da tarefa.' });
      document.getElementById('nome-tarefa')?.focus();
      return;
    }

    setSalvando(true);
    setErroDoFormulario('');

    try {
      await chamarApi('/tarefas', {
        method: 'POST',
        body: JSON.stringify({
          titulo,
          descricao: dadosDoFormulario.descricao.trim() || null,
          prioridade: dadosDoFormulario.prioridade,
          data_entrega: dadosDoFormulario.data_entrega || null,
        }),
      });

      fecharFormulario();
      await carregarTarefas();
    } catch (falha) {
      if (falha.semToken) {
        router.push('/login');
        return;
      }

      setErroDoFormulario(falha.message);
    } finally {
      setSalvando(false);
    }
  }

  async function alternarConclusao(tarefa) {
    setOcupada(tarefa.id);
    setErro('');

    try {
      await chamarApi(`/tarefas/${tarefa.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: tarefa.status === 'Concluída' ? 'Pendente' : 'Concluída',
        }),
      });

      await carregarTarefas();
    } catch (falha) {
      tratarFalha(falha);
    } finally {
      setOcupada(null);
    }
  }

  async function excluirTarefa(tarefa) {
    const confirmado = window.confirm(`Remover a tarefa "${tarefa.titulo}"?`);

    if (!confirmado) {
      return;
    }

    setOcupada(tarefa.id);

    try {
      await chamarApi(`/tarefas/${tarefa.id}`, { method: 'DELETE' });
      await carregarTarefas();
    } catch (falha) {
      tratarFalha(falha);
    } finally {
      setOcupada(null);
    }
  }

  function editarTarefa(tarefa) {
    router.push(`/tarefas/${tarefa.id}/editar`);
  }

  return (
    <div className={styles.pagina}>
      <Header />

      <div className={styles.faixaFiltro}>
        <div className={styles.filtroInterno}>
          <span className={styles.filtroRotulo}>Filtrar por:</span>

          <button
            type="button"
            className={`${styles.botaoImportancia} ${
              ordenacao === 'importancia' ? styles.botaoImportanciaAtivo : ''
            }`}
            aria-pressed={ordenacao === 'importancia'}
            onClick={() =>
              setOrdenacao((atual) =>
                atual === 'importancia' ? 'criacao' : 'importancia'
              )
            }
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 3.5h11l3.5 3.5v13.5H5z" />
              <path d="M8 11l1.8 1.8L13 9.6M8 16l1.8 1.8L13 14.6" />
            </svg>
            Importância e urgência
          </button>

          <span className={styles.divisorFiltro} aria-hidden="true" />

          <div className={styles.grupoFiltro} role="group" aria-label="Filtrar por prioridade">
            <button
              type="button"
              className={`${styles.pilulaFiltro} ${
                filtroPrioridade === 'todas' ? styles.pilulaFiltroAtiva : ''
              }`}
              aria-pressed={filtroPrioridade === 'todas'}
              onClick={() => setFiltroPrioridade('todas')}
            >
              Todas
            </button>

            {PRIORIDADES.map((prioridade) => (
              <button
                key={prioridade}
                type="button"
                className={`${styles.pilulaFiltro} ${
                  filtroPrioridade === prioridade ? styles.pilulaFiltroAtiva : ''
                }`}
                aria-pressed={filtroPrioridade === prioridade}
                onClick={() => setFiltroPrioridade(prioridade)}
              >
                {prioridade}
              </button>
            ))}
          </div>

          <label className={styles.selecaoOrdenar}>
            <span>Ordenar por</span>
            <select
              value={ordenacao}
              onChange={(evento) => setOrdenacao(evento.target.value)}
            >
              {ORDENACOES.map((opcao) => (
                <option key={opcao.valor} value={opcao.valor}>
                  {opcao.rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <main className={styles.conteudoTarefas}>
        <header className={styles.cabecalhoLista}>
          <h1>
            Lista de Tarefas
            <span className={styles.marcaCheck} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="m5 12.5 4.5 4.5L19 7" />
              </svg>
            </span>
          </h1>

          <p className={styles.linhaResumo}>
            {carregando
              ? 'Buscando suas tarefas…'
              : `${tarefas.length} ${
                  tarefas.length === 1 ? 'tarefa' : 'tarefas'
                } · ${concluidas.length} concluída${
                  concluidas.length === 1 ? '' : 's'
                } · ${taxaDeConclusao}% de progresso`}
          </p>
        </header>

        {erro ? (
          <p className={styles.mensagemErro} role="alert">
            {erro}
          </p>
        ) : null}

        <div className={styles.quadroTarefas}>
          <PainelTarefas
            titulo="A fazer"
            vazio="Sua lista está vazia. Adicione uma tarefa para começar."
            tarefas={aFazer}
            carregando={carregando}
            classe={styles.painelAFazer}
            ocupada={ocupada}
            aoConcluir={alternarConclusao}
            aoEditar={editarTarefa}
            aoExcluir={excluirTarefa}
            extra={
              <button
                type="button"
                className={styles.botaoAdicionar}
                onClick={abrirFormulario}
              >
                <span aria-hidden="true">＋</span> Adicionar
              </button>
            }
          />

          <div className={styles.colunaPainel}>
            <PainelTarefas
              titulo="Atrasadas"
              vazio="Nenhuma tarefa atrasada."
              tarefas={atrasadas}
              carregando={carregando}
              classe={styles.painelAtrasadas}
              ocupada={ocupada}
              aoConcluir={alternarConclusao}
              aoEditar={editarTarefa}
              aoExcluir={excluirTarefa}
            />

            <PainelTarefas
              titulo="Concluídas"
              vazio="As tarefas concluídas aparecem aqui."
              tarefas={concluidas}
              carregando={carregando}
              classe={styles.painelConcluidas}
              ocupada={ocupada}
              aoConcluir={alternarConclusao}
              aoEditar={editarTarefa}
              aoExcluir={excluirTarefa}
            />
          </div>
        </div>
      </main>

      {formularioAberto ? (
        <div
          className={styles.fundoModal}
          role="presentation"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              fecharFormulario();
            }
          }}
        >
          <section
            className={styles.caixaModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-nova-tarefa"
          >
            <header className={styles.modalCabecalho}>
              <div>
                <span className={styles.modalRotulo}>Nova atividade</span>
                <h2 id="titulo-nova-tarefa">Adicionar tarefa</h2>
              </div>

              <button
                type="button"
                className={styles.botaoFecharModal}
                aria-label="Fechar formulário"
                onClick={fecharFormulario}
              >
                ×
              </button>
            </header>

            <form className={styles.formularioTarefa} onSubmit={cadastrarTarefa} noValidate>
              <label htmlFor="nome-tarefa">
                Tarefa
                <input
                  id="nome-tarefa"
                  type="text"
                  maxLength={120}
                  value={dadosDoFormulario.titulo}
                  onChange={(evento) => atualizarCampo('titulo', evento.target.value)}
                  placeholder="Ex.: revisar anotações"
                  autoComplete="off"
                  autoFocus
                  aria-invalid={Boolean(errosDeCampo.titulo)}
                  aria-describedby={errosDeCampo.titulo ? 'erro-nome-tarefa' : undefined}
                />
              </label>

              {errosDeCampo.titulo ? (
                <span id="erro-nome-tarefa" className={styles.erroCampo} role="alert">
                  {errosDeCampo.titulo}
                </span>
              ) : null}

              <label htmlFor="descricao-tarefa">
                Descrição <span>opcional</span>
                <textarea
                  id="descricao-tarefa"
                  maxLength={500}
                  rows={3}
                  value={dadosDoFormulario.descricao}
                  onChange={(evento) => atualizarCampo('descricao', evento.target.value)}
                  placeholder="Adicione um detalhe que ajude você a começar"
                />
              </label>

              <div className={styles.gradeFormulario}>
                <label htmlFor="prioridade-tarefa">
                  Prioridade
                  <select
                    id="prioridade-tarefa"
                    value={dadosDoFormulario.prioridade}
                    onChange={(evento) =>
                      atualizarCampo('prioridade', evento.target.value)
                    }
                  >
                    {PRIORIDADES.map((prioridade) => (
                      <option key={prioridade} value={prioridade}>
                        {prioridade}
                      </option>
                    ))}
                  </select>
                </label>

                <label htmlFor="prazo-tarefa">
                  Prazo <span>opcional</span>
                  <input
                    id="prazo-tarefa"
                    type="date"
                    value={dadosDoFormulario.data_entrega}
                    onChange={(evento) =>
                      atualizarCampo('data_entrega', evento.target.value)
                    }
                  />
                </label>
              </div>

              {erroDoFormulario ? (
                <p className={styles.mensagemErro} role="alert">
                  {erroDoFormulario}
                </p>
              ) : null}

              <div className={styles.acoesModal}>
                <button
                  type="button"
                  className={styles.botaoCancelar}
                  onClick={fecharFormulario}
                >
                  Cancelar
                </button>

                <button type="submit" className={styles.botaoSalvar} disabled={salvando}>
                  {salvando ? 'Salvando…' : 'Salvar tarefa'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}