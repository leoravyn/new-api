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
        value: `${LEGAL_CONFIG.operatorName} (${LEGAL_CONFIG.operatorTypeEn})`,
      },
      {
        label: 'Data Sale Policy',
        value: 'We do NOT sell or rent personal information',
      },
      {
        label: 'Payment Card Handling',
        value: `${LEGAL_CONFIG.paymentProcessor} processes payments (zero card numbers stored on TOKEX)`,
      },
      {
        label: 'Privacy Contact',
        value: { type: 'email', email: LEGAL_CONFIG.supportEmail },
      },
    ],
    sections: [
      {
        id: 'controller',
        number: '1',
        title: 'Data Controller & Scope',
        blocks: [
          {
            type: 'paragraph',
            content: [
              { type: 'strong', text: LEGAL_CONFIG.operatorName },
              ' ("TOKEX", "we", or "us") is the data controller for personal data collected through ',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              '. For all privacy inquiries or data requests, contact ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '.',
            ],
          },
        ],
      },
      {
        id: 'data-collected',
        number: '2',
        title: 'Data We Collect',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Account Data: ' },
                'Email address, username, user ID, account status, hashed password (plaintext passwords are never stored), and optional GitHub or Google OAuth identifier and profile if you use OAuth sign-in.',
              ],
              [
                { type: 'strong', text: 'Security & Verification Data: ' },
                'WebAuthn / Passkey public-key metadata, email verification logs, and Cloudflare Turnstile anti-bot tokens.',
              ],
              [
                { type: 'strong', text: 'Order & Billing Metadata: ' },
                `Order ID, USD top-up amount, delivered credit quota, tax summary, and payment status from ${LEGAL_CONFIG.paymentProcessor}. TOKEX never collects or stores full card numbers or CVV codes.`,
              ],
              [
                { type: 'strong', text: 'API Usage & Technical Logs: ' },
                'IP address, user-agent, timestamps, model name, token counts, credit deduction, and HTTP status codes used for billing accuracy, rate limiting, and abuse prevention.',
              ],
            ],
          },
        ],
      },
      {
        id: 'legal-basis',
        number: '3',
        title: 'Purposes & Legal Bases',
        blocks: [
          {
            type: 'table',
            headers: ['Purpose', 'Data Categories', 'GDPR Art. 6 Legal Basis'],
            rows: [
              [
                'Account authentication & API gateway routing',
                'Email, username, hashed password, OAuth ID, API keys, usage logs',
                'Contract performance (Art. 6(1)(b))',
              ],
              [
                `Credit top-up checkout & tax compliance via ${LEGAL_CONFIG.paymentProcessor}`,
                'Account ID, email, order ID, USD amount, tax/payment status',
                'Contract performance (Art. 6(1)(b)) & Legal obligation (Art. 6(1)(c))',
              ],
              [
                'Rate limiting, bot defense (Turnstile), fraud & AUP enforcement',
                'IP address, request headers, security events',
                'Legitimate interests (Art. 6(1)(f)) & Legal obligation (Art. 6(1)(c))',
              ],
              [
                'Transactional emails (verification codes, password reset, alerts via Resend)',
                'Email address, notice metadata',
                'Contract performance (Art. 6(1)(b)) & Legitimate interests (Art. 6(1)(f))',
              ],
              [
                'UI language and theme preferences',
                'Browser local storage',
                'Legitimate interests (Art. 6(1)(f))',
              ],
            ],
          },
        ],
      },
      {
        id: 'cookies',
        number: '4',
        title: 'Cookies & Local Storage',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Strictly Necessary Cookies: ' },
                'Session authentication, Turnstile verification, and CSRF protection.',
              ],
              [
                { type: 'strong', text: 'Preference Storage: ' },
                'Local storage entries saving your interface language and theme.',
              ],
              [
                { type: 'strong', text: 'No Ad Tracking: ' },
                'TOKEX does not use third-party advertising cookies or cross-site behavioral tracking pixels.',
              ],
            ],
          },
        ],
      },
      {
        id: 'sharing-ccpa',
        number: '5',
        title: 'Data Sharing & Service Providers',
        blocks: [
          {
            type: 'callout',
            tone: 'info',
            title: 'We Do Not Sell Personal Information',
            content:
              'TOKEX does NOT sell, rent, or trade your personal information to third parties, nor share it for cross-context behavioral advertising (CCPA / CPRA).',
          },
          {
            type: 'table',
            headers: ['Provider', 'Role', 'Data Shared'],
            rows: [
              [
                LEGAL_CONFIG.paymentProcessor,
                'Merchant of Record (MoR) & PCI-DSS payment processor',
                'Order ID, email, USD amount, billing/tax confirmation',
              ],
              [
                'Upstream AI Providers (Anthropic, OpenAI)',
                'Model inference processing',
                'API prompts/inputs sent to generate responses (not used by TOKEX to train models)',
              ],
              [
                'Resend',
                'Transactional email delivery',
                'Email address and verification/security email content',
              ],
              [
                'Cloudflare',
                'DNS, CDN, DDoS protection & Turnstile anti-bot',
                'Network request metadata and Turnstile tokens',
              ],
              [
                'GitHub / Google (Optional)',
                'OAuth sign-in providers',
                'OAuth handshake tokens when selected by user',
              ],
            ],
          },
          {
            type: 'paragraph',
            content:
              'We may also disclose data where strictly required by valid legal process, fraud/chargeback defense, or mandatory child-safety reporting obligations.',
          },
        ],
      },
      {
        id: 'security-retention',
        number: '6',
        title: 'Data Security & Retention',
        blocks: [
          {
            type: 'paragraph',
            content: `We protect data using TLS encryption in transit, salted password hashing, scoped API key authentication, and access controls. If a confirmed data breach poses a material risk to your rights, we will notify affected users and applicable authorities within ${LEGAL_CONFIG.breachNoticeHours} hours where required by law.`,
          },
          {
            type: 'table',
            headers: ['Data Category', 'Retention Period'],
            rows: [
              [
                'Account Profile & Credentials',
                `Active account duration; deleted or anonymized within ${LEGAL_CONFIG.postDeletionRetentionDays} days after a verified deletion request`,
              ],
              [
                'Billing, Orders & Tax Records',
                `${LEGAL_CONFIG.taxRecordRetentionYears} years as required by applicable tax and accounting laws`,
              ],
              [
                'API Usage & Security Logs',
                `Deleted or anonymized within ${LEGAL_CONFIG.postDeletionRetentionDays} days after account deletion unless needed for an active dispute`,
              ],
              [
                'Support & Dispute Records',
                `Up to 24 months or ${LEGAL_CONFIG.postDeletionRetentionDays} days after account closure`,
              ],
            ],
          },
        ],
      },
      {
        id: 'gdpr-rights',
        number: '7',
        title: 'Your Privacy Rights',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'Depending on your jurisdiction, you have the right to access, correct, delete, restrict, or export your personal data, object to processing, request human review of automated enforcement, withdraw optional consent, and lodge a complaint with your local data protection authority. To exercise these rights, email ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' from your registered email address; we respond within ',
              {
                type: 'strong',
                text: `${LEGAL_CONFIG.gdprResponseDays} calendar days`,
              },
              '.',
            ],
          },
        ],
      },
      {
        id: 'transfers-minors',
        number: '8',
        title: 'International Transfers & Age Requirement',
        blocks: [
          {
            type: 'paragraph',
            content:
              'Our infrastructure and service providers operate across international regions. Where personal data is transferred from the EEA, UK, or Switzerland to jurisdictions without an adequacy decision, transfers rely on Standard Contractual Clauses (SCCs) or equivalent lawful safeguards.',
          },
          {
            type: 'paragraph',
            content: [
              `TOKEX is strictly for users aged ${LEGAL_CONFIG.minimumAge} years and older. We do not knowingly collect data from minors under ${LEGAL_CONFIG.minimumAge}; contact `,
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' to report and remove any minor account.',
            ],
          },
        ],
      },
      {
        id: 'policy-changes',
        number: '9',
        title: 'Communications & Policy Updates',
        blocks: [
          {
            type: 'paragraph',
            content: `We send essential transactional emails only (verification codes, password resets, receipts, and security/policy alerts). For material updates to this Privacy Policy, we provide at least ${LEGAL_CONFIG.privacyChangeNoticeDays} days advance notice via email or site notice.`,
          },
        ],
      },
    ],
  },
  zhCN: {
    id: 'privacy',
    title: '隐私政策',
    subtitle:
      '说明 TOKEX 在提供网站、API 网关与额度充值服务时如何收集、使用、保护及留存个人数据。',
    badge: '隐私与数据保护',
    summaryPoints: [
      {
        label: '数据控制者',
        value: LEGAL_CONFIG.operatorNameZh,
      },
      {
        label: '数据出售声明',
        value: '绝不出售或出租任何用户个人信息',
      },
      {
        label: '支付卡安全',
        value: `由 ${LEGAL_CONFIG.paymentProcessor} 独立处理支付（TOKEX 不存储卡号）`,
      },
      {
        label: '隐私联系邮箱',
        value: { type: 'email', email: LEGAL_CONFIG.supportEmail },
      },
    ],
    sections: [
      {
        id: 'controller',
        number: '1',
        title: '数据控制者与适用范围',
        blocks: [
          {
            type: 'paragraph',
            content: [
              { type: 'strong', text: LEGAL_CONFIG.operatorNameZh },
              '（简称“TOKEX”或“我们”）是 ',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              ' 平台的数据控制者。所有隐私咨询与数据权利申请请发送至 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '。',
            ],
          },
        ],
      },
      {
        id: 'data-collected',
        number: '2',
        title: '收集的数据类别',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '账号信息：' },
                '邮箱地址、用户名、用户 ID、账户状态、加密哈希密码（不存储明文密码），以及可选的 GitHub / Google OAuth 标识与公开资料。',
              ],
              [
                { type: 'strong', text: '安全验证数据：' },
                'WebAuthn / Passkey 公钥凭证元数据、邮箱验证码记录及 Cloudflare Turnstile 人机校验令牌。',
              ],
              [
                { type: 'strong', text: '订单与账单记录：' },
                `由 ${LEGAL_CONFIG.paymentProcessor} 回传的订单号、美元金额、交付额度、税费摘要及支付状态。TOKEX 不采集或存储银行卡号、有效期或 CVV 安全码。`,
              ],
              [
                { type: 'strong', text: 'API 用量与技术日志：' },
                'IP 地址、User-Agent、请求时间、调用模型、Token 消耗量、扣费金额及 HTTP 状态码，用于计费核算、速率限制与安全风控。',
              ],
            ],
          },
        ],
      },
      {
        id: 'legal-basis',
        number: '3',
        title: '处理目的与合法性依据',
        blocks: [
          {
            type: 'table',
            headers: ['处理目的', '数据类别', 'GDPR 第 6 条合法性依据'],
            rows: [
              [
                '账号鉴权与 API 网关路由',
                '邮箱、用户名、哈希密码、OAuth ID、API 密钥、用量日志',
                '履行合同（第 6(1)(b) 条）',
              ],
              [
                `通过 ${LEGAL_CONFIG.paymentProcessor} 完成充值结算与税务合规`,
                '账户 ID、邮箱、订单号、美元金额、税费与支付状态',
                '履行合同（第 6(1)(b) 条）及法定义务（第 6(1)(c) 条）',
              ],
              [
                '速率限制、Turnstile 防护、反欺诈与 AUP 安全审查',
                'IP 地址、请求头、安全事件记录',
                '合法利益（第 6(1)(f) 条）及法定义务（第 6(1)(c) 条）',
              ],
              [
                '发送事务性通知邮件（验证码、重置密码、安全提醒，经由 Resend）',
                '邮箱地址、通知元数据',
                '履行合同（第 6(1)(b) 条）及合法利益（第 6(1)(f) 条）',
              ],
              [
                '保存界面语言与主题偏好',
                '浏览器本地存储',
                '合法利益（第 6(1)(f) 条）',
              ],
            ],
          },
        ],
      },
      {
        id: 'cookies',
        number: '4',
        title: 'Cookie 与本地存储',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '必要 Cookie：' },
                '用于登录会话、Turnstile 校验与 CSRF 防护。',
              ],
              [
                { type: 'strong', text: '偏好本地存储：' },
                '用于保存界面语言与显示主题设置。',
              ],
              [
                { type: 'strong', text: '无广告追踪：' },
                'TOKEX 不使用任何第三方广告 Cookie 或跨站行为追踪像素。',
              ],
            ],
          },
        ],
      },
      {
        id: 'sharing-ccpa',
        number: '5',
        title: '数据共享与第三方服务商',
        blocks: [
          {
            type: 'callout',
            tone: 'info',
            title: '我们绝不出售您的个人信息',
            content:
              'TOKEX 不会向任何第三方出售、出租或交易您的个人信息，也不会出于跨站点行为广告目的共享个人信息（符合 CCPA / CPRA 标准）。',
          },
          {
            type: 'table',
            headers: ['服务商', '角色', '共享数据范围'],
            rows: [
              [
                LEGAL_CONFIG.paymentProcessor,
                '记录商户（MoR）及 PCI-DSS 支付处理商',
                '订单号、邮箱、美元金额与支付税费状态',
              ],
              [
                '上游 AI 供应商（Anthropic、OpenAI）',
                '模型推理计算',
                '仅按请求路由发送 API 输入以生成响应（不用于训练模型）',
              ],
              [
                'Resend',
                '事务性邮件发送',
                '收件人邮箱及验证码、密码重置等通知内容',
              ],
              [
                'Cloudflare',
                'DNS、CDN、DDoS 防护与 Turnstile 验证',
                '网络请求元数据与人机验证令牌',
              ],
              [
                'GitHub / Google（可选）',
                'OAuth 登录认证',
                '用户主动选择登录时的 OAuth 授权凭证',
              ],
            ],
          },
          {
            type: 'paragraph',
            content:
              '如遇有效司法要求、反欺诈/拒付抗辩或法定安全强制报告义务，我们仅在法律要求的最小范围内披露必要信息。',
          },
        ],
      },
      {
        id: 'security-retention',
        number: '6',
        title: '数据安全与留存期限',
        blocks: [
          {
            type: 'paragraph',
            content: `我们采用 TLS 传输加密、加盐密码哈希、细粒度 API 密钥鉴权与访问控制保护数据。若发生可能对您权益造成重大风险的数据安全事件，我们将在适用法律要求的 ${LEGAL_CONFIG.breachNoticeHours} 小时内通知受影响用户及监管机构。`,
          },
          {
            type: 'table',
            headers: ['数据类别', '留存期限'],
            rows: [
              [
                '账户资料与认证凭据',
                `账户存续期间保留；经核实注销后 ${LEGAL_CONFIG.postDeletionRetentionDays} 天内删除或匿名化`,
              ],
              [
                '充值订单、账单与税务记录',
                `依据财税与审计法规留存 ${LEGAL_CONFIG.taxRecordRetentionYears} 年`,
              ],
              [
                'API 用量与安全日志',
                `账户注销后 ${LEGAL_CONFIG.postDeletionRetentionDays} 天内清除或匿名化（涉及未结争议者除外）`,
              ],
              [
                '客服与争议往来记录',
                `不超过 24 个月或账户注销后 ${LEGAL_CONFIG.postDeletionRetentionDays} 天`,
              ],
            ],
          },
        ],
      },
      {
        id: 'gdpr-rights',
        number: '7',
        title: '您的隐私权利',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '根据适用隐私法律，您享有访问、更正、删除、限制处理、数据可携带、反对处理、申请自动化处置人工复核、撤回同意以及向数据保护监管机构投诉的权利。请使用注册邮箱发送请求至 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '，我们将在 ',
              {
                type: 'strong',
                text: `${LEGAL_CONFIG.gdprResponseDays} 个日历日内`,
              },
              ' 答复。',
            ],
          },
        ],
      },
      {
        id: 'transfers-minors',
        number: '8',
        title: '跨境传输与未成年人保护',
        blocks: [
          {
            type: 'paragraph',
            content:
              '我们的服务器与合作服务商分布于多个国家或地区。涉及欧洲经济区、英国或瑞士个人数据跨境传输时，依据标准合同条款（SCCs）或同等合法保障机制执行。',
          },
          {
            type: 'paragraph',
            content: [
              `TOKEX 仅面向年满 ${LEGAL_CONFIG.minimumAge} 周岁的成年用户，不收集未成年人信息。如发现未成年人注册，请联系 `,
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' 予以删除。',
            ],
          },
        ],
      },
      {
        id: 'policy-changes',
        number: '9',
        title: '系统通知与政策更新',
        blocks: [
          {
            type: 'paragraph',
            content: `我们仅发送验证码、密码重置、充值回执及安全/条款提醒等必要事务性邮件，不发送未经订阅的营销邮件。本政策发生重大变更时，将至少提前 ${LEGAL_CONFIG.privacyChangeNoticeDays} 天通过网站公告或邮件通知。`,
          },
        ],
      },
    ],
  },
}
