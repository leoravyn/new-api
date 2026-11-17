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
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'
import { getLobeIcon } from '@/lib/lobe-icon'

import { parseTags } from '../lib/filters'
import type { ModelCapability, PricingModel } from '../types'
import { CachedPriceCell } from './cached-price-cell'
import { ModelGroupRatioBadges } from './model-group-ratio-badges'
import { ModelPriceCell, type ModelPriceCellOptions } from './model-price-cell'

// ----------------------------------------------------------------------------
// Pricing Table Columns (OpenRouter Directory Style)
// ----------------------------------------------------------------------------

const CAPABILITY_LABEL_KEYS: Record<ModelCapability, string> = {
  function_calling: 'Function calling',
  streaming: 'Streaming',
  vision: 'Vision',
  json_mode: 'JSON mode',
  structured_output: 'Structured output',
  reasoning: 'Reasoning',
  tools: 'Tools',
  system_prompt: 'System prompt',
  web_search: 'Web search',
  code_interpreter: 'Code interpreter',
  caching: 'Prompt caching',
  embeddings: 'Embeddings',
}

const TOKEN_FORMAT = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
})

function formatContextLength(tokens?: number): string {
  if (tokens == null || !Number.isFinite(tokens) || tokens <= 0) {
    return ''
  }
  if (tokens >= 1_000_000) {
    return `${TOKEN_FORMAT.format(tokens / 1_000_000)}M`
  }
  if (tokens >= 1_000) {
    return `${TOKEN_FORMAT.format(tokens / 1_000)}K`
  }
  return TOKEN_FORMAT.format(tokens)
}

function collectModelCapsules(
  model: PricingModel,
  t: (key: string) => string
): string[] {
  const seen = new Set<string>()
  const items: string[] = []

  for (const cap of model.capabilities ?? []) {
    const labelKey = CAPABILITY_LABEL_KEYS[cap]
    if (!labelKey) continue
    const label = t(labelKey)
    const normalized = label.toLowerCase()
    if (!seen.has(normalized)) {
      seen.add(normalized)
      items.push(label)
    }
  }

  for (const tag of parseTags(model.tags)) {
    const normalized = tag.toLowerCase()
    if (!seen.has(normalized)) {
      seen.add(normalized)
      items.push(tag)
    }
  }

  return items
}

export type PricingColumnsOptions = ModelPriceCellOptions & {
  showCapabilities?: boolean
  showContext?: boolean
}

