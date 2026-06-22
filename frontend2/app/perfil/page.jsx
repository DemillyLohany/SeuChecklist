'use client';

import { useEffect,useState} from 'react';
import styles from './perfil.module.css';
import { useRouter } from 'next/navigation';

export default function Perfil() {
    const [usuario, setUsuario] = useState(null);
    const [mensagem, setMensagem] = useState('');
    // const [editando, setEditando] = useState(false); //pra saber se tá editando a páginazinha
    const router = useRouter();

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

  function logout() {
    localStorage.removeItem('access_token'); //remove o token
    router.push('/login'); //redireciona para o login
  } // função para meter um logout quando for chamada

  if (!usuario) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Meu Perfil</h1>

        <form className={styles.form}>
          <input 
            className={styles.input} 
            type="email" 
            placeholder="Email:"
            value={usuario.email} 
            // readOnly={!editando} 
            onChange={(e) =>
              setUsuario({
                ...usuario,
                email: e.target.value
              })
            }
          />

            <input
              className={styles.input}
              type="text"
              placeholder="Nome:"
              value={usuario.nome}
              // readOnly={!editando}
              onChange={(e) =>
                setUsuario({
                  ...usuario,
                  nome: e.target.value
                })
              }
            />
        </form>
        {mensagem && <p>{mensagem}</p>}
        <div className={styles.botoes}>
            <button type="button" onClick={logout}>Sair</button>
            {/* <button type="button" onClick={() => setEditando(true)}>Editar Perfil</button> */}
            <button onClick={() => router.push('/perfil/editar')}>Editar Perfil</button>  
        </div>
        
      </div>
    </div>
  );
}
