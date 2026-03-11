import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruitment System",
  description: "Simple recruitment application system",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}