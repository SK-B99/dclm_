import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DCLM Church",
  description: "Winning the world for Jesus Christ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}