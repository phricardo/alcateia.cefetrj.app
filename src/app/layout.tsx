import { Metadata } from "next";
import { type_first } from "@/functions/fonts";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { UserContextProvider } from "@/contexts/user-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Integra Cefet/RJ",
  description: "Integração extraoficial e de código aberto com o Cefet/RJ",
  icons: {
    icon: [
      {
        type: "image/x-icon",
        url: "/icons/favicon.ico",
        href: "/icons/favicon.ico",
      },
      {
        media: "(prefers-color-scheme: light)",
        type: "image/png",
        url: "/icons/favicon-dark.png",
        href: "/icons/favicon-dark.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
        url: "/icons/favicon-light.png",
        href: "/icons/favicon-light.png",
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
        <UserContextProvider>
          <Header />
          {children}
          <Footer />
        </UserContextProvider>
      </body>
    </html>
  );
}
