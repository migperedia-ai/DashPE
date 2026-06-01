import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Process Engineering Control Task",
  description: "Kanban visual management monitoring of projects, HECN, improvements and engineering actions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
