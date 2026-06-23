> ⚠️ **此文件放在 `_providers/` 目录，不会被迁移脚本自动加载。**
> Provider 的迁移必须在其所有依赖组件都已迁移完成后才能执行（见下方说明）。

## 依赖该 Provider 的组件（`@sgfe/flower-rn`）

以下组件依赖 `FlowerProvider` 提供的 `Portal.Host` 上下文，若 Provider 被提前移除，这些组件将运行异常：

| 组件 | 是否有迁移指南 |
|------|--------------|
| `Dialog`（及其静态方法） | ✅ 有（`references/flower-rn/Dialog.md`） |
| `ActionSheet` | ❌ 无 |
| `Toast`（及其静态方法） | ✅ 有（`references/flower-rn/Toast.md`） |
| `Scancode.scan()` | ❌ 无 |
| `BottomModal` | ✅ 有（`references/flower-rn/BottomModal.md`） |
| `SlideModal` | ❌ 无 |
| `Popover` | ✅ 有（`references/flower-rn/Popover.md`） |
| `Picker` | ✅ 有（`references/flower-rn/Picker.md`） |
| `PortalManager` | ❌ 无 |
| `BasePopover` | ❌ 无 |

**迁移前置条件**：上表中所有组件都已完成迁移，或已确认项目中不再使用，方可迁移 `FlowerProvider`。
若项目中仍在使用❌无迁移指南的组件，**请保留 `FlowerProvider` 不动**。

---

# FlowerProvider 全局提供者

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface ProviderProps {
  /** 主题配置 */
  theme?: Partial<Theme>
  
  /** 子元素 */
  children: React.ReactNode
  
  /** Bundle 模式 */
  containerType?: 'mainContainer' | 'subContainer'  // 默认 'mainContainer'
}

export class FlowerProvider extends React.Component<ProviderProps> {
  render() {
    return (
      <ThemeProvider theme={this.props.theme}>
        <ExtContext.Provider value={{containerType:this.props.containerType}} >
          <Portal.Host>{this.props.children}</Portal.Host>
        </ExtContext.Provider>
      </ThemeProvider>
    )
  }
}

// ExtContext 提供的值
export const ExtContext = React.createContext({
    containerType: 'mainContainer'
})
```

## 新组件 API

```tsx
export interface ProviderProps {
  /** 主题配置 */
  theme?: Partial<Theme>
  
  /** 子元素 */
  children: React.ReactNode
  
  /** Bundle 模式 */
  containerType?: 'mainContainer' | 'subContainer'  // 默认 'mainContainer'
  
  /** 子 Bundle 模态框配置（新增） */
  saasModal?: React.ReactNode  // 默认 null
}

export class WandRnProvider extends React.Component<ProviderProps> {
  render() {
    const { theme, children, containerType, saasModal } = this.props
    return (
      <ThemeProvider value={theme}>
        <ExtContext.Provider value={{ containerType, saasModal }}>
          <Portal.Host>{children}</Portal.Host>
        </ExtContext.Provider>
      </ThemeProvider>
    )
  }
}

// ExtContext 提供的值 - 新增 saasModal
export const ExtContext = React.createContext({
    containerType: 'mainContainer',
    saasModal: null,
})
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| theme | theme | 保持一致 |
| children | children | 保持一致 |
| containerType | containerType | 保持一致 |
| - | saasModal | 新增，子 Bundle 模态框配置 |

### 组件名称变更

| 旧名称 | 新名称 | 说明 |
|--------|--------|------|
| FlowerProvider | WandRnProvider | 组件名称改变（但 flower-rn 中仍然导出为 FlowerProvider） |

### ExtContext 值类型变更

| 旧值 | 新值 | 说明 |
|-----|-----|------|
| `{ containerType }` | `{ containerType, saasModal }` | 新增 saasModal 字段 |

## 关键变更

### 1. 组件名称改变
- **旧版本**：`FlowerProvider`
- **新版本**：`WandRnProvider`
- 但在 wand-rn 中仍可以通过导出别名为 `FlowerProvider`，保持兼容

### 2. 新增 saasModal 属性
- **新版本**：支持 `saasModal` 属性，用于子 Bundle 模态框配置
- **旧版本**：不支持此属性
- 此属性可选，不提供时默认为 `null`

### 3. ExtContext 上下文值扩展
- **旧版本**：仅包含 `containerType`
- **新版本**：包含 `containerType` 和 `saasModal`
- 使用 useContext 获取的值会包含 saasModal 字段

### 4. ThemeProvider 属性变更
- **旧版本**：使用 `theme` 属性
- **新版本**：使用 `value` 属性
- 这是内部实现细节，用户无感知

## 迁移示例

### 案例 1：基础使用（无需改动）

