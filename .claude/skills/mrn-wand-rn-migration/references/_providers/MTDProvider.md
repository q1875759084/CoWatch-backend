> ⚠️ **此文件放在 `_providers/` 目录，不会被迁移脚本自动加载。**
> Provider 的迁移必须在其所有依赖组件都已迁移完成后才能执行（见下方说明）。

## 依赖该 Provider 的组件（`@ss/mtd-react-native`）

以下组件依赖 `MTDProvider` 提供的 `Portal.Host` 上下文，若 Provider 被提前移除，这些组件将运行异常：

| 组件 | 是否有迁移指南 |
|------|--------------|
| *(包内所有组件) | ❌ 无（`@ss/mtd-react-native` 的 Dialog 暂无迁移指南） |

**迁移前置条件**：上表中所有组件都已完成迁移，或已确认项目中不再使用，方可迁移 `MTDProvider`。
若项目中仍在使用❌无迁移指南的组件，**请保留 `MTDProvider` 不动**。

---

# MTDProvider

## 从何处迁移
- **源库**: `@ss/mtd-react-native`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface ProviderProps extends ThemeProviderProps {
  // 直接与 ThemeProvider 组件的 props 保持一致
  theme?: Partial<Theme>
  compCustomMap?: Partial<compCustomMapType>
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto'
}

export class Provider extends React.Component<ProviderProps> {
  // 渲染 ThemeProvider 和 TopViewWrapper
}

// MTDProvider 是 Provider 的别名
export { Provider as MTDProvider } from '../Provider'
```

### 旧 Provider 的主要职责：
1. 提供主题（Theme）配置
2. 支持组件定制配置（compCustomMap）
3. 包裹 TopViewWrapper 以支持顶层浮层容器
4. 支持 pointerEvents 属性传递

## 新组件 API

```tsx
interface ProviderProps {
  theme?: Partial<Theme>
  children: React.ReactNode
  containerType?: 'mainContainer' | 'subContainer'
  saasModal?: React.ReactNode
}

export class WandRnProvider extends React.Component<ProviderProps> {
  // 渲染 ThemeProvider、ExtContext 和 Portal.Host
}
```

### 新 WandRnProvider 的主要职责：
1. 提供主题（Theme）配置
2. 支持 Bundle 模式切换（mainContainer/subContainer）
3. 提供可扩展上下文（ExtContext）
4. 内置 Portal 支持，替代旧的 TopViewWrapper 机制

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| theme | theme | 主题配置，保持一致 |
| compCustomMap | - | 移除，wand-rn 采用新的定制机制 |
| pointerEvents | - | 移除，通过 Portal 和 containerType 实现 |
| - | containerType | 新增，用于指定 Bundle 模式 |
| - | saasModal | 新增，用于子 Bundle 配置 |

## 迁移示例

### 案例 1：基础使用

```tsx
// 迁移前
import { MTDProvider } from '@ss/mtd-react-native'

export const App = () => (
  <MTDProvider theme={{ primaryColor: '#1890ff' }}>
    <YourApp />
  </MTDProvider>
)

// 迁移后
import { WandRnProvider } from '@sfe/wand-rn'

export const App = () => (
  <WandRnProvider theme={{ primaryColor: '#1890ff' }}>
    <YourApp />
  </WandRnProvider>
)
```

### 案例 2：主题定制

```tsx
// 迁移前
import { MTDProvider } from '@ss/mtd-react-native'

const customTheme = {
  brandColor: '#ff6b6b',
  fontSize: 16
}

const customComponentStyles = {
  Button: {
    styles: { root: { borderRadius: 8 } }
  }
}

export const App = () => (
  <MTDProvider 
    theme={customTheme}
    compCustomMap={customComponentStyles}
  >
    <YourApp />
  </MTDProvider>
)

// 迁移后
// 注：wand-rn 采用新的定制机制，组件定制通过主题 tokens 实现
import { WandRnProvider } from '@sfe/wand-rn'

