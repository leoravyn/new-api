import type { BilingualLegalDocument } from '../types'
import { LEGAL_CONFIG } from './legal-config'

export const AUP_CONTENT: BilingualLegalDocument = {
  en: {
    id: 'aup',
    title: 'Acceptable Use Policy',
    subtitle:
      'Prohibited content, security rules, and high-risk safeguards for using TOKEX APIs and playground.',
    badge: 'Acceptable Use Policy',
    summaryPoints: [
      {
        label: 'Policy Scope',
        value: 'All API calls, playground tests, and transmitted content',
      },
      {
        label: 'Core Red Lines',
        value: 'CSAM/CSAE, NCII, Deepfakes, CBRN, Cyberattacks, Jailbreaking',
      },
      {
        label: 'Appeal Window',
        value: 'Within 7 calendar days of restriction notice',
      },
      {
        label: 'Abuse Reports & Appeals',
        value: { type: 'email', email: LEGAL_CONFIG.supportEmail },
      },
    ],
    sections: [
      {
        id: 'scope-independence',
        number: '1',
        title: 'Scope and Independent Operation',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'This Acceptable Use Policy ("AUP") governs all API calls, playground tests, and transmitted content initiated through ',
              { type: 'strong', text: LEGAL_CONFIG.brandName },
              ' and forms an integral part of our ',
              { type: 'link', label: 'Terms of Service', to: '/terms' },
              '. TOKEX operates strictly as an independent technical API gateway; impersonating any upstream model provider’s official consumer application or using this Platform to proxy, resell, share, or top up third-party consumer AI accounts is strictly prohibited.',
            ],
          },
        ],
      },
      {
        id: 'prohibited-content-activities',
        number: '2',
        title: 'Prohibited Content and Illegal Activities',
        blocks: [
          {
            type: 'paragraph',
            content:
              'You must not use this Platform to generate, store, transmit, or facilitate any unlawful or harmful content, including without limitation: child sexual abuse or exploitation material (CSAM/CSAE) in any form; explicit adult pornography or non-consensual intimate imagery (NCII); unauthorized deepfakes or impersonation of real individuals’ likeness or voice; extreme violence, terrorism promotion, or suicide and self-harm instruction; hate speech, harassment, or doxxing; and infringement of third-party copyrights, trademarks, or other intellectual property rights. Furthermore, you must not use the Platform for chemical, biological, radiological, or nuclear weapons development, cyberattacks or malware creation, financial or telecommunications fraud, unauthorized biometric surveillance, or disseminating deceptive political or medical disinformation.',
          },
        ],
      },
      {
        id: 'security-anti-abuse',
        number: '3',
        title: 'Platform Security and Anti-Abuse Rules',
        blocks: [
          {
            type: 'paragraph',
            content:
              'You are strictly prohibited from using jailbreak prompts, prompt injection, or any technical obfuscation to bypass safety guardrails implemented by TOKEX or upstream providers; scraping model outputs or reasoning chains at scale to train, fine-tune, or distill competing foundation models; or circumventing rate limits and risk controls via multi-account registration, abusive high-concurrency bursts, or header manipulation.',
          },
        ],
      },
      {
        id: 'high-risk-restrictions',
        number: '4',
        title: 'High-Risk Use Restrictions',
        blocks: [
          {
            type: 'paragraph',
            content:
              'You must not deploy AI-generated outputs directly into high-risk domains—including medical diagnosis, psychological counseling, legal adjudication, financial investment advice, credit scoring, or automated physical equipment control—without substantive review by qualified human professionals. If you integrate our APIs into end-user-facing applications, you must clearly disclose to end users that outputs are AI-generated and assume full joint responsibility for downstream compliance and end-user conduct.',
          },
        ],
      },
      {
        id: 'compliance-enforcement',
        number: '5',
        title: 'Compliance Screening and Enforcement',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX reserves the right to inspect anomalous traffic through automated policy filters, upstream safety classifiers, and necessary manual audits. If TOKEX detects or reasonably suspects any violation of this AUP, threat to upstream channel stability, or payment fraud, we may immediately and without prior notice throttle rate limits, revoke API keys, or suspend or permanently terminate your account, revoking access to all remaining compute credits without refund, compensation, or liability pursuant to the Terms of Service.',
          },
        ],
      },
      {
        id: 'reporting-appeals-language',
        number: '6',
        title: 'Reporting, Appeals, and Governing Language',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'To report abuse or intellectual property infringement, please send relevant request logs and evidence to ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '. If you believe your account or API key was restricted in error, you may submit a written appeal from your registered email to ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' within seven (7) calendar days of the restriction notice; TOKEX will review the appeal within a reasonable timeframe and retains sole final discretion. In the event of any discrepancy between the English and translated versions, the English version shall prevail.',
            ],
          },
        ],
      },
    ],
  },
  zhCN: {
    id: 'aup',
    title: '可接受使用政策',
    subtitle: '规范通过 TOKEX 发起的所有 API 调用、在线测试及传输内容的合规与安全准则。',
    badge: '可接受使用政策',
    summaryPoints: [
      {
        label: '适用范围',
        value: '所有 API 调用、在线测试及传输内容',
      },
      {
        label: '核心红线',
        value: 'CSAM/CSAE、NCII、深度伪造、危险军备、网络攻击、越狱绕过',
      },
      {
        label: '申诉期限',
        value: '收到限制通知后 7 个日历日内提交书面说明',
      },
      {
        label: '举报与申诉邮箱',
        value: { type: 'email', email: LEGAL_CONFIG.supportEmail },
      },
    ],
    sections: [
      {
        id: 'scope-independence',
        number: '1',
        title: '适用范围与独立声明',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '本《可接受使用政策》（简称“AUP”）适用于通过 ',
              { type: 'strong', text: LEGAL_CONFIG.brandName },
              ' 发起的所有 API 调用、在线测试及传输内容，并构成本平台',
              { type: 'link', label: '《服务条款》', to: '/terms' },
              '不可分割的一部分。TOKEX 是独立运营的技术网关，严禁将本平台伪装为任何上游模型厂商的官方客户端，严禁用于代理、转售、共享或代充第三方消费端 AI 会员账号。',
            ],
          },
        ],
      },
      {
        id: 'prohibited-content-activities',
        number: '2',
        title: '严禁内容与违法活动',
        blocks: [
          {
            type: 'paragraph',
            content:
              '您不得利用本平台生成、存储、传输或协助传播任何违法或有害内容，包括但不限于：任何形式的未成年人色情或剥削内容（CSAM/CSAE）；露骨成人色情与非自愿私密影像（NCII）；未经授权合成或冒用真实自然人肖像、声音的深度伪造（Deepfakes）；极端暴力血腥、恐怖主义宣传及自残自杀指导；仇恨言论、骚扰恐吓与人肉搜索；以及侵犯第三方著作权、商标权等知识产权的行为。同时，严禁将本平台用于化学、生物、放射性、核武器等危险军备研发、网络攻击与恶意软件编写、电信与金融诈骗、未经授权的生物识别监控或散布虚假政治与医疗信息等任何违法犯罪活动。',
          },
        ],
      },
      {
        id: 'security-anti-abuse',
        number: '3',
        title: '平台安全与反滥用红线',
        blocks: [
          {
            type: 'paragraph',
            content:
              '严禁使用越狱提示（Jailbreak）、提示词注入（Prompt Injection）或任何技术手段绕过 TOKEX 及上游模型供应商的安全护栏；严禁批量抓取模型输出、提取推理链用于训练、微调或蒸馏竞品模型；严禁通过注册多账号、恶意高并发请求或篡改请求头等方式规避平台速率限制与风控策略。',
          },
        ],
      },
      {
        id: 'high-risk-restrictions',
        number: '4',
        title: '高风险场景限制',
        blocks: [
          {
            type: 'paragraph',
            content:
              '严禁将未经具备资质的人类专业人员复核的 AI 生成内容，直接用于医疗诊断、心理干预、法律裁决、金融投资建议、信用评估或物理设备自动化控制等高风险领域。若您将本平台接口集成至面向终端用户的下游产品中，必须明确向终端用户披露内容由 AI 生成，并对下游产品的合规性及终端用户的行为承担全部连带责任。',
          },
        ],
      },
      {
        id: 'compliance-enforcement',
        number: '5',
        title: '违规筛查与单方处置权',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX 有权通过自动化策略过滤器、上游安全分类器及必要的人工抽检对异常流量进行合规排查。一旦平台发现或合理怀疑您的账户存在违反本政策、威胁上游通道安全或涉及支付欺诈的行为，TOKEX 有权在不事先通知的情况下，随时采取限制接口速率、吊销 API 密钥、暂停或永久封禁账户的处置措施，并依据《服务条款》取消全部剩余计算额度的使用资格且不予退还，平台对此不承担任何补偿或违约责任。',
          },
        ],
      },
      {
        id: 'reporting-appeals-language',
        number: '6',
        title: '举报、申诉与语言效力',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '如发现任何违规滥用或侵权行为，请附相关请求记录与证据发送至 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              '。若您认为账户或密钥被风控系统误判限制，可在收到限制通知后 7 个日历日内通过注册邮箱向 ',
              { type: 'email', email: LEGAL_CONFIG.supportEmail },
              ' 提交书面说明申请复核，TOKEX 将在合理时间内处理并保留最终裁决权。本政策如中英文版本存在任何歧义，一概以英文版本为准。',
            ],
          },
        ],
      },
    ],
  },
}
