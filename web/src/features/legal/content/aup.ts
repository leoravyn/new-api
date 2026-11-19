import type { BilingualLegalDocument } from '../types'
import { LEGAL_CONFIG } from './legal-config'

export const AUP_CONTENT: BilingualLegalDocument = {
  en: {
    id: 'aup',
    title: 'Acceptable Use Policy & AI Model Usage Guidelines',
    subtitle:
      'Safety rules, prohibited content categories, moderation standards, and high-risk safeguards aligned with Waffo, Anthropic, and OpenAI usage policies.',
    badge: 'AUP & AIGC Safety Standard',
    summaryPoints: [
      {
        label: 'Policy Alignment',
        value:
          'Waffo AUP / AIGC + Anthropic Usage Policy + OpenAI Usage Policies',
      },
      {
        label: 'Zero-Tolerance Core',
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
        title: 'Purpose, Scope & Independent Operation',
        blocks: [
          {
            type: 'paragraph',
            content: [
              'This Acceptable Use Policy & AI Model Usage Guidelines ("AUP") governs all API requests, web playground usage, prompts, system instructions, tool/function calls, files, images, audio, and outputs transmitted through ',
              { type: 'strong', text: LEGAL_CONFIG.brandName },
              ' (',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              '), and is incorporated by reference into our ',
              { type: 'link', label: 'Terms of Service', to: '/terms' },
              '.',
            ],
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Independent Gateway & Non-Resale Disclosure',
            content:
              'TOKEX is an independent developer API gateway operated by TOKEX Individual Operator. TOKEX is NOT an official consumer application of Anthropic or OpenAI, and strictly prohibits misrepresenting TOKEX as an official provider or using the platform to proxy, resell, or top up third-party consumer subscriptions.',
          },
        ],
      },
      {
        id: 'six-mandatory-categories',
        number: '2',
        title: 'Six Mandatory Prohibited Content Categories',
        blocks: [
          {
            type: 'paragraph',
            content:
              'You may not use TOKEX to generate, process, store, or distribute content falling into any of the following six prohibited categories:',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              [
                {
                  type: 'strong',
                  text: 'Pornography, Sexually Explicit Content (NSFW) & NCII: ',
                },
                'Sexually explicit acts, adult pornography, sexual fetishes, incest, bestiality, erotic roleplay, or Non-Consensual Intimate Imagery (NCII), including synthetic or AI-generated intimate depictions.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Violence, Gore, Terrorism & Self-Harm: ',
                },
                'Graphic violence, gore, animal cruelty, promotion, recruitment, or tactical instruction for terrorism or violent extremism, mass-casualty attacks, suicide encouragement/instruction, self-harm, or eating disorders.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Hate Speech, Harassment & Doxxing: ',
                },
                'Content promoting hatred, dehumanization, incitement to violence, or unlawful discrimination based on race, ethnicity, nationality, religion, caste, gender, sexual orientation, disability, or protected characteristics; targeted bullying, stalking, intimidation, or doxxing (publishing private addresses/identities to incite harm).',
              ],
              [
                {
                  type: 'strong',
                  text: 'Child Safety & CSAM / CSAE (Zero Tolerance): ',
                },
                'Any Child Sexual Abuse Material (CSAM) or Child Sexual Exploitation and Abuse (CSAE), including photorealistic or stylized/illustrated AI-generated depictions of minors under 18, online grooming, sextortion, child trafficking, or sexualization/fetishization of minors. Confirmed incidents trigger immediate permanent termination and mandatory reporting to the National Center for Missing & Exploited Children (NCMEC) and competent law enforcement authorities.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Deepfakes & Non-Consensual Real-Person Impersonation: ',
                },
                'Creating, altering, or impersonating a real living or deceased person’s likeness, body, voice, or identity across all prohibited deepfake forms—including (i) face swapping, (ii) nudification ("deep nude"), (iii) synthetic intimate scenes, and (iv) fabricated speeches, endorsements, or actions—regardless of claimed consent where deceptive or harmful. Uploading real-person photographs, video, or voice samples to any multimodal endpoint without verified legal authorization is strictly forbidden.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Copyright, Trademark, IP Infringement & Plagiarism: ',
                },
                'Unauthorized reproduction, distribution, or derivative exploitation of copyrighted works, DRM/copy-protection circumvention, counterfeit branding, trademark misuse, or unattributed plagiarism violating third-party intellectual property rights.',
              ],
            ],
          },
        ],
      },
      {
        id: 'anthropic-openai-safety',
        number: '3',
        title:
          'Zero-Tolerance Security & Harm Prohibitions (Anthropic & OpenAI Aligned)',
        blocks: [
          {
            type: 'paragraph',
            content:
              'In full alignment with Anthropic Usage Policy and OpenAI Usage Policies, TOKEX enforces zero tolerance against any use involving:',
          },
          {
            type: 'list',
            items: [
              [
                {
                  type: 'strong',
                  text: 'CBRN / CBRNE Weapons & Lethal Arms: ',
                },
                'Designing, synthesizing, optimizing, sourcing precursors for, or lowering technical barriers to Chemical, Biological, Radiological, Nuclear, or high-yield Explosive (CBRN/CBRNE) weapons, improvised explosive devices (IEDs), autonomous weapons targeting systems, or export-control evasion.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Cyberattacks, Malware & Critical Infrastructure Disruption: ',
                },
                'Developing malware, ransomware, exploits, C2 implants, or credential-harvesting kits; orchestrating DDoS attacks or botnets; or probing, disrupting, or compromising critical infrastructure (power grids, water supply, medical devices, telecommunications, emergency response, transportation, election systems, financial institutions, or defense systems). Authorized defensive testing is permitted only within documented legal permission.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Illegal Acts, Fraud, Scams & Predatory Practices: ',
                },
                'Facilitating illicit drugs/controlled substances, human trafficking, phishing lures, romance/investment scams, extortion, counterfeit identity or government/financial documents, spam automation, pyramid schemes, or predatory lending.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Prohibited Surveillance, Biometric Scraping & Criminal-Justice Scoring: ',
                },
                'Scraping or compiling unauthorized personal dossiers; building facial-recognition databases or conducting public real-time biometric identification; non-consensual tracking/geolocation; predictive policing; automated criminal-justice arrest, sentencing, or parole decisions; social/trustworthiness scoring; government censorship filtering; or biometric categorization of protected attributes.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Election Interference & Deceptive Campaigns: ',
                },
                'Voter suppression, false voting time/location/eligibility instructions, candidate or official impersonation, undisclosed automated political campaigning or synthetic political media, astroturfing, fake reviews, or harmful medical/public-health disinformation.',
              ],
            ],
          },
        ],
      },
      {
        id: 'platform-integrity',
        number: '4',
        title: 'Platform Integrity, Anti-Jailbreak & Anti-Distillation Rules',
        blocks: [
          {
            type: 'list',
            items: [
              [
                {
                  type: 'strong',
                  text: 'No Jailbreaking or Safety Filter Bypass: ',
                },
                'You may not use prompt injection, adversarial suffixes, encoding obfuscation, roleplay framing, or automated fuzzing to circumvent TOKEX content filters or upstream provider (Anthropic / OpenAI) guardrails.',
              ],
              [
                {
                  type: 'strong',
                  text: 'No Model Distillation or Competing Training: ',
                },
                'You may not systematically scrape outputs, extract hidden reasoning traces, or use TOKEX API responses to train, fine-tune, distill, or replicate competing foundation AI models.',
              ],
              [
                {
                  type: 'strong',
                  text: 'No Ban Evasion or Payment/Region Abuse: ',
                },
                'Creating multiple accounts to evade suspension, using stolen payment methods or abusive chargebacks, evading supported-region rules, or unauthorized proxying/reselling of third-party consumer plans is strictly prohibited.',
              ],
            ],
          },
        ],
      },
      {
        id: 'high-risk-use-cases',
        number: '5',
        title: 'High-Risk Use Cases & Mandatory Human Oversight',
        blocks: [
          {
            type: 'paragraph',
            content:
              'If you integrate TOKEX APIs into applications affecting high-stakes domains—including Medical or Mental Health advice, Legal counsel, Finance/Investment/Tax guidance, Credit scoring, Insurance underwriting, Housing, Employment/Hiring, Education/Credentials, Healthcare access, Public benefits, Civil/Immigration adjudication, Law enforcement, or Autonomous Physical Equipment—you MUST enforce all three safeguards below:',
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
                'Every consequential recommendation, diagnosis, eligibility decision, or legal/financial output must be reviewed and approved by a qualified human professional before delivery to impacted individuals.',
              ],
              [
                { type: 'strong', text: 'Clear AI Disclosure: ' },
                'End-users and affected individuals must be clearly informed that AI is being used; AI agents and chatbots must never be represented as human professionals or licensed practitioners.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Physical Safety Limits & Kill-Switches: ',
                },
                'Deployers bear full responsibility for tool-use and agentic actions and must maintain independent hardware/software safety boundaries and an immediate human override/kill-switch before interfacing with physical actuators or machinery.',
              ],
            ],
          },
        ],
      },
      {
        id: 'moderation-mechanisms',
        number: '6',
        title: 'Content Moderation & Upstream Safeguards',
        blocks: [
          {
            type: 'list',
            items: [
              [
                {
                  type: 'strong',
                  text: 'Automated Input, Output & Anomaly Screening: ',
                },
                'TOKEX applies automated prompt/input policy checks, output risk classification, actively maintained abuse blocklists, and real-time traffic anomaly monitoring to detect jailbreak attempts, malware payloads, CSAM/NCII patterns, and automated abuse.',
              ],
              [
                {
                  type: 'strong',
                  text: 'Upstream Provider Enforcement: ',
                },
                'All traffic routed to upstream providers (such as Anthropic and OpenAI) passes through their respective real-time safety classifiers. Repeated upstream safety rejections or abuse signals sent back to TOKEX trigger escalated account review.',
              ],
              [
                { type: 'strong', text: 'Human Audit & Sampling: ' },
                'Flagged high-severity alerts, user abuse reports, and anomalous usage spikes undergo dedicated operator review in compliance with our Privacy Policy.',
              ],
            ],
          },
        ],
      },
      {
        id: 'severity-sla',
        number: '7',
        title: 'Violation Severity Matrix & Response SLAs',
        blocks: [
          {
            type: 'paragraph',
            content:
              'Reported or detected violations are triaged into four severity tiers with defined initial response and resolution targets:',
          },
          {
            type: 'table',
            headers: [
              'Severity Tier',
              'Representative Violations',
              'Initial Response SLA',
              'Resolution SLA',
            ],
            rows: [
              [
                'Level 1 (Critical / Zero-Tolerance)',
                'CSAM/CSAE, CBRN/CBRNE weapons, terrorism, critical infrastructure cyberattack, active self-harm facilitation',
                'Within 2 hours',
                'Within 24 hours (immediate permanent ban + mandatory authority/NCMEC referral)',
              ],
              [
                'Level 2 (High Severity)',
                'Deepfakes/NCII, malware/phishing, biometric surveillance, election interference, severe fraud, persistent jailbreaks',
                'Within 24 hours',
                'Within 3 business days (key revocation / account suspension)',
              ],
              [
                'Level 3 (Moderate / Commercial Abuse)',
                'Model distillation/scraping, copyright/IP infringement, undisclosed high-risk use, harassment, spam',
                'Within 3 business days',
                'Within 7 business days (endpoint restriction, formal warning, or suspension)',
              ],
              [
                'Level 4 (Minor / Technical Misuse)',
                'Isolated accidental policy boundary trigger, missing downstream AI disclosure notice',
                'Within 5 business days',
                'Within 15 business days (written remediation notice)',
              ],
            ],
          },
        ],
      },
      {
        id: 'enforcement-ladder',
        number: '8',
        title: 'Enforcement Ladder',
        blocks: [
          {
            type: 'paragraph',
            content:
              'Depending on severity, intent, and recurrence, TOKEX applies proportional enforcement measures:',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Written Compliance Warning & Mandatory Remediation Notice.',
              'Automated Request Rejection, Rate-Limit Throttling, or Specific API Key Revocation.',
              'Restriction of Access to Specific Models or Endpoints.',
              'Temporary Account Suspension Pending Investigation.',
              [
                'Permanent Account Termination with forfeiture of remaining credits as set forth in Section 6 of our ',
                { type: 'link', label: 'Terms of Service', to: '/terms' },
                '.',
              ],
              'Mandatory Reporting to Law Enforcement, NCMEC, or Payment Network Compliance Teams where required.',
            ],
          },
        ],
      },
      {
        id: 'reporting-appeals',
        number: '9',
        title: 'Abuse Reporting & Independent Appeals',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Reporting Violations or IP Claims: ' },
                'To report suspected AUP violations, CSAM, non-consensual likeness misuse, security vulnerabilities, or DMCA/copyright claims, email ',
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
                ' with relevant timestamps, request IDs, URLs, and supporting evidence.',
              ],
              [
                { type: 'strong', text: 'Independent Appeals Process: ' },
                'If you believe your API key or account was restricted or suspended in error, you may submit a written appeal within 14 calendar days to ',
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
                ' using the subject prefix "AUP Appeal:" along with your registered account email and factual explanation. Appeals undergo independent human review separate from automated triggers, and a reasoned written determination is issued within the applicable SLA window.',
              ],
            ],
          },
        ],
      },
      {
        id: 'updates-contact',
        number: '10',
        title: 'Policy Updates & Compliance Contact',
        blocks: [
          {
            type: 'paragraph',
            content:
              'We update this AUP as regulatory obligations, payment-network rules, and upstream provider safety policies (Anthropic and OpenAI) evolve. Material updates take effect upon posting with an updated Effective Date.',
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'Operator: ' },
                `${LEGAL_CONFIG.operatorName} (${LEGAL_CONFIG.operatorTypeEn})`,
              ],
              [
                { type: 'strong', text: 'Safety, Reporting & Appeals Email: ' },
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
    id: 'aup',
    title: '可接受使用政策与大模型使用规范',
    subtitle:
      '全面对齐 Waffo 合规要求及 Anthropic、OpenAI 官方使用政策的内容安全标准、禁止行为清单与审核处置规范。',
    badge: 'AUP 与 AIGC 安全合规标准',
    summaryPoints: [
      {
        label: '合规对齐基准',
        value: 'Waffo AUP/AIGC + Anthropic 与 OpenAI 使用政策',
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
        label: '举报与独立申诉邮箱',
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
              '本《可接受使用政策与大模型使用规范》（简称“本规范”或“AUP”）适用于通过 ',
              { type: 'strong', text: LEGAL_CONFIG.brandName },
              '（',
              {
                type: 'external',
                label: LEGAL_CONFIG.siteUrl,
                href: LEGAL_CONFIG.siteUrl,
              },
              '）发起的所有 API 请求、控制台在线测试、提示词、系统指令、工具调用、文本、图像、音频及输出结果，并作为不可分割的组成部分纳入 ',
              { type: 'link', label: '服务条款', to: '/terms' },
              '。',
            ],
          },
          {
            type: 'callout',
            tone: 'info',
            title: '独立网关与禁止代充声明',
            content:
              'TOKEX 是由 TOKEX 个人运营主体独立运营的开发者 API 网关，并非 Anthropic 或 OpenAI 的官方消费端应用；严禁将本平台伪装为官方客户端，或用于代理、转售、代充任何第三方消费级 AI 会员账号。',
          },
        ],
      },
      {
        id: 'six-mandatory-categories',
        number: '2',
        title: '六大强制禁止内容类别',
        blocks: [
          {
            type: 'paragraph',
            content:
              '任何用户均不得利用 TOKEX 生成、处理、存储或传播属于以下六大强制禁止类别的内容：',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              [
                {
                  type: 'strong',
                  text: '色情低俗内容（NSFW）与非自愿私密影像（NCII）：',
                },
                '露骨性行为描写、成人色情内容、性癖幻想、乱伦/兽交、色情角色扮演对话，以及任何非自愿私密影像（含 AI 合成图像）。',
              ],
              [
                {
                  type: 'strong',
                  text: '暴力血腥、恐怖主义与自残自杀：',
                },
                '极端血腥暴行、虐待动物、宣扬或教授恐怖主义与暴力极端主义、大规模杀伤袭击策划，以及自杀诱导/教程、自残或进食障碍引导。',
              ],
              [
                {
                  type: 'strong',
                  text: '仇恨言论、骚扰恐吓与人肉搜索（Doxxing）：',
                },
                '基于种族、民族、国籍、宗教、性别、性取向、残障等受保护特征煽动仇恨、非人化贬损、暴力威胁或歧视；针对性网络霸凌、跟踪威胁及曝光他人隐私住址/身份（人肉搜索）。',
              ],
              [
                {
                  type: 'strong',
                  text: '儿童安全与涉未成年人侵害内容（CSAM / CSAE，绝对零容忍）：',
                },
                '任何形式的儿童性虐待材料（CSAM）或儿童性剥削侵害（CSAE），包括描绘未满 18 周岁未成年人的写实或二次元/风格化 AI 生成涉黄图像、网络诱拐（Grooming）、性勒索（Sextortion）、儿童拐卖及未成年人性化/恋童角色扮演。一经确认将立即永久封禁并依法强制向 NCMEC 及主管执法机关举报。',
              ],
              [
                {
                  type: 'strong',
                  text: '深度伪造（Deepfakes）与未经授权的真人肖像/声音冒用：',
                },
                '以任何方式合成、篡改或冒用真实自然人（在世或已故）的相貌、身体、声音或身份，明确禁止以下四种深度伪造形式：（1）人脸替换（换脸）；（2）AI 一键脱衣/裸化（Deep Nude）；（3）合成亲密/性暗示场景；（4）伪造他人演讲、代言或行为——无论是否声称获得同意，凡涉及欺诈、侵权或伤害均严厉禁止。若接口支持上传图像或音频，严禁未经合法书面授权上传真人照片或语音样本。',
              ],
              [
                {
                  type: 'strong',
                  text: '版权、商标、知识产权侵权与剽窃：',
                },
                '未经授权复制、分发受版权保护的作品、绕过数字版权管理（DRM）、商标假冒或侵犯第三方知识产权的未署名剽窃行为。',
              ],
            ],
          },
        ],
      },
      {
        id: 'anthropic-openai-safety',
        number: '3',
        title: '零容忍安全红线（全面对齐 Anthropic 与 OpenAI 使用政策）',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX 严格遵循并同步落实 Anthropic Usage Policy 与 OpenAI Usage Policies 的全部通用安全标准，严禁以下行为：',
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: 'CBRN / CBRNE 武器与致命军备：' },
                '设计、优化、合成、获取前体或降低化学、生物、放射性、核或高能爆炸物（CBRN/CBRNE）武器制造门槛；简易爆炸装置（IED）；自主武器瞄准系统或规避出口管制。',
              ],
              [
                {
                  type: 'strong',
                  text: '网络攻击、恶意软件与关键基础设施破坏：',
                },
                '编写勒索软件、木马后门、漏洞利用载荷或凭证窃取工具；发起 DDoS 攻击或控制僵尸网络；探测、入侵或破坏电网、供水、医疗设备、通信、应急救援、交通、选举系统、金融系统或军事基地等关键基础设施（经合法授权的防御性安全测试除外）。',
              ],
              [
                {
                  type: 'strong',
                  text: '违法犯罪、网络诈骗与掠夺性欺诈：',
                },
                '协助管制药品交易、人口贩卖、钓鱼诈骗邮件、杀猪盘/投资欺诈、勒索敲诈、伪造身份证件或政府/金融文件、批量垃圾信息、传销或高利贷掠夺。',
              ],
              [
                {
                  type: 'strong',
                  text: '违规生物识别监控与刑事司法/社会信用评分：',
                },
                '未经授权抓取并建立个人隐私档案库；构建人脸识别数据库或开展公共场所实时生物特征识别；非自愿位置追踪；预测性警务；自动化逮捕、量刑或假释司法决策；社会信用/可信度评分；政府审查过滤或基于生物特征对受保护属性进行分类。',
              ],
              [
                {
                  type: 'strong',
                  text: '选举干预与隐蔽性虚假宣传：',
                },
                '压制选民投票、散布虚假投票时间/地点/资格指引、冒充候选人或选举机构、未披露 AI 来源的自动化政治拉票或合成政治媒体、水军刷评（Astroturfing）以及危害公众健康的虚假医疗/科学信息。',
              ],
            ],
          },
        ],
      },
      {
        id: 'platform-integrity',
        number: '4',
        title: '平台完整性、反越狱与反模型蒸馏规则',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '禁止越狱与绕过安全护栏：' },
                '严禁利用越狱提示词（Jailbreak）、提示词注入（Prompt Injection）、编码混淆或对抗样本等手段绕过 TOKEX 或上游供应商（Anthropic / OpenAI）的安全过滤机制。',
              ],
              [
                { type: 'strong', text: '禁止模型蒸馏、抓取与竞品训练：' },
                '严禁批量抓取模型输出、提取受保护推理过程或将 API 响应结果用于训练、微调或蒸馏具有竞争关系的基础大模型。',
              ],
              [
                { type: 'strong', text: '禁止规避封禁与支付/地区欺诈：' },
                '严禁通过注册多账号规避封禁、使用盗刷支付方式或恶意拒付、规避服务支持地区限制，或未经授权转售/代理第三方消费级订阅。',
              ],
            ],
          },
        ],
      },
      {
        id: 'high-risk-use-cases',
        number: '5',
        title: '高风险领域应用规范与强制人工复核',
        blocks: [
          {
            type: 'paragraph',
            content:
              '若您将 TOKEX 接口用于高风险决策或专业建议场景——包括医疗健康与心理咨询、法律建议、金融投资与税务、信用评估、保险核保、住房分配、招聘雇佣、学历认证、医保资格、公共福利、民事/移民裁决、执法司法或自主物理设备控制——必须同时满足以下三项强制控制措施：',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              [
                {
                  type: 'strong',
                  text: '具备资质的专业人员复核（Human-in-the-Loop）：',
                },
                '向最终受影响个人交付任何实质性建议、诊断或资格决定前，必须经由持证或具备相应执业资质的人类专业人员完成审查把关。',
              ],
              [
                { type: 'strong', text: '明确的 AI 身份披露：' },
                '必须向终端用户清晰告知其正在接收人工智能生成内容或与 AI 系统交互，严禁冒充人类专家或执业机构。',
              ],
              [
                { type: 'strong', text: '物理安全限位与人工急停机制：' },
                '部署方对代理工具调用承担全部责任；涉及物理设备或自动化执行系统时，必须配置独立的硬件/软件安全限位及即时人工急停开关（Kill-Switch）。',
              ],
            ],
          },
        ],
      },
      {
        id: 'moderation-mechanisms',
        number: '6',
        title: '多层内容审核与上游安全协同机制',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '自动化输入输出检测与异常流量拦截：' },
                '平台部署自动化提示词策略筛查、输出风险分类、动态维护的违规拦截词库及实时异常调用监测，精准识别越狱攻击、恶意载荷及涉黄涉暴风险。',
              ],
              [
                { type: 'strong', text: '上游模型供应商安全联动：' },
                '所有转发至上游模型供应商（Anthropic、OpenAI 等）的请求同时受上游安全审查系统实时监控；高频触发上游安全拦截的账号将被自动标记并升级复查。',
              ],
              [
                { type: 'strong', text: '人工复审与周期性合规抽检：' },
                '对高危告警事件、用户举报线索及异常调用峰值，由运营人员在严格遵守隐私政策的前提下开展独立人工核查。',
              ],
            ],
          },
        ],
      },
      {
        id: 'severity-sla',
        number: '7',
        title: '违规分级标准与 SLA 响应时效',
        blocks: [
          {
            type: 'paragraph',
            content:
              '系统检测或人工举报的安全违规行为按严重程度划分为四个等级，并对应明确的响应与处置时效承诺：',
          },
          {
            type: 'table',
            headers: [
              '违规等级',
              '典型违规情形',
              '首次响应 SLA',
              '最终处置 SLA',
            ],
            rows: [
              [
                'Level 1（极高危 / 零容忍）',
                'CSAM/CSAE 儿童侵害、CBRN 武器、恐怖主义、关键基础设施攻击、积极自残自杀引导',
                '2 小时内',
                '24 小时内（立即永久封禁并依法向执法机构 / NCMEC 报告）',
              ],
              [
                'Level 2（高危违规）',
                '深度伪造 / NCII、恶意软件与钓鱼诈骗、违禁生物识别监控、选举干预、持续越狱攻击',
                '24 小时内',
                '3 个工作日内（吊销密钥 / 暂停账户）',
              ],
              [
                'Level 3（中危 / 商业滥用）',
                '模型蒸馏与批量抓取、版权/商标侵权、高风险领域未披露、骚扰与垃圾信息',
                '3 个工作日内',
                '7 个工作日内（模型权限限制、警告或暂停服务）',
              ],
              [
                'Level 4（轻度 / 技术性误触）',
                '偶发性策略边界误触、下游应用未清晰标注 AI 身份提示',
                '5 个工作日内',
                '15 个工作日内（发送书面整改通知并核验修复）',
              ],
            ],
          },
        ],
      },
      {
        id: 'enforcement-ladder',
        number: '8',
        title: '分级处置措施阶梯',
        blocks: [
          {
            type: 'paragraph',
            content:
              'TOKEX 依据违规危害程度、主观恶意及历史记录采取逐级递进的处置措施：',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              '发送合规提醒与限期整改书面通知。',
              '自动拦截违规请求、实施速率降级限流或吊销特定 API 密钥。',
              '限制特定模型或接口的调用权限。',
              '核查期间临时冻结账户访问权限。',
              [
                '永久终止账户并依据 ',
                { type: 'link', label: '服务条款', to: '/terms' },
                ' 第 6 条没收账户内剩余额度。',
              ],
              '依法向主管执法部门、NCMEC 或支付网络合规团队移交必要证据。',
            ],
          },
        ],
      },
      {
        id: 'reporting-appeals',
        number: '9',
        title: '违规举报渠道与独立申诉机制',
        blocks: [
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '安全事件与侵权举报：' },
                '如发现涉嫌违反本规范的内容、儿童安全威胁、未经授权真人肖像/声音冒用、安全漏洞或版权 DMCA 投诉，请立即附带时间戳、请求 ID 及证据材料发送邮件至 ',
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
                '。',
              ],
              [
                { type: 'strong', text: '独立申诉复核流程：' },
                '若您认为自己的密钥或账户遭遇误判处置，可在收到处置通知之日起 14 个日历日内发送邮件至 ',
                { type: 'email', email: LEGAL_CONFIG.supportEmail },
                '（邮件标题请注明“AUP Appeal:”并附注册邮箱与事实说明）。申诉案件将由独立于自动拦截规则的复审流程重新评估，并在对应 SLA 时限内出具书面复核结论。',
              ],
            ],
          },
        ],
      },
      {
        id: 'updates-contact',
        number: '10',
        title: '规范更新与合规联系方式',
        blocks: [
          {
            type: 'paragraph',
            content:
              '随着监管法规、支付卡组织合规准则以及 Anthropic 和 OpenAI 官方安全政策演进，我们将持续更新本规范，重大变更将在更新生效日期后即时适用。',
          },
          {
            type: 'list',
            items: [
              [
                { type: 'strong', text: '运营主体：' },
                LEGAL_CONFIG.operatorNameZh,
              ],
              [
                { type: 'strong', text: '安全举报与独立申诉邮箱：' },
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
                { type: 'strong', text: '受理时间：' },
                LEGAL_CONFIG.businessHoursZh,
              ],
            ],
          },
        ],
      },
    ],
  },
}
