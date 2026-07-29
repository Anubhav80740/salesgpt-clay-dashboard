import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SalesGPT vs Clay | Company Data Analytics Dashboard',
  description: 'Production-quality internal analytics dashboard for comparing SalesGPT and Clay B2B company databases.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#F8FAFC] antialiased text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
