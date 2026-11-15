import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  KeyRound,
  Send,
  Sparkles,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { normalizeInterfaceLanguage } from '@/i18n/languages'
import { getLobeIcon } from '@/lib/lobe-icon'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

interface FeaturedModel {
  id: string
  name: string
  shortName: string
  provider: 'Anthropic' | 'OpenAI'
  icon: string
  context: string
  maxOutput: string
  tagZh: string
  tagEn: string
  pathD: string
  endpointY: number
}

const FEATURED_MODELS: readonly FeaturedModel[] = [
  {
    id: 'claude-fable-5-2',
    name: 'Claude Fable 5.2',
    shortName: 'Fable 5.2',
    provider: 'Anthropic',
    icon: 'Claude',
    context: '1M',
    maxOutput: '128K',
    tagZh: '前沿深度推理与长程代理',
    tagEn: 'Frontier Reasoning & Agents',
    pathD: 'M 8 158 C 58 158, 56 35, 112 35',
    endpointY: 35,
  },
  {
    id: 'gpt-6-astra',
    name: 'GPT-6 Astra',
    shortName: 'GPT-6 Astra',
    provider: 'OpenAI',
    icon: 'OpenAI',
    context: '1.05M',
    maxOutput: '128K',
    tagZh: '旗舰推理与异步工具编排',
    tagEn: 'Flagship Reasoning & Tools',
    pathD: 'M 8 158 C 54 158, 62 117, 112 117',
    endpointY: 117,
  },
  {
    id: 'claude-sonnet-5-5',
    name: 'Claude Sonnet 5.5',
    shortName: 'Sonnet 5.5',
    provider: 'Anthropic',
    icon: 'Claude',
    context: '1M',
    maxOutput: '128K',
    tagZh: '高速编程与智能均衡主力',
    tagEn: 'Speed & Intelligence Balance',
    pathD: 'M 8 158 C 54 158, 62 199, 112 199',
    endpointY: 199,
  },
  {
    id: 'gpt-6.1-sol',
    name: 'GPT-6.1 Sol',
    shortName: 'GPT-6.1 Sol',
    provider: 'OpenAI',
    icon: 'OpenAI',
    context: '1.05M',
    maxOutput: '128K',
    tagZh: '高效工程与视觉理解主力',
    tagEn: 'Balanced Coding & Vision',
    pathD: 'M 8 158 C 58 158, 56 281, 112 281',
    endpointY: 281,
  },
]

interface StatItem {
  id: string
  value: string
  labelZh: string
  labelEn: string
  highlight?: boolean
}

const GATEWAY_STATS: readonly StatItem[] = [
  {
    id: 'tokens',
    value: '8.4T+',
    labelZh: '月度稳定调度 Tokens',
    labelEn: 'Monthly Tokens',
    highlight: true,
  },
  {
    id: 'context',
    value: '1.05M',
    labelZh: '最高上下文窗口支持',
    labelEn: 'Max Context Window',
  },
  {
    id: 'latency',
    value: '< 35ms',
    labelZh: '全球边缘路由转发开销',
    labelEn: 'Routing Overhead',
  },
  {
    id: 'uptime',
    value: '99.99%',
    labelZh: '多节点自动容灾 SLA',
    labelEn: 'Global Uptime',
  },
]

const SAMPLE_PROMPTS_ZH: readonly string[] = [
  '使用 Claude Fable 5.2 审查分布式网关架构并给出长程演进方案',
  '调用 GPT-6 Astra 编排异步多智能体工具链并输出严格 TypeScript 类型',
  '通过 Claude Sonnet 5.5 快速定位流式 SSE 路由延迟瓶颈',
  '使用 GPT-6.1 Sol 解析设计稿并生成高可靠自动化测试用例',
]

const SAMPLE_PROMPTS_EN: readonly string[] = [
  'Audit our distributed gateway architecture with Claude Fable 5.2',
  'Orchestrate an async multi-agent workflow with GPT-6 Astra and strict TypeScript types',
  'Profile SSE streaming latency bottlenecks using Claude Sonnet 5.5',
  'Inspect UI mockups with GPT-6.1 Sol and generate end-to-end tests',
]

const EASE_LIQUID = [0.22, 1, 0.36, 1] as const

