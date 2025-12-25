# DeepSeek 爬虫脚本使用说明

本项目新增了使用 DeepSeek AI 的爬虫脚本，可以爬取所有 Hacker News 上的副业项目数据。

## 功能特点

- ✅ 使用 DeepSeek AI API（成本更低）
- ✅ 爬取所有评论数据（无数量限制）
- ✅ 实时进度显示
- ✅ 中间结果自动保存（每年数据处理完后保存）
- ✅ 防止 API 限流（自动延迟）
- ✅ 错误容错处理

## 设置步骤

### 1. 获取 DeepSeek API Key

访问 [DeepSeek 平台](https://platform.deepseek.com/) 注册并获取 API Key。

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件：

\`\`\`bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
\`\`\`

### 3. 安装依赖

\`\`\`bash
pnpm install
\`\`\`

### 4. 运行爬虫

\`\`\`bash

# 使用 DeepSeek AI 爬取所有数据

pnpm crawl:deepseek

# 或使用原始的 OpenAI 版本（仅爬取部分数据）

pnpm crawl
\`\`\`

## 数据输出

爬取的数据将保存到 `data/projects.json` 文件中，格式如下：

\`\`\`json
[
{
"name": "项目名称",
"url": "项目网址",
"description": "项目描述（中文或英文）",
"revenue": "$500/月",
"stack": ["技术 1", "技术 2"],
"year": 2025
}
]
\`\`\`

## 爬取范围

脚本会爬取以下年份的 Hacker News 帖子：

- 2025 (Thread ID: 46307973)
- 2024 (Thread ID: 42373343)
- 2023 (Thread ID: 38467691)
- 2022 (Thread ID: 34190421)
- 2021 (Thread ID: 29667095)
- 2020 (Thread ID: 24947167)
- 2019 (Thread ID: 20899863)
- 2018 (Thread ID: 17790306)
- 2017 (Thread ID: 15148804)

## 脚本对比

| 特性     | crawl.ts (OpenAI) | crawl-deepseek.ts (DeepSeek) |
| -------- | ----------------- | ---------------------------- |
| AI 模型  | GPT-4o            | DeepSeek Chat                |
| 数据量   | 每年限制 5 条评论 | 爬取所有评论                 |
| 成本     | 较高              | 较低                         |
| 进度显示 | 基础              | 详细（显示提取数/处理数）    |
| 中间保存 | 否                | 是（每年保存一次）           |
| 防限流   | 否                | 是（100ms 延迟）             |

## 注意事项

1. **API 成本**：虽然 DeepSeek 成本较低，但爬取所有数据仍会产生一定费用，请注意控制
2. **运行时间**：爬取所有年份的所有评论可能需要较长时间（取决于评论数量）
3. **中断恢复**：如果脚本中断，可以重新运行，已处理的年份数据会被保留
4. **数据质量**：AI 提取的数据可能不是 100% 准确，建议人工审核

## 故障排除

### API Key 错误

确保 `.env.local` 文件中的 `DEEPSEEK_API_KEY` 配置正确。

### 网络错误

检查网络连接，确保可以访问：

- https://api.deepseek.com
- https://hacker-news.firebaseio.com

### 依赖错误

运行 `pnpm install` 重新安装依赖。
