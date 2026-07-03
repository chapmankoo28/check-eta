import type { CtbEta, KmbEta } from '@/features/bus/types'
import {
  busCoBorder,
  formatEtaRemark,
  getBusCompanyCode,
  getEtaInMinutes,
} from '@/features/bus/utils'
import { cn } from '@/lib/utils'

export function EtaBoxes({ eta, isError }: { eta: CtbEta[] | KmbEta[]; isError: boolean }) {
  if (eta.length === 0 || eta.every((i) => !i.eta && !i.rmk_tc)) {
    if (isError) {
      return (
        <div className="text-center">
          <span className="text-lg text-destructive">搵唔到班次，請再試一次</span>
        </div>
      )
    }
    return (
      <div className="text-center">
        <span className="text-lg text-secondary-foreground">暫無班次</span>
      </div>
    )
  }

  if (eta.every((i) => !i.eta && i.rmk_tc)) {
    return eta.map((i) => (
      <div key={`rmk-${i.seq}`} className="text-center">
        <span className="text-lg">{formatEtaRemark(i)}</span>
      </div>
    ))
  }

  return (
    <div className="flex items-center gap-1 sm:gap-3">
      {eta.map((i, index) => {
        if (!i.eta) {
          return null
        }

        const coCode = getBusCompanyCode(i.co, i.route)
        const etaInMin = getEtaInMinutes(i.eta)
        return (
          <div
            key={`eta-${i.seq}-${i.eta_seq}`}
            className={cn(
              'flex flex-col items-center justify-center rounded-md border bg-secondary',
              index === 0 ? 'h-30 w-30' : 'h-24 w-24',
              busCoBorder[coCode]
            )}
          >
            {etaInMin !== null && etaInMin >= 0 ? (
              <>
                <div className={cn(index === 0 ? 'text-5xl font-bold' : 'text-2xl font-medium')}>
                  {etaInMin}
                </div>
                <div className={cn(index === 0 ? 'text-base' : 'text-sm')}>分鐘</div>
              </>
            ) : (
              <div className={cn(index === 0 ? 'text-lg' : 'text-base')}>已過站</div>
            )}
            {i.rmk_tc && (
              <div className="text-sm font-light text-secondary-foreground italic">
                {formatEtaRemark(i)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
