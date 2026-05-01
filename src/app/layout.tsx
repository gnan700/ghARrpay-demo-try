import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import SplashScreen from '@/components/layout/SplashScreen';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Gharpayy CRM",
    description: "Lead Management for PG Accommodations",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SplashScreen />
                {children}
            </body>
        </html>
    );
}
