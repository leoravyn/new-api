import type { BilingualLegalDocument } from '../types'
import { LEGAL_CONFIG } from './legal-config'

export const AUP_CONTENT: BilingualLegalDocument = {
  en: {
    id: 'aup',
    title: 'Acceptable Use Policy & AI Model Usage Guidelines',
    subtitle:
      'Prohibited content, security rules, and high-risk safeguards for using TOKEX APIs and playground.',
    badge: 'Acceptable Use Policy',
    summaryPoints: [
      {
        label: 'Policy Scope',
        value: 'All API calls, playground requests, prompts, and outputs',
      },
      {
        label: 'Zero-Tolerance Red Lines',
        value: 'CSAM, CBRN/CBRNE, Deepfakes/NCII, Cyberattacks, Jailbreaking',
      },
      {
        label: 'Critical Response SLA',
        value: 'L1 incidents: 2h initial response / 24h resolution',
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
        title: 'Scope & Independent Gateway Notice',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'This Acceptable Use Policy ("AUP") applies to all API requests, playground usage, prompts, files, and outputs transmitted through ',
              { type: 'strong', text: LEGAL_CONFIG.brandName },
              ' (',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              ') and forms part of our ',
              { type: 'link', label: 'Terms of Service', to: '/terms' },
              '.',
            ],
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Independent API Gateway',
            content:
              'TOKEX is an independent developer API gateway, not an official consumer application of Anthropic or OpenAI. You may not misrepresent TOKEX as an official provider or use it to resell, proxy, or top up third-party consumer subscriptions.',
          },
        ],
      },
      {
        id: 'prohibited-content',
        number: '2',
        title: 'Prohibited Content Categories',
        blocks: [
          {
            type: 'list',
            ordered: true,
            items: [
              [
                {
                  type: 'strong',
                  text: 'Child Safety & CSAM / CSAE (Zero Tolerance): ',
                },
                'Any Child Sexual Abuse Material (CSAM) or Child Sexual Exploitation and Abuse (CSAE), including realistic or stylized AI-generated depictions of minors under 18, grooming, or sextortion. Confirmed violations trigger immediate permanent ban and mandatory reporting to NCMEC and law enforcement.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Pornography, Sexually Explicit Content (NSFW) & NCII: ',
                },
                'Explicit sexual acts, adult pornography, erotic roleplay, or Non-Consensual Intimate Imagery (NCII), including synthetic intimate depictions.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Deepfakes & Non-Consensual Real-Person Impersonation: ',
                },
                'Impersonating or altering a real living or deceased person’s likeness, body, voice, or identity—including face swapping, nudification ("deep nude"), synthetic intimate scenes, or fabricated statements/endorsements—without verified legal authorization.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Violence, Gore, Terrorism & Self-Harm: ',
                },
                'Extreme violence, gore, animal cruelty, terrorism or violent extremism promotion/instruction, suicide encouragement, or self-harm instruction.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Hate Speech, Harassment & Doxxing: ',
                },
                'Content promoting hatred, violence, or discrimination based on protected characteristics; targeted harassment, bullying, extortion, or doxxing (exposing private personal data).',
              ],
              [
                {
                  type: 'strong',
                  text: 'Copyright, Trademark & IP Infringement: ',
                },
                'Unauthorized reproduction or distribution of copyrighted works, DRM circumvention, trademark counterfeiting, or IP infringement.',
              ],
            ],
          },
        ],
      },
      {
        id: 'security-prohibitions',
        number: '3',
        title: 'Security & Illegal Activity Prohibitions',
        blocks: [
          {
            type: 'list',
            items: [
              [
                {
                  type: 'strong',
                  text: 'CBRN / CBRNE Weapons & Lethal Arms: ',
                },
                'Designing, synthesizing, sourcing precursors for, or assisting with Chemical, Biological, Radiological, Nuclear, or high-yield Explosive (CBRN/CBRNE) weapons or autonomous weapons systems.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Cyberattacks, Malware & Critical Infrastructure: ',
                },
                'Developing malware, ransomware, exploits, or credential-harvesting tools; running DDoS attacks; or probing/disrupting critical infrastructure without documented authorization.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Fraud, Scams & Illegal Acts: ',
                },
                'Facilitating controlled substances, human trafficking, phishing, financial scams, counterfeit identity/official documents, or spam automation.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Biometric Scraping & Criminal-Justice Scoring: ',
                },
                'Building unauthorized personal dossiers or facial-recognition databases, real-time biometric tracking, social scoring, or automated criminal-justice arrest/sentencing decisions.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Election Interference & Disinformation: ',
                },
                'Voter suppression, false voting instructions, candidate impersonation, undisclosed synthetic political campaigns, or harmful medical disinformation.',
              ],
            ],
          },
        ],
      },
      {
        id: 'platform-integrity',
        number: '4',
        title: 'Platform Integrity, Anti-Jailbreak & Anti-Distillation',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'No Jailbreaking: ' },
                'Do not use prompt injection, encoding obfuscation, or adversarial framing to bypass TOKEX or upstream provider (Anthropic / OpenAI) safety filters.',
              ],
              [
                { type: 'strong', text: 'No Model Distillation: ' },
                'Do not scrape outputs, extract reasoning traces, or use API responses to train, fine-tune, or distill competing foundation AI models.',
              ],
              [
                { type: 'strong', text: 'No Ban Evasion or Payment Abuse: ' },
                'Do not create multiple accounts to evade restrictions, use fraudulent payment methods, or initiate abusive chargebacks.',
              ],
            ],
          },
        ],
      },
      {
        id: 'high-risk-use-cases',
        number: '5',
        title: 'High-Risk Domains & Human Oversight',
        blocks: [
          {
            type: 'paragraph',
            content:
              'Applications in medical, mental health, legal, financial, tax, credit, insurance, housing, employment, education, or physical equipment control must enforce three safeguards:',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              [
                {
                  type: 'strong',
                  text: 'Qualified Human-in-the-Loop Review: ',
                },
                'A qualified human professional must review and approve consequential recommendations or decisions before delivery to end-users.',
              ],
              [
                { type: 'strong', text: 'Clear AI Disclosure: ' },
                'End-users must be clearly informed that content is AI-generated; AI systems must never be presented as licensed human professionals.',
              ],
              [
                { type: 'strong', text: 'Safety Limits & Kill-Switches: ' },
                'Any integration with physical equipment or automated actuators must include independent safety limits and an immediate human override/kill-switch.',
              ],
            ],
          },
        ],
      },
      {
        id: 'severity-enforcement',
        number: '6',
        title: 'Moderation, Severity SLAs & Enforcement',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX combines automated policy screening, upstream provider safety classifiers, and human review of flagged alerts. Violations are handled according to severity:',
          },
          {
            type: 'table',
            headers: [
              'Severity Tier',
              'Representative Violations',
              'Initial Response SLA',
              'Resolution SLA & Action',
            ],
            rows: [
              [
                'Level 1 (Critical)',
                'CSAM/CSAE, CBRN weapons, terrorism, critical infrastructure attack, self-harm instruction',
                'Within 2 hours',
                'Within 24 hours (immediate permanent ban + NCMEC/law enforcement referral)',
              ],
              [
                'Level 2 (High)',
                'Deepfakes/NCII, malware/phishing, biometric surveillance, election interference, persistent jailbreaks',
                'Within 24 hours',
                'Within 3 business days (key revocation or account suspension)',
              ],
              [
                'Level 3 (Moderate)',
                'Model distillation/scraping, IP infringement, undisclosed high-risk use, harassment, spam',
                'Within 3 business days',
                'Within 7 business days (endpoint restriction, warning, or suspension)',
              ],
              [
                'Level 4 (Minor)',
                'Isolated policy boundary trigger, missing downstream AI disclosure',
                'Within 5 business days',
                'Within 15 business days (written remediation notice)',
              ],
            ],
          },
          {
            type: 'paragraph',
            content: [
              'Permanent account termination for AUP violations results in forfeiture of remaining credits under Section 5 of our ',
              { type: 'link', label: 'Terms of Service', to: '/terms' },
              '.',
            ],
          },
        ],
      },
      {
        id: 'reporting-appeals',
        number: '7',
        title: 'Abuse Reporting & Independent Appeals',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Reporting Violations: ' },
                'Report suspected AUP violations, security issues, or copyright/IP claims to ',
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
                ' with timestamps, request IDs, and supporting details.',
              ],
              [
                { type: 'strong', text: 'Independent Appeals: ' },
                'If you believe your key or account was restricted in error, email ',
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
                ' within 14 calendar days with the subject prefix "AUP Appeal:" and your registered email. Appeals receive independent human review and a written decision within the applicable SLA window.',
              ],
            ],
          },
        ],
      },
    ],
  },
  zhCN: {
    id: 'aup',
    title: '可接受使用政策与大模型使用规范',
    subtitle: '规范 TOKEX API 网关与在线测试的内容安全红线、禁止行为及违规处置流程。',
    badge: '可接受使用政策 (AUP)',
    summaryPoints: [
      {
        label: '适用范围',
        value: '所有 API 请求、在线测试、提示词及输出结果',
      },
      {
        label: '零容忍红线',
        value: '儿童侵害、CBRN 武器、深度伪造/NCII、网络攻击、越狱绕过',
      },
      {
        label: '严重违规响应 SLA',
        value: 'L1 极高危事件：2 小时内首次响应 / 24 小时内处置闭环',
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
        title: '适用范围与独立运营声明',
        blocks: [
          {
            type: 'paragraph',
            content: [
              '本《可接受使用政策与大模型使用规范》（简称“AUP”）适用于通过 ',
              { type: 'strong', text: LEGAL_CONFIG.brandName },
              '（',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              '）发起的所有 API 调用、在线测试、输入提示词与输出结果，并构成 ',
              { type: 'link', label: '服务条款', to: '/terms' },
              ' 的组成部分。',
            ],
          },
          {
            type: 'callout',
            tone: 'info',
            title: '独立 API 网关声明',
            content:
              'TOKEX 是独立运营的开发者 API 网关，并非 Anthropic 或 OpenAI 的官方消费端应用；严禁将本平台伪装为官方客户端，或用于代理、转售、代充第三方消费级 AI 会员账号。',
          },
        ],
      },
      {
        id: 'prohibited-content',
        number: '2',
        title: '六大禁止内容类别',
        blocks: [
          {
            type: 'list',
            ordered: true,
            items: [
              [
                {
                  type: 'strong',
                  text: '儿童安全与涉未成年人侵害（CSAM / CSAE，零容忍）：',
                },
                '任何形式的儿童性虐待或性剥削内容（含写实或二次元/AI 生成的未满 18 周岁未成年人涉黄描绘、网络诱拐及性勒索）。一经确认立即永久封禁，并依法向 NCMEC 及执法机关报告。',
              ],
              [
                {
                  type: 'strong',
                  text: '色情低俗（NSFW）与非自愿私密影像（NCII）：',
                },
                '露骨性行为描写、成人色情、色情角色扮演及任何非自愿私密影像（含 AI 合成内容）。',
              ],
              [
                {
                  type: 'strong',
                  text: '深度伪造（Deepfakes）与真人肖像/声音冒用：',
                },
                '未经合法授权合成、篡改或冒用真实自然人（在世或已故）的相貌、身体、声音或身份，包括换脸、AI 脱衣（Deep Nude）、合成亲密场景或伪造发言/代言。',
              ],
              [
                {
                  type: 'strong',
                  text: '暴力血腥、恐怖主义与自残自杀：',
                },
                '极端血腥暴力、虐待动物、宣扬或指导恐怖主义与极端暴力、自杀诱导或自残教程。',
              ],
              [
                {
                  type: 'strong',
                  text: '仇恨言论、骚扰恐吓与人肉搜索（Doxxing）：',
                },
                '基于种族、国籍、宗教、性别、残障等特征煽动仇恨或歧视；网络霸凌、敲诈勒索或曝光他人隐私住址/身份。',
              ],
              [
                {
                  type: 'strong',
                  text: '知识产权侵权与剽窃：',
                },
                '未经授权复制或分发受版权保护的作品、绕过 DRM、商标假冒或侵犯第三方知识产权。',
              ],
            ],
          },
        ],
      },
      {
        id: 'security-prohibitions',
        number: '3',
        title: '安全与违法活动禁令（对齐 Anthropic 与 OpenAI 政策）',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'CBRN / CBRNE 武器与致命军备：' },
                '设计、合成、获取前体或协助制造化学、生物、放射性、核及高能爆炸物武器或自主致命武器系统。',
              ],
              [
                {
                  type: 'strong',
                  text: '网络攻击、恶意软件与关键基础设施破坏：',
                },
                '编写勒索软件、木马、漏洞利用或凭证窃取工具；发起 DDoS 攻击；未经授权探测或破坏电网、医疗、通信、金融等关键基础设施。',
              ],
              [
                {
                  type: 'strong',
                  text: '欺诈、诈骗与违法犯罪：',
                },
                '协助管制药品交易、人口贩卖、钓鱼诈骗、金融欺诈、伪造身份/公文或批量垃圾信息。',
              ],
              [
                {
                  type: 'strong',
                  text: '违规生物识别监控与社会/司法评分：',
                },
                '未经授权抓取个人隐私档案或建立人脸识别库、非自愿位置追踪、社会信用评分或自动化刑事司法裁决。',
              ],
              [
                {
                  type: 'strong',
                  text: '选举干预与虚假信息：',
                },
                '散布虚假投票指引、冒充候选人、未披露 AI 来源的自动化政治宣传或危害公共健康的虚假医疗信息。',
              ],
            ],
          },
        ],
      },
      {
        id: 'platform-integrity',
        number: '4',
        title: '平台完整性、反越狱与反模型蒸馏',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '禁止越狱与绕过护栏：' },
                '严禁使用越狱提示（Jailbreak）、提示词注入（Prompt Injection）或编码混淆绕过 TOKEX 或上游模型（Anthropic / OpenAI）的安全过滤。',
              ],
              [
                { type: 'strong', text: '禁止模型蒸馏与竞品训练：' },
                '严禁批量抓取模型输出、提取推理链或将 API 响应结果用于训练、微调或蒸馏竞品基础大模型。',
              ],
              [
                { type: 'strong', text: '禁止规避封禁与恶意拒付：' },
                '严禁注册多账号规避限制、盗刷支付或发起恶意拒付。',
              ],
            ],
          },
        ],
      },
      {
        id: 'high-risk-use-cases',
        number: '5',
        title: '高风险领域使用要求',
        blocks: [
          {
            type: 'paragraph',
            content:
              '在医疗、心理、法律、金融投资、税务、信用评估、保险、住房、招聘、教育认证或物理设备控制等高风险场景中集成 API，必须同时落实以下三项措施：',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              [
                {
                  type: 'strong',
                  text: '专业人员复核（Human-in-the-Loop）：',
                },
                '任何实质性建议、诊断或资格决定在交付终端用户前，必须经具备相应资质的人类专业人员审核确认。',
              ],
              [
                { type: 'strong', text: '明确 AI 身份披露：' },
                '必须明确告知终端用户内容由 AI 生成，不得冒充人类专家或执业机构。',
              ],
              [
                { type: 'strong', text: '物理安全限位与急停开关：' },
                '涉及物理设备或自动化执行机构时，必须配备独立安全限位与即时人工急停开关（Kill-Switch）。',
              ],
            ],
          },
        ],
      },
      {
        id: 'severity-enforcement',
        number: '6',
        title: '审核机制、违规分级 SLA 与处置',
        blocks: [
          {
            type: 'paragraph',
            content:
              '平台结合自动化策略筛查、上游安全分类器及人工复核对违规行为进行分级处置：',
          },
          {
            type: 'table',
            headers: [
              '违规等级',
              '典型情形',
              '首次响应 SLA',
              '处置 SLA 与措施',
            ],
            rows: [
              [
                'Level 1（极高危）',
                'CSAM/CSAE 儿童侵害、CBRN 武器、恐怖主义、关键基础设施攻击、自残自杀指导',
                '2 小时内',
                '24 小时内（立即永久封禁并依法向执法机构 / NCMEC 报告）',
              ],
              [
                'Level 2（高危）',
                '深度伪造 / NCII、恶意软件与钓鱼诈骗、违规生物识别监控、选举干预、持续越狱',
                '24 小时内',
                '3 个工作日内（吊销密钥或暂停账户）',
              ],
              [
                'Level 3（中危）',
                '模型蒸馏与抓取、知识产权侵权、高风险场景未披露、骚扰与垃圾信息',
                '3 个工作日内',
                '7 个工作日内（限制接口、警告或暂停服务）',
              ],
              [
                'Level 4（轻度）',
                '偶发策略误触、下游应用未清晰标注 AI 身份',
                '5 个工作日内',
                '15 个工作日内（发送书面整改通知）',
              ],
            ],
          },
          {
            type: 'paragraph',
            content: [
              '因严重违规被永久终止账户的，剩余额度将依据 ',
              { type: 'link', label: '服务条款', to: '/terms' },
              ' 第 5 条予以没收且不予退还。',
            ],
          },
        ],
      },
      {
        id: 'reporting-appeals',
        number: '7',
        title: '违规举报与独立申诉复核流程',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '违规与侵权举报：' },
                '如发现违规内容、安全漏洞或版权侵权，请附时间戳、请求 ID 及证据发送至 ',
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
                '。',
              ],
              [
                { type: 'strong', text: '独立申诉复核流程：' },
                '若认为密钥或账户被误判限制，可在收到通知起 14 个日历日内发送邮件至 ',
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
                '（标题注明“AUP Appeal:”并附注册邮箱与说明），由人工复核并在对应 SLA 时限内出具书面结论。',
              ],
            ],
          },
        ],
      },
    ],
  },
}
