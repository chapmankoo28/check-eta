import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useRef, type ChangeEvent } from 'react'

export function SearchBar({
  q,
  onSearch,
  className,
}: {
  q: string
  onSearch: (q: string) => void
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const updateUrl = (newQ: string) => {
    const url = new URL(window.location.href)
    if (newQ) {
      url.searchParams.set('q', newQ)
    } else {
      url.searchParams.delete('q')
    }
    window.history.replaceState({}, '', url)
  }

  const clearInputBox = () => {
    onSearch('')
    updateUrl('')
    inputRef.current?.focus()
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
    updateUrl(e.target.value)
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <InputGroup className={cn('w-full max-w-xl', className)}>
      <InputGroupAddon align="inline-start">
        <MagnifyingGlassIcon />
      </InputGroupAddon>
      <InputGroupInput
        ref={inputRef}
        value={q}
        placeholder="請輸入路線"
        aria-label="請輸入路線"
        onChange={handleInputChange}
      />
      {q.length !== 0 && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="destructive"
            size="icon-sm"
            className="rounded-full"
            aria-label="Clear search"
            onClick={clearInputBox}
          >
            <XIcon className="size-5" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
