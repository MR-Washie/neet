import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"
import AuthProvider from '@/components/AuthProviders';
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "NEET PYQ Practice Tests & PDF Downloads | neetest",
//   description: "Access comprehensive NEET Physics PYQs chapter-wise with detailed solutions. Practice the last 10 years of questions to boost your NEET 2026 preparation.",
// };

// app/layout.tsx
export const metadata = {
  metadataBase: new URL('https://neetest.com'),
  title: {
    default: 'NEETest | Verified NEET PYQ & Study Resources',
    template: '%s | NEETest',
  },
  description: 'NEETest is the #1 platform for NEET-UG aspirants. Download verified previous year papers, mock tests, and exam analysis for NEET 2026.',
  openGraph: {
    type: 'website',
    siteName: 'NEETest',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />

          {children}

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
