'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function EditarTarefa() {
  const params = useParams()

  const [titulo, setTitulo] = useState("")
  const [dataEntrega, setDataEntrega] = useState("")
  const [loading, setLoading] = useState(true)
  const [mensagem, setMensagem] = useState("")

  const hoje = new Date().toISOString().split("T")[0]

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

        console.log("Tarefa recebida:", tarefa)

        setTitulo(tarefa.titulo || "")

        if (tarefa.data_entrega) {
          setDataEntrega(tarefa.data_entrega.split("T")[0])
        }
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

    if (dataEntrega && dataEntrega < hoje) {
      setMensagem("A data não pode estar no passado.")
      return
    }

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
            data_entrega: dataEntrega || null,
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
        <div>
          <label>Título</label>
          <br />
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Prazo</label>
          <br />
          <input
            type="date"
            value={dataEntrega}
            min={hoje}
            onChange={(e) => setDataEntrega(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Salvar
        </button>

        {mensagem && <p>{mensagem}</p>}
      </form>
    </main>
  )
}