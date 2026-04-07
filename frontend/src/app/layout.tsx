import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import GlitterCursor from "@/components/GlitterCursor";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

export const metadata: Metadata = {
  title: "HealthGuard AI | Professional Accreditation & Compliance Platform",
  description: "Advanced hospital accreditation compliance and predictive analysis platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} min-h-screen antialiased transition-colors duration-500 overflow-x-hidden`} style={{ background: '#020617', color: '#f8fafc' }}>
        <GlitterCursor />
        {children}
      </body>
    </html>
  );
}
