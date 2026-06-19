import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css"

export default function Header(){
    return (
        <header className={styles.header}>
            <div className={styles.logoArea}>
                <Image src="/imagens/logo_site.png" alt="Logo" width={115} height={80} className={styles.logo}/>
            </div>
            <nav className={styles.nav}>
                <Link href="/">Home</Link>
                <Link href="/tarefa">Tarefas</Link>
                <Link href="/perfil">perfil</Link>
            </nav>
        </header>
    );
}