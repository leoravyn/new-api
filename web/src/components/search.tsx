/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useSearch } from '@/context/search-provider'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'

type SearchProps = {
  className?: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
}

export function Search({ className = '', placeholder }: SearchProps) {
  const { t } = useTranslation()
  const { setOpen } = useSearch()
  const resolvedPlaceholder = placeholder ?? t('Search')
  return (
    <Button
      variant='ghost'
      className={cn(
        'border-border/80 bg-muted/40 text-muted-foreground hover:bg-accent hover:text-foreground group relative flex h-8 w-8 items-center justify-center gap-2 rounded-full border px-0 text-xs font-normal backdrop-blur-md transition-all duration-200 sm:w-40 sm:justify-between sm:px-3 md:flex-none lg:w-44 xl:w-48 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-zinc-400 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:hover:border-white/[0.15] dark:hover:bg-white/[0.065] dark:hover:text-zinc-100',
        className
      )}
      onClick={() => setOpen(true)}
      aria-label={resolvedPlaceholder}
    >
      <span className='flex min-w-0 items-center gap-2'>
        <SearchIcon
          aria-hidden='true'
          className='size-3.5 shrink-0 transition-colors'
        />
        <span className='hidden truncate text-xs sm:inline'>
          {resolvedPlaceholder}
        </span>
      </span>
      <kbd className='bg-muted/80 text-muted-foreground pointer-events-none hidden h-5 shrink-0 items-center gap-0.5 rounded-full px-2 font-mono text-[10px] font-medium transition-colors select-none sm:inline-flex dark:bg-white/[0.07] dark:text-zinc-400 dark:group-hover:text-zinc-200'>
        <span className='text-[11px]'>⌘</span>
        {t('K')}
      </kbd>
    </Button>
  )
}
