import type { Metadata, Viewport } from "next";
import { Oswald, Onest, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const onest = Onest({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin", "cyrillic"],
  weight: ["600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rex-dsgn.vercel.app"),
  title: {
    default: "REX DESIGN — Дизайн студия | Брендинг, Веб-дизайн, Типографика",
    template: "%s | REX DESIGN",
  },
  description:
    "Портфолио дизайнера Рафаэля Апаряна. Брендинг, веб-дизайн, инфографика, анимация и полиграфия. Дизайн, который работает на бизнес.",
  keywords: [
    "дизайнер",
    "графический дизайн",
    "брендинг",
    "веб-дизайн",
    "логотип",
    "айдентика",
    "инфографика",
    "портфолио дизайнера",
    "Ульяновск",
    "REX DESIGN",
    "Рафаэль Апарян",
  ],
  authors: [{ name: "Апарян Рафаэль" }],
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0A0A0A"/><rect x="26" y="26" width="6" height="6" fill="#E63946"/><text x="16" y="22" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="15" fill="#E8E4DF" text-anchor="middle">R</text></svg>`
          ),
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    title: "REX DESIGN — Дизайн, который работает на бизнес",
    description:
      "Портфолио дизайнера Рафаэля Апаряна. Брендинг, веб-дизайн, инфографика, анимация, полиграфия.",
    url: "https://rex-dsgn.vercel.app",
    siteName: "REX DESIGN",
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "REX DESIGN — Дизайн студия",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "REX DESIGN — Дизайн, который работает на бизнес",
    description: "Портфолио дизайнера Рафаэля Апаряна.",
    images: ["/og-image.png"],
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E8E4DF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${oswald.variable} ${onest.variable} ${jetbrains.variable} ${caveat.variable} font-body antialiased`}
      >
        {children}
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "REX DESIGN",
              description:
                "Дизайн-студия: брендинг, веб-дизайн, инфографика, анимация, полиграфия",
              url: "https://rex-dsgn.vercel.app",
              founder: {
                "@type": "Person",
                name: "Апарян Рафаэль",
                jobTitle: "Ведущий дизайнер",
                email: "baracuda.max1@gmail.com",
                telephone: "+7-902-212-10-44",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Ульяновск",
                addressCountry: "RU",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
