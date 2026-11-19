import type { BilingualLegalDocument } from '../types'
import { LEGAL_CONFIG } from './legal-config'

export const TERMS_OF_SERVICE_CONTENT: BilingualLegalDocument = {
  en: {
    id: 'terms',
    title: 'Terms of Service',
    subtitle:
      'Terms governing your account, API usage, and prepaid compute credits on TOKEX.',
    badge: 'Prepaid API Credits Agreement',
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
        label: 'Refund Policy',
        value:
          'Digital credits deliver instantly; non-refundable except verified billing errors',
      },
    ],
    sections: [
      {
        id: 'seller-identity',
        number: '1',
        title: 'Operator, Eligibility & Acceptance',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'These Terms of Service ("Terms") form a binding agreement between you and ',
              { type: 'strong', text: LEGAL_CONFIG.operatorName },
              ' ("TOKEX", "we", or "us"), operating ',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              '. Official inquiries are handled at ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '.',
            ],
          },
          {
            type: 'paragraph',
            content: [
              'You must be at least ',
              { type: 'strong', text: `${LEGAL_CONFIG.minimumAge} years old` },
              ' and legally able to enter a binding contract. By creating an account, generating an API key, purchasing credits, or calling our APIs, you agree to these Terms, our ',
              {
                type: 'link',
                label: 'Privacy Policy',
                to: '/privacy-policy',
              },
              ', and our ',
              {
                type: 'link',
                label: 'Acceptable Use Policy',
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
        title: 'Service Scope & Platform Boundaries',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX provides an AI model API gateway, usage metering, wallet accounting, and web playground. Users purchase prepaid compute credits to invoke supported models through unified API endpoints.',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Platform Boundary',
            content:
              'TOKEX only sells API gateway access and prepaid compute credits for use on TOKEX. TOKEX does NOT sell, resell, proxy, activate, or top up third-party consumer AI accounts or memberships (such as ChatGPT Plus or Claude Pro).',
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Instant Digital Delivery: ' },
                'Compute credits are digital goods credited to your TOKEX wallet immediately upon payment confirmation.',
              ],
              [
                { type: 'strong', text: 'Upstream Providers: ' },
                'Model inference relies on third-party AI providers (including Anthropic and OpenAI). Model availability, context limits, rate limits, and latency depend on upstream infrastructure and may change.',
              ],
            ],
          },
        ],
      },
      {
        id: 'account-security',
        number: '3',
        title: 'Account & API Key Security',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'You are responsible for safeguarding your login credentials, Passkeys, OAuth sessions, and API keys, and for all requests and credit deductions made under your keys. If a key is compromised, revoke it immediately in the console and notify ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '. TOKEX is not liable for unauthorized usage resulting from leaked client-side keys.',
            ],
          },
        ],
      },
      {
        id: 'payment-mor-taxes',
        number: '4',
        title: 'Pricing, Payment Processing (MoR) & Taxes',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'Model rates, group multipliers, and top-up tiers are denominated in USD and published on our ',
              { type: 'link', label: 'Pricing Page', to: '/pricing' },
              ' and wallet checkout. Rates may be adjusted prospectively when upstream provider pricing changes.',
            ],
          },
          {
            type: 'paragraph',
            content: [
              'TOKEX uses a one-time prepaid credit top-up model (no recurring subscription or auto-renewal charges). Checkout is processed by ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              ' as our Merchant of Record (MoR) and PCI-DSS compliant payment processor.',
            ],
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'No Card Storage on TOKEX: ' },
                'TOKEX never collects or stores full card numbers, expiration dates, or CVV codes. All payment credentials are processed directly by Waffo Pancake.',
              ],
              [
                { type: 'strong', text: 'FX & Taxes: ' },
                `${LEGAL_CONFIG.paymentProcessor} applies real-time exchange rates for local-currency payments and calculates, collects, and remits applicable VAT, GST, or sales taxes at checkout.`,
              ],
            ],
          },
        ],
      },
      {
        id: 'refund-policy',
        number: '5',
        title: 'Credit Validity & Refund Policy',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Credits Never Expire: ' },
                'Purchased prepaid compute credits never expire while your account remains active and in good standing. Promotional or redemption credits follow the validity terms stated at issuance.',
              ],
              [
                { type: 'strong', text: 'Non-Refundable After Delivery: ' },
                'Because compute credits are digital goods delivered immediately upon payment confirmation, all completed top-up purchases are final and non-refundable once credited to your wallet.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Technical Billing Errors vs. Repeat Orders: ',
                },
                `Refunds are issued only for verified payment-gateway technical errors (such as duplicate charges for a single order or payment debited without credit delivery). Multiple top-up orders submitted by the user are separate purchases, not duplicate charges. Approved billing-error refunds are returned to the original payment method via ${LEGAL_CONFIG.paymentProcessor} within 5–10 business days.`,
              ],
              [
                { type: 'strong', text: 'Account Violation Forfeiture: ' },
                'If an account is suspended or terminated for violating these Terms or the Acceptable Use Policy, any remaining balance is forfeited without refund.',
              ],
              [
                { type: 'strong', text: 'Statutory Consumer Rights: ' },
                'Nothing in this section excludes mandatory, non-waivable statutory consumer protection rights under your local law where applicable.',
              ],
            ],
          },
        ],
      },
      {
        id: 'billing-disputes',
        number: '6',
        title: 'Billing Disputes',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'If you experience an unrecognized charge or missing credit delivery, contact ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ` with your account email and order ID before filing a bank chargeback. We acknowledge billing inquiries within ${LEGAL_CONFIG.billingAckBusinessDays} business days and resolve verified issues within ${LEGAL_CONFIG.billingResolutionBusinessDays} business days. Unsubstantiated chargebacks after credit delivery may result in immediate account suspension.`,
            ],
          },
        ],
      },
      {
        id: 'ai-outputs-ip',
        number: '7',
        title: 'Inputs, Outputs & No Model Training',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Your Content: ' },
                'As between you and TOKEX, you retain all rights to your API Inputs and, to the extent permitted by law, the generated Outputs. You grant TOKEX a limited license solely to route, meter, and screen requests to operate the service.',
              ],
              [
                { type: 'strong', text: 'No Model Training: ' },
                'TOKEX does NOT use your API Inputs or Outputs to train, fine-tune, or improve foundation AI models.',
              ],
              [
                { type: 'strong', text: 'Output Verification: ' },
                'AI outputs are probabilistic and may be inaccurate or incomplete. You are responsible for reviewing outputs before production or high-stakes use.',
              ],
            ],
          },
        ],
      },
      {
        id: 'acceptable-use',
        number: '8',
        title: 'Acceptable Use & Data Privacy',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'All usage must comply with our ',
              {
                type: 'link',
                label: 'Acceptable Use Policy',
                to: '/aup',
              },
              '. You may not scrape or distill outputs to train competing models, bypass rate limits or safety guardrails, or submit unlawful content.',
            ],
          },
          {
            type: 'paragraph',
            content: [
              'Personal data handling is governed by our ',
              {
                type: 'link',
                label: 'Privacy Policy',
                to: '/privacy-policy',
              },
              `. Following a verified account deletion request, non-statutory personal data is deleted or anonymized within ${LEGAL_CONFIG.postDeletionRetentionDays} days, while statutory billing and tax records are retained for ${LEGAL_CONFIG.taxRecordRetentionYears} years.`,
            ],
          },
        ],
      },
      {
        id: 'warranties-liability',
        number: '9',
        title: 'Disclaimers & Limitation of Liability',
        blocks: [
          {
            type: 'paragraph',
            content:
              'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR UNINTERRUPTED AVAILABILITY.',
          },
          {
            type: 'paragraph',
            content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, TOKEX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOSS OF PROFITS, DATA, OR GOODWILL. TOKEX’S TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU TO TOKEX IN THE ${LEGAL_CONFIG.liabilityCapMonths} MONTHS PRECEDING THE CLAIM.`,
          },
        ],
      },
      {
        id: 'governing-law',
        number: '10',
        title: 'Termination, Governing Law & Changes',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'You may close your account at any time by contacting ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '. We may suspend or terminate access immediately for violations of these Terms or the AUP, payment fraud, or security risks.',
            ],
          },
          {
            type: 'paragraph',
            content: `These Terms are governed by the laws of the ${LEGAL_CONFIG.governingLawEn}, without regard to conflict-of-law principles and without limiting non-waivable statutory consumer protection rights in your jurisdiction of residence. We provide at least ${LEGAL_CONFIG.tosChangeNoticeDays} days advance notice via email or site notice before material changes to these Terms take effect.`,
          },
        ],
      },
    ],
  },
  zhCN: {
    id: 'terms',
    title: '服务条款',
    subtitle: '规范您使用 TOKEX 账户、API 网关及预付费计算额度的权利与义务。',
    badge: '预付费 API 额度协议',
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
        value: '账户正常存续期间，已购计算额度长期有效',
      },
      {
        label: '退款政策',
        value: '数字额度即时到账，除经核实的计费错误外不支持退款',
      },
    ],
    sections: [
      {
        id: 'seller-identity',
        number: '1',
        title: '运营主体、使用资格与条款接受',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '本《服务条款》为您与运营 ',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              ' 的 ',
              { type: 'strong', text: LEGAL_CONFIG.operatorNameZh },
              '（简称“TOKEX”或“我们”）之间的法律协议。官方联系邮箱：',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '。',
            ],
          },
          {
            type: 'paragraph',
            content: [
              '您须年满 ',
              { type: 'strong', text: `${LEGAL_CONFIG.minimumAge} 周岁` },
              ' 并具备完全民事行为能力。注册账户、生成 API 密钥、充值额度或调用接口，即表示您同意本条款、',
              { type: 'link', label: '隐私政策', to: '/privacy-policy' },
              ' 及 ',
              {
                type: 'link',
                label: '可接受使用政策',
                to: '/aup',
              },
              '。',
            ],
          },
        ],
      },
      {
        id: 'service-description',
        number: '2',
        title: '服务范围与平台边界',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX 提供面向开发者的 AI 模型 API 网关、用量计量、钱包核算与在线测试服务。用户购买预付费计算额度后，可通过标准化接口调用受支持的模型。',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: '平台服务边界',
            content:
              'TOKEX 仅提供本平台自有 API 网关接入与预付费计算额度，绝对不提供任何第三方官方消费端 AI 账号或会员的代开通、代充值、合租或转售服务（如 ChatGPT Plus、Claude Pro 等）。',
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '数字额度即时交付：' },
                '计算额度属于数字商品，支付确认后立即自动充入您的 TOKEX 钱包。',
              ],
              [
                { type: 'strong', text: '上游模型依赖：' },
                '模型推理依赖第三方供应商（如 Anthropic、OpenAI 等），模型可用性、速率限制及响应延迟可能随上游调整而变化。',
              ],
            ],
          },
        ],
      },
      {
        id: 'account-security',
        number: '3',
        title: '账户与 API 密钥安全',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '您应妥善保管登录凭证、Passkey、OAuth 会话及 API 密钥，并对您密钥下的所有接口调用与额度消耗承担责任。如密钥疑似泄露，请立即在控制台吊销并通过 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' 联系我们；因客户端密钥保管不当造成的损失由您自行承担。',
            ],
          },
        ],
      },
      {
        id: 'payment-mor-taxes',
        number: '4',
        title: '定价、支付处理（MoR）与税费',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '模型单价、分组倍率与充值档位均以美元（USD）计价，并在 ',
              { type: 'link', label: '模型定价页', to: '/pricing' },
              ' 及充值界面公开展示。若上游成本变动，价格调整仅适用于生效后的新调用请求。',
            ],
          },
          {
            type: 'paragraph',
            content: [
              'TOKEX 仅采用单次预付费充值模式（无自动续费订阅）。订单通过记录商户（MoR）及 PCI-DSS 合规支付处理商 ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              ' 结算。',
            ],
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '不存储银行卡信息：' },
                'TOKEX 不采集或存储您的银行卡号、有效期或 CVV 安全码，支付信息均由 Waffo Pancake 直接处理。',
              ],
              [
                { type: 'strong', text: '汇率与税费：' },
                `${LEGAL_CONFIG.paymentProcessor} 在结账页按实时汇率折算本地货币，并依据您所在地区法规核算及代征适用税费（VAT / GST / 销售税）。`,
              ],
            ],
          },
        ],
      },
      {
        id: 'refund-policy',
        number: '5',
        title: '额度有效期与退款政策',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '已购额度长期有效：' },
                '只要账户保持正常存续状态，充值购买的计算额度长期有效、不会过期。活动赠送或兑换码额度以发放说明为准。',
              ],
              [
                { type: 'strong', text: '充值到账后不支持退款：' },
                '计算额度属于支付后即时交付的数字商品，一旦充值到账即完成交付，除下列技术性计费错误外不支持退款。',
              ],
              [
                {
                  type: 'strong',
                  text: '技术性重复扣款与用户多次充值区分：',
                },
                `仅当经核实的支付渠道技术故障导致单笔订单被重复扣款或扣款后未交付额度时，方可申请退款；用户主动或误操作提交的多笔独立充值订单均已分别交付有效额度，不构成重复扣款。经核准的退款将通过 ${LEGAL_CONFIG.paymentProcessor} 原路退回，通常于 5–10 个工作日内到账。`,
              ],
              [
                { type: 'strong', text: '违规封禁处理：' },
                '因违反本条款或《可接受使用政策》被暂停或封禁的账户，剩余额度予以没收且不予退还。',
              ],
              [
                { type: 'strong', text: '法定消费者权益保留：' },
                '本政策不排除您所在司法管辖区强制性法律赋予且不可放弃的法定消费者权益。',
              ],
            ],
          },
        ],
      },
      {
        id: 'billing-disputes',
        number: '6',
        title: '账单异议处理',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '如遇不明扣款或额度未到账，请在向发卡行发起拒付（Chargeback）前先通过 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ` 提交注册邮箱与订单号。我们将在 ${LEGAL_CONFIG.billingAckBusinessDays} 个工作日内确认受理，并在 ${LEGAL_CONFIG.billingResolutionBusinessDays} 个工作日内完成核查。额度到账后发起无依据拒付的账户将被暂停服务。`,
            ],
          },
        ],
      },
      {
        id: 'ai-outputs-ip',
        number: '7',
        title: '输入输出权属与不训练声明',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '内容权属：' },
                '在适用法律允许范围内，您保留对 API 输入（Inputs）及生成输出（Outputs）的权利，并仅授予 TOKEX 为完成接口路由、计量与安全过滤所必需的技术处理许可。',
              ],
              [
                { type: 'strong', text: '不用于模型训练：' },
                'TOKEX 不会使用您的 API 输入或输出内容训练或微调任何基础 AI 模型。',
              ],
              [
                { type: 'strong', text: '结果核验：' },
                'AI 生成内容具有概率性，可能存在事实偏差或遗漏，请在实际应用前自行核验。',
              ],
            ],
          },
        ],
      },
      {
        id: 'acceptable-use',
        number: '8',
        title: '合规使用与数据隐私',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '使用本平台须遵守 ',
              {
                type: 'link',
                label: '可接受使用政策',
                to: '/aup',
              },
              '，严禁抓取或蒸馏模型输出用于训练竞品模型、绕过速率限制或安全护栏。',
            ],
          },
          {
            type: 'paragraph',
            content: [
              '个人数据处理适用 ',
              { type: 'link', label: '隐私政策', to: '/privacy-policy' },
              `。账户经核实注销后，非法定留存的个人数据将在 ${LEGAL_CONFIG.postDeletionRetentionDays} 天内删除或匿名化；账单与税务记录依法保留 ${LEGAL_CONFIG.taxRecordRetentionYears} 年。`,
            ],
          },
        ],
      },
      {
        id: 'warranties-liability',
        number: '9',
        title: '免责声明与责任限制',
        blocks: [
          {
            type: 'paragraph',
            content:
              '本服务按“现状（AS IS）”与“现有可用（AS AVAILABLE）”提供，不对服务不中断或 AI 输出内容的准确性、特定用途适用性作明示或暗示担保。',
          },
          {
            type: 'paragraph',
            content: `在法律允许的最大范围内，TOKEX 不对任何间接、附带或后果性损害承担责任；累计赔偿责任上限不超过索赔事件发生前 ${LEGAL_CONFIG.liabilityCapMonths} 个月内您实际向 TOKEX 支付的服务费用总额。`,
          },
        ],
      },
      {
        id: 'governing-law',
        number: '10',
        title: '服务终止、适用法律与条款修订',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '您可随时通过 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' 申请注销账户。若您违反本条款或《可接受使用政策》、存在支付欺诈或威胁平台安全，我们有权立即暂停或终止账户。',
            ],
          },
          {
            type: 'paragraph',
            content: `本条款受${LEGAL_CONFIG.governingLawZh}管辖（不适用冲突法规则，且不影响您居住地强制性消费者保护权利）。条款发生重大变更时，我们将至少提前 ${LEGAL_CONFIG.tosChangeNoticeDays} 天通过网站公告或邮件通知。`,
          },
        ],
      },
    ],
  },
}
