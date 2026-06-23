# ScannerView 扫码组件

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export enum ScanType {
    BarCode = 'BarCode',
    QrCode = 'QrCode',
}

export enum ErrorCode {
    GallaryError = 1,
    GallaryCancel = 2,
    GallaryNullResult = 3,
    GallaryExtractError = 4,
    NoPreviewAuth = 11,
    PreviewError = 12,
    Back = 20,
    Unkown = 21,
}

export type TopBarOption = {
    icon?: React.ReactNode
    onPress: () => void
}

export interface ScannerViewProps {
    /** 扫码类型 */
    scanType?: ScanType
    /** 屏幕类型，full 表示全屏扫码，half 表示非全屏扫码 */
    mode?: 'full' | 'half'
    /** 扫码区域样式 */
    styles?: ViewStyle
    /** 顶部 bar 样式 */
    topBarStyles?: ViewStyle
    /** 是否展示返回按钮 */
    showBack?: boolean
    /** 导航栏自定义功能 */
    topBarOptions?: TopBarOption[] | React.ReactNode[]
    /** 帮助提示 */
    tips?: string | React.ReactNode
    /** 是否展示相册入口 */
    showGallery?: boolean
    /** 子元素 */
    children?: React.ReactNode
    /** 识别成功回调 */
    onSuccess: (code: string) => void
    /** 异常回调 */
    onError?: (error: { code: ErrorCode; msg: string }) => void
    /** 返回回调 */
    onBackPress?: () => void
}

/** Ref 方法 */
export interface ScannerViewRef {
    startDecode: () => void
    stopDecode: () => void
    startPreview: () => void
    stopPreview: () => void
}
```

## 新组件 API

```tsx
export enum ScanType {
    BarCode = 'BarCode',
    QrCode = 'QrCode',
}

export enum ScanMode {
    Full = 'full',
    Half = 'half'
}

export enum ErrorCode {
    GallaryError = 1,
    GallaryCancel = 2,
    GallaryNullResult = 3,
    GallaryExtractError = 4,
    NoPreviewAuth = 11,
    PreviewError = 12,
    Back = 20,
    Unkown = 21,
}

export type TopBarOption = {
    icon?: React.ReactNode
    onPress: () => void
}

export interface ScannerViewProps {
    /** 扫码类型 */
    scanType?: ScanType
    /** 屏幕类型，full 表示全屏扫码，half 表示非全屏扫码 */
    mode?: 'half' | 'full' | ScanMode
    /** 顶部 bar 样式 */
    topBarStyles?: ViewStyle
    /** 是否展示返回按钮 */
    showBack?: boolean
    /** 导航栏自定义功能 */
    topBarOptions?: TopBarOption[] | React.ReactNode[]
    /** 帮助提示 */
    tips?: string | React.ReactNode
    /** 是否展示相册入口 */
    showGallery?: boolean
    /** 子元素 */
    children?: React.ReactNode
    /** 识别成功回调 */
    onSuccess: (code: string) => void
    /** 异常回调 */
    onError?: (error: { code: ErrorCode; msg: string }) => void
    /** 返回回调 */
    onBackPress?: () => void
    /** 扫码区域样式 */
    styles?: ViewStyle
}

