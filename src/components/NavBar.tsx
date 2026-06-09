import { Logo } from '@/assets/logo'
import { ThemeToggler } from '@/components/ThemeToggler'
import { cn } from '@/lib/utils'
import { BusIcon, SubwayIcon } from '@phosphor-icons/react'
import { Link, useLocation } from '@tanstack/react-router'

export function NavBar() {
  const { pathname } = useLocation()

  return (
    <header className="w-full border-b px-2 py-1">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <a href="https://github.com/chapmankoo28/check-eta">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="cursor-pointer rounded-md p-2 text-2xl select-none">幾時到</span>
          </div>
        </a>

        <div className="flex gap-2">
          <Link to="/bus">
            <div
              className={cn(
                'flex cursor-pointer flex-row items-center justify-between gap-2 rounded-md border-2 border-transparent px-3 py-1 text-foreground select-none hover:bg-muted',
                pathname.includes('/bus') && 'border-primary'
              )}
            >
              <BusIcon weight="fill" /> 巴士
            </div>
          </Link>
          <Link to="/mtr">
            <div
              className={cn(
                'flex cursor-pointer flex-row items-center justify-between gap-2 rounded-md border-2 border-transparent px-3 py-1 text-foreground select-none hover:bg-muted',
                pathname.includes('/mtr') && 'border-primary'
              )}
            >
              <SubwayIcon weight="fill" /> 鐡路
            </div>
          </Link>
        </div>
        <div className="flex justify-end">
          <ThemeToggler />
        </div>
      </div>
    </header>
  )
}
