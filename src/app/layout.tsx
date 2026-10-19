
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEWS 24 | দেশ, বিশ্ব ও ক্রিকেট",
  description:
    "বাংলাদেশ, আন্তর্জাতিক, ক্রিকেট ও ম্যাগাজিনের খবর পড়ুন NEWS 24-এ।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
