import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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

// We removed "type Metadata" here
export const metadata = {
  title: "My Task Manager",
  description: "Built with Next.js and MongoDB",
};

// We removed the ": Readonly" and ": React.ReactNode" parts here
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body style={{ margin: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <Header />
        
        <main style={{ flex: 1 }}>
          {children}
        </main>
        
        <Footer />
        
      </body>
    </html>
  );
}