/** Ref 方法 */
export interface ScannerViewRef {
    startDecode: () => void
    stopDecode: () => void
    startPreview: () => void
    stopPreview: () => void
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| `scanType` | `scanType` | 保持不变 |
| `mode` | `mode` | 保持兼容，新增 `ScanMode` 枚举类型 |
| `styles` | `styles` | 保持不变 |
| `topBarStyles` | `topBarStyles` | 保持不变 |
| `showBack` | `showBack` | 保持不变 |
| `topBarOptions` | `topBarOptions` | 保持不变 |
| `tips` | `tips` | 保持不变 |
| `showGallery` | `showGallery` | 保持不变 |
| `children` | `children` | 保持不变 |
| `onSuccess` | `onSuccess` | 保持不变 |
| `onError` | `onError` | 保持不变 |
| `onBackPress` | `onBackPress` | 保持不变 |
| `ErrorCode` | `ErrorCode` | 枚举值完全相同 |
| `TopBarOption` | `TopBarOption` | 接口完全相同 |

## 关键变更

### 1. ScanMode 枚举新增

新库引入了 `ScanMode` 枚举，以提供更好的类型支持。但字符串字面量仍然兼容：

```tsx
// 迁移前：使用字符串字面量
<ScannerView mode="full" />
<ScannerView mode="half" />

// 迁移后：仍支持字符串字面量
<ScannerView mode="full" />
<ScannerView mode="half" />

// 或者使用新的枚举类型（推荐）
import { ScanMode } from '@sfe/wand-rn'
<ScannerView mode={ScanMode.Full} />
<ScannerView mode={ScanMode.Half} />
```

### 2. Icon 类型内部更新

新库内部使用了更新的 Icon 类型，但如果自定义 `topBarOptions` 中的 Icon，会自动使用新库的 Icon 组件。这对用户透明，无需修改代码。

### 3. 应用前后台切换优化

新库增加了应用前后台切换时的动画处理：
- 应用从后台返回前台时，自动重启扫描动画
- 应用进入后台时，自动停止扫描动画

这是内部实现改进，用户无需关心。

### 4. 内部实现改进

新库使用了 `WithTheme` 和其他内部优化，提升了扫码的性能和稳定性。

## 迁移示例

### 案例 1：基础扫码组件

```tsx
// 迁移前
import { ScannerView, ErrorCode } from '@sgfe/flower-rn'
import { useRef } from 'react'

export const BasicScanner = () => {
    const scannerViewRef = useRef(null)

    const onSuccess = (code) => {
        console.log('扫码成功:', code)
    }

    const onError = (res) => {
        if (res.code !== ErrorCode.GallaryCancel) {
            console.error(`[${res.code}]${res.msg}`)
        }
    }

    return (
        <ScannerView
            ref={scannerViewRef}
            mode="half"
            onSuccess={onSuccess}
            onError={onError}
        />
    )
}

// 迁移后
import { ScannerView, ErrorCode } from '@sfe/wand-rn'
import { useRef } from 'react'

export const BasicScanner = () => {
    const scannerViewRef = useRef(null)

    const onSuccess = (code) => {
        console.log('扫码成功:', code)
    }

    const onError = (res) => {
        if (res.code !== ErrorCode.GallaryCancel) {
            console.error(`[${res.code}]${res.msg}`)
        }
    }

    return (
        <ScannerView
            ref={scannerViewRef}
            mode="half"
            onSuccess={onSuccess}
            onError={onError}
        />
    )
}
```

### 案例 2：全屏扫码

```tsx
// 迁移前
import { ScannerView } from '@sgfe/flower-rn'

<ScannerView
    mode="full"
    onSuccess={(code) => console.log(code)}
    onError={(err) => console.error(err)}
/>

// 迁移后
import { ScannerView } from '@sfe/wand-rn'

<ScannerView
    mode="full"
    onSuccess={(code) => console.log(code)}
    onError={(err) => console.error(err)}
/>
```

### 案例 3：显示返回按钮

```tsx
// 迁移前
import { ScannerView } from '@sgfe/flower-rn'

<ScannerView
    mode="half"
    showBack
    onBackPress={() => console.log('返回')}
    onSuccess={(code) => console.log(code)}
    onError={(err) => console.error(err)}
/>

// 迁移后
import { ScannerView } from '@sfe/wand-rn'

<ScannerView
    mode="half"
    showBack
    onBackPress={() => console.log('返回')}
    onSuccess={(code) => console.log(code)}
    onError={(err) => console.error(err)}
/>
```

### 案例 4：显示相册和提示文案

```tsx
// 迁移前
import { ScannerView } from '@sgfe/flower-rn'

<ScannerView
    showGallery
    tips="扫描二维码"
    onSuccess={(code) => console.log(code)}
    onError={(err) => console.error(err)}
/>

// 迁移后
import { ScannerView } from '@sfe/wand-rn'

<ScannerView
    showGallery
    tips="扫描二维码"
    onSuccess={(code) => console.log(code)}
    onError={(err) => console.error(err)}
/>
```

### 案例 5：自定义导航栏选项

```tsx
// 迁移前
import { ScannerView } from '@sgfe/flower-rn'
import { View, Text } from '@mrn/react-native'

<ScannerView
    topBarOptions={[
        {
            icon: <View><Text>选项1</Text></View>,
            onPress: () => console.log('选项1'),
        },
        {
            icon: <View><Text>选项2</Text></View>,
            onPress: () => console.log('选项2'),
        },
    ]}
    onSuccess={(code) => console.log(code)}
    onError={(err) => console.error(err)}
/>

// 迁移后
import { ScannerView } from '@sfe/wand-rn'
import { View, Text } from '@mrn/react-native'

<ScannerView
    topBarOptions={[
        {
            icon: <View><Text>选项1</Text></View>,
            onPress: () => console.log('选项1'),
        },
        {
            icon: <View><Text>选项2</Text></View>,
            onPress: () => console.log('选项2'),
        },
    ]}
    onSuccess={(code) => console.log(code)}
    onError={(err) => console.error(err)}
/>
```

### 案例 6：使用 Ref 控制扫码

```tsx
// 迁移前
import { ScannerView } from '@sgfe/flower-rn'
import { Button } from 'react-native'
import { useRef } from 'react'

export const ControlledScanner = () => {
    const scannerViewRef = useRef(null)

    return (
        <>
            <ScannerView
                ref={scannerViewRef}
                mode="half"
                onSuccess={(code) => console.log(code)}
                onError={(err) => console.error(err)}
            />
            <Button
                title="开始解码"
                onPress={() => scannerViewRef.current?.startDecode?.()}
            />
            <Button
                title="停止解码"
                onPress={() => scannerViewRef.current?.stopDecode?.()}
            />
            <Button
                title="开始预览"
                onPress={() => scannerViewRef.current?.startPreview?.()}
            />
            <Button
                title="停止预览"
                onPress={() => scannerViewRef.current?.stopPreview?.()}
            />
        </>
    )
}

// 迁移后
import { ScannerView } from '@sfe/wand-rn'
import { Button } from 'react-native'
import { useRef } from 'react'

export const ControlledScanner = () => {
    const scannerViewRef = useRef(null)

    return (
        <>
            <ScannerView
                ref={scannerViewRef}
                mode="half"
                onSuccess={(code) => console.log(code)}
                onError={(err) => console.error(err)}
            />
            <Button
                title="开始解码"
                onPress={() => scannerViewRef.current?.startDecode?.()}
            />
            <Button
                title="停止解码"
                onPress={() => scannerViewRef.current?.stopDecode?.()}
            />
            <Button
                title="开始预览"
                onPress={() => scannerViewRef.current?.startPreview?.()}
            />
            <Button
                title="停止预览"
                onPress={() => scannerViewRef.current?.stopPreview?.()}
            />
        </>
    )
}
```

### 案例 7：处理各种错误类型

```tsx
// 迁移前
import { ScannerView, ErrorCode } from '@sgfe/flower-rn'

const onError = (error) => {
    switch (error.code) {
        case ErrorCode.NoPreviewAuth:
            console.log('没有相机权限')
            break
        case ErrorCode.GallaryError:
            console.log('相册错误')
            break
        case ErrorCode.GallaryCancel:
            console.log('取消选择')
            break
        default:
            console.log('其他错误:', error.msg)
    }
}

<ScannerView onSuccess={() => {}} onError={onError} />

// 迁移后
import { ScannerView, ErrorCode } from '@sfe/wand-rn'

const onError = (error) => {
    switch (error.code) {
        case ErrorCode.NoPreviewAuth:
            console.log('没有相机权限')
            break
        case ErrorCode.GallaryError:
            console.log('相册错误')
            break
        case ErrorCode.GallaryCancel:
            console.log('取消选择')
            break
        default:
            console.log('其他错误:', error.msg)
    }
}

<ScannerView onSuccess={() => {}} onError={onError} />
```

### 案例 8：自定义样式

```tsx
// 迁移前
import { ScannerView } from '@sgfe/flower-rn'
import { StyleSheet } from '@mrn/react-native'

const styles = StyleSheet.create({
    scanner: {
        height: 300,
    },
    topBar: {
        backgroundColor: '#f0f0f0',
    },
})

<ScannerView
    styles={styles.scanner}
    topBarStyles={styles.topBar}
    onSuccess={() => {}}
    onError={() => {}}
/>

// 迁移后
import { ScannerView } from '@sfe/wand-rn'
import { StyleSheet } from '@mrn/react-native'

const styles = StyleSheet.create({
    scanner: {
        height: 300,
    },
    topBar: {
        backgroundColor: '#f0f0f0',
    },
})

<ScannerView
    styles={styles.scanner}
    topBarStyles={styles.topBar}
    onSuccess={() => {}}
    onError={() => {}}
/>
```

### 案例 9：扫码类型选择

```tsx
// 迁移前
import { ScannerView, ScanType } from '@sgfe/flower-rn'

<ScannerView
    scanType={ScanType.QrCode}  // 仅扫二维码
    onSuccess={() => {}}
    onError={() => {}}
/>

// 迁移后
import { ScannerView, ScanType } from '@sfe/wand-rn'

<ScannerView
    scanType={ScanType.QrCode}  // 仅扫二维码
    onSuccess={() => {}}
    onError={() => {}}
/>
```

### 案例 10：使用新的 ScanMode 枚举（推荐）

```tsx
// 迁移前（仅支持字符串）
import { ScannerView } from '@sgfe/flower-rn'

<ScannerView
    mode="full"
    onSuccess={() => {}}
    onError={() => {}}
/>

// 迁移后（推荐使用枚举）
import { ScannerView, ScanMode } from '@sfe/wand-rn'

// 方案 1：仍使用字符串（向后兼容）
<ScannerView
    mode="full"
    onSuccess={() => {}}
    onError={() => {}}
/>

// 方案 2：使用新的 ScanMode 枚举（推荐）
<ScannerView
    mode={ScanMode.Full}
    onSuccess={() => {}}
    onError={() => {}}
/>
```

## 关键点

- ✅ **API 完全兼容**：所有 Props、回调和 Ref 方法保持一致
- ✅ **枚举值完全相同**：`ScanType` 和 `ErrorCode` 枚举值不变
- ✅ **字符串字面量兼容**：`mode` 属性仍支持字符串值
- ✅ **新增 ScanMode 枚举**：提供更好的类型安全，推荐使用
- ✅ **应用前后台切换自动处理**：无需手动管理动画
- ✅ **内部实现改进**：性能和稳定性提升
- 🔄 **迁移难度**：**极低** - 直接修改导入路径即可，无需修改任何业务逻辑

## 迁移步骤

1. **更新导入路径**：`@sgfe/flower-rn` → `@sfe/wand-rn`
2. **可选地使用新的 ScanMode 枚举**：
   - 将 `mode="full"` 改为 `mode={ScanMode.Full}` 以获得更好的类型支持
   - 或保持使用字符串字面量（完全兼容）
3. **测试验证**：确保扫码功能正常工作
4. **享受改进**：自动获得应用前后台切换优化

## 补充说明

### Ref 方法说明

- `startDecode()`: 开始解码（开启扫码识别）
- `stopDecode()`: 停止解码（关闭扫码识别）
- `startPreview()`: 开始预览（仅打开相机不识别）
- `stopPreview()`: 停止预览（关闭相机）

### 典型使用流程

1. 组件挂载时自动调用 `startDecode()`
2. 用户扫描成功或出错时触发回调
3. 点击返回按钮时触发 `onBackPress`
4. 组件卸载时自动停止解码

### 性能优化

新库在应用前后台切换时自动管理扫码动画，无需手动处理，可显著降低电池消耗和性能压力。
