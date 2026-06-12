export function BusStopIcon({ h = 32, className }: { h?: number; className?: string }) {
  return (
    <svg
      width={h / 2}
      height={h}
      viewBox="0 0 41 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Bus Stop Icon</title>
      <path d="M22.1596 17.5732H18.375V79.9999H22.1596V17.5732Z" fill="currentColor" />
      <path
        d="M20.2672 40.2065C31.4605 40.2065 40.5345 31.206 40.5345 20.1033C40.5345 9.00054 31.4605 0 20.2672 0C9.07395 0 0 9.00054 0 20.1033C0 31.206 9.07395 40.2065 20.2672 40.2065Z"
        fill="currentColor"
      />
      <path d="M33.9799 10.7996H6.52728V29.3795H33.9799V10.7996Z" fill="var(--background)" />
    </svg>
  )
}
