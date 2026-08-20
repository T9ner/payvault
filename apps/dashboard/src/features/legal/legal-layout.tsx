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
    <div className='min-h-screen bg-[#FFFFFF] font-sans text-[#080808] antialiased selection:bg-[#080808] selection:text-[#FFFFFF]'>
      <header className='sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-[#FFFFFF]/90 backdrop-blur-md'>
        <div className='container max-w-4xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6'>
          <div className='flex items-center gap-2'>
            <Link to='/' className='flex items-center gap-2 transition-opacity hover:opacity-80'>
              <QuirkLogo size={22} lightMode={true} />
            </Link>
          </div>
          <Link
            to='/'
            className='inline-flex items-center gap-1.5 text-xs font-medium text-[#666666] hover:text-[#080808] px-3.5 py-1.5 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] transition-colors'
          >
            <ChevronLeft className='size-3.5' />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className='container max-w-3xl mx-auto py-16 md:py-24 px-4 sm:px-6'>
        <div>
          <div className='mb-12 space-y-3 pb-8 border-b border-[#E5E5E5]'>
            <h1 className='text-3xl md:text-5xl font-bold tracking-tight text-[#080808] font-["Satoshi"]'>
              {title}
            </h1>
            <p className='text-xs font-["JetBrains_Mono"] text-[#888888]'>
              Last updated: {lastUpdated}
            </p>
          </div>
          <div className='prose prose-neutral max-w-none text-sm text-[#444444] leading-relaxed space-y-6'>
            {children}
          </div>
        </div>
      </main>

      <footer className='border-t border-[#E5E5E5] py-12 text-xs text-[#888888] bg-[#FAFAFA]'>
        <div className='container max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-center sm:text-left'>
            &copy; {new Date().getFullYear()} Quirk Infrastructure Inc. All rights reserved.
          </p>
          <Link to='/' className='text-[#080808] hover:underline font-medium'>
            Back to Home
          </Link>
        </div>
      </footer>
    </div>
  )
}
