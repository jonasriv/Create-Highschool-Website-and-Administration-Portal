import type { Metadata } from "next";
import { Roboto, Roboto_Mono, Bungee_Hairline, Mina, Notable, Rubik_Dirt, Bahiana } from "next/font/google";
import "./globals.css";
import Head from 'next/head';

const bungee = Bungee_Hairline({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: "400",
});

const rubik = Rubik_Dirt({
  variable: "--font-rubik_dirt",
  subsets: ["latin"],
  weight: "400",
});

const bahiana = Bahiana({
  variable: "--font-bahiana",
  subsets: ["latin"],
  weight: "400",
});

const notable = Notable({
  variable: "--font-notable",
  subsets: ["latin"],
  weight: "400",
});

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
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body
        className={`bg-black ${robotoMono.variable} ${robotoSans.variable} ${bungee.variable} ${exo2.variable} ${rubik.variable} ${notable.variable} ${bahiana.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}