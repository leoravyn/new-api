export const LEGAL_CONFIG = {
  brandName: 'TOKEX',
  siteUrl: 'https://tokex.vip',
  /**
   * Individual / Sole Proprietor operator display name.
   * Per Waffo KYB guidelines for individual / sole-trader accounts, no
   * personal street address is published. If Waffo KYB requires your verified
   * KYC legal full name to appear explicitly in legal disclosures, update
   * `operatorName` and `operatorNameZh` here.
   */
  operatorName: 'TOKEX Individual Operator',
  operatorNameZh: 'TOKEX 个人运营主体（Individual Operator）',
  operatorTypeEn: 'Individual / Sole Proprietor',
  operatorTypeZh: '个人 / 独立开发者运营主体（Individual / Sole Proprietor）',
  supportEmail: 'support@tokex.vip',
  effectiveDate: '2026-11-19',
  lastUpdated: '2026-11-19',
  governingLawEn: 'State of Delaware, United States',
  governingLawZh: '美国特拉华州法律（State of Delaware, United States）',
  paymentProcessor: 'Waffo Pancake',
  minimumAge: 18,
  unusedCreditRefundHours: 24,
  billingAckBusinessDays: 2,
  billingResolutionBusinessDays: 5,
  postDeletionRetentionDays: 90,
  taxRecordRetentionYears: '5–7',
  breachNoticeHours: 72,
  gdprResponseDays: 30,
  tosChangeNoticeDays: 14,
  privacyChangeNoticeDays: 15,
  liabilityCapMonths: 12,
  businessHoursEn: 'Monday – Friday, 09:00 – 18:00 (UTC+8)',
  businessHoursZh: '周一至周五 09:00 – 18:00 (UTC+8)',
  routes: {
    terms: '/terms',
    userAgreement: '/user-agreement',
    privacyPolicy: '/privacy-policy',
    aup: '/aup',
    pricing: '/pricing',
  },
} as const
