import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://m2pvcapital.com"),
  title: {
    default: "M2PV Capital | AI Energy Infrastructure Private Equity",
    template: "%s | M2PV Capital",
  },
  description:
    "M2PV Capital deploys growth equity and project capital into utility-scale solar PV plants and nuclear SMRs sited in rural areas, powering AI and hyperscale data center demand.",
  keywords: [
    "Private Equity",
    "AI Energy Infrastructure",
    "Solar PV",
    "Nuclear SMR",
    "Small Modular Reactor",
    "AI Data Centers",
    "Hyperscale",
    "Rural Areas",
    "M2PV Capital",
    "Clean Baseload",
  ],
  authors: [{ name: "M2PV Capital" }],
  creator: "M2PV Capital",
  publisher: "M2PV Capital",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "M2PV Capital | AI Energy Infrastructure Private Equity",
    description:
      "Deploying growth equity and project capital into utility-scale solar PV plants and nuclear SMRs in rural areas — powering AI data center demand.",
    type: "website",
    url: "https://m2pvcapital.com",
    siteName: "M2PV Capital",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "M2PV Capital | AI Energy Infrastructure Private Equity",
    description:
      "Deploying growth equity and project capital into utility-scale solar PV plants and nuclear SMRs in rural areas — powering AI data center demand.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://m2pvcapital.com",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "M2PV Capital",
              url: "https://m2pvcapital.com",
              description:
                "AI energy infrastructure private equity firm deploying utility-scale solar PV plants and nuclear SMRs in rural areas to power AI and hyperscale data center demand.",
              foundingDate: "2024",
              founders: [
                {
                  "@type": "Person",
                  name: "R. M. Mesmer",
                  jobTitle: "Founder & CEO",
                },
              ],
              address: {
                "@type": "PostalAddress",
                addressRegion: "Rural Areas",
                addressCountry: "US",
              },
              sameAs: [],
              contactPoint: {
                "@type": "ContactPoint",
                email: "ceo@m2pvcapital.com",
                contactType: "investor relations",
              },
            }),
          }}
        />
      </head>
      <body className="bg-white text-black antialiased">
        {children}
      </body>
    </html>
  );
}
