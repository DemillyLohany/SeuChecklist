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
    setMensagem(''); // Limpa mensagens de erro anteriores
    setCarregando(true);

    try {
      // Limpa dados de sessões antigas no navegador antes de tentar o novo login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

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

      if (response.ok && resultado?.access_token) {
        // Salva os novos tokens no localStorage
        localStorage.setItem('access_token', resultado.access_token);
        if (resultado.refresh_token) {
          localStorage.setItem('refresh_token', resultado.refresh_token);
        }

        // Redireciona para a lista de tarefas
        router.push('/tarefas');
      } else {
        // Trata a mensagem de erro que vem do backend (FastAPI)
        if (typeof resultado?.detail === 'string') {
          setMensagem(resultado.detail);
        } else if (Array.isArray(resultado?.detail)) {
          setMensagem(resultado.detail[0]?.msg || 'Dados inválidos.');
        } else {
          setMensagem('E-mail ou senha incorretos.');
        }
      }
    } catch (erro) {
      console.error('Erro de conexão:', erro);
      setMensagem('Não foi possível conectar ao servidor. Verifique sua conexão.');
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

            {/* Exibição visual de erro padronizada com o globals.css */}
            {mensagem && (
              <div className="error-message">
                {mensagem}
              </div>
            )}

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