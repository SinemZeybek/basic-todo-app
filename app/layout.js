import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from '../components/NavbarWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My To-Do App",
  description: "Intern project with Next.js + Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <NavbarWrapper />
        <main className="p-8">{children}</main>
      </body>
    </html>
  )
}