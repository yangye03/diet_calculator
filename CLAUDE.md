# 饮食追踪 PWA 应用

## 项目概述

这是一个健身饮食记录应用，帮助用户追踪每日碳水化合物和蛋白质摄入量。

### 核心功能
- 快速记录每餐的碳水/蛋白质克数
- 实时显示今日剩余可摄入量（大字体+进度条）
- 自由设定每日摄入目标
- 查看今日记录列表（可删除）
- 简单的历史记录查看

### 技术栈
- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS（健身运动风格 - 活力绿色主题）
- **PWA**: vite-plugin-pwa（支持离线使用和添加到主屏幕）
- **存储**: LocalStorage（本地持久化）
- **部署**: GitHub Pages / Vercel

### 目标用户
健身爱好者，需要精确控制每日碳水和蛋白质摄入量。

---

## 架构说明

### 项目结构
```
diet_calculator/
├── index.html              # 入口HTML，包含PWA meta标签
├── vite.config.ts          # Vite配置，包含PWA设置
├── tailwind.config.js      # Tailwind配置，自定义颜色主题
├── public/
│   └── icon.svg            # PWA应用图标
├── src/
│   ├── main.tsx            # React入口
│   ├── App.tsx             # 根组件，包含tab导航和状态管理
│   ├── types/
│   │   └── index.ts        # TypeScript类型定义
│   ├── utils/
│   │   ├── storage.ts      # LocalStorage封装和数据操作
│   │   └── dateUtils.ts    # 日期格式化工具
│   ├── hooks/
│   │   └── useLocalStorage.ts  # LocalStorage Hook
│   └── components/
│       ├── RemainingCard.tsx   # 今日剩余量卡片（顶部）
│       ├── IntakeForm.tsx      # 摄入记录表单
│       ├── IntakeList.tsx      # 今日记录列表
│       ├── GoalsSettings.tsx   # 目标设置页面
│       └── History.tsx         # 历史记录页面
└── CLAUDE.md               # 本文档
```

### 数据流
```
LocalStorage <-> storage.ts <-> App.tsx <-> Components
```

1. 应用启动时从LocalStorage读取数据
2. 用户操作触发数据更新
3. storage.ts处理数据逻辑并保存到LocalStorage
4. App.tsx刷新状态，触发组件重新渲染

---

## 数据结构

### DailyGoals - 每日目标
```typescript
interface DailyGoals {
  carbs: number;      // 碳水化合物目标（克）
  protein: number;    // 蛋白质目标（克）
}
```

### IntakeEntry - 单条摄入记录
```typescript
interface IntakeEntry {
  id: string;         // UUID
  timestamp: number;  // Unix时间戳（毫秒）
  carbs: number;      // 碳水化合物摄入量（克）
  protein: number;    // 蛋白质摄入量（克）
  note?: string;      // 可选备注（如"午餐"）
}
```

### DailyData - 每日数据
```typescript
interface DailyData {
  date: string;       // 日期，格式: YYYY-MM-DD
  goals: DailyGoals;  // 当日目标（可能不同于当前设置）
  entries: IntakeEntry[];  // 当日所有记录
}
```

### LocalStorage存储
- `diet_tracker_data`: DailyData[]（所有历史数据）
- `diet_tracker_goals`: DailyGoals（当前目标设置）

---

## 开发约定

### TypeScript
- 使用严格模式
- 所有组件使用TypeScript
- Props使用interface定义

### 组件命名
- 组件文件名：PascalCase（如`RemainingCard.tsx`）
- 组件函数：export function ComponentName()
- Props interface：ComponentNameProps

### Tailwind类名组织
- 布局类在前（flex, grid, w-, h-）
- 间距类其次（p-, m-, gap-）
- 颜色和视觉类最后（bg-, text-, border-）
- 响应式和状态类在末尾（hover:, active:）

### 颜色使用
- **primary** (绿色): 主要操作、完成状态、充足进度
- **accent** (橙色): 警告、接近目标
- **danger** (红色): 超标、删除操作
- **gray**: 中性元素、文本、边框

---

## 核心功能详解

### 1. 今日页面（Today Tab）
- **RemainingCard**: 显示剩余量，动态颜色进度条
  - 绿色 (0-80%): 充足
  - 橙色 (80-100%): 接近目标
  - 红色 (>100%): 超标
- **IntakeForm**: 快速输入碳水和蛋白质
  - 数字输入（mobile优化）
  - 提交后自动清空和聚焦碳水输入框
- **IntakeList**: 显示今日所有记录
  - 时间倒序（最新的在上）
  - 每条可删除（需确认）

### 2. 目标页面（Goals Tab）
- **GoalsSettings**: 设置每日目标
  - 修改后立即保存到LocalStorage
  - 影响今日和未来所有日期的目标
  - 历史记录保留当时的目标设置

