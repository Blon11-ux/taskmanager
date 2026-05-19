import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Pointing cleanly to your plural globals file!
import Header from "./component/header"; 
import Footer from "./component/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My Task Manager",
  description: "Built with Next.js and MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {/* 🎯 FIXED: Forced dark mode background base to eliminate the white bottom box */}
      <body style={{ 
        margin: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: '#0a0a0a', 
        color: '#ededed' 
      }}>
        
        <Header />
        
        {/* Pushes your footer perfectly to the bottom edge of the browser viewport */}
        <main style={{ flex: 1, width: '100%' }}>
          {children}
        </main>
        
        <Footer />
        
      </body>
    </html>
  );
}