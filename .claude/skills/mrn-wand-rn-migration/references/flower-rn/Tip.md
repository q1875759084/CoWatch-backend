# Tip 顶部提示

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface TipProps {
    /** 是否显示 */
    visible?: boolean  // 默认 true
    /** 首部图标 */
    frontIcon?: AllIcons | JSX.Element  // 支持字符串类型的图标名称
    /** 尾部图标 */
    endIcon?: AllIcons | JSX.Element  // 支持字符串类型的图标名称
    /** 尾部图标点击回调 */
    onEndIconPress?: () => void
    /** 提示文字 */
    children?: string | JSX.Element
    /** 背景颜色类型 */
    bgColorType?: 'info' | 'warn'  // 默认 'info'
    /** 文字颜色类型 */
    textColorType?: 'info' | 'warn' | 'danger'  // 默认 'info'
    /** 点击回调 */
    onPress?: () => void
    /** 操作按钮配置 */
    buttonProps?: {
        text: string
        onPress?: () => void
    }
}

export const Tip: React.FC<TipProps>
```

## 新组件 API

```tsx
interface TipProps {
    /** 是否显示 */
    visible?: boolean  // 默认 true
    /** 首部图标 */
    frontIcon?: JSX.Element  // 仅支持 JSX.Element，不支持字符串
    /** 尾部图标 */
    endIcon?: JSX.Element  // 仅支持 JSX.Element，不支持字符串
    /** 尾部图标点击回调 */
    onEndIconPress?: () => void
    /** 提示文字 */
    children?: string | JSX.Element
    /** 背景颜色类型 */
    bgColorType?: 'info' | 'warn'  // 默认 'info'
    /** 文字颜色类型 */
    textColorType?: 'info' | 'warn' | 'danger'  // 默认 'info'
    /** 点击回调 */
    onPress?: () => void
    /** 操作按钮配置 */
    buttonProps?: {
        text: string
        type?: 'primary' | 'text'  // 新增，按钮类型
        onPress?: () => void
    }
}

export const Tip: React.FC<TipProps>
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| frontIcon: AllIcons \| JSX.Element | frontIcon: JSX.Element | 不再支持字符串类型，只支持 JSX.Element |
| endIcon: AllIcons \| JSX.Element | endIcon: JSX.Element | 不再支持字符串类型，只支持 JSX.Element |
| buttonProps.type | buttonProps.type | 新增，支持 'primary' 和 'text' 两种类型 |
| 无 | 无 | 其他属性和功能保持兼容 |

## 关键变更

### 1. 图标属性不再支持字符串类型
**旧版本**：`frontIcon` 和 `endIcon` 支持 `AllIcons`（字符串类型）或 `JSX.Element`。

**新版本**：只支持 `JSX.Element`，必须明确传递图标组件。

```tsx
// 迁移前
import { Tip } from '@sgfe/flower-rn'

<Tip 
  frontIcon="info"  // 字符串类型的图标名
  endIcon="close"   // 字符串类型的图标名
>
  提示文字
</Tip>

// 迁移后，需要使用 Icon 组件
import { Tip, Icon } from '@sfe/wand-rn'

<Tip 
  frontIcon={<Icon type="info" size={16} />}  // JSX.Element
  endIcon={<Icon type="close" size={16} />}   // JSX.Element
>
  提示文字
</Tip>
```

### 2. 操作按钮新增 type 属性
**新版本**新增 `buttonProps.type` 属性，用于指定按钮类型。

```tsx
// 旧版本，按钮类型固定
<Tip 
  buttonProps={{
    text: '操作',
    onPress: handleAction
  }}
>
  提示文字
</Tip>

// 新版本，可以指定按钮类型
<Tip 
  buttonProps={{
    text: '操作',
    type: 'primary',  // 'primary' 或 'text'，默认 'primary'
    onPress: handleAction
  }}
>
  提示文字
</Tip>
```

### 3. 内部实现优化
新版本对内部实现进行了优化：
- 更好的图标处理方式
- 更灵活的按钮类型控制
- 改进的触发区域（使用 hitSlop）

## 迁移示例

### 案例 1：基础提示（需要改动图标）

```tsx
// 迁移前
import { Tip } from '@sgfe/flower-rn'

<Tip 
  frontIcon="info"
  bgColorType="info"
>
  这是一条提示信息
</Tip>

// 迁移后
import { Tip, Icon } from '@sfe/wand-rn'

<Tip 
  frontIcon={<Icon type="info" size={16} />}
  bgColorType="info"
>
  这是一条提示信息
</Tip>
```

### 案例 2：警告提示

