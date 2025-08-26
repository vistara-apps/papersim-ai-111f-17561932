
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  return {
    title: "PaperSim AI",
    description: "Reproduce and validate groundbreaking physics research with AI agents",
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: `${URL}/og-image.png`,
        button: {
          title: "Launch PaperSim AI",
          action: {
            type: "launch_frame",
            name: "PaperSim AI",
            url: URL,
            splashImageUrl: `${URL}/splash.png`,
            splashBackgroundColor: "#fcfcfd",
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
