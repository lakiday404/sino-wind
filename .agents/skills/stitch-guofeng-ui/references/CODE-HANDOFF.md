# 从 Stitch 稿到代码的落地约定

> Stitch 产出的是**视觉意图**，不是可交付实现。生成稿确认后，按本文把它翻译成符合本项目工程的 React 19 + Less 代码。
> 依据：`readme.md` §6.2、`DEVELOPMENT_GUIDE.md` 四、`TRD_PHASE2.md` 六。

## 1. 翻译清单（视觉决策 → 工程实现）

| Stitch 稿里的 | 代码里落成 |
| :--- | :--- |
| 色值 `#9E2A2B` 等 | `@color-seal` 等 `variables.less` 变量，**不写死十六进制** |
| 圆角 10px / 6px | `@radius-card` / `@radius-seal` |
| 1px 描边 | `@border-classic` 或 `1px dashed #D5CAB5` |
| 图标 | `import { XxxOutline } from 'antd-mobile-icons'`，不引入图标图片 |
| 出图稿的 px 尺寸 | 按动态 rem 换算：`1rem = clamp(视口宽, 320, 540) / 10`（375px 宽时 1rem = 37.5px） |
| 界面文案 | 写入 JSX（或后端字段），不走图片贴字 |
| 动效意图 | 只用 `transform` / `opacity` + `transition 0.2s~0.3s ease` |
| 数据展示位 | 对齐 `docs/PHASE2_API_CONTRACT.md` 的真实字段；无数据显示占位 |

## 2. 新增页面的标准动作

```text
1. frontend/src/pages/XxxPage.jsx        新建页面组件
2. frontend/src/styles/xxx.less          新建同名样式（顶部 @import '../styles/variables.less'）
3. frontend/src/App.jsx                  注册路由
   - 需要底部 Tab 栏 → 嵌套在 Layout 子路由内
   - 全屏沉浸页（如对话页）→ 一级路由
4. 接口调用走 frontend/src/http/index.js 导出的 axios 实例（自动带 Token、统一 Toast）
```

- 页面代码只放 `pages/`，公共组件放 `components/`，SQL 收拢在 `backend/src/models/`（若本次涉及后端）。
- 不改动白名单外的既有页面（`TRD_PHASE2.md` §6.1）；确需改动时在 PR 描述里说明理由。

## 3. 提交前自查

- [ ] `cd frontend && npm run build` 零报错、零未使用变量警告
- [ ] 375px 视口无横向滚动，底栏不遮挡内容
- [ ] 图标全部来自 `antd-mobile-icons`，无位图图标、无字符箭头
- [ ] 颜色/圆角/边框全部走变量
- [ ] 交互控件点击区域 ≥ 44px（`DESIGN.md` 移动端要求）
- [ ] 断网/弱网下不白屏（AI 接口失败有兜底提示）
- [ ] 提交附带 `docs/handovers/ai-log-<姓名>-<日期>.md`（`TRD_PHASE2.md` §6.4）

## 4. 建议的提交信息

```bash
git checkout -b feat/xxx
git add .
git commit -m "feat: 完成 XX 页国风重构（对齐 DESIGN.md 令牌与 antd-mobile-icons 规范）"
git push origin feat/xxx
```

## 5. 生成稿与本约定冲突时

以 `DESIGN.md` + `variables.less` + 本约定为准，回退生成稿。若确认是规范本身需要更新，先在 PR 中单独提出对 `DESIGN.md` 的修改，再据此出图，避免设计与文档各说各话。
