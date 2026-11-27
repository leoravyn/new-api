import { useTranslation } from 'react-i18next'

import {
  INTERFACE_LANGUAGE_OPTIONS,
  normalizeInterfaceLanguage,
} from '@/i18n/languages'
import { cn } from '@/lib/utils'

const SHORT_LABELS: Record<string, string> = {
  zhCN: '中文',
  en: 'EN',
}

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const currentLang = normalizeInterfaceLanguage(
    i18n.resolvedLanguage || i18n.language
  )

  return (
    <div
      role='group'
      aria-label={t('Switch language')}
      className='inline-flex h-8 items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-0.5 backdrop-blur-md'
    >
      {INTERFACE_LANGUAGE_OPTIONS.map((lang) => {
        const isActive = currentLang === lang.code
        const shortLabel = SHORT_LABELS[lang.code] ?? lang.label

        return (
          <button
            key={lang.code}
            type='button'
            onClick={() => {
              if (!isActive) {
                void i18n.changeLanguage(lang.code)
              }
            }}
            aria-label={lang.label}
            aria-pressed={isActive}
            className={cn(
              'cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium tracking-tight transition-all duration-200',
              isActive
                ? 'bg-white/[0.14] text-white ring-1 ring-white/[0.12]'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            {shortLabel}
          </button>
        )
      })}
    </div>
  )
}
