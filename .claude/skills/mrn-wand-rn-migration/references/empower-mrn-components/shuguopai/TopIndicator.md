# TopIndicator 顶层加载指示器

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn` (使用 Toast API)

## 旧组件 API

```tsx
interface TopIndicatorProps {
    text?: string  // 默认 "请稍后"，加载文案
    icon?: 'ios' | 'android' | ImageSourcePropType  // 默认 'ios'，loading icon
    show?: boolean  // 默认 false，控制是否展示
    iconSize?: number | 'small' | 'middle' | 'large'  // 默认 'middle' (small=30, middle=40, large=50)
    preventClick?: boolean  // 默认 true，是否阻止点击事件向下传递
    style?: StyleProp<ViewStyle>  // container 样式，默认占满全屏
    wrapperStyle?: StyleProp<ViewStyle>  // wrapper 样式，默认圆角半透明矩形
    textStyle?: StyleProp<TextStyle>  // 文本样式，默认白色，大小14
    iconStyle?: StyleProp<ImageStyle>  // 图标样式
}

// TopIndicator 使用 Indicator，强制全屏居中展示
<TopIndicator show={boolean} {...TopIndicatorProps} />
```

## 新组件 API

```tsx
// Toast 是全局方法，不是组件
const key = Toast.loading({
    content: 'Loading...'
})
Toast.remove(key)
```

## 迁移策略

TopIndicator 在 wand-rn 中对应使用 Toast API，但由于 Toast 是全局调用而不是组件形式，需要创建一个适配器组件来保持原有的组件使用方式。

## 迁移步骤

### 步骤 1：创建包装组件

在 `src/components/loading/index.tsx` 中创建包装组件（如果不存在）：

```tsx
import React, { useEffect, useRef } from 'react'
import { Toast } from '@sfe/wand-rn'

interface LoadingProps {
    show: boolean
    content?: string
}

export const Loading: React.FC<LoadingProps> = ({
    show,
    content = '加载中...',
}) => {
    const keyRef = useRef<number | null>(null)

    useEffect(() => {
        if (show && !keyRef.current) {
            // 显示 loading
            keyRef.current = Toast.loading({
                content,
            })
        } else if (!show && keyRef.current) {
            // 移除 loading
            Toast.remove(keyRef.current)
            keyRef.current = null
        }

        // 清理函数：组件卸载时移除 loading
        return () => {
            if (keyRef.current) {
                Toast.remove(keyRef.current)
                keyRef.current = null
            }
        }
    }, [show, content])

    return null
}
```

### 步骤 2：替换使用

```tsx
// 迁移前
import { TopIndicator } from '@mtfe/empower-mrn-components/shuguopai'

function MyComponent() {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <>
            <TopIndicator show={isLoading} text="正在加载..." />
            <Button onPress={() => setIsLoading(true)}>开始加载</Button>
        </>
    )
}

// 迁移后
import { Loading } from 'src/components/loading'

function MyComponent() {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <>
            <Loading show={isLoading} content="正在加载..." />
            <Button onPress={() => setIsLoading(true)}>开始加载</Button>
        </>
    )
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| show | show prop | 控制显示/隐藏 |
| text | content prop | 提示文字 |
| icon | - | 已废弃，Toast 使用统一加载动画 |
| iconSize | - | 已废弃，Toast 大小由库控制 |
| preventClick | 默认行为 | Toast 默认阻止背景交互 |
| style | - | 已废弃，Toast 样式由库控制 |
| wrapperStyle | - | 已废弃，Toast 样式由库控制 |
| textStyle | - | 已废弃，Toast 样式由库控制 |
| iconStyle | - | 已废弃，Toast 样式由库控制 |

## 核心架构差异

### 旧架构（@mtfe/empower-mrn-components/shuguopai TopIndicator）
```tsx
TopIndicator (组件式)
├── Indicator (内部组件)
└── TopView (最顶层视图)
    └── 通过 show 属性控制全屏展示
```

### 新架构（@sfe/wand-rn Toast）
```tsx
TopIndicator (包装组件 - 适配层)
└── Toast.loading() (全局函数式调用)
    └── 透明管理全屏 Loading 显示
```

## 迁移示例

### 案例 1：基础全屏加载指示器

```tsx
// 迁移前
import { TopIndicator } from '@mtfe/empower-mrn-components/shuguopai'

function App() {
    const [loading, setLoading] = useState(false)
    return (
        <>
            <TopIndicator show={loading} />
            <Button onPress={() => setLoading(true)}>加载</Button>
        </>
    )
}

// 迁移后
import { Loading } from 'src/components/loading'

function App() {
    const [loading, setLoading] = useState(false)
    return (
        <>
            <Loading show={loading} />
            <Button onPress={() => setLoading(true)}>加载</Button>
        </>
    )
}
```

### 案例 2：自定义文本

