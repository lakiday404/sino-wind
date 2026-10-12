# `.agents/skills` — 项目内置智能体技能库

本目录存放**可被 AI 编码智能体自动发现的技能（Skill）**，用于把项目的设计规范、接口契约与协作纪律固化成可执行的操作手册，避免每次对话重新口述。

## 目录约定

```text
.agents/skills/
├── README.md                      本说明
└── <skill-name>/                  一个 skill 一个目录，目录名用 kebab-case
    ├── SKILL.md                   必需，技能正文（YAML frontmatter + Markdown）
    └── references/                可选，按需加载的速查表/模板
```

## SKILL.md 格式

```markdown
---
name: <skill-name>            # 必需，kebab-case；建议与目录名一致
description: <一句话说明这个技能做什么、什么时候该用>   # 必需，智能体据此决定是否加载
---

# 标题

正文：适用场景、操作步骤、输出格式、自检清单……
```

- **`name` / `description` 是关键字段**：`name` 缺失时回退取目录名，`description` 决定智能体在什么任务下会想起这个技能，务必写清**触发条件**（做什么 + 何时用）。
- 其他 frontmatter 键（如 `allowed-tools`）会被保留但**不参与加载逻辑**，可留可删，不要依赖它表达约束——真正的约束写进正文。
- 正文只在被加载时才进入上下文，因此可以写长；但**入口要短**：把高频流程放前面，把大表格、逐屏模板放 `references/`，让智能体按需读取。

## 智能体如何发现它

支持工作区技能发现约定的智能体（如 DeepSeek Harness 的项目级技能目录 `.agents/skills`、Codex 系列 `.agents` 约定）会扫描 `<项目根>/.agents/skills/*/SKILL.md` 并登记到技能目录，命中任务时自动加载。因此**本目录随仓库分发，克隆即生效**，无需额外安装。

## 新增一个 skill

1. 建目录 `.agents/skills/<skill-name>/`，写 `SKILL.md`（frontmatter 至少含 `name` + `description`）。
2. 内容以**本项目现有文件为唯一真源**（如 `DESIGN.md`、`frontend/src/styles/variables.less`、`docs/PHASE2_API_CONTRACT.md`），不要另行发明规范；发现文档与代码不一致时，在技能里写明「以谁为准」。
3. 大体积内容放 `references/`，并在 `SKILL.md` 的表里标出每份参考的作用。
4. 按 `TRD_PHASE2.md` §6.4 附 `docs/handovers/ai-log-<姓名>-<日期>.md` 后提 PR。

## 现有技能

| 技能 | 作用 |
| :--- | :--- |
| [`stitch-guofeng-ui`](./stitch-guofeng-ui/SKILL.md) | 把界面需求翻译成可直接投喂 Google Stitch 的国风提示词，并按 `DESIGN.md` 与项目红线校验生成稿 |
