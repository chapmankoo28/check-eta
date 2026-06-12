import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
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
      <TooltipTrigger>
        <Button
          variant="secondary"
          onClick={handleSwapBound}
          size={'icon-sm'}
          className={className}
        >
          <ArrowsDownUpIcon className={'text-foreground'} data-icon="inline-start" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>調轉方向</TooltipContent>
    </Tooltip>
  )
}