### 3. 历史页面（History Tab）
- **History**: 显示所有历史记录
  - 按日期倒序
  - 显示每日摄入总量 vs 目标
  - 状态标识：✓ 完成、⚠ 超标、未完成

---

## PWA功能

### Manifest配置
- **名称**: 饮食追踪
- **主题色**: #10b981（绿色）
- **显示模式**: standalone（类似原生应用）
- **图标**: icon.svg（512x512）

### Service Worker
- 自动缓存所有资源（JS、CSS、HTML）
- 支持完全离线使用
- 自动更新策略

### 添加到主屏幕（iOS）
1. 在Safari中打开应用URL
2. 点击底部分享按钮
3. 选择"添加到主屏幕"
4. 图标出现在主屏幕，可离线使用

---

## 部署说明

### 本地开发
```bash
npm install
npm run dev
```
访问 http://localhost:5173

### 生产构建
```bash
npm run build
```
生成的文件在 `dist/` 目录

### 部署到GitHub Pages
1. 创建GitHub仓库
2. 配置GitHub Actions（见下方）
3. 推送代码到main分支
4. 自动部署到 `https://<username>.github.io/<repo>/`

### GitHub Actions配置
创建 `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Vercel部署（推荐）
1. 导入GitHub仓库到Vercel
2. 自动检测Vite项目
3. 每次推送自动重新部署
4. 获得 `https://<project>.vercel.app` 域名

---

## 未来迭代计划

### V2: 脂肪追踪（+1天）
- 在数据模型中添加 `fat` 字段
- 更新所有组件支持第三个营养素
- 更新UI布局（三行进度条）

### V3: 数据可视化（+2天）
- 引入 recharts 或 chart.js
- 周趋势图（折线图）
- 月度统计（柱状图）
- 营养素分布饼图

### V4: 食物数据库（+3-5天）
- 常见食物营养数据库（JSON）
- 搜索和快速选择
- 自动计算营养值
- 自定义食物收藏

### V5: 云端同步（+5-7天）
- 后端API（Firebase / Supabase）
- 用户认证（邮箱或Google登录）
- 多设备同步
- 数据备份

### V6: 高级功能
- 照片记录（拍摄食物照片）
- 体重追踪
- 卡路里计算
- 自定义宏量比例（如生酮饮食）
- 每周/每月目标
- 提醒和通知（需要原生应用或Push API）

---

## 已知限制

### iOS Safari限制
- LocalStorage约5-10MB（对本应用足够）
- PWA无法使用通知API（iOS系统限制）
- 需手动添加到主屏幕，无法弹窗提示

### 数据备份
- 初版无云端备份
- 用户清除浏览器数据会丢失记录
- 未来可添加导出/导入JSON功能作为临时方案

### 时区处理
- 使用设备本地时区
- 日期边界按照本地时间（不涉及UTC转换）
- 跨时区旅行可能导致日期混乱（V2+解决）

---

## 维护指南

### 常见任务

#### 修改默认目标值
编辑 `src/utils/storage.ts`:
```typescript
const DEFAULT_GOALS: DailyGoals = {
  carbs: 300,   // 修改这里
  protein: 150, // 修改这里
};
```

#### 修改主题颜色
编辑 `tailwind.config.js` 的 `colors` 部分

#### 添加新的营养素（如脂肪）
1. 更新 `src/types/index.ts` 的接口
2. 更新 `src/utils/storage.ts` 的数据操作
3. 更新所有组件的UI和逻辑

#### 修改PWA配置
编辑 `vite.config.ts` 的 `VitePWA` 部分

---

## 故障排查

### 应用无法添加到主屏幕（iOS）
- 确保使用HTTPS（localhost除外）
- 检查manifest.json是否正确生成
- 查看Safari控制台是否有错误

### 数据丢失
- 检查LocalStorage是否被清除
- 打开浏览器DevTools -> Application -> Local Storage
- 查看 `diet_tracker_data` 和 `diet_tracker_goals`

### 样式不显示
- 确保Tailwind配置正确
- 检查 `src/index.css` 是否包含 `@tailwind` 指令
- 清除浏览器缓存

### 离线不工作
- 确保Service Worker注册成功
- 打开DevTools -> Application -> Service Workers
- 查看是否有活跃的SW

---

## 联系与贡献

这是个人项目，用于健身饮食管理。

### Git提交规范
- `feat:` 新功能
- `fix:` 错误修复
- `docs:` 文档更新
- `style:` 样式调整（不影响功能）
- `refactor:` 重构
- `chore:` 构建/工具配置

### 定期提交建议
每次完成一个完整功能模块后提交，保持提交历史清晰。

---

## 更新日志

### v1.0.0 - 2026-06-02
- 初始版本发布
- 碳水和蛋白质追踪
- PWA支持
- 本地存储
- 历史记录
