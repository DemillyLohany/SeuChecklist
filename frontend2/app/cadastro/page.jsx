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

  // Estados para controle de validação, erro e carregamento
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {   // função que roda ao enviar o formulário
    e.preventDefault(); // impede o recarregamento da página
    setErro(''); // limpa erros anteriores

    // Validações locais (Front-end)
    if (nome.trim().length < 3) {
      setErro('O nome deve ter pelo menos 3 caracteres.');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const resposta = await fetch('http://127.0.0.1:8000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          nome: nome,
          senha: senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) { // Trata os erros retornados pelo backend
        // Se for erro de e-mail duplicado (Status 400 ou 409)
        if (resposta.status === 400 || resposta.status === 409) {
          setErro('Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.');
          return;
        }

        console.error('Erro no cadastro:', dados);
        
        // Trata mensagens de erro gerais vindas do FastAPI
        if (typeof dados.detail === 'string') {
          setErro(dados.detail);
        } else if (Array.isArray(dados.detail)) {
          setErro(dados.detail[0]?.msg || 'Dados inválidos.');
        } else {
          setErro('Erro ao realizar o cadastro. Verifique os dados.');
        }

        return;
      }

      // Se o cadastro deu certo:
      console.log('Cadastro realizado com sucesso:', dados);

      // Limpa token do usuário anterior por segurança
      localStorage.removeItem('access_token');

      // Redireciona para a página de login para autenticação
      router.push('/login');

    } catch (erro) { // Trata falha de rede/conexão
      console.error('Erro ao conectar com o backend:', erro);
      setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header />

      <main className={styles.page}>

        {/* Formulário (Centralizado) */}
        <div className={styles.formBox}>
          <h1 className={styles.title}>Cadastre-se!</h1>

          {/* Exibição visual da mensagem de erro */}
          {erro && <div className="error-message">{erro}</div>}

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

            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
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

        {/* Imagem lateral */}
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