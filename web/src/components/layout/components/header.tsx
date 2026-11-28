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
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

import { useConsoleHeaderScrolled } from './console-scroll-context'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  isScrolled?: boolean
}

export function Header({
  className,
  children,
  isScrolled: isScrolledProp,
  ...props
}: HeaderProps) {
  const contextScrolled = useConsoleHeaderScrolled()
  const isScrolled = isScrolledProp ?? contextScrolled

  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-[var(--app-header-height,3.5rem)] w-full shrink-0 border-b border-border/60 bg-background/85 backdrop-blur-xl transition-[background-color,border-color,backdrop-filter] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-white/[0.06] dark:bg-[#050507]/75',
        isScrolled
          ? 'md:border-border/60 md:bg-background/72 md:backdrop-blur-2xl md:backdrop-saturate-150 dark:md:border-white/[0.05] dark:md:bg-[#08080a]/48'
          : 'md:border-b-transparent md:bg-transparent md:backdrop-blur-none dark:md:border-b-transparent dark:md:bg-transparent',
        className
      )}
      {...props}
    >
      <div className='flex h-full items-center gap-2 px-4 md:px-6'>
        <SidebarTrigger
          variant='ghost'
          className='size-8 rounded-lg text-[#9a9aa2] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#f4f4f5] md:hidden'
        />
        {children}
      </div>
    </header>
  )
}
