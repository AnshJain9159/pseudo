import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import ClientLayout from "@/helpers/ClientLayout";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/helpers/Providers";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
import { Caesar_Dressing } from 'next/font/google';

const caesarDressing = Caesar_Dressing({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Socrates",
  description: "Developed by Team Pseudo Coder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
   
      <body className={inter.className}>
        
        <Providers>
          <ClientLayout>
            {children}
            <Toaster />
          </ClientLayout>
        </Providers>
      </body>
      
    </html>
  );
}