'use client';

import Header from './components/header';
import Footer from './components/footer';

export default function Home() {
  return (
    <div className="wrapper">
      <Header />

      <main className="main">
        <h1>Home: Página inicial</h1>
      </main>

      <Footer />
    </div>
  );
}