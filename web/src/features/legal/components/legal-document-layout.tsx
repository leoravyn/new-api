import { Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  Calendar,
  ExternalLink,
  FileText,
  Info,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { PageTransition } from '@/components/page-transition'
import { normalizeInterfaceLanguage } from '@/i18n/languages'
import { cn } from '@/lib/utils'

import { LEGAL_CONFIG } from '../content/legal-config'
import type {
  BilingualLegalDocument,
  LegalBlock,
  LegalDocumentId,
  LegalRichText,
  LegalTextRun,
} from '../types'

interface LegalNavItem {
  id: LegalDocumentId
  to: '/terms' | '/privacy-policy' | '/aup'
  labelZh: string
  labelEn: string
}

const LEGAL_NAV_ITEMS: readonly LegalNavItem[] = [
  {
    id: 'terms',
    to: '/terms',
    labelZh: '服务条款',
    labelEn: 'Terms of Service',
  },
  {
    id: 'privacy',
    to: '/privacy-policy',
    labelZh: '隐私政策',
    labelEn: 'Privacy Policy',
  },
  {
    id: 'aup',
    to: '/aup',
    labelZh: '可接受使用政策',
    labelEn: 'Acceptable Use Policy',
  },
]

function renderTextRun(run: LegalTextRun, key: number) {
  if (typeof run === 'string') {
    return <Fragment key={key}>{run}</Fragment>
  }

  switch (run.type) {
    case 'strong':
      return (
        <strong key={key} className='font-semibold text-white'>
          {run.text}
        </strong>
      )
    case 'link':
      return (
        <Link
          key={key}
          to={run.to}
          className='font-medium text-zinc-100 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white'
        >
          {run.label}
        </Link>
      )
    case 'email':
      return (
        <a
          key={key}
          href={`mailto:${run.email}`}
          className='font-medium text-zinc-100 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white'
        >
          {run.label ?? run.email}
        </a>
      )
    case 'external':
      return (
        <a
          key={key}
          href={run.href}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-1 font-medium text-zinc-100 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white'
        >
          <span>{run.label}</span>
          <ExternalLink className='size-3 shrink-0 text-zinc-400' />
        </a>
      )
  }
}

function RichText({ content }: { content: LegalRichText }) {
  if (Array.isArray(content)) {
    return <>{content.map((run, index) => renderTextRun(run, index))}</>
  }
  return <>{renderTextRun(content as LegalTextRun, 0)}</>
}

function LegalBlockView({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className='text-[15px] leading-7 text-zinc-300'>
          <RichText content={block.content} />
        </p>
      )
    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul'
      return (
        <ListTag
          className={cn(
            'space-y-2.5 pl-5 text-[15px] leading-7 text-zinc-300',
            block.ordered ? 'list-decimal' : 'list-disc'
          )}
        >
          {block.items.map((item, idx) => (
            <li key={idx} className='pl-1 marker:text-zinc-500'>
              <RichText content={item} />
            </li>
          ))}
        </ListTag>
      )
    }
    case 'callout': {
      const isWarning = block.tone === 'warning'
      const Icon = isWarning ? AlertTriangle : Info
      return (
        <div
          className={cn(
            'rounded-xl border p-4 text-sm leading-6',
            isWarning
              ? 'border-amber-500/25 bg-amber-500/[0.06] text-amber-100/90'
              : 'border-white/10 bg-white/[0.03] text-zinc-200'
          )}
        >
          <div className='flex items-start gap-3'>
            <Icon
              className={cn(
                'mt-0.5 size-4 shrink-0',
                isWarning ? 'text-amber-300' : 'text-zinc-300'
              )}
            />
            <div className='space-y-1'>
              {block.title && (
                <div className='font-semibold text-white'>{block.title}</div>
              )}
              <div className='text-[14px] leading-6 text-zinc-300'>
                <RichText content={block.content} />
              </div>
            </div>
          </div>
        </div>
      )
    }
    case 'table':
      return (
        <div className='overflow-x-auto rounded-xl border border-white/10 bg-[#050506]'>
          <table className='w-full border-collapse text-left text-sm'>
            <thead>
              <tr className='border-b border-white/10 bg-white/[0.03]'>
                {block.headers.map((header) => (
                  <th
                    key={header}
                    className='px-4 py-3 text-xs font-semibold tracking-wide text-zinc-200'
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-white/[0.06]'>
              {block.rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className='transition-colors hover:bg-white/[0.02]'
                >
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className='px-4 py-3 align-top leading-6 text-zinc-300'
                    >
                      <RichText content={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

export interface LegalDocumentLayoutProps {
  document: BilingualLegalDocument
}

export function LegalDocumentLayout({ document }: LegalDocumentLayoutProps) {
  const { i18n } = useTranslation()
  const lang = normalizeInterfaceLanguage(
    i18n.resolvedLanguage || i18n.language
  )
  const isZh = lang === 'zhCN'
  const content = isZh ? document.zhCN : document.en

  return (
    <PublicLayout showMainContainer={false}>
      <PageTransition className='relative min-h-screen text-zinc-100'>
        <div className='relative mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 lg:px-8'>
          {/* Top Document Switcher + Inline Language Toggle */}
          <div className='flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5'>
            <nav
              aria-label={isZh ? '合规文档导航' : 'Legal documents'}
              className='flex flex-wrap items-center gap-2'
            >
              {LEGAL_NAV_ITEMS.map((item) => {
                const isActive = item.id === content.id
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                      isActive
                        ? 'border-white/25 bg-white text-black shadow-xs'
                        : 'border-white/10 bg-[#0a0a0c] text-zinc-300 hover:border-white/20 hover:bg-[#141417] hover:text-white'
                    )}
                  >
                    <FileText className='size-3.5' />
                    <span>{isZh ? item.labelZh : item.labelEn}</span>
                  </Link>
                )
              })}
            </nav>

            <div
              role='group'
              aria-label={isZh ? '切换文档语言' : 'Switch document language'}
              className='inline-flex items-center rounded-full border border-white/10 bg-[#0a0a0c] p-0.5'
            >
              <button
                type='button'
                onClick={() => {
                  if (!isZh) void i18n.changeLanguage('zhCN')
                }}
                aria-pressed={isZh}
                className={cn(
                  'cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  isZh
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white'
                )}
              >
                中文
              </button>
              <button
                type='button'
                onClick={() => {
                  if (isZh) void i18n.changeLanguage('en')
                }}
                aria-pressed={!isZh}
                className={cn(
                  'cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  !isZh
                    ? 'bg-white text-black'
                    : 'text-zinc-400 hover:text-white'
                )}
              >
                English
              </button>
            </div>
          </div>

          <div className='mt-8 grid gap-10 lg:grid-cols-12'>
            {/* Desktop Sticky Table of Contents */}
            <aside className='hidden lg:col-span-3 lg:block'>
              <div className='sticky top-24 rounded-2xl border border-white/10 bg-[#050506]/90 p-4 backdrop-blur-xl'>
                <div className='mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                  <ShieldCheck className='size-3.5 text-zinc-300' />
                  <span>{isZh ? '条款目录' : 'Contents'}</span>
                </div>
                <nav
                  aria-label={isZh ? '章节目录' : 'Table of contents'}
                  className='max-h-[calc(100vh-14rem)] space-y-1 overflow-y-auto pr-1'
                >
                  {content.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className='block rounded-lg px-2.5 py-1.5 text-xs leading-5 text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white'
                    >
                      <span className='mr-1.5 font-mono text-zinc-500'>
                        {section.number}.
                      </span>
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Document Body */}
            <article className='min-w-0 lg:col-span-9'>
              <div className='max-w-4xl space-y-8'>
                {/* Document Header Card */}
                <header className='rounded-2xl border border-white/10 bg-[#0a0a0c]/90 p-6 backdrop-blur-xl sm:p-8'>
                  <div className='flex flex-wrap items-center gap-2.5'>
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-medium text-zinc-200'>
                      {content.badge}
                    </span>
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#050506] px-3 py-1 text-xs text-zinc-400'>
                      <Calendar className='size-3.5 text-zinc-400' />
                      <span>
                        {isZh ? '生效日期：' : 'Effective: '}
                        {LEGAL_CONFIG.effectiveDate}
                      </span>
                    </span>
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#050506] px-3 py-1 text-xs text-zinc-400'>
                      <span>
                        {isZh ? '最近更新：' : 'Last Updated: '}
                        {LEGAL_CONFIG.lastUpdated}
                      </span>
                    </span>
                  </div>

                  <h1 className='mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl'>
                    {content.title}
                  </h1>
                  <p className='mt-3 text-base leading-7 text-zinc-300'>
                    {content.subtitle}
                  </p>

                  <div className='mt-6 grid gap-3 sm:grid-cols-2'>
                    {content.summaryPoints.map((point) => (
                      <div
                        key={point.label}
                        className='rounded-xl border border-white/10 bg-[#050506]/90 px-4 py-3'
                      >
                        <div className='text-[11px] font-medium tracking-wide text-zinc-400 uppercase'>
                          {point.label}
                        </div>
                        <div className='mt-1 text-sm leading-5 font-medium text-zinc-100'>
                          <RichText content={point.value} />
                        </div>
                      </div>
                    ))}
                  </div>
                </header>

                {/* Mobile Quick TOC */}
                <details className='rounded-2xl border border-white/10 bg-[#0a0a0c]/80 p-4 lg:hidden'>
                  <summary className='cursor-pointer text-sm font-medium text-zinc-200'>
                    {isZh ? '查看章节目录' : 'Jump to section'}
                  </summary>
                  <nav className='mt-3 grid gap-1.5 sm:grid-cols-2'>
                    {content.sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className='rounded-lg px-2 py-1 text-xs text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                      >
                        <span className='mr-1 font-mono text-zinc-500'>
                          {section.number}.
                        </span>
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </details>

                {/* Document Sections */}
                <div className='space-y-6'>
                  {content.sections.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className='scroll-mt-24 rounded-2xl border border-white/10 bg-[#050506]/90 p-6 backdrop-blur-xl sm:p-7'
                    >
                      <h2 className='mb-4 flex items-baseline gap-2.5 text-lg font-semibold tracking-tight text-white sm:text-xl'>
                        <span className='font-mono text-sm text-zinc-500'>
                          §{section.number}
                        </span>
                        <span>{section.title}</span>
                      </h2>
                      <div className='space-y-4'>
                        {section.blocks.map((block, index) => (
                          <LegalBlockView key={index} block={block} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                {/* Unified Contact & Cross-Navigation Footer Box */}
                <aside className='rounded-2xl border border-white/10 bg-[#0a0a0c]/90 p-6 backdrop-blur-xl'>
                  <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2 text-sm font-semibold text-white'>
                        <Mail className='size-4 text-zinc-300' />
                        <span>
                          {isZh
                            ? '合规、账单、退款与安全联络渠道'
                            : 'Support, Billing, Refunds & Compliance Contact'}
                        </span>
                      </div>
                      <p className='text-xs leading-5 text-zinc-400'>
                        {isZh
                          ? `${LEGAL_CONFIG.operatorNameZh} · 工作时间：${LEGAL_CONFIG.businessHoursZh}`
                          : `${LEGAL_CONFIG.operatorName} · ${LEGAL_CONFIG.businessHoursEn}`}
                      </p>
                    </div>
                    <a
                      href={`mailto:${LEGAL_CONFIG.supportEmail}`}
                      className='inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-zinc-200'
                    >
                      <Mail className='size-3.5' />
                      <span>{LEGAL_CONFIG.supportEmail}</span>
                    </a>
                  </div>

                  <div className='mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-xs text-zinc-400'>
                    <Link
                      to='/terms'
                      className='transition-colors hover:text-white'
                    >
                      {isZh ? '服务条款' : 'Terms of Service'}
                    </Link>
                    <Link
                      to='/privacy-policy'
                      className='transition-colors hover:text-white'
                    >
                      {isZh ? '隐私政策' : 'Privacy Policy'}
                    </Link>
                    <Link
                      to='/aup'
                      className='transition-colors hover:text-white'
                    >
                      {isZh
                        ? '可接受使用政策与大模型规范'
                        : 'Acceptable Use Policy'}
                    </Link>
                    <Link
                      to='/pricing'
                      className='transition-colors hover:text-white'
                    >
                      {isZh ? '模型定价' : 'Pricing'}
                    </Link>
                  </div>
                </aside>
              </div>
            </article>
          </div>
        </div>
      </PageTransition>
    </PublicLayout>
  )
}