```tsx
// 迁移前
import { TopIndicator } from '@mtfe/empower-mrn-components/shuguopai'

<TopIndicator 
    show={loading}
    text="加载中，请稍候..."
/>

// 迁移后
import { Loading } from 'src/components/loading'

<Loading 
    show={loading}
    content="加载中，请稍候..."
/>
```

### 案例 3：自定义加载样式（需要调整）

```tsx
// 迁移前 - 支持自定义图标和大小
import { TopIndicator } from '@mtfe/empower-mrn-components/shuguopai'

<TopIndicator 
    show={loading}
    icon="android"
    iconSize="large"
    iconStyle={{ tintColor: '#FF6B6B' }}
    textStyle={{ fontSize: 16, color: '#fff' }}
/>

// 迁移后 - Toast 不支持这些定制，如需自定义建议使用 Modal + Loading 组件
import { Modal, View, StyleSheet } from '@mrn/react-native'
import { Loading } from '@sfe/wand-rn'

<Modal 
    visible={loading} 
    transparent 
    animationType="fade"
    onRequestClose={() => {}}
>
    <View style={styles.container}>
        <View style={styles.wrapper}>
            <Loading 
                text="加载中..."
                type="circle"
                size={50}
                color="#FF6B6B"
                textSize={16}
                vertical
            />
        </View>
    </View>
</Modal>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    wrapper: {
        width: 120,
        height: 120,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    }
})
```

### 案例 4：异步操作中使用

```tsx
// 迁移前
import { TopIndicator } from '@mtfe/empower-mrn-components/shuguopai'

function MyComponent() {
    const [isLoading, setIsLoading] = useState(false)
    
    const handleLoad = async () => {
        setIsLoading(true)
        try {
            const result = await fetchData()
            // 处理结果
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <>
            <TopIndicator show={isLoading} text="加载数据中..." />
            <Button onPress={handleLoad}>获取数据</Button>
        </>
    )
}

// 迁移后 - 完全相同的用法
import { Loading } from 'src/components/loading'

function MyComponent() {
    const [isLoading, setIsLoading] = useState(false)
    
    const handleLoad = async () => {
        setIsLoading(true)
        try {
            const result = await fetchData()
            // 处理结果
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <>
            <Loading show={isLoading} content="加载数据中..." />
            <Button onPress={handleLoad}>获取数据</Button>
        </>
    )
}
```

### 案例 5：函数式调用（使用 Toast API 直接调用）

```tsx
// 迁移前 - 组件式使用
import { TopIndicator } from '@mtfe/empower-mrn-components/shuguopai'

const [loading, setLoading] = useState(false)
<TopIndicator show={loading} text="加载中..." />

// 迁移后 - 函数式直接调用 Toast API
import { Toast } from '@sfe/wand-rn'

const loadData = async () => {
    const key = Toast.loading({
        content: '加载中...'
    })
    
    try {
        const result = await fetchData()
        Toast.remove(key)
        Toast.show({
            content: '加载成功！'
        })
    } catch (error) {
        Toast.remove(key)
        Toast.show({
            content: '加载失败'
        })
    }
}
```

### 案例 6：多个 Loading 场景

```tsx
// 迁移前
import { TopIndicator } from '@mtfe/empower-mrn-components/shuguopai'

function App() {
    const [loadingA, setLoadingA] = useState(false)
    const [loadingB, setLoadingB] = useState(false)
    
    return (
        <>
            <TopIndicator show={loadingA} text="加载A数据..." />
            <TopIndicator show={loadingB} text="加载B数据..." />
            {/* 内容 */}
        </>
    )
}

// 迁移后 - 原始包装组件会自动处理多个实例
import { Loading } from 'src/components/loading'

function App() {
    const [loadingA, setLoadingA] = useState(false)
    const [loadingB, setLoadingB] = useState(false)
    
    return (
        <>
            <Loading show={loadingA} content="加载A数据..." />
            <Loading show={loadingB} content="加载B数据..." />
            {/* 内容 */}
        </>
    )
}

// 注：如果同时显示多个 Loading，最后一个会覆盖前面的，建议应用层控制只显示一个
```

### 案例 7：完整应用入口配置

```tsx
// 迁移前
import React, { useState } from 'react'
import { View, Button } from '@mrn/react-native'
import { TopIndicator } from '@mtfe/empower-mrn-components/shuguopai'

export function App() {
    const [loading, setLoading] = useState(false)
    
    const handleFetch = async () => {
        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TopIndicator 
                show={loading}
                text="正在加载..."
                icon="android"
                iconSize="large"
            />
            <Button title="开始加载" onPress={handleFetch} />
        </View>
    )
}

// 迁移后
import React, { useState } from 'react'
import { View, Button } from '@mrn/react-native'
import { Loading } from 'src/components/loading'

export function App() {
    const [loading, setLoading] = useState(false)
    
    const handleFetch = async () => {
        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Loading 
                show={loading}
                content="正在加载..."
            />
            <Button title="开始加载" onPress={handleFetch} />
        </View>
    )
}
```

