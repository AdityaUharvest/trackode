import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import "./globals.css"; // If you have global Tailwind styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
