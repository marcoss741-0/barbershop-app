import type { Metadata } from "next";
import "./globals.css";
import { Montserrat, Roboto_Slab } from "next/font/google";
import { Toaster } from "./_components/ui/sonner";
import Footer from "./_components/footer";
import AuthProvider from "./_providers/auth";
import { ThemeProvider } from "./_components/theme-provider";
import { ModeToggle } from "./_components/toggle-theme";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ômega Barber´s",
  icons: {
    icon: "/favicon.svg",
  },
  description: "Corte com estilo e conforto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning className="dark">
      <body className={`${montserrat.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex h-full flex-col">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </AuthProvider>
          <Toaster duration={2000} position="bottom-right" style={{}} />
        </ThemeProvider>
      </body>
    </html>
  );
}
