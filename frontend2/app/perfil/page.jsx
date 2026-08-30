'use client';

import { useEffect, useState } from 'react';
import styles from './perfil.module.css';
import { useRouter } from 'next/navigation';
import Footer from '../components/footer';
import Header from '../components/header';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const router = useRouter();

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    const token = localStorage.getItem('access_token');

    // Se nem tiver token, expulsa pro login direto
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const dados = await response.json();

      if (response.ok) {
        setUsuario(dados);
      } else {
        // Se a resposta for 401 (Não Autorizado/Expirado), limpa a sessão antiga
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setMensagem('Sessão expirada. Por favor, faça login novamente.');
        } else {
          setMensagem(dados.detail || 'Não foi possível carregar as informações do perfil.');
        }
      }
    } catch (erro) {
      console.error('Erro de conexão:', erro);
      setMensagem('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    // Limpa todos os tokens salvos no navegador ao sair
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  }

  // 1. Tela de Carregando
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.page}>
          <div className={styles.card}>
            <p className={styles.loadingText}>Carregando informações do perfil...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // 2. Se terminou de carregar mas deu erro (não veio usuário)
  if (!usuario) {
    return (
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.page}>
          <div className={styles.card}>
            {/* Mensagem de erro estilizada com o globals.css */}
            <div className="error-message">
              {mensagem || 'Não foi possível carregar o perfil.'}
            </div>
            
            <button className={styles.button} onClick={() => router.push('/login')}>
              Ir para o Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // 3. Conteúdo principal quando o usuário está autenticado
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.page}>
        <div className={styles.card}>
          <h1>Meu Perfil</h1>

          {/* Mensagem de erro global caso ocorra algum problema com o usuário logado */}
          {mensagem && <div className="error-message">{mensagem}</div>}

          <form className={styles.form}>
            <input 
              className={styles.input} 
              type="email" 
              placeholder="Email"
              value={usuario.email || ''} 
              readOnly
            />

            <input
              className={styles.input}
              type="text"
              placeholder="Nome"
              value={usuario.nome || ''}
              readOnly
            />
          </form>

          <div className={styles.botoes}>
            <button type="button" onClick={logout}>Sair</button>
            <button type="button" onClick={() => router.push('/perfil/editar')}>
              Editar Perfil
            </button> 
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}