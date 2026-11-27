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
import {
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Copy,
  MessageSquare,
  Play,
  Terminal,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { type MouseEvent, type ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { normalizeInterfaceLanguage } from '@/i18n/languages'
import { getLobeIcon } from '@/lib/lobe-icon'
import { cn } from '@/lib/utils'

const EASE_LIQUID = [0.22, 1, 0.36, 1] as const
const API_GATEWAY = 'https://api.tokex.vip'

interface QuickSnippet {
  id: 'codex' | 'claude' | 'clients' | 'sdk'
  label: string
  tag: string
  filename: string
  code: string
  mockStream: string
}

const QUICK_SNIPPETS: readonly QuickSnippet[] = [
  {
    id: 'codex',
    label: 'Codex CLI',
    tag: '/v1/responses',
    filename: '~/.codex/config.toml',
    code: `model = "gpt-6.2-astra"
model_provider = "tokex"

[model_providers.tokex]
name = "Tokex"
base_url = "https://api.tokex.vip/v1"
env_key = "OPENAI_API_KEY"
wire_api = "responses"`,
    mockStream:
      'POST /v1/responses -> 200 OK · {"status":"completed","model":"gpt-6.2-astra","usage":{"total_tokens":148}}',
  },
  {
    id: 'claude',
    label: 'Claude Code',
    tag: '/v1/messages',
    filename: 'shell',
    code: `ANTHROPIC_AUTH_TOKEN="sk-YOUR_KEY" \\
ANTHROPIC_BASE_URL="https://api.tokex.vip" \\
CLAUDE_CODE_DISABLE_1M_CONTEXT=1 \\
claude`,
    mockStream:
      'POST /v1/messages -> 200 OK · event: message_delta · stop_reason: "end_turn"',
  },
  {
    id: 'clients',
    label: 'Chat Clients',
    tag: '/v1/chat/completions',
    filename: 'Cherry Studio / Chatbox / LobeChat',
    code: `API Host:  https://api.tokex.vip/v1
API Key:   sk-YOUR_KEY
API Path:  /chat/completions`,
    mockStream:
      'POST /v1/chat/completions -> 200 OK · data: {"choices":[{"delta":{"content":"Ready."}}]}',
  },
  {
    id: 'sdk',
    label: 'Python SDK',
    tag: 'OpenAI SDK',
    filename: 'main.py',
    code: `from openai import OpenAI

client = OpenAI(
    api_key="sk-YOUR_KEY",
    base_url="https://api.tokex.vip/v1",
)

res = client.chat.completions.create(
    model="claude-sonnet-5-5",
    messages=[{"role": "user", "content": "Hello!"}],
)`,
    mockStream:
      'POST /v1/chat/completions -> 200 OK · "Hello! How can I help you build today?"',
  },
]

const PROTOCOL_LANES = [
  { method: 'POST', path: '/v1/responses', client: 'Codex' },
  { method: 'POST', path: '/v1/messages', client: 'Claude Code' },
  { method: 'POST', path: '/v1/chat/completions', client: 'OpenAI SDK' },
] as const

const ECOSYSTEM_ENTRIES = [
  {
    id: 'openai',
    label: 'OpenAI',
    endpoint: 'GPT-6 · /v1/responses',
    kind: 'lobe' as const,
    iconKey: 'OpenAI',
  },
  {
    id: 'claude',
    label: 'Claude',
    endpoint: 'Claude 5.5 · /v1/messages',
    kind: 'lobe' as const,
    iconKey: 'Claude',
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    endpoint: 'Native Messages API',
    kind: 'lobe' as const,
    iconKey: 'Anthropic',
  },
  {
    id: 'codex',
    label: 'Codex CLI',
    endpoint: 'wire_api = "responses"',
    kind: 'terminal' as const,
  },
  {
    id: 'clients',
    label: 'Chat Clients',
    endpoint: 'Cherry / Chatbox / LobeChat',
    kind: 'chat' as const,
  },
  {
    id: 'sdk',
    label: 'OpenAI SDK',
    endpoint: '/v1/chat/completions',
    kind: 'code' as const,
  },
] as const

const WAVE_BARS = [
  0.35, 0.72, 0.5, 0.92, 0.64, 0.85, 0.42, 0.98, 0.6, 0.78, 0.46, 0.88, 0.55,
  0.7,
] as const

function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const [coords, setCoords] = useState<{ x: number; y: number; active: boolean }>(
    { x: 0, y: 0, active: false }
  )

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setCoords({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
    })
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setCoords((prev) => ({ ...prev, active: false }))}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0c]/88 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_16px_40px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-colors duration-300 hover:border-white/[0.16] sm:p-5',
        className
      )}
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300'
        style={{
          opacity: coords.active ? 1 : 0,
          background: `radial-gradient(260px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.08), transparent 70%)`,
        }}
      />
      <div className='relative z-10 flex h-full flex-col justify-between'>
        {children}
      </div>
    </div>
  )
}

