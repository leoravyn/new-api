import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight, RefreshCw } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { usePricingData } from '@/features/pricing/hooks/use-pricing-data'
import {
  getDynamicPriceUnitLabelKey,
  getDynamicPricingSummary,
  isDynamicPricingModel,
} from '@/features/pricing/lib/dynamic-price'
import {
  getDisplayGroupRatio,
  getModelGroupMultipliers,
  isTokenBasedModel,
} from '@/features/pricing/lib/model-helpers'
import {
  formatFixedPrice,
  formatGroupPrice,
  formatPrice,
  formatRequestPrice,
} from '@/features/pricing/lib/price'
import type { PricingModel } from '@/features/pricing/types'
import { normalizeInterfaceLanguage } from '@/i18n/languages'
import { getLobeIcon } from '@/lib/lobe-icon'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { useSystemConfigStore } from '@/stores/system-config-store'

const FLAGSHIP_MODEL_PRIORITY = [
  'claude-fable-5.2',
  'claude-opus-5.5',
  'gpt-6-astra',
  'gpt-6.2-astra',
  'claude-sonnet-5.5',
  'gpt-6.2-sol',
  'gpt-6.1-sol',
] as const

const MAX_FLAGSHIP_MODELS = 4
const CARD_HEIGHT = 70
const CARD_GAP = 12
const CARD_STEP = CARD_HEIGHT + CARD_GAP
const EASE_LIQUID = [0.22, 1, 0.36, 1] as const
const SKELETON_SLOTS = [0, 1, 2, 3] as const

export interface FlagshipPriceItem {
  key: string
  labelZh: string
  labelEn: string
  current: string
  original?: string
  unitSuffixZh: string
  unitSuffixEn: string
}

export interface FlagshipModelDisplay {
  model: PricingModel
  modelName: string
  vendorName: string | null
  iconKey: string
  groupBadge: string | null
  groupRatio: number
  hasGroupMultiplier: boolean
  priceItems: FlagshipPriceItem[]
}

interface RouteGeometry {
  svgHeight: number
  originY: number
  routes: Array<{
    endpointY: number
    pathD: string
  }>
}

function buildRouteGeometry(count: number): RouteGeometry {
  const safeCount = Math.max(1, count)
  const svgHeight =
    safeCount * CARD_HEIGHT + Math.max(0, safeCount - 1) * CARD_GAP
  const originY = svgHeight / 2
  const routes = Array.from({ length: safeCount }, (_, index) => {
    const endpointY = CARD_HEIGHT / 2 + index * CARD_STEP
    const pathD = `M 8 ${originY} C 56 ${originY}, 58 ${endpointY}, 112 ${endpointY}`
    return { endpointY, pathD }
  })
  return { svgHeight, originY, routes }
}

function normalizeModelSlug(modelName: string): string {
  const trimmed = modelName.trim().toLowerCase()
  const slashIndex = trimmed.indexOf('/')
  return slashIndex >= 0 ? trimmed.slice(slashIndex + 1) : trimmed
}

/**
 * Select up to `maxCount` flagship models from live `/api/pricing` records,
 * prioritizing flagship IDs and filling remaining slots round-robin by vendor.
 */
