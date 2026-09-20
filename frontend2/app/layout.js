import './globals.css';

export const metadata = {
  title: 'SeuChecklist',
  description: 'Organize seu dia com mais leveza.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}