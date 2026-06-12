import { NavBar } from '@/components/NavBar'
import { themeMode, ThemeProvider } from '@/components/ThemeProvider'
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
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

const queryClient = new QueryClient()

function RootComponent() {
  return (
    <ThemeProvider defaultTheme={themeMode.light} storageKey="theme">
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col justify-start">
          <NavBar />
          <Main>
            <Outlet />
          </Main>
        </div>
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'TanStack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
      </QueryClientProvider>
    </ThemeProvider>
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
