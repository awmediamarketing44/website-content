import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";

const rethinkSans = Rethink_Sans({
  variable: "--font-rethink-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Website Content Generator | AW Media",
  description:
    "Generate professional website copy for your business — landing pages, full websites, and local SEO tips. Powered by AW Media.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rethinkSans.variable} ${rethinkSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