export function selectFlagshipModels(
  models: readonly PricingModel[],
  maxCount = MAX_FLAGSHIP_MODELS
): PricingModel[] {
  if (models.length === 0 || maxCount <= 0) return []

  const selected: PricingModel[] = []
  const seenNames = new Set<string>()

  const pickModel = (candidate: PricingModel | undefined) => {
    if (!candidate || seenNames.has(candidate.model_name)) return false
    seenNames.add(candidate.model_name)
    selected.push(candidate)
    return true
  }

  for (const target of FLAGSHIP_MODEL_PRIORITY) {
    if (selected.length >= maxCount) break
    const exactMatch = models.find(
      (model) => model.model_name.toLowerCase() === target
    )
    if (pickModel(exactMatch)) continue

    const slugMatch = models.find(
      (model) => normalizeModelSlug(model.model_name) === target
    )
    pickModel(slugMatch)
  }

  if (selected.length >= maxCount) {
    return selected
  }

  const byVendor = new Map<string, PricingModel[]>()
  for (const model of models) {
    if (seenNames.has(model.model_name)) continue
    const vendorKey =
      model.vendor_name?.trim() ||
      (model.vendor_id != null ? `vendor:${model.vendor_id}` : 'other')
    const list = byVendor.get(vendorKey)
    if (list) {
      list.push(model)
    } else {
      byVendor.set(vendorKey, [model])
    }
  }

  const vendorQueues = [...byVendor.values()]
  while (selected.length < maxCount && vendorQueues.some((q) => q.length > 0)) {
    for (const queue of vendorQueues) {
      if (selected.length >= maxCount) break
      const next = queue.shift()
      pickModel(next)
    }
  }

  return selected
}

function getDynamicEntryLabels(
  field: string,
  unit: string,
  shortLabel: string
): { labelZh: string; labelEn: string } {
  if (field === 'inputPrice') return { labelZh: '输入', labelEn: 'In' }
  if (field === 'outputPrice') return { labelZh: '输出', labelEn: 'Out' }
  if (unit === 'request') return { labelZh: '按次', labelEn: 'Req' }
  if (unit === 'image') return { labelZh: '按图', labelEn: 'Img' }
  return { labelZh: shortLabel, labelEn: shortLabel }
}

function getDynamicUnitSuffixes(unitKey: string | null): {
  unitSuffixZh: string
  unitSuffixEn: string
} {
  if (unitKey === 'request')
    return { unitSuffixZh: '/次', unitSuffixEn: '/req' }
  if (unitKey === 'image') return { unitSuffixZh: '/图', unitSuffixEn: '/img' }
  if (unitKey === 's') return { unitSuffixZh: '/秒', unitSuffixEn: '/s' }
  if (unitKey === 'unit') return { unitSuffixZh: '/次', unitSuffixEn: '/unit' }
  if (unitKey === 'credit')
    return { unitSuffixZh: '/点数', unitSuffixEn: '/credit' }
  return { unitSuffixZh: '/1M', unitSuffixEn: '/1M' }
}

/**
 * Derive real display metadata, active group badge, and formatted current vs 1x
 * original prices from a live `PricingModel`.
 */
