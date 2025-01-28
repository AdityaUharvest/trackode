import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import "./globals.css"; // If you have global Tailwind styles
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // ✅ Import CSS for styling
import './globals.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />
        <div className="min-h-screen">{children}</div>
        <Footer />
        </SessionProvider>
        
      </body>
    </html>
  );
}
