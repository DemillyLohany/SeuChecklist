import link from "next/link";
import Image from "next/image";

export default function Header(){
    return (
        <header className={StyleSheet.header}>
            <div className={StyleSheet.logoArea}>
                <Image src="/imagens/logo_site.png" alt="Logo" width={115} height={80} className={styles.logo}/>
            </div>
            <nav className={styles.nav}>
                <Link href="/">Home</Link>
                <Link href="/tarefa">Tarefas</Link>
                <Link href="/perfil">perfil</Link>
            </nav>
        </header>
    )
}