export function buildFlagshipModelDisplay(
  model: PricingModel
): FlagshipModelDisplay {
  const groupRatio = getDisplayGroupRatio(model)
  const hasGroupMultiplier = Math.abs(groupRatio - 1) > 1e-6
  const multipliers = getModelGroupMultipliers(model)
  const activeMultiplier =
    multipliers.find((item) => Math.abs(item.ratio - groupRatio) <= 1e-6) ??
    multipliers[0]

  const priceItems: FlagshipPriceItem[] = []

  if (isDynamicPricingModel(model)) {
    const currentSummary = getDynamicPricingSummary(model, {
      tokenUnit: 'M',
      groupRatioMultiplier: groupRatio,
    })
    const baseSummary = hasGroupMultiplier
      ? getDynamicPricingSummary(model, {
          tokenUnit: 'M',
          groupRatioMultiplier: 1,
        })
      : null

    if (currentSummary && !currentSummary.isSpecialExpression) {
      for (const entry of currentSummary.primaryEntries.slice(0, 2)) {
        const baseEntry = baseSummary?.primaryEntries.find(
          (item) => item.key === entry.key && item.field === entry.field
        )
        const current = entry.formattedRange ?? entry.formatted
        const rawOriginal =
          hasGroupMultiplier && baseEntry
            ? (baseEntry.formattedRange ?? baseEntry.formatted)
            : undefined
        const original =
          rawOriginal && rawOriginal !== current ? rawOriginal : undefined
        const labels = getDynamicEntryLabels(
          entry.field,
          entry.unit,
          entry.shortLabel
        )
        const suffixes = getDynamicUnitSuffixes(
          getDynamicPriceUnitLabelKey(entry)
        )

        priceItems.push({
          key: entry.key,
          ...labels,
          current,
          original,
          ...suffixes,
        })
      }
    }
  } else if (isTokenBasedModel(model)) {
    if (Number.isFinite(model.model_ratio)) {
      const inputCurrent = formatPrice(
        model,
        'input',
        'M',
        false,
        1,
        1,
        undefined,
        true
      )
      const inputBase = hasGroupMultiplier
        ? formatGroupPrice(model, '__base__', 'input', 'M', false, 1, 1, {})
        : undefined
      const outputCurrent = formatPrice(
        model,
        'output',
        'M',
        false,
        1,
        1,
        undefined,
        true
      )
      const outputBase = hasGroupMultiplier
        ? formatGroupPrice(model, '__base__', 'output', 'M', false, 1, 1, {})
        : undefined

      priceItems.push(
        {
          key: 'input',
          labelZh: '输入',
          labelEn: 'In',
          current: inputCurrent,
          original:
            inputBase && inputBase !== inputCurrent ? inputBase : undefined,
          unitSuffixZh: '/1M',
          unitSuffixEn: '/1M',
        },
        {
          key: 'output',
          labelZh: '输出',
          labelEn: 'Out',
          current: outputCurrent,
          original:
            outputBase && outputBase !== outputCurrent ? outputBase : undefined,
          unitSuffixZh: '/1M',
          unitSuffixEn: '/1M',
        }
      )
    }
  } else if (Number.isFinite(model.model_price)) {
    const reqCurrent = formatRequestPrice(model, false, 1, 1, undefined, true)
    const reqBase = hasGroupMultiplier
      ? formatFixedPrice(model, '__base__', false, 1, 1, {})
      : undefined

    priceItems.push({
      key: 'request',
      labelZh: '按次',
      labelEn: 'Req',
      current: reqCurrent,
      original: reqBase && reqBase !== reqCurrent ? reqBase : undefined,
      unitSuffixZh: '/次',
      unitSuffixEn: '/req',
    })
  }

  return {
    model,
    modelName: model.model_name,
    vendorName: model.vendor_name?.trim() || null,
    iconKey: model.icon || model.vendor_icon || model.vendor_name || '',
    groupBadge: activeMultiplier?.label ?? null,
    groupRatio,
    hasGroupMultiplier,
    priceItems,
  }
}

function FlagshipPriceRow(props: {
  item: FlagshipPriceItem
  isZh: boolean
  layout: 'desktop' | 'mobile'
}) {
  const { item, isZh, layout } = props
  const isDesktop = layout === 'desktop'

  return (
    <span
      className={cn(
        'items-baseline font-mono tabular-nums',
        isDesktop
          ? 'flex justify-end gap-1.5 text-xs leading-5'
          : 'inline-flex gap-1 text-[11px]'
      )}
    >
      <span className={cn('text-[#74747c]', isDesktop && 'text-[11px]')}>
        {isZh ? item.labelZh : item.labelEn}
      </span>
      {item.original && (
        <span
          className={cn(
            'text-[#74747c] line-through decoration-[#74747c]/70',
            isDesktop && 'text-[11px]'
          )}
        >
          {item.original}
        </span>
      )}
      <span className='font-semibold text-[#f4f4f5]'>
        {item.current}
        <span
          className={cn(
            'font-normal text-[#74747c]',
            isDesktop && 'text-[10px]'
          )}
        >
          {isZh ? item.unitSuffixZh : item.unitSuffixEn}
        </span>
      </span>
    </span>
  )
}

