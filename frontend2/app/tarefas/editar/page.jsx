'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './editar.module.css';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function EditarTarefas() {
  const router = useRouter();
  const params = useParams();

  const [titulo, setTitulo] = useState('');
  const [status, setStatus] = useState('');
  const [data_entrega, setDataEntrega] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    carregarTarefa();
  }, []);

  async function carregarTarefa() {
    const token = localStorage.getItem('access_token');

    // Se não houver token, redireciona pra a pagina de tarefas
    if (!token) {
      router.push('/tarefas');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/tarefas/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dados = await response.json();

      if (response.ok) {
        setTitulo(dados.titulo || '');
        setStatus(dados.status || '');
        setDataEntrega(dados.data_entrega || '');
      } else {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          router.push('/tarefas');
          return;
        }
        setMensagem(dados.detail || 'Erro ao carregar dados da tarefa.');
      }
    } catch (erro) {
      console.error('Erro de conexão:', erro);
      setMensagem('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  async function salvar(e) {
    e.preventDefault();
    setMensagem('');
    setSucesso(false);

    // Validação simples
    if (titulo.trim().length < 3) {
      setMensagem('O titulo deve ter pelo menos 3 caracteres.');
      return;
    }

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`http://localhost:8000/tarefas/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          status,
          data_entrega,
        }),
      });

      const dados = await response.json();

      if (response.ok) {
        setSucesso(true);
        setMensagem('Tarefa atualizado com sucesso!');
        setTimeout(() => {
          router.push('/tarefa');
        }, 1500);
      } else {
        // Trata erro de status duplicado ou validação
        if (typeof dados.detail === 'string') {
          setMensagem(dados.detail);
        } else if (Array.isArray(dados.detail)) {
          setMensagem(dados.detail[0]?.msg || 'Dados inválidos.');
        } else {
          setMensagem('Erro ao atualizar tarefa.');
        }
      }
    } catch (erro) {
      console.error('Erro ao atualizar:', erro);
      setMensagem('Não foi possível conectar ao servidor.');
    }
  }

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.page}>
          <div className={styles.card}>
            <p>Carregando dados...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Header />
      
      <div className={styles.page}>
        <div className={styles.card}>
          <h1>Editar Tarefa</h1>

          {/* Exibição de mensagem de erro ou sucesso */}
          {mensagem && (
            <div className={sucesso ? styles.sucessoMessage || 'mensagem-sucesso' : 'error-message'}>
              {mensagem}
            </div>
          )}

          <form onSubmit={salvar} className={styles.form}>
            <input
              className={styles.input}
              type="text"
              placeholder="titulo:"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />

            <select
              className={styles.input}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Selecione o status</option>
              <option value="Pendente">Pendente</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Concluída">Concluída</option>
            </select>

            <input
                className={styles.input}
                type="date"
                value={data_entrega}
                onChange={(e) => setDataEntrega(e.target.value)}
            />

            <div className={styles.botoes}>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => router.push('/tarefa')}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}