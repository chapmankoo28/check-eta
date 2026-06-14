import { buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ArrowsDownUpIcon } from '@phosphor-icons/react'

export function SwapBoundButton({
  handleSwapBound,
  className,
}: {
  handleSwapBound: () => void
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={handleSwapBound}
        className={cn(
          buttonVariants({ variant: 'secondary', size: 'icon' }),
          'shadow-none',
          className
        )}
      >
        <ArrowsDownUpIcon data-icon="inline-start" className="size-5 text-foreground" />
      </TooltipTrigger>
      <TooltipContent>調轉方向</TooltipContent>
    </Tooltip>
  )
}
