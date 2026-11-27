/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import type { DocsContentLocale } from './types'

const DOCS_ZH: DocsContentLocale = {
  badge: '接入文档',
  title: 'TOKEX API 接入文档',
  subtitle:
    '使用统一 API 网关接入 Codex、Claude Code 及兼容 OpenAI 协议的客户端与 SDK。',
  tocTitle: '文档目录',
  mobileTocLabel: '查看章节目录',
  baseUrlLabel: 'Base URL',
  quickLinksLabel: '常用入口',
  copyLabel: '复制',
  copiedLabel: '已复制',
  sections: [
    {
      id: 'rules',
      number: '01',
      title: 'API 使用规则',
      summary: '网关地址、推荐端点、令牌分组及基础请求规范。',
    },
    {
      id: 'codex',
      number: '02',
      title: 'Codex CLI',
      summary: '推荐使用 /v1/responses 协议接入 Codex。',
    },
    {
      id: 'claude-code',
      number: '03',
      title: 'Claude Code',
      summary: '通过环境变量接入 /v1/messages 端点。',
    },
    {
      id: 'clients',
      number: '04',
      title: '通用聊天客户端',
      summary: '兼容 Chatbox、Cherry Studio、LobeChat、NextChat、Open WebUI 等。',
    },
    {
      id: 'sdk',
      number: '05',
      title: 'SDK 与 cURL 示例',
      summary: '标准 OpenAI SDK 与命令行调用示例。',
    },
    {
      id: 'troubleshooting',
      number: '06',
      title: '常见问题排查',
      summary: '常见状态码含义与快速处理方式。',
    },
  ],
  rules: {
    endpointsTitle: '接口地址与协议端点',
    endpoints: [
      {
        endpoint: 'POST /v1/responses',
        recommendedFor: 'Codex CLI（推荐）',
        baseUrlNote: 'Base URL 填写 https://api.tokex.vip/v1',
      },
      {
        endpoint: 'POST /v1/messages',
        recommendedFor: 'Claude Code',
        baseUrlNote: 'ANTHROPIC_BASE_URL 填写 https://api.tokex.vip',
      },
      {
        endpoint: 'POST /v1/chat/completions',
        recommendedFor: '通用客户端与 OpenAI SDK',
        baseUrlNote: 'Base URL 填写 https://api.tokex.vip/v1',
      },
    ],
    groupsTitle: '令牌分组说明',
    groupsNotice:
      '密钥按分组隔离。创建令牌前，请前往「模型广场」查看目标模型所属的分组与实时倍率，并在「令牌管理」中选择对应分组；不同分组的密钥不可混用。',
    guidelinesTitle: '使用规范与限制',
    guidelines: [
      '所有 API 请求统一使用 https://api.tokex.vip 作为网关域名。',
      '请注意区分是否包含 /v1：Codex、OpenAI SDK 及常见聊天客户端填写 https://api.tokex.vip/v1；Claude Code 填写 https://api.tokex.vip（不要加 /v1）。',
      '单次请求体上限为 40 MiB，发送图片或长上下文时请注意控制体量。',
      '建议在客户端和 SDK 中保持开启流式输出（stream: true），以获得更好的响应体验。',
      '费用按实际输入输出 Token 数量与所选分组倍率以美元实时结算；禁止恶意压测、高频并发滥用及违反平台使用规范的行为。',
    ],
  },
  codex: {
    groupNote:
      '请在控制台「令牌管理」中创建支持目标模型的分组密钥（可在「模型广场」查看模型所属分组）。',
    step1Title: '第 1 步：写入配置',
    step1Command: `mkdir -p ~/.codex && cat > ~/.codex/config.toml << 'EOF'
model = "gpt-6.2-astra"
model_provider = "tokex"

[model_providers.tokex]
name = "Tokex"
base_url = "https://api.tokex.vip/v1"
env_key = "OPENAI_API_KEY"
wire_api = "responses"
EOF`,
    step2Title: '第 2 步：运行',
    step2Command: `OPENAI_API_KEY="sk-YOUR_KEY" codex`,
    step2PersistLabel: '如需在当前终端会话中持久生效，也可先导出环境变量：',
    step2PersistCommand: `export OPENAI_API_KEY="sk-YOUR_KEY"
codex`,
    footerNote: '其他可用模型 ID 与实时费率可在「模型广场」查看。',
  },
  claudeCode: {
    groupNote:
      '请在控制台「令牌管理」中创建支持目标模型的分组密钥（可在「模型广场」查看模型所属分组）。',
    runTitle: '设置环境变量并启动',
    runCommand: `ANTHROPIC_AUTH_TOKEN="sk-YOUR_KEY" \\
ANTHROPIC_BASE_URL="https://api.tokex.vip" \\
CLAUDE_CODE_DISABLE_1M_CONTEXT=1 \\
claude`,
    persistTitle: '写入 Shell 配置（可选）',
    persistCommand: `export ANTHROPIC_AUTH_TOKEN="sk-YOUR_KEY"
export ANTHROPIC_BASE_URL="https://api.tokex.vip"
export CLAUDE_CODE_DISABLE_1M_CONTEXT=1
claude`,
    envNote:
      'ANTHROPIC_BASE_URL 末尾不要拼接 /v1；保留 CLAUDE_CODE_DISABLE_1M_CONTEXT=1 以确保模型上下文请求兼容。',
  },
  clients: {
    intro:
      '支持所有 OpenAI 兼容的聊天客户端 — Chatbox、Cherry Studio、LobeChat、NextChat、Open WebUI 等。',
    configTitle: '通用配置',
    configRows: [
      {
        label: 'API Host',
        value: 'https://api.tokex.vip/v1',
        copyable: true,
      },
      {
        label: 'API Key',
        value: 'sk-YOUR_KEY',
        hint: '请选择支持目标模型的分组令牌',
      },
      {
        label: 'API Path',
        value: '/chat/completions',
        copyable: true,
      },
    ],
    pathNote:
      '部分客户端会自动在域名末尾补全 /v1。若出现 404 错误，请尝试将 API Host 调整为 https://api.tokex.vip。',
  },
  sdk: {
    intro:
      '使用标准 OpenAI SDK 或任何 OpenAI 兼容客户端，只需修改 base_url 和 api_key。',
    examples: [
      {
        id: 'python',
        label: 'Python (OpenAI SDK)',
        language: 'python',
        filename: 'example.py',
        code: `from openai import OpenAI

client = OpenAI(
    api_key="sk-YOUR_KEY",
    base_url="https://api.tokex.vip/v1"
)

response = client.chat.completions.create(
    model="claude-sonnet-5-5",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
      },
      {
        id: 'curl',
        label: 'cURL',
        language: 'bash',
        filename: 'request.sh',
        code: `curl https://api.tokex.vip/v1/chat/completions \\
  -H "Authorization: Bearer sk-YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "claude-sonnet-5-5", "messages": [{"role": "user", "content": "Hello!"}]}'`,
      },
    ],
    groupNote:
      '请确保所使用的密钥所属分组支持目标模型；各分组支持的模型清单与费率可在「模型广场」查看。',
  },
  troubleshooting: {
    items: [
      {
        code: '401',
        title: '密钥无效或未授权',
        detail: '请检查 sk- 开头的令牌是否复制完整、是否被禁用或余额不足。',
      },
      {
        code: '404',
        title: '请求路径错误',
        detail:
          '请核对接口地址是否重复或遗漏了 /v1（Claude Code 不加 /v1，OpenAI 客户端一般需带 /v1）。',
      },
      {
        code: '413',
        title: '请求体过大',
        detail:
          '单次请求体不能超过 40 MiB，请精简上下文或压缩附带的图片数据。',
      },
      {
        code: '429',
        title: '请求过于频繁',
        detail: '请适当降低并发连接数或请求频率后重试。',
      },
      {
        code: '503',
        title: '无可用渠道或分组不匹配',
        detail:
          '请确认密钥所属分组包含所请求的模型，并在「模型广场」核对模型 ID 与所属分组。',
      },
    ],
  },
  resources: {
    title: '常用跳转与平台条款',
    subtitle: '如需获取密钥、查看模型价格或查阅使用条款，可从下方直接前往。',
    platformLinks: [
      { label: 'API 令牌管理', to: '/keys' },
      { label: '模型广场与费率', to: '/pricing' },
      { label: '钱包充值', to: '/wallet' },
    ],
    legalLinks: [
      { label: '服务条款', to: '/terms' },
      { label: '隐私政策', to: '/privacy-policy' },
      { label: '使用规范', to: '/aup' },
      { label: '关于我们', to: '/about' },
    ],
  },
}

