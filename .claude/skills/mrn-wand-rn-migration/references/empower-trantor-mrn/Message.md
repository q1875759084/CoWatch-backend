# Message/Toast 消息提示

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
// Toast 相关枚举
enum ToastGravity {
    CENTER = 0,
    TOP = 1,
    BOTTOM = 2
}

enum ToastIconDirection {
    HORIZONTAL = 0,  // 图标在左/右
    VERTICAL = 1     // 图标在上/下
}

enum ToastDuration {
    SHORT = 0,  // 短时间
    LONG = 1    // 长时间
}

// Toast 参数接口
interface ToastParams {
    message: string                      // 消息内容
    icon?: ImageUri | ImageRequireSource // 图标（支持多种格式）
    iconSize?: number                    // 图标大小，默认 30
    gravity?: ToastGravity               // 位置，默认 CENTER
    iconDirection?: ToastIconDirection   // 图标方向，默认 HORIZONTAL
    fontSize?: number                    // 字体大小，默认 15
    color?: string                       // 文字颜色
    backgroundColor?: string             // 背景颜色
    duration?: ToastDuration             // Android 时长（枚举）
    durationIOS?: number                 // iOS 时长（秒）默认 3
}

// 使用方式
showToast(params: ToastParams | string)
showErrorToast(err: any)  // 错误提示的便捷方法
```

## 新组件 API

```tsx
interface IToastProps {
    content: string | React.ReactNode  // 提示内容
    duration?: number                   // 自动关闭延时（ms），默认 3000
    onClose?: () => void               // 关闭后回调
    mask?: boolean                     // 是否显示蒙层，默认 false
}

// Toast 静态方法
Toast.info(props: string | IToastProps, duration?: number, onClose?: () => void, mask?: boolean): number
Toast.success(props: string | IToastProps, duration?: number, onClose?: () => void, mask?: boolean): number
Toast.fail(props: string | IToastProps, duration?: number, onClose?: () => void, mask?: boolean): number
Toast.loading(props: string | IToastProps, duration?: number, onClose?: () => void, mask?: boolean): number
Toast.remove(key: number): void
Toast.removeAll(): void
Toast.config(props: IToastConfigurable): void  // 配置默认值
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| message | content | 消息内容 |
| duration/durationIOS | duration | 统一为毫秒单位，默认 3000ms |
| icon | - | 新版本使用类型方法（success/fail/loading）自动显示图标 |
| iconSize | - | 图标大小由主题控制 |
| iconDirection | - | 图标位置由主题控制 |
| gravity | - | 位置固定为居中 |
| fontSize | - | 字体大小由主题控制 |
| color | - | 文字颜色由主题控制 |
| backgroundColor | - | 背景颜色由主题控制 |
| - | mask | 新增：是否显示蒙层防止穿透 |
| - | onClose | 新增：关闭后回调 |

## 迁移示例

### 案例 1：简单文本提示

```tsx
// 迁移前
import { showToast } from '@mtfe/empower-trantor-mrn'

showToast('操作成功')

// 迁移后
import { Toast } from '@sfe/wand-rn'

Toast.info('操作成功')
```

### 案例 2：带配置的提示

```tsx
// 迁移前
import { showToast, ToastGravity, ToastDuration } from '@mtfe/empower-trantor-mrn'

showToast({
    message: '加载中...',
    gravity: ToastGravity.CENTER,
    duration: ToastDuration.LONG,
    durationIOS: 3
})

// 迁移后
import { Toast } from '@sfe/wand-rn'

Toast.info('加载中...', 3000)  // 3000ms = 3秒
```

### 案例 3：错误提示

```tsx
// 迁移前
import { showErrorToast } from '@mtfe/empower-trantor-mrn'

try {
    await someAsyncOperation()
} catch (error) {
    showErrorToast(error)
}

// 迁移后
import { Toast } from '@sfe/wand-rn'

// 方式1：提取错误信息
const getErrorMsg = (err: any) => {
    if (typeof err === 'string') return err
    return err?.msg || err?.errMsg || err?.message || '操作失败'
}

try {
    await someAsyncOperation()
} catch (error) {
    Toast.fail(getErrorMsg(error))
}

// 方式2：直接使用 fail 方法
try {
    await someAsyncOperation()
} catch (error) {
    Toast.fail(error.message || '操作失败')
}
```

### 案例 4：成功提示

```tsx
// 迁移前
import { showToast } from '@mtfe/empower-trantor-mrn'
import successIcon from './assets/success.png'

showToast({
    message: '保存成功',
    icon: successIcon,
    duration: ToastDuration.SHORT
})

// 迁移后
import { Toast } from '@sfe/wand-rn'

Toast.success('保存成功', 2000)  // 使用 success 方法自动显示成功图标
```

