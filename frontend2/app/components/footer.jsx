import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.rodape}>
      <div className={styles.conteudoRodape}>
        <img src="/logo-reference.png" alt="SeuChecklist" />

        <span>Organize seu dia com mais leveza.</span>

        <small>© 2026 SeuChecklist</small>
      </div>
    </footer>
  );
}