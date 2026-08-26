'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './cadastro.module.css';
import Header from '../components/header';
import Footer from '../components/footer';

export default function Cadastro() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e) => {   //função que aparece quando o formulário é enviado
    e.preventDefault(); // para a página não recarregar

    try {
      const resposta = await fetch('http://127.0.0.1:8000/usuarios', {
        method: 'POST', // enviar dados
        headers: {
          'Content-Type': 'application/json',
        }, // avisando que os dados são em json
        body: JSON.stringify({
          email: email,
          nome: nome,
          senha: senha,
        }), // conteúdo que vai ser enviado
      });

      const dados = await resposta.json(); // transforma a resposta em json

      if (!resposta.ok) { // se o cadastro deu ruim
        // Verifica se o erro é de e-mail já cadastrado (Status 400 ou 409)
        if (resposta.status === 400 || resposta.status === 409) {
          alert('E-mail já cadastrado! Redirecionando para a página de login...');
          router.push('/login');
          return;
        }

        console.error('Erro no cadastro:', dados); // mensagem no console
        alert(dados.detail || 'Erro no cadastro!'); //mensagem na tela
        return;
      }

      // esse daqui é se deu certo o cadastro
      console.log('Cadastro realizado:', dados);// mensagem no console

      // redireciona para a página de listar tarefas
      router.push('/tarefas/listar');

    } catch (erro) { // esse daqui é caso dê erro na conexão
      console.error('Erro ao conectar com o backend:', erro);
      alert('Não foi possível conectar ao servidor.');
    }
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