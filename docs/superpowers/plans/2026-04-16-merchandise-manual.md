# 商品规则手册 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在门店助手 MRN 应用中新增商品规则手册页面，内容由运营后台配置，前端动态拉取并展示。

**Architecture:** 新建 `src/bundles/merchandise-manual/` bundle，包含 API 层（mock 优先）、useManual hook、ManualPage 页面，并注册到 `src/bundles/merchandise-pool/routers/base.ts` 的公共路由表中。

**Tech Stack:** React Native（@mrn/react-native）、@mrn/react-navigation、@sfe/wand-rn、@sgfe/enhanced-axios/mrn、TypeScript

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/bundles/merchandise-manual/api/index.ts` | 新建 | 类型定义 + mock fetchManual 函数 |
| `src/bundles/merchandise-manual/hooks/useManual.ts` | 新建 | 封装请求状态（loading/error/data/retry） |
| `src/bundles/merchandise-manual/pages/ManualPage.tsx` | 新建 | 手册主页面，单页滚动展示 |
| `src/bundles/merchandise-manual/index.ts` | 新建 | bundle 入口（暂为空导出，路由在公共路由表） |
| `src/bundles/merchandise-pool/routers/base.ts` | 修改 | 注册 MerchandiseManual 路由 |

---

## Task 1: 创建 API 层（类型 + mock 数据）

**Files:**
- Create: `src/bundles/merchandise-manual/api/index.ts`

- [ ] **Step 1: 创建文件**

```ts
// src/bundles/merchandise-manual/api/index.ts

export interface ManualSection {
  heading: string
  content: string
}

export interface ManualData {
  title: string
  sections: ManualSection[]
}

const mockData: ManualData = {
  title: '商品规则手册',
  sections: [
    {
      heading: '上架规则',
      content: '商品上架需满足以下条件：商品图片清晰、价格填写完整、分类选择正确。违规商品将被下架处理。',
    },
    {
      heading: '价格规范',
      content: '商品售价不得低于成本价，不得虚标原价。促销价格需在活动期间内生效，活动结束后自动恢复原价。',
    },
    {
      heading: '图片要求',
      content: '主图尺寸不小于 800x800 像素，格式支持 JPG/PNG，文件大小不超过 5MB。禁止使用含有水印或侵权内容的图片。',
    },
  ],
}

export async function fetchManual(): Promise<ManualData> {
  return Promise.resolve(mockData)
}
```

- [ ] **Step 2: 提交**

```bash
git add src/bundles/merchandise-manual/api/index.ts
git commit -m "feat: add merchandise-manual API layer with mock data"
```

---

## Task 2: 创建 useManual Hook

**Files:**
- Create: `src/bundles/merchandise-manual/hooks/useManual.ts`

- [ ] **Step 1: 创建文件**

```ts
// src/bundles/merchandise-manual/hooks/useManual.ts

import { useCallback, useEffect, useState } from 'react'
import { fetchManual, ManualData } from '../api'

interface UseManualResult {
  data: ManualData | null
  loading: boolean
  error: boolean
  retry: () => void
}

