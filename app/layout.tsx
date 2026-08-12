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
      <body className="min-h-full flex flex-col font-sans bg-grey-100">
        <div className="relative mx-auto flex min-h-full w-full max-w-97.5 flex-1 flex-col bg-white">
          {children}
        </div>
        <InstallPrompt />
      </body>
    </html>
  );
}
