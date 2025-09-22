import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sinister S.n.C",
  description: "Sinister S.n.C è un chatbot alternativo gestito dai sei operatori conosciuti come ‘i sinistri’. Preparati a un’esperienza caotica e imprevedibile… e speriamo che Spider-Man dia una mano!"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        {children}
      </body>
    </html>
  );
}
