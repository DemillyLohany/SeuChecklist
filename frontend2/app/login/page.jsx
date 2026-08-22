'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';
import Footer from '../components/footer';
import Header from '../components/header';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setCarregando(true);

    try {
      const dadosFormulario = new URLSearchParams();
      dadosFormulario.append('username', email);
      dadosFormulario.append('password', senha);

      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: dadosFormulario,
      });

      const resultado = await response.json().catch(() => null);

      if (response.ok && resultado) {
        localStorage.setItem('access_token', resultado.access_token);
        localStorage.setItem('refresh_token', resultado.refresh_token);

        router.push('/tarefas/listar');
      } else {
        setMensagem(resultado?.detail || 'E-mail ou senha incorretos');
      }
    } catch {
      setMensagem('Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      
      <main className={styles.page}>
        <div className={styles.formContainer}>
          <div className={styles.formBox}>
            <h1 className={styles.title}>Faça login!</h1>

            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                className={styles.input}
                type="email"
                placeholder="Digite seu e-mail:"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                className={styles.input}
                type="password"
                placeholder="Digite sua senha:"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />

              <button
                className={styles.button}
                type="submit"
                disabled={carregando}
              >
                {carregando ? 'Acessando...' : 'Acessar'}
              </button>
            </form>

            {mensagem && (
              <p className={styles.message}>
                {mensagem}
              </p>
            )}

            <p className={styles.registerText}>
              Não possui uma conta?{' '}
              <Link href="/cadastro" className={styles.link}>
                Clique aqui
              </Link>{' '}
              e faça seu cadastro!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}