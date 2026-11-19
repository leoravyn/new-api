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
import { ChevronRight } from 'lucide-react'
import { memo, useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { getLobeIcon } from '@/lib/lobe-icon'
import { cn } from '@/lib/utils'
import { useSystemConfigStore } from '@/stores/system-config-store'

import { DEFAULT_TOKEN_UNIT } from '../constants'
import { useBillingTime } from '../hooks/use-billing-time'
import {
  getCardExamplePrice,
  getDynamicDisplayGroupRatio,
  getDynamicEntryDisplayPrices,
  getDynamicPriceUnitLabelKey,
  getDynamicPricingSummary,
  isDynamicPricingModel,
  isUnconfiguredTaskUsageModel,
} from '../lib/dynamic-price'
import { parseTags } from '../lib/filters'
import {
  getModelGroupMultipliers,
  isTokenBasedModel,
} from '../lib/model-helpers'
import {
  getRequestPriceComparison,
  getTokenPriceComparison,
} from '../lib/price'
import { taskPriceLabel, taskUsageUnitLabel } from '../lib/task-price-display'
import type { PricingModel, PriceType, TokenUnit } from '../types'
import { ModelBillingModeBadge } from './model-billing-mode-badge'
import { ModelGroupRatioBadges } from './model-group-ratio-badges'
import { ModelPerfBadge, type ModelPerfBadgeData } from './model-perf-badge'
import { PriceComparison } from './price-comparison'

export interface ModelCardProps {
  model: PricingModel
  onClick: (modelName: string) => void
  priceRate?: number
  usdExchangeRate?: number
  tokenUnit?: TokenUnit
  showRechargePrice?: boolean
  selectedGroup?: string
  perf?: ModelPerfBadgeData
}

export const ModelCard = memo(function ModelCard(props: ModelCardProps) {
  const { t, i18n } = useTranslation()
  const tokenUnit = props.tokenUnit ?? DEFAULT_TOKEN_UNIT
  const priceRate = props.priceRate ?? 1
  const usdExchangeRate = props.usdExchangeRate ?? 1
  const showRechargePrice = props.showRechargePrice ?? false
  const isTokenBased = isTokenBasedModel(props.model)
  const tokenUnitLabel = tokenUnit === 'K' ? '1K' : '1M'
  const tags = parseTags(props.model.tags)
  const groupMultipliers = getModelGroupMultipliers(
    props.model,
    props.selectedGroup
  )
  const modelIconKey = props.model.icon || props.model.vendor_icon
  const modelIcon = modelIconKey ? getLobeIcon(modelIconKey, 28) : null
  const initial = props.model.model_name?.charAt(0).toUpperCase() || '?'
  const isUnconfiguredTaskUsage = isUnconfiguredTaskUsageModel(props.model)
  const billingTime = useBillingTime(props.model.billing_expr)
  const currency = useSystemConfigStore((state) => state.config.currency)
  const dynamicPriceOptions = useMemo(
    () => ({
      now: billingTime === undefined ? undefined : new Date(billingTime),
      tokenUnit,
      showRechargePrice,
      priceRate,
      usdExchangeRate,
      groupRatioMultiplier: getDynamicDisplayGroupRatio(
        props.model,
        props.selectedGroup
      ),
    }),
    [
      props.model,
      props.selectedGroup,
      billingTime,
      tokenUnit,
      showRechargePrice,
      priceRate,
      usdExchangeRate,
    ]
  )
  const dynamicSummary = useMemo(
    () => getDynamicPricingSummary(props.model, dynamicPriceOptions),
    // Currency is read indirectly by the price formatter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.model, dynamicPriceOptions, currency]
  )
  const cardExamplePrice = useMemo(
    () => getCardExamplePrice(props.model, dynamicPriceOptions),
    // Currency is read indirectly by the price formatter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.model, dynamicPriceOptions, currency]
  )
  let priceSummary: ReactNode
  if (dynamicSummary) {
    const cacheReadEntries = dynamicSummary.secondaryEntries.filter(
      (entry) => entry.field === 'cacheReadPrice' && entry.unit === 'token'
    )
    if (dynamicSummary.isSpecialExpression) {
      priceSummary = (
        <div className='col-span-full min-w-0'>
          <span className='text-warning'>
            {t('Special billing expression')}
          </span>
          <code className='text-muted-foreground mt-1 line-clamp-2 block font-mono text-xs break-all'>
            {dynamicSummary.rawExpression}
          </code>
        </div>
      )
    } else if (
      dynamicSummary.primaryEntries.length > 0 ||
      cacheReadEntries.length > 0
    ) {
      priceSummary = (
        <>
          {[
            dynamicSummary.primaryEntries.slice(
              0,
              dynamicSummary.providerCount ? 2 : undefined
            ),
            cacheReadEntries,
          ]
            .flat()
            .map((entry) => {
              const unitLabelKey = getDynamicPriceUnitLabelKey(entry)
              const unitLabel = taskUsageUnitLabel(
                entry,
                i18n.language,
                unitLabelKey ? t(unitLabelKey) : tokenUnitLabel
              )
              let label: ReactNode = null
              if (entry.labelKind !== 'schema') {
                label = t(entry.shortLabel)
              } else {
                label = taskPriceLabel(
                  entry.description,
                  entry.shortLabel,
                  i18n.language
                )
              }
              const { current, original } = getDynamicEntryDisplayPrices(entry)
              return (
                <div
                  key={entry.key}
                  className={cn(
                    'flex min-w-0 flex-col gap-1',
                    dynamicSummary.isTaskUsage && 'col-span-full'
                  )}
                >
                  {label && (
                    <span className='text-muted-foreground text-xs break-words whitespace-normal'>
                      {label}
                    </span>
                  )}
                  <PriceComparison
                    current={current}
                    original={original}
                    unitLabel={unitLabel}
                    className='text-sm font-semibold'
                  />
                </div>
              )
            })}
          {dynamicSummary.isTimePricing && (
            <span className='text-muted-foreground col-span-full text-xs'>
              {t('Current period price')}
            </span>
          )}
          {dynamicSummary.isMixedBilling && (
            <span className='text-muted-foreground col-span-full text-xs'>
              {t('Token or per-call pricing')}
            </span>
          )}
          {cardExamplePrice && (
            <span className='text-muted-foreground col-span-full flex flex-wrap items-baseline gap-x-1 text-xs break-words tabular-nums'>
              <span>{cardExamplePrice.label} ≈</span>
              {cardExamplePrice.originalFormatted && (
                <span className='text-muted-foreground/60 line-through'>
                  {cardExamplePrice.originalFormatted}
                </span>
              )}
              <span>{cardExamplePrice.formatted}</span>
            </span>
          )}
          {dynamicSummary.isTaskUsage &&
            dynamicSummary.tierCount > 1 &&
            dynamicSummary.tier?.label &&
            !dynamicSummary.primaryEntries.some(
              (entry) => entry.formattedRange
            ) && (
              <span className='text-muted-foreground col-span-full text-xs break-words'>
                ({dynamicSummary.tier.label})
              </span>
            )}
        </>
      )
    } else {
      priceSummary = (
        <span className='text-muted-foreground col-span-full'>
          {dynamicSummary.hasUnconfiguredProviders
            ? t('Usage-based billing · price not configured')
            : t('Dynamic Pricing')}
        </span>
      )
    }
  } else if (isUnconfiguredTaskUsage) {
    priceSummary = (
      <span className='text-muted-foreground col-span-full'>
        {t('Usage-based billing · price not configured')}
      </span>
    )
  } else if (isTokenBased) {
    const prices: { type: PriceType; label: string }[] = [
      { type: 'input', label: t('Input') },
      { type: 'output', label: t('Output') },
      ...(props.model.cache_ratio != null
        ? [{ type: 'cache' as const, label: t('Cached') }]
        : []),
    ]
    priceSummary = prices.map((price) => {
      const comparison = getTokenPriceComparison(
        props.model,
        price.type,
        tokenUnit,
        {
          showWithRecharge: showRechargePrice,
          priceRate,
          usdExchangeRate,
          selectedGroup: props.selectedGroup,
        }
      )
      return (
        <div key={price.type} className='flex min-w-0 flex-col gap-1'>
          <span className='text-muted-foreground text-xs'>{price.label}</span>
          <PriceComparison
            current={comparison.current}
            original={comparison.original}
            unitLabel={tokenUnitLabel}
            className='text-sm font-semibold'
          />
        </div>
      )
    })
  } else {
    const comparison = getRequestPriceComparison(props.model, {
      showWithRecharge: showRechargePrice,
      priceRate,
      usdExchangeRate,
      selectedGroup: props.selectedGroup,
    })
    priceSummary = (
      <div className='col-span-full flex min-w-0 flex-col gap-1'>
        <PriceComparison
          current={comparison.current}
          original={comparison.original}
          unitLabel={t('request')}
          className='text-sm font-semibold'
        />
      </div>
    )
  }

  return (
    <Card className='group/card h-full min-w-0 gap-3.5 rounded-2xl border-white/[0.08] bg-[#0a0a0c] p-1 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-[#111114]'>
      <CardHeader className='flex flex-row items-start gap-3'>
        <div
          aria-hidden
          className='flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#141417] text-zinc-200'
        >
          {modelIcon || (
            <span className='text-sm font-bold text-zinc-400'>{initial}</span>
          )}
        </div>
        <div className='min-w-0 flex-1'>
          <h3
            className='truncate font-mono text-[15px] leading-snug font-semibold text-[#fafafa]'
            title={props.model.model_name}
          >
            {props.model.model_name}
          </h3>
          <div className='text-muted-foreground mt-1 flex items-center gap-1.5 text-xs'>
            {props.model.vendor_name && (
              <>
                <span className='truncate' title={props.model.vendor_name}>
                  {props.model.vendor_name}
                </span>
                <span className='text-white/20'>·</span>
              </>
            )}
            <span className='inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-zinc-300'>
              <span className='size-1.5 rounded-full bg-[#fafafa]' />
              {t('Available')}
            </span>
          </div>
        </div>
        <CopyButton
          value={props.model.model_name}
          tooltip={t('Copy model name')}
          className='size-7 shrink-0'
          iconClassName='size-3.5'
        />
      </CardHeader>
      <CardContent className='flex flex-1 flex-col gap-3'>
        {(props.model.description || tags.length > 0) && (
          <div className='flex min-w-0 flex-col gap-2'>
            {props.model.description && (
              <p className='text-muted-foreground line-clamp-2 text-[13px] leading-5 break-words'>
                {props.model.description}
              </p>
            )}
            {tags.length > 0 && (
              <div
                role='group'
                aria-label={t('Tags')}
                className='flex flex-wrap items-center gap-1.5 text-xs'
              >
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className='rounded-md border border-white/[0.08] bg-[#141417] px-2 py-0.5 text-[11px] text-zinc-300'
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span
                    className='text-muted-foreground text-[11px]'
                    title={tags.slice(3).join(', ')}
                  >
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        <div
          role='group'
          aria-label={t('Pricing')}
          className='mt-auto flex min-w-0 flex-col gap-2 rounded-xl border border-white/[0.08] bg-[#050506]/80 p-3'
        >
          <div className='flex flex-wrap items-center justify-between gap-2'>
            {groupMultipliers.length > 0 &&
            isDynamicPricingModel(props.model) ? (
              <span className='text-[11px] font-medium text-zinc-400'>
                {t('Group Ratio')}
              </span>
            ) : (
              <ModelBillingModeBadge model={props.model} appearance='caption' />
            )}
            <ModelGroupRatioBadges
              model={props.model}
              selectedGroup={props.selectedGroup}
              size='sm'
            />
          </div>
          {dynamicSummary?.providerCount && (
            <span className='text-muted-foreground text-xs break-words'>
              {t('{{count}} providers', {
                count: dynamicSummary.providerCount,
              })}
            </span>
          )}
          <div className='grid grid-cols-[repeat(auto-fit,minmax(88px,1fr))] gap-x-3 gap-y-2'>
            {priceSummary}
          </div>
        </div>
      </CardContent>
      <CardFooter className='mt-auto border-0 bg-transparent pt-0'>
        <ModelPerfBadge
          perf={props.perf}
          className='border-border/60 border-t pt-2'
        >
          <Button
            variant='ghost'
            size='sm'
            onClick={() => props.onClick(props.model.model_name || '')}
          >
            {t('Details')}
            <ChevronRight aria-hidden className='size-3.5' />
          </Button>
        </ModelPerfBadge>
      </CardFooter>
    </Card>
  )
})
