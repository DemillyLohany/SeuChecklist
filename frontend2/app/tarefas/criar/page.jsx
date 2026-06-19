'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://localhost:8000/tarefas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          data_entrega: dataEntrega || null,
        }),
      });

      const resultado = await response.json().catch(() => null);

      if (
        response.status === 401 ||
        resultado?.detail === 'Token inválido ou expirado'
      ) {
        alert('Sua sessão expirou. Faça login novamente.');

        localStorage.removeItem('access_token');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        setMensagem(
          `Erro: ${resultado?.detail || 'Falha ao criar tarefa'}`
        );
        return;
      }

      setMensagem('Tarefa criada com sucesso!');

      setTimeout(() => {
        router.push('/tarefas/listar');
      }, 1000);
    } catch (erro) {
      console.error('Erro ao conectar:', erro);
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h1>Cadastro de Tarefas</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <input
          type="date"
          value={dataEntrega}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDataEntrega(e.target.value)}
        />

        <button type="submit">Criar tarefa</button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}