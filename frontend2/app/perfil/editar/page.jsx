'use client';

import { useEffect, useState } from 'react';
import styles from './editar.module.css';
import { useRouter } from 'next/navigation';

export default function EditarPerfil() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    const token = localStorage.getItem('access_token');

    const response = await fetch(
      'http://localhost:8000/usuarios/me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const dados = await response.json();

    if (response.ok) {
      setNome(dados.nome);
      setEmail(dados.email);
    }
  }

  async function salvar(e) {
    e.preventDefault();

    const token = localStorage.getItem('access_token');

    const response = await fetch(
      'http://localhost:8000/usuarios/',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          email,
        }),
      }
    );

    if (response.ok) {
      setMensagem('Perfil atualizado!');
      setTimeout(() => {
        router.push('/perfil');
      }, 1000);
    } else {
      setMensagem('Erro ao atualizar perfil.');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Editar Perfil</h1>

        <form onSubmit={salvar} className={styles.form}>
          <input 
            className={styles.input} 
            type="email" 
            placeholder="Email:"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />

            <input
              className={styles.input}
              type="text"
              placeholder="Nome:"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
              <div className={styles.botoes}>
                <button type="submit">Salvar</button>
              </div>
        </form>

        {mensagem && <p>{mensagem}</p>}
        
      </div>
    </div>
  );
}