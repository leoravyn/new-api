import { describe, expect, it } from 'vitest'

import { AUP_CONTENT } from '../content/aup'
import { LEGAL_CONFIG } from '../content/legal-config'
import { PRIVACY_POLICY_CONTENT } from '../content/privacy-policy'
import { TERMS_OF_SERVICE_CONTENT } from '../content/terms'
import type { LegalDocumentLocaleContent, LegalRichText } from '../types'

function extractRichText(value: LegalRichText): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value.map((item) => extractRichText(item)).join('')
  }
  if ('text' in value) return value.text
  if ('label' in value && value.label) return value.label
  if ('email' in value) return value.email
  return ''
}

function collectAllDocumentText(doc: LegalDocumentLocaleContent): string {
  const parts: string[] = [doc.title, doc.subtitle, doc.badge]
  for (const point of doc.summaryPoints) {
    parts.push(point.label, extractRichText(point.value))
  }
  for (const section of doc.sections) {
    parts.push(section.number, section.title)
    for (const block of section.blocks) {
      switch (block.type) {
        case 'paragraph':
          parts.push(extractRichText(block.content))
          break
        case 'list':
          for (const item of block.items) {
            parts.push(extractRichText(item))
          }
          break
        case 'callout':
          if (block.title) parts.push(block.title)
          parts.push(extractRichText(block.content))
          break
        case 'table':
          parts.push(...block.headers)
          for (const row of block.rows) {
            for (const cell of row) {
              parts.push(extractRichText(cell))
            }
          }
          break
      }
    }
  }
  return parts.join('\n')
}

describe('legal-config and compliance content integrity', () => {
  it('defines verified TOKEX details with zero placeholders or Delaware references', () => {
    expect(LEGAL_CONFIG.brandName).toBe('TOKEX')
    expect(LEGAL_CONFIG.siteUrl).toBe('https://tokex.vip')
    expect(LEGAL_CONFIG.supportEmail).toBe('support@tokex.vip')
    expect(LEGAL_CONFIG.lastUpdated).toBe('2026-11-22')
    expect(LEGAL_CONFIG.governingLawEn).toBe(
      'Hong Kong Special Administrative Region'
    )
    expect(LEGAL_CONFIG.governingLawZh).toBe('中华人民共和国香港特别行政区法律')
    expect(LEGAL_CONFIG.paymentProcessor).toBe('Waffo Pancake')
  })

  it.each([
    ['Terms en', TERMS_OF_SERVICE_CONTENT.en],
    ['Terms zhCN', TERMS_OF_SERVICE_CONTENT.zhCN],
    ['Privacy en', PRIVACY_POLICY_CONTENT.en],
    ['Privacy zhCN', PRIVACY_POLICY_CONTENT.zhCN],
    ['AUP en', AUP_CONTENT.en],
    ['AUP zhCN', AUP_CONTENT.zhCN],
  ])(
    '%s contains zero placeholders and no US/Delaware regulatory references',
    (_name, docContent) => {
      const fullText = collectAllDocumentText(docContent)
      expect(fullText).not.toMatch(/\[[A-Za-z0-9_\s/+.-]{2,}\]/)
      expect(fullText).not.toContain('PLACEHOLDER')
      expect(fullText).not.toContain('support@quantumnous.com')
      expect(fullText).not.toMatch(/Delaware|特拉华/i)
      expect(fullText).not.toMatch(/NCMEC|CCPA|CPRA|FTC|SEC\b/i)
    }
  )

  it('covers all 10 Terms of Service sections in en and zhCN', () => {
    const enText = collectAllDocumentText(TERMS_OF_SERVICE_CONTENT.en)
    const zhText = collectAllDocumentText(TERMS_OF_SERVICE_CONTENT.zhCN)

    expect(TERMS_OF_SERVICE_CONTENT.en.sections).toHaveLength(10)
    expect(TERMS_OF_SERVICE_CONTENT.zhCN.sections).toHaveLength(10)

    for (const pattern of [
      /https:\/\/tokex\.vip/,
      /support@tokex\.vip/,
      /Waffo Pancake/,
      /outside Mainland China/i,
      /non-refundable/i,
      /10% administrative and account settlement fee/i,
      /three \(3\) months/i,
      /Hong Kong Special Administrative Region/,
      /Hong Kong International Arbitration Centre \(HKIAC\)/,
    ]) {
      expect(enText).toMatch(pattern)
    }

    for (const pattern of [
      /https:\/\/tokex\.vip/,
      /support@tokex\.vip/,
      /Waffo Pancake/,
      /不向中国大陆境内提供服务/,
      /绝对不提供任何第三方官方消费端 AI 账号或会员的代开通、代充值、合租或转售服务/,
      /扣除 10% 作为账户清算与行政管理手续费/,
      /3 个月/,
      /中华人民共和国香港特别行政区法律/,
      /香港国际仲裁中心（HKIAC）/,
    ]) {
      expect(zhText).toMatch(pattern)
    }
  })

  it('covers all 7 Privacy Policy sections in en and zhCN', () => {
    const enText = collectAllDocumentText(PRIVACY_POLICY_CONTENT.en)
    const zhText = collectAllDocumentText(PRIVACY_POLICY_CONTENT.zhCN)

    expect(PRIVACY_POLICY_CONTENT.en.sections).toHaveLength(7)
    expect(PRIVACY_POLICY_CONTENT.zhCN.sections).toHaveLength(7)

    for (const pattern of [
      /https:\/\/tokex\.vip/,
      /support@tokex\.vip/,
      /Waffo Pancake/,
      /Resend/,
      /Cloudflare/,
      /GitHub/,
      /Google/,
      /never sells, rents, or trades your personal information/i,
    ]) {
      expect(enText).toMatch(pattern)
    }

    for (const pattern of [
      /https:\/\/tokex\.vip/,
      /support@tokex\.vip/,
      /Waffo Pancake/,
      /Resend/,
      /Cloudflare/,
      /绝不向任何第三方出售、出租或交易您的个人信息/,
    ]) {
      expect(zhText).toMatch(pattern)
    }
  })

  it('covers all 6 AUP sections in en and zhCN', () => {
    const enText = collectAllDocumentText(AUP_CONTENT.en)
    const zhText = collectAllDocumentText(AUP_CONTENT.zhCN)

    expect(AUP_CONTENT.en.sections).toHaveLength(6)
    expect(AUP_CONTENT.zhCN.sections).toHaveLength(6)

    for (const pattern of [
      /CSAM\/CSAE/,
      /NCII/,
      /Deepfakes/i,
      /jailbreak/i,
      /distill/i,
      /seven \(7\) calendar days/i,
      /support@tokex\.vip/,
    ]) {
      expect(enText).toMatch(pattern)
    }

    for (const pattern of [
      /CSAM\/CSAE/,
      /NCII/,
      /Deepfakes/,
      /越狱提示/,
      /7 个日历日内/,
      /support@tokex\.vip/,
    ]) {
      expect(zhText).toMatch(pattern)
    }
  })
})
