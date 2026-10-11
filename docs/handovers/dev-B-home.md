# 📅 开发交接记录：陈思卉（小卉）/ 成员 B

> 负责模块：主入口与公共导航域【雅集 & 底栏导航】
> 分支：`feat/phase1-home`（派生自 `main@8ffc0be`）

---

# 📌 记录一：2026-10-10 · 首页与底栏国风重构（首版）

* **提交**：`b77f0e8` — `feat(home): 实现首页云山竹简诗签卷轴与四大雅席宫格及底栏三栏重构`
* **完成度**：100%（阶段一 UI 范围）

### 完成内容
1. 底栏三栏改造（雅集 `/home`、观藏 `/ai`、书斋 `/mine`），激活态朱砂高亮；
2. 首页题头「云山竹简」+ 朱砂小印【华风】+ 副标「读千年风雅 与君共此山河」；
3. 【每日诗签】横向卷轴（朱砂竖挂签 + 书法名句 + 出处落款 + 闲章）；
4. 岁时节气物候栏（城市天气 / 农历干支 / 廿四节气卡）；
5. 四大雅席 2×2 宫格（博古识器 / 先贤论道 / 飞花诗令 / 四般闲事）。
6. 修复原实现缺陷：底栏激活态用 `window.location.pathname` 快照导致刷新后高亮错乱 → 改为 `useLocation()` 实时派生。

---

# 📌 记录二：2026-10-10 · 按设计稿高保真对齐（第二版）

* **提交**：`a12e51a`（本轮）+ 本次收尾提交
* **参照设计稿**：`c38016af1034660ba31d3932382c2764.jpg`（首页 · 云山竹简 900×1600）

### 一、 本轮完成工作详述

1. **卡片改为「左文右图」**（原实现为图上文下）：左列朱砂红楷体标题 + 两行释义 + `›` + 朱砂方角按钮「进入 ›」，右列插画。
2. **四雅标题改朱砂红** `@color-seal`，并统一楷体。
3. **描金细边 + 回纹角标**：抽出 `.gu-frame()` 混入，统一应用于诗签卷轴 / 时令栏 / 雅席卡（左上、右下回纹角）。
4. **诗签卷轴补齐两端木轴**（竹木色渐变 + 内阴影），并嵌入右侧山水小景（左缘渐隐蒙版融入宣纸）。
5. **时令栏补齐天气描金图标**（日 + 云内联 SVG）与「清明」旁的小印【华风】。
6. **底栏激活指示改为朱砂横线**（对齐设计稿），并加高至 `1.52rem`（≈1.77rem 含安全区）。
7. **底栏器物图标改用设计稿切图**：`assets/tabbar/tabbar-yaji.png`（亭台）、`tabbar-guancang.png`（青铜鼎）、`tabbar-shuzhai.png`（线装书）；
   - 以 **CSS `mask-image` + `currentColor`** 着色，因此激活态直接随文字变朱砂红，**无需第二套图片**；
   - 切图方式：从设计稿定位图标包围盒 → 以四角底色为基准做 alpha 阈值化 → 输出透明底 PNG（各 0.6~0.8 KB）。
8. **背景铺满视口**：`background-size: 100% 100%` + `fixed` + 14% 宣纸罩层，顶部红日远山、底部湖景舟楫完整呈现（对齐设计稿构图）。
9. **标题/副标加白色柔光** `text-shadow`，提升在山水画上的可读性。
10. **修正底栏 `box-sizing: content-box` 导致的整页横向溢出 23px**（改 `border-box`），并为网格加 `minmax(0,1fr)` + `min-width:0` 防止图片撑宽。

### 二、 本次修改与新增的文件清单 (核对白名单)

> 严格自查：**未修改** `App.jsx`、`styles/global.css`、`styles/variables.less`、`utils/rem.js`。