function fallbackCopyText(text: string) {
  if (typeof document === 'undefined') return
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  try {
    document.execCommand('copy')
  } finally {
    document.body.removeChild(textarea)
  }
}

function copyText(text: string) {
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    void navigator.clipboard.writeText(text).catch(() => {
      fallbackCopyText(text)
    })
    return
  }
  fallbackCopyText(text)
}

export function TokexHeroSection() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => Boolean(s.auth.user))
  const prefersReducedMotion = useReducedMotion()

  const isZh =
    normalizeInterfaceLanguage(i18n.resolvedLanguage || i18n.language) ===
    'zhCN'

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURED_MODELS.length)
    }, 3400)

    return () => window.clearInterval(timer)
  }, [isPaused, prefersReducedMotion])

  const activeModel = FEATURED_MODELS[activeIndex] ?? FEATURED_MODELS[0]
  const samplePrompts = isZh ? SAMPLE_PROMPTS_ZH : SAMPLE_PROMPTS_EN

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://api.tokex.ai'

  const snippet = `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}/v1",
    api_key="sk-tokex-••••••••",
)
res = client.chat.completions.create(
    model="${activeModel.id}",
    messages=[{"role": "user", "content": "Hello"}],
)`

  const compactSnippet = `from openai import OpenAI

client = OpenAI(base_url="${baseUrl}/v1", api_key="sk-tokex-•••")
res = client.chat.completions.create(
    model="${activeModel.id}",
    messages=[{"role": "user", "content": "Hello"}],
)`

  function handlePromptSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isAuthenticated) {
      void navigate({ to: '/playground' })
      return
    }
    void navigate({ to: '/sign-in' })
  }

  function handleCopyKey() {
    copyText('sk-tokex-94f8d2c1b6a04e8e9d72a8c')
    setCopiedKey(true)
    window.setTimeout(() => setCopiedKey(false), 1800)
  }

  function handleCopyCode() {
    copyText(snippet)
    setCopiedCode(true)
    window.setTimeout(() => setCopiedCode(false), 1800)
  }

  return (
    <div className='relative overflow-hidden'>
      {/* Minimal monochrome ambient spotlight */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute top-0 left-1/2 -z-10 h-[520px] w-[960px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[140px]'
      />

      {/* ── Section 1: OpenRouter Split Hero + Animated Routing Diagram ── */}
      <section className='mx-auto max-w-6xl px-6 pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24'>
        <div className='grid items-center gap-12 lg:grid-cols-12 lg:gap-8'>
          {/* Left Column: Minimal Typography + Interactive Prompt Bar */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_LIQUID }}
            className='lg:col-span-6'
          >
            <Link
              to='/pricing'
              className='group inline-flex items-center gap-2 rounded-full border border-[#27272a] bg-[#141417] px-3 py-1 text-xs text-zinc-300 backdrop-blur-md transition-colors duration-200 hover:border-white/20 hover:bg-[#1a1a1f]'
            >
              <span className='size-1.5 rounded-full bg-[#fafafa] shadow-[0_0_8px_rgba(255,255,255,0.65)]' />
              <span>
                {isZh
                  ? 'TOKEX 多模型统一网关已就绪'
                  : 'TOKEX Unified Model Router'}
              </span>
              <ArrowRight className='size-3 text-zinc-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white' />
            </Link>

            <h1 className='mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[54px] lg:leading-[1.08]'>
              {isZh ? (
                <>
                  大模型
                  <span className='bg-gradient-to-r from-[#ffffff] via-[#d4d4d8] to-[#a1a1aa] bg-clip-text text-transparent'>
                    统一路由接口
                  </span>
                </>
              ) : (
                <>
                  The Unified Interface{' '}
                  <span className='bg-gradient-to-r from-[#ffffff] via-[#d4d4d8] to-[#a1a1aa] bg-clip-text text-transparent'>
                    For LLMs
                  </span>
                </>
              )}
            </h1>

            <p className='mt-4 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg'>
              {isZh
                ? '更优费率，更高可用，无需繁琐订阅。一个兼容协议直连 Anthropic Claude 与 OpenAI ChatGPT 旗舰模型。'
                : 'Better prices, better uptime, no subscriptions. Route requests seamlessly across Anthropic Claude and OpenAI ChatGPT flagships.'}
            </p>

            {/* OpenRouter-style Interactive Prompt Box */}
            <form
              onSubmit={handlePromptSubmit}
              className='mt-8 rounded-2xl border border-[#27272a] bg-[#0a0a0c]/90 p-2.5 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-colors duration-300 focus-within:border-white/25 focus-within:bg-[#0e0e11]'
            >
              <div className='flex items-center gap-2 px-2 py-1.5'>
                <input
                  type='text'
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    isZh
                      ? `向 ${activeModel.name} 发送一条测试消息...`
                      : `Start a message with ${activeModel.name}...`
                  }
                  aria-label={isZh ? '测试提示词输入' : 'Start a message'}
                  className='w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none'
                />
                <button
                  type='submit'
                  aria-label={isZh ? '进入对话体验' : 'Send message'}
                  className='inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#fafafa] text-[#09090b] shadow-sm transition-all duration-200 hover:bg-zinc-200 active:scale-95'
                >
                  <Send className='size-3.5' />
                </button>
              </div>

              <div className='mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] px-2 pt-2'>
                <div className='flex flex-wrap items-center gap-1.5'>
                  {FEATURED_MODELS.map((model, index) => {
                    const isSelected = index === activeIndex
                    return (
                      <button
                        key={model.id}
                        type='button'
                        onClick={() => {
                          setIsPaused(true)
                          setActiveIndex(index)
                        }}
                        className={cn(
                          'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-medium transition-all duration-200',
                          isSelected
                            ? 'border-white/25 bg-white/[0.1] text-[#fafafa]'
                            : 'border-[#27272a] bg-[#141417] text-zinc-400 hover:border-white/15 hover:text-zinc-200'
                        )}
                      >
                        <span className='inline-flex size-3.5 items-center justify-center'>
                          {getLobeIcon(model.icon, 13)}
                        </span>
                        <span>{model.shortName}</span>
                      </button>
                    )
                  })}
                </div>

                <button
                  type='button'
                  onClick={() => {
                    const nextSample =
                      samplePrompts[activeIndex % samplePrompts.length]
                    if (nextSample) setPrompt(nextSample)
                  }}
                  className='inline-flex cursor-pointer items-center gap-1 text-[11px] text-zinc-500 transition-colors hover:text-zinc-200'
                >
                  <Sparkles className='size-3' />
                  <span>{isZh ? '示例提示词' : 'Try sample'}</span>
                </button>
              </div>
            </form>

            {/* Minimal Quick Action Links */}
            <div className='mt-6 flex flex-wrap items-center gap-4'>
              <Link
                to={isAuthenticated ? '/dashboard' : '/sign-in'}
                className='inline-flex h-10 items-center gap-2 rounded-xl bg-[#fafafa] px-4 text-sm font-medium text-[#09090b] transition-all duration-200 hover:bg-zinc-200'
              >
                <span>{isZh ? '获取 API 密钥' : 'Get API Key'}</span>
                <ArrowRight className='size-3.5' />
              </Link>
              <Link
                to='/pricing'
                className='inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#27272a] bg-[#141417] px-4 text-sm font-medium text-zinc-200 backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-[#1a1a1f] hover:text-white'
              >
                <span>{isZh ? '浏览模型目录' : 'Explore Models'}</span>
                <ArrowUpRight className='size-3.5 text-zinc-400' />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: OpenRouter Animated Routing Curves & Featured Stack */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE_LIQUID }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className='lg:col-span-6'
          >
            <div className='mb-3 flex items-center justify-between px-1 sm:pl-24 md:pl-32'>
              <span className='text-xs font-medium tracking-wide text-zinc-400 uppercase'>
                {isZh ? '精选旗舰模型' : 'Featured Models'}
              </span>
              <Link
                to='/rankings'
                className='inline-flex items-center gap-1 text-xs text-zinc-400 transition-colors hover:text-white'
              >
                <span>{isZh ? '查看趋势榜' : 'View Trending'}</span>
                <ArrowRight className='size-3' />
              </Link>
            </div>

            <div className='relative flex items-center'>
              {/* SVG Routing Bezier Curves (Desktop / Tablet) */}
              <svg
                viewBox='0 0 120 316'
                fill='none'
                aria-hidden='true'
                className='hidden h-[316px] w-24 shrink-0 sm:block md:w-32'
              >
                <defs>
                  <linearGradient
                    id='tokex-route-grad'
                    x1='0%'
                    y1='50%'
                    x2='100%'
                    y2='50%'
                  >
                    <stop offset='0%' stopColor='#ffffff' stopOpacity='0.95' />
                    <stop
                      offset='55%'
                      stopColor='#d4d4d8'
                      stopOpacity='0.9'
                    />
                    <stop
                      offset='100%'
                      stopColor='#a1a1aa'
                      stopOpacity='0.85'
                    />
                  </linearGradient>
                  <filter
                    id='tokex-route-glow'
                    x='-30%'
                    y='-30%'
                    width='160%'
                    height='160%'
                  >
                    <feGaussianBlur stdDeviation='2.5' result='blur' />
                    <feMerge>
                      <feMergeNode in='blur' />
                      <feMergeNode in='SourceGraphic' />
                    </feMerge>
                  </filter>
                </defs>

                {/* Passive Hairline Routing Paths */}
                {FEATURED_MODELS.map((model) => (
                  <path
                    key={`base-${model.id}`}
                    d={model.pathD}
                    stroke='rgba(255,255,255,0.08)'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                  />
                ))}

                {/* Active Animated Routing Curve */}
                <AnimatePresence mode='wait'>
                  <motion.path
                    key={`active-${activeModel.id}`}
                    d={activeModel.pathD}
                    stroke='url(#tokex-route-grad)'
                    strokeWidth='2'
                    strokeLinecap='round'
                    filter='url(#tokex-route-glow)'
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

                {/* Animated Flowing Pulse Over Active Curve */}
                {!prefersReducedMotion && (
                  <path
                    d={activeModel.pathD}
                    stroke='#ffffff'
                    strokeWidth='2'
                    strokeLinecap='round'
                    className='tokex-beam-flow'
                    opacity={0.75}
                  />
                )}

                {/* Origin Gateway Node */}
                <circle
                  cx='8'
                  cy='158'
                  r='5'
                  fill='#fafafa'
                  filter='url(#tokex-route-glow)'
                />
                <circle
                  cx='8'
                  cy='158'
                  r='9'
                  stroke='rgba(255,255,255,0.28)'
                  strokeWidth='1.5'
                />

                {/* Destination Endpoints */}
                {FEATURED_MODELS.map((model, index) => {
                  const isActive = index === activeIndex
                  return (
                    <circle
                      key={`dot-${model.id}`}
                      cx='112'
                      cy={model.endpointY}
                      r={isActive ? 4.5 : 3}
                      fill={isActive ? '#ffffff' : 'rgba(255,255,255,0.22)'}
                      className='transition-all duration-300'
                    />
                  )
                })}
              </svg>

              {/* Featured Model Cards Stack */}
              <div className='flex w-full flex-1 flex-col gap-3'>
                {FEATURED_MODELS.map((model, index) => {
                  const isActive = index === activeIndex
                  return (
                    <motion.div
                      key={model.id}
                      onMouseEnter={() => setActiveIndex(index)}
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : { x: isActive ? 4 : 0 }
                      }
                      transition={{ duration: 0.28, ease: EASE_LIQUID }}
                      className={cn(
                        'group relative flex min-h-[70px] items-center overflow-hidden rounded-2xl border px-4 py-3.5 backdrop-blur-xl transition-all duration-300',
                        isActive
                          ? 'border-white/25 bg-[#111114] shadow-[0_18px_48px_-18px_rgba(255,255,255,0.12)]'
                          : 'border-[#27272a]/85 bg-[#0a0a0c] hover:border-white/[0.16] hover:bg-[#111114]'
                      )}
                    >
                      {/* Subtle monochrome silver highlight when active */}
                      <div
                        aria-hidden='true'
                        className={cn(
                          'pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.06] via-zinc-300/[0.02] to-transparent opacity-0 transition-opacity duration-500',
                          isActive && 'opacity-100'
                        )}
                      />

                      <div className='relative flex w-full items-center gap-2.5'>
                        <button
                          type='button'
                          aria-pressed={isActive}
                          onClick={() => {
                            setIsPaused(true)
                            setActiveIndex(index)
                          }}
                          className='flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40'
                        >
                          <div className='flex min-w-0 items-center gap-3'>
                            <div className='flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-100'>
                              {getLobeIcon(model.icon, 20)}
                            </div>
                            <div className='min-w-0'>
                              <div className='flex items-center gap-2'>
                                <span className='truncate text-sm font-semibold text-white'>
                                  {model.name}
                                </span>
                                {isActive && (
                                  <span className='hidden rounded-full border border-white/20 bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-zinc-100 sm:inline-flex'>
                                    {isZh ? '路由中' : 'Active'}
                                  </span>
                                )}
                              </div>
                              <p className='mt-0.5 truncate text-xs text-zinc-400'>
                                {model.provider} ·{' '}
                                {isZh ? model.tagZh : model.tagEn}
                              </p>
                              <p className='mt-1 truncate font-mono text-[11px] text-zinc-400 sm:hidden'>
                                {model.id} · {model.context} ctx ·{' '}
                                {model.maxOutput} out
                              </p>
                            </div>
                          </div>

                          <div className='hidden shrink-0 text-right sm:block'>
                            <div className='font-mono text-xs font-medium text-zinc-200'>
                              {model.id}
                            </div>
                            <div className='mt-0.5 font-mono text-[11px] text-zinc-500'>
                              {model.context} ctx · {model.maxOutput} out
                            </div>
                          </div>
                        </button>

                        <Link
                          to='/pricing'
                          aria-label={
                            isZh
                              ? `在模型目录查看 ${model.name}`
                              : `View ${model.name} in model directory`
                          }
                          className='inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/25 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40'
                        >
                          <ArrowUpRight className='size-3.5' />
                        </Link>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: OpenRouter Minimalist 4-Metric Typography Strip ── */}
      <section className='border-y border-white/[0.08] bg-white/[0.012]'>
        <div className='mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-white/[0.08] px-0 sm:divide-y-0 md:grid-cols-4'>
          {GATEWAY_STATS.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: EASE_LIQUID,
              }}
              className='px-6 py-8 text-center sm:py-10'
            >
              <div
                className={cn(
                  'font-mono text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl',
                  stat.highlight
                    ? 'bg-gradient-to-r from-[#ffffff] via-[#d4d4d8] to-[#a1a1aa] bg-clip-text text-transparent'
                    : 'text-white'
                )}
              >
                {stat.value}
              </div>
              <p className='mt-2 text-xs font-medium text-zinc-400 sm:text-sm'>
                {isZh ? stat.labelZh : stat.labelEn}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Compact 3-Step Visual Onboarding Strip ── */}
      <section className='mx-auto max-w-6xl px-6 py-16 sm:py-24'>
        <div className='grid gap-5 md:grid-cols-3'>
          {/* Step 1: Sign up */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: 0, ease: EASE_LIQUID }}
            className='tokex-glass tokex-glass-interactive flex flex-col justify-between rounded-2xl p-6'
          >
            <div>
              <div className='flex items-center gap-2.5'>
                <span className='inline-flex size-6 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.06] font-mono text-xs text-zinc-200'>
                  1
                </span>
                <h2 className='text-base font-semibold text-white'>
                  {isZh ? '注册并开通账号' : 'Signup'}
                </h2>
              </div>
              <p className='mt-2 text-xs leading-relaxed text-zinc-400'>
                {isZh
                  ? '无需绑定繁琐海外信用卡，开箱即用按量计费。'
                  : 'Create an account in seconds and start routing with pay-as-you-go billing.'}
              </p>
            </div>

            <div className='mt-6 rounded-xl border border-[#27272a] bg-[#050506]/85 p-3.5'>
              <div className='flex items-center justify-between text-[11px] text-zinc-400'>
                <span>{isZh ? '快速登录通道' : 'Workspace Access'}</span>
                <span className='text-zinc-200'>
                  {isZh ? '即时开通' : 'Instant'}
                </span>
              </div>
              <div className='mt-3 flex items-center gap-2'>
                <span className='rounded-lg border border-[#27272a] bg-[#141417] px-2.5 py-1 text-xs text-zinc-200'>
                  GitHub
                </span>
                <span className='rounded-lg border border-[#27272a] bg-[#141417] px-2.5 py-1 text-xs text-zinc-200'>
                  SSO / Email
                </span>
                <Link
                  to={isAuthenticated ? '/dashboard' : '/sign-up'}
                  className='ml-auto inline-flex items-center gap-1 text-xs font-medium text-zinc-200 transition-colors hover:text-white'
                >
                  <span>{isZh ? '前往' : 'Start'}</span>
                  <ArrowRight className='size-3' />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Step 2: Get API Key */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE_LIQUID }}
            className='tokex-glass tokex-glass-interactive flex flex-col justify-between rounded-2xl p-6'
          >
            <div>
              <div className='flex items-center gap-2.5'>
                <span className='inline-flex size-6 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.06] font-mono text-xs text-zinc-200'>
                  2
                </span>
                <h2 className='text-base font-semibold text-white'>
                  {isZh ? '生成统一密钥' : 'Get your API key'}
                </h2>
              </div>
              <p className='mt-2 text-xs leading-relaxed text-zinc-400'>
                {isZh
                  ? '单枚密钥集中调度 Anthropic Claude 与 OpenAI ChatGPT 全系模型并统一计费。'
                  : 'Use one unified key across Anthropic Claude and OpenAI ChatGPT models.'}
              </p>
            </div>

            <div className='mt-6 rounded-xl border border-[#27272a] bg-[#050506]/85 p-3.5'>
              <div className='flex items-center justify-between text-[11px] text-zinc-400'>
                <span className='inline-flex items-center gap-1'>
                  <KeyRound className='size-3 text-zinc-300' />
                  <span>TOKEX_API_KEY</span>
                </span>
                <span className='rounded border border-[#27272a] bg-[#141417] px-1.5 py-0.5 text-[10px] text-zinc-300'>
                  Claude & OpenAI
                </span>
              </div>
              <div className='mt-2.5 flex items-center justify-between gap-2 rounded-lg border border-[#27272a] bg-[#141417] px-2.5 py-1.5'>
                <code className='truncate font-mono text-xs text-zinc-200'>
                  sk-tokex-94f••••••••2a8c
                </code>
                <button
                  type='button'
                  onClick={handleCopyKey}
                  aria-label={isZh ? '复制示例密钥' : 'Copy sample key'}
                  className='inline-flex shrink-0 cursor-pointer items-center gap-1 text-[11px] text-zinc-400 transition-colors hover:text-white'
                >
                  {copiedKey ? (
                    <Check className='size-3.5 text-white' />
                  ) : (
                    <Copy className='size-3.5' />
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Step 3: Unified Integration */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: 0.16, ease: EASE_LIQUID }}
            className='tokex-glass tokex-glass-interactive flex flex-col justify-between rounded-2xl p-6'
          >
            <div>
              <div className='flex items-center gap-2.5'>
                <span className='inline-flex size-6 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.06] font-mono text-xs text-zinc-200'>
                  3
                </span>
                <h2 className='text-base font-semibold text-white'>
                  {isZh ? '一行接入全网模型' : 'One unified endpoint'}
                </h2>
              </div>
              <p className='mt-2 text-xs leading-relaxed text-zinc-400'>
                {isZh
                  ? '直接替换 OpenAI SDK Base URL，零改造成本切换 Claude 与 ChatGPT 模型。'
                  : 'Point your OpenAI-compatible SDK to TOKEX and route Claude & ChatGPT with zero rewrites.'}
              </p>
            </div>

            <div className='mt-6 rounded-xl border border-[#27272a] bg-[#050506]/90 p-3'>
              <div className='mb-1.5 flex items-center justify-between text-[11px] text-zinc-400'>
                <span className='font-mono text-zinc-300'>quickstart.py</span>
                <button
                  type='button'
                  onClick={handleCopyCode}
                  aria-label={isZh ? '复制接入代码' : 'Copy integration snippet'}
                  className='inline-flex cursor-pointer items-center gap-1 text-[11px] text-zinc-400 transition-colors hover:text-white'
                >
                  {copiedCode ? (
                    <>
                      <Check className='size-3 text-white' />
                      <span className='text-white'>
                        {isZh ? '已复制' : 'Copied'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className='size-3' />
                      <span>{isZh ? '复制' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
              <pre className='overflow-x-auto font-mono text-[11px] leading-relaxed text-zinc-300'>
                <code>{compactSnippet}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
