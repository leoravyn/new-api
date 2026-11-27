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
import { Terminal } from 'lucide-react'

import { CopyButton } from '@/components/copy-button'
import { cn } from '@/lib/utils'

interface DocsCodeBlockProps {
  code: string
  title?: string
  language?: string
  copyLabel?: string
  copiedLabel?: string
  className?: string
}

export function DocsCodeBlock({
  code,
  title,
  language,
  copyLabel,
  copiedLabel,
  className,
}: DocsCodeBlockProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-white/10 bg-[#08080a] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]',
        className
      )}
    >
      <div className='flex items-center justify-between gap-2 border-b border-white/[0.08] bg-[#141418] px-3.5 py-2'>
        <div className='flex min-w-0 items-center gap-2 text-xs text-zinc-400'>
          <Terminal className='size-3.5 shrink-0 text-zinc-500' />
          <span className='truncate font-mono text-zinc-200'>
            {title || language || 'snippet'}
          </span>
        </div>
        <CopyButton
          value={code}
          variant='ghost'
          size='icon'
          className='size-7 rounded-lg text-zinc-400 hover:bg-white/[0.08] hover:text-white'
          iconClassName='size-3.5'
          tooltip={copyLabel}
          successTooltip={copiedLabel}
          aria-label={copyLabel}
        />
      </div>
      <pre className='overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-6 text-zinc-200'>
        <code>{code}</code>
      </pre>
    </div>
  )
}
