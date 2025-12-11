import type { Metadata } from "next";
// Assuming you have these fonts set up as per previous steps
import { Montserrat, Roboto, Cinzel } from "next/font/google"; 
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast-notification";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-roboto" });
const trajan = Cinzel({ subsets: ["latin"], variable: "--font-trajan" }); // Using Cinzel as Trajan alternative

export const metadata: Metadata = {
  title: "SNS Teacher Portal",
  description: "Exam Result Notification System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${roboto.variable} ${trajan.variable} font-sans`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}