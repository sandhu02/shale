import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: "Executive Super Store",
  description: "Official site of Executive Super Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