## 关键迁移点

1. **使用方式保持不变**: 包装组件提供与旧 TopIndicator 相同的 props 接口，使用方式无需改变

2. **底层实现改变**: 
   - 旧: 基于 TopView 和 Indicator 组件
   - 新: 基于 Toast.loading() 全局 API

3. **样式定制限制**: 
   - Toast 不支持自定义图标、尺寸、样式
   - 如需高度定制，改为使用 Modal + Loading 组件方案

4. **性能优化**: Toast 是轻量级全局调用，比组件式使用性能更好

5. **事件拦截**: Toast 默认阻止背景交互，无需额外配置

6. **多个实例管理**: Toast 会按顺序显示，建议应用层控制只显示一个

## 迁移对照表

| 功能 | TopIndicator | Toast.loading | 说明 |
|------|-----------|---------|------|
| 组件式使用 | ✅ | ❌ (通过包装实现) | 使用包装组件保持一致 |
| 文本自定义 | ✅ | ✅ | 都支持 |
| 图标自定义 | ✅ | ❌ | Toast 使用统一图标 |
| 尺寸自定义 | ✅ | ❌ | Toast 大小由库控制 |
| 样式自定义 | ✅ | ❌ | Toast 样式由库控制 |
| 事件拦截 | ✅ | ✅ | 默认行为 |
| 全屏展示 | ✅ | ✅ | 都支持 |
| 函数式调用 | ❌ | ✅ | 新 API 支持 |

## 常见问题

### Q: 如何自定义 Loading 样式？
A: Toast 的样式由库统一控制，无法定制。如需完全自定义样式，可以改用 Modal + Loading 组件方案（参考案例 3）。

### Q: 如何处理多个 Loading 同时显示？
A: Toast 会按顺序显示，建议在应用层面使用单一加载状态，或使用多个 Loading 组件并管理好显示优先级。

### Q: 旧代码中的 icon 和 iconSize 参数怎么办？
A: 包装组件会忽略这些参数，因为 Toast 不支持定制。如果需要这些功能，改为使用 Modal + Loading 组件方案。

### Q: text 属性改成了 content？
A: 是的，为了与 Indicator.md 中的包装组件保持一致，新组件使用 `content` 属性。这样可以统一 API 设计。

### Q: 如何在函数式代码中直接使用 Toast？
A: 可以直接调用 Toast API：
```tsx
const key = Toast.loading({ content: '加载中...' })
// 操作完成后
Toast.remove(key)
```

### Q: 性能如何？
A: Toast 是全局轻量级 API，性能比组件式使用更好，多次切换显示/隐藏时推荐使用 Toast 直接调用。

## 迁移检查清单

- [ ] 创建 `src/components/loading/index.tsx` 包装组件
- [ ] 替换 import 语句：`@mtfe/empower-mrn-components/shuguopai` → `src/components/loading`
- [ ] 将 `TopIndicator` 组件名改为 `Loading`
- [ ] 将 `show` 属性保留（保持不变），`text` 属性改为 `content`
- [ ] 检查是否使用了 `icon`、`iconSize` 等样式属性，如有则考虑改用 Modal + Loading 方案
- [ ] 检查多个 Loading 同时使用的场景，确保应用层控制好显示逻辑
- [ ] 进行完整的功能测试
- [ ] 验证 Loading 显示/隐藏的时机是否正确
- [ ] 验证异步操作中 Loading 的正确关闭
- [ ] 测试页面路由切换时 Loading 的处理

## 注意事项

1. **保持向后兼容**: 包装组件设计允许旧代码直接使用，即使传入废弃属性也能正常工作

2. **样式定制评估**: 如果项目对 Loading 样式有高要求，迁移时需要调整为 Modal + Loading 方案

3. **Toast 全局性**: Toast 是全局 API，多个组件实例可能会相互影响，建议应用层协调

4. **无障碍支持**: Toast 由库提供，无需额外配置无障碍属性

5. **加载状态管理**: 建议使用状态管理库（如 Redux、Zustand）统一管理全局加载状态，而不是在每个组件中维护

6. **清理机制**: 包装组件的 useEffect cleanup 确保页面卸载时正确清理 Toast，无需手动处理

7. **错误处理**: 确保异步操作的 catch/finally 中正确关闭 Loading，避免 Loading 一直显示

8. **性能优化**: 对于频繁切换的 Loading，直接使用 Toast API 比使用包装组件性能更好

9. **测试用例**: 需要测试以下场景：
   - Loading 显示后立即隐藏
   - 页面切换时 Loading 状态
   - 异步操作失败时 Loading 的关闭
   - 多个异步操作的 Loading 管理

10. **迁移工具**: 可以考虑使用代码自动化工具替换 import 和组件名，但要确保逻辑正确
