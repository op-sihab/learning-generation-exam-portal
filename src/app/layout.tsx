import type { Metadata } from "next";
import "./globals.css";
import { PortalProvider } from "@/context/PortalContext";
import { PortalLayout } from "@/components/common/PortalLayout";

export const metadata: Metadata = {
  title: "Learning Generation — Academic Exam Portal",
  description:
    "Structured CBT model tests, chapter drills, instant KaTeX math explanations, performance analytics, and merit leaderboards for SSC, HSC, and University Admission preparation.",
  openGraph: {
    title: "Learning Generation — Academic Exam Portal",
    description:
      "Structured CBT model tests, practice drills, instant KaTeX explanations, and analytics for SSC, HSC, and Admission candidates.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className="dark"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#06070B] text-slate-50 selection:bg-blue-500/30 selection:text-blue-100">
        <PortalProvider>
          <PortalLayout>{children}</PortalLayout>
        </PortalProvider>
      </body>
    </html>
  );
}
