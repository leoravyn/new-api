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
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Code2,
  FileText,
  Globe,
  KeyRound,
  Mail,
  MessageSquare,
  ShieldCheck,
  Terminal,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { PublicLayout } from '@/components/layout'
import { LEGAL_CONFIG } from '@/features/legal/content/legal-config'
import { normalizeInterfaceLanguage } from '@/i18n/languages'
import { cn } from '@/lib/utils'

import { DocsCodeBlock } from './components/docs-code-block'
import { getDocsContent } from './content'
import type { DocsSdkExample } from './types'

const API_GATEWAY_URL = 'https://api.tokex.vip'

export function DocsPage() {
  const { i18n } = useTranslation()
  const isZh =
    normalizeInterfaceLanguage(i18n.resolvedLanguage || i18n.language) ===
    'zhCN'
  const content = getDocsContent(isZh)
  const [activeSdk, setActiveSdk] = useState<DocsSdkExample['id']>('python')

  const currentSdk =
    content.sdk.examples.find((item) => item.id === activeSdk) ??
    content.sdk.examples[0]

  return (
    <PublicLayout showMainContainer={false}>
      <div className='px-4 py-10 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-6xl'>
          {/* Top Breadcrumb + Bilingual Switcher */}
          <div className='tokex-content-enter flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5'>
            <nav
              aria-label={isZh ? '页面导航' : 'Page navigation'}
              className='flex flex-wrap items-center gap-2 text-xs text-zinc-400'
            >
              <Link to='/' className='transition-colors hover:text-white'>
                {isZh ? '首页' : 'Home'}
              </Link>
              <span className='text-zinc-600'>/</span>
              <span className='rounded-full border border-white/15 bg-white px-3 py-1 font-medium text-black'>
                {content.badge}
              </span>
            </nav>

            <div
              role='group'
              aria-label={isZh ? '切换文档语言' : 'Switch document language'}
              className='tokex-surface-pill inline-flex items-center p-0.5'
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
              <div className='sticky top-24 space-y-4'>
                <div className='tokex-liquid-card tokex-content-reveal p-4'>
                  <div className='mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase'>
                    <BookOpen className='size-3.5 text-zinc-300' />
                    <span>{content.tocTitle}</span>
                  </div>
                  <nav
                    aria-label={content.tocTitle}
                    className='space-y-1'
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

                <div className='tokex-liquid-card tokex-content-reveal p-4'>
                  <div className='mb-2.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase'>
                    {content.quickLinksLabel}
                  </div>
                  <div className='space-y-1.5 text-xs'>
                    {content.resources.platformLinks.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className='flex items-center justify-between rounded-lg px-2.5 py-1.5 text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-white'
                      >
                        <span>{item.label}</span>
                        <ArrowRight className='size-3 text-zinc-500' />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Document Body */}
            <article className='min-w-0 lg:col-span-9'>
              <div className='max-w-4xl space-y-8'>
                {/* Document Header Card */}
                <header className='tokex-liquid-card tokex-content-reveal p-6 sm:p-8'>
                  <div className='inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-medium text-zinc-200'>
                    <Terminal className='size-3.5 text-zinc-300' />
                    <span>{content.badge}</span>
                  </div>

                  <h1 className='mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl'>
                    {content.title}
                  </h1>
                  <p className='mt-3 text-base leading-7 text-zinc-300'>
                    {content.subtitle}
                  </p>

                  <div className='mt-5 flex flex-wrap items-center gap-2.5'>
                    <Link
                      to='/keys'
                      className='inline-flex h-9 items-center gap-2 rounded-xl border border-white/20 bg-gradient-to-b from-[#fafafa] via-[#ebebef] to-[#d6d6db] px-4 text-xs font-semibold text-[#08080a] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] transition-opacity hover:opacity-90'
                    >
                      <KeyRound className='size-3.5' />
                      <span>{isZh ? '获取 API 令牌' : 'Get API Key'}</span>
                    </Link>
                    <Link
                      to='/pricing'
                      className='inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-[#141418] px-4 text-xs font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white'
                    >
                      <span>{isZh ? '模型广场' : 'Model Square'}</span>
                      <ArrowRight className='size-3.5' />
                    </Link>
                  </div>

                  <div className='mt-6 grid gap-3 sm:grid-cols-2'>
                    <div className='flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3'>
                      <div className='min-w-0'>
                        <div className='text-[11px] font-medium tracking-wide text-zinc-400 uppercase'>
                          {content.baseUrlLabel}
                        </div>
                        <div className='mt-1 truncate font-mono text-sm font-semibold text-white'>
                          {API_GATEWAY_URL}
                        </div>
                      </div>
                      <CopyButton
                        value={API_GATEWAY_URL}
                        variant='outline'
                        size='icon'
                        className='size-8 rounded-lg border-white/10 bg-[#141418] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
                        iconClassName='size-3.5'
                        tooltip={content.copyLabel}
                        successTooltip={content.copiedLabel}
                        aria-label={content.copyLabel}
                      />
                    </div>

                    <div className='flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3'>
                      <div className='min-w-0'>
                        <div className='text-[11px] font-medium tracking-wide text-zinc-400 uppercase'>
                          {isZh ? '支持协议端点' : 'Endpoints'}
                        </div>
                        <div className='mt-1 truncate font-mono text-sm font-semibold text-white'>
                          /v1/responses · /messages · /chat
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Mobile Quick TOC */}
                <details className='tokex-liquid-card p-4 lg:hidden'>
                  <summary className='cursor-pointer text-sm font-medium text-zinc-200'>
                    {content.mobileTocLabel}
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

                {/* Section 1: API Usage Rules */}
                <section
                  id='rules'
                  className='tokex-liquid-card tokex-content-reveal scroll-mt-24 space-y-5 p-6 sm:p-7'
                >
                  <div>
                    <h2 className='flex items-baseline gap-2.5 text-lg font-semibold tracking-tight text-white sm:text-xl'>
                      <span className='font-mono text-sm text-zinc-500'>
                        01
                      </span>
                      <span>{content.sections[0].title}</span>
                    </h2>
                    <p className='mt-1 text-sm text-zinc-400'>
                      {content.sections[0].summary}
                    </p>
                  </div>

                  {/* Endpoints Table */}
                  <div className='space-y-2.5'>
                    <h3 className='text-sm font-semibold text-zinc-100'>
                      {content.rules.endpointsTitle}
                    </h3>
                    <div className='grid gap-2.5 sm:grid-cols-3'>
                      {content.rules.endpoints.map((item) => (
                        <div
                          key={item.endpoint}
                          className='rounded-xl border border-white/[0.06] bg-white/[0.025] p-3.5'
                        >
                          <div className='font-mono text-xs font-semibold text-white'>
                            {item.endpoint}
                          </div>
                          <div className='mt-1.5 text-xs font-medium text-zinc-300'>
                            {item.recommendedFor}
                          </div>
                          <div className='mt-1 text-[11px] leading-5 text-zinc-400'>
                            {item.baseUrlNote}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Token Groups */}
                  <div className='space-y-3'>
                    <h3 className='text-sm font-semibold text-zinc-100'>
                      {content.rules.groupsTitle}
                    </h3>
                    <div className='rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-xs leading-6 text-amber-100/90'>
                      <div className='flex items-start gap-2.5'>
                        <AlertTriangle className='mt-1 size-4 shrink-0 text-amber-300' />
                        <span>
                          {content.rules.groupsNotice}{' '}
                          <Link
                            to='/pricing'
                            className='font-medium text-amber-200 underline decoration-amber-300/40 underline-offset-4 hover:text-white'
                          >
                            {isZh ? '查看模型广场' : 'Open Model Square'}
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Guidelines */}
                  <div className='space-y-2.5'>
                    <h3 className='text-sm font-semibold text-zinc-100'>
                      {content.rules.guidelinesTitle}
                    </h3>
                    <ul className='list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300'>
                      {content.rules.guidelines.map((rule) => (
                        <li key={rule} className='pl-1 marker:text-zinc-500'>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Section 2: Codex CLI */}
                <section
                  id='codex'
                  className='tokex-liquid-card tokex-content-reveal scroll-mt-24 space-y-4 p-6 sm:p-7'
                >
                  <div>
                    <h2 className='flex items-baseline gap-2.5 text-lg font-semibold tracking-tight text-white sm:text-xl'>
                      <span className='font-mono text-sm text-zinc-500'>
                        02
                      </span>
                      <span>{content.sections[1].title}</span>
                    </h2>
                    <p className='mt-1 text-sm text-zinc-400'>
                      {content.sections[1].summary}
                    </p>
                  </div>

                  <p className='rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs leading-6 text-zinc-300'>
                    {content.codex.groupNote}
                  </p>

                  <div className='space-y-2'>
                    <div className='text-sm font-medium text-zinc-200'>
                      {content.codex.step1Title}
                    </div>
                    <DocsCodeBlock
                      code={content.codex.step1Command}
                      title='~/.codex/config.toml'
                      copyLabel={content.copyLabel}
                      copiedLabel={content.copiedLabel}
                    />
                  </div>

                  <div className='space-y-2'>
                    <div className='text-sm font-medium text-zinc-200'>
                      {content.codex.step2Title}
                    </div>
                    <DocsCodeBlock
                      code={content.codex.step2Command}
                      title='bash'
                      copyLabel={content.copyLabel}
                      copiedLabel={content.copiedLabel}
                    />
                    <p className='pt-1 text-xs text-zinc-400'>
                      {content.codex.step2PersistLabel}
                    </p>
                    <DocsCodeBlock
                      code={content.codex.step2PersistCommand}
                      title='bash'
                      copyLabel={content.copyLabel}
                      copiedLabel={content.copiedLabel}
                    />
                  </div>

                  <p className='text-xs text-zinc-400'>
                    {content.codex.footerNote}{' '}
                    <Link
                      to='/pricing'
                      className='text-zinc-200 underline decoration-white/30 underline-offset-4 hover:text-white'
                    >
                      {isZh ? '前往模型广场' : 'Open Model Square'}
                    </Link>
                  </p>
                </section>

                {/* Section 3: Claude Code */}
                <section
                  id='claude-code'
                  className='tokex-liquid-card tokex-content-reveal scroll-mt-24 space-y-4 p-6 sm:p-7'
                >
                  <div>
                    <h2 className='flex items-baseline gap-2.5 text-lg font-semibold tracking-tight text-white sm:text-xl'>
                      <span className='font-mono text-sm text-zinc-500'>
                        03
                      </span>
                      <span>{content.sections[2].title}</span>
                    </h2>
                    <p className='mt-1 text-sm text-zinc-400'>
                      {content.sections[2].summary}
                    </p>
                  </div>

                  <p className='rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs leading-6 text-zinc-300'>
                    {content.claudeCode.groupNote}
                  </p>

                  <div className='space-y-2'>
                    <div className='text-sm font-medium text-zinc-200'>
                      {content.claudeCode.runTitle}
                    </div>
                    <DocsCodeBlock
                      code={content.claudeCode.runCommand}
                      title='bash'
                      copyLabel={content.copyLabel}
                      copiedLabel={content.copiedLabel}
                    />
                  </div>

                  <div className='space-y-2'>
                    <div className='text-sm font-medium text-zinc-200'>
                      {content.claudeCode.persistTitle}
                    </div>
                    <DocsCodeBlock
                      code={content.claudeCode.persistCommand}
                      title='~/.zshrc / ~/.bashrc'
                      copyLabel={content.copyLabel}
                      copiedLabel={content.copiedLabel}
                    />
                  </div>

                  <p className='text-xs leading-6 text-zinc-400'>
                    {content.claudeCode.envNote}
                  </p>
                </section>

                {/* Section 4: Generic OpenAI Clients */}
                <section
                  id='clients'
                  className='tokex-liquid-card tokex-content-reveal scroll-mt-24 space-y-4 p-6 sm:p-7'
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h2 className='flex items-baseline gap-2.5 text-lg font-semibold tracking-tight text-white sm:text-xl'>
                        <span className='font-mono text-sm text-zinc-500'>
                          04
                        </span>
                        <span>{content.sections[3].title}</span>
                      </h2>
                      <p className='mt-1 text-sm text-zinc-400'>
                        {content.clients.intro}
                      </p>
                    </div>
                    <MessageSquare className='hidden size-5 shrink-0 text-zinc-500 sm:block' />
                  </div>

                  <div className='tokex-surface-subtle overflow-hidden'>
                    <div className='border-b border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-zinc-200'>
                      {content.clients.configTitle}
                    </div>
                    <div className='divide-y divide-white/[0.06]'>
                      {content.clients.configRows.map((row) => (
                        <div
                          key={row.label}
                          className='flex flex-wrap items-center justify-between gap-3 px-4 py-3'
                        >
                          <div className='min-w-0 space-y-0.5'>
                            <div className='text-xs font-medium text-zinc-400'>
                              {row.label}
                            </div>
                            <div className='font-mono text-sm text-white'>
                              {row.value}
                            </div>
                            {row.hint && (
                              <div className='text-[11px] text-zinc-500'>
                                {row.hint}
                              </div>
                            )}
                          </div>
                          {row.copyable && (
                            <CopyButton
                              value={row.value}
                              variant='ghost'
                              size='icon'
                              className='size-8 rounded-lg text-zinc-400 hover:bg-white/[0.08] hover:text-white'
                              iconClassName='size-3.5'
                              tooltip={content.copyLabel}
                              successTooltip={content.copiedLabel}
                              aria-label={`${content.copyLabel} ${row.label}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className='text-xs leading-6 text-zinc-400'>
                    {content.clients.pathNote}
                  </p>
                </section>

                {/* Section 5: SDK & cURL */}
                <section
                  id='sdk'
                  className='tokex-liquid-card tokex-content-reveal scroll-mt-24 space-y-4 p-6 sm:p-7'
                >
                  <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                      <h2 className='flex items-baseline gap-2.5 text-lg font-semibold tracking-tight text-white sm:text-xl'>
                        <span className='font-mono text-sm text-zinc-500'>
                          05
                        </span>
                        <span>{content.sections[4].title}</span>
                      </h2>
                      <p className='mt-1 text-sm text-zinc-400'>
                        {content.sdk.intro}
                      </p>
                    </div>

                    <div
                      role='tablist'
                      aria-label='SDK examples'
                      className='tokex-surface-subtle inline-flex items-center p-1'
                    >
                      {content.sdk.examples.map((tab) => {
                        const isSelected = tab.id === currentSdk.id
                        return (
                          <button
                            key={tab.id}
                            type='button'
                            role='tab'
                            aria-selected={isSelected}
                            onClick={() => setActiveSdk(tab.id)}
                            className={cn(
                              'cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                              isSelected
                                ? 'bg-white text-black'
                                : 'text-zinc-400 hover:text-white'
                            )}
                          >
                            {tab.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <DocsCodeBlock
                    code={currentSdk.code}
                    title={currentSdk.filename}
                    language={currentSdk.language}
                    copyLabel={content.copyLabel}
                    copiedLabel={content.copiedLabel}
                  />

                  <p className='flex items-start gap-2 text-xs leading-6 text-zinc-400'>
                    <Code2 className='mt-1 size-3.5 shrink-0 text-zinc-500' />
                    <span>{content.sdk.groupNote}</span>
                  </p>
                </section>

                {/* Section 6: Troubleshooting */}
                <section
                  id='troubleshooting'
                  className='tokex-liquid-card tokex-content-reveal scroll-mt-24 space-y-4 p-6 sm:p-7'
                >
                  <div>
                    <h2 className='flex items-baseline gap-2.5 text-lg font-semibold tracking-tight text-white sm:text-xl'>
                      <span className='font-mono text-sm text-zinc-500'>
                        06
                      </span>
                      <span>{content.sections[5].title}</span>
                    </h2>
                    <p className='mt-1 text-sm text-zinc-400'>
                      {content.sections[5].summary}
                    </p>
                  </div>

                  <div className='tokex-surface-subtle divide-y divide-white/[0.06]'>
                    {content.troubleshooting.items.map((item) => (
                      <div
                        key={item.code}
                        className='flex flex-col gap-1.5 px-4 py-3.5 sm:flex-row sm:items-baseline sm:gap-4'
                      >
                        <span className='w-12 shrink-0 font-mono text-xs font-semibold text-amber-300 tabular-nums'>
                          {item.code}
                        </span>
                        <div className='min-w-0 space-y-0.5'>
                          <div className='text-sm font-medium text-white'>
                            {item.title}
                          </div>
                          <p className='text-xs leading-5 text-zinc-400'>
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Resources & Legal Jump Box */}
                <aside className='tokex-liquid-card tokex-content-reveal p-6'>
                  <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2 text-sm font-semibold text-white'>
                        <Globe className='size-4 text-zinc-300' />
                        <span>{content.resources.title}</span>
                      </div>
                      <p className='text-xs leading-5 text-zinc-400'>
                        {content.resources.subtitle}
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

                  <div className='mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 text-xs'>
                    {content.resources.platformLinks.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className='tokex-surface-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 font-medium text-zinc-100 hover:border-white/25 hover:text-white'
                      >
                        <span>{item.label}</span>
                        <ArrowRight className='size-3 text-zinc-400' />
                      </Link>
                    ))}
                    {content.resources.legalLinks.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className='tokex-surface-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 text-zinc-300 hover:border-white/20 hover:text-white'
                      >
                        {item.to === '/aup' ? (
                          <ShieldCheck className='size-3.5' />
                        ) : (
                          <FileText className='size-3.5' />
                        )}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </aside>
              </div>
            </article>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
