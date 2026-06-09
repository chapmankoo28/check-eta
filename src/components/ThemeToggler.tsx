// Based on https://ui.shadcn.com/docs/dark-mode/astro

import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

const themeMode = {
  light: 'light',
  dark: 'dark',
} as const

type Theme = (typeof themeMode)[keyof typeof themeMode]

export function ThemeToggler({ className }: { className?: string }) {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setThemeState(isDarkMode ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    const isDark = theme === 'dark'
    document.documentElement.classList[isDark ? 'add' : 'remove']('dark')
  }, [theme])

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => setThemeState(theme === 'light' ? 'dark' : 'light')}
      className={className}
    >
      <SunIcon className="size-5 scale-100 rotate-0 transition-all duration-200 dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute size-5 scale-0 rotate-90 transition-all duration-200 dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
