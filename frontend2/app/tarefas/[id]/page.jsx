'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function EditarTarefa() {
  const params = useParams()
  const [titulo, setTitulo] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarTarefa() {
      try {
        const token = localStorage.getItem("access_token")

        const resposta = await fetch(
          `http://127.0.0.1:8000/tarefas/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!resposta.ok) {
          throw new Error(await resposta.text())
        }

        const tarefa = await resposta.json()
        setTitulo(tarefa.titulo)
      } catch (err) {
        console.log(err)
        alert("Erro ao carregar tarefa")
      } finally {
        setLoading(false)
      }
    }

    if (params?.id) {
      carregarTarefa()
    }
  }, [params?.id])

  async function editarTarefa(e) {
    e.preventDefault()

    try {
      const token = localStorage.getItem("access_token")

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

      if (!resposta.ok) {
        throw new Error(await resposta.text())
      }

      alert("Tarefa atualizada!")
    } catch (err) {
      console.log(err)
      alert("Erro ao atualizar tarefa")
    }
  }

  if (loading) {
    return <p>Carregando...</p>
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