export function useManual(): UseManualResult {
  const [data, setData] = useState<ManualData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setError(false)
    fetchManual()
      .then((result) => {
        setData(result)
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, retry: load }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/bundles/merchandise-manual/hooks/useManual.ts
git commit -m "feat: add useManual hook"
```

---

## Task 3: 创建 ManualPage 页面

**Files:**
- Create: `src/bundles/merchandise-manual/pages/ManualPage.tsx`

- [ ] **Step 1: 创建文件**

```tsx
// src/bundles/merchandise-manual/pages/ManualPage.tsx

import React from 'react'
import { ScrollView, StyleSheet, View } from '@mrn/react-native'
import { Typography, PlaceHolder } from '@sfe/wand-rn'
import token from '@sfe/design-token-app'
import { NavigationBar } from '@components/NavigationBar'
import { NavigationScreenProp } from '@mrn/react-navigation'
import { Loading } from '@components/loading'
import { useManual } from '../hooks/useManual'

interface Props {
  navigation: NavigationScreenProp<{}>
}

export default function ManualPage({ navigation }: Props) {
  const { data, loading, error, retry } = useManual()

  return (
    <View style={styles.container}>
      <NavigationBar
        navigation={navigation}
        title={data?.title ?? '商品规则手册'}
      />
      <Loading show={loading} />
      {!loading && error && (
        <PlaceHolder
          type="Load"
          onPress={retry}
          buttonText="重试"
          description="加载失败，请重试"
        />
      )}
      {!loading && !error && data && data.sections.length === 0 && (
        <PlaceHolder type="Empty" description="暂无内容" />
      )}
      {!loading && !error && data && data.sections.length > 0 && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {data.sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Typography.Text style={styles.heading}>
                {section.heading}
              </Typography.Text>
              <Typography.Text style={styles.content}>
                {section.content}
              </Typography.Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: token.spaceLg,
  },
  section: {
    marginBottom: token.spaceLg,
  },
  heading: {
    fontSize: token.fontSizeLg,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: token.spaceSm,
  },
  content: {
    fontSize: token.fontSizeMd,
    color: '#666',
    lineHeight: 22,
  },
})
```

- [ ] **Step 2: 提交**

```bash
git add src/bundles/merchandise-manual/pages/ManualPage.tsx
git commit -m "feat: add ManualPage component"
```

---

## Task 4: 创建 bundle 入口文件

**Files:**
- Create: `src/bundles/merchandise-manual/index.ts`

- [ ] **Step 1: 创建文件**

```ts
// src/bundles/merchandise-manual/index.ts

export { default as ManualPage } from './pages/ManualPage'
```

- [ ] **Step 2: 提交**

```bash
git add src/bundles/merchandise-manual/index.ts
git commit -m "feat: add merchandise-manual bundle entry"
```

---

## Task 5: 注册路由

**Files:**
- Modify: `src/bundles/merchandise-pool/routers/base.ts`

- [ ] **Step 1: 在文件顶部 import 区域添加 ManualPage 导入**

在 `src/bundles/merchandise-pool/routers/base.ts` 第 29 行（`import SearchPage from '../pages/SearchPage';` 之后）添加：

```ts
import ManualPage from '@bundles/merchandise-manual/pages/ManualPage';
```

- [ ] **Step 2: 在 commonRouteConfig 中注册路由**

在 `commonRouteConfig` 对象末尾（第 141 行 `ChannelSaleAttrSortPage` 条目之后，`};` 之前）添加：

```ts
  MerchandiseManual: {
    screen: ManualPage,
    navigationOptions: { header: () => null },
  },
```

- [ ] **Step 3: 验证文件编译无报错**

```bash
cd /Users/stonehe/empower-unified-goods-mrn && npx tsc --noEmit 2>&1 | head -30
```

预期：无 `merchandise-manual` 相关报错

- [ ] **Step 4: 提交**

```bash
git add src/bundles/merchandise-pool/routers/base.ts
git commit -m "feat: register MerchandiseManual route in commonRouteConfig"
```

---

## Task 6: 在调用方页面添加入口

> 说明：调用方页面由业务决定，此处以 `merchandise-pool` 的 `HomePage` 为示例，实际接入时替换为真实入口位置。

**Files:**
- Modify: `src/bundles/merchandise-pool/pages/HomePage/index.tsx`

- [ ] **Step 1: 在 HomePage 的导航栏右侧添加"手册"按钮**

在 `HomePage` 组件的 JSX 中，找到 `NavigationBar` 或页面顶部区域，添加跳转按钮。在文件顶部已有 `TouchableOpacity` 导入，在合适位置添加：

```tsx
// 在组件内部，navigation 已通过 props 传入
<TouchableOpacity
  onPress={() => navigation.navigate('MerchandiseManual')}
  style={{ paddingHorizontal: 12 }}
>
  <Typography.Text style={{ color: '#333', fontSize: 14 }}>手册</Typography.Text>
</TouchableOpacity>
```

> 注意：具体位置根据 HomePage 的实际 UI 结构决定，确保放在用户可见的位置。

- [ ] **Step 2: 提交**

```bash
git add src/bundles/merchandise-pool/pages/HomePage/index.tsx
git commit -m "feat: add merchandise manual entry button in HomePage"
```
