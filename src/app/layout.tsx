import { TOAST_OPTIONS } from "@/constants";
import { AppProvider } from "@/contexts/AppContext";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Feed de Reconhecimentos - Applause",
  description: "Plataforma de reconhecimentos entre participantes da equipe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className={`${poppins.className} bg-gray-50 min-h-screen antialiased`}>
        <AppProvider>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-blue-600">👏</div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Feed de Reconhecimentos
                    </h1>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Inspire e seja inspirado</span>
                    <span className="text-lg">✨</span>
                  </div>
                </div>
              </div>
            </header>
            <main className="bg-gray-50">{children}</main>
          </div>
          
          <Toaster
            position="top-right"
            containerStyle={{ zIndex: 9999 }}
            toastOptions={TOAST_OPTIONS}
          />
        </AppProvider>
      </body>
    </html>
  );
}
