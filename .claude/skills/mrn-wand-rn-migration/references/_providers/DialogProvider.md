> ⚠️ **此文件放在 `_providers/` 目录，不会被迁移脚本自动加载。**
> Provider 的迁移必须在其所有依赖组件都已迁移完成后才能执行（见下方说明）。

## 依赖该 Provider 的组件（`@mtfe/empower-mrn-components/shuguopai`）

以下组件依赖 `DialogProvider` 提供的 `Portal.Host` 上下文，若 Provider 被提前移除，这些组件将运行异常：

| 组件 | 是否有迁移指南 |
|------|--------------|
| `Dialog` | ✅ 有（`references/empower-mrn-components/shuguopai/Dialog.md`） |

**迁移前置条件**：上表中所有组件都已完成迁移，或已确认项目中不再使用，方可迁移 `DialogProvider`。

---

# DialogProvider 提供者

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
// DialogProvider 来自 @ss/mtd-react-native
// 是一个基础的内容提供者，支持 TopView 相关功能

interface ProviderProps extends ThemeProviderProps {
  // 直接与 ThemeProvider 组件的 props 保持一致
  theme?: Partial<Theme>
  compCustomMap?: Partial<compCustomMapType>
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto'
  children?: React.ReactNode
}

// 使用示例
<DialogProvider theme={customTheme}>
  <App />
</DialogProvider>

// 全局访问 TopView 实例
global._MRNRootTopViewInstance  // 用于弹窗管理
```

## 新组件 API

```tsx
// WandRnProvider 是更强大的通用提供者
interface ProviderProps {
  // 子元素
  children: React.ReactNode
  
  // 主题配置（支持与旧 Provider 相同的主题功能）
  theme?: Partial<Theme>
  
  // bundle 模式配置
  // 'mainContainer': 常规 bundle 模式
  // 'subContainer': 子 bundle 模式（0.6.0 新增）
  containerType?: 'mainContainer' | 'subContainer'
  
  // 子 bundle 设置（0.6.0 新增）
  saasModal?: React.ReactNode
}

// 使用示例
<WandRnProvider theme={customTheme} containerType="mainContainer">
  <App />
</WandRnProvider>

// 内部通过 ExtContext 提供 containerType 和 saasModal
// Portal.Host 内置提供了弹窗容器管理
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| theme | theme | 保持不变，主题配置功能一致 |
| compCustomMap | - | 新组件不支持自定义组件映射，使用主题系统替代 |
| pointerEvents | - | 已移除，可通过 View 包装实现 |
| children | children | 保持不变 |
| - | containerType | 新增，支持多 bundle 场景（0.6.0+） |
| - | saasModal | 新增，子 bundle 弹窗管理（0.6.0+） |
| global._MRNRootTopViewInstance | - | TopView 实例管理机制已改进，由 Portal.Host 透明管理 |

## 核心架构差异

### 旧架构（@ss/mtd-react-native Provider）
```tsx
Provider
├── ThemeProvider (主题)
└── TopViewWrapper (弹窗容器管理)
    └── 通过 global._MRNRootTopViewInstance 暴露实例
```

### 新架构（@sfe/wand-rn WandRnProvider）
```tsx
WandRnProvider
├── ThemeProvider (主题)
├── ExtContext (上下文: containerType, saasModal)
└── Portal.Host (弹窗容器 - 替代 TopViewWrapper)
```

## 迁移对照表

| 功能 | 旧方案 | 新方案 | 说明 |
|------|-------|--------|------|
| 主题配置 | theme prop | theme prop | 功能保持一致 |
| 自定义组件 | compCustomMap | 主题系统或自定义组件 | 建议使用主题系统 |
| 弹窗管理 | TopViewWrapper | Portal.Host | 透明集成，无需手动管理 |
| 多 Bundle 支持 | 不支持 | containerType | 新增功能（0.6.0+） |
| 子 Bundle 设置 | 不支持 | saasModal | 新增功能（0.6.0+） |

## 迁移示例

### 案例 1：基础 Provider 配置

```tsx
// 迁移前
import { DialogProvider } from '@mtfe/empower-mrn-components/shuguopai'
import { theme } from './theme'

const App = () => (
  <DialogProvider theme={theme}>
    <YourApp />
  </DialogProvider>
)

// 迁移后
import { WandRnProvider } from '@sfe/wand-rn'
import { theme } from './theme'

const App = () => (
  <WandRnProvider theme={theme}>
    <YourApp />
  </WandRnProvider>
)
```

### 案例 3：主题定制

