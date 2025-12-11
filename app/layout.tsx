import type { Metadata } from "next";
import { Montserrat, Roboto, Cinzel } from "next/font/google"; // Cinzel is our Trajan alternative
import "./globals.css";

// 1. Configure Montserrat (Titles/Headers)
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600", "700"], // Regular, Semibold, Bold
});

// 2. Configure Roboto (Body text)
const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"], // Regular, Italic/Emphasis, Bold
});

// 3. Configure Cinzel (Stand-in for Trajan Sans)
const trajan = Cinzel({
  subsets: ["latin"],
  variable: "--font-trajan",
  weight: ["400", "600"], // Trajan style usually has limited weights
});

export const metadata: Metadata = {
  title: "SNS - Exam Result Notification",
  description: "Secure Login System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // Inject all font variables into the body
        className={`${montserrat.variable} ${roboto.variable} ${trajan.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}