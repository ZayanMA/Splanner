import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeModeScript } from 'flowbite-react';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body className={`antialiased`}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}