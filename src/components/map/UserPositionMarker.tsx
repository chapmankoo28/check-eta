export function UserPositionMarker() {
  return (
    <span className="relative flex size-5">
      <span className="absolute h-full w-full rounded-full bg-primary opacity-75 transition-all motion-safe:animate-ping"></span>
      <span className="relative size-5 rounded-full border-3 border-white bg-primary"></span>
    </span>
  )
}
