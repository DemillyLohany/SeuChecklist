'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './editar.module.css';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function EditarPerfil() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    const token = localStorage.getItem('access_token');

    // Se não houver token, redireciona pro login
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/usuarios/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dados = await response.json();

      if (response.ok) {
        setNome(dados.nome || '');
        setEmail(dados.email || '');
      } else {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          router.push('/login');
          return;
        }
        setMensagem(dados.detail || 'Erro ao carregar dados do usuário.');
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
    if (nome.trim().length < 3) {
      setMensagem('O nome deve ter pelo menos 3 caracteres.');
      return;
    }

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://localhost:8000/usuarios/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          email,
        }),
      });

      const dados = await response.json();

      if (response.ok) {
        setSucesso(true);
        setMensagem('Perfil atualizado com sucesso!');
        setTimeout(() => {
          router.push('/perfil');
        }, 1500);
      } else {
        // Trata erro de email duplicado ou validação
        if (typeof dados.detail === 'string') {
          setMensagem(dados.detail);
        } else if (Array.isArray(dados.detail)) {
          setMensagem(dados.detail[0]?.msg || 'Dados inválidos.');
        } else {
          setMensagem('Erro ao atualizar perfil.');
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
          <h1>Editar Perfil</h1>

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
              placeholder="Nome:"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <input
              className={styles.input}
              type="email"
              placeholder="Email:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className={styles.botoes}>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => router.push('/perfil')}>
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