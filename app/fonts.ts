import localFont from "next/font/local";

// Headline sizes (H1/H2/Subtitle, 20px+) — SF Pro Display cut.
export const sfProDisplay = localFont({
  variable: "--font-sf-pro-display",
  display: "swap",
  src: [
    {
      path: "./fonts/SF-Pro-Display/SF-Pro-Display-Light.otf",
      weight: "274",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Display/SF-Pro-Display-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Display/SF-Pro-Display-Medium.otf",
      weight: "510",
      style: "normal",
    },
  ],
});

// Body/caption sizes (below 20px) — SF Pro Text cut, wider metrics for legibility.
export const sfProText = localFont({
  variable: "--font-sf-pro-text",
  display: "swap",
  src: [
    {
      path: "./fonts/SF-Pro-Text/SF-Pro-Text-Light.otf",
      weight: "274",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Text/SF-Pro-Text-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Text/SF-Pro-Text-Medium.otf",
      weight: "510",
      style: "normal",
    },
  ],
});
