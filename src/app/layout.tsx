import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";

const gambarino = localFont({
	src: "./fonts/Gambarino-Regular.woff",
	variable: "--font-serif",
});

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "Good Domain",
	description: "Find a good domain name",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${gambarino.variable} ${inter.variable} font-sans antialiased`}
			>
				<Navbar />
				{children}
				<Toaster richColors position="top-center" />
				<Analytics />
			</body>
		</html>
	);
}