function FlagshipPriceList(props: {
  items: FlagshipPriceItem[]
  isZh: boolean
  layout: 'desktop' | 'mobile'
}) {
  const isDesktop = props.layout === 'desktop'
  const containerClass = isDesktop
    ? 'hidden shrink-0 text-right sm:block'
    : 'mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 sm:hidden'

  return (
    <div className={containerClass}>
      {props.items.length === 0 ? (
        <span className='font-mono text-[11px] text-zinc-400'>
          {props.isZh ? '按量计费' : 'Usage-based'}
        </span>
      ) : (
        props.items.map((item) => (
          <FlagshipPriceRow
            key={item.key}
            item={item}
            isZh={props.isZh}
            layout={props.layout}
          />
        ))
      )}
    </div>
  )
}

export function TokexHeroSection() {
  const { i18n } = useTranslation()
  const isAuthenticated = useAuthStore((s) => Boolean(s.auth.user))
  const currency = useSystemConfigStore((s) => s.config.currency)
  const prefersReducedMotion = useReducedMotion()

  const isZh =
    normalizeInterfaceLanguage(i18n.resolvedLanguage || i18n.language) ===
    'zhCN'

  const { models, vendors, isLoading, error, refetch } = usePricingData()

  const flagshipModels = useMemo(
    () => selectFlagshipModels(models, MAX_FLAGSHIP_MODELS),
    [models]
  )

  const flagshipDisplays = useMemo(
    () => flagshipModels.map((model) => buildFlagshipModelDisplay(model)),
    // Currency store is read indirectly inside billing formatters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flagshipModels, currency]
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion || isPaused || flagshipDisplays.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % flagshipDisplays.length)
    }, 3400)

    return () => window.clearInterval(timer)
  }, [flagshipDisplays.length, isPaused, prefersReducedMotion])

  const safeActiveIndex =
    flagshipDisplays.length > 0 ? activeIndex % flagshipDisplays.length : 0
  const activeItem = flagshipDisplays[safeActiveIndex]

  const routeGeometry = useMemo(
    () =>
      buildRouteGeometry(
        isLoading ? SKELETON_SLOTS.length : flagshipDisplays.length
      ),
    [flagshipDisplays.length, isLoading]
  )

  const activeRoute = routeGeometry.routes[safeActiveIndex]

  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)] flex-col justify-center overflow-x-clip'>
      {/* Soft neutral studio light (blends seamlessly with PublicHeader canvas) */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute top-12 left-1/2 -z-10 h-[520px] w-[960px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-[140px]'
      />
      {/* Ultra-subtle static CSS architectural dot grid (smoothly masked at top so zero header seam) */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.13)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(60%_48%_at_50%_44%,#000_18%,transparent_96%)]'
      />

      <section className='mx-auto w-full max-w-6xl px-6 py-12 sm:py-16 lg:py-20'>
        <div className='grid items-center gap-12 lg:grid-cols-12 lg:gap-10'>
          {/* Left Column: Clean TOKEX AI API Positioning + Primary CTAs */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_LIQUID }}
            className='lg:col-span-6'
          >
            <div className='inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#121214]/90 px-3 py-1 text-xs font-medium text-[#d4d4d8] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'>
              <span className='size-1.5 rounded-full bg-[#e4e4e7]' />
              <span>
                {isZh
                  ? 'TOKEX · 开发者 AI 模型 API 平台'
                  : 'TOKEX · Developer AI Model API'}
              </span>
            </div>

            <h1 className='mt-6 text-4xl font-semibold tracking-tight text-[#f4f4f5] sm:text-5xl lg:text-[54px] lg:leading-[1.08]'>
              {isZh ? (
                <>
                  前沿 AI 模型，
                  <span className='bg-gradient-to-r from-[#f4f4f5] via-[#d4d4d8] to-[#9a9aa2] bg-clip-text text-transparent'>
                    按量计费 API
                  </span>
                </>
              ) : (
                <>
                  Frontier AI Models,{' '}
                  <span className='bg-gradient-to-r from-[#f4f4f5] via-[#d4d4d8] to-[#9a9aa2] bg-clip-text text-transparent'>
                    Pay-As-You-Go API
                  </span>
                </>
              )}
            </h1>

            <p className='mt-5 max-w-lg text-base leading-relaxed text-[#9a9aa2] sm:text-lg'>
              {isZh
                ? '通过标准 OpenAI 兼容协议直接调用 Claude 与 GPT 系列模型。实时分组费率、按 Token 透明计量、即充即用。'
                : 'Access Claude and GPT models through standard OpenAI-compatible APIs on TOKEX. Transparent per-token pricing, live group rates, and pay-as-you-go credits.'}
            </p>

            {/* Primary CTAs */}
            <div className='mt-8 flex flex-wrap items-center gap-3'>
              <Link
                to={isAuthenticated ? '/keys' : '/sign-in'}
                className='inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-gradient-to-b from-[#fafafa] via-[#ebebef] to-[#d6d6db] px-4 text-sm font-medium text-[#0a0a0b] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_2px_0_rgba(0,0,0,0.45)] transition-all duration-200 hover:from-[#ffffff] hover:via-[#f2f2f5] hover:to-[#e0e0e5]'
              >
                <span>{isZh ? '获取 API 密钥' : 'Get API Key'}</span>
                <ArrowRight className='size-3.5' />
              </Link>
              <Link
                to='/pricing'
                className='inline-flex h-10 items-center gap-1.5 rounded-xl border border-[rgba(255,255,255,0.09)] bg-[#1b1b1f] px-4 text-sm font-medium text-[#d4d4d8] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-200 hover:border-[rgba(255,255,255,0.18)] hover:bg-[#222227] hover:text-[#f4f4f5]'
              >
                <span>{isZh ? '模型定价' : 'Model Pricing'}</span>
                <ArrowUpRight className='size-3.5 text-[#9a9aa2]' />
              </Link>
              <Link
                to='/dashboard'
                className='inline-flex h-10 items-center gap-1.5 rounded-xl border border-transparent px-3 text-sm font-medium text-[#9a9aa2] transition-colors duration-200 hover:bg-white/[0.06] hover:text-[#f4f4f5]'
              >
                <span>{isZh ? '控制台' : 'Console'}</span>
                <ArrowRight className='size-3.5' />
              </Link>
            </div>

            {/* Live Catalog Summary Strip (strictly factual, no fabricated stats) */}
            <div className='mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-[rgba(255,255,255,0.07)] pt-6'>
              <div>
                <div className='font-mono text-lg font-semibold text-[#f4f4f5] tabular-nums'>
                  {isLoading ? (
                    <Skeleton className='h-6 w-10 bg-[rgba(255,255,255,0.07)]' />
                  ) : models.length > 0 ? (
                    models.length
                  ) : (
                    '—'
                  )}
                </div>
                <p className='mt-1 text-xs text-[#9a9aa2]'>
                  {isZh ? '在线模型' : 'Live Models'}
                </p>
              </div>
              <div>
                <div className='font-mono text-lg font-semibold text-[#f4f4f5] tabular-nums'>
                  {isLoading ? (
                    <Skeleton className='h-6 w-10 bg-[rgba(255,255,255,0.07)]' />
                  ) : vendors.length > 0 ? (
                    vendors.length
                  ) : (
                    '—'
                  )}
                </div>
                <p className='mt-1 text-xs text-[#9a9aa2]'>
                  {isZh ? '模型厂商' : 'Vendors'}
                </p>
              </div>
              <div>
                <div className='font-mono text-lg font-semibold text-[#f4f4f5]'>
                  USD
                </div>
                <p className='mt-1 text-xs text-[#9a9aa2]'>
                  {isZh ? '按量计费' : 'Pay-as-you-go'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Flagship Models & SVG Connector Stack */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE_LIQUID }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className='lg:col-span-6'
          >
            <div
              className={cn(
                'mb-3 flex items-center justify-between px-1',
                (isLoading || flagshipDisplays.length > 0) &&
                  'sm:pl-24 md:pl-32'
              )}
            >
              <span className='text-[11px] font-medium tracking-[0.08em] text-[#74747c] uppercase'>
                {isZh ? '实时旗舰模型报价' : 'Live Flagship Pricing'}
              </span>
              <Link
                to='/pricing'
                className='inline-flex items-center gap-1 text-xs text-[#9a9aa2] transition-colors hover:text-[#f4f4f5]'
              >
                <span>{isZh ? '全部模型' : 'View All'}</span>
                <ArrowRight className='size-3' />
              </Link>
            </div>

            {isLoading ? (
              <div
                aria-busy='true'
                aria-label={
                  isZh ? '正在加载实时模型列表' : 'Loading live models'
                }
                className='relative flex items-center'
              >
                <svg
                  viewBox={`0 0 120 ${routeGeometry.svgHeight}`}
                  fill='none'
                  aria-hidden='true'
                  style={{ height: `${routeGeometry.svgHeight}px` }}
                  className='hidden w-24 shrink-0 sm:block md:w-32'
                >
                  {routeGeometry.routes.map((route) => (
                    <path
                      key={`skeleton-path-${route.endpointY}`}
                      d={route.pathD}
                      stroke='rgba(255,255,255,0.07)'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                    />
                  ))}
                  <circle
                    cx='8'
                    cy={routeGeometry.originY}
                    r='5'
                    fill='rgba(255,255,255,0.2)'
                  />
                  {routeGeometry.routes.map((route) => (
                    <circle
                      key={`skeleton-dot-${route.endpointY}`}
                      cx='112'
                      cy={route.endpointY}
                      r='3'
                      fill='rgba(255,255,255,0.18)'
                    />
                  ))}
                </svg>

                <div className='flex w-full flex-1 flex-col gap-3'>
                  {SKELETON_SLOTS.map((slot) => (
                    <div
                      key={slot}
                      data-testid='flagship-model-skeleton'
                      className='flex min-h-[70px] items-center justify-between gap-3 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#121214] px-4 py-3'
                    >
                      <div className='flex items-center gap-3'>
                        <Skeleton className='size-9 rounded-xl bg-[rgba(255,255,255,0.06)]' />
                        <div className='space-y-2'>
                          <Skeleton className='h-4 w-32 bg-[rgba(255,255,255,0.07)]' />
                          <Skeleton className='h-3 w-24 bg-[rgba(255,255,255,0.05)]' />
                        </div>
                      </div>
                      <div className='hidden space-y-1.5 sm:block'>
                        <Skeleton className='ml-auto h-3.5 w-20 bg-[rgba(255,255,255,0.07)]' />
                        <Skeleton className='ml-auto h-3.5 w-24 bg-[rgba(255,255,255,0.05)]' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : error || flagshipDisplays.length === 0 ? (
              <div
                role='status'
                className='rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#121214] p-6 text-left shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_18px_48px_-24px_rgba(0,0,0,0.88)]'
              >
                <p className='text-sm font-medium text-[#f4f4f5]'>
                  {error
                    ? isZh
                      ? '暂时无法获取实时模型报价'
                      : 'Live model pricing is temporarily unavailable'
                    : isZh
                      ? '当前暂无可展示模型'
                      : 'No models are currently published'}
                </p>
                <p className='mt-1.5 text-xs leading-relaxed text-[#9a9aa2]'>
                  {error
                    ? isZh
                      ? '请点击重试拉取最新模型目录，或前往模型定价页面查看。'
                      : 'Retry fetching the live catalog or open the model pricing directory directly.'
                    : isZh
                      ? '前往模型定价目录查看完整模型配置与分组状态。'
                      : 'Visit the model pricing directory to view catalog status.'}
                </p>
                <div className='mt-4 flex flex-wrap items-center gap-2.5'>
                  {error && (
                    <button
                      type='button'
                      onClick={() => void refetch()}
                      className='inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-white/[0.14] bg-white/[0.06] px-3 text-xs font-medium text-[#f4f4f5] transition-colors hover:bg-white/[0.1]'
                    >
                      <RefreshCw className='size-3' />
                      <span>{isZh ? '重试' : 'Retry'}</span>
                    </button>
                  )}
                  <Link
                    to='/pricing'
                    className='inline-flex h-8 items-center gap-1 rounded-lg border border-white/[0.12] bg-[#1b1b1f] px-3 text-xs font-medium text-[#d4d4d8] transition-colors hover:border-white/[0.2] hover:text-[#f4f4f5]'
                  >
                    <span>{isZh ? '前往模型定价' : 'Open Model Pricing'}</span>
                    <ArrowUpRight className='size-3 text-[#9a9aa2]' />
                  </Link>
                </div>
              </div>
            ) : (
              <div className='relative flex items-center'>
                {/* SVG Connector Curves (Desktop / Tablet) */}
                <svg
                  viewBox={`0 0 120 ${routeGeometry.svgHeight}`}
                  fill='none'
                  aria-hidden='true'
                  style={{ height: `${routeGeometry.svgHeight}px` }}
                  className='hidden w-24 shrink-0 sm:block md:w-32'
                >
                  <defs>
                    <linearGradient
                      id='tokex-route-grad'
                      x1='0%'
                      y1='50%'
                      x2='100%'
                      y2='50%'
                    >
                      <stop
                        offset='0%'
                        stopColor='#fafafa'
                        stopOpacity='0.95'
                      />
                      <stop
                        offset='55%'
                        stopColor='#d4d4d8'
                        stopOpacity='0.88'
                      />
                      <stop
                        offset='100%'
                        stopColor='#a1a1aa'
                        stopOpacity='0.8'
                      />
                    </linearGradient>
                  </defs>

                  {/* Passive Hairline Connector Paths */}
                  {flagshipDisplays.map((item, index) => {
                    const route = routeGeometry.routes[index]
                    if (!route) return null
                    return (
                      <path
                        key={`base-${item.modelName}`}
                        d={route.pathD}
                        stroke='rgba(255,255,255,0.08)'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                      />
                    )
                  })}

                  {/* Active Animated Connector Curve */}
                  {activeItem && activeRoute && (
                    <AnimatePresence mode='wait'>
                      <motion.path
                        key={`active-${activeItem.modelName}`}
                        d={activeRoute.pathD}
                        stroke='url(#tokex-route-grad)'
                        strokeWidth='1.75'
                        strokeLinecap='round'
                        initial={
                          prefersReducedMotion
                            ? { pathLength: 1, opacity: 1 }
                            : { pathLength: 0.25, opacity: 0.35 }
                        }
                        animate={{ pathLength: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE_LIQUID }}
                      />
                    </AnimatePresence>
                  )}

                  {/* Animated Flowing Pulse Over Active Curve */}
                  {!prefersReducedMotion && activeRoute && (
                    <path
                      d={activeRoute.pathD}
                      stroke='#e4e4e7'
                      strokeWidth='1.75'
                      strokeLinecap='round'
                      className='tokex-beam-flow'
                      opacity={0.65}
                    />
                  )}

                  {/* Origin API Node */}
                  <circle
                    cx='8'
                    cy={routeGeometry.originY}
                    r='4.5'
                    fill='#f4f4f5'
                  />
                  <circle
                    cx='8'
                    cy={routeGeometry.originY}
                    r='8.5'
                    stroke='rgba(255,255,255,0.2)'
                    strokeWidth='1.25'
                  />

                  {/* Destination Endpoints */}
                  {flagshipDisplays.map((item, index) => {
                    const route = routeGeometry.routes[index]
                    if (!route) return null
                    const isActive = index === safeActiveIndex
                    return (
                      <circle
                        key={`dot-${item.modelName}`}
                        cx='112'
                        cy={route.endpointY}
                        r={isActive ? 4 : 2.75}
                        fill={isActive ? '#f4f4f5' : 'rgba(255,255,255,0.22)'}
                        className='transition-all duration-300'
                      />
                    )
                  })}
                </svg>

                {/* Live Flagship Model Cards Stack */}
                <div className='flex w-full flex-1 flex-col gap-3'>
                  {flagshipDisplays.map((item, index) => {
                    const isActive = index === safeActiveIndex
                    return (
                      <motion.div
                        key={item.modelName}
                        onMouseEnter={() => {
                          setIsPaused(true)
                          setActiveIndex(index)
                        }}
                        onFocus={() => {
                          setIsPaused(true)
                          setActiveIndex(index)
                        }}
                        animate={
                          prefersReducedMotion
                            ? undefined
                            : { x: isActive ? 4 : 0 }
                        }
                        transition={{ duration: 0.28, ease: EASE_LIQUID }}
                      >
                        <Link
                          to='/pricing/$modelId'
                          params={{ modelId: item.modelName }}
                          aria-current={isActive ? 'true' : undefined}
                          className={cn(
                            'group relative flex min-h-[70px] items-center overflow-hidden rounded-2xl border px-4 py-3 backdrop-blur-xl transition-all duration-300 focus-visible:ring-1 focus-visible:ring-white/35 focus-visible:outline-none',
                            isActive
                              ? 'border-white/[0.15] bg-[#17171a] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_18px_44px_-20px_rgba(0,0,0,0.85)]'
                              : 'border-[rgba(255,255,255,0.07)] bg-[#121214] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.14)] hover:bg-[#17171a]'
                          )}
                        >
                          {/* Subtle brushed-silver sheen when active */}
                          <div
                            aria-hidden='true'
                            className={cn(
                              'pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.05] via-white/[0.015] to-transparent opacity-0 transition-opacity duration-500',
                              isActive && 'opacity-100'
                            )}
                          />

                          <div className='relative flex w-full min-w-0 items-center justify-between gap-3'>
                            <div className='flex min-w-0 flex-1 items-center gap-3'>
                              <div className='flex size-9 shrink-0 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.04)] text-[#f4f4f5]'>
                                {item.iconKey ? (
                                  getLobeIcon(item.iconKey, 20)
                                ) : (
                                  <span className='text-xs font-bold text-[#d4d4d8]'>
                                    {item.modelName.charAt(0).toUpperCase() ||
                                      '?'}
                                  </span>
                                )}
                              </div>

                              <div className='min-w-0 flex-1'>
                                <div className='flex items-center gap-2'>
                                  <span className='truncate font-mono text-sm font-semibold text-[#f4f4f5]'>
                                    {item.modelName}
                                  </span>
                                  {isActive && (
                                    <span className='hidden shrink-0 rounded-full border border-white/[0.14] bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-[#e4e4e7] sm:inline-flex'>
                                      {isZh ? '在线' : 'Live'}
                                    </span>
                                  )}
                                </div>

                                <div className='mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#9a9aa2]'>
                                  {item.vendorName && (
                                    <span className='truncate'>
                                      {item.vendorName}
                                    </span>
                                  )}
                                  {item.groupBadge && (
                                    <span
                                      className={cn(
                                        'shrink-0 rounded border px-1.5 py-px font-mono text-[10px] leading-tight',
                                        item.groupRatio < 1
                                          ? 'border-white/[0.12] bg-white/[0.06] text-[#e4e4e7]'
                                          : 'border-[rgba(255,255,255,0.09)] bg-[#1b1b1f] text-[#9a9aa2]'
                                      )}
                                    >
                                      {item.groupBadge}
                                    </span>
                                  )}
                                </div>

                                <FlagshipPriceList
                                  items={item.priceItems}
                                  isZh={isZh}
                                  layout='mobile'
                                />
                              </div>
                            </div>

                            <div className='flex shrink-0 items-center gap-2.5'>
                              <FlagshipPriceList
                                items={item.priceItems}
                                isZh={isZh}
                                layout='desktop'
                              />
                              <ArrowUpRight className='size-3.5 shrink-0 text-[#74747c] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#f4f4f5]' />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
