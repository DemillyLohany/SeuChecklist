'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './header.module.css';

// itens do menu do site
const linksDoMenu = [
  {
    href: '/',
    rotulo: 'Início',
    icone: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10.8 12 3l9 7.8v9.2a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    href: '/relatorio',
    rotulo: 'Relatório',
    icone: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="5" rx="2" />
        <rect x="13" y="10" width="8" height="11" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
      </svg>
    ),
  },
  {
    href: '/tarefas',
    rotulo: 'Tarefas',
    icone: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M8 13l2 2 5-5" />
      </svg>
    ),
  },
  {
    href: '/perfil',
    rotulo: 'Perfil',
    icone: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 21c.7-4 3-6 7-6s6.3 2 7 6" />
      </svg>
    ),
  },
];

export default function Header() {
  const caminhoAtual = usePathname();

  return (
    <header className={styles.cabecalho}>
      <Link className={styles.marca} href="/" aria-label="SeuChecklist, início">
        <img src="/logo-reference.png" alt="SeuChecklist" />
      </Link>

      <nav className={styles.menu} aria-label="Navegação principal">
        {linksDoMenu.map((item) => {
          const ativo =
            item.href === '/'
              ? caminhoAtual === '/'
              : caminhoAtual.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.linkMenu} ${ativo ? styles.linkAtivo : ''}`}
              aria-current={ativo ? 'page' : undefined}
            >
              <span className={styles.iconeMenu}>{item.icone}</span>
              <span>{item.rotulo}</span>
            </Link>
          );
        })}
      </nav>

      <Link className={styles.botaoEntrar} href="/login">
        Entrar
      </Link>
    </header>
  );
}