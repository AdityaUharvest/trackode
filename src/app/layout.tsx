import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import "./globals.css"; // If you have global Tailwind styles
import { SessionProvider } from "next-auth/react"
import './globals.css'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
        <Navbar />
        <div className="min-h-screen">{children}</div>
        <Footer />
        </SessionProvider>
        
      </body>
    </html>
  );
}