const customTheme = {
  primaryColor: '#ff6b6b',
  fontSize: 16
  // ... 其他 token 配置
}

export const App = () => (
  <WandRnProvider theme={customTheme}>
    <YourApp />
  </WandRnProvider>
)

// 如需定制具体组件样式，请参考 wand-rn 的相应组件文档
```

### 案例 3：Bundle 模式支持（仅新版本）

```tsx
// wand-rn 新增功能：支持主 Bundle 和子 Bundle 模式

// 主 Bundle 应用入口
import { WandRnProvider } from '@sfe/wand-rn'

export const MainApp = () => (
  <WandRnProvider containerType="mainContainer">
    <YourMainApp />
  </WandRnProvider>
)

// 子 Bundle 应用入口
export const SubApp = ({ saasModal }: any) => (
  <WandRnProvider 
    containerType="subContainer"
    saasModal={saasModal}
  >
    <YourSubApp />
  </WandRnProvider>
)
```

### 案例 4：移除 pointerEvents 属性

```tsx
// 迁移前
import { MTDProvider } from '@ss/mtd-react-native'

export const App = () => (
  <MTDProvider pointerEvents="box-only">
    <YourApp />
  </MTDProvider>
)

// 迁移后
// pointerEvents 已移除，如需控制指针事件，使用 Portal 或自定义容器
import { WandRnProvider } from '@sfe/wand-rn'
import { View } from '@mrn/react-native'

export const App = () => (
  <WandRnProvider>
    <View pointerEvents="box-only">
      <YourApp />
    </View>
  </WandRnProvider>
)
```

## 关键点

1. **主题系统简化**：新版本的主题系统更加简洁，不再需要 `compCustomMap`
   - 旧版本通过 `compCustomMap` 定制组件样式
   - 新版本通过主题 tokens 和组件 props 实现定制

2. **TopViewWrapper 替换为 Portal**：
   - 旧版本使用 `TopViewWrapper` 管理浮层容器
   - 新版本内置 `Portal.Host`，不需要显式声明

3. **Bundle 模式支持**：
   - 新增 `containerType` 属性支持 Bundle 模式
   - 子 Bundle 可通过 `saasModal` 传递配置

4. **pointerEvents 移除**：
   - 不再通过 Provider 层级处理指针事件
   - 如需控制，在相应组件层级处理

5. **向后兼容**：
   - `theme` 属性保持兼容性
   - 但旧版本的 `compCustomMap` 机制已完全移除

## 迁移步骤

1. **替换导入**：
   ```tsx
   // 从
   import { MTDProvider } from '@ss/mtd-react-native'
   
   // 改为
   import { WandRnProvider } from '@sfe/wand-rn'
   ```

2. **更新组件名**：
   ```tsx
   // 从
   <MTDProvider>
   
   // 改为
   <WandRnProvider>
   ```

3. **移除 compCustomMap**：
   - 如果使用了 `compCustomMap` 进行组件定制
   - 改用主题 tokens 或具体组件的 props 进行定制
   - 详见相应组件的迁移文档

4. **处理 pointerEvents**：
   - 如果使用了 `pointerEvents` 属性
   - 改在子组件层级使用 `<View pointerEvents={...} />`

5. **根据需要使用 Bundle 模式**：
   - 如需支持 Bundle 模式，添加 `containerType` 属性
   - 默认为 `mainContainer`

## 常见问题

**Q：我的项目中使用了 `compCustomMap` 来定制多个组件，迁移时应该怎么办？**

A：wand-rn 采用了新的定制机制，建议：
- 优先使用主题 tokens 进行全局定制
- 针对具体组件的定制，查看该组件的迁移文档
- 如需更复杂的定制，可能需要创建组件包装器

**Q：TopViewWrapper 如何替换？**

A：新版本已内置 `Portal.Host`，不需要显式声明。浮层组件会自动渲染到 Portal 中。

**Q：我应该为所有应用都使用 `containerType="subContainer"` 吗？**

A：仅当您的应用以 Bundle 模式运行时才需要。默认使用 `mainContainer`。
