import type { Metadata } from "next";
import "./globals.css";
import { Agentation } from "agentation";
import { SyncProvider } from "./lib/SyncProvider";
import { AuthProvider } from "./components/AuthProvider";
import { DitherWave } from "./components/DitherWave";
import { AppHeader } from "./components/AppHeader";

export const metadata: Metadata = {
  title: "CommerceHub | Agentic MCP Studio",
  description: "Create your MCP server in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen font-sans antialiased bg-cyber-cream text-deep-jungle">
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-4 left-24 z-[99999]">
            <Agentation />
          </div>
        )}
        <div className="halofy-mesh-container">
          <div className="dither-noise-overlay"></div>

          <AppHeader />

          <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
            <AuthProvider>
              <SyncProvider>
                {children}
              </SyncProvider>
            </AuthProvider>
          </main>

          <DitherWave />

          <footer className="site-footer">
            <div className="footer-top">
              <div className="footer-left">
                <p className="footer-location">San Francisco, CA</p>
                <div className="footer-contact">
                  <p className="footer-contact-label">Contact Us</p>
                  <a href="mailto:contactus@commercehub.ai" className="footer-email">contactus@commercehub.ai</a>
                </div>
              </div>
              <div className="footer-right">
                <div className="footer-social">
                  <span className="social-link opacity-50 cursor-default" title="X (Twitter) - Coming Soon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                  </span>
                  <span className="social-link opacity-50 cursor-default" title="LinkedIn - Coming Soon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>


          </footer>
        </div>
      </body>
    </html>
  );
}