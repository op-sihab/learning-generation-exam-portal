import type { Metadata } from "next";
import "./globals.css";
import { PortalProvider } from "@/context/PortalContext";
import { PortalLayout } from "@/components/common/PortalLayout";

export const metadata: Metadata = {
  title: "Learning Generation | Premium Exam Portal",
  description:
    "An upgraded interactive exam portal for SSC, HSC, and University Admission preparation featuring live CBT exams, practice mode, mistake bank, analytics, leaderboards, and an exam builder studio.",
  openGraph: {
    title: "Learning Generation | Premium Exam Portal",
    description:
      "Interactive exam portal for SSC, HSC, and Admission preparation with live CBT exams, instant KaTeX math explanations, and analytics.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen">
        <PortalProvider>
          <PortalLayout>{children}</PortalLayout>
        </PortalProvider>
      </body>
    </html>
  );
}
