import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linux System Information & Resource Monitoring Tool | Command Center",
  description: "Real-time Linux system monitoring interface parsing /proc and POSIX APIs for Operating Systems & Systems Programming.",
  keywords: ["linux monitor", "systems programming", "proc filesystem", "cpu monitor", "memory monitor", "process manager", "posix"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
