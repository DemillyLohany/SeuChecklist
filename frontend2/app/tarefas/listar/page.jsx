'use client';

import { useEffect, useState } from 'react';

export default function PaginaTarefas() {
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    async function carregar() {
      const token = localStorage.getItem('access_token');

      const resposta = await fetch("http://127.0.0.1:8000/tarefas", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        throw new Error("Erro ao buscar tarefas");
      }

      const data = await resposta.json();
      setTarefas(data);
    }

    carregar();
  }, []);

  return (
    <div>
      <h1>Lista de Tarefas</h1>

      {tarefas.map((tarefa) => (
        <div key={tarefa.id}>
          <h2>{tarefa.titulo}</h2>
          <p>{tarefa.descricao}</p>
        </div>
      ))}
    </div>
  );
}