```tsx
// 迁移前
import { DialogProvider } from '@mtfe/empower-mrn-components/shuguopai'

const customTheme = {
  color: {
    primary: '#FF6B6B',
    success: '#51CF66'
  }
}

<DialogProvider theme={customTheme}>
  <App />
</DialogProvider>

// 迁移后
import { WandRnProvider } from '@sfe/wand-rn'

const customTheme = {
  color: {
    primary: '#FF6B6B',
    success: '#51CF66'
  }
}

<WandRnProvider theme={customTheme}>
  <App />
</WandRnProvider>
```

### 案例 4：常规 Bundle 模式

```tsx
// 迁移前（无显式 bundle 配置）
import { DialogProvider } from '@mtfe/empower-mrn-components/shuguopai'

<DialogProvider theme={theme}>
  <MainApp />
</DialogProvider>

// 迁移后（显式指定为常规模式，这是默认值）
import { WandRnProvider } from '@sfe/wand-rn'

<WandRnProvider theme={theme} containerType="mainContainer">
  <MainApp />
</WandRnProvider>

// 或使用默认值（可省略 containerType）
<WandRnProvider theme={theme}>
  <MainApp />
</WandRnProvider>
```

### 案例 5：子 Bundle 模式（0.6.0+）

```tsx
// 迁移后 - 使用子 bundle 模式处理多 bundle 场景
import { WandRnProvider } from '@sfe/wand-rn'

<WandRnProvider 
  theme={theme}
  containerType="subContainer"
  saasModal={<SaasModal />}
>
  <SubBundleApp />
</WandRnProvider>
```

### 案例 6：移除 pointerEvents 属性

```tsx
// 迁移前
import { DialogProvider } from '@mtfe/empower-mrn-components/shuguopai'

<DialogProvider pointerEvents="box-none">
  <App />
</DialogProvider>

// 迁移后 - 使用 View 包裹实现相同效果
import { WandRnProvider } from '@sfe/wand-rn'
import { View } from '@mrn/react-native'

<WandRnProvider>
  <View pointerEvents="box-none">
    <App />
  </View>
</WandRnProvider>
```

### 案例 7：移除 compCustomMap（使用主题系统替代）

```tsx
// 迁移前 - 自定义组件映射
import { DialogProvider } from '@mtfe/empower-mrn-components/shuguopai'

const customMap = {
  Button: CustomButton,
  Dialog: CustomDialog
}

<DialogProvider compCustomMap={customMap}>
  <App />
</DialogProvider>

// 迁移后 - 使用主题系统或直接导入自定义组件
import { WandRnProvider } from '@sfe/wand-rn'

// 方案 1：使用主题系统
<WandRnProvider theme={{ components: { Button: { /* 样式配置 */ } } }}>
  <App />
</WandRnProvider>

// 方案 2：直接在应用中导入和使用自定义组件
// 业务代码中直接引用自定义组件，无需通过 Provider 注入
import { CustomButton } from './components'

const App = () => <CustomButton />
```

### 案例 8：访问 TopView 实例的替代方案

```tsx
// 迁移前 - 直接访问全局 TopView 实例
import { DialogProvider } from '@mtfe/empower-mrn-components/shuguopai'
import { TopViewManager } from '@ss/mtd-react-native'

// 获取实例
const topViewInstance = global._MRNRootTopViewInstance

// 迁移后 - 使用 Dialog.show() 或相关 API，无需手动管理实例
import { Dialog } from '@sfe/wand-rn'

// 显示对话框 - 由 WandRnProvider 透明管理
const key = Dialog.show({
  title: '提示',
  content: '这是一条消息',
  actions: [
    { text: '知道了', type: 'confirm', onPress: () => {} }
  ]
})
```

### 案例 9：完整应用入口配置

```tsx
// 迁移前
import React from 'react'
import { DialogProvider } from '@mtfe/empower-mrn-components/shuguopai'
import { StatusBar } from '@mrn/react-native'

const theme = {
  color: {
    primary: '#FF6B6B'
  }
}

const App = () => (
  <DialogProvider theme={theme}>
    <StatusBar barStyle="dark-content" />
    <MainApp />
  </DialogProvider>
)

export default App

// 迁移后
import React from 'react'
import { WandRnProvider } from '@sfe/wand-rn'
import { StatusBar } from '@mrn/react-native'

const theme = {
  color: {
    primary: '#FF6B6B'
  }
}

const App = () => (
  <WandRnProvider theme={theme}>
    <StatusBar barStyle="dark-content" />
    <MainApp />
  </WandRnProvider>
)

export default App
```

