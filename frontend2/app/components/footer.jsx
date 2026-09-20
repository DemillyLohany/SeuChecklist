import Image from 'next/image';

import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <Image
          src="/imagens/logo_site.png"
          alt="SeuChecklist"
          width={116}
          height={42}
          className={styles.logo}
        />

        <span className={styles.tagline}>
          Organize seu dia com mais leveza.
        </span>

        <small className={styles.copyright}>
          © 2026 SeuChecklist
        </small>
      </div>
    </footer>
  );
}