export function usePricingColumns(
  options: PricingColumnsOptions = {}
): ColumnDef<PricingModel>[] {
  const { t } = useTranslation()
  const showCapabilities = options.showCapabilities ?? true
  const showContext = options.showContext ?? true

  return [
    // Model name & slug column
    {
      accessorKey: 'model_name',
      meta: { label: t('Model') },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('Model')} />
      ),
      cell: ({ row }) => {
        const model = row.original
        const modelIconKey = model.icon || model.vendor_icon
        const modelIcon = modelIconKey ? getLobeIcon(modelIconKey, 16) : null
        const slashIndex = model.model_name.indexOf('/')
        const displayTitle =
          slashIndex > 0
            ? model.model_name.slice(slashIndex + 1)
            : model.model_name
        const initial = (displayTitle[0] ?? 'M').toUpperCase()
        const showFullSlug = displayTitle !== model.model_name

        return (
          <div className='flex max-w-full min-w-0 items-center gap-3 py-0.5'>
            <div
              aria-hidden
              className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#141417] text-zinc-200'
            >
              {modelIcon || (
                <span className='font-mono text-xs font-semibold text-zinc-400'>
                  {initial}
                </span>
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-1.5'>
                <span className='truncate font-mono text-sm font-semibold text-[#fafafa]'>
                  {displayTitle}
                </span>
                <span
                  className='shrink-0'
                  onClick={(event) => event.stopPropagation()}
                >
                  <CopyButton
                    value={model.model_name}
                    tooltip={t('Copy model name')}
                    className='size-6'
                    iconClassName='size-3'
                  />
                </span>
              </div>
              {showFullSlug && (
                <div className='truncate font-mono text-[11px] text-zinc-400'>
                  {model.model_name}
                </div>
              )}
              {model.description && (
                <div className='mt-0.5 truncate text-xs text-zinc-500'>
                  {model.description}
                </div>
              )}
            </div>
          </div>
        )
      },
      minSize: 230,
    },

    // Clean monochrome vendor icon/badge column
    {
      accessorKey: 'vendor_name',
      header: t('Vendor'),
      cell: ({ row }) => {
        const model = row.original
        if (!model.vendor_name) {
          return <span className='text-xs text-zinc-600'>—</span>
        }
        const vendorIcon = model.vendor_icon
          ? getLobeIcon(model.vendor_icon, 13)
          : null
        return (
          <span className='inline-flex max-w-full items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#141417] px-2 py-1 text-xs font-medium text-zinc-200'>
            {vendorIcon && (
              <span className='shrink-0 text-zinc-300 opacity-90'>
                {vendorIcon}
              </span>
            )}
            <span className='truncate'>{model.vendor_name}</span>
          </span>
        )
      },
      size: 120,
      enableSorting: false,
    },

    // Group ratio column
    {
      id: 'group_ratio',
      header: t('Group Ratio'),
      cell: ({ row }) => (
        <ModelGroupRatioBadges
          model={row.original}
          selectedGroup={options.selectedGroup}
          size='xs'
        />
      ),
      size: 140,
      enableSorting: false,
    },

    // Compact capability capsules column (shown only when catalog has data)
    ...(showCapabilities
      ? [
          {
            id: 'capabilities',
            header: t('Capabilities'),
            cell: ({ row }) => {
              const capsules = collectModelCapsules(row.original, t)
              if (capsules.length === 0) {
                return <span className='text-xs text-zinc-600'>—</span>
              }
              const visible = capsules.slice(0, 3)
              const overflow = capsules.length - visible.length
              return (
                <div className='flex flex-wrap items-center gap-1'>
                  {visible.map((item) => (
                    <span
                      key={item}
                      className='rounded-full border border-white/[0.08] bg-[#141417] px-2 py-0.5 text-[11px] font-medium text-zinc-300'
                    >
                      {item}
                    </span>
                  ))}
                  {overflow > 0 && (
                    <span
                      className='rounded-full border border-white/[0.08] bg-[#141417] px-1.5 py-0.5 font-mono text-[10px] text-zinc-400'
                      title={capsules.slice(3).join(', ')}
                    >
                      +{overflow}
                    </span>
                  )}
                </div>
              )
            },
            size: 170,
            enableSorting: false,
          } satisfies ColumnDef<PricingModel>,
        ]
      : []),

    // Context length column (shown only when catalog has data)
    ...(showContext
      ? [
          {
            id: 'context_length',
            header: t('Context'),
            cell: ({ row }) => {
              const formatted = formatContextLength(row.original.context_length)
              if (!formatted) {
                return <span className='font-mono text-xs text-zinc-600'>—</span>
              }
              return (
                <span className='font-mono text-xs font-medium text-zinc-200 tabular-nums'>
                  {formatted}
                </span>
              )
            },
            size: 86,
            enableSorting: false,
          } satisfies ColumnDef<PricingModel>,
        ]
      : []),

    // Input / Output price column
    {
      accessorKey: 'price',
      meta: { label: `${t('Input')} / ${t('Output')}` },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={`${t('Input')} / ${t('Output')}`}
        />
      ),
      cell: ({ row }) => (
        <ModelPriceCell model={row.original} options={options} />
      ),
      size: 180,
      enableSorting: false,
    },

    // Cached price column
    {
      id: 'cached_price',
      header: t('Cached'),
      cell: ({ row }) => (
        <CachedPriceCell model={row.original} options={options} />
      ),
      size: 92,
      enableSorting: false,
    },

    // Status column
    {
      id: 'availability',
      header: t('Status'),
      cell: () => (
        <span className='inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#141417] px-2.5 py-0.5 text-xs font-medium text-zinc-200'>
          <span className='size-1.5 rounded-full bg-[#fafafa]' />
          {t('Available')}
        </span>
      ),
      size: 90,
      enableSorting: false,
    },
  ]
}
