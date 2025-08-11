import { Poppins, Libre_Baskerville, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/contexts/cart-context";
import { ToastProvider } from "@/contexts/toast-context";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Rent it",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${libreBaskerville.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <ToastProvider>
          <CartProvider>
            {children}
            <Toaster richColors />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
