import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import Providers from '@/components/providers/Providers'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'VESCO Engineering Team',
  description: 'Showcasing innovative projects and competition achievements of the VESCO university team',
  keywords: ['VESCO', 'engineering', 'university', 'projects', 'competitions', 'team'],
  authors: [{ name: 'VESCO Team' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://accounts.google.com/gsi/client"></script>
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
