import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kosh Kusé",
    short_name: "Kosh Kusé",
    description: "Kosh Kusé — забота о вашем питомце",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#191919",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
