import Image from "next/image";
import styles from "./footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <Image 
                src="/imagens/logo_site.png" 
                alt="Logo SeuChecklist" 
                width={300}  
                height={200} 
                className={styles.footerLogo}
                quality={100}
            />
        </footer>
    );
}