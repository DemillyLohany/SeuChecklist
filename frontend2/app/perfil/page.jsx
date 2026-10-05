'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './perfil.module.css';
import { useRouter } from 'next/navigation';
import Footer from '../components/footer';
import Header from '../components/header';

function mensagemDaApi(dados, padrao) {
  if (typeof dados?.detail === 'string') {
    return dados.detail;
  }

  if (Array.isArray(dados?.detail)) {
    return dados.detail
      .map((item) => item.msg || item.message)
      .filter(Boolean)
      .join(' ');
  }

  return padrao;
}

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erros, setErros] = useState({});
  const [precisaLogin, setPrecisaLogin] = useState(false);
  const router = useRouter();

  const carregarPerfil = useCallback(async () => {
    setLoading(true);
    setMensagem('');
    setErros({});
    setPrecisaLogin(false);

    const token = localStorage.getItem('access_token');

    // Se nem tiver token, expulsa pro login direto
    if (!token) {
      setMensagem('Sua sessão terminou. Faça login novamente.');
      setPrecisaLogin(true);
      setLoading(false);
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/usuarios/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      let dados = {};

      try {
        dados = await response.json();
      } catch {
        dados = {};
      }

      if (!response.ok) {
        // Se a resposta for 401 (Não Autorizado/Expirado), limpa a sessão antiga
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setMensagem('Sessão expirada. Por favor, faça login novamente.');
          setPrecisaLogin(true);
        } else {
          setMensagem(
            mensagemDaApi(
              dados,
              'Não foi possível carregar as informações do perfil.'
            )
          );
        }

        return;
      }

      if (!dados || typeof dados !== 'object') {
        setMensagem('O servidor retornou dados de perfil inválidos.');
        return;
      }

      const nome = typeof dados.nome === 'string' ? dados.nome.trim() : '';
      const email = typeof dados.email === 'string' ? dados.email.trim() : '';
      const novosErros = {};

      if (!nome) {
        novosErros.nome = 'O servidor não retornou o nome do usuário.';
      }

      if (!email) {
        novosErros.email = 'O servidor não retornou o e-mail do usuário.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        novosErros.email = 'O servidor retornou um e-mail inválido.';
      }

      setUsuario({ ...dados, nome, email });
      setErros(novosErros);

      if (Object.keys(novosErros).length > 0) {
        setMensagem('Algumas informações do perfil estão ausentes ou inválidas.');
      }
    } catch {
      setMensagem('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  function logout() {
    // Limpa todos os tokens salvos no navegador ao sair
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  }

  return (
    <div className={styles.wrapper}>
      <Header />

      <main className={styles.page} aria-busy={loading}>
        {loading && (
          <div className={styles.card}>
            {/* 1. Tela de Carregando */}
            <p className={styles.loadingText} role="status">
              Carregando informações do perfil...
            </p>
          </div>
        )}

        {!loading && !usuario && (
          <div className={styles.card}>
            {/* 2. Se terminou de carregar mas deu erro (não veio usuário) */}
            <div className={`error-message ${styles.errorMessage}`} role="alert">
              {mensagem || 'Não foi possível carregar o perfil.'}
            </div>

            <button
              className={styles.button}
              type="button"
              onClick={() => {
                if (precisaLogin) {
                  router.push('/login');
                } else {
                  carregarPerfil();
                }
              }}
            >
              {precisaLogin ? 'Ir para o Login' : 'Tentar novamente'}
            </button>
          </div>
        )}

        {!loading && usuario && (
          <div className={styles.card}>
            {/* 3. Conteúdo principal quando o usuário está autenticado */}
            {mensagem && (
              <div className={`error-message ${styles.errorMessage}`} role="alert">
                {/* Mensagem de erro global caso ocorra algum problema com o usuário logado */}
                {mensagem}
              </div>
            )}

            <div className={styles.infosPerfil}>
              <div className={styles.infosNecessariasPerfil}>
                <h1>Meu Perfil</h1>

                <div className={styles.form}>
                  <div className={styles.campo}>
                    <label htmlFor="perfil-email">E-mail</label>
                    <input
                      id="perfil-email"
                      className={`${styles.input} ${erros.email ? styles.inputErro : ''}`}
                      type="email"
                      value={usuario.email || ''}
                      readOnly
                      aria-invalid={Boolean(erros.email)}
                      aria-describedby={erros.email ? 'erro-email' : undefined}
                    />
                    {erros.email && (
                      <span
                        id="erro-email"
                        className={styles.fieldError}
                        role="alert"
                      >
                        {erros.email}
                      </span>
                    )}
                  </div>

                  <div className={styles.campo}>
                    <label htmlFor="perfil-nome">Nome</label>
                    <input
                      id="perfil-nome"
                      className={`${styles.input} ${erros.nome ? styles.inputErro : ''}`}
                      type="text"
                      value={usuario.nome || ''}
                      readOnly
                      aria-invalid={Boolean(erros.nome)}
                      aria-describedby={erros.nome ? 'erro-nome' : undefined}
                    />
                    {erros.nome && (
                      <span
                        id="erro-nome"
                        className={styles.fieldError}
                        role="alert"
                      >
                        {erros.nome}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.botoes}>
                  <button
                    className={styles.button}
                    type="button"
                    onClick={logout}
                  >
                    Sair
                  </button>

                  <button
                    className={styles.button}
                    type="button"
                    onClick={() => router.push('/perfil/editar')}
                  >
                    Editar Perfil
                  </button>
                </div>
              </div>

              <div className={styles.fotoPerfil}>
                {/* isso de foto tem que ser adcionado ainda */}
                <img src="/foto.png" alt="Foto de perfil" />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}