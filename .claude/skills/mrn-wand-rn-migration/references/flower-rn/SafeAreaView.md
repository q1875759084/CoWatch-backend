# SafeAreaView 安全区域视图

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface SafeAreaViewProps {
    /** 用于传入需要处理的安全区域方向 */
    forceInset?: {
        top?: 'always' | 'never'
        bottom?: 'always' | 'never'
        left?: 'always' | 'never'
        right?: 'always' | 'never'
        vertical?: 'always' | 'never'
        horizontal?: 'always' | 'never'
    } | number  // 默认 { top: 'always', bottom: 'never' }
    
    /** 自定义样式 */
    style?: StyleProp<ViewStyle>
    
    /** 子元素 */
    children?: React.ReactNode
}

export const SafeAreaView: React.FC<SafeAreaViewProps>
```

## 新组件 API

```tsx
interface SafeAreaViewProps {
    /** 用于传入需要处理的安全区域方向 */
    forceInset?: {
        top?: 'always' | 'never'
        bottom?: 'always' | 'never'
        left?: 'always' | 'never'
        right?: 'always' | 'never'
        vertical?: 'always' | 'never'
        horizontal?: 'always' | 'never'
    } | number  // 默认 { top: 'always', bottom: 'never' }
    
    /** 自定义样式 */
    style?: StyleProp<ViewStyle>
    
    /** 子元素 */
    children?: React.ReactNode
}

export const SafeAreaView: React.FC<SafeAreaViewProps>
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| forceInset 默认值 | forceInset 默认值 | 完全相同 |
| style | style | 完全相同 |
| children | children | 完全相同 |

## 关键变更

### 1. 完全向后兼容

**新版本**与**旧版本**的 API 完全相同，包括：
- 所有属性名称相同
- 所有属性类型相同
- 所有默认值相同
- 功能实现完全相同

这是一个直接的组件下沉，无需任何 API 改动。

```tsx
// 迁移前
import { SafeAreaView } from '@sgfe/flower-rn'

<SafeAreaView
  forceInset={{ top: 'always', bottom: 'never' }}
  style={{ flex: 1, backgroundColor: '#fff' }}
>
  {children}
</SafeAreaView>

// 迁移后（完全相同）
import { SafeAreaView } from '@sfe/wand-rn'

<SafeAreaView
  forceInset={{ top: 'always', bottom: 'never' }}
  style={{ flex: 1, backgroundColor: '#fff' }}
>
  {children}
</SafeAreaView>
```

## 迁移示例

### 案例 1：基础使用（无需改动）

```tsx
// 迁移前
import { SafeAreaView } from '@sgfe/flower-rn'

export function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text>内容区域</Text>
    </SafeAreaView>
  )
}

// 迁移后（无需改动）
import { SafeAreaView } from '@sfe/wand-rn'

export function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text>内容区域</Text>
    </SafeAreaView>
  )
}
```

### 案例 2：自定义安全区域处理

```tsx
// 迁移前
import { SafeAreaView } from '@sgfe/flower-rn'

<SafeAreaView
  forceInset={{
    top: 'always',
    bottom: 'always',
    left: 'always',
    right: 'always'
  }}
  style={{ flex: 1 }}
>
  {children}
</SafeAreaView>

// 迁移后（完全相同）
import { SafeAreaView } from '@sfe/wand-rn'

<SafeAreaView
  forceInset={{
    top: 'always',
    bottom: 'always',
    left: 'always',
    right: 'always'
  }}
  style={{ flex: 1 }}
>
  {children}
</SafeAreaView>
```

### 案例 3：仅处理顶部安全区域

```tsx
// 迁移前
import { SafeAreaView } from '@sgfe/flower-rn'

<SafeAreaView
  forceInset={{ top: 'always' }}
  style={{ flex: 1 }}
>
  <Header />
  {children}
</SafeAreaView>

// 迁移后（完全相同）
import { SafeAreaView } from '@sfe/wand-rn'

<SafeAreaView
  forceInset={{ top: 'always' }}
  style={{ flex: 1 }}
>
  <Header />
  {children}
</SafeAreaView>
```

### 案例 4：底部导航栏场景

