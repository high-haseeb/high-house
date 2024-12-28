import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata = {
    title: "high-house",
    description: "taking software to new highs",
};

const grotesque = localFont({
    src: "./fonts/grotesque.otf",
    variable: "--font-grotesque",
    weight: "900",
});

const inter = Inter({ subsets: ["latin"], variable: "--inter"});

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${grotesque.className} ${inter.className} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
