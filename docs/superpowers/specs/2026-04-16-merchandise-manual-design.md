# 商品规则手册功能设计文档

**日期：** 2026-04-16
**项目：** 门店助手 MRN（shopsoap）

---

## 背景与目标

在门店助手应用中，为店员提供商品/业务规则说明的手册功能。内容由运营人员在后台配置，前端通过接口动态拉取并展示。

---

## 整体架构

### 新建 Bundle

路径：`src/bundles/merchandise-manual/`

```
merchandise-manual/
├── index.ts              # bundle 入口，注册路由
├── pages/
│   └── ManualPage.tsx    # 手册主页面
├── hooks/
│   └── useManual.ts      # 数据获取逻辑
└── api/
    └── index.ts          # 接口定义（含 mock）
```

### 数据流

1. 调用方页面点击入口 → 跳转到 `ManualPage`
2. `ManualPage` 挂载时调用 `useManual` hook 拉取数据
3. `useManual` 调用接口，先返回 mock 数据，后续替换为真实接口
4. 页面渲染纯文本内容，单页滚动展示

### 数据结构

```ts
interface ManualData {
  title: string
  sections: Array<{
    heading: string
    content: string
  }>
}
```

---

## 页面 UI

### ManualPage 布局（单页滚动）

```
┌─────────────────────────┐
│  ← 返回    商品规则手册   │  ← 导航栏（标题从接口返回）
├─────────────────────────┤
│                         │
│  ## 第一节标题           │
│  正文内容正文内容正文...  │
│                         │
│  ## 第二节标题           │
│  正文内容正文内容正文...  │
│                         │
│  ...                    │
│                         │
└─────────────────────────┘
```

### 交互状态

| 状态 | 表现 |
|------|------|
| 加载中 | 显示 loading |
| 加载失败 | 显示错误提示 + 重试按钮 |
| 内容为空 | 显示"暂无内容" |
| 正常 | 单页滚动展示所有 sections |

使用项目现有 `ScrollView` + 文本组件，遵循项目已有样式规范。

---

## 接口与数据

### Mock 接口（先用，后替换）

```ts
// src/bundles/merchandise-manual/api/index.ts

const mockData: ManualData = {
  title: '商品规则手册',
  sections: [
    { heading: '上架规则', content: '...' },
    { heading: '价格规范', content: '...' },
  ]
}

export async function fetchManual(): Promise<ManualData> {
  return Promise.resolve(mockData)
}
```

### 真实接口（结构预留）

- 接口路径：待后端确认，暂用 `/api/manual/merchandise`
- 请求方式：GET
- 响应格式：与 `ManualData` 对齐

### useManual Hook

```ts
// 封装请求状态
const { data, loading, error, retry } = useManual()
```

---

## 入口

- 位置：某个具体页面内的按钮/链接（由调用方决定具体位置）
- 跳转方式：路由跳转到 `ManualPage`（全屏展示）

---

## 范围说明

- 本期只支持纯文本内容
- 本期只有一个入口
- 接口先用 mock，后续由后端对接
