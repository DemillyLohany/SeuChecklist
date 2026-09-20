import Link from 'next/link';

import Footer from './components/footer';
import Header from './components/header';
import styles from './home.module.css';

const features = [
  {
    href: '/tarefas/listar',
    image: '/feature-organize.png',
    alt: 'Ilustração de organização',
    className: styles.sage,
    title: <>Organização</>,
  },
  {
    href: '/tarefas/listar',
    image: '/feature-pomodoro.png',
    alt: 'Ilustração do método Pomodoro',
    className: styles.peach,
    title: (
      <>
        Método
        <br />
        Pomodoro
      </>
    ),
  },
  {
    href: '/tarefas/listar',
    image: '/feature-prioritize.png',
    alt: 'Ilustração de priorização',
    className: styles.lilac,
    title: (
      <>
        Priorização
        <br />
        de tarefas
      </>
    ),
  },
  {
    href: '/tarefas/listar',
    image: '/feature-reports.png',
    alt: 'Ilustração de relatório',
    className: styles.blue,
    title: (
      <>
        Relatório de
        <br />
        tarefas
      </>
    ),
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section
          className={styles.hero}
          aria-label="SeuChecklist"
        >
          <img
            className={styles.heroImage}
            src="/hero.png"
            alt="Pessoa organizando suas atividades"
          />
        </section>

        <section
          className={styles.featureGrid}
          aria-label="Recursos do SeuChecklist"
        >
          {features.map((feature) => (
            <Link
              key={feature.image}
              className={`${styles.featureCard} ${feature.className}`}
              href={feature.href}
            >
              <img
                src={feature.image}
                alt={feature.alt}
              />

              <strong>{feature.title}</strong>
            </Link>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}