interface QuirkLogoProps {
  className?: string
  size?: number
  showWordmark?: boolean
  lightMode?: boolean
}

export function QuirkLogo({
  className = '',
  size = 28,
  showWordmark = true,
  lightMode = false,
}: QuirkLogoProps) {
  if (showWordmark) {
    // Full logo: icon + "QUIRK" wordmark (logo2.png)
    return (
      <img
        src="/images/logo.png"
        alt="Quirk"
        height={size}
        style={{
          height: size,
          width: 'auto',
          // Invert for light background — logo is black on white
          filter: lightMode ? 'none' : 'invert(1)',
        }}
        className={`select-none shrink-0 ${className}`}
      />
    )
  }

  // Icon-only (logo.jpg — the Q mark)
  return (
    <img
      src="/images/icon.jpg"
      alt="Quirk"
      height={size}
      width={size}
      style={{
        height: size,
        width: size,
        objectFit: 'contain',
        filter: lightMode ? 'none' : 'invert(1)',
        borderRadius: 4,
      }}
      className={`select-none shrink-0 ${className}`}
    />
  )
}
