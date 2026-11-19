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
import { cn } from '@/lib/utils'

export interface PriceComparisonProps {
  current: string
  original?: string
  unitLabel?: string
  className?: string
  originalClassName?: string
  currentClassName?: string
  unitClassName?: string
  title?: string
}

/**
 * Render the current group-multiplied price alongside an optional strikethrough
 * 1x original price when the active group ratio differs from 1x.
 */
export function PriceComparison(props: PriceComparisonProps) {
  return (
    <span
      className={cn(
        'inline-flex flex-wrap items-baseline gap-x-1 font-mono tabular-nums',
        props.className
      )}
      title={props.title}
    >
      {props.original && (
        <span
          className={cn(
            'text-muted-foreground/60 text-xs font-normal line-through',
            props.originalClassName
          )}
        >
          {props.original}
        </span>
      )}
      <span className={props.currentClassName}>{props.current}</span>
      {props.unitLabel && (
        <span
          className={cn(
            'text-muted-foreground text-xs font-normal whitespace-nowrap',
            props.unitClassName
          )}
        >
          {' '}
          / {props.unitLabel}
        </span>
      )}
    </span>
  )
}
