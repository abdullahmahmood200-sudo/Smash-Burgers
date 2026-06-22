import type { Metadata } from "next";
import { Lilita_One, Luckiest_Guy, Fredoka } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import CustomCursor from "@/components/CustomCursor";
import CartDrawer from "@/components/cart/CartDrawer";

const lilita = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const luckiest = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poster",
  display: "swap",
});
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SMASH Burgers",
  description:
    "Smashed hot on the flat-top — prime patties, melted cheddar and our signature chili honey glaze. Bold flavor since 2008.",
  metadataBase: new URL("https://smash-burgers.vercel.app"),
  openGraph: {
    title: "SMASH Burgers",
    description: "Bold flavor, smashed fresh. Order online.",
    images: ["/assets/burger.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${lilita.variable} ${luckiest.variable} ${fredoka.variable}`}
    >
      <body>
        <CartProvider>
          <CustomCursor />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
