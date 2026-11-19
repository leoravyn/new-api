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
export type LegalDocumentResponse = {
  success: boolean
  message?: string
  data?: string
}

export type LegalDocumentId = 'terms' | 'privacy' | 'aup'

export type LegalRoutePath =
  | '/terms'
  | '/user-agreement'
  | '/privacy-policy'
  | '/aup'
  | '/pricing'

export type LegalTextRun =
  | string
  | {
      type: 'strong'
      text: string
    }
  | {
      type: 'link'
      label: string
      to: LegalRoutePath
    }
  | {
      type: 'email'
      email: string
      label?: string
    }
  | {
      type: 'external'
      label: string
      href: string
    }

export type LegalRichText = LegalTextRun | readonly LegalTextRun[]

export type LegalBlock =
  | {
      type: 'paragraph'
      content: LegalRichText
    }
  | {
      type: 'list'
      ordered?: boolean
      items: readonly LegalRichText[]
    }
  | {
      type: 'callout'
      tone?: 'info' | 'warning'
      title?: string
      content: LegalRichText
    }
  | {
      type: 'table'
      headers: readonly string[]
      rows: readonly (readonly LegalRichText[])[]
    }

export type LegalSection = {
  id: string
  number: string
  title: string
  blocks: readonly LegalBlock[]
}

export type LegalDocumentLocaleContent = {
  id: LegalDocumentId
  title: string
  subtitle: string
  badge: string
  summaryPoints: readonly {
    label: string
    value: LegalRichText
  }[]
  sections: readonly LegalSection[]
}

export type BilingualLegalDocument = {
  zhCN: LegalDocumentLocaleContent
  en: LegalDocumentLocaleContent
}
