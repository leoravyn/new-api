import type { BilingualLegalDocument } from '../types'
import { LEGAL_CONFIG } from './legal-config'

export const PRIVACY_POLICY_CONTENT: BilingualLegalDocument = {
  en: {
    id: 'privacy',
    title: 'Privacy Policy',
    subtitle:
      'How TOKEX collects, uses, protects, and retains personal data across our website, API gateway, and checkout.',
    badge: 'Privacy & Data Protection',
    summaryPoints: [
      {
        label: 'Data Controller',
        value: `Operator of TOKEX (${LEGAL_CONFIG.siteUrl})`,
      },
      {
        label: 'Data Sale Policy',
        value: 'We never sell, rent, or trade your personal information',
      },
      {
        label: 'Payment Card Handling',
        value: `${LEGAL_CONFIG.paymentProcessor} processes payments (zero card details stored)`,
      },
      {
        label: 'Privacy Contact',
        value: { type: 'email', email: LEGAL_CONFIG.supportEmail },
      },
    ],
    sections: [
      {
        id: 'controller-scope',
        number: '1',
        title: 'Data Controller and Scope',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'The operator of TOKEX (',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              ') is the data controller for this Platform. This Privacy Policy explains how we collect, use, and safeguard your personal data when providing API gateway and compute credit purchasing services. For any privacy inquiries or account deletion requests, please contact ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' from your registered email address.',
            ],
          },
        ],
      },
      {
        id: 'data-categories',
        number: '2',
        title: 'Categories of Data Collected',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'We collect only the minimum data required to operate our services: Account and authentication data, including your email address, username, salted cryptographic password hash, optional GitHub or Google OAuth identifiers, and Passkey public key metadata; Order and billing records, including transaction IDs, USD-denominated amounts, credited compute credits, and payment status transmitted by ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              ' (TOKEX neither accesses nor stores any sensitive payment card details); Technical and usage logs, including IP addresses, request headers, requested model names, token consumption, HTTP status codes, and necessary request context retained transiently for anti-abuse auditing when security rules are triggered.',
            ],
          },
        ],
      },
      {
        id: 'purposes-sharing',
        number: '3',
        title: 'Purposes of Processing and Sharing Boundaries',
        blocks: [
          {
            type: 'paragraph',
            content:
              'We process the above data strictly for account authentication, API gateway routing, accurate billing calculation, prevention of cyberattacks and payment fraud, delivery of essential transactional emails such as verification codes and security alerts (via Resend), and baseline content safety screening. TOKEX never sells, rents, or trades your personal information to any third party, nor do we share data for cross-site behavioral advertising.',
          },
        ],
      },
      {
        id: 'cookies-local-storage',
        number: '4',
        title: 'Cookies and Local Storage',
        blocks: [
          {
            type: 'paragraph',
            content:
              'This website uses only strictly necessary cookies to maintain login sessions, execute Cloudflare Turnstile bot verification, and prevent cross-site request forgery, alongside browser local storage to preserve your interface language and display theme preferences. We do not deploy any third-party advertising trackers.',
          },
        ],
      },
      {
        id: 'third-party-providers',
        number: '5',
        title: 'Third-Party Infrastructure Providers',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'To maintain Platform operations, we interact with third-party service providers solely within technical necessity: ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              ' as Merchant of Record (for payment settlement and tax compliance), upstream AI model providers (for inference execution, which may briefly retain API requests for abuse monitoring under their respective policies), Resend (for transactional email delivery), Cloudflare (for CDN routing, DDoS mitigation, and human verification), and your chosen OAuth identity providers.',
            ],
          },
        ],
      },
      {
        id: 'security-retention',
        number: '6',
        title: 'Data Security and Retention',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'We implement TLS encryption in transit, salted password hashing, and granular access controls to protect your data, though we cannot guarantee absolute security against force majeure or third-party infrastructure failures. Basic account data is retained while your account remains active. Upon verified account deletion via ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ', routine profile data and technical logs will be deleted or anonymized within a reasonable timeframe, except for records required to be retained on an ongoing basis for unresolved billing disputes, anti-fraud enforcement audits, and financial reconciliation.',
            ],
          },
        ],
      },
      {
        id: 'rights-updates-language',
        number: '7',
        title: 'Your Rights, Policy Updates, and Governing Language',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'You may contact ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' from your registered email address to access, rectify, or request deletion of your account information. TOKEX may update this Privacy Policy at any time as operational or compliance needs require, with updates taking effect immediately upon posting. In the event of any discrepancy between the English and translated versions, the English version shall prevail.',
            ],
          },
        ],
      },
    ],
  },
  zhCN: {
    id: 'privacy',
    title: '隐私政策',
    subtitle:
      '说明 TOKEX 在提供 API 网关与计算额度购买服务时如何处理、保护及留存您的个人数据。',
    badge: '隐私与数据保护',
    summaryPoints: [
      {
        label: '数据控制者',
        value: `TOKEX 运营方（${LEGAL_CONFIG.siteUrl}）`,
      },
      {
        label: '数据共享原则',
        value: '绝不出售、出租或交易您的个人信息',
      },
      {
        label: '支付卡信息处理',
        value: `${LEGAL_CONFIG.paymentProcessor} 独立处理（平台不存储卡号与 CVV）`,
      },
      {
        label: '隐私联系邮箱',
        value: { type: 'email', email: LEGAL_CONFIG.supportEmail },
      },
    ],
    sections: [
      {
        id: 'controller-scope',
        number: '1',
        title: '数据控制者与适用范围',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'TOKEX 运营方（',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              '）是本平台的数据控制者。本政策说明我们在提供 API 网关与计算额度购买服务时如何处理您的个人数据。如有任何隐私相关疑问或注销申请，请通过注册邮箱联系 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '。',
            ],
          },
        ],
      },
      {
        id: 'data-categories',
        number: '2',
        title: '我们收集的数据类别',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '我们在为您提供服务所需的最小范围内收集以下数据：账号注册与认证数据，包括邮箱地址、用户名、加密哈希密码、可选的 GitHub 或 Google OAuth 标识以及 Passkey 公钥凭证元数据；订单与结算记录，包括由 ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              ' 回传的订单号、美元计价金额、交付的计算额度及支付状态（TOKEX 不接触也不存储任何银行卡敏感信息）；技术与调用日志，包括访问 IP 地址、请求头信息、调用模型名称、Token 消耗量、HTTP 状态码，以及在触发安全风控规则时用于反滥用审计的必要请求上下文。',
            ],
          },
        ],
      },
      {
        id: 'purposes-sharing',
        number: '3',
        title: '数据使用目的与共享边界',
        blocks: [
          {
            type: 'paragraph',
            content:
              '我们收集上述数据仅用于账户鉴权、API 网关路由、精确计费核算、防止恶意攻击与支付欺诈、发送验证码及安全提醒等必要系统通知（通过 Resend 发送），以及履行基本的内容安全风控审查。TOKEX 绝不向任何第三方出售、出租或交易您的个人信息，也不会出于跨站广告追踪目的共享您的数据。',
          },
        ],
      },
      {
        id: 'cookies-local-storage',
        number: '4',
        title: 'Cookie 与本地存储',
        blocks: [
          {
            type: 'paragraph',
            content:
              '本网站仅使用维持登录会话、执行 Cloudflare Turnstile 人机验证及防止跨站请求伪造的必要 Cookie，以及用于在您浏览器本地保存界面语言与显示主题偏好的本地存储。我们不使用任何第三方广告追踪代码。',
          },
        ],
      },
      {
        id: 'third-party-providers',
        number: '5',
        title: '第三方基础设施服务商',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '为维持平台运转，我们仅在技术必需范围内与以下第三方服务商进行数据交互：记录商户 ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              '（处理订单结算与税务）、第三方上游 AI 模型供应商（执行模型推理计算，其可能依据自身安全政策对接口请求进行短暂的滥用监测留存）、邮件服务商 Resend（投递系统验证码与通知）、网络与安全服务商 Cloudflare（提供 CDN 加速、DDoS 防护与人机校验）以及您主动选用的 OAuth 登录认证提供商。',
            ],
          },
        ],
      },
      {
        id: 'security-retention',
        number: '6',
        title: '数据安全与留存周期',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '我们采用 TLS 传输加密、加盐密码哈希与细粒度权限控制保护数据安全，但受限于互联网技术特性，我们不对不可抗力或第三方基础设施故障导致的数据异常承担绝对担保。账户正常存续期间我们将保留您的基础资料；当您通过 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' 申请并完成账户注销后，常规账号资料与技术日志将在合理期限内删除或匿名化处理，但涉及未结账单争议、反欺诈风控审计及财务对账所需的记录将按业务与审计需要持续保留。',
            ],
          },
        ],
      },
      {
        id: 'rights-updates-language',
        number: '7',
        title: '您的权利、政策更新与语言效力',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '您有权通过注册邮箱联系 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' 查询、更正您的账户信息或申请注销账户。TOKEX 有权根据业务与合规需要随时更新本隐私政策，更新内容在网站发布后即刻生效。本政策如中英文版本存在任何歧义，一概以英文版本为准。',
            ],
          },
        ],
      },
    ],
  },
}
