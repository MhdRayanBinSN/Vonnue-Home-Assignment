import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Decision Companion System',
  description: 'A smart system to help you make better decisions using multi-criteria analysis',
  keywords: ['decision making', 'MCDM', 'weighted scoring', 'WSM', 'decision support'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
          {children}
        </div>
      </body>
    </html>
  )
}
