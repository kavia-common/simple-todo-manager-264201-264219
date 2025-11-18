import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Todo – Ocean Professional",
  description: "A minimal todo manager with a clean ocean-inspired UI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