```tsx
// 迁移前
import { FlowerProvider } from '@sgfe/flower-rn'

export default function App() {
  return (
    <FlowerProvider>
      <YourApp />
    </FlowerProvider>
  )
}

// 迁移后 - 可以保持完全相同
import { WandRnProvider } from '@sfe/wand-rn'

export default function App() {
  return (
    <WandRnProvider>
      <YourApp />
    </WandRnProvider>
  )
}

// 或者如果 wand-rn 提供了别名
import { FlowerProvider } from '@sfe/wand-rn'

export default function App() {
  return (
    <FlowerProvider>
      <YourApp />
    </FlowerProvider>
  )
}
```

### 案例 2：带主题配置

```tsx
// 迁移前
import { FlowerProvider } from '@sgfe/flower-rn'

const customTheme = {
  primaryColor: '#FF6B6B',
  backgroundColor: '#F5F5F5'
}

export default function App() {
  return (
    <FlowerProvider theme={customTheme}>
      <YourApp />
    </FlowerProvider>
  )
}

// 迁移后 - 无需改动
import { WandRnProvider } from '@sfe/wand-rn'

const customTheme = {
  primaryColor: '#FF6B6B',
  backgroundColor: '#F5F5F5'
}

export default function App() {
  return (
    <WandRnProvider theme={customTheme}>
      <YourApp />
    </WandRnProvider>
  )
}
```

### 案例 3：子 Bundle 模式（已有功能）

```tsx
// 迁移前
import { FlowerProvider } from '@sgfe/flower-rn'

export default function SubApp() {
  return (
    <FlowerProvider containerType="subContainer">
      <YourSubApp />
    </FlowerProvider>
  )
}

// 迁移后 - 无需改动
import { WandRnProvider } from '@sfe/wand-rn'

export default function SubApp() {
  return (
    <WandRnProvider containerType="subContainer">
      <YourSubApp />
    </WandRnProvider>
  )
}
```

### 案例 4：子 Bundle 模态框配置（新功能）

```tsx
// 迁移后 - 新增功能
import { WandRnProvider } from '@sfe/wand-rn'
import { Modal } from '@mrn/react-native'

const CustomModal = () => (
  <Modal transparent>
    {/* 自定义模态框内容 */}
  </Modal>
)

export default function SubApp() {
  return (
    <WandRnProvider 
      containerType="subContainer"
      saasModal={<CustomModal />}
    >
      <YourSubApp />
    </WandRnProvider>
  )
}
```

### 案例 5：主题配置 + 子 Bundle 模式

```tsx
// 迁移前
import { FlowerProvider } from '@sgfe/flower-rn'

const theme = {
  primaryColor: '#007AFF'
}

export default function App() {
  return (
    <FlowerProvider theme={theme} containerType="subContainer">
      <YourApp />
    </FlowerProvider>
  )
}

// 迁移后 - 无需改动
import { WandRnProvider } from '@sfe/wand-rn'

const theme = {
  primaryColor: '#007AFF'
}

export default function App() {
  return (
    <WandRnProvider theme={theme} containerType="subContainer">
      <YourApp />
    </WandRnProvider>
  )
}
```

### 案例 6：嵌套 Provider（多层 Bundle）

```tsx
// 迁移前
import { FlowerProvider } from '@sgfe/flower-rn'

export default function MainApp() {
  return (
    <FlowerProvider containerType="mainContainer">
      <MainScreen />
      <FlowerProvider containerType="subContainer">
        <SubApp />
      </FlowerProvider>
    </FlowerProvider>
  )
}

// 迁移后 - 无需改动
import { WandRnProvider } from '@sfe/wand-rn'

export default function MainApp() {
  return (
    <WandRnProvider containerType="mainContainer">
      <MainScreen />
      <WandRnProvider containerType="subContainer">
        <SubApp />
      </WandRnProvider>
    </WandRnProvider>
  )
}
```

### 案例 7：在组件中使用 ExtContext（获取 containerType）

```tsx
// 迁移前
import { ExtContext } from '@sgfe/flower-rn'
import { useContext } from 'react'

function MyComponent() {
  const extContext = useContext(ExtContext)
  
  return (
    <View>
      <Text>Container Type: {extContext.containerType}</Text>
    </View>
  )
}

// 迁移后 - 保持相同
import { ExtContext } from '@sfe/wand-rn'
import { useContext } from 'react'

function MyComponent() {
  const extContext = useContext(ExtContext)
  
  return (
    <View>
      <Text>Container Type: {extContext.containerType}</Text>
    </View>
  )
}
```

### 案例 8：在组件中使用 ExtContext（获取 saasModal）（新功能）

```tsx
// 迁移后 - 新增功能
import { ExtContext } from '@sfe/wand-rn'
import { useContext } from 'react'

function MySubComponent() {
  const extContext = useContext(ExtContext)
  
  return (
    <View>
      <Text>Container Type: {extContext.containerType}</Text>
      {extContext.saasModal && (
        <View>
          {extContext.saasModal}
        </View>
      )}
    </View>
  )
}
```

### 案例 9：完整应用示例

