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
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { RichContent } from '@/components/rich-content'
import { Skeleton } from '@/components/ui/skeleton'
import { isHttpUrl, isLikelyHtml } from '@/lib/content-format'
import { requireServerSuccess } from '@/lib/server-error-message'

import { getAboutContent } from './api'

function EmptyAboutState() {
  const currentYear = new Date().getFullYear()

  return (
    <div className='flex min-h-[65vh] items-center justify-center p-6 sm:p-10'>
      <div className='tokex-glass-elevated max-w-2xl space-y-6 rounded-2xl p-8 text-center sm:p-10'>
        <div className='mx-auto flex size-14 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-500/10 text-xl font-bold tracking-tight text-sky-300'>
          TX
        </div>
        <div className='space-y-3'>
          <h1 className='text-2xl font-bold tracking-tight text-white sm:text-3xl'>
            TOKEX · Enterprise Multi-Model AI Gateway
          </h1>
          <p className='text-sm leading-relaxed text-slate-300 sm:text-base'>
            TOKEX 致力于为企业与开发者构建高可用、低时延、合规可控的多模型人工智能基础设施底座。通过单一标准协议连接全球前沿模型，全面赋能研发提效与商业智能化升级。
          </p>
        </div>
        <div className='grid gap-3 pt-2 text-left sm:grid-cols-3'>
          <div className='tokex-glass rounded-xl p-4'>
            <div className='font-mono text-base font-semibold text-white'>
              99.99% SLA
            </div>
            <div className='mt-1 text-xs text-slate-400'>
              多线容灾高可用调度
            </div>
          </div>
          <div className='tokex-glass rounded-xl p-4'>
            <div className='font-mono text-base font-semibold text-white'>
              Zero-Retention
            </div>
            <div className='mt-1 text-xs text-slate-400'>
              数据隐私与安全审计
            </div>
          </div>
          <div className='tokex-glass rounded-xl p-4'>
            <div className='font-mono text-base font-semibold text-white'>
              FinOps Ready
            </div>
            <div className='mt-1 text-xs text-slate-400'>
              透明计量与分权配额
            </div>
          </div>
        </div>
        <p className='border-t border-white/[0.08] pt-4 text-xs text-slate-400'>
          © {currentYear} TOKEX AI Infrastructure. All rights reserved.
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
        <EmptyAboutState />
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
