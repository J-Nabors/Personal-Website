import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Urban Science Portfolio",
  description: "A gallery-first personal website for interactive mapping and urban analytics projects.",
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
