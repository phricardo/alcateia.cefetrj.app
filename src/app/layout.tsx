import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { type_first } from "@/functions/fonts";
import "./globals.css";

export const metadata = {
  title: "Integra Cefet/RJ",
  description: "",
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
