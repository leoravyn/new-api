import type { BilingualLegalDocument } from '../types'
import { LEGAL_CONFIG } from './legal-config'

export const TERMS_OF_SERVICE_CONTENT: BilingualLegalDocument = {
  en: {
    id: 'terms',
    title: 'Terms of Service',
    subtitle:
      'Governing your access to and purchase of prepaid API compute credits on the TOKEX developer platform.',
    badge: 'V2 Prepaid Credits Agreement',
    summaryPoints: [
      {
        label: 'Operator',
        value: `${LEGAL_CONFIG.operatorName} (${LEGAL_CONFIG.operatorTypeEn})`,
      },
      {
        label: 'Payment & MoR',
        value: `${LEGAL_CONFIG.paymentProcessor} (PCI-DSS compliant, USD settlement)`,
      },
      {
        label: 'Credit Validity',
        value: 'Purchased credits never expire while account is active',
      },
      {
        label: 'Unused Refund Window',
        value: 'Full refund within 24 hours if 0 credits consumed',
      },
    ],
    sections: [
      {
        id: 'seller-identity',
        number: '1',
        title: 'Seller Identity, Eligibility & Acceptance',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'These Terms of Service ("Terms") form a legally binding contract between you ("User" or "Customer") and ',
              { type: 'strong', text: LEGAL_CONFIG.operatorName },
              ' ("TOKEX", "we", "us", or "our"), operating the ',
              { type: 'strong', text: LEGAL_CONFIG.brandName },
              ' platform at ',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              '. TOKEX is operated as an ',
              LEGAL_CONFIG.operatorTypeEn,
              '; per sole-proprietor compliance disclosures, no private residential street address is published, and all official correspondence is handled through ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '.',
            ],
          },
          {
            type: 'paragraph',
            content: [
              'You must be at least ',
              { type: 'strong', text: `${LEGAL_CONFIG.minimumAge} years old` },
              ' (or the age of legal majority in your jurisdiction, whichever is higher) and legally competent to enter into a binding agreement. If you access TOKEX on behalf of an organization, you represent that you have authority to bind that organization to these Terms.',
            ],
          },
          {
            type: 'paragraph',
            content: [
              'By creating an account, generating an API key, purchasing compute credits, or sending any request through our API endpoints, you confirm that you have read, understood, and agreed to these Terms, our ',
              {
                type: 'link',
                label: 'Privacy Policy',
                to: '/privacy-policy',
              },
              ', and our ',
              {
                type: 'link',
                label: 'Acceptable Use Policy & AI Model Usage Guidelines',
                to: '/aup',
              },
              '.',
            ],
          },
        ],
      },
      {
        id: 'service-description',
        number: '2',
        title: 'Service Description & Platform Boundaries',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX provides a developer-oriented AI API gateway, usage metering, wallet accounting, and web playground on our own hosted platform. Users purchase prepaid compute credits on TOKEX to invoke supported large language models through unified, standards-compatible API interfaces.',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Important Platform Scope Notice',
            content:
              'TOKEX exclusively sells API gateway access and prepaid compute credits for use on TOKEX’s own platform. TOKEX does NOT sell, resell, proxy, activate, or top up third-party consumer AI accounts, subscriptions, or memberships (such as ChatGPT Plus, Claude Pro, or similar third-party retail accounts).',
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Immediate Digital Delivery: ' },
                'Compute credits are intangible digital SaaS credits delivered electronically and credited directly to your TOKEX wallet immediately upon confirmed payment.',
              ],
              [
                { type: 'strong', text: 'Upstream Model Dependencies: ' },
                'Model inference is powered by independent third-party AI model providers (including Anthropic and OpenAI) and cloud routing infrastructure. Model availability, context windows, rate limits, pricing, and response latency depend on upstream providers and may change or experience interruptions beyond TOKEX’s direct control.',
              ],
            ],
          },
        ],
      },
      {
        id: 'account-security',
        number: '3',
        title: 'Account Registration & API Key Security',
        blocks: [
          {
            type: 'paragraph',
            content:
              'You must provide accurate, up-to-date registration details and maintain the confidentiality of your login credentials, Passkeys, OAuth sessions, and generated API keys. You are solely responsible for all API requests, token consumption, and compute credit deductions executed under your account or API keys.',
          },
          {
            type: 'paragraph',
            content: [
              'If you suspect unauthorized access to your account or leakage of an API key, you must immediately revoke the affected key in your dashboard and notify us at ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '. TOKEX is not liable for losses caused by leaked, shared, or improperly secured client-side API keys.',
            ],
          },
        ],
      },
      {
        id: 'pricing-usd',
        number: '4',
        title: 'Pricing & USD-Denominated Settlement',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'Current per-model token rates, group multipliers, and available top-up credit packages are published transparently without login requirements on our ',
              { type: 'link', label: 'Pricing Page', to: '/pricing' },
              ' and displayed in your wallet before checkout confirmation.',
            ],
          },
          {
            type: 'paragraph',
            content:
              'All transactions and compute credit packages on TOKEX are denominated in United States Dollars (USD). We reserve the right to update model rates or group multipliers prospectively to reflect upstream provider pricing changes; updated rates apply only to API calls made after the change takes effect.',
          },
        ],
      },
      {
        id: 'payment-mor-taxes',
        number: '5',
        title: 'Payment Processing, Merchant of Record & Taxes',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'TOKEX operates strictly on a one-time prepaid credit top-up model (no recurring subscription or automatic renewal charges apply). By confirming a top-up order, you authorize a one-time charge for the displayed total via ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              ', which acts as our Merchant of Record (MoR) and PCI-DSS compliant payment processor.',
            ],
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Zero Card Storage on TOKEX: ' },
                'TOKEX servers never collect, process, or store your full credit/debit card numbers, expiration dates, or CVV/CVC security codes. All sensitive payment instruments are processed directly within Waffo Pancake’s encrypted PCI-DSS environment.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Currency Conversion & Applicable Taxes: ',
                },
                `${LEGAL_CONFIG.paymentProcessor} settles applicable real-time exchange rates and calculates, collects, and remits any required VAT, GST, sales tax, or local digital transaction taxes directly at checkout based on your billing jurisdiction.`,
              ],
            ],
          },
        ],
      },
      {
        id: 'compute-credits',
        number: '6',
        title: 'Compute Credits Validity & Account Termination',
        blocks: [
          {
            type: 'paragraph',
            content: [
              { type: 'strong', text: 'Purchased Credits Never Expire: ' },
              'Prepaid compute credits purchased through top-up orders on TOKEX never expire and remain available in your wallet for as long as your account remains active and in good standing.',
            ],
          },
          {
            type: 'paragraph',
            content: [
              'Promotional, bonus, or redemption-code credits (if separately issued) may carry distinct validity terms disclosed at issuance. If your account is suspended or permanently terminated due to a breach of these Terms or our ',
              {
                type: 'link',
                label: 'Acceptable Use Policy',
                to: '/aup',
              },
              ', any remaining balance in the account is forfeited without refund. If you wish to close your account voluntarily while in good standing, please consume remaining credits or request any eligible unused-order refund under Section 7 before requesting deletion.',
            ],
          },
        ],
      },
      {
        id: 'refund-policy',
        number: '7',
        title: 'Refund Policy',
        blocks: [
          {
            type: 'paragraph',
            content:
              'Because compute credits are digital goods provisioned immediately to your wallet upon payment confirmation, refunds are governed strictly by the rules below:',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              [
                { type: 'strong', text: 'Consumed Credits (Non-Refundable): ' },
                'Once any portion of the credits from a top-up order has been consumed (including making any API call or playground request that deducts credits from that order), you acknowledge that immediate digital performance has begun and waive any discretionary or statutory cancellation right to the fullest extent permitted by law. Partially used or fully consumed orders are strictly non-refundable.',
              ],
              [
                {
                  type: 'strong',
                  text: `Unused Credits (${LEGAL_CONFIG.unusedCreditRefundHours}-Hour Full Refund): `,
                },
                `If zero (0) credits from a specific top-up order have been consumed since the time of purchase (zero API usage or quota deduction attributable to that order), you are eligible for a full refund within ${LEGAL_CONFIG.unusedCreditRefundHours} hours of the purchase timestamp by emailing `,
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
                ' with your account email and order reference.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Mandatory Statutory Consumer Rights Carve-Out: ',
                },
                'Nothing in this Refund Policy excludes or limits non-waivable statutory withdrawal or consumer protection rights granted under mandatory applicable law in your jurisdiction (such as EU, UK, or Australian 14-day statutory withdrawal rights for digital services), except where you have expressly consented to immediate digital delivery and begun consuming the credits.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Multiple / Repeat Top-Up Orders vs. Technical Billing Errors: ',
                },
                'Each completed top-up transaction immediately and separately delivers valid compute credits into your TOKEX wallet. Intentionally or accidentally submitting multiple or repeat top-up orders constitutes separate valid credit deliveries and is NOT eligible for an automatic refund or post-consumption refund (untouched balances from a separate order remain governed solely by the 24-hour unused-credit rule above). Only verified payment-processor or gateway technical errors resulting in multiple debits for a single order without corresponding credit delivery qualify for a billing-error refund.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Refund Settlement Method: ',
                },
                `Approved refunds are issued back to the original payment method through ${LEGAL_CONFIG.paymentProcessor} and typically settle within 5–10 business days depending on your card issuer or bank.`,
              ],
            ],
          },
        ],
      },
      {
        id: 'billing-disputes',
        number: '8',
        title: 'Billing Disputes & Pre-Chargeback Resolution',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'If you notice an unrecognized charge, failed credit delivery, or billing discrepancy, you agree to contact us at ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' before initiating a bank dispute or card chargeback. Please include your registered account email, transaction timestamp, and order ID.',
            ],
          },
          {
            type: 'paragraph',
            content: `We acknowledge billing dispute inquiries within ${LEGAL_CONFIG.billingAckBusinessDays} business days and work in good faith to resolve verified billing issues within ${LEGAL_CONFIG.billingResolutionBusinessDays} business days. Initiating fraudulent or unsubstantiated chargebacks after consuming compute credits may result in immediate account suspension while the dispute is contested.`,
          },
        ],
      },
      {
        id: 'ai-outputs-ip',
        number: '9',
        title: 'AI Outputs, Intellectual Property & No Model Training',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Your Ownership: ' },
                'As between you and TOKEX, you retain all rights, title, and interest in and to your Prompts/Inputs and, to the extent permitted by applicable law, the AI-generated Outputs returned in response to your API requests.',
              ],
              [
                { type: 'strong', text: 'Limited Routing License: ' },
                'You grant TOKEX a limited, non-exclusive, revocable license solely to transmit, route, meter, perform automated abuse/safety screening on, and process your Inputs and Outputs as strictly necessary to operate and secure the API gateway.',
              ],
              [
                { type: 'strong', text: 'No Training on Customer Data: ' },
                'TOKEX does NOT use your API Inputs or Outputs to train, fine-tune, or improve foundation AI models.',
              ],
              [
                { type: 'strong', text: 'Output Verification Duty: ' },
                'AI Outputs are probabilistic and may be non-unique across users, incomplete, or factually inaccurate. You are solely responsible for independently reviewing and validating all Outputs before production use or publication.',
              ],
            ],
          },
        ],
      },
      {
        id: 'acceptable-use',
        number: '10',
        title: 'Acceptable Use & AI-Specific Prohibitions',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'Your use of TOKEX must comply at all times with our ',
              {
                type: 'link',
                label: 'Acceptable Use Policy & AI Model Usage Guidelines',
                to: '/aup',
              },
              ', which incorporates Waffo compliance standards alongside Anthropic and OpenAI usage restrictions.',
            ],
          },
          {
            type: 'list',
            items: [
              'No distilling, scraping, or harvesting model outputs to train, fine-tune, or benchmark competing foundation models.',
              'No automated large-scale scraping, credential stuffing, or bypassing gateway rate limits and access controls.',
              'No jailbreaking, prompt injection, or adversarial circumvention of TOKEX or upstream provider safety guardrails.',
              'No deploying AI outputs in medical, legal, financial, credit, housing, employment, or safety-critical contexts without qualified human review and explicit AI disclosure.',
            ],
          },
        ],
      },
      {
        id: 'data-privacy',
        number: '11',
        title: 'Data Protection & Privacy',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'Our collection, processing, and protection of personal data are governed by our ',
              {
                type: 'link',
                label: 'Privacy Policy',
                to: '/privacy-policy',
              },
              '. Payment checkout and card processing are handled securely by ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              ' in accordance with PCI-DSS standards.',
            ],
          },
          {
            type: 'paragraph',
            content: `Upon a verified account deletion request, non-statutory personal account data is deleted or anonymized within ${LEGAL_CONFIG.postDeletionRetentionDays} days, whereas statutory billing, invoicing, and tax records are retained for ${LEGAL_CONFIG.taxRecordRetentionYears} years as required by applicable financial and tax laws.`,
          },
        ],
      },
      {
        id: 'warranties-liability',
        number: '12',
        title: 'Disclaimer of Warranties & Limitation of Liability',
        blocks: [
          {
            type: 'paragraph',
            content:
              'THE TOKEX PLATFORM, API GATEWAY, AND ALL RELATED SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR UNINTERRUPTED AVAILABILITY.',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'AI-Generated Content Disclaimer',
            content:
              'AI models may generate inaccurate, incomplete, biased, or outdated content ("hallucinations"). TOKEX makes no warranty regarding the accuracy, legality, or suitability of AI Outputs and assumes no responsibility for decisions made in reliance on unverified Outputs.',
          },
          {
            type: 'paragraph',
            content: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL TOKEX OR ITS OPERATOR BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL. TOKEX’S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE TOTAL FEES ACTUALLY PAID BY YOU TO TOKEX IN THE ${LEGAL_CONFIG.liabilityCapMonths} MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.`,
          },
        ],
      },
      {
        id: 'termination',
        number: '13',
        title: 'Suspension & Termination',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'You may stop using TOKEX and request permanent account closure at any time by writing to ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '.',
            ],
          },
          {
            type: 'paragraph',
            content:
              'We may suspend or terminate your access immediately without prior notice if we reasonably determine that you have violated these Terms or our Acceptable Use Policy, engaged in payment fraud or unjustified chargebacks, posed a security threat, or if required by law or upstream provider mandates. Provisions concerning IP rights, payment obligations, disclaimers, liability caps, governing law, and dispute resolution survive termination.',
          },
        ],
      },
      {
        id: 'governing-law',
        number: '14',
        title: 'Governing Law & Consumer Rights Preservation',
        blocks: [
          {
            type: 'paragraph',
            content: `These Terms and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of the ${LEGAL_CONFIG.governingLawEn}, without giving effect to conflict-of-law principles. For clarity, selection of Delaware governing law does not represent corporate incorporation in Delaware, as TOKEX is operated by ${LEGAL_CONFIG.operatorName}.`,
          },
          {
            type: 'paragraph',
            content:
              'Nothing in these Terms limits or overrides any mandatory statutory consumer protection rights or non-waivable legal remedies available to you under the laws of your country or jurisdiction of residence.',
          },
        ],
      },
      {
        id: 'material-changes',
        number: '15',
        title: 'Material Changes to These Terms',
        blocks: [
          {
            type: 'paragraph',
            content: `We may revise these Terms from time to time to reflect operational, regulatory, or payment-partner updates. For material changes affecting user rights, pricing mechanics, or refund rules, we will provide at least ${LEGAL_CONFIG.tosChangeNoticeDays} days advance notice via email or prominent website announcement before the revised Terms take effect. Continued use of TOKEX after the effective date constitutes acceptance of the updated Terms.`,
          },
        ],
      },
      {
        id: 'contact',
        number: '16',
        title: 'Contact & Support Channels',
        blocks: [
          {
            type: 'paragraph',
            content:
              'All customer support, billing, refund, privacy, legal, and compliance communications are handled through our unified monitored support channel:',
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Operator: ' },
                `${LEGAL_CONFIG.operatorName} (${LEGAL_CONFIG.operatorTypeEn})`,
              ],
              [
                {
                  type: 'strong',
                  text: 'Unified Support, Billing & Legal Email: ',
                },
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ],
              [
                { type: 'strong', text: 'Platform URL: ' },
                {
                  type: 'external',
                  label: LEGAL_CONFIG.siteUrl,
                  href: LEGAL_CONFIG.siteUrl,
                },
              ],
              [
                { type: 'strong', text: 'Support Hours: ' },
                LEGAL_CONFIG.businessHoursEn,
              ],
            ],
          },
        ],
      },
    ],
  },
  zhCN: {
    id: 'terms',
    title: '服务条款',
    subtitle:
      '规范您访问及使用 TOKEX 开发者平台，以及购买和使用预付费 API 计算额度的全部权利与义务。',
    badge: 'V2 预付费额度协议',
    summaryPoints: [
      {
        label: '运营主体',
        value: LEGAL_CONFIG.operatorNameZh,
      },
      {
        label: '支付与记录商户 (MoR)',
        value: `${LEGAL_CONFIG.paymentProcessor}（PCI-DSS 合规，美元结算）`,
      },
      {
        label: '额度有效期',
        value: '账户正常有效期间，已购计算额度永久有效',
      },
      {
        label: '未使用退款窗口',
        value: '零消耗状态下购入后 24 小时内可全额退款',
      },
    ],
    sections: [
      {
        id: 'seller-identity',
        number: '1',
        title: '运营主体、资格要求与条款接受',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '本《服务条款》（简称“本条款”）为您（简称“用户”或“客户”）与运营 ',
              { type: 'strong', text: LEGAL_CONFIG.brandName },
              ' 平台（官方网站：',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              '）的 ',
              { type: 'strong', text: LEGAL_CONFIG.operatorNameZh },
              '（简称“TOKEX”或“我们”）之间具有法律约束力的协议。依据个人/独立开发者运营主体（Individual / Sole Proprietor）合规披露规则，本平台不对外公开个人住宅街道地址，所有官方沟通均通过 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' 统一受理。',
            ],
          },
          {
            type: 'paragraph',
            content: [
              '您必须年满 ',
              { type: 'strong', text: `${LEGAL_CONFIG.minimumAge} 周岁` },
              '（或达到您所在司法管辖区的法定成年年龄，以较高者为准）并具备完全民事行为能力，方可使用本服务。若您代表企业或组织使用本平台，即声明您拥有代表该组织受本条款约束的合法授权。',
            ],
          },
          {
            type: 'paragraph',
            content: [
              '当您注册账户、创建 API 密钥、购买计算额度或向本平台任何接口发起请求时，即表示您已阅读、理解并同意受本条款、',
              { type: 'link', label: '隐私政策', to: '/privacy-policy' },
              ' 以及 ',
              {
                type: 'link',
                label: '可接受使用政策与大模型使用规范',
                to: '/aup',
              },
              ' 的约束。',
            ],
          },
        ],
      },
      {
        id: 'service-description',
        number: '2',
        title: '服务内容说明与平台边界',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX 是面向开发者的 AI 模型 API 网关与计算额度平台，在 TOKEX 自有托管平台上提供统一的 API 路由调用、用量计量、钱包核算与在线测试环境。用户在平台充值购买计算额度后，可通过标准化兼容接口调用受支持的AI大模型服务。',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: '重要平台服务边界声明',
            content:
              'TOKEX 仅在本平台自有账户体系内提供 API 网关接入及预付费计算额度服务。TOKEX 绝对不提供任何第三方官方消费端 AI 账号或会员的代开通、代充值、合租或转售服务（例如 ChatGPT Plus、Claude Pro 等第三方零售订阅账号）。',
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '数字商品即时交付：' },
                '计算额度属于无形数字 SaaS 服务额度，一旦支付确认完成，系统即自动、即时将对应额度充入您的 TOKEX 账户钱包。',
              ],
              [
                { type: 'strong', text: '上游第三方模型依赖：' },
                '模型推理能力依赖独立第三方 AI 模型提供商（如 Anthropic、OpenAI 等）及云端路由基础设施。具体模型的可用性、上下文窗口、速率限制与响应延迟受上游供应商影响，可能出现调整或非本平台直接可控的中断。',
              ],
            ],
          },
        ],
      },
      {
        id: 'account-security',
        number: '3',
        title: '账户注册与 API 密钥安全责任',
        blocks: [
          {
            type: 'paragraph',
            content:
              '您应提供真实有效的注册邮箱并妥善保管登录密码、Passkey 通行密钥、OAuth 授权会话及所生成的 API 密钥。凡通过您的账户凭证或 API 密钥发起的所有接口调用、Token 消耗及额度扣费，均由您自行承担全部责任。',
          },
          {
            type: 'paragraph',
            content: [
              '如发现账户异常访问或 API 密钥疑似泄露，请立即在控制台吊销相关密钥并通过 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' 通知我们。因客户端密钥泄露、共享或保管不当造成的额度损耗，TOKEX 不承担赔偿责任。',
            ],
          },
        ],
      },
      {
        id: 'pricing-usd',
        number: '4',
        title: '透明定价与美元计价规则',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '各模型的实时计费单价、分组倍率与充值额度选项均在无需登录即可访问的 ',
              { type: 'link', label: '模型定价页', to: '/pricing' },
              ' 公开展示，并在您确认支付前于钱包页面清晰列明。',
            ],
          },
          {
            type: 'paragraph',
            content:
              'TOKEX 平台内所有商品与充值结算均以美元（USD）计价。如因上游模型供应商调整成本而需变更模型价格或分组倍率，调整仅适用于生效后的新 API 请求，不影响此前已购余额。',
          },
        ],
      },
      {
        id: 'payment-mor-taxes',
        number: '5',
        title: '支付处理、记录商户（MoR）与税费',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'TOKEX 当前仅采用单次预付费充值模式（不提供任何周期性自动续费订阅）。当您确认充值订单时，即授权通过我们的记录商户（Merchant of Record, MoR）及 PCI-DSS 合规支付处理商 ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              ' 发起单次支付扣款。',
            ],
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '不存储任何银行卡敏感数据：' },
                'TOKEX 服务器绝对不采集、处理或存储您的完整信用卡/借记卡卡号、有效期或 CVV/CVC 安全码，所有支付卡信息均由 Waffo Pancake 在加密 PCI-DSS 环境中直接处理。',
              ],
              [
                { type: 'strong', text: '实时汇率与税费结算：' },
                `${LEGAL_CONFIG.paymentProcessor} 将在结账页面根据您所在地区的税务规则自动核算并收取适用的增值税（VAT）、商品服务税（GST）或销售税，并按实时汇率完成结算。`,
              ],
            ],
          },
        ],
      },
      {
        id: 'compute-credits',
        number: '6',
        title: '计算额度有效期与账户终止处理',
        blocks: [
          {
            type: 'paragraph',
            content: [
              { type: 'strong', text: '已购计算额度长期有效：' },
              '您在 TOKEX 通过充值购买的预付费计算额度长期有效、永不过期，只要您的账户保持正常激活且状态良好即可持续使用。',
            ],
          },
          {
            type: 'paragraph',
            content: [
              '若平台另行发放活动赠送或兑换码额度，其特殊有效期以发放说明为准。如您的账户因违反本条款或 ',
              { type: 'link', label: '可接受使用政策', to: '/aup' },
              ' 而被暂停或永久封禁，账户内剩余未消耗额度将予以没收且不予退还。账户状态正常的个人主动注销申请，请先消耗完毕或按第 7 条申请符合条件的未使用订单退款后再提交注销。',
            ],
          },
        ],
      },
      {
        id: 'refund-policy',
        number: '7',
        title: '退款政策',
        blocks: [
          {
            type: 'paragraph',
            content:
              '由于计算额度属于支付确认后即时交付至账户钱包的数字商品，退款申请严格遵循以下规则：',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              [
                { type: 'strong', text: '已消耗额度不可退款：' },
                '一旦某笔充值订单中的任何部分额度已被使用（包括发起任何导致该笔订单额度发生扣减的 API 调用或测试请求），即视为您已确认数字服务开始即时履行，并在适用法律允许的最大范围内放弃撤销权。已部分消耗或全部消耗的充值订单概不退款。',
              ],
              [
                {
                  type: 'strong',
                  text: `完全未使用额度（购入后 ${LEGAL_CONFIG.unusedCreditRefundHours} 小时内全额退款）：`,
                },
                `若某笔充值订单自完成支付起至申请退款时保持零消耗（即该笔订单对应的额度完全未使用且未发生任何 API 扣费），您可在订单支付时间起 ${LEGAL_CONFIG.unusedCreditRefundHours} 小时内，通过 `,
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
                ' 提交注册邮箱与订单号申请全额退款。',
              ],
              [
                { type: 'strong', text: '法定消费者不可放弃权益保留：' },
                '本退款政策不限制或排除您所在司法管辖区强制性法律赋予且不可通过合同放弃的法定消费者保护或冷静期撤销权益（例如欧盟、英国或澳大利亚法定的 14 天数字服务撤回权），但经您明示同意即时交付且已开始消耗额度后依法豁免的情况除外。',
              ],
              [
                {
                  type: 'strong',
                  text: '用户多次/误操作重复充值与技术性重复扣款之区分：',
                },
                '每一笔成功支付的充值订单均会独立、即时向您的 TOKEX 钱包交付相应有效额度。用户主动发起多次充值或因个人误操作提交多笔充值订单，均视为独立有效的额度购买行为，不构成重复扣款，已消耗后不予退款（完全未使用的单独订单仍严格适用上述 24 小时内未使用退款规则）。仅当经核实的支付网关或渠道技术故障导致单笔订单被重复扣款而未交付对应额度时，方符合计费错误退款条件。',
              ],
              [
                { type: 'strong', text: '退款原路退回时效：' },
                `经审核批准的退款将通过 ${LEGAL_CONFIG.paymentProcessor} 原路退回至您的原支付方式，实际到账时间通常为 5 至 10 个工作日，具体取决于发卡行或支付机构处理进度。`,
              ],
            ],
          },
        ],
      },
      {
        id: 'billing-disputes',
        number: '8',
        title: '账单争议处理与拒付前沟通',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '如您发现账单异常、额度未到账或不明扣款，您同意在向发卡银行或支付机构发起拒付（Chargeback）或争议申诉前，先通过 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' 联系我们并提供注册邮箱、交易时间及订单编号。',
            ],
          },
          {
            type: 'paragraph',
            content: `我们将在收到账单争议通知后 ${LEGAL_CONFIG.billingAckBusinessDays} 个工作日内确认受理，并力争在 ${LEGAL_CONFIG.billingResolutionBusinessDays} 个工作日内完成核查与书面答复。在已消耗额度后或未先经沟通即发起恶意/无依据拒付的账户，可能在争议核查期间被立即暂停访问权限。`,
          },
        ],
      },
      {
        id: 'ai-outputs-ip',
        number: '9',
        title: 'AI 输出归属、知识产权与不训练承诺',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '用户内容权属：' },
                '在您与 TOKEX 之间，您保留您提交的所有提示词与输入数据（Inputs）的全部权利；在适用法律允许的范围内，您通过 API 调用获得的生成结果（Outputs）的权利亦归您所有。',
              ],
              [
                { type: 'strong', text: '有限路由处理许可：' },
                '您仅授予 TOKEX 一项有限、非排他、可撤销的许可，用于传输、路由转发、用量计量、安全风控过滤及向您返回接口响应之必要技术处理。',
              ],
              [
                { type: 'strong', text: '不用于基础模型训练：' },
                'TOKEX 绝对不会使用您的 API 输入或输出内容来训练或微调任何基础人工智能模型。',
              ],
              [
                { type: 'strong', text: '人工复核义务：' },
                '鉴于概率生成模型特性，不同用户可能获得相似输出，且内容可能存在不准确或遗漏；您应对生成结果在发布或业务采纳前自行履行独立审查与核验义务。',
              ],
            ],
          },
        ],
      },
      {
        id: 'acceptable-use',
        number: '10',
        title: '可接受使用要求与 AI 专项禁止事项',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '您在使用本平台期间必须严格遵守独立发布的 ',
              {
                type: 'link',
                label: '可接受使用政策与大模型使用规范',
                to: '/aup',
              },
              '（已结合 Waffo 合规要求以及 Anthropic 与 OpenAI 使用政策）。',
            ],
          },
          {
            type: 'list',
            items: [
              '禁止提取、抓取或蒸馏模型输出，用于训练、微调或评测具有竞争关系的基础大模型。',
              '禁止大规模自动化爬取、撞库或恶意绕过平台速率限制与访问控制机制。',
              '禁止实施越狱提示（Jailbreak）、提示词注入（Prompt Injection）或任何绕过 TOKEX 及上游模型安全护栏的行为。',
              '禁止在缺乏执业专业人员复核与明确 AI 身份披露的情况下，将生成内容冒充执业医生、律师、金融顾问等专业人类建议直接交付终端用户。',
            ],
          },
        ],
      },
      {
        id: 'data-privacy',
        number: '11',
        title: '数据保护、隐私与留存说明',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '个人数据的收集、处理目的、Cookie 使用及用户权利均适用我们的 ',
              { type: 'link', label: '隐私政策', to: '/privacy-policy' },
              '。支付结算与银行卡数据安全由符合 PCI-DSS 标准的 ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              ' 独家负责处理。',
            ],
          },
          {
            type: 'paragraph',
            content: `经核实的账户注销请求完成后，非法定强制留存的个人账户数据将在 ${LEGAL_CONFIG.postDeletionRetentionDays} 天内删除或匿名化处理；依据适用财税与商业合规法律要求，交易账单与税务记录将依法保留 ${LEGAL_CONFIG.taxRecordRetentionYears} 年。`,
          },
        ],
      },
      {
        id: 'warranties-liability',
        number: '12',
        title: '免责声明、AI 内容风险提示与责任上限',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX 平台及 API 网关服务按“现状（AS IS）”与“现有可用（AS AVAILABLE）”状态提供，不作任何明示或暗示的担保，包括但不限于适销性、特定用途适用性、不侵权、持续不中断或绝对无错误的保证。',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'AI 生成内容免责提示',
            content:
              '人工智能生成内容可能包含事实性错误（“幻觉”）、过时信息或偏差。尽管本平台已采取自动化安全过滤措施，TOKEX 不对 AI 输出内容的准确性、合法性或特定业务适用性作保证，也不对您未经核验即依赖 AI 输出所做出的任何决策承担责任。',
          },
          {
            type: 'paragraph',
            content: `在适用法律允许的最大范围内，TOKEX 及其运营方不对任何间接、附带、特殊、后果性或惩罚性损害，以及利润、收入、数据或商誉损失承担责任。TOKEX 因本条款或本服务引发的累计赔偿责任总额，最高不超过索赔事件发生前 ${LEGAL_CONFIG.liabilityCapMonths} 个月内您实际向 TOKEX 支付的服务费用总额。`,
          },
        ],
      },
      {
        id: 'termination',
        number: '13',
        title: '服务暂停与账户终止',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '您可随时停止使用 TOKEX 服务，并通过 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' 申请注销账户。',
            ],
          },
          {
            type: 'paragraph',
            content:
              '若我们合理认定您违反本条款或《可接受使用政策》、存在欺诈支付或恶意拒付行为、威胁平台安全或应法律法规及上游供应商要求，我们有权立即暂停或永久终止您的账户及 API 访问权限。关于知识产权、付费义务、免责声明、责任上限、适用法律与争议解决的条款在账户终止后继续有效。',
          },
        ],
      },
      {
        id: 'governing-law',
        number: '14',
        title: '适用法律与强制性消费者权益保留',
        blocks: [
          {
            type: 'paragraph',
            content: `本条款及因本条款引发或与之相关的任何争议，均受${LEGAL_CONFIG.governingLawZh}管辖并依其解释，不适用冲突法规则。需要明确说明的是，选用特拉华州法律作为准据法并不表示 TOKEX 在特拉华州设立公司实体，TOKEX 当前由 ${LEGAL_CONFIG.operatorNameZh} 独立运营。`,
          },
          {
            type: 'paragraph',
            content:
              '本条款的任何规定均不得剥夺或限制您根据居住地国家或地区强制性消费者保护法律所享有的不可放弃之法定权利与救济途径。',
          },
        ],
      },
      {
        id: 'material-changes',
        number: '15',
        title: '条款修订与提前通知',
        blocks: [
          {
            type: 'paragraph',
            content: `随着业务运营、监管政策或支付合规要求变化，我们可能会不时修订本条款。如发生影响用户核心权益、计费机制或退款规则的重大变更，我们将在新条款生效前至少提前 ${LEGAL_CONFIG.tosChangeNoticeDays} 天通过网站公告或电子邮件通知您；您在生效日期后继续使用本平台即视为接受修订后的条款。`,
          },
        ],
      },
      {
        id: 'contact',
        number: '16',
        title: '联系方式与客户支持渠道',
        blocks: [
          {
            type: 'paragraph',
            content:
              '所有客户咨询、账单争议、退款申请、隐私请求及合规联络均通过以下统一受监控渠道受理：',
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '运营主体：' },
                LEGAL_CONFIG.operatorNameZh,
              ],
              [
                { type: 'strong', text: '统一支持、账单与合规邮箱：' },
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
                { type: 'strong', text: '服务时间：' },
                LEGAL_CONFIG.businessHoursZh,
              ],
            ],
          },
        ],
      },
    ],
  },
}
