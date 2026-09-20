'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './header.module.css';

const navigationItems = [
  {
    href: '/',
    label: 'Início',
    icon: 'fa-solid fa-house',
  },
  {
    href: '/tarefas',
    label: 'Tarefas',
    icon: 'fa-solid fa-list-check',
  },
  {
    href: '/perfil',
    label: 'Perfil',
    icon: 'fa-solid fa-user',
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <Link
        className={styles.brand}
        href="/"
        aria-label="SeuChecklist, início"
      >
        <img
          className={styles.logo}
          src="/logo-reference.png"
          alt="SeuChecklist"
        />
      </Link>

      <nav
        className={styles.navigation}
        aria-label="Navegação principal"
      >
        {navigationItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navigationLink} ${
                isActive ? styles.active : ''
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <i
                className={`${item.icon} ${styles.icon}`}
                aria-hidden="true"
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        className={styles.loginButton}
        href="/login"
      >
        <i
          className={`fa-solid fa-right-to-bracket ${styles.loginIcon}`}
          aria-hidden="true"
        />

        <span>Entrar</span>
      </Link>
    </header>
  );
}