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

export type DocsSectionId =
  | 'rules'
  | 'codex'
  | 'claude-code'
  | 'clients'
  | 'sdk'
  | 'troubleshooting'

export interface DocsEndpointItem {
  endpoint: string
  recommendedFor: string
  baseUrlNote: string
}

export interface DocsKvRow {
  label: string
  value: string
  copyable?: boolean
  hint?: string
}

export interface DocsTroubleshootItem {
  code: string
  title: string
  detail: string
}

export interface DocsSdkExample {
  id: 'python' | 'curl'
  label: string
  language: string
  filename: string
  code: string
}

export interface DocsContentLocale {
  badge: string
  title: string
  subtitle: string
  tocTitle: string
  mobileTocLabel: string
  baseUrlLabel: string
  quickLinksLabel: string
  copyLabel: string
  copiedLabel: string
  sections: {
    id: DocsSectionId
    number: string
    title: string
    summary: string
  }[]
  rules: {
    endpointsTitle: string
    endpoints: DocsEndpointItem[]
    groupsTitle: string
    groupsNotice: string
    guidelinesTitle: string
    guidelines: string[]
  }
  codex: {
    groupNote: string
    step1Title: string
    step1Command: string
    step2Title: string
    step2Command: string
    step2PersistLabel: string
    step2PersistCommand: string
    footerNote: string
  }
  claudeCode: {
    groupNote: string
    runTitle: string
    runCommand: string
    persistTitle: string
    persistCommand: string
    envNote: string
  }
  clients: {
    intro: string
    configTitle: string
    configRows: DocsKvRow[]
    pathNote: string
  }
  sdk: {
    intro: string
    examples: DocsSdkExample[]
    groupNote: string
  }
  troubleshooting: {
    items: DocsTroubleshootItem[]
  }
  resources: {
    title: string
    subtitle: string
    platformLinks: {
      label: string
      to: '/pricing' | '/keys' | '/wallet'
    }[]
    legalLinks: {
      label: string
      to: '/terms' | '/privacy-policy' | '/aup' | '/about'
    }[]
  }
}
