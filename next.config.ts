import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Проверка вёрстки с телефона в одной Wi-Fi сети: без этого dev-сервер
  // блокирует отдачу /_next/* по IP, страница приходит без JS и не гидрируется.
  allowedDevOrigins: ["192.168.0.108"],
};

export default nextConfig;
