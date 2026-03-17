import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

export const metadata: Metadata = {
  title: "HOPE NABH | Healthcare Organisation Platform for Entry Level Certification",
  description: "Hospital accreditation compliance platform for NABH Entry Level Certification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} min-h-screen antialiased`} style={{ background: '#F5F7FA', color: '#212121' }}>
        {children}
      </body>
    </html>
  );
}
