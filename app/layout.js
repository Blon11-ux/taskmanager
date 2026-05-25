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

export const metadata = {
  title: "My Task Manager",
  description: "Built with Next.js and MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <Header />
        <main style={{ flex: 1, width: '100%' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}