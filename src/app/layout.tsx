import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import  Navbar  from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {

  title: 'Taskify',
  description: 'Effortlessly manage your tasks, boost productivity, and achieve your goals with Taskify. Create to-dos, set deadlines, track progress, and collaborate seamlessly.', // Detailed description
  keywords: ['task management', 'to-do list', 'productivity', 'task tracker', 'project management', 'organization', 'workflow', 'collaboration'], // Relevant keywords
  openGraph: {
    title: 'Taskify - Your Ultimate Task Management Solution',
    description: 'Effortlessly manage your tasks, boost productivity, and achieve your goals with Taskify. Create to-dos, set deadlines, track progress, and collaborate seamlessly.',

  
    url: 'https://taskify160.vercel.app', 
    siteName: 'Taskify',
    images: [
      {
        url: 'https://your-deployed-url.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Taskify - Task Management',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/favicon.ico', // Path to your favicon
    apple: '/apple-touch-icon.png', // Path to your apple touch icon
  },
  manifest: '/site.webmanifest', // Path to your web app manifest
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
