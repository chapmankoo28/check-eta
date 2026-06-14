import type { MtrLine } from '@/features/metro/types'
import { mtrLineBg } from '@/features/metro/utils'
import { cn } from '@/lib/utils'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

export function MetroLineCard({ line, name }: { line: MtrLine; name: string }) {
  return (
    <Link to="/mtr/$line/$dir" params={{ line, dir: 'DT' }}>
      <div className="flex flex-row items-center justify-between rounded-md border p-2 hover:bg-muted">
        <div className="flex flex-1 items-start gap-1">
          <div className={cn('h-9 w-3', mtrLineBg[line])}></div>
          <span className="text-3xl">{name}</span>
        </div>
        <ArrowRightIcon className="size-6" />
      </div>
    </Link>
  )
}
