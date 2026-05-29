export const metadata = {
  title: 'SeuChecklist',
  description: 'Projeto com Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
} 