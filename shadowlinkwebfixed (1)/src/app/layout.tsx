import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Shadow Link",
    template: "%s · Shadow Link",
  },
  description: "Secure chat portal - text, voice, video, screen share, and ShadowStream live broadcasting.",
  applicationName: "Shadow Link",
  openGraph: {
    title: "Shadow Link",
    description: "Secure chat portal - text, voice, video, screen share, and ShadowStream live broadcasting.",
    siteName: "Shadow Link",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#030508",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg-main text-text-main">{children}</body>
    </html>
  );
}
