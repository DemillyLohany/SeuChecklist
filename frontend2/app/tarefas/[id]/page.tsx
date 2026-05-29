"use client"

import { useEffect, useState } from "react"

type Tarefa = {
  id: number
  titulo: string
}

export default function EditarTarefa({
  params,
}: {
  params: { id: string }
}) {
  const [titulo, setTitulo] = useState("")

  useEffect(() => {
    async function carregarTarefa() {
      const resposta = await fetch(
        `http://127.0.0.1:8000/tarefas/${params.id}`
      )

      const tarefa: Tarefa = await resposta.json()

      setTitulo(tarefa.titulo)
    }

    carregarTarefa()
  }, [params.id])

  async function editarTarefa(e: React.FormEvent) {
    e.preventDefault()

    const resposta = await fetch(
      `http://127.0.0.1:8000/tarefas/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
        <div>
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>


        <button type="submit">Salvar</button>
      </form>
    </main>
  )
}