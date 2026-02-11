import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "AI Guardian — Face Detection",
  description:
    "AI-powered image analysis and face detection platform built with Next.js, Express, and FastAPI.",
  keywords: ["AI", "face detection", "machine learning", "OpenCV", "guardian"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
