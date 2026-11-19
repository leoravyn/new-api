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
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { CreditCard, FileText, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { RichContent } from '@/components/rich-content'
import { Skeleton } from '@/components/ui/skeleton'
import { LEGAL_CONFIG } from '@/features/legal/content/legal-config'
import { normalizeInterfaceLanguage } from '@/i18n/languages'
import { isHttpUrl, isLikelyHtml } from '@/lib/content-format'
import { requireServerSuccess } from '@/lib/server-error-message'

import { getAboutContent } from './api'

function AboutOverviewState() {
  const { i18n } = useTranslation()
  const isZh =
    normalizeInterfaceLanguage(i18n.resolvedLanguage || i18n.language) ===
    'zhCN'
  const currentYear = new Date().getFullYear()

  return (
    <div className='flex min-h-[65vh] items-center justify-center px-4 py-10 sm:px-6'>
      <div className='tokex-glass-elevated max-w-3xl space-y-7 rounded-2xl border border-white/10 bg-[#0a0a0c]/90 p-7 sm:p-10'>
        <div className='flex flex-col items-center space-y-4 text-center'>
          <img
            src='/logo-tokex.svg'
            alt={LEGAL_CONFIG.brandName}
            width={226}
            height={64}
            className='h-8 w-auto object-contain select-none'
          />
          <h1 className='text-2xl font-semibold tracking-tight text-white sm:text-3xl'>
            {isZh ? '关于 TOKEX' : 'About TOKEX'}
          </h1>
          <p className='max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base'>
            {isZh
              ? 'TOKEX 是面向开发者的 AI 模型 API 平台与预付费计算额度网关，通过兼容标准协议为开发者提供透明定价、实时计量与稳定模型路由。本平台由 TOKEX 个人运营主体在自有账户体系内独立运营，不提供第三方消费端官方账号或会员代充服务。'
              : 'TOKEX is a developer-oriented AI API platform and prepaid compute-credits gateway delivering transparent per-model pricing, real-time usage metering, and standards-compatible API access. Operated independently by TOKEX Individual Operator exclusively on TOKEX’s own platform — never reselling or topping up third-party consumer accounts or memberships.'}
          </p>
        </div>

        <div className='grid gap-3 text-left sm:grid-cols-3'>
          <div className='tokex-glass rounded-xl border border-white/10 bg-[#050506]/90 p-4'>
            <div className='flex items-center gap-2 text-sm font-semibold text-white'>
              <Sparkles className='size-4 text-zinc-300' />
              <span>{isZh ? '预付费计算额度' : 'Prepaid Credits'}</span>
            </div>
            <p className='mt-2 text-xs leading-5 text-zinc-400'>
              {isZh
                ? '美元计价，按实际 Token 消耗计费；账户正常有效期间，已购计算额度永久有效。'
                : 'USD-denominated pay-as-you-go token billing. Purchased credits never expire while your account stays active.'}
            </p>
          </div>

          <div className='tokex-glass rounded-xl border border-white/10 bg-[#050506]/90 p-4'>
            <div className='flex items-center gap-2 text-sm font-semibold text-white'>
              <CreditCard className='size-4 text-zinc-300' />
              <span>{LEGAL_CONFIG.paymentProcessor} MoR</span>
            </div>
            <p className='mt-2 text-xs leading-5 text-zinc-400'>
              {isZh
                ? 'PCI-DSS 合规支付处理，TOKEX 不存储任何银行卡信息，零消耗额度购入 24 小时内支持全额退款。'
                : 'PCI-DSS compliant checkout with local tax handling and zero card storage on TOKEX servers. Unused credits refundable within 24 hours.'}
            </p>
          </div>

          <div className='tokex-glass rounded-xl border border-white/10 bg-[#050506]/90 p-4'>
            <div className='flex items-center gap-2 text-sm font-semibold text-white'>
              <ShieldCheck className='size-4 text-zinc-300' />
              <span>{isZh ? '安全与合规保障' : 'Safety & Support'}</span>
            </div>
            <p className='mt-2 text-xs leading-5 text-zinc-400'>
              {isZh
                ? '安全规范全面对齐 Waffo、Anthropic 与 OpenAI 政策；所有咨询与合规请求请联络 support@tokex.vip。'
                : 'Usage safeguards aligned with Waffo, Anthropic, and OpenAI policies. Support and compliance inquiries: support@tokex.vip.'}
            </p>
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-center gap-2.5 border-t border-white/[0.08] pt-5 text-xs'>
          <Link
            to='/pricing'
            className='inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white px-3.5 py-1.5 font-medium text-black transition-colors hover:bg-zinc-200'
          >
            <span>{isZh ? '查看模型定价' : 'View Pricing'}</span>
          </Link>
          <Link
            to='/terms'
            className='inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#050506] px-3.5 py-1.5 text-zinc-300 transition-colors hover:border-white/20 hover:text-white'
          >
            <FileText className='size-3.5' />
            <span>{isZh ? '服务条款' : 'Terms of Service'}</span>
          </Link>
          <Link
            to='/privacy-policy'
            className='inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#050506] px-3.5 py-1.5 text-zinc-300 transition-colors hover:border-white/20 hover:text-white'
          >
            <FileText className='size-3.5' />
            <span>{isZh ? '隐私政策' : 'Privacy Policy'}</span>
          </Link>
          <Link
            to='/aup'
            className='inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#050506] px-3.5 py-1.5 text-zinc-300 transition-colors hover:border-white/20 hover:text-white'
          >
            <ShieldCheck className='size-3.5' />
            <span>{isZh ? '可接受使用政策' : 'Acceptable Use'}</span>
          </Link>
          <a
            href={`mailto:${LEGAL_CONFIG.supportEmail}`}
            className='inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#050506] px-3.5 py-1.5 text-zinc-300 transition-colors hover:border-white/20 hover:text-white'
          >
            <Mail className='size-3.5' />
            <span>{LEGAL_CONFIG.supportEmail}</span>
          </a>
        </div>

        <p className='text-center text-xs text-zinc-500'>
          &copy; {currentYear} {LEGAL_CONFIG.brandName}.{' '}
          {isZh ? '保留所有权利。' : 'All rights reserved.'}
        </p>
      </div>
    </div>
  )
}

export function About() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['about-content'],
    queryFn: async () => requireServerSuccess(await getAboutContent()),
  })

  const rawContent = data?.data?.trim() ?? ''
  const hasContent = rawContent.length > 0
  const isUrl = hasContent && isHttpUrl(rawContent)
  const contentIsHtml = hasContent && isLikelyHtml(rawContent)

  if (isLoading) {
    return (
      <PublicLayout>
        <div className='mx-auto flex max-w-4xl flex-col gap-4 py-12'>
          <Skeleton className='h-8 w-[45%]' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[80%]' />
        </div>
      </PublicLayout>
    )
  }

  if (!hasContent) {
    return (
      <PublicLayout>
        <AboutOverviewState />
      </PublicLayout>
    )
  }

  if (isUrl) {
    return (
      <PublicLayout showMainContainer={false}>
        <iframe
          src={rawContent}
          className='h-[calc(100vh-3.5rem)] w-full border-0'
          title={t('About')}
          sandbox='allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts'
        />
      </PublicLayout>
    )
  }

  if (contentIsHtml) {
    return (
      <PublicLayout showMainContainer={false}>
        <RichContent
          mode='html'
          htmlVariant='isolated'
          content={rawContent}
          className='prose-neutral dark:prose-invert max-w-none'
        />
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className='mx-auto max-w-6xl px-4 py-8'>
        <RichContent
          mode='markdown'
          content={rawContent}
          className='prose-neutral dark:prose-invert max-w-none'
        />
      </div>
    </PublicLayout>
  )
}
