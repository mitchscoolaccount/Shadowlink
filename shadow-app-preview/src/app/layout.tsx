import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShadowLink - UI Preview",
  description: "A no-backend visual preview of the ShadowLink app. Nothing here is real, saved, or sent anywhere.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
