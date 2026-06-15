import { NavBar } from '@/components/NavBar'
import { Providers } from '@/components/Providers'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Main } from '@/layouts/Main'
import '@/styles/global.css'
import { HouseIcon } from '@phosphor-icons/react'
import { QuestionMarkIcon } from '@phosphor-icons/react/dist/ssr'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <Providers>
      <div className="flex flex-col justify-start">
        <NavBar />
        <Main>
          <Outlet />
        </Main>
      </div>
    </Providers>
  )
}

function NotFound() {
  return (
    <div className="grid flex-1 place-content-center">
      <Empty>
        <EmptyMedia variant="icon">
          <QuestionMarkIcon className="size-8" />
        </EmptyMedia>
        <EmptyTitle>Page Not Found</EmptyTitle>
        <EmptyDescription>
          The link might be broken or the page may have been removed.
        </EmptyDescription>
        <EmptyContent>
          <Link to="/">
            <Button aria-label="Back to home page">
              <HouseIcon data-icon="inline-start" />
              Back to home page
            </Button>
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  )
}
