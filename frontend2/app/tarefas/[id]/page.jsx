'use client'

import { useEffect, useState } from "react"

export default function EditarTarefa({ params }) {
  const [titulo, setTitulo] = useState("")

  useEffect(() => {
    async function carregarTarefa() {
      const token = localStorage.getItem('access_token')

      const resposta = await fetch(
        `http://127.0.0.1:8000/tarefas/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const tarefa = await resposta.json()

      setTitulo(tarefa.titulo)
    }

    carregarTarefa()
  }, [params.id])

  async function editarTarefa(e) {
    e.preventDefault()

    const token = localStorage.getItem('access_token')

    const resposta = await fetch(
      `http://127.0.0.1:8000/tarefas/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
        }),
      }
    )

    if (resposta.ok) {
      alert("Tarefa atualizada!")
    } else {
      alert("Erro ao atualizar")
    }
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>Editar Tarefa</h1>

      <form onSubmit={editarTarefa}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <button type="submit">Salvar</button>
      </form>
    </main>
  )
}