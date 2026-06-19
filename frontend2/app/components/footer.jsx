import Image from "next/image";
import styles from "./footer.module.css";

export default function Footer() {
    return <footer className={styles.footer}>
        <Image src="/imagens/logo_site.png" alt="Logo do site" width={115} height={80}/>
    </footer>
}