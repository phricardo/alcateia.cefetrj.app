import { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { type_first } from "@/functions/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Integra Cefet/RJ",
  description: "Integração extraoficial e código aberto com o Cefet/RJ",
  icons: {
    icon: [
      {
        type: "image/x-icon",
        url: "/icons/favicon.ico",
        href: "/icons/favicon.ico",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customFontsVariables = `${type_first.variable}`;

  return (
    <html lang="pt-BR">
      <body className={customFontsVariables}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
