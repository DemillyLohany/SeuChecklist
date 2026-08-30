'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '../../components/footer';
import Header from '../../components/header';

export default function ListarTarefas() {
  const router = useRouter();

  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');

  // Busca as tarefas assim que a página carrega
  useEffect(() => {
    const carregarTarefas = async () => {
      const token = localStorage.getItem('access_token');

      // Se não tiver token salvo, redireciona para o login
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/tarefas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const resultado = await response.json().catch(() => null);

        if (
          response.status === 401 ||
          resultado?.detail === 'Token inválido ou expirado'
        ) {
          // Sessão expirada: avisa o usuário sem travar a tela com alert()
          // e redireciona para o login após um curto delay
          localStorage.removeItem('access_token');
          setMensagem('Sua sessão expirou. Redirecionando para o login...');
          setTimeout(() => router.push('/login'), 1500);
          return;
        }

        if (!response.ok) {
          setMensagem(`Erro: ${resultado?.detail || 'Falha ao buscar tarefas'}`);
          return;
        }

        // Guarda a lista de tarefas no estado
        setTarefas(resultado || []);
      } catch (erro) {
        console.error('Erro ao conectar:', erro);
        setMensagem('Erro ao conectar com o servidor.');
      } finally {
        setCarregando(false);
      }
    };

    carregarTarefas();
  }, [router]);

  return (
    <div className="wrapper">
      <Header />

      <main className="main">
        <div style={{ maxWidth: 600, margin: 'auto', padding: '20px' }}>
          <h1>Minhas Tarefas</h1>

          {/* Botão para criar nova tarefa */}
          <Link href="/tarefas/criar">
            <button style={{ marginBottom: '20px' }}>+ Nova Tarefa</button>
          </Link>

          {carregando && <p>Carregando tarefas...</p>}

          {mensagem && <p>{mensagem}</p>}

          {!carregando && tarefas.length === 0 && !mensagem && (
            <p>Você ainda não possui nenhuma tarefa cadastrada.</p>
          )}

          {/* Lista de tarefas */}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tarefas.map((tarefa) => (
              <li
                key={tarefa.id || tarefa._id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '10px',
                }}
              >
                <h3>{tarefa.titulo}</h3>
                {tarefa.data_entrega && (
                  <p>
                    Data de Entrega:{' '}
                    {new Date(tarefa.data_entrega).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}