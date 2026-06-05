'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './cadastro.module.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dadosUsuario = { nome, email, senha };

    try {
      const response = await fetch('http://localhost:8000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosUsuario),
      });

      const resultado = await response.json().catch(() => null);

      if (response.ok) {
        setMensagem('Usuário cadastrado com sucesso!');
        setNome('');
        setEmail('');
        setSenha('');
      } else {
        setMensagem(`Erro: ${resultado?.detail || 'Falha ao cadastrar'}`);
      }
    } catch {
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className={styles.page}>

      {/* LADO ESQUERDO */}
      <div className={styles.formContainer}>

        <h1 className={styles.title}>Cadastre-se!</h1>

        <form onSubmit={handleSubmit} className={styles.form}>

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
            Clique aqui e faça login!
          </Link>
        </p>

        {mensagem && <p className={styles.message}>{mensagem}</p>}

      </div>

      {/* Lado direito (imagem) */}
      <div className={styles.imageContainer}>
        <img
          src="/imagens/cadastro.png"
          alt="Cadastro"
          className={styles.image}
        />
      </div>

    </div>
  );
}