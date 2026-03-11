import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura NABH | AI-Powered Hospital Accreditation Dashboard",
  description: "Seamlessly collect, validate, and predict NABH entry-level readiness using deterministic rules and ML.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{colorScheme: 'dark'}}>
      <body className={`${outfit.className} bg-gradient-mesh text-slate-100 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
