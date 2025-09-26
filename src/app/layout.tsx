import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Providers/Theme/ThemeProvider";
import ReactQueryClientProvider from "@/components/Providers/ReactQuery/ReactQueryProvider";
import ReactReduxProvider from "@/components/Providers/Redux/ReduxProvider";
import SonnerToastProvider from "@/components/Providers/SonnerProvider/SonnerProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kamaune | Affiliate Dashboard",
  description: "Create by next app"
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SonnerToastProvider>
            <ReactReduxProvider>
              <ReactQueryClientProvider>
                {children}
              </ReactQueryClientProvider>
            </ReactReduxProvider>
          </SonnerToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