```tsx
// 迁移前
import { SafeAreaView } from '@sgfe/flower-rn'

<SafeAreaView
  forceInset={{ top: 'always', bottom: 'never' }}
  style={{ flex: 1 }}
>
  <View style={{ flex: 1 }}>{children}</View>
  <View style={styles.tabBar}><TabBar /></View>
  <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }} style={styles.tabBarSafe}>
    <View />
  </SafeAreaView>
</SafeAreaView>

// 迁移后（完全相同）
import { SafeAreaView } from '@sfe/wand-rn'

<SafeAreaView
  forceInset={{ top: 'always', bottom: 'never' }}
  style={{ flex: 1 }}
>
  <View style={{ flex: 1 }}>{children}</View>
  <View style={styles.tabBar}><TabBar /></View>
  <SafeAreaView forceInset={{ top: 'never', bottom: 'always' }} style={styles.tabBarSafe}>
    <View />
  </SafeAreaView>
</SafeAreaView>
```

### 案例 5：使用数值设置安全区域

```tsx
// 迁移前
import { SafeAreaView } from '@sgfe/flower-rn'

// forceInset 也支持直接传递数值来完全覆盖填充
<SafeAreaView
  forceInset={20}  // 所有方向均为 20
  style={{ flex: 1 }}
>
  {children}
</SafeAreaView>

// 迁移后（完全相同）
import { SafeAreaView } from '@sfe/wand-rn'

<SafeAreaView
  forceInset={20}
  style={{ flex: 1 }}
>
  {children}
</SafeAreaView>
```

### 案例 6：完整应用布局示例

```tsx
// 迁移前
import { SafeAreaView } from '@sgfe/flower-rn'
import { View, Text } from '@mrn/react-native'

export function AppLayout() {
  return (
    <SafeAreaView
      forceInset={{
        top: 'always',
        bottom: 'never'
      }}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      {/* 顶部安全区域已处理 */}
      <Header />
      
      {/* 主要内容区域，需要自己处理底部安全区域 */}
      <ScrollView style={{ flex: 1 }}>
        <Content />
      </ScrollView>
      
      {/* 底部导航，使用嵌套 SafeAreaView 处理底部安全区域 */}
      <View style={{ backgroundColor: '#f0f0f0' }}>
        <Divider />
        <View style={{ paddingVertical: 10 }}>
          <Navigation />
        </View>
        <SafeAreaView 
          forceInset={{ top: 'never', bottom: 'always' }}
          style={{ height: 0 }}
        />
      </View>
    </SafeAreaView>
  )
}

// 迁移后（完全相同，仅需改导入）
import { SafeAreaView } from '@sfe/wand-rn'
import { View, Text } from '@mrn/react-native'

export function AppLayout() {
  return (
    <SafeAreaView
      forceInset={{
        top: 'always',
        bottom: 'never'
      }}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      {/* 顶部安全区域已处理 */}
      <Header />
      
      {/* 主要内容区域，需要自己处理底部安全区域 */}
      <ScrollView style={{ flex: 1 }}>
        <Content />
      </ScrollView>
      
      {/* 底部导航，使用嵌套 SafeAreaView 处理底部安全区域 */}
      <View style={{ backgroundColor: '#f0f0f0' }}>
        <Divider />
        <View style={{ paddingVertical: 10 }}>
          <Navigation />
        </View>
        <SafeAreaView 
          forceInset={{ top: 'never', bottom: 'always' }}
          style={{ height: 0 }}
        />
      </View>
    </SafeAreaView>
  )
}
```

## 关键点

- **完全向后兼容**：SafeAreaView 在 flower-rn 和 wand-rn 中的 API 完全相同
- **无需代码改动**：仅需改变导入语句，其他代码保持不变
- **默认值保持一致**：默认 forceInset 为 `{ top: 'always', bottom: 'never' }`
- **属性保持一致**：style、forceInset、children 等所有属性完全相同
- **灵活的 forceInset 配置**：支持对象形式和数值形式
- **嵌套使用支持**：可以嵌套使用多个 SafeAreaView 处理不同方向的安全区域
- **基于 @mrn/react-native-safe-area-view**：两个版本都是对原生库的封装，仅添加了默认参数
- **iOS 和 Android 兼容**：在 iOS 处理刘海屏，在 Android 处理导航栏等安全区域
