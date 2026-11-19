import type { BilingualLegalDocument } from '../types'
import { LEGAL_CONFIG } from './legal-config'

export const PRIVACY_POLICY_CONTENT: BilingualLegalDocument = {
  en: {
    id: 'privacy',
    title: 'Privacy Policy',
    subtitle:
      'Explaining how TOKEX collects, uses, safeguards, and retains personal data across our API gateway and checkout flows.',
    badge: 'GDPR & CCPA Aligned Notice',
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
        label: 'Privacy Inquiries',
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
              'This Privacy Policy describes how ',
              { type: 'strong', text: LEGAL_CONFIG.operatorName },
              ' ("TOKEX", "we", "us", or "our"), operating ',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              ', acts as Data Controller for personal data collected through our website, developer console, and API services.',
            ],
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Data Controller: ' },
                `${LEGAL_CONFIG.operatorName} (${LEGAL_CONFIG.operatorTypeEn}; no residential street address published per individual/sole-trader disclosure rules)`,
              ],
              [
                { type: 'strong', text: 'Privacy & Data Protection Contact: ' },
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ],
              [
                { type: 'strong', text: 'Data Protection Officer (DPO): ' },
                `Not required under applicable thresholds for an individual sole-trader operation; all data-protection requests are handled directly by the operator via `,
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
                '.',
              ],
            ],
          },
        ],
      },
      {
        id: 'data-collected',
        number: '2',
        title: 'Personal Data We Collect',
        blocks: [
          {
            type: 'paragraph',
            content:
              'We collect only personal and operational data genuinely required to provide authentication, API routing, credit metering, payment reconciliation, and platform security:',
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Account & Profile Data: ' },
                'Email address, username, user ID, account status/role, and cryptographically hashed passwords (plaintext passwords are never stored).',
              ],
              [
                {
                  type: 'strong',
                  text: 'Social / OAuth Sign-In Data (Optional): ',
                },
                'If you choose to sign in or bind an account via GitHub or Google OAuth, we receive your OAuth subject identifier, display name/handle, and verified email address as authorized by you.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Security & Anti-Bot Verification Data: ',
                },
                'WebAuthn / Passkey public-key credential metadata, email OTP verification events, and Cloudflare Turnstile anti-bot verification tokens.',
              ],
              [
                { type: 'strong', text: 'Payment & Order Metadata: ' },
                `Order reference ID, top-up USD amount, credit quota delivered, payment method label, currency/tax summary, and payment status provided by ${LEGAL_CONFIG.paymentProcessor}. TOKEX NEVER collects, sees, or stores full credit/debit card numbers, bank account numbers, or CVV codes.`,
              ],
              [
                { type: 'strong', text: 'Technical, API Usage & Error Logs: ' },
                'IP address, user-agent/device metadata, request timestamps, invoked model identifier, prompt/completion token counts, credit cost, HTTP status codes, and diagnostic error summaries needed for billing accuracy, rate limiting, and abuse prevention.',
              ],
            ],
          },
        ],
      },
      {
        id: 'legal-basis',
        number: '3',
        title: 'Purposes & GDPR Art. 6 Legal Bases',
        blocks: [
          {
            type: 'paragraph',
            content:
              'Where GDPR or UK GDPR applies, we rely on the following lawful bases under Article 6(1):',
          },
          {
            type: 'table',
            headers: [
              'Processing Purpose',
              'Data Categories',
              'GDPR Art. 6 Legal Basis',
            ],
            rows: [
              [
                'Account creation, login, OAuth/Passkey authentication & API gateway routing',
                'Email, username, hashed password, OAuth ID, API keys, usage metadata',
                'Performance of a contract (Art. 6(1)(b))',
              ],
              [
                `Prepaid credit checkout, payment confirmation, refunds & tax compliance via ${LEGAL_CONFIG.paymentProcessor}`,
                'Account ID, email, order ID, USD amount, tax/payment status',
                'Performance of a contract (Art. 6(1)(b)) & Legal obligation (Art. 6(1)(c))',
              ],
              [
                'Rate limiting, Cloudflare Turnstile bot defense, fraud/chargeback prevention & AUP safety enforcement',
                'IP address, device/browser headers, security events, safety/abuse flags',
                'Legitimate interests (Art. 6(1)(f)) & Legal obligation (Art. 6(1)(c))',
              ],
              [
                'Transactional emails (OTP verification, password reset, security alerts, legal updates via Resend)',
                'Email address, account notice metadata',
                'Performance of a contract (Art. 6(1)(b)) & Legitimate interests (Art. 6(1)(f))',
              ],
              [
                'Persisting UI language and display theme preferences',
                'Local browser storage / preference cookie',
                'Legitimate interests (Art. 6(1)(f)) / User preference',
              ],
            ],
          },
        ],
      },
      {
        id: 'cookies',
        number: '4',
        title: 'Cookies & Local Storage Policy',
        blocks: [
          {
            type: 'list',
            items: [
              [
                {
                  type: 'strong',
                  text: 'Strictly Necessary Cookies & Storage: ',
                },
                'Essential session tokens, authentication cookies, and security state required to keep you signed in, validate Turnstile challenges, and protect forms against CSRF attacks.',
              ],
              [
                { type: 'strong', text: 'Functional Preferences: ' },
                'Local storage keys remembering your selected interface language (Chinese / English) and theme settings.',
              ],
              [
                {
                  type: 'strong',
                  text: 'No Third-Party Advertising or Tracking Pixels: ',
                },
                'TOKEX does NOT deploy third-party advertising cookies, social retargeting pixels, or cross-site behavioral tracking scripts.',
              ],
            ],
          },
        ],
      },
      {
        id: 'sharing-ccpa',
        number: '5',
        title: 'Data Sharing, Service Providers & CCPA Statement',
        blocks: [
          {
            type: 'callout',
            tone: 'info',
            title:
              'CCPA / CPRA Declaration: We Do Not Sell Personal Information',
            content:
              'TOKEX does NOT sell, rent, or trade your personal information to third parties for monetary or other valuable consideration, nor do we share personal information for cross-context behavioral advertising.',
          },
          {
            type: 'paragraph',
            content:
              'We share data strictly on a need-to-know basis with vetted infrastructure and compliance providers:',
          },
          {
            type: 'table',
            headers: ['Recipient / Provider', 'Role', 'Data Shared'],
            rows: [
              [
                LEGAL_CONFIG.paymentProcessor,
                'Merchant of Record (MoR) & PCI-DSS payment processor',
                'Order ID, email, USD amount, tax/billing confirmation (card details entered directly on Waffo Pancake)',
              ],
              [
                'Upstream AI Model Providers (Anthropic, OpenAI)',
                'Model inference processing',
                'API prompts/inputs transmitted strictly to generate requested responses (not used by TOKEX to train foundation models)',
              ],
              [
                'Resend',
                'Transactional email delivery',
                'Recipient email address and transactional message content (OTP codes, password reset, account alerts)',
              ],
              [
                'Cloudflare',
                'DNS, CDN, DDoS protection, Turnstile anti-bot & email routing',
                'IP/network request metadata, Turnstile verification tokens, support email routing headers',
              ],
              [
                'GitHub / Google (Optional OAuth)',
                'Third-party authentication providers (only if selected by user)',
                'OAuth authorization handshake tokens and basic authorized profile attributes',
              ],
            ],
          },
          {
            type: 'paragraph',
            content:
              'We may also disclose limited information where strictly required by valid legal process, court order, fraud/chargeback defense, or mandatory child-safety reporting obligations.',
          },
        ],
      },
      {
        id: 'security',
        number: '6',
        title: 'Data Security & Breach Notification',
        blocks: [
          {
            type: 'paragraph',
            content:
              'We implement layered technical and organizational safeguards, including TLS/HTTPS encryption in transit, strong cryptographic password hashing, scoped API key authentication, least-privilege administrative controls, and automated anti-abuse monitoring.',
          },
          {
            type: 'paragraph',
            content: `In the event of a confirmed personal data breach likely to pose a risk to your rights and freedoms, we will notify affected users and applicable supervisory authorities without undue delay and within ${LEGAL_CONFIG.breachNoticeHours} hours where mandated by law.`,
          },
        ],
      },
      {
        id: 'retention',
        number: '7',
        title: 'Data Retention Schedule',
        blocks: [
          {
            type: 'table',
            headers: ['Data Category', 'Retention Period'],
            rows: [
              [
                'Account Profile & Authentication Credentials',
                `Retained while account is active; deleted or anonymized within ${LEGAL_CONFIG.postDeletionRetentionDays} days after a verified deletion request`,
              ],
              [
                'Billing, Credit Orders & Tax / Accounting Records',
                `Retained for ${LEGAL_CONFIG.taxRecordRetentionYears} years (or longer if required by applicable tax, audit, or financial laws)`,
              ],
              [
                'API Usage Metrics, Operational & Security Logs',
                `Retained for billing accuracy, debugging, and dispute/abuse defense; purged or anonymized within ${LEGAL_CONFIG.postDeletionRetentionDays} days post-account deletion unless tied to an active dispute`,
              ],
              [
                'Support & Billing Dispute Correspondence',
                `Retained up to 24 months or ${LEGAL_CONFIG.postDeletionRetentionDays} days after account closure (unless needed for unresolved claims)`,
              ],
            ],
          },
        ],
      },
      {
        id: 'gdpr-rights',
        number: '8',
        title: 'Your Privacy Rights',
        blocks: [
          {
            type: 'paragraph',
            content:
              'Depending on your jurisdiction (including the EEA, UK, Switzerland, California, and other regions), you have the following rights regarding your personal data:',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Right of Access: Obtain confirmation of whether we process your personal data and request a copy.',
              'Right to Rectification: Request correction of inaccurate or incomplete account details.',
              'Right to Erasure ("Right to be Forgotten"): Request deletion of your account and non-statutory personal data.',
              'Right to Restriction of Processing: Request temporary suspension of certain processing activities.',
              'Right to Data Portability: Receive structured, machine-readable copies of data you provided to us.',
              'Right to Object: Object to processing based on legitimate interests.',
              'Rights Regarding Automated Decision-Making: Request human review for any solely automated enforcement action affecting legal or significant rights.',
              'Right to Withdraw Consent & Lodge a Complaint: Withdraw optional consent at any time and lodge a complaint with your local Data Protection Authority (DPA).',
            ],
          },
          {
            type: 'paragraph',
            content: [
              'To exercise any of these rights, contact ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ` from your registered email address. We respond to all verified privacy requests within `,
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
        id: 'communications-opt-out',
        number: '9',
        title: 'Service Communications & Marketing Opt-Out',
        blocks: [
          {
            type: 'paragraph',
            content:
              'We send essential transactional messages (such as email verification codes, password resets, purchase receipts, security alerts, and legal policy updates) necessary to operate your account. TOKEX does not send unsolicited marketing spam; any optional product update emails will require affirmative opt-in and offer immediate one-click unsubscribe.',
          },
        ],
      },
      {
        id: 'international-transfers',
        number: '10',
        title: 'International Data Transfers',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX cloud servers, edge security infrastructure (Cloudflare), payment processing (Waffo Pancake), and upstream AI providers (Anthropic, OpenAI) operate across international jurisdictions including Asia-Pacific (such as Tokyo), the United States, and Europe. Where personal data is transferred from the EEA, UK, or Switzerland to jurisdictions without an adequacy decision, transfers rely on appropriate safeguards including Standard Contractual Clauses (SCCs) or equivalent lawful transfer mechanisms.',
          },
        ],
      },
      {
        id: 'childrens-privacy',
        number: '11',
        title: 'Children’s Privacy (18+ Only)',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'Consistent with Section 1 of our ',
              { type: 'link', label: 'Terms of Service', to: '/terms' },
              `, TOKEX is intended strictly for individuals aged `,
              {
                type: 'strong',
                text: `${LEGAL_CONFIG.minimumAge} years and older`,
              },
              '. We do not knowingly collect personal data from anyone under 18. If you believe a minor has created an account or provided personal data, please contact ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' so we can promptly terminate the account and erase the data.',
            ],
          },
        ],
      },
      {
        id: 'third-party-links',
        number: '12',
        title: 'Third-Party Websites & Services',
        blocks: [
          {
            type: 'paragraph',
            content:
              'Our platform may contain links to third-party checkout pages (Waffo Pancake), OAuth sign-in providers (GitHub, Google), or external developer documentation. Those third-party services operate independently under their own privacy policies, and TOKEX is not responsible for their privacy practices.',
          },
        ],
      },
      {
        id: 'policy-changes',
        number: '13',
        title: 'Updates to This Privacy Policy',
        blocks: [
          {
            type: 'paragraph',
            content: `We may update this Privacy Policy periodically to reflect new legal requirements or technical changes. For material updates, we will update the Effective Date at the top of this page and provide at least ${LEGAL_CONFIG.privacyChangeNoticeDays} days advance notice via email or prominent platform notice before the changes take effect.`,
          },
        ],
      },
      {
        id: 'contact',
        number: '14',
        title: 'Contact Information & Business Hours',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Controller: ' },
                `${LEGAL_CONFIG.operatorName} (${LEGAL_CONFIG.operatorTypeEn})`,
              ],
              [
                { type: 'strong', text: 'Privacy & Support Email: ' },
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ],
              [
                { type: 'strong', text: 'Website: ' },
                {
                  type: 'external',
                  label: LEGAL_CONFIG.siteUrl,
                  href: LEGAL_CONFIG.siteUrl,
                },
              ],
              [
                { type: 'strong', text: 'Business Hours: ' },
                LEGAL_CONFIG.businessHoursEn,
              ],
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
      '说明 TOKEX 在提供 API 网关与计算额度充值服务过程中如何收集、使用、保护及留存您的个人数据。',
    badge: '符合 GDPR 与 CCPA 合规标准',
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
        value: `由 ${LEGAL_CONFIG.paymentProcessor} 独立处理支付（TOKEX 不存储完整卡号）`,
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
              '本《隐私政策》旨在说明运营 ',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              ' 平台的 ',
              { type: 'strong', text: LEGAL_CONFIG.operatorNameZh },
              '（简称“TOKEX”或“我们”）作为数据控制者，在您访问网站、使用开发者控制台、充值计算额度及调用 API 服务时如何处理您的个人数据。',
            ],
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '数据控制者：' },
                `${LEGAL_CONFIG.operatorNameZh}（依据个人/独立开发者披露规范，不对外公开个人住宅街道地址）`,
              ],
              [
                { type: 'strong', text: '隐私事务联系邮箱：' },
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ],
              [
                { type: 'strong', text: '数据保护官（DPO）：' },
                '依据个人独立运营规模暂不适用法定强制委任 DPO 条件；所有隐私查询与权利行使均由运营方通过 ',
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
                ' 直接受理。',
              ],
            ],
          },
        ],
      },
      {
        id: 'data-collected',
        number: '2',
        title: '我们实际收集的个人数据类别',
        blocks: [
          {
            type: 'paragraph',
            content:
              '我们仅收集维持账号认证、API 请求路由、额度计量、订单对账及系统安全所必需的最少数据：',
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '账号与基础身份信息：' },
                '电子邮箱地址、用户名、用户 ID、账户状态/角色以及单向加密哈希处理后的密码（系统从不存储明文密码）。',
              ],
              [
                { type: 'strong', text: '第三方 OAuth 登录信息（如选用）：' },
                '当您选择通过 GitHub 或 Google OAuth 登录或绑定账号时，我们将根据您的授权获取 OAuth 唯一标识符、公开昵称及经验证的邮箱地址。',
              ],
              [
                { type: 'strong', text: '安全校验与防滥用数据：' },
                'WebAuthn / Passkey 通行密钥公钥凭证元数据、邮箱验证码验证记录及 Cloudflare Turnstile 人机校验令牌。',
              ],
              [
                { type: 'strong', text: '交易与充值订单记录：' },
                `由 ${LEGAL_CONFIG.paymentProcessor} 回传的订单编号、充值美元金额、交付额度、支付方式标识、税费摘要及支付状态。TOKEX 服务器绝对不采集、接触或存储完整信用卡/借记卡卡号、银行账户信息或 CVV/CVC 安全码。`,
              ],
              [
                { type: 'strong', text: '技术运行、API 用量与错误日志：' },
                'IP 地址、设备与浏览器 User-Agent 元数据、请求时间戳、调用模型 ID、输入/输出 Token 消耗量、额度扣费、HTTP 状态码及故障诊断信息，用于精确计量、速率限制与反滥用安全防护。',
              ],
            ],
          },
        ],
      },
      {
        id: 'legal-basis',
        number: '3',
        title: '处理目的与 GDPR 第 6 条合法性依据',
        blocks: [
          {
            type: 'paragraph',
            content:
              '在欧盟 GDPR 或英国 UK GDPR 适用范围内，我们依据第 6(1) 条以下合法性基础处理个人数据：',
          },
          {
            type: 'table',
            headers: ['处理目的', '涉及数据类别', 'GDPR 第 6 条合法性依据'],
            rows: [
              [
                '账号注册登录、OAuth/Passkey 鉴权及 API 网关路由分发',
                '邮箱、用户名、哈希密码、OAuth ID、API 密钥、用量元数据',
                '履行合同所必需（第 6(1)(b) 条）',
              ],
              [
                `通过 ${LEGAL_CONFIG.paymentProcessor} 完成额度充值结算、退款及财税合规`,
                '账户 ID、邮箱、订单号、美元金额、税费与支付状态',
                '履行合同所必需（第 6(1)(b) 条）及履行法定义务（第 6(1)(c) 条）',
              ],
              [
                '速率限制、Cloudflare Turnstile 人机验证、反欺诈/反拒付及 AUP 安全合规审查',
                'IP 地址、设备请求头、安全验证记录、违规风控标记',
                '合法利益（第 6(1)(f) 条）及履行法定义务（第 6(1)(c) 条）',
              ],
              [
                '发送事务性通知邮件（验证码、重置密码、安全告警及条款变更，经由 Resend 发送）',
                '邮箱地址、事务邮件元数据',
                '履行合同所必需（第 6(1)(b) 条）及合法利益（第 6(1)(f) 条）',
              ],
              [
                '保存界面语言与深浅主题偏好',
                '浏览器本地存储 / 偏好设置',
                '合法利益（第 6(1)(f) 条）/ 用户界面偏好',
              ],
            ],
          },
        ],
      },
      {
        id: 'cookies',
        number: '4',
        title: 'Cookie 与本地存储政策',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '严格必要 Cookie 与会话存储：' },
                '仅用于维持登录会话认证、安全校验（包括 Turnstile 验证与 CSRF 防护）及确保网站核心功能正常运行。',
              ],
              [
                { type: 'strong', text: '功能偏好本地存储：' },
                '用于在浏览器本地记住您的语言切换偏好（简体中文 / English）及界面显示设置。',
              ],
              [
                { type: 'strong', text: '无第三方广告或跨站追踪像素：' },
                'TOKEX 绝对不嵌入第三方广告联盟 Cookie、社交媒体再营销像素或跨站点行为追踪脚本。',
              ],
            ],
          },
        ],
      },
      {
        id: 'sharing-ccpa',
        number: '5',
        title: '数据共享、子处理商与 CCPA 不出售声明',
        blocks: [
          {
            type: 'callout',
            tone: 'info',
            title: 'CCPA / CPRA 声明：我们绝不出售您的个人信息',
            content:
              'TOKEX 绝对不会为了金钱或其他有价对价而向任何第三方出售、出租或交易您的个人信息，也不会出于跨上下文行为广告目的共享您的个人信息。',
          },
          {
            type: 'paragraph',
            content:
              '我们仅在提供核心服务所必需的最小范围内，与下列经审核的第三方技术与合规服务商协同处理数据：',
          },
          {
            type: 'table',
            headers: ['服务商名称', '服务角色', '共享或传输的数据范围'],
            rows: [
              [
                LEGAL_CONFIG.paymentProcessor,
                '记录商户（MoR）及 PCI-DSS 支付处理商',
                '订单号、邮箱、美元金额与支付税费状态（支付卡敏感信息由用户在 Waffo Pancake 页面直接输入）',
              ],
              [
                '上游 AI 模型供应商（Anthropic、OpenAI）',
                '模型推理计算处理',
                '仅按您的请求路由发送 API 提示词与输入内容以生成响应（TOKEX 不用其训练基础模型）',
              ],
              [
                'Resend',
                '事务性电子邮件投递服务',
                '收件人邮箱地址及验证码、密码重置、账户安全通知等必要邮件内容',
              ],
              [
                'Cloudflare',
                'DNS 解析、CDN 加速、DDoS 防护、Turnstile 验证与邮件路由',
                '网络请求 IP 与安全验证令牌、客服邮箱转发邮件头信息',
              ],
              [
                'GitHub / Google（可选 OAuth）',
                '第三方身份认证提供商（仅当用户主动点击使用）',
                'OAuth 授权握手凭证及您同意共享的基础公开资料',
              ],
            ],
          },
          {
            type: 'paragraph',
            content:
              '此外，若遇有效司法传票、法院裁定、反欺诈/拒付抗辩或法定儿童安全强制举报义务，我们可能在法律严格要求范围内披露必要信息。',
          },
        ],
      },
      {
        id: 'security',
        number: '6',
        title: '数据安全防护与泄露通知机制',
        blocks: [
          {
            type: 'paragraph',
            content:
              '我们采用全链路 TLS/HTTPS 传输加密、高强度加盐密码哈希存储、细粒度 API 密钥鉴权、最小权限后台访问控制以及异常流量监控等安全保障措施。',
          },
          {
            type: 'paragraph',
            content: `一旦发生经确认且可能对用户权利与自由造成风险的个人数据安全事件，我们将立即启动应急响应，并在适用法律要求时毫不拖延地（且在 ${LEGAL_CONFIG.breachNoticeHours} 小时内）通知受影响用户及相关监管机构。`,
          },
        ],
      },
      {
        id: 'retention',
        number: '7',
        title: '数据留存期限说明',
        blocks: [
          {
            type: 'table',
            headers: ['数据类别', '留存期限'],
            rows: [
              [
                '账户基本资料与认证凭据',
                `账户有效期内持续保留；收到经核实的注销请求后，于 ${LEGAL_CONFIG.postDeletionRetentionDays} 天内彻底删除或匿名化处理`,
              ],
              [
                '充值订单、账单与税务合规记录',
                `依法留存 ${LEGAL_CONFIG.taxRecordRetentionYears} 年（或按适用财税、审计与反欺诈法规要求的更长期限）`,
              ],
              [
                'API 用量计量、运行与安全审计日志',
                `用于计费核对、故障排查与拒付/滥用取证；账户注销后于 ${LEGAL_CONFIG.postDeletionRetentionDays} 天内清除或匿名化（涉及未结争议者除外）`,
              ],
              [
                '客服工单与账单争议往来邮件',
                `保留不超过 24 个月或账户注销后 ${LEGAL_CONFIG.postDeletionRetentionDays} 天（涉及未决纠纷者除外）`,
              ],
            ],
          },
        ],
      },
      {
        id: 'gdpr-rights',
        number: '8',
        title: '您的隐私权利（含 GDPR 八项核心权利）',
        blocks: [
          {
            type: 'paragraph',
            content:
              '根据您所在地区适用的隐私法律（包括 GDPR、UK GDPR、CCPA 等），您对个人数据享有以下权利：',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              '知情与访问权：查询我们是否处理您的个人数据并获取数据副本。',
              '更正权：要求修正不准确或不完整的账户信息。',
              '删除权（“被遗忘权”）：申请注销账户并删除非法定强制留存的个人数据。',
              '限制处理权：在特定法定情形下要求暂停对您数据的部分处理活动。',
              '数据可携带权：以结构化、机器可读格式获取您主动提供的相关数据。',
              '反对权：基于特定情况反对我们依据合法利益开展的数据处理。',
              '不受纯自动化决策约束权：如某项处置仅由自动化系统作出且产生重大影响，您有权申请人工复核。',
              '撤回同意与向监管机构投诉权：随时撤回可选授权，并有权向您当地的数据保护监管机构（DPA）提出投诉。',
            ],
          },
          {
            type: 'paragraph',
            content: [
              '请使用您的注册邮箱发送邮件至 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' 行使上述权利。我们将在收到有效身份核验请求后的 ',
              {
                type: 'strong',
                text: `${LEGAL_CONFIG.gdprResponseDays} 个日历日内`,
              },
              ' 予以答复。',
            ],
          },
        ],
      },
      {
        id: 'communications-opt-out',
        number: '9',
        title: '系统通知与营销邮件退订',
        blocks: [
          {
            type: 'paragraph',
            content:
              '注册验证码、密码重置、充值回执、账户安全告警及条款更新通知属于保障服务运行的必要事务性邮件，在账户存续期间不可单独退订。TOKEX 不发送未经同意的批量营销邮件；如未来提供可选产品资讯推送，均须经您明确订阅并支持随时一键退订。',
          },
        ],
      },
      {
        id: 'international-transfers',
        number: '10',
        title: '个人数据的跨境传输',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX 的云服务器集群、边缘安全网络（Cloudflare）、支付平台（Waffo Pancake）及上游 AI 模型供应商（Anthropic、OpenAI）基础设施分布于亚太（如东京）、美国及欧洲等国家和地区。当涉及将欧洲经济区、英国或瑞士个人数据跨境传输至尚未获得充分性认定的地区时，相关传输依据标准合同条款（SCCs）或其他合法保障机制执行。',
          },
        ],
      },
      {
        id: 'childrens-privacy',
        number: '11',
        title: '未成年人隐私保护（仅限 18 周岁以上）',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '与 ',
              { type: 'link', label: '服务条款', to: '/terms' },
              ' 第 1 条保持一致，TOKEX 仅面向年满 ',
              { type: 'strong', text: `${LEGAL_CONFIG.minimumAge} 周岁` },
              ' 的成年用户开放，我们不会有意收集任何未满 18 周岁未成年人的个人信息。如您发现存在未成年人注册或提交数据的情况，请立即通过 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' 联系我们，我们将第一时间终止相关账户并清除数据。',
            ],
          },
        ],
      },
      {
        id: 'third-party-links',
        number: '12',
        title: '第三方链接与外部服务说明',
        blocks: [
          {
            type: 'paragraph',
            content:
              '平台页面可能包含跳转至 Waffo Pancake 结账页、GitHub/Google 登录页或外部开发者文档的链接。该等第三方服务均受其各自独立的隐私政策约束，TOKEX 不对第三方的隐私合规实践承担责任。',
          },
        ],
      },
      {
        id: 'policy-changes',
        number: '13',
        title: '隐私政策的更新与通知',
        blocks: [
          {
            type: 'paragraph',
            content: `我们可能随法律法规或技术架构演进适时更新本《隐私政策》。若发生重大实质性变更，我们将在新政策生效前至少提前 ${LEGAL_CONFIG.privacyChangeNoticeDays} 天通过页面公告或电子邮件方式通知您，并更新页面顶部的生效日期。`,
          },
        ],
      },
      {
        id: 'contact',
        number: '14',
        title: '联系信息与人工服务时间',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '数据控制者：' },
                LEGAL_CONFIG.operatorNameZh,
              ],
              [
                { type: 'strong', text: '隐私与支持邮箱：' },
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ],
              [
                { type: 'strong', text: '官方网站：' },
                {
                  type: 'external',
                  label: LEGAL_CONFIG.siteUrl,
                  href: LEGAL_CONFIG.siteUrl,
                },
              ],
              [
                { type: 'strong', text: '工作时间：' },
                LEGAL_CONFIG.businessHoursZh,
              ],
            ],
          },
        ],
      },
    ],
  },
}
