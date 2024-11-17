import localFont from "next/font/local";
import {Plus_Jakarta_Sans} from 'next/font/google';
import "./globals.css";
const plusJakarta = Plus_Jakarta_Sans({subsets: ['latin']});

export const metadata = {
  title: 'GoArif : Best Data Science',
  description: 'Your exceptional Link in Bio',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={plusJakarta.className}>
        {children}
      </body>
    </html>
  );
}
