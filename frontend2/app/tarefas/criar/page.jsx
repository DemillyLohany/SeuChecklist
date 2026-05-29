'use client';

import { useState } from 'react';

export default function Page() {
  const [titulo, setTitulo] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');

    const response = await fetch('http://localhost:8000/tarefas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        titulo,
        data_entrega: dataEntrega,
      }),
    });

    const resultado = await response.json().catch(() => null);

    if (response.ok) {
      setMensagem('Tarefa criada com sucesso!');
      setTitulo('');
      setDataEntrega('');
    } else {
      setMensagem(`Erro: ${resultado?.detail || 'Falha ao criar tarefa'}`);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h1>Cadastro de Tarefas</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          type="date"
          value={dataEntrega}
          onChange={(e) => setDataEntrega(e.target.value)}
        />

        <button type="submit">Criar tarefa</button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}