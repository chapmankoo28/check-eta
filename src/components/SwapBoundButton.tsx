import { Button } from '@/components/ui/button'
import { ArrowsDownUpIcon } from '@phosphor-icons/react'

export function SwapBoundButton({ handleSwapBound }: { handleSwapBound: () => void }) {
  return (
    <Button variant="secondary" onClick={handleSwapBound}>
      <ArrowsDownUpIcon className={'text-foreground'} data-icon="inline-start" />
      調轉方向
    </Button>
  )
}