## 关键迁移点

1. **组件重命名**:
   - `DialogProvider` → `WandRnProvider`
   - 导入路径从 `@mtfe/empower-mrn-components/shuguopai` 变为 `@sfe/wand-rn`

2. **功能保留**:
   - `theme` 属性完全保持，主题配置逻辑不变
   - `children` 属性保持不变

3. **功能移除**:
   - `compCustomMap`: 不再支持，使用主题系统或直接导入组件替代
   - `pointerEvents`: 不再支持，使用 `View` 包裹替代
   - `global._MRNRootTopViewInstance`: 内部实现改进，不再需要手动访问

4. **新增功能** (0.6.0+):
   - `containerType`: 支持多 bundle 模式配置
   - `saasModal`: 子 bundle 弹窗管理

5. **底层架构改进**:
   - 旧: `TopViewWrapper` + 全局实例暴露
   - 新: `Portal.Host` + `ExtContext` 的组合方案
   - 弹窗管理更加透明和内聚

6. **兼容性考虑**:
   - 新组件对主题配置的处理方式完全兼容
   - 如果项目中使用了全局 `_MRNRootTopViewInstance`，需要重构为使用 Dialog API

## 注意事项

1. **Dialog 相关代码的调整**: 
   - 如果项目中使用了 `global._MRNRootTopViewInstance` 来管理弹窗，需要改为使用 `Dialog.show()`, `Dialog.alert()`, `Dialog.prompt()` 等 API
   - 参考 Dialog 组件的迁移文档了解详细的函数式调用变更

2. **主题系统理解**:
   - 新的 `WandRnProvider` 主题系统与旧的完全兼容
   - 如果使用了 `compCustomMap` 进行高级自定义，建议评估是否可以使用主题系统实现

3. **多 Bundle 场景**:
   - 如果你的应用涉及多 bundle 架构，推荐升级到支持 `containerType` 和 `saasModal` 的版本 (0.6.0+)
   - 这些新功能可以显著简化多 bundle 应用的提供者配置

4. **逐步迁移**:
   - 仅替换 Provider 组件通常是安全的
   - 如果涉及其他组件的迁移（如 Dialog），需要同步进行

5. **版本兼容性**:
   - `WandRnProvider` 的基础功能从 0.1.0 开始支持
   - `containerType` 和 `saasModal` 属性从 0.6.0 开始支持

## 特殊情况处理

### 当已经使用了 WandRnProvider 的情况

如果项目中已经存在 `WandRnProvider`，而又发现了旧的 `DialogProvider`，**无需进行组件替换**，直接**去掉 DialogProvider 即可**。

```tsx
// 场景：项目中已有 WandRnProvider，还存在旧的 DialogProvider
// 迁移前
import { DialogProvider } from '@mtfe/empower-mrn-components/shuguopai'
import { WandRnProvider } from '@sfe/wand-rn'

const App = () => (
  <WandRnProvider theme={theme}>
    <DialogProvider>
      <MainApp />
    </DialogProvider>
  </WandRnProvider>
)

// 迁移后 - 直接移除 DialogProvider，保留 WandRnProvider
import { WandRnProvider } from '@sfe/wand-rn'

const App = () => (
  <WandRnProvider theme={theme}>
    <MainApp />
  </WandRnProvider>
)
```

**原因**:
- `WandRnProvider` 已经包含了 `DialogProvider` 的所有功能（主题管理、弹窗容器等）
- 两层嵌套是冗余的，会导致不必要的性能开销
- `WandRnProvider` 是更新、更完整的解决方案，可以完全替代旧的 `DialogProvider`

## 迁移检查清单

- [ ] 替换 import 语句：`@mtfe/empower-mrn-components/shuguopai` → `@sfe/wand-rn`
- [ ] 重命名组件：`DialogProvider` → `WandRnProvider`
- [ ] 保留 `theme` 属性配置（无需修改）
- [ ] 检查是否使用了 `compCustomMap`，如有则进行迁移
- [ ] 检查是否使用了 `pointerEvents`，如有则改用 `View` 包裹
- [ ] 检查是否访问过 `global._MRNRootTopViewInstance`，如有则改为使用 Dialog API
- [ ] 检查 Dialog 相关代码是否需要同步迁移
- [ ] 检查是否已存在 `WandRnProvider`，如有则直接删除多余的 `DialogProvider`**
- [ ] 进行完整的功能测试
- [ ] 验证主题和样式是否保持一致
