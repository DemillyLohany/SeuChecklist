// 'use client'; //diz que roda no navegador

// import { useState } from 'react'; // serve para guardar us dados
// import { useRouter } from 'next/navigation'; // serve para jogar o usuario dps do login feito

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setCarregando(true);

    try {
      const dadosFormulario = new URLSearchParams();
      dadosFormulario.append('username', email);
      dadosFormulario.append('password', senha);

      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: dadosFormulario,
      });

      let resultado = null;

      try {
        resultado = await response.json();
      } catch {
        resultado = null;
      }

      if (response.ok) {
        localStorage.setItem('access_token', resultado.access_token);
        localStorage.setItem('refresh_token', resultado.refresh_token);

        setMensagem('Login realizado com sucesso!');
        setEmail('');
        setSenha('');

        router.push('/tarefas/listar');
      } else {
        setMensagem(resultado?.detail || 'E-mail ou senha incorretos');
      }
    } catch {
      setMensagem('Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="senha">Senha:</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          style={{ width: '100%', padding: '10px' }}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {mensagem && <p style={{ marginTop: '12px' }}>{mensagem}</p>}
    </div>
  );
}
  