### 案例 5：加载提示（需手动关闭）

```tsx
// 迁移前
import { showToast, ToastGravity } from '@mtfe/empower-trantor-mrn'
import loadingIcon from './assets/loading.gif'

showToast({
    message: '加载中...',
    icon: loadingIcon,
    gravity: ToastGravity.CENTER
})

// 稍后手动隐藏（旧版本需要额外处理）

// 迁移后
import { Toast } from '@sfe/wand-rn'

const key = Toast.loading('加载中...')  // loading 默认 duration=0，不自动关闭

// 操作完成后手动移除
setTimeout(() => {
    Toast.remove(key)
}, 2000)

// 或者直接移除所有 toast
Toast.removeAll()
```

### 案例 6：带蒙层的提示（防止穿透点击）

```tsx
// 迁移前
// 旧版本通过原生桥接实现，无直接的蒙层控制

// 迁移后
import { Toast } from '@sfe/wand-rn'

// loading 默认有蒙层
const key = Toast.loading('处理中...')  // mask 默认为 true

// 其他类型需要显式设置
Toast.info('请稍候', 3000, () => {}, true)  // 最后一个参数为 mask
```

### 案例 7：带关闭回调

```tsx
// 迁移前
// 旧版本无关闭回调

// 迁移后
import { Toast } from '@sfe/wand-rn'

Toast.success('提交成功', 2000, () => {
    console.log('Toast 已关闭')
    // 执行后续操作
})
```

### 案例 8：配置全局默认值

```tsx
// 迁移前
// 旧版本通过 defaultToastParams 配置

// 迁移后
import { Toast } from '@sfe/wand-rn'

// 在应用初始化时配置
Toast.config({
    duration: 2000,  // 全局默认 2 秒
    mask: false
})

// 之后所有 Toast 都使用这些默认值
Toast.info('使用全局配置')
```

### 案例 9：自定义内容

```tsx
// 迁移前
import { showToast } from '@mtfe/empower-trantor-mrn'

showToast({
    message: '这是一段文本',
    fontSize: 16,
    color: '#333'
})

// 迁移后
import { Toast } from '@sfe/wand-rn'
import { Text } from '@mrn/react-native'

// 使用 ReactNode 作为内容
Toast.info({
    content: (
        <Text style={{ fontSize: 16, color: '#333' }}>
            这是一段文本
        </Text>
    )
})
```

## 关键点

- **API 风格变化**: 从函数调用 `showToast()` 变为静态方法 `Toast.info()`、`Toast.success()` 等
- **时长单位**: 旧版本 Android 使用枚举（SHORT/LONG），iOS 使用秒；新版本统一使用毫秒（ms）
- **图标处理**: 旧版本需要手动传入图标，新版本通过不同方法（success/fail/loading）自动显示对应图标
- **位置固定**: 新版本不支持自定义位置，统一为居中显示
- **样式定制**: 新版本的字体、颜色、背景等由主题系统控制，不支持单次调用时自定义
- **蒙层支持**: 新版本新增 `mask` 参数，loading 默认有蒙层，其他类型默认无蒙层
- **关闭回调**: 新版本支持 `onClose` 回调，方便执行后续操作
- **手动关闭**: 使用 `Toast.loading()` 或 `duration=0` 时，需要手动调用 `Toast.remove(key)` 关闭
- **类型安全**: 新版本返回数字 key，用于后续移除操作

## 错误处理迁移建议

建议创建一个工具函数统一处理错误提示：

```tsx
// utils/toast.ts
import { Toast } from '@sfe/wand-rn'

export const getErrorMsg = (err: any): string => {
    if (typeof err === 'string') return err
    return err?.msg || err?.errMsg || err?.message || '操作失败'
}

export const showErrorToast = (err: any) => {
    Toast.fail(getErrorMsg(err))
}

// 使用
import { showErrorToast } from './utils/toast'

try {
    await someOperation()
} catch (error) {
    showErrorToast(error)
}
```

## 常见问题

### Q: 如何实现顶部或底部显示 Toast？
A: 新版本 wand-rn Toast 固定居中显示，不支持自定义位置。如需顶部/底部提示，可以考虑使用其他组件如 `Tip` 或自定义实现。

### Q: 如何自定义 Toast 的样式（字体、颜色、背景等）？
A: 新版本通过主题系统控制样式，在应用入口使用 `Provider` 配置主题即可全局生效。

### Q: Toast.loading() 为什么不自动消失？
A: loading 的默认 `duration` 为 0，表示不自动关闭，需要在操作完成后手动调用 `Toast.remove(key)` 关闭。

### Q: 如何一次性关闭所有 Toast？
A: 使用 `Toast.removeAll()` 方法。
