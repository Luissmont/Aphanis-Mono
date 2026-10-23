import type { Metadata } from "next";
import { Passion_One } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const passionOne = Passion_One({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-passion-one",
});

export const metadata: Metadata = {
  title: "APHANIS",
  description: "APHANIS - Secure Sharing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${passionOne.variable} h-full antialiased`}>
      <body className="flex h-screen w-full overflow-hidden bg-[#000000] text-[#FFFFFF]">
        <Sidebar />
        <main className="flex-1 h-full overflow-y-auto bg-[#000000]">
          {children}
        </main>
      </body>
    </html>
  );
}
