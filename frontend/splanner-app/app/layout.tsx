import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/hooks/useAuth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        {/* Inline script to set theme before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error("Theme preload failed", e);
                }
              })();
            `,
          }}
        />
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
