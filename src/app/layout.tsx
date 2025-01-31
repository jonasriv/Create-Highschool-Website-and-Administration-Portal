import type { Metadata } from "next";
import { Roboto, Roboto_Mono, Mina } from "next/font/google";
import "./globals.css";
import Head from 'next/head';
import { Analytics } from "@vercel/analytics/react"

const exo2 = Mina({
  variable: "--font-mina",
  subsets: ["latin"],
  weight: ["400", "700"]
});

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
  weight: ["400", "700"]
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: "Create VGS",
  description: "Lillehammer kreative videregående skole",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <head>
        {/* Legg til favicon */}
        <Head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        </Head>
      </head>
      <body
        className={`bg-black ${robotoMono.variable} ${robotoSans.variable} ${exo2.variable} antialiased`}
      >
        {children}
        <Analytics/>
      </body>
    </html>
  );
}