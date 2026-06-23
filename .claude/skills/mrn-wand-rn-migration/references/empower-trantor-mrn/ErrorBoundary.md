# ErrorBoundary 错误边界

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface ErrorBoundaryProps {
    children?: React.ReactNode
    FallbackComponent?: React.ComponentType<{ error?: Error; errorInfo?: React.ErrorInfo }>
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}
```

## 新组件 API

```tsx
export interface ErrorBoundaryProps {
    children?: React.ReactNode
    FallbackComponent?: React.ComponentType<{ error?: Error; errorInfo?: React.ErrorInfo }>
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| children | children | 子组件，保持一致 |
| FallbackComponent | FallbackComponent | 错误时显示的降级组件，保持一致 |
| onError | onError | 错误回调函数，保持一致 |

## 迁移示例

### 案例 1：基础使用

```tsx
// 迁移前
import { ErrorBoundary } from '@mtfe/empower-trantor-mrn'

function App() {
    return (
        <ErrorBoundary>
            <MyComponent />
        </ErrorBoundary>
    )
}

// 迁移后
import { ErrorBoundary } from '@sfe/wand-rn'

function App() {
    return (
        <ErrorBoundary>
            <MyComponent />
        </ErrorBoundary>
    )
}
```

### 案例 2：自定义降级组件

```tsx
// 迁移前
import { ErrorBoundary } from '@mtfe/empower-trantor-mrn'

function App() {
    const FallbackComponent = ({ error }: { error?: Error }) => (
        <View style={styles.container}>
            <Text>出错了: {error?.message}</Text>
        </View>
    )

    return (
        <ErrorBoundary FallbackComponent={FallbackComponent}>
            <MyComponent />
        </ErrorBoundary>
    )
}

// 迁移后
import { ErrorBoundary } from '@sfe/wand-rn'

function App() {
    const FallbackComponent = ({ error }: { error?: Error }) => (
        <View style={styles.container}>
            <Text>出错了: {error?.message}</Text>
        </View>
    )

    return (
        <ErrorBoundary FallbackComponent={FallbackComponent}>
            <MyComponent />
        </ErrorBoundary>
    )
}
```

### 案例 3：错误回调

```tsx
// 迁移前
import { ErrorBoundary } from '@mtfe/empower-trantor-mrn'

function App() {
    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        // 上报错误日志
    }

    return (
        <ErrorBoundary onError={handleError}>
            <MyComponent />
        </ErrorBoundary>
    )
}

// 迁移后
import { ErrorBoundary } from '@sfe/wand-rn'

function App() {
    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        // 上报错误日志
    }

    return (
        <ErrorBoundary onError={handleError}>
            <MyComponent />
        </ErrorBoundary>
    )
}
```

### 案例 4：完整示例

```tsx
// 迁移前
import { ErrorBoundary } from '@mtfe/empower-trantor-mrn'
import { View, Text, Button } from '@mrn/react-native'

function App() {
    const FallbackComponent = ({ error }: { error?: Error }) => (
        <View style={styles.fallback}>
            <Text style={styles.text}>页面出错了</Text>
            <Button onPress={() => window.location.reload()}>刷新</Button>
        </View>
    )

    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
        // 上报错误
        reportError(error, errorInfo)
    }

    return (
        <ErrorBoundary
            FallbackComponent={FallbackComponent}
            onError={handleError}
        >
            <MyApp />
        </ErrorBoundary>
    )
}

// 迁移后
import { ErrorBoundary, Button } from '@sfe/wand-rn'
import { View, Text } from '@mrn/react-native'

function App() {
    const FallbackComponent = ({ error }: { error?: Error }) => (
        <View style={styles.fallback}>
            <Text style={styles.text}>页面出错了</Text>
            <Button onPress={() => window.location.reload()}>刷新</Button>
        </View>
    )

    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
        // 上报错误
        reportError(error, errorInfo)
    }

    return (
        <ErrorBoundary
            FallbackComponent={FallbackComponent}
            onError={handleError}
        >
            <MyApp />
        </ErrorBoundary>
    )
}
```

## 关键点

- **API 完全兼容**：ErrorBoundary 的 API 在新旧库中完全一致
- **直接替换**：只需修改 import 路径即可
- **功能保持一致**：错误捕获、降级组件、错误回调等功能保持不变

## 迁移检查清单

- [ ] 将所有 `import { ErrorBoundary } from '@mtfe/empower-trantor-mrn'` 改为 `import { ErrorBoundary } from '@sfe/wand-rn'`
- [ ] 验证错误边界是否正常捕获错误
- [ ] 验证降级组件是否正常显示
- [ ] 验证错误回调是否正常触发
- [ ] 测试错误上报功能是否正常

## 注意事项

1. **直接替换即可**：ErrorBoundary 是完全兼容的组件，只需修改 import 路径
2. **降级组件样式**：如果使用了自定义降级组件，注意检查样式是否需要调整
3. **错误上报**：确保 onError 回调中的错误上报逻辑正常工作
