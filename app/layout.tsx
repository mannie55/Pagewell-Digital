import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { HandoffNavProvider } from "@/components/ui/handoff-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BottomBlur } from "@/components/ui/bottom-blur";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import "lenis/dist/lenis.css";
import { site } from "@/lib/site";
import "./globals.css";

// Body typeface — variable font covering Regular → Bold.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

// Heading typeface — only ships in weight 400.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

// Pagewell orange in the browser bar on Chrome/Edge mobile (Safari tints from it too).
export const viewport: Viewport = {
  themeColor: "#f56a2a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;filter:none!important;transform:none!important}`}</style>
        </noscript>
      </head>
      {/* Browser extensions (e.g. Grammarly) add attributes to <body> before
          React loads; ignore those differences here only. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <SmoothScroll />
        <HandoffNavProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </HandoffNavProvider>
        <BottomBlur />
      </body>
    </html>
  );
}
