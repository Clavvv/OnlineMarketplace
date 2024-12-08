import localFont from "next/font/local";
import "./globals.css";
import Navigation from './components/Navigation';
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Online Marketplace",
  description: "CS340 Portfolio Project Ryan Clavin & Brandon Pham",
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <head>
        <link rel='icon' href='icon.ico' size='any'></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
