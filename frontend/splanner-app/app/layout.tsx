import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeModeScript, ThemeProvider } from 'flowbite-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" suppressHydrationWarning className="h-full">
        <head>
        </head> 
        <body className="h-full">
          <div className="bg-white text-black dark:bg-gray-900 dark:text-white antialiased transition-colors duration-300 h-full">
          <AuthProvider>
            <Header />
            <main>{children}</main>
          </AuthProvider>
          </div>
        </body>
      </html>
  );
}