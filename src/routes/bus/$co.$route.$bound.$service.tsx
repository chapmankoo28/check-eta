import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

export const Route = createFileRoute('/bus/$co/$route/$bound/$service')({
  validateSearch: z.object({
    stop: z.coerce.string().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { stop } = Route.useSearch()
  return <div>Hello {stop}</div>
}
