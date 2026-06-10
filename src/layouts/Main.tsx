import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function Main({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <main className={cn('mx-auto my-2 w-full max-w-7xl px-24 max-sm:px-5 sm:my-5', className)}>
      {children}
    </main>
  )
}
