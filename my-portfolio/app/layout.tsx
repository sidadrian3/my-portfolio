import "./global.css";
import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import { metaData } from "./config";
import ClientLayout from "./components/ClientLayout";
import Footer from "./components/footer";
import { ThemeProvider } from "./components/ThemeProvider";

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(metaData.baseUrl),
  title: {
    default: metaData.title,
    template: `%s | ${metaData.title}`,
  },
  description: metaData.description,
  openGraph: {
    images: metaData.ogImage,
    title: metaData.title,
    description: metaData.description,
    url: metaData.baseUrl,
    siteName: metaData.name,
    locale: "en_US",
    type: "website",
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
  twitter: {
    title: metaData.name,
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={robotoFlex.variable}>
      <body className="bg-bg text-ink font-sans antialiased">
        <ThemeProvider>
          <ClientLayout footer={<Footer />}>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
