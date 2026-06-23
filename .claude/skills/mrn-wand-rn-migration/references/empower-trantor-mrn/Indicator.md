# Indicator 指示器 / Loading 加载

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sfe/wand-rn` (使用 Toast API)

## 旧组件 API

```tsx
export interface IndicatorProps {
    style?: ViewStyle  // 外层，默认全屏，用于阻止点击
    innerStyle?: ViewStyle  // 内层，默认圆角矩形
    textStyle?: TextStyle
    text?: string
    show?: boolean
    size?: number | 'small' | 'large'  // 默认 'large'
    preventClick?: boolean  // 默认 true
}
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

Indicator 在 wand-rn 中对应使用 Toast API，但由于 Toast 是全局调用而不是组件形式，需要创建一个适配器组件来保持原有的组件使用方式。

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
import { Indicator } from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <>
            <Indicator show={isLoading} text="加载中..." />
            <Button onPress={() => setIsLoading(true)}>加载</Button>
        </>
    )
}

// 迁移后
import { Loading } from 'src/components/loading'

function MyComponent() {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <>
            <Loading show={isLoading} content="加载中..." />
            <Button onPress={() => setIsLoading(true)}>加载</Button>
        </>
    )
}
```

## 迁移对照表

| 旧属性 | 新实现 | 说明 |
|--------|--------|------|
| show | show prop | 控制显示/隐藏 |
| text | content prop | 提示文字 |
| style | - | Toast 样式由库控制 |
| innerStyle | - | Toast 样式由库控制 |
| textStyle | - | Toast 样式由库控制 |
| size | - | Toast 大小由库控制 |
| preventClick | 默认行为 | Toast 默认阻止背景交互 |

## 关键点

- Indicator 对应 `Toast.loading()`，但使用方式从组件变为函数调用
- 创建包装组件可以保持代码的向后兼容性
- 使用 `useRef` 来追踪 Toast key，避免重复创建
- `useEffect` cleanup 确保页面卸载时正确清理
- `text` 属性对应新 API 的 `content` 属性
- 样式定制能力有限，Toast 样式主要由 wand-rn 库控制

## 常见问题

### Q: 如何自定义 Loading 样式？
A: wand-rn 的 Toast 样式由库统一控制，如需完全自定义，可以考虑使用 Modal + ActivityIndicator 自己实现。

### Q: 多个 Loading 同时显示会怎样？
A: Toast 会按顺序显示，建议在应用层面控制只显示一个全局 Loading。

### Q: 如何在函数式调用中使用？
A: 可以直接使用 Toast API：
```tsx
const key = Toast.loading({ content: '加载中...' })
// 操作完成后
Toast.remove(key)
```
