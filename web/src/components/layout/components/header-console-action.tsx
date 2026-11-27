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
import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

import type { TopNavLink } from '../types'

export function splitHeaderNavLinks(links: TopNavLink[]) {
  return {
    navLinks: links.filter((link) => link.href !== '/dashboard'),
    consoleLink: links.find((link) => link.href === '/dashboard'),
  }
}

interface HeaderConsoleButtonProps {
  label: string
  emphasized?: boolean
  disabled?: boolean
  className?: string
}

export function HeaderConsoleButton({
  label,
  emphasized = false,
  disabled = false,
  className,
}: HeaderConsoleButtonProps) {
  return (
    <Link
      to='/dashboard'
      disabled={disabled}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-lg px-3.5 text-xs font-medium whitespace-nowrap transition-all duration-200',
        emphasized
          ? 'border border-white/25 bg-white/[0.08] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14)] hover:border-white/45 hover:bg-white/[0.14] hover:text-white'
          : 'border border-transparent bg-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      {label}
    </Link>
  )
}
