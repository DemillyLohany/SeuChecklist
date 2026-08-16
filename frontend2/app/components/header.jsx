import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css"

export default function Header(){
    return (
        <header className={styles.header}>
            <div className={styles.logoArea}>
                <Link href="/">
                    <Image 
                        src="/imagens/logo_site.png" 
                        alt="Logo SeuChecklist" 
                        width={500}  
                        height={300} 
                        className={styles.logo}
                        priority 
                        quality={100}
                    />
                </Link>
            </div>
            <nav className={styles.nav}>
                <Link href="/">Home</Link>
                <Link href="/tarefas">Tarefas</Link>
                <Link href="/perfil">Perfil</Link>
            </nav>
        </header>
    );
}