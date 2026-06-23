# Button 按钮

## 从何处迁移
- **源库**: `@roo/roo-rn1`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export type ButtonPropsType = 
  | 'default' 
  | 'primary' 
  | 'primaryv2' 
  | 'textPrimary' 
  | 'danger' 
  | 'dangerv2' 
  | 'dangerv3' 
  | 'other' 
  | 'success' 
  | 'warning' 
  | 'text'

export type ButtonPropsSize = 'lg' | 'md' | 'sm'
export type ButtonPropsWidth = 'normal' | 'padded' | 'full'

export interface ButtonProps extends WithThemeStyles<ButtonStyles> {
  /** 按钮类型 */
  type?: ButtonPropsType  // 默认 'default'
  /** 按钮大小 */
  size?: ButtonPropsSize  // 默认 'md'
  /** 按钮宽度 */
  width?: ButtonPropsWidth  // 默认 'normal'
  /** 自定义包裹组件最外层的样式 */
  style?: StyleProp<ViewStyle>
  /** 自定义图标 */
  icon?: JSX.Element
  /** 是否禁用 */
  disabled?: boolean  // 默认 false
  /** 是否加载状态 */
  loading?: boolean  // 默认 false
  /** 自定义加载内容 */
  renderLoading?: () => JSX.Element
  /** 点击事件回调 */
  onPress?: (event: GestureResponderEvent) => void
  /** 按住按钮的回调函数 */
  onPressIn?: (event: GestureResponderEvent) => void
  /** 放开按钮的回调函数 */
  onPressOut?: (event: GestureResponderEvent) => void
  /** 是否反转色 */
  reverse?: boolean  // 默认 false
  /** 自定义点击时的颜色 */
  customPressColor?: string
  /** 自定义禁用时的背景颜色 */
  customDisabledBackgroundColor?: string
  /** 自定义禁用时的字体颜色 */
  customDisabledTextColor?: string
  /** 自定义背景颜色 */
  customBackgroundColor?: string
  /** children 内容 */
  children?: React.ReactNode
}
```

## 新组件 API

```tsx
export type ButtonPropsType = 
  | 'default' 
  | 'primary' 
  | 'textPrimary' 
  | 'danger' 
  | 'other' 
  | 'success' 
  | 'warning' 
  | 'text'

export type ButtonPropsSize = 'lg' | 'md' | 'sm' | 'xs' | '2xs'