export function HomeShowcase({ visible = true }: { visible?: boolean } = {}) {
  const { i18n } = useTranslation()
  const prefersReducedMotion = useReducedMotion()
  const { copiedText, copyToClipboard } = useCopyToClipboard({ notify: false })
  const isZh =
    normalizeInterfaceLanguage(i18n.resolvedLanguage || i18n.language) ===
    'zhCN'

  const [activeTab, setActiveTab] = useState<QuickSnippet['id']>('codex')
  const [activeEcoId, setActiveEcoId] = useState<string>('openai')
  const [activeLane, setActiveLane] = useState(0)
  const [rippleTick, setRippleTick] = useState(0)

  // Terminal stream simulation state
  const [simRunning, setSimRunning] = useState(false)
  const [simTypedLen, setSimTypedLen] = useState(0)

  const activeSnippet =
    QUICK_SNIPPETS.find((item) => item.id === activeTab) ?? QUICK_SNIPPETS[0]
  const activeEco =
    ECOSYSTEM_ENTRIES.find((item) => item.id === activeEcoId) ??
    ECOSYSTEM_ENTRIES[0]

  // Cycle active protocol scanner lane
  useEffect(() => {
    if (prefersReducedMotion) return
    const timer = window.setInterval(() => {
      setActiveLane((prev) => (prev + 1) % PROTOCOL_LANES.length)
    }, 1800)
    return () => window.clearInterval(timer)
  }, [prefersReducedMotion])

  // Reset simulation when switching snippet tabs
  useEffect(() => {
    setSimRunning(false)
    setSimTypedLen(0)
  }, [activeTab])

  // Stream simulation typewriter effect
  useEffect(() => {
    if (!simRunning) return
    const target = activeSnippet.mockStream
    if (prefersReducedMotion) {
      setSimTypedLen(target.length)
      return
    }
    if (simTypedLen >= target.length) return
    const timer = window.setTimeout(() => {
      setSimTypedLen((n) => Math.min(target.length, n + 3))
    }, 18)
    return () => window.clearTimeout(timer)
  }, [activeSnippet.mockStream, prefersReducedMotion, simRunning, simTypedLen])

  const handleSimulate = () => {
    setSimTypedLen(0)
    setSimRunning(true)
  }

  const handleGatewayCopy = () => {
    setRippleTick((c) => c + 1)
    void copyToClipboard(API_GATEWAY)
  }

  const isGatewayCopied = copiedText === API_GATEWAY

  return (
    <div className='relative mx-auto w-full max-w-[1440px] space-y-6 px-6 pt-5 pb-6 md:px-10 lg:space-y-8 lg:px-14 lg:pt-8 lg:pb-8'>
      {/* 1. Interactive Quick Connect Sandbox */}
      <motion.section
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        animate={
          prefersReducedMotion
            ? undefined
            : visible
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 18 }
        }
        transition={{ duration: 0.55, delay: visible ? 0.08 : 0, ease: EASE_LIQUID }}
        className='space-y-4'
      >
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <div className='text-xs font-medium tracking-[0.14em] text-zinc-500 uppercase'>
              {isZh ? '即插即用' : 'Quick Connect'}
            </div>
            <h2 className='mt-1 text-2xl font-semibold tracking-tight text-white sm:text-[26px]'>
              {isZh ? '一行地址，全端适配' : 'One endpoint. Every tool.'}
            </h2>
          </div>
          <Link
            to='/docs'
            className='inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 transition-colors hover:text-white'
          >
            <BookOpen className='size-3.5 text-zinc-400' />
            <span>{isZh ? '完整接入文档' : 'Read Docs'}</span>
            <ArrowRight className='size-3.5' />
          </Link>
        </div>

        <div className='grid gap-4 lg:grid-cols-12'>
          {/* Left selector tabs with sliding pill */}
          <div className='flex flex-row gap-2 overflow-x-auto pb-1 lg:col-span-4 lg:flex-col lg:overflow-visible lg:pb-0'>
            {QUICK_SNIPPETS.map((item) => {
              const selected = item.id === activeSnippet.id
              return (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    'relative flex shrink-0 cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left transition-colors',
                    selected
                      ? 'border-white/[0.16] text-white'
                      : 'border-white/[0.06] bg-[#0a0a0c]/60 text-zinc-400 hover:border-white/[0.12] hover:text-zinc-200'
                  )}
                >
                  {selected && (
                    <motion.div
                      layoutId='home-connect-pill'
                      transition={{ duration: 0.26, ease: EASE_LIQUID }}
                      className='absolute inset-0 rounded-xl bg-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                    />
                  )}
                  <span className='relative z-10 text-sm font-medium'>
                    {item.label}
                  </span>
                  <span className='relative z-10 rounded-md border border-white/[0.08] bg-[#141418] px-2 py-0.5 font-mono text-[11px] text-zinc-400'>
                    {item.tag}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right animated terminal with Simulate trigger */}
          <div className='overflow-hidden rounded-2xl border border-white/[0.09] bg-[#070709]/92 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl lg:col-span-8'>
            <div className='flex items-center justify-between gap-3 border-b border-white/[0.07] bg-[#111114]/95 px-4 py-2'>
              <div className='flex min-w-0 items-center gap-3'>
                <div className='flex items-center gap-1.5'>
                  <span className='size-2.5 rounded-full bg-white/15' />
                  <span className='size-2.5 rounded-full bg-white/10' />
                  <span className='size-2.5 rounded-full bg-white/10' />
                </div>
                <span className='truncate font-mono text-xs text-zinc-400'>
                  {activeSnippet.filename}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={handleSimulate}
                  className='inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-200 transition-colors hover:border-white/25 hover:bg-white/[0.08] hover:text-white'
                >
                  <Play className='size-3 fill-current' />
                  <span>{isZh ? '试运行' : 'Simulate'}</span>
                </button>
                <CopyButton
                  value={activeSnippet.code}
                  variant='ghost'
                  size='icon'
                  className='size-7 rounded-lg text-zinc-400 hover:bg-white/[0.08] hover:text-white'
                  iconClassName='size-3.5'
                />
              </div>
            </div>

            <div className='p-4 sm:p-5'>
              <AnimatePresence mode='wait'>
                <motion.pre
                  key={activeSnippet.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, y: -4 }
                  }
                  transition={{ duration: 0.2, ease: EASE_LIQUID }}
                  className='min-h-[144px] overflow-x-auto font-mono text-[12.5px] leading-6 text-zinc-200'
                >
                  <code>{activeSnippet.code}</code>
                </motion.pre>
              </AnimatePresence>

              <div className='mt-3 flex min-h-[28px] items-center justify-between gap-3 border-t border-white/[0.06] pt-2.5 font-mono text-[11px]'>
                {simRunning ? (
                  <div className='flex min-w-0 items-center gap-2 text-emerald-300/90'>
                    <span className='size-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400' />
                    <span className='truncate'>
                      {activeSnippet.mockStream.slice(0, simTypedLen)}
                    </span>
                    <span className='inline-block h-3.5 w-1 shrink-0 animate-pulse bg-emerald-300/80' />
                  </div>
                ) : (
                  <div className='flex items-center gap-1.5 text-zinc-500'>
                    <Terminal className='size-3' />
                    <span>{isZh ? '就绪' : 'ready'}</span>
                    <span className='inline-block h-3.5 w-1.5 animate-pulse bg-zinc-400/80' />
                  </div>
                )}

                <Link
                  to='/docs'
                  className='shrink-0 text-zinc-400 transition-colors hover:text-white'
                >
                  {isZh ? '查看文档 →' : 'Docs →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. Interactive Motion Bento Grid (All bilingual, no unsupported models) */}
      <motion.section
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        animate={
          prefersReducedMotion
            ? undefined
            : visible
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 18 }
        }
        transition={{ duration: 0.55, delay: visible ? 0.16 : 0, ease: EASE_LIQUID }}
        className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'
      >
        {/* Card 1: Multi-Protocol Active Scanner (distinct from Hero curves) */}
        <SpotlightCard className='min-h-[186px]'>
          <div className='space-y-2 py-1'>
            {PROTOCOL_LANES.map((lane, idx) => {
              const isCurrent = activeLane === idx
              return (
                <div
                  key={lane.path}
                  onMouseEnter={() => setActiveLane(idx)}
                  className={cn(
                    'flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] transition-all duration-300',
                    isCurrent
                      ? 'border-white/25 bg-white/[0.08] text-white'
                      : 'border-white/[0.06] bg-[#121216]/70 text-zinc-500'
                  )}
                >
                  <div className='flex min-w-0 items-center gap-2'>
                    <span
                      className={cn(
                        'size-1.5 shrink-0 rounded-full transition-colors',
                        isCurrent
                          ? 'animate-pulse bg-emerald-400'
                          : 'bg-zinc-700'
                      )}
                    />
                    <span className='truncate'>{lane.path}</span>
                  </div>
                  <span className='shrink-0 text-[10px] text-zinc-400'>
                    {lane.client}
                  </span>
                </div>
              )
            })}
          </div>
          <div className='mt-3'>
            <div className='text-sm font-semibold text-white'>
              {isZh ? '多协议兼容' : 'Multi-Protocol'}
            </div>
            <div className='mt-0.5 text-xs text-zinc-500'>
              {isZh ? '原生端点自动路由' : 'Native endpoint routing'}
            </div>
          </div>
        </SpotlightCard>

        {/* Card 2: Ambient Streaming Waveform */}
        <SpotlightCard className='min-h-[186px]'>
          <div className='relative flex h-24 items-end justify-center gap-1.5 px-2 pb-2'>
            {WAVE_BARS.map((height, idx) => (
              <motion.span
                key={idx}
                className='w-1.5 rounded-full bg-gradient-to-t from-zinc-600 via-zinc-300 to-white'
                initial={{ height: `${height * 50}px`, opacity: 0.45 }}
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        height: [
                          `${height * 26}px`,
                          `${height * 62}px`,
                          `${height * 30}px`,
                        ],
                        opacity: [0.35, 0.9, 0.4],
                      }
                }
                transition={{
                  duration: 1.5 + (idx % 4) * 0.25,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: idx * 0.08,
                }}
              />
            ))}
          </div>
          <div className='mt-3'>
            <div className='text-sm font-semibold text-white'>
              {isZh ? '实时流式输出' : 'Live Streaming'}
            </div>
            <div className='mt-0.5 text-xs text-zinc-500'>
              {isZh ? '流式长连接 · 低延迟' : 'SSE · Low latency'}
            </div>
          </div>
        </SpotlightCard>

        {/* Card 3: Genuine Supported Ecosystem Matrix */}
        <SpotlightCard className='min-h-[186px]'>
          <div className='grid grid-cols-3 gap-2 pt-0.5'>
            {ECOSYSTEM_ENTRIES.map((item) => {
              const isSelected = activeEcoId === item.id
              return (
                <motion.button
                  key={item.id}
                  type='button'
                  onMouseEnter={() => setActiveEcoId(item.id)}
                  onClick={() => setActiveEcoId(item.id)}
                  whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                  className={cn(
                    'flex h-10 cursor-pointer items-center justify-center rounded-xl border transition-colors',
                    isSelected
                      ? 'border-white/30 bg-white/[0.1] text-white'
                      : 'border-white/[0.07] bg-[#121215] text-zinc-400 hover:border-white/20 hover:text-white'
                  )}
                  aria-label={item.label}
                >
                  {item.kind === 'lobe' ? (
                    getLobeIcon(item.iconKey, 18)
                  ) : item.kind === 'terminal' ? (
                    <Terminal className='size-4' />
                  ) : item.kind === 'chat' ? (
                    <MessageSquare className='size-4' />
                  ) : (
                    <Code2 className='size-4' />
                  )}
                </motion.button>
              )
            })}
          </div>
          <div className='mt-3 flex items-end justify-between gap-2'>
            <div className='min-w-0'>
              <div className='text-sm font-semibold text-white'>
                {activeEco.label}
              </div>
              <div className='mt-0.5 truncate font-mono text-xs text-zinc-500'>
                {activeEco.endpoint}
              </div>
            </div>
            <Link
              to='/pricing'
              className='shrink-0 text-xs text-zinc-400 transition-colors hover:text-white'
            >
              {isZh ? '全部 →' : 'All →'}
            </Link>
          </div>
        </SpotlightCard>

        {/* Card 4: Interactive Shimmer + One-Click Gateway Copy */}
        <SpotlightCard className='min-h-[186px]'>
          <div className='relative flex h-24 items-center justify-center'>
            <AnimatePresence>
              {rippleTick > 0 && !prefersReducedMotion && (
                <motion.span
                  key={rippleTick}
                  initial={{ scale: 0.65, opacity: 0.7 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.85, ease: 'easeOut' }}
                  className='pointer-events-none absolute size-14 rounded-full border border-white/40'
                />
              )}
            </AnimatePresence>

            <motion.button
              type='button'
              onClick={handleGatewayCopy}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              className='relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-gradient-to-b from-[#1a1a1f] to-[#0f0f12] px-4 py-2 text-xs font-medium text-zinc-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] transition-colors hover:border-white/35'
            >
              {!prefersReducedMotion && (
                <motion.span
                  aria-hidden='true'
                  className='pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent'
                  animate={{ x: ['0%', '350%'] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    repeatDelay: 1.4,
                    ease: 'easeInOut',
                  }}
                />
              )}
              {isGatewayCopied ? (
                <Check className='size-3.5 text-emerald-400' />
              ) : (
                <Copy className='size-3.5 text-zinc-300' />
              )}
              <span className='font-mono'>
                {isGatewayCopied
                  ? isZh
                    ? '已复制网关'
                    : 'Copied'
                  : 'api.tokex.vip'}
              </span>
            </motion.button>
          </div>
          <div className='mt-3'>
            <div className='text-sm font-semibold text-white'>
              {isZh ? '统一网关入口' : 'Unified Gateway'}
            </div>
            <div className='mt-0.5 text-xs text-zinc-500'>
              {isZh ? '按美元实时计量' : 'Real-time USD metering'}
            </div>
          </div>
        </SpotlightCard>
      </motion.section>
    </div>
  )
}
