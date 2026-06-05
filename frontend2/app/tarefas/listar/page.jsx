'use client';

import { useEffect, useState } from 'react';

export default function PaginaTarefas() {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    carregarTarefas();
  }, []);

  async function carregarTarefas() {
    const token = localStorage.getItem('access_token');

    const resposta = await fetch("http://127.0.0.1:8000/tarefas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resposta.ok) {
      console.log(await resposta.text());
      return;
    }

    const data = await resposta.json();
    setTarefas(data);
  }

  async function deletarTarefa(id) {
    const token = localStorage.getItem('access_token');

    const resposta = await fetch(`http://127.0.0.1:8000/tarefas/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resposta.ok) {
      const erro = await resposta.text();
      console.log(erro);
      alert("Erro ao deletar tarefa");
      return;
    }

    setTarefas((prev) => prev.filter((t) => t.id !== id));
    alert("Tarefa deletada!");
  }

  return (
    <div>
      <h1>Lista de Tarefas</h1>

      {tarefas.map((tarefa) => (
        <div key={tarefa.id} style={{ marginBottom: '10px' }}>
          <h2>{tarefa.titulo}</h2>
          <p>{tarefa.descricao}</p>

          <button onClick={() => deletarTarefa(tarefa.id)}>
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}