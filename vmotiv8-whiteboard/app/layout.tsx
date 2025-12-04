import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "vMotiv8 Whiteboard - Collaborative Learning",
  description: "Real-time collaborative whiteboard for tutors and students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
