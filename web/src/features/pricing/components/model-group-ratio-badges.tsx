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

import { isDynamicPricingModel } from '../lib/dynamic-price'
import { getModelGroupMultipliers, isTokenBasedModel } from '../lib/model-helpers'
import type { PricingModel } from '../types'

export interface ModelGroupRatioBadgesProps {
  model: PricingModel
  selectedGroup?: string
  size?: 'sm' | 'xs'
  maxVisible?: number
  className?: string
}

/**
 * Render concise group multiplier pills (e.g. "Proxy · 0.3x", "Official · 1x")
 * instead of raw legacy model_ratio values.
 */
export function ModelGroupRatioBadges(props: ModelGroupRatioBadgesProps) {
  const items = getModelGroupMultipliers(props.model, props.selectedGroup)
  const size = props.size ?? 'sm'
  const maxVisible = props.maxVisible ?? 2

  const pillSizeClass =
    size === 'xs'
      ? 'rounded px-1.5 py-px text-[10px]'
      : 'rounded-md px-1.5 py-0.5 text-[11px]'

  if (items.length === 0) {
    if (
      !isDynamicPricingModel(props.model) &&
      isTokenBasedModel(props.model) &&
      props.model.model_ratio != null
    ) {
      return (
        <span
          className={cn(
            'shrink-0 border border-white/[0.08] bg-[#141417] font-mono text-zinc-400',
            pillSizeClass,
            props.className
          )}
        >
          {props.model.model_ratio}x
        </span>
      )
    }
    return null
  }

  const visibleItems = items.slice(0, maxVisible)
  const hiddenItems = items.slice(maxVisible)

  return (
    <div className={cn('flex flex-wrap items-center gap-1', props.className)}>
      {visibleItems.map((item) => (
        <span
          key={item.group}
          className={cn(
            'shrink-0 border font-mono leading-tight',
            pillSizeClass,
            item.ratio < 1
              ? 'border-white/[0.16] bg-white/[0.08] text-[#fafafa]'
              : 'border-white/[0.08] bg-[#141417] text-zinc-300'
          )}
        >
          {item.label}
        </span>
      ))}
      {hiddenItems.length > 0 && (
        <span
          title={hiddenItems.map((item) => item.label).join(', ')}
          className={cn(
            'shrink-0 border border-white/[0.08] bg-[#141417] font-mono leading-tight text-zinc-400',
            pillSizeClass
          )}
        >
          +{hiddenItems.length}
        </span>
      )}
    </div>
  )
}