const DOCS_EN: DocsContentLocale = {
  badge: 'Documentation',
  title: 'TOKEX API Documentation',
  subtitle:
    'Connect Codex, Claude Code, and OpenAI-compatible clients or SDKs through the unified API gateway.',
  tocTitle: 'Contents',
  mobileTocLabel: 'Jump to section',
  baseUrlLabel: 'Base URL',
  quickLinksLabel: 'Quick Links',
  copyLabel: 'Copy',
  copiedLabel: 'Copied',
  sections: [
    {
      id: 'rules',
      number: '01',
      title: 'API Rules & Endpoints',
      summary:
        'Gateway URL, recommended endpoints, token groups, and usage limits.',
    },
    {
      id: 'codex',
      number: '02',
      title: 'Codex CLI',
      summary: 'Recommended setup using the /v1/responses endpoint.',
    },
    {
      id: 'claude-code',
      number: '03',
      title: 'Claude Code',
      summary: 'Configure environment variables for the /v1/messages endpoint.',
    },
    {
      id: 'clients',
      number: '04',
      title: 'Chat Clients',
      summary:
        'Compatible with Chatbox, Cherry Studio, LobeChat, NextChat, Open WebUI, and more.',
    },
    {
      id: 'sdk',
      number: '05',
      title: 'SDK & cURL',
      summary: 'Standard OpenAI SDK and cURL request examples.',
    },
    {
      id: 'troubleshooting',
      number: '06',
      title: 'Troubleshooting',
      summary: 'Common status codes and quick fixes.',
    },
  ],
  rules: {
    endpointsTitle: 'Endpoints & Protocols',
    endpoints: [
      {
        endpoint: 'POST /v1/responses',
        recommendedFor: 'Codex CLI (Recommended)',
        baseUrlNote: 'Set base_url to https://api.tokex.vip/v1',
      },
      {
        endpoint: 'POST /v1/messages',
        recommendedFor: 'Claude Code',
        baseUrlNote: 'Set ANTHROPIC_BASE_URL to https://api.tokex.vip',
      },
      {
        endpoint: 'POST /v1/chat/completions',
        recommendedFor: 'Chat Clients & OpenAI SDKs',
        baseUrlNote: 'Set base_url to https://api.tokex.vip/v1',
      },
    ],
    groupsTitle: 'Token Group Notice',
    groupsNotice:
      'Keys are scoped by group. Check Model Square for the supported group and live rate of your target model before creating a key—keys from different groups cannot be mixed.',
    guidelinesTitle: 'Usage Rules & Limits',
    guidelines: [
      'Always use https://api.tokex.vip as your API gateway domain.',
      'Pay attention to /v1: Codex, OpenAI SDKs, and chat clients use https://api.tokex.vip/v1, while Claude Code uses https://api.tokex.vip (without /v1).',
      'Maximum request payload size is 40 MiB. Keep large images or long contexts within this limit.',
      'Keep streaming enabled (stream: true) in clients and SDKs for responsive output.',
      'Usage is billed in USD in real time by token count and group multiplier. Automated stress testing, abusive concurrency, and policy violations are prohibited.',
    ],
  },
  codex: {
    groupNote:
      'Create a key in API Keys under a group that supports your target model (check Model Square for group details).',
    step1Title: 'Step 1: Write config',
    step1Command: `mkdir -p ~/.codex && cat > ~/.codex/config.toml << 'EOF'
model = "gpt-6.2-astra"
model_provider = "tokex"

[model_providers.tokex]
name = "Tokex"
base_url = "https://api.tokex.vip/v1"
env_key = "OPENAI_API_KEY"
wire_api = "responses"
EOF`,
    step2Title: 'Step 2: Run',
    step2Command: `OPENAI_API_KEY="sk-YOUR_KEY" codex`,
    step2PersistLabel: 'To persist the key in your current shell session:',
    step2PersistCommand: `export OPENAI_API_KEY="sk-YOUR_KEY"
codex`,
    footerNote:
      'Check Model Square for all available model IDs and live multipliers.',
  },
  claudeCode: {
    groupNote:
      'Create a key in API Keys under a group that supports your target Claude model (check Model Square for group details).',
    runTitle: 'Run with environment variables',
    runCommand: `ANTHROPIC_AUTH_TOKEN="sk-YOUR_KEY" \\
ANTHROPIC_BASE_URL="https://api.tokex.vip" \\
CLAUDE_CODE_DISABLE_1M_CONTEXT=1 \\
claude`,
    persistTitle: 'Persist in shell profile (optional)',
    persistCommand: `export ANTHROPIC_AUTH_TOKEN="sk-YOUR_KEY"
export ANTHROPIC_BASE_URL="https://api.tokex.vip"
export CLAUDE_CODE_DISABLE_1M_CONTEXT=1
claude`,
    envNote:
      'Do not append /v1 to ANTHROPIC_BASE_URL. Keep CLAUDE_CODE_DISABLE_1M_CONTEXT=1 enabled for compatibility.',
  },
  clients: {
    intro:
      'Works with all OpenAI-compatible chat clients — Chatbox, Cherry Studio, LobeChat, NextChat, Open WebUI, and more.',
    configTitle: 'General Configuration',
    configRows: [
      {
        label: 'API Host',
        value: 'https://api.tokex.vip/v1',
        copyable: true,
      },
      {
        label: 'API Key',
        value: 'sk-YOUR_KEY',
        hint: 'Select a key group that supports your chosen model',
      },
      {
        label: 'API Path',
        value: '/chat/completions',
        copyable: true,
      },
    ],
    pathNote:
      'Some apps automatically append /v1 to the host. If you receive a 404 error, try setting API Host to https://api.tokex.vip instead.',
  },
  sdk: {
    intro:
      'With the standard OpenAI SDK or any compatible client, only base_url and api_key need to be changed.',
    examples: [
      {
        id: 'python',
        label: 'Python (OpenAI SDK)',
        language: 'python',
        filename: 'example.py',
        code: `from openai import OpenAI

client = OpenAI(
    api_key="sk-YOUR_KEY",
    base_url="https://api.tokex.vip/v1"
)

response = client.chat.completions.create(
    model="claude-sonnet-5-5",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
      },
      {
        id: 'curl',
        label: 'cURL',
        language: 'bash',
        filename: 'request.sh',
        code: `curl https://api.tokex.vip/v1/chat/completions \\
  -H "Authorization: Bearer sk-YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "claude-sonnet-5-5", "messages": [{"role": "user", "content": "Hello!"}]}'`,
      },
    ],
    groupNote:
      'Ensure your key group supports the requested model. Check Model Square for live group coverage and pricing.',
  },
  troubleshooting: {
    items: [
      {
        code: '401',
        title: 'Invalid or Unauthorized Key',
        detail:
          'Verify that your sk- key is copied completely, enabled, and your wallet has sufficient balance.',
      },
      {
        code: '404',
        title: 'Endpoint Not Found',
        detail:
          'Check whether /v1 is missing or duplicated in your Base URL (omit /v1 for Claude Code; include /v1 for OpenAI clients).',
      },
      {
        code: '413',
        title: 'Payload Too Large',
        detail:
          'Requests must be under 40 MiB. Reduce prompt size or compress attached images.',
      },
      {
        code: '429',
        title: 'Rate Limit Reached',
        detail: 'Lower request concurrency or retry after a short pause.',
      },
      {
        code: '503',
        title: 'No Available Channel / Group Mismatch',
        detail:
          'Ensure your token group covers the requested model and verify the exact model ID and group in Model Square.',
      },
    ],
  },
  resources: {
    title: 'Platform & Legal Links',
    subtitle:
      'Jump directly to API key management, model pricing, or platform policies.',
    platformLinks: [
      { label: 'API Keys', to: '/keys' },
      { label: 'Model Square', to: '/pricing' },
      { label: 'Wallet', to: '/wallet' },
    ],
    legalLinks: [
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Acceptable Use', to: '/aup' },
      { label: 'About', to: '/about' },
    ],
  },
}

export function getDocsContent(isZh: boolean): DocsContentLocale {
  return isZh ? DOCS_ZH : DOCS_EN
}
