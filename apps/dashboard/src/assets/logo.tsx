import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: number
}

export function Logo({ className, size = 24 }: LogoProps) {
  return (
    <img
      src="/images/icon.jpg"
      alt="Quirk"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
      className={cn('shrink-0 select-none', className)}
    />
  )
}
