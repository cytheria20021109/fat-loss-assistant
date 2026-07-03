# Espace Sémantique · 个人语义空间

法式复古未来主义的 3D 个人网站：履历不再是页面，而是一片可漫游的语义星云。

## 技术栈

- **Next.js 14 (App Router)** — 前后端一体的全栈框架
- **React Three Fiber + drei** — 3D 语义空间
- **GSAP** — 相机运镜（聚焦滑行）
- **Framer Motion** — DOM 面板与文字转场
- **Tailwind CSS + 自写 GLSL Shader** — 低饱和色板、大气渐变、胶片颗粒
- **zustand** — 空间状态（滚动 / 悬停 / 聚焦）

## 目录结构

```
espace-semantique/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx              # 首页（服务端取数 → 3D 场景）
│   │   ├── layout.tsx
│   │   ├── globals.css           # 色板 CSS 变量 + 全局颗粒 + 空间排版
│   │   └── api/v1/               # REST API（版本化，便于长期演进）
│   │       ├── health/
│   │       └── portfolio/        # 全量 & 分版块数据
│   ├── components/
│   │   ├── Experience.tsx        # 总装配：数据注入 + 滚动/触摸/Esc 监听
│   │   ├── canvas/               # 所有 WebGL 组件
│   │   │   ├── Scene.tsx         # Canvas、雾、点击虚空返回
│   │   │   ├── Backdrop.tsx      # 大气渐变着色器（全屏）
│   │   │   ├── CameraRig.tsx     # 漫游 / 凝视两种运镜
│   │   │   ├── SemanticField.tsx # 节点 + 语义连线 + 版块题名
│   │   │   ├── SemanticNode.tsx  # 单枚节点（菲涅尔光晕 + 浮动标签）
│   │   │   └── Dust.tsx          # 浮尘粒子
│   │   └── dom/
│   │       ├── Overlay.tsx       # 字标 / 版块索引 / 进度线 / 引导语
│   │       └── NodeDossier.tsx   # 聚焦节点时的档案卡片
│   ├── shaders/                  # GLSL（atmosphere / node / dust）
│   ├── lib/                      # palette 色板 + zustand store
│   └── server/                   # ★ 后端模块层（与 UI 完全解耦）
│       ├── data/portfolio.json   # 当前数据源（内容都改这里）
│       └── modules/portfolio/
│           ├── types.ts          # 端到端共享的领域类型
│           ├── repository.ts     # 数据访问（未来换数据库只改这层）
│           └── service.ts        # 领域逻辑（局部偏移 → 世界坐标）
```

## 运行

```bash
npm install
npm run dev      # http://localhost:3000
```

推送到 `main` 即自动构建并部署到 GitHub Pages（见 `.github/workflows/deploy-pages.yml`）。

## 交互语言（无按钮）

| 动作 | 含义 |
| --- | --- |
| 滚轮 / 触摸滑动 | 在星云中前行、后退 |
| 悬停节点 | 光晕亮起，标签浮现 |
| 单击节点 | 相机滑近，档案卡片从雾中浮现 |
| 点击虚空 / 滚动 / Esc | 离开节点，回到漫游 |
| 悬停右缘索引 | 浮现版块中文名；单击滑行至该星团 |

## 如何扩展

- **改内容**：编辑 `src/server/data/portfolio.json`（节点的 `offset` 是相对版块中心的位置）。
- **加版块**：JSON 中追加 section（给一个更深的 `center` z 值），前端自动生成星团、连线与索引；如需延长相机路径，调 `src/lib/palette.ts` 的 `CAMERA_PATH.end`。
- **加后端模块**：在 `src/server/modules/<name>/` 新建 repository + service，再挂 `src/app/api/v1/<name>/route.ts`。
- **接数据库**：只替换 `repository.ts` 的实现（返回类型不变），Supabase / Postgres / CMS 均可。
