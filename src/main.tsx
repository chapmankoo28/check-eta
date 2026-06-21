import { queryClient } from '@/lib/queryClient'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import ReactDom from 'react-dom/client'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: { queryClient },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDom.createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}
