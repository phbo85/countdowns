import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Media Tracker",
  description: "Track your favorite movies and TV shows",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${dmSans.className}`}>
        {children}
      </body>
    </html>
  );
}
