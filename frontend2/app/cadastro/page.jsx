'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './cadastro.module.css';
import Header from '../components/header';
import Footer from '../components/footer';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.wrapper}>
      <Header />

      {/* DIV GRANDE */}
      <main className={styles.page}>
        
        {/* DIV 1: FORMULÁRIO (Centralizado) */}
        <div className={styles.formBox}>
          <h1 className={styles.title}>Cadastre-se!</h1>

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
              type="text"
              placeholder="Digite seu nome:"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <input
              className={styles.input}
              type="password"
              placeholder="Crie sua senha:"
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
              Clique aqui
            </Link>{' '}
            e faça login!
          </p>
        </div>

        {/* DIV 2: IMAGEM DA MOÇA (Colada na direita) */}
        <div className={styles.imageBox}>
          <img
            src="/imagens/mulher_pag_cadastro.png"
            alt="Mulher estudando no notebook"
            className={styles.personImage}
          />
        </div>

      </main>

      <Footer />
    </div>
  );
}