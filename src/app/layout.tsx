import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M2PV Capital | Energy Infrastructure Private Equity",
  description:
    "Deploying capital across sustainable mobility and green data infrastructure in the American Southwest.",
  keywords: [
    "Private Equity",
    "Energy Infrastructure",
    "EV Charging",
    "Data Centers",
    "Solar",
    "Renewable Energy",
    "M2PV Capital",
  ],
  authors: [{ name: "M2PV Capital" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "M2PV Capital | Energy Infrastructure Private Equity",
    description:
      "Deploying capital across sustainable mobility and green data infrastructure in the American Southwest.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
      </head>
      <body className="bg-stone-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
