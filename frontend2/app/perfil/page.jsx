'use client';

import { useEffect,useState} from 'react';
import styles from './perfil.module.css';

export default function Perfil() {
    const [usuario, setUsuario] = useState(null);
    const [mensagem, setMensagem] = useState('');
    const [editando, setEditando] = useState(false); //pra saber se tá editando a páginazinha

    useEffect(() => {
        carregarPerfil();
    }, []);

    async function carregarPerfil() {
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(
        'http://localhost:8000/usuarios/me',
        {headers: {Authorization: `Bearer ${token}`,},}
      );

      const dados = await response.json();

      if (response.ok) {
        setUsuario(dados);
      } else {
        setMensagem('Erro ao carregar perfil');
      }
    } catch {
      setMensagem('Erro ao conectar com o servidor');
    }
  }

  function logout() {localStorage.removeItem('access_token');} // função para meter um logout quando for chamada

  if (!usuario) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Meu Perfil</h1>

        <form className={styles.form}>

        <label>Nome:</label>
        <input type="text" value={usuario.nome}/>
        <label>Email:</label>
        <input type="email" value={usuario.email}/>
        </form>

        {mensagem && <p>{mensagem}</p>}
        <div className={styles.botoes}>
            <button onClick={logout}>Sair</button>
            <button onClick={() => setEditando(true)}>Editar Perfil</button>
        </div>
        
      </div>
    </div>
  );
}