export type EnableDebounce = boolean | {
  wait?: number
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

export interface ButtonProps extends WithThemeStyles<ButtonStyles> {
  /** 按钮类型 */
  type?: ButtonPropsType  // 默认 'default'
  /** 按钮大小 */
  size?: ButtonPropsSize  // 默认 'md'
  /** 按钮宽度（数字或字符串） */
  width?: string | number
  /** 自定义图标 */
  icon?: JSX.Element
  /** 是否禁用 */
  disabled?: boolean  // 默认 false
  /** 是否加载状态 */
  loading?: boolean  // 默认 false
  /** 点击事件回调 */
  onPress?: (event: GestureResponderEvent) => void
  /** 按住按钮的回调函数 */
  onPressIn?: (event: GestureResponderEvent) => void
  /** 放开按钮的回调函数 */
  onPressOut?: (event: GestureResponderEvent) => void
  /** 是否反转色 */
  reverse?: boolean  // 默认 false
  /** 点击防抖设置 */
  enableDebounce?: EnableDebounce  // 默认 false
  /** 禁用时的点击回调 */
  onPressWhenDisabled?: (event: GestureResponderEvent) => void
  /** 热区范围 */
  hitSlop?: Insets
  /** 自定义包裹组件最外层的样式 */
  style?: StyleProp<ViewStyle>
  /** children 内容 */
  children?: string | JSX.Element
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| type | type | 移除 'primaryv2' 和 'dangerv2'、'dangerv3' 类型 |
| size | size | 新增 'xs' 和 '2xs' 尺寸选项 |
| width | width | 从枚举改为 number \| string，不再支持 'normal'/'padded'/'full' |
| icon | icon | 保持一致 |
| disabled | disabled | 保持一致 |
| loading | loading | 保持一致，但 renderLoading 被移除 |
| renderLoading | - | 移除，新组件使用内置 Loading 组件 |
| onPress | onPress | 保持一致 |
| onPressIn | onPressIn | 保持一致 |
| onPressOut | onPressOut | 保持一致 |
| reverse | reverse | 保持一致 |
| customPressColor | - | 移除 |
| customDisabledBackgroundColor | - | 移除 |
| customDisabledTextColor | - | 移除 |
| customBackgroundColor | - | 移除 |
| style | style | 保持一致（向后兼容） |
| - | enableDebounce | 新增，支持防抖功能 |
| - | onPressWhenDisabled | 新增，禁用时回调 |
| - | hitSlop | 新增，热区范围设置 |

## 迁移示例

### 案例 1：基础按钮

```tsx
// 迁移前
import { Button } from '@roo/roo-rn1'

<Button type="primary" size="md" onPress={() => console.log('clicked')}>
  点击我
</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="primary" size="md" onPress={() => console.log('clicked')}>
  点击我
</Button>
```

### 案例 2：禁用状态

```tsx
// 迁移前
import { Button } from '@roo/roo-rn1'

<Button disabled={true} onPress={() => console.log('clicked')}>
  禁用按钮
</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button disabled onPress={() => console.log('clicked')}>
  禁用按钮
</Button>
```

### 案例 3：加载状态

```tsx
// 迁移前
import { Button } from '@roo/roo-rn1'

const [loading, setLoading] = useState(false)

<Button 
  loading={loading}
  renderLoading={() => <ActivityIndicator />}  // 自定义加载
  onPress={() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }}
>
  加载中
</Button>

// 迁移后 - 使用内置 Loading 组件
import { Button } from '@sfe/wand-rn'

const [loading, setLoading] = useState(false)

<Button 
  loading={loading}
  onPress={() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }}
>
  加载中
</Button>
```

### 案例 4：按钮尺寸

```tsx
// 迁移前
import { Button } from '@roo/roo-rn1'

<Button size="lg">大按钮</Button>
<Button size="md">中按钮</Button>
<Button size="sm">小按钮</Button>

// 迁移后 - 新增超小尺寸
import { Button } from '@sfe/wand-rn'

<Button size="lg">大按钮</Button>
<Button size="md">中按钮</Button>
<Button size="sm">小按钮</Button>
<Button size="xs">特小按钮</Button>
<Button size="2xs">超小按钮</Button>
```

### 案例 5：按钮宽度

```tsx
// 迁移前 - 使用枚举
import { Button } from '@roo/roo-rn1'

<Button width="full">全宽按钮</Button>
<Button width="normal">普通宽度</Button>
<Button width="padded">紧凑宽度</Button>

// 迁移后 - 使用数字或字符串
import { Button } from '@sfe/wand-rn'

<Button width="100%">全宽按钮</Button>
<Button width={160}>固定宽度</Button>
<Button>默认宽度</Button>

// 或使用包装容器
<View style={{ width: '100%' }}>
  <Button>全宽按钮</Button>
</View>
```

### 案例 6：带图标的按钮

```tsx
// 迁移前
import { Button } from '@roo/roo-rn1'
import { Icon } from '@roo/roo-rn1'

<Button icon={<Icon type="search" />}>
  搜索
</Button>

// 迁移后
import { Button, Icon } from '@sfe/wand-rn'

<Button icon={<Icon type="search" />}>
  搜索
</Button>
```

### 案例 7：按钮类型变更

```tsx
// 迁移前 - 支持 primaryv2、dangerv2、dangerv3
import { Button } from '@roo/roo-rn1'

<Button type="primaryv2">主色 v2</Button>
<Button type="dangerv2">危险色 v2</Button>
<Button type="dangerv3">危险色 v3</Button>

// 迁移后 - 这些类型被移除，需要使用等效类型
import { Button } from '@sfe/wand-rn'

// 移除的类型需要替换为基础类型
<Button type="primary">主色</Button>
<Button type="danger">危险色</Button>
<Button type="danger">危险色</Button>
```

### 案例 8：防抖功能

```tsx
// 迁移前 - 无防抖机制
import { Button } from '@roo/roo-rn1'

let lastClickTime = 0
<Button 
  onPress={() => {
    if (Date.now() - lastClickTime > 300) {
      lastClickTime = Date.now()
      console.log('clicked')
    }
  }}
>
  防止频繁点击
</Button>

// 迁移后 - 内置防抖支持
import { Button } from '@sfe/wand-rn'

// 方案 1：简单启用防抖（默认 300ms）
<Button 
  enableDebounce={true}
  onPress={() => console.log('clicked')}
>
  防止频繁点击
</Button>

// 方案 2：自定义防抖参数
<Button 
  enableDebounce={{
    wait: 500,
    leading: false,
    trailing: true
  }}
  onPress={() => console.log('clicked')}
>
  自定义防抖
</Button>
```

### 案例 9：禁用时回调

```tsx
// 迁移前 - 无禁用时回调
import { Button } from '@roo/roo-rn1'

<Button 
  disabled={true}
  onPress={() => console.log('不会触发')}
>
  禁用按钮
</Button>

// 迁移后 - 新增禁用时回调
import { Button } from '@sfe/wand-rn'

<Button 
  disabled={true}
  onPress={() => console.log('不会触发')}
  onPressWhenDisabled={() => console.log('禁用时的回调')}
>
  禁用按钮
</Button>
```

### 案例 10：热区设置

```tsx
// 迁移前 - 无热区设置
import { Button } from '@roo/roo-rn1'

<Button onPress={() => console.log('clicked')}>
  按钮
</Button>

// 迁移后 - 支持热区
import { Button } from '@sfe/wand-rn'

<Button 
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  onPress={() => console.log('clicked')}
>
  更大的触摸范围
</Button>
```

### 案例 11：自定义样式

```tsx
// 迁移前 - 支持自定义颜色
import { Button } from '@roo/roo-rn1'

<Button 
  type="primary"
  customBackgroundColor="#FF0000"
  customDisabledBackgroundColor="#CCCCCC"
  customDisabledTextColor="#666666"
  onPress={() => console.log('clicked')}
>
  自定义颜色
</Button>

// 迁移后 - 移除自定义颜色，使用 style 或主题
import { Button } from '@sfe/wand-rn'

// 方案 1：使用 style（仅支持容器样式）
<Button 
  type="primary"
  style={{ marginHorizontal: 20 }}
  onPress={() => console.log('clicked')}
>
  自定义样式
</Button>

// 方案 2：通过主题系统修改颜色（推荐）
// 在 Provider 中配置主题颜色
```

### 案例 12：按钮反转色

```tsx
// 迁移前
import { Button } from '@roo/roo-rn1'

<Button type="primary" reverse={true}>
  反转色按钮
</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="primary" reverse={true}>
  反转色按钮
</Button>
```

### 案例 13：点击生命周期

```tsx
// 迁移前
import { Button } from '@roo/roo-rn1'

<Button 
  onPressIn={() => console.log('按住')}
  onPressOut={() => console.log('放开')}
  onPress={() => console.log('点击')}
>
  点击我
</Button>

// 迁移后 - 保持一致
import { Button } from '@sfe/wand-rn'

<Button 
  onPressIn={() => console.log('按住')}
  onPressOut={() => console.log('放开')}
  onPress={() => console.log('点击')}
>
  点击我
</Button>
```

### 案例 14：完整复杂场景

```tsx
// 迁移前
import { Button } from '@roo/roo-rn1'

const [loading, setLoading] = useState(false)

const handleSubmit = async () => {
  setLoading(true)
  try {
    await submitForm()
  } finally {
    setLoading(false)
  }
}

<Button 
  type="primary"
  size="lg"
  width="full"
  loading={loading}
  disabled={loading}
  renderLoading={() => <ActivityIndicator size="small" color="white" />}
  style={{ marginTop: 20 }}
  onPress={handleSubmit}
>
  {loading ? '提交中...' : '提交'}
</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

const [loading, setLoading] = useState(false)

const handleSubmit = async () => {
  setLoading(true)
  try {
    await submitForm()
  } finally {
    setLoading(false)
  }
}

<View style={{ width: '100%', marginTop: 20 }}>
  <Button 
    type="primary"
    size="lg"
    loading={loading}
    disabled={loading}
    onPress={handleSubmit}
  >
    {loading ? '提交中...' : '提交'}
  </Button>
</View>
```

### 案例 15：文本按钮

```tsx
// 迁移前
import { Button } from '@roo/roo-rn1'

<Button type="text" onPress={() => console.log('clicked')}>
  文本按钮
</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="text" onPress={() => console.log('clicked')}>
  文本按钮
</Button>
```

## 关键点

### 1. 按钮类型简化
- 旧版本支持：default、primary、primaryv2、textPrimary、danger、dangerv2、dangerv3、other、success、warning、text（11 种）
- 新版本支持：default、primary、textPrimary、danger、other、success、warning、text（8 种）
- **移除**：primaryv2、dangerv2、dangerv3

### 2. 尺寸扩展
- 旧版本：lg、md、sm（3 种）
- 新版本：lg、md、sm、xs、2xs（5 种）
- 新增超小和特小尺寸选项

### 3. 宽度属性变更
- 旧版本：枚举值 'normal'、'padded'、'full'
- 新版本：string | number（更灵活，可传递百分比或具体数值）
- 迁移建议：使用 View 包装或直接指定具体尺寸

### 4. 加载状态处理
- 旧版本：`renderLoading` 自定义加载内容
- 新版本：移除 `renderLoading`，使用内置 `Loading` 组件
- 加载状态时自动显示加载指示器

### 5. 自定义颜色移除
- 旧版本支持 4 个自定义颜色属性：customBackgroundColor、customPressColor、customDisabledBackgroundColor、customDisabledTextColor
- 新版本移除这些属性，颜色由主题系统控制
- **迁移建议**：通过主题 Provider 统一修改按钮颜色，或在应用级别统一设置

### 6. 新增功能
- **enableDebounce**：内置防抖机制，防止频繁点击
- **onPressWhenDisabled**：禁用状态下的点击回调
- **hitSlop**：设置按钮的触摸热区

### 7. 样式定制
- 新版本 `style` 属性仅支持容器样式（外边距、边距等）
- 内部样式（如按钮背景、文字颜色）由主题系统或按钮的 `type` 属性控制

## 注意事项

1. **type 属性值迁移**：如使用 'primaryv2'、'dangerv2'、'dangerv3'，需改为基础类型
2. **width 属性迁移**：枚举值已不可用，需改为百分比字符串或数字
3. **自定义加载内容**：不再支持 `renderLoading`，loading 时使用默认加载动画
4. **颜色定制**：不再支持单个按钮的颜色定制，需通过主题系统或使用预定义类型
5. **防抖配置**：新增 `enableDebounce`，建议在异步操作中使用
6. **向后兼容**：`style` 和 `reverse` 等属性保持兼容

## 迁移检查清单

- [ ] 检查所有 `type` 属性值，替换 'primaryv2'、'dangerv2'、'dangerv3'
- [ ] 更新 `width` 属性为 number 或 percentage string
- [ ] 移除 `renderLoading` 属性，依赖默认加载动画
- [ ] 移除 `customBackgroundColor` 等自定义颜色属性
- [ ] 确认是否需要使用 `enableDebounce` 防止频繁点击
- [ ] 检查禁用按钮是否需要 `onPressWhenDisabled` 回调
- [ ] 验证按钮样式是否需要调整（新增 xs、2xs 尺寸）
- [ ] 对于 'primaryv2' 等移除类型，确认等效替代方案
- [ ] 测试所有按钮交互场景（加载、禁用、点击）
- [ ] 验证按钮在不同屏幕尺寸上的显示效果
