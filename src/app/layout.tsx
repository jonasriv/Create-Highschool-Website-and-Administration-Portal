import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Roboto_Mono, Bungee_Hairline, Mina, Offside, Koulen } from "next/font/google";
import "./globals.css";

const bungee = Bungee_Hairline({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: "400",
});

const koulen = Koulen({
  variable: "--font-koulenjura",
  subsets: ["latin"],
  weight: "400",
});

const offside = Offside({
  variable: "--font-offside",
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
    <html lang="en">
      <body
        className={`bg-black ${robotoMono.variable} ${robotoSans.variable} ${bungee.variable} ${exo2.variable} ${koulen.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}