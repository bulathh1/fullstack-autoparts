export default function RootLayout({ children }) {
    return (
      <html lang="ru">
        <body>
          <header></header>
          <main>{children}</main>
          <footer></footer>
        </body>
      </html>
    );
  }