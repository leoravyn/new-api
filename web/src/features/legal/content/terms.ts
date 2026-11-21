import type { BilingualLegalDocument } from '../types'
import { LEGAL_CONFIG } from './legal-config'

export const TERMS_OF_SERVICE_CONTENT: BilingualLegalDocument = {
  en: {
    id: 'terms',
    title: 'Terms of Service',
    subtitle:
      'Terms governing your account, API usage, and prepaid compute credits on TOKEX.',
    badge: 'Prepaid Compute Credits Agreement',
    summaryPoints: [
      {
        label: 'Operator & Territory',
        value: 'TOKEX (Outside Mainland China, 18+)',
      },
      {
        label: 'Payment & MoR',
        value: `${LEGAL_CONFIG.paymentProcessor} (USD settlement, no card storage)`,
      },
      {
        label: 'Credit Policy',
        value: 'Digital consumables; final and non-refundable once credited',
      },
      {
        label: 'Governing Law',
        value: 'Hong Kong SAR Law & HKIAC Arbitration',
      },
    ],
    sections: [
      {
        id: 'operator-territory-warranties',
        number: '1',
        title: 'Operator, Service Territory, and User Warranties',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'These Terms of Service ("Terms") constitute a legally binding agreement between you and the operator of ',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              ' ("TOKEX", "we", or "us"; official contact: ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '). This Platform is offered exclusively to users located outside Mainland China and in non-restricted jurisdictions who are at least ',
              { type: 'strong', text: `${LEGAL_CONFIG.minimumAge} years of age` },
              ' with full legal capacity; services are not provided within Mainland China. By registering an account, generating API keys, purchasing compute credits, or invoking our endpoints, you represent and warrant that you are accessing the Platform from an eligible jurisdiction, possess full legal capacity to contract, and are not circumventing regional restrictions by any technical means, and you unconditionally accept these Terms, our ',
              { type: 'link', label: 'Privacy Policy', to: '/privacy-policy' },
              ', and our ',
              {
                type: 'link',
                label: 'Acceptable Use Policy',
                to: '/aup',
              },
              '. Any misrepresentation or unauthorized access from a restricted jurisdiction constitutes a material breach, entitling TOKEX to immediately terminate your account and revoke access to all remaining compute credits without refund.',
            ],
          },
        ],
      },
      {
        id: 'service-scope-boundaries',
        number: '2',
        title: 'Scope of Services and Platform Boundaries',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX provides developer-oriented API gateway routing, usage metering, and prepaid compute credit accounting services. TOKEX strictly does not offer account registration, top-up, sharing, or reselling services for any third-party consumer AI subscriptions. Compute credits are digital service consumables whose delivery is fully completed upon crediting to your account and do not constitute electronic money or stored monetary value. Model inference relies heavily on third-party upstream providers; TOKEX makes no guarantees regarding the continuous availability, output stability, rate limits, or response latency of any specific model and reserves the right to modify or discontinue models at any time based on upstream channel conditions.',
          },
        ],
      },
      {
        id: 'account-api-key-security',
        number: '3',
        title: 'Account and API Key Security',
        blocks: [
          {
            type: 'paragraph',
            content:
              'You are solely responsible for safeguarding your login credentials, Passkeys, OAuth sessions, and API keys. All API requests and compute credit consumption initiated through your account or API keys are deemed authorized by you. Regardless of whether key compromise results from your mishandling or client-side intrusion, you bear full financial and legal responsibility for all resulting usage, and TOKEX has no obligation to recover or reimburse consumed compute credits.',
          },
        ],
      },
      {
        id: 'pricing-billing-taxes',
        number: '4',
        title: 'Pricing Adjustments, Billing (MoR), and Taxes',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'All Platform services are denominated in U.S. Dollars (USD). Model unit prices and group multipliers are dynamically adjusted primarily based on upstream provider costs and channel availability. Standard price updates take effect for subsequent API requests upon publication on the website ',
              { type: 'link', label: 'pricing page', to: '/pricing' },
              '; for substantial upward adjustments to core flagship models, TOKEX will endeavor to provide advance notice via site announcements where practicable. Unused compute credits denominated in USD in your account will be deducted at the active rate in effect at the time of each request. Order billing and applicable tax collection are independently processed by our Merchant of Record (MoR) and payment processor, ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              '. TOKEX neither collects, processes, nor stores your bank card number, expiration date, or CVV security code.',
            ],
          },
        ],
      },
      {
        id: 'credits-no-refund-policy',
        number: '5',
        title: 'Nature of Compute Credits and No-Refund Policy',
        blocks: [
          {
            type: 'paragraph',
            content:
              'Purchased compute credits remain valid indefinitely while your account remains in good standing, whereas promotional or voucher credits are governed by their specific issuance rules. Because compute credits are digital consumables delivered instantaneously upon payment confirmation, all purchases are final and strictly non-refundable, non-withdrawable, and non-transferable once credited. In the rare event that an actual refund is issued due to exceptional circumstances (including verified duplicate charges, platform cessation of operations, or discretionary exceptions approved solely by TOKEX), TOKEX reserves the right to deduct a flat 10% administrative and account settlement fee from the gross paid refund amount, except where a full refund is mandated by applicable payment network rules for pure technical processing errors. If your account is suspended or terminated for violating these Terms or the Acceptable Use Policy, access to all remaining compute credits shall be revoked without refund. Should TOKEX cease operations due to force majeure, upstream provider discontinuation, or business restructuring, we will post advance notice and terminate the service; for the actual paid value corresponding to unused purchased compute credits, TOKEX may refund the net amount after deducting the aforementioned 10% administrative and account settlement fee, without incurring any further liability.',
          },
        ],
      },
      {
        id: 'billing-disputes-chargebacks',
        number: '6',
        title: 'Billing Disputes and Chargeback Restrictions',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'If you encounter billing discrepancies or delayed compute credit delivery, please contact us first at ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' for investigation. Initiating an unsubstantiated or abusive chargeback with your card issuer or ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              ' after compute credits have been duly delivered is strictly prohibited and constitutes a material breach. TOKEX reserves the right to immediately and permanently terminate any account involved in an unjustified chargeback, revoke access to all remaining compute credits without refund, and submit complete API logs and delivery records to ',
              LEGAL_CONFIG.paymentProcessor,
              ' to contest and recover disputed funds.',
            ],
          },
        ],
      },
      {
        id: 'content-ownership-license',
        number: '7',
        title: 'Content Ownership and Processing License',
        blocks: [
          {
            type: 'paragraph',
            content:
              'To the extent permitted by applicable law, you retain ownership rights in your API inputs and generated outputs, and grant TOKEX a worldwide, royalty-free technical license to process such content solely as necessary to perform API routing, usage metering, caching, and compliance screening. AI-generated outputs are probabilistic and may contain inaccuracies; you must independently verify all outputs prior to use or deployment, and TOKEX assumes no responsibility for the accuracy, legality, or fitness of generated content.',
          },
        ],
      },
      {
        id: 'disclaimer-limitation-liability',
        number: '8',
        title: 'Disclaimer of Warranties and Limitation of Liability',
        blocks: [
          {
            type: 'paragraph',
            content: `The services are provided strictly on an "AS IS" and "AS AVAILABLE" basis. TOKEX expressly disclaims all warranties, whether express or implied, including without limitation implied warranties of uninterrupted service, error-free operation, fitness for a particular purpose, and non-infringement. To the maximum extent permitted by law, TOKEX shall not be liable for any indirect, incidental, punitive, or consequential damages, including loss of profits, business interruption, or data loss. Regardless of the cause of action, TOKEX's aggregate cumulative liability to you shall in no event exceed the greater of (a) the actual paid value of unused purchased compute credits remaining in your account at the time of the claim, or (b) the total net service fees actually paid by you to TOKEX during the three (${LEGAL_CONFIG.liabilityCapMonths}) months immediately preceding the event giving rise to the claim.`,
          },
        ],
      },
      {
        id: 'indemnification',
        number: '9',
        title: 'Indemnification',
        blocks: [
          {
            type: 'paragraph',
            content:
              "You agree to defend, indemnify, and hold harmless TOKEX and its operator from and against any and all third-party claims, regulatory investigations, administrative penalties, lawsuits, losses, liabilities, and expenses (including reasonable attorneys' fees and settlement costs) arising out of or relating to your breach of these Terms or the Acceptable Use Policy, unauthorized deployment in high-risk applications, infringement of any third-party intellectual property or privacy rights, or the actions of your end users.",
          },
        ],
      },
      {
        id: 'amendments-governing-law',
        number: '10',
        title:
          'Amendments, Governing Law, Dispute Resolution, and Governing Language',
        blocks: [
          {
            type: 'paragraph',
            content: `TOKEX reserves the right to amend these Terms at any time. Amended Terms become effective immediately upon publication on the website, and your continued use of the services constitutes binding acceptance. These Terms shall be governed by and construed in accordance with the laws of the ${LEGAL_CONFIG.governingLawEn}, without regard to its conflict of law principles. Any dispute arising out of or relating to these Terms shall first be addressed through amicable negotiation; failing resolution, the dispute shall be referred to and finally resolved by arbitration administered by the Hong Kong International Arbitration Centre (HKIAC) under its rules then in force. The seat of arbitration shall be Hong Kong, and the arbitration shall be conducted in English. These Terms are executed in English; any translated versions are provided solely for convenience, and the English version shall govern and prevail in the event of any conflict or ambiguity.`,
          },
        ],
      },
    ],
  },
  zhCN: {
    id: 'terms',
    title: '服务条款',
    subtitle: '规范您使用 TOKEX 账户、API 网关调用及预付费计算额度的核心协议。',
    badge: '预付费计算额度协议',
    summaryPoints: [
      {
        label: '运营主体与区域',
        value: 'TOKEX（仅面向中国大陆以外非受限地区，18+）',
      },
      {
        label: '支付结算与 MoR',
        value: `${LEGAL_CONFIG.paymentProcessor}（美元计价，平台不存储银行卡信息）`,
      },
      {
        label: '额度性质与退款',
        value: '数字化消耗品，充入即交付，原则上不退款',
      },
      {
        label: '适用法律与仲裁',
        value: '中国香港特别行政区法律 · HKIAC 仲裁',
      },
    ],
    sections: [
      {
        id: 'operator-territory-warranties',
        number: '1',
        title: '运营主体、服务区域与用户保证',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '本《服务条款》为您与 ',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              ' 运营方（以下简称“TOKEX”或“我们”，官方联系邮箱：',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '）之间具有法律约束力的协议。本平台仅面向中国大陆以外的海外地区及非受限司法管辖区（且须年满 ',
              { type: 'strong', text: `${LEGAL_CONFIG.minimumAge} 周岁` },
              '并具备完全民事行为能力）提供服务，不向中国大陆境内提供服务。您注册账户、生成 API 密钥、购买计算额度或调用接口，即构成一项具有法律约束力的陈述与保证，确认您身处允许使用本服务的司法管辖区、具备完全缔约资格，且未通过任何技术手段规避区域限制，同时无条件接受本条款、',
              { type: 'link', label: '《隐私政策》', to: '/privacy-policy' },
              '及',
              { type: 'link', label: '《可接受使用政策》', to: '/aup' },
              '的全部内容。若您作出虚假陈述或违规从受限地区接入，即构成严重违约，TOKEX 有权立即终止您的账户，并取消全部剩余计算额度的使用资格且不予退还。',
            ],
          },
        ],
      },
      {
        id: 'service-scope-boundaries',
        number: '2',
        title: '服务范围与平台边界',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX 仅提供面向开发者的 API 网关路由、用量计量与预付费计算额度核算服务，绝对不提供任何第三方官方消费端 AI 账号或会员的代开通、代充值、合租或转售服务。计算额度属于一经交付即完成履约的数字化服务消耗品，并非电子货币或储值资金。模型推理高度依赖第三方上游供应商，TOKEX 不对任何特定模型的持续可用性、输出稳定性、速率限制或响应延迟作任何保证，且有权随时根据上游通道状态调整或下线特定模型。',
          },
        ],
      },
      {
        id: 'account-api-key-security',
        number: '3',
        title: '账户与 API 密钥安全',
        blocks: [
          {
            type: 'paragraph',
            content:
              '您必须自行妥善保管登录凭证、Passkey、OAuth 会话及 API 密钥。通过您的账户或 API 密钥发起的所有调用请求及产生的计算额度消耗，均视为您的本人行为。无论是否因您保管不当或客户端遭入侵导致密钥泄露，由此产生的一切费用与后果均由您自行全额承担，TOKEX 无义务追回或赔偿已消耗的计算额度。',
          },
        ],
      },
      {
        id: 'pricing-billing-taxes',
        number: '4',
        title: '定价调整、支付结算（MoR）与税费',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '平台服务均以美元（USD）计价。模型单价与分组倍率主要依据上游供应商成本及通道状态动态调整；常规调价在网站',
              { type: 'link', label: '定价页', to: '/pricing' },
              '公布后对后续新调用生效，若涉及核心主力模型倍率大幅上调，TOKEX 将尽可能提前通过站内公告予以提示。您账户内尚未消耗的以美元计价的计算额度，将按调用发生时的实时单价折算消耗。订单结算由记录商户（MoR）及支付处理商 ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              ' 独立处理并代征适用税费，TOKEX 不采集、不处理也不存储您的任何银行卡号、有效期或 CVV 安全码。',
            ],
          },
        ],
      },
      {
        id: 'credits-no-refund-policy',
        number: '5',
        title: '计算额度性质与不退款政策',
        blocks: [
          {
            type: 'paragraph',
            content:
              '您购买的预付费计算额度在账户正常存续期间长期有效，活动赠送或兑换码额度以具体发放规则为准。由于计算额度属于支付确认后即刻交付的数字化消耗品，一经充入账户，原则上在任何情况下均不支持退款、提现或跨账户转让。若因极少数特殊情形（包括但不限于经核实的异常重复扣款、平台业务调整终止运营，或经 TOKEX 单方酌情批准的例外申请）最终产生实际退款，除记录商户依据强制性金融规则全额原路退回的纯通道技术故障外，TOKEX 有权从实付退款总额中统一扣除 10% 作为账户清算与行政管理手续费。若您违反本协议或《可接受使用政策》，TOKEX 有权立即永久封禁您的账户，并取消全部剩余计算额度的使用资格且不予退还。若因不可抗力、上游供应商断供或业务调整导致平台停止运营，TOKEX 将提前发布公告并终止服务，对于尚未消耗的已购计算额度所对应的实付金额，平台有权在扣除上述 10% 账户清算与行政管理手续费后退还剩余净额，且不承担任何额外违约赔偿责任。',
          },
        ],
      },
      {
        id: 'billing-disputes-chargebacks',
        number: '6',
        title: '账单争议与拒付限制',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '如遇账单疑问或计算额度延迟到账，请优先通过 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' 联系我们核查处理。严禁在计算额度已正常交付的情况下，向发卡行或 ',
              { type: 'strong', text: LEGAL_CONFIG.paymentProcessor },
              ' 发起无合理依据的恶意拒付（Chargeback）。任何发起无依据或恶意拒付的行为均构成严重违约，TOKEX 有权立即永久封禁相关账户、取消全部剩余计算额度的使用资格且不予退还，并向 ',
              LEGAL_CONFIG.paymentProcessor,
              ' 提交完整调用日志与交付凭证进行抗辩及追索。',
            ],
          },
        ],
      },
      {
        id: 'content-ownership-license',
        number: '7',
        title: '内容权属与处理许可',
        blocks: [
          {
            type: 'paragraph',
            content:
              '在适用法律允许范围内，您保留对 API 输入与生成输出的权利，并授予 TOKEX 为完成接口路由、用量计费、缓存加速及合规风控审查所必需的全球性、免版税技术处理许可。AI 生成内容具有概率性与不确定性，您在使用或向终端用户展示前须自行核验，TOKEX 不对输出内容的准确性、合法性或适用性承担任何责任。',
          },
        ],
      },
      {
        id: 'disclaimer-limitation-liability',
        number: '8',
        title: '免责声明与责任限制',
        blocks: [
          {
            type: 'paragraph',
            content: `本服务严格按“现状（AS IS）”与“现有可用（AS AVAILABLE）”基础提供，TOKEX 明确排除一切明示或暗示的担保，包括但不限于对不间断服务、无错误运行、特定用途适用性及不侵权的担保。在法律允许的最大范围内，TOKEX 不对任何间接、附带、惩罚性或后果性损害（包括利润损失、业务中断或数据丢失）承担责任。无论基于何种诉由，TOKEX 对您的累计赔偿责任上限绝对不超过您账户内尚未消耗的已购计算额度对应的实付金额，或索赔事件发生前 ${LEGAL_CONFIG.liabilityCapMonths} 个月内您实际向 TOKEX 支付的净服务费用总额（以两者中较高者为准）。`,
          },
        ],
      },
      {
        id: 'indemnification',
        number: '9',
        title: '用户赔偿保障（Indemnification）',
        blocks: [
          {
            type: 'paragraph',
            content:
              '若因您违反本协议或《可接受使用政策》、违规将接口接入高风险应用、侵害任何第三方知识产权或隐私权，或因您终端用户的行为而引发任何第三方索赔、监管调查、行政处罚或诉讼，您同意为 TOKEX 及其运营方提供全面辩护，并全额赔偿 TOKEX 因此遭受的一切直接与间接损失，包括但不限于合理的律师费、诉讼费、和解金及罚款。',
          },
        ],
      },
      {
        id: 'amendments-governing-law',
        number: '10',
        title: '协议修订、适用法律、争议解决与语言效力',
        blocks: [
          {
            type: 'paragraph',
            content: `TOKEX 有权随时修订本条款，修订后的文本一经在网站公布即自动生效，您继续使用本服务即视为接受修订内容。本协议的订立、效力、解释与履行均受${LEGAL_CONFIG.governingLawZh}管辖（不适用冲突法规则）。因本协议引起的或与本协议有关的任何争议，双方应首先友好协商解决；协商不成的，均应提交香港国际仲裁中心（HKIAC）依据其届时有效的仲裁规则进行终局仲裁，仲裁地点为香港，仲裁语言为英文。本协议以英文版本为准，任何其他语言译本仅为方便阅读而提供，若存在歧义或冲突，一概以英文版本具有最高法律效力。`,
          },
        ],
      },
    ],
  },
}
