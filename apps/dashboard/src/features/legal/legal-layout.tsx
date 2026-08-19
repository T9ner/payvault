import { Link } from '@tanstack/react-router'
import { QuirkLogo } from '@/components/quirk-logo'
import { ChevronLeft } from 'lucide-react'

interface LegalLayoutProps {
  children: React.ReactNode
  title: string
  lastUpdated: string
}

export function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
  return (
    <div className='min-h-screen bg-[#000000] font-sans text-[#FFFFFF] antialiased'>
      <header className='sticky top-0 z-50 w-full border-b border-[#222222] bg-[#000000]/90 backdrop-blur'>
        <div className='container max-w-4xl mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-2'>
            <Link to='/' className='flex items-center gap-2 transition-opacity hover:opacity-80'>
              <QuirkLogo size={22} lightMode={false} />
            </Link>
          </div>
          <Link
            to='/'
            className='inline-flex items-center gap-1.5 text-xs text-[#A9A9A9] hover:text-[#FFFFFF] px-3 py-1.5 rounded-full bg-[#101010] border border-[#222222] transition-colors'
          >
            <ChevronLeft className='size-3.5' />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className='container max-w-3xl mx-auto py-12 md:py-20 px-4'>
        <div>
          <div className='mb-10 space-y-2'>
            <h1 className='text-3xl md:text-5xl font-bold tracking-tight text-[#FFFFFF] font-["Satoshi"]'>
              {title}
            </h1>
            <p className='text-xs font-["JetBrains_Mono"] text-[#A9A9A9]'>
              Last updated: {lastUpdated}
            </p>
          </div>
          <div className='prose prose-invert max-w-none text-sm text-[#A9A9A9] leading-relaxed'>
            {children}
          </div>
        </div>
      </main>

      <footer className='border-t border-[#222222] py-12 text-xs text-[#A9A9A9]'>
        <div className='container max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-center sm:text-left'>
            &copy; {new Date().getFullYear()} Quirk Infrastructure Inc. All rights reserved.
          </p>
          <Link to='/' className='text-[#FFFFFF] hover:underline'>
            Back to Home
          </Link>
        </div>
      </footer>
    </div>
  )
}
