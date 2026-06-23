# Button 按钮

## 从何处迁移
- **源库**: `@ss/mtd-react-native`
- **目标库**: `@sfe/wand-rn`
- **目标组件**: `Button`

## 旧组件 API

```tsx
type ButtonPropsType = 'default' | 'primary' | 'textPrimary' | 'danger' | 'other' | 'success' | 'warning' | 'text'
type ButtonPropsSize = 'lg' | 'md' | 'sm'
type ButtonPropsWidth = 'normal' | 'padded' | 'full'

interface ButtonProps {
    type?: ButtonPropsType       // 默认 'default'
    size?: ButtonPropsSize       // 默认 'md'
    width?: ButtonPropsWidth     // 默认 'normal'，枚举值：normal(minWidth:160) | padded(无最小宽度) | full(100%)
    style?: StyleProp<ViewStyle>
    icon?: JSX.Element
    disabled?: boolean           // 默认 false
    reverse?: boolean            // 是否反转色，默认 false
    onPress?: (event: GestureResponderEvent) => void
    onPressIn?: (event: GestureResponderEvent) => void
    onPressOut?: (event: GestureResponderEvent) => void
    children?: string | JSX.Element
}
```

## 新组件 API

```tsx
type ButtonPropsType = 'default' | 'primary' | 'textPrimary' | 'danger' | 'other' | 'success' | 'warning' | 'text'
type ButtonPropsSize = 'lg' | 'md' | 'sm' | 'xs' | '2xs'

type EnableDebounceExtendType = {
    wait?: number       // 默认 300ms
    leading?: boolean   // 默认 false
    trailing?: boolean  // 默认 true
    maxWait?: number
}
type EnableDebounce = boolean | EnableDebounceExtendType

interface ButtonProps {
    type?: ButtonPropsType       // 默认 'default'
    size?: ButtonPropsSize       // 默认 'md'
    width?: number | string      // 按钮宽度，直接传数值或百分比字符串，如 200 或 '100%'
    style?: StyleProp<ViewStyle>
    icon?: JSX.Element
    disabled?: boolean           // 默认 false
    loading?: boolean            // 按钮 loading 状态，默认 false
    reverse?: boolean            // 是否反转色，默认 false
    enableDebounce?: EnableDebounce  // 默认 false
    hitSlop?: Insets             // 按钮热区扩展
    onPress?: (event: GestureResponderEvent) => void
    onPressIn?: (event: GestureResponderEvent) => void
    onPressOut?: (event: GestureResponderEvent) => void
    onPressWhenDisabled?: (event: GestureResponderEvent) => void  // 禁用时的点击回调
    children?: string | JSX.Element
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| type | type | 完全兼容，值不变 |
| size | size | 旧值 `'lg'/'md'/'sm'` 均兼容；新增 `'xs'` 和 `'2xs'` 可选 |
| width | width | **类型变更**：旧值为枚举字符串，新值为数值或任意字符串（见下方说明） |
| style | style | 完全兼容 |
| icon | icon | 完全兼容 |
| disabled | disabled | 完全兼容 |
| reverse | reverse | 完全兼容 |
| onPress | onPress | 完全兼容 |
| onPressIn | onPressIn | 完全兼容 |
| onPressOut | onPressOut | 完全兼容 |
| children | children | 完全兼容 |
| ❌ 无 | loading | 新增：按钮 loading 态 |
| ❌ 无 | enableDebounce | 新增：点击防抖 |
| ❌ 无 | onPressWhenDisabled | 新增：禁用状态下的点击回调 |
| ❌ 无 | hitSlop | 新增：热区扩展 |

### width 枚举值映射

| 旧值 | 新值 | 说明 |
|------|------|------|
| `'normal'` | 不传（删除该属性）| 旧 normal 对应 minWidth:160，新组件默认行为类似 |
| `'padded'` | 不传（删除该属性）| 旧 padded 为按内容撑开，新组件默认即按内容撑开 |
| `'full'` | `'100%'` | 全宽按钮 |

## 迁移示例

### 案例 1：基础按钮（完全兼容，仅改导入）

```tsx
// 迁移前
import { Button } from '@ss/mtd-react-native'
<Button type="primary" size="md" onPress={handlePress}>确认</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'
<Button type="primary" size="md" onPress={handlePress}>确认</Button>
```

### 案例 2：width='full' 全宽按钮

```tsx
// 迁移前
<Button type="primary" width="full">提交</Button>

// 迁移后
<Button type="primary" width="100%">提交</Button>
```

### 案例 3：width='normal' / 'padded'（按内容撑开）

```tsx
// 迁移前
<Button type="default" width="normal">取消</Button>
<Button type="default" width="padded">取消</Button>

// 迁移后（删除 width 属性即可，新组件默认按内容撑开）
<Button type="default">取消</Button>
```

### 案例 4：disabled 按钮

```tsx
// 迁移前
<Button type="primary" disabled={true}>不可点击</Button>

// 迁移后（完全兼容）
<Button type="primary" disabled={true}>不可点击</Button>
```

### 案例 5：图标按钮

```tsx
// 迁移前
import { Icon } from '@ss/mtd-react-native'
<Button icon={<Icon type="add" />} />

// 迁移后
import { Button, Icon } from '@sfe/wand-rn'
<Button icon={<Icon type="add" />} />
```

### 案例 6：新增 loading 状态（新特性）

```tsx
// 迁移前（无 loading 支持）
<Button type="primary" disabled={isSubmitting}>提交中...</Button>

// 迁移后（使用 loading 属性）
<Button type="primary" loading={isSubmitting}>提交</Button>
```

## 关键点

1. **导入路径变更**：从 `@sfe/wand-rn` 导入，组件名不变仍为 `Button`
2. **width 属性类型变更**：旧版为枚举字符串（`'normal'/'padded'/'full'`），新版为数值或任意宽度字符串。`full` 对应 `'100%'`，`normal/padded` 直接删除即可（新组件默认行为一致）
3. **size 向上兼容**：旧有值 `'lg'/'md'/'sm'` 完全兼容，新增 `'xs'` 和 `'2xs'`
4. **新增能力**：`loading`（按钮加载态）、`enableDebounce`（防抖）、`onPressWhenDisabled`（禁用时点击回调）、`hitSlop`（热区扩展）可按需使用
5. **wand-rn 的 Button 内部实现与 @ss/mtd-react-native Button 结构相似**（均源自同一设计体系），大多数视觉表现一致，仅在 primary 类型上 wand-rn 使用了渐变色（LinearGradient）而旧版使用纯色
