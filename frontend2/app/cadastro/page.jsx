'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import styles from './cadastro.module.css';
import Header from '../components/header';
import Footer from '../components/footer';

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');

    if (nome.trim().length < 3) {
      setErro(
        'O nome deve ter pelo menos 3 caracteres.',
      );
      return;
    }

    if (senha.length < 8) {
      setErro(
        'A senha deve ter no mínimo 8 caracteres.',
      );
      return;
    }

    setLoading(true);

    try {
      const resposta = await fetch(
        'http://127.0.0.1:8000/usuarios',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: nome.trim(),
            email: email.trim(),
            senha,
          }),
        },
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        if (
          resposta.status === 400 ||
          resposta.status === 409
        ) {
          setErro(
            'Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.',
          );
          return;
        }

        if (typeof dados.detail === 'string') {
          setErro(dados.detail);
        } else if (Array.isArray(dados.detail)) {
          setErro(
            dados.detail[0]?.msg ||
              'Dados inválidos.',
          );
        } else {
          setErro(
            'Erro ao criar a conta. Verifique os dados.',
          );
        }

        return;
      }

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      router.push('/login');
    } catch (error) {
      console.error(
        'Erro ao conectar com o backend:',
        error,
      );

      setErro(
        'Não foi possível conectar ao servidor. Verifique sua conexão.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <Header />

      <main className={styles.page}>
        <section
          className={styles.card}
          aria-labelledby="cadastro-title"
        >
          <div className={styles.imageSide}>
            <img
              src="/imagens/mulher_pag_cadastro.jpg"
              alt="Mulher trabalhando em um notebook"
              className={styles.image}
            />

            <div className={styles.imageOverlay} />

          </div>

          <div className={styles.formSide}>
            <span
              className={styles.decorativeLine}
              aria-hidden="true"
            />

            <h1
              id="cadastro-title"
              className={styles.title}
            >
              Cadastre-se
            </h1>

            {erro && (
              <div
                className={styles.errorMessage}
                role="alert"
              >
                {erro}
              </div>
            )}

            <form
              className={styles.form}
              onSubmit={handleSubmit}
            >
              <input
                className={styles.input}
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(event) =>
                  setNome(event.target.value)
                }
                autoComplete="name"
                required
              />

              <input
                className={styles.input}
                type="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                required
              />

              <input
                className={styles.input}
                type="password"
                placeholder="Mínimo de 8 caracteres"
                value={senha}
                onChange={(event) =>
                  setSenha(event.target.value)
                }
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                className={styles.button}
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'Criando conta...'
                  : 'Criar minha conta'}
              </button>
            </form>

            <div className={styles.separator} />

            <p className={styles.loginText}>
              Já tem uma conta?{' '}

              <Link
                href="/login"
                className={styles.loginLink}
              >
                Entrar
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}