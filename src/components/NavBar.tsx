import { Logo } from '@/assets/logo'
import { ThemeToggler } from '@/components/ThemeToggler'
import { cn } from '@/lib/utils'
import { BusIcon, SubwayIcon } from '@phosphor-icons/react'
import { Link, useLocation } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'

export function NavBar() {
  const { pathname } = useLocation()

  return (
    <header className="w-full border-b px-2 py-1 dark:bg-black">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <a href="https://github.com/chapmankoo28/check-eta">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="cursor-pointer rounded-md p-2 text-2xl select-none">幾時到</span>
          </div>
        </a>

        <div className="flex gap-2">
          <NavBarItem className={cn(pathname.includes('/bus') && 'border-primary')} path="/bus">
            <BusIcon className="size-8" weight={pathname.includes('/bus') ? 'fill' : undefined} />
            <span className="text-lg">巴士</span>
          </NavBarItem>

          <NavBarItem className={cn(pathname.includes('/mtr') && 'border-primary')} path="/mtr">
            <SubwayIcon
              className="size-8"
              weight={pathname.includes('/mtr') ? 'fill' : undefined}
            />
            <span className="text-lg">鐡路</span>
          </NavBarItem>
        </div>
        <div className="flex justify-end">
          <ThemeToggler />
        </div>
      </div>
    </header>
  )
}

function NavBarItem({
  path,
  children,
  className,
}: PropsWithChildren<{ path: string; className?: string }>) {
  return (
    <Link to={path}>
      <div
        className={cn(
          'flex cursor-pointer flex-row items-center justify-between gap-1 rounded-md border-2 border-transparent px-3 py-1 text-foreground select-none hover:bg-muted',
          className
        )}
      >
        {children}
      </div>
    </Link>
  )
}
