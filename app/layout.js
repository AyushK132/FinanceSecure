import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"
import { Inter } from "next/font/google";
// import Header from "../components/ui/header";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "FinanceSecure",
  description: "Control Your Money",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${inter.className}`}>
       {/* <Header/> */}
     
      <main className = "min-h-screen">{children}</main>
      {/* footer  */}
      <Toaster richColors/>
      {/* <footer className = "bg-blue-50 py-12"  >
      <div className = "container mx-auto px-4 text-center text-gray-600">
        <p>
          Made with NextJS
        </p>
      </div>

      </footer> */}

      </body>
    </html>
    </ClerkProvider>
  );
}
 