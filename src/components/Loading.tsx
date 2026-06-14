import { Spinner } from '@/components/ui/spinner'

export function Loading() {
  return (
    <div className="flex flex-col items-center">
      <div className="my-10">
        <Spinner className="size-8" />
      </div>
    </div>
  )
}
