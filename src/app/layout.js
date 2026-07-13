import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AosInit from "@/components/AosInit";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "KARE IEEE Education Society - Recruitment Portal",
  description: "Join KARE IEEE Education Society, one of the most active student technical communities. Build. Innovate. Lead.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-ieee-deep text-slate-100 font-sans selection:bg-ieee-blue/40 selection:text-white">
        <ToastProvider>
          <AuthProvider>
            <AosInit />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
