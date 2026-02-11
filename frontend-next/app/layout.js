import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "AI Guardian — Face Detection",
  description:
    "Upload images and detect faces using OpenCV and machine learning.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans bg-gray-950 text-gray-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