* **页面**：`frontend/src/pages/Home.jsx`、`frontend/src/pages/Layout.jsx`
* **组件**：`frontend/src/components/HomeCard.jsx`
* **样式**：`frontend/src/styles/home.less`、`frontend/src/styles/layout.less`
* **切图素材**：
  - `frontend/public/assets/home/bg-paper.jpg`（159 KB）
  - `frontend/public/assets/home/yaji-appraise.jpg` / `yaji-debate.jpg` / `yaji-poem.jpg` / `yaji-leisure.jpg`（各 ~20 KB）
  - `frontend/public/assets/home/poem-art.jpg`（5.3 KB）
  - `frontend/public/assets/tabbar/tabbar-yaji.png` / `tabbar-guancang.png` / `tabbar-shuzhai.png`（各 < 1 KB，透明底）

### 三、 接口联调与数据依赖说明

* **已对接后端 API**：无（首页为纯展示页，阶段一不涉及接口）
* **仍使用的 Mock 假数据**（集中在 `Home.jsx` 顶部，阶段二替换即可、无需改结构）：
  - `poem`：`verse[]` / `from` / `seal` / `art`
  - `almanac`：`city` / `temp` / `weather` / `lunar` / `ganzhi` / `term` / `termDesc[]`
  - `yajiEntries[]`：`key` / `title` / `desc[]` / `art` / `path`
* **新增 npm 依赖**：无

### 四、 本地自测与预览效果（真机视口实测）

通过 **Chrome DevTools Protocol 设备模拟**（`Emulation.setDeviceMetricsOverride`）在真实 390×844 视口下实测：

| 检测项 | 390×844（iPhone 12/13/14） | 430×932（Pro Max） |
| :--- | :--- | :--- |
| `rem` 基准 | **39px** = clientWidth/10 ✅ | 43px ✅ |
| 横向溢出 `scrollWidth > clientWidth` | **false** ✅ | false ✅ |
| 底栏宽度 | 390（满宽不溢出）✅ | 430 ✅ |
| 雅席卡宽 × 高 | 176 × 121（4 张一致）✅ | 194 × 133 ✅ |
| 诗签卷轴高 / 时令栏宽 | 121 / 357 ✅ | 133 / 394 ✅ |
| 底栏三个 mask 图标加载 | `[true, true, true]` ✅ | 同 ✅ |
| Console 报错数 | **0** ✅ | 0 ✅ |
| 页面总高 | 920（≈一屏，几乎无需滚动）✅ | 1016 ✅ |

* [x] `npm run build` 打包 **0 报错**（Vite 7.3.0）
* [x] 全站样式仅引用 `variables.less` 的 10 个 token，无硬编码主色
* [x] 底栏三栏互跳正常，激活态朱砂高亮 + 横线正确
* [x] 截图证据：`任务B-首页预览.png`（真机 390×844 模拟，验收可直接引用）

> 💡 说明：直接用 `msedge --screenshot --window-size=390,x` 截图时，`utils/rem.js` 取到的 `clientWidth` 与窗口宽度不一致（rem 被算成 49px 而非 39px），会造成**截图侧假性右侧溢出**。本记录的数值均来自 CDP 设备模拟，属真机等效数据。

---

### 五、 遗留问题与交接提醒 (Blocker)

1. **四雅入口路由为临时映射**：博古识器→`/recognition`、先贤论道→`/ai-chat`、飞花诗令→`/ai`、四般闲事→`/mine`；待阶段二业务页建好后改为正式路径（只需改 `yajiEntries[].path`）。
2. **时令物候为静态 Mock**，未接天气 / 农历接口（阶段二）。
3. **PR 待提**：分支已推送至 `origin/feat/phase1-home`；PR 入口 https://github.com/ki123-gif/sino-wind/pull/new/feat/phase1-home
4. **整站视觉统一尚未达成**：`AuthPage/Login/Register`（成员 A）与 `AIPage/MinePage`（成员 C）仍为旧版亲子教育风格，需两位同学完成后才能通过 M3「全站视觉走通」验收（本人在白名单军规下不越界修改）。
5. 若设计组后续提供**独立器物图标切图**（建议 2 倍图、透明底、单图 ≤200KB），直接替换 `assets/tabbar/` 同名文件即可；雅席插画同理替换 `assets/home/yaji-*.jpg`。
