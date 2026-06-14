import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

export const Route = createFileRoute('/mtr/$line/$dir')({
  validateSearch: z.object({
    station: z.coerce.string().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { line, dir } = Route.useParams()
  const { station } = Route.useSearch()

  return (
    <div>
      {line} {dir} {station}
    </div>
  )
}
