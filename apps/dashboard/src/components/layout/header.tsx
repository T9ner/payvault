import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, fixed = true, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'z-40 h-14 w-full border-b border-[#E5E5E5] bg-[#FFFFFF]/95 backdrop-blur-md transition-colors duration-150',
        fixed && 'sticky top-0',
        offset > 10 ? 'shadow-[0_1px_3px_rgba(0,0,0,0.03)]' : '',
        className
      )}
      {...props}
    >
      <div className='flex h-full items-center justify-between gap-3 px-4 sm:px-6'>
        <div className='flex items-center gap-3'>
          <SidebarTrigger
            variant='outline'
            className='size-8 rounded-lg border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#F7F7F5] text-[#080808] transition-colors duration-150 active:scale-[0.98]'
            aria-label='Toggle sidebar navigation'
          />
          <Separator orientation='vertical' className='h-4 bg-[#E5E5E5]' />
        </div>
        {children}
      </div>
    </header>
  )
}
