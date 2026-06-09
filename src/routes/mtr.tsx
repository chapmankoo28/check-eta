import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mtr')({
  component: Mtr,
})

function Mtr() {
  return (
    <div className="grid place-content-center p-5">
      <h1 className="text-3xl font-bold">鐡路幾時到</h1>
    </div>
  )
}
