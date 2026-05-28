'use client';

import { useState } from 'react';

export default function Cadastro() {
  //estados para capturar os dados do contrato 'UsuarioCria'
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    //o corpo da requisição deve ser um JSON estruturadozinho
    const dadosUsuario = { nome, email, senha };

    try {
      const response = await fetch('http://localhost:8000/usuarios', {
        method: 'POST', //verbo padrão para criação em REST
        headers: {'Content-Type': 'application/json', //define a linguagem de descrição(no caso, JSON)
        },
        body: JSON.stringify(dadosUsuario),
      });

      let resultado = null;

      try {
        resultado = await response.json();
      } catch (e) {
        resultado = null;
      }

      if (response.ok) {
        setMensagem('Usuário cadastrado com sucesso!');
        //serve para limpar os campos após o sucesso
        setNome(''); setEmail(''); setSenha('');
      } else { setMensagem(`Erro: ${resultado.detail || 'Falha ao cadastrar'}`);}
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h1>Cadastro de Usuário</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required style={{width: '100%'}} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{width: '100%'}} />
        </div>
        <div>
          <label>Senha:</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required style={{width: '100%'}} />
        </div>
        <button type="submit" style={{ marginTop: '10px', width: '100%' }}>
          Cadastrar
        </button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}