```tsx
// 迁移前
import { FlowerProvider } from '@sgfe/flower-rn'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

export default function App() {
  const theme = {
    primaryColor: '#007AFF',
    backgroundColor: '#FFFFFF'
  }

  return (
    <FlowerProvider theme={theme} containerType="mainContainer">
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FlowerProvider>
  )
}

// 迁移后 - 无需改动
import { WandRnProvider } from '@sfe/wand-rn'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

export default function App() {
  const theme = {
    primaryColor: '#007AFF',
    backgroundColor: '#FFFFFF'
  }

  return (
    <WandRnProvider theme={theme} containerType="mainContainer">
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </WandRnProvider>
  )
}
```

### 案例 10：子 Bundle 应用完整示例（新功能）

```tsx
// 迁移后 - 使用新的 saasModal 功能
import { WandRnProvider, Modal } from '@sfe/wand-rn'
import { View, Text } from '@mrn/react-native'
import { useState } from 'react'

function CustomSaasModal() {
  return (
    <Modal transparent animationType="slide">
      <View>
        <Text>子 Bundle 模态框</Text>
      </View>
    </Modal>
  )
}

export default function SubBundleApp() {
  return (
    <WandRnProvider 
      theme={{
        primaryColor: '#FF6B6B'
      }}
      containerType="subContainer"
      saasModal={<CustomSaasModal />}
    >
      <SubApp />
    </WandRnProvider>
  )
}
```

## 处理已存在 WandRnProvider 的情况

如果项目中已经存在 `WandRnProvider`，而又发现了旧的 `FlowerProvider`，**无需进行组件替换**，遵循以下处理方案：

### ❌ 错误做法
```tsx
// 不要这样做 - 重复引入两个 Provider
import { WandRnProvider } from '@sfe/wand-rn'
import { FlowerProvider } from '@sgfe/flower-rn'

export default function App() {
  return (
    <WandRnProvider>
      <FlowerProvider>
        <YourApp />
      </FlowerProvider>
    </WandRnProvider>
  )
}
```

### ✅ 正确做法
```tsx
// 正确做法 - 直接去掉 FlowerProvider，保留 WandRnProvider
import { WandRnProvider } from '@sfe/wand-rn'

export default function App() {
  return (
    <WandRnProvider>
      <YourApp />
    </WandRnProvider>
  )
}
```

### 处理步骤

1. **检查是否已有 WandRnProvider**：在应用的根文件或 Provider 组件中查找 `WandRnProvider`
2. **移除旧的 FlowerProvider 引入**：删除 `import { FlowerProvider } from '@sgfe/flower-rn'`
3. **删除旧的 FlowerProvider 使用**：直接移除 `<FlowerProvider>` 标签，保留其子元素
4. **保留 WandRnProvider**：确保 `WandRnProvider` 继续使用

### 案例：迁移混合场景

```tsx
// 迁移前 - 混合使用
import { WandRnProvider } from '@sfe/wand-rn'
import { FlowerProvider } from '@sgfe/flower-rn'
import { NavigationContainer } from '@react-navigation/native'

export default function App() {
  return (
    <WandRnProvider>
      <FlowerProvider>
        <NavigationContainer>
          <YourApp />
        </NavigationContainer>
      </FlowerProvider>
    </WandRnProvider>
  )
}

// 迁移后 - 简化为只用 WandRnProvider
import { WandRnProvider } from '@sfe/wand-rn'
import { NavigationContainer } from '@react-navigation/native'

export default function App() {
  return (
    <WandRnProvider>
      <NavigationContainer>
        <YourApp />
      </NavigationContainer>
    </WandRnProvider>
  )
}
```

### 为什么无需替换

- `WandRnProvider` 已包含 `FlowerProvider` 的所有功能
- 两个 Provider 同时使用会造成上下文重叠和资源浪费
- `WandRnProvider` 是 `FlowerProvider` 的完全升级版本，属性完全兼容

## 关键点

- **基本使用保持兼容**：所有已有的属性和功能都保持一致
- **组件名称改变**：`FlowerProvider` → `WandRnProvider`（但可能提供别名保持兼容）
- **新增 saasModal 属性**：用于子 Bundle 模态框配置，可选属性
- **ExtContext 扩展**：新增 saasModal 字段，但对现有代码无影响
- **完全向后兼容**：旧代码仅需改变导入路径和/或组件名称即可使用
- **推荐迁移步骤**：
  1. 将导入改为 `import { WandRnProvider } from '@sfe/wand-rn'`
  2. 如果组件名称为 `FlowerProvider`，改为 `WandRnProvider`（或使用别名）
  3. 其他代码无需改动
  4. 根据需要使用新的 `saasModal` 属性
  5. 如果已有 `WandRnProvider`，直接移除旧的 `FlowerProvider` 即可
- **与 Portal 集成**：Provider 内部自动包含 Portal.Host，支持弹窗、模态框等
- **与主题系统集成**：Provider 内部包含 ThemeProvider，支持全局主题配置
