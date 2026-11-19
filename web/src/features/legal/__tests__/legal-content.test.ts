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
  it('defines verified TOKEX details with zero placeholders', () => {
    expect(LEGAL_CONFIG.brandName).toBe('TOKEX')
    expect(LEGAL_CONFIG.siteUrl).toBe('https://tokex.vip')
    expect(LEGAL_CONFIG.supportEmail).toBe('support@tokex.vip')
    expect(LEGAL_CONFIG.operatorName).toBe('TOKEX Individual Operator')
    expect(LEGAL_CONFIG.governingLawEn).toBe('State of Delaware, United States')
    expect(LEGAL_CONFIG.effectiveDate).toBe('2026-11-19')
    expect(LEGAL_CONFIG.paymentProcessor).toBe('Waffo Pancake')
  })

  it.each([
    ['Terms en', TERMS_OF_SERVICE_CONTENT.en],
    ['Terms zhCN', TERMS_OF_SERVICE_CONTENT.zhCN],
    ['Privacy en', PRIVACY_POLICY_CONTENT.en],
    ['Privacy zhCN', PRIVACY_POLICY_CONTENT.zhCN],
    ['AUP en', AUP_CONTENT.en],
    ['AUP zhCN', AUP_CONTENT.zhCN],
  ])('%s contains zero template bracket placeholders', (_name, docContent) => {
    const fullText = collectAllDocumentText(docContent)
    expect(fullText).not.toMatch(/\[[A-Za-z0-9_\s/+.-]{2,}\]/)
    expect(fullText).not.toContain('PLACEHOLDER')
    expect(fullText).not.toContain('support@quantumnous.com')
  })

  it('covers all Waffo ToS V2 credit/MoR/24h-refund requirements without subscription clauses', () => {
    const enText = collectAllDocumentText(TERMS_OF_SERVICE_CONTENT.en)
    const zhText = collectAllDocumentText(TERMS_OF_SERVICE_CONTENT.zhCN)

    expect(TERMS_OF_SERVICE_CONTENT.en.sections).toHaveLength(16)
    expect(TERMS_OF_SERVICE_CONTENT.zhCN.sections).toHaveLength(16)

    // No subscription / auto-renew billing offerings
    expect(enText).not.toMatch(/auto-?renewing subscription/i)
    expect(enText).toMatch(/no recurring subscription/i)

    // Key entities & rules
    for (const pattern of [
      /TOKEX Individual Operator/,
      /Waffo Pancake/,
      /PCI-DSS/,
      /support@tokex\.vip/,
      /does NOT sell, resell, proxy, activate, or top up third-party consumer AI accounts/i,
      /never expire/i,
      /24 hours/,
      /mandatory statutory consumer protection/i,
      /Multiple \/ Repeat Top-Up Orders/i,
      /2 business days/,
      /5 business days/,
      /does NOT use your API Inputs or Outputs to train/i,
      /90 days/,
      /12 MONTHS/i,
      /State of Delaware, United States/,
      /14 days/,
    ]) {
      expect(enText).toMatch(pattern)
    }

    for (const pattern of [
      /Waffo Pancake/,
      /support@tokex\.vip/,
      /绝对不提供任何第三方官方消费端 AI 账号或会员的代开通、代充值/,
      /长期有效/,
      /24 小时内/,
      /法定消费者不可放弃权益保留/,
      /用户多次\/误操作重复充值与技术性重复扣款之区分/,
      /美国特拉华州法律/,
    ]) {
      expect(zhText).toMatch(pattern)
    }
  })

  it('covers all 14 Privacy Policy sections and subprocessors in en and zhCN', () => {
    const enText = collectAllDocumentText(PRIVACY_POLICY_CONTENT.en)
    const zhText = collectAllDocumentText(PRIVACY_POLICY_CONTENT.zhCN)

    expect(PRIVACY_POLICY_CONTENT.en.sections).toHaveLength(14)
    expect(PRIVACY_POLICY_CONTENT.zhCN.sections).toHaveLength(14)

    for (const pattern of [
      /Waffo Pancake/,
      /Anthropic/,
      /OpenAI/,
      /Resend/,
      /Cloudflare/,
      /GitHub/,
      /Google/,
      /Do Not Sell Personal Information/i,
      /72 hours/,
      /90 days/,
      /5–7 years/,
      /30 calendar days/,
      /Standard Contractual Clauses/,
      /18 years/,
      /15 days/,
      /09:00 – 18:00 \(UTC\+8\)/,
    ]) {
      expect(enText).toMatch(pattern)
    }

    expect(zhText).toMatch(/绝不出售您的个人信息/)
    expect(zhText).toMatch(/30 个日历日内/)
  })

  it('covers all 10 AUP sections aligned with Waffo, Anthropic, and OpenAI policies', () => {
    const enText = collectAllDocumentText(AUP_CONTENT.en)
    const zhText = collectAllDocumentText(AUP_CONTENT.zhCN)

    expect(AUP_CONTENT.en.sections).toHaveLength(10)
    expect(AUP_CONTENT.zhCN.sections).toHaveLength(10)

    for (const pattern of [
      /Pornography, Sexually Explicit Content \(NSFW\) & NCII/,
      /Violence, Gore, Terrorism & Self-Harm/,
      /Hate Speech, Harassment & Doxxing/,
      /Child Safety & CSAM \/ CSAE/,
      /NCMEC/,
      /Deepfakes & Non-Consensual Real-Person Impersonation/,
      /Copyright, Trademark, IP Infringement & Plagiarism/,
      /CBRN \/ CBRNE/,
      /Cyberattacks, Malware & Critical Infrastructure/,
      /Biometric Scraping & Criminal-Justice Scoring/i,
      /Election Interference/,
      /Jailbreaking/i,
      /Model Distillation/i,
      /Qualified Human-in-the-Loop Review/,
      /Within 2 hours/,
      /Within 24 hours/,
      /Within 3 business days/,
      /Within 7 business days/,
      /Within 15 business days/,
      /Independent Appeals/,
    ]) {
      expect(enText).toMatch(pattern)
    }

    expect(zhText).toMatch(/六大强制禁止内容类别/)
    expect(zhText).toMatch(/Anthropic 与 OpenAI/)
    expect(zhText).toMatch(/独立申诉复核流程/)
  })
})
