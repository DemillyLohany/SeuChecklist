'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './cadastro.module.css';
import Footer from '../components/footer';
import Header from '../components/header';


export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dadosUsuario = { nome, email, senha };

    try {
      const cadastro = await fetch('http://localhost:8000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosUsuario),
      });

      const resultadoCadastro = await cadastro.json().catch(() => null);

      if (!cadastro.ok) {
        setMensagem(`Erro: ${resultadoCadastro?.detail || 'Falha ao cadastrar'}`);
        return;
      }

      setMensagem('Usuário criado! Entrando automaticamente...');

      const formLogin = new URLSearchParams();
      formLogin.append('username', email);
      formLogin.append('password', senha);

      const login = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formLogin,
      });

      const resultadoLogin = await login.json().catch(() => null);

      if (!login.ok) {
        setMensagem('Conta criada, mas erro ao logar automaticamente.');
        setTimeout(() => router.push('/login'), 1000);
        return;
      }

      localStorage.setItem('access_token', resultadoLogin.access_token);
      localStorage.setItem('refresh_token', resultadoLogin.refresh_token);

      router.push('/tarefas/listar');
    } catch (erro) {
      console.error(erro);
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.page}>
        <div className={styles.formContainer}>
          <div className={styles.formBox}>
            <h1 className={styles.title}>Cadastre-se!</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                className={styles.input}
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                className={styles.input}
                type="text"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <input
                className={styles.input}
                type="password"
                placeholder="Crie sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />

              <button className={styles.button} type="submit">
                Cadastrar
              </button>
            </form>

            <p className={styles.loginText}>
              Já possui uma conta?{' '}
              <Link href="/login" className={styles.link}>
                Clique aqui e faça login!
              </Link>
            </p>

            {mensagem && (
              <p className={styles.message}>
                {mensagem}
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}