import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Askly",
  description: "Rychle odpovede od tvorcov, ktorym doverujes.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="sk">
      <body>{children}</body>
    </html>
  );
}
