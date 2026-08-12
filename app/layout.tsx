import type { Metadata, Viewport } from "next";
import { sfProDisplay, sfProText } from "./fonts";
import InstallPrompt from "@/components/InstallPrompt";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kosh Kusé",
  description: "Kosh Kusé — забота о вашем питомце",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kosh Kusé",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#191919",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${sfProDisplay.variable} ${sfProText.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
