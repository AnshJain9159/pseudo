'use client'

import { usePathname } from 'next/navigation';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbarAndFooter = ['/sign-in', '/sign-up'].includes(pathname);

  return (
    <>
      {!hideNavbarAndFooter && <Navbar />}
      {children}
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}