```tsx
// 迁移前
import { Tip } from '@sgfe/flower-rn'

<Tip 
  frontIcon="warning"
  bgColorType="warn"
  textColorType="warn"
>
  这是一条警告信息
</Tip>

// 迁移后
import { Tip, Icon } from '@sfe/wand-rn'

<Tip 
  frontIcon={<Icon type="warning" size={16} color="#FF6A00" />}
  bgColorType="warn"
  textColorType="warn"
>
  这是一条警告信息
</Tip>
```

### 案例 3：带关闭按钮的提示

```tsx
// 迁移前
import { Tip } from '@sgfe/flower-rn'

const [visible, setVisible] = useState(true)

<Tip 
  visible={visible}
  frontIcon="info"
  endIcon="close"
  onEndIconPress={() => setVisible(false)}
>
  可关闭的提示信息
</Tip>

// 迁移后
import { Tip, Icon } from '@sfe/wand-rn'

const [visible, setVisible] = useState(true)

<Tip 
  visible={visible}
  frontIcon={<Icon type="info" size={16} />}
  endIcon={<Icon type="close" size={16} />}
  onEndIconPress={() => setVisible(false)}
>
  可关闭的提示信息
</Tip>
```

### 案例 4：带操作按钮的提示

```tsx
// 迁移前
import { Tip } from '@sgfe/flower-rn'

<Tip 
  frontIcon="info"
  bgColorType="info"
  buttonProps={{
    text: '前往',
    onPress: handleNavigation
  }}
>
  点击按钮前往详情页
</Tip>

// 迁移后
import { Tip, Icon } from '@sfe/wand-rn'

<Tip 
  frontIcon={<Icon type="info" size={16} />}
  bgColorType="info"
  buttonProps={{
    text: '前往',
    type: 'primary',
    onPress: handleNavigation
  }}
>
  点击按钮前往详情页
</Tip>
```

### 案例 5：文本型操作按钮

```tsx
// 新版本支持按钮类型选择
import { Tip, Icon } from '@sfe/wand-rn'

<Tip 
  frontIcon={<Icon type="info" size={16} />}
  bgColorType="info"
  buttonProps={{
    text: '了解更多',
    type: 'text',  // 文本按钮
    onPress: handleMore
  }}
>
  这是一条带文本按钮的提示
</Tip>
```

### 案例 6：自定义图标

```tsx
// 迁移后支持完全自定义图标
import { Tip } from '@sfe/wand-rn'
import { View, Text } from '@mrn/react-native'

<Tip 
  frontIcon={
    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#007AFF' }} />
  }
  bgColorType="info"
>
  使用自定义图标的提示
</Tip>
```

### 案例 7：危险提示

```tsx
// 迁移前
import { Tip } from '@sgfe/flower-rn'

<Tip 
  frontIcon="error"
  textColorType="danger"
>
  这是一条危险提示
</Tip>

// 迁移后
import { Tip, Icon } from '@sfe/wand-rn'

<Tip 
  frontIcon={<Icon type="error" size={16} color="#FF192D" />}
  textColorType="danger"
>
  这是一条危险提示
</Tip>
```

### 案例 8：完整示例

```tsx
// 迁移前
import { Tip } from '@sgfe/flower-rn'

const [visible, setVisible] = useState(true)

<Tip 
  visible={visible}
  frontIcon="warning"
  endIcon="close"
  bgColorType="warn"
  textColorType="warn"
  onEndIconPress={() => setVisible(false)}
  buttonProps={{
    text: '操作',
    onPress: handleAction
  }}
>
  这是一条完整的警告提示
</Tip>

// 迁移后
import { Tip, Icon } from '@sfe/wand-rn'

const [visible, setVisible] = useState(true)

<Tip 
  visible={visible}
  frontIcon={<Icon type="warning" size={16} color="#FF6A00" />}
  endIcon={<Icon type="close" size={16} />}
  bgColorType="warn"
  textColorType="warn"
  onEndIconPress={() => setVisible(false)}
  buttonProps={{
    text: '操作',
    type: 'primary',
    onPress: handleAction
  }}
>
  这是一条完整的警告提示
</Tip>
```

## 关键点

- **图标必须是 JSX.Element**：不再支持字符串类型的图标名称，必须明确传递 Icon 组件
- **buttonProps.type 新增**：支持 'primary' 和 'text' 两种按钮类型，默认为 'primary'
- **其他属性保持兼容**：visible、children、bgColorType、textColorType、onPress、onEndIconPress 等属性完全兼容
- **图标大小建议**：建议使用 size={16} 作为图标大小
- **图标颜色匹配**：新版本建议根据 textColorType 设置相应的图标颜色
- **按钮大小保持一致**：新版本的按钮大小从 'xxs' 改为 '2xs'，但外观保持一致
- **触发区域优化**：新版本的关闭按钮触发区域更大，使用 hitSlop 提供更好的可点击性
- **完全兼容其他功能**：显示/隐藏、点击回调、所有颜色类型都保持兼容
