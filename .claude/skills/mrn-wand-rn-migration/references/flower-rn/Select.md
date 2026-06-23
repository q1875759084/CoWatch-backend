# Select 选择框

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface SelectProps extends WithThemeStyles<SelectStyles> {
    /** 对应数据源对象的 value 值 */
    value: Array<number | string>
    /** 数据源对象 */
    options: Array<SelectOption>
    /** 右侧图标 */
    rightIcon?: AllIcons | JSX.Element
    /** 左侧图标 */
    leftIcon?: AllIcons | JSX.Element
    /** 是否可滚动，默认换行 */
    scrollable?: boolean
    /** select 内置的样式风格  */
    type?: 'plane' | 'light'  // 默认 'plane'
    /** 一行展示的选项数量  */
    column?: number
    /** 点击时回调函数  */
    onPress?: (item: SelectOption, e?: GestureResponderEvent) => void
}

export interface SelectOption {
    /** 选项值，配置项中的唯一标识 */
    value: number | string
    /** 文案 */
    label: string
    /** 是否是禁用 */
    disabled?: boolean
}

export class Select extends Component<SelectProps> {
    // 支持主题样式定制
    static defaultProps: {
        value: []
        options: []
        rightIcon: null
        leftIcon: null
        scrollable: false
        type: 'plane'
        onPress: null
        styles: {}
    }
}
```

## 新组件 API

```tsx
export interface SelectProps extends WithThemeStyles<SelectStyles> {
    /** 对应数据源对象的 value 值 */
    value?: Array<number> | Array<string>  // 现在可选，默认 []
    /** 数据源对象 */
    options?: Array<SelectOption>  // 现在可选，默认 []
    /** 右侧图标 */
    rightIcon?: JSX.Element  // 不再支持 AllIcons 字符串类型
    /** 左侧图标 */
    leftIcon?: JSX.Element  // 不再支持 AllIcons 字符串类型
    /** 是否可滚动，默认换行 */
    scrollable?: boolean  // 默认 false
    /** select 内置的样式风格  */
    type?: 'plane' | 'light'  // 默认 'plane'
    /** 一行展示的选项数量  */
    column?: number
    /** 点击时回调函数  */
    onPress?: (item: SelectOption, e?: GestureResponderEvent) => void
    styles?: object
}

export interface SelectOption {
    /** 选项值，配置项中的唯一标识 */
    value: number | string
    /** 文案 */
    label: string
    /** 是否是禁用 */
    disabled?: boolean
}

export class Selector extends Component<SelectProps> {
    // 组件类名从 Select 改为 Selector
    // 支持主题样式定制
    static defaultProps: {
        value: []
        options: []
        rightIcon: null
        leftIcon: null
        scrollable: false
        type: 'plane'
        onPress: null
        styles: {}
    }
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| value (必需) | value (可选) | 现在可选，默认值为 [] |
| options (必需) | options (可选) | 现在可选，默认值为 [] |
| rightIcon: AllIcons \| JSX.Element | rightIcon: JSX.Element | 不再支持字符串类型图标，只支持 JSX.Element |
| leftIcon: AllIcons \| JSX.Element | leftIcon: JSX.Element | 不再支持字符串类型图标，只支持 JSX.Element |
| Select (类名) | Selector (类名) | 组件类名改为 Selector |
| 无 | styles prop | 增加了 styles 属性用于自定义样式 |

## 关键变更

### 1. 组件类名改变
**旧版本**：导出类名为 `Select`。

**新版本**：导出类名改为 `Selector`。

```tsx
// 迁移前
import { Select } from '@sgfe/flower-rn'
<Select ... />

// 迁移后
import { Selector } from '@sfe/wand-rn'
<Selector ... />
```

### 2. 属性从必需改为可选
**旧版本**：`value` 和 `options` 是必需属性。

**新版本**：两者都改为可选，默认值为 `[]`。

### 3. 图标属性不再支持字符串类型
**旧版本**：`rightIcon` 和 `leftIcon` 支持 `AllIcons`（字符串类型，代表图标名称）或 `JSX.Element`。

**新版本**：只支持 `JSX.Element`，不再支持字符串类型的图标名称。

```tsx
// 迁移前
<Select
  leftIcon="arrow_left"  // 使用字符串图标名
  rightIcon={<Icon type="check" size={14} />}
/>

// 迁移后
import { Icon } from '@sfe/wand-rn'
<Selector
  leftIcon={<Icon type="arrow_left" size={14} />}
  rightIcon={<Icon type="check" size={14} />}
/>
```

### 4. 内部主题支持增强
**新版本**：增加了 `theme` 参数支持，内部对主题的处理更完善。

在 `plane` 类型模式下，支持通过主题配置来处理线性渐变的显示方式。

## 迁移示例

### 案例 1：基础使用

```tsx
// 迁移前
import { Select } from '@sgfe/flower-rn'

const options = [
  { value: 1, label: '选项1' },
  { value: 2, label: '选项2' },
  { value: 3, label: '选项3' }
]

<Select
  value={[1]}
  options={options}
  onPress={(item) => console.log(item.value)}
/>

// 迁移后
import { Selector } from '@sfe/wand-rn'

const options = [
  { value: 1, label: '选项1' },
  { value: 2, label: '选项2' },
  { value: 3, label: '选项3' }
]

<Selector
  value={[1]}
  options={options}
  onPress={(item) => console.log(item.value)}
/>
```

### 案例 2：使用图标（字符串改为 JSX.Element）

```tsx
// 迁移前
import { Select } from '@sgfe/flower-rn'

<Select
  value={[]}
  options={options}
  leftIcon="check"  // 字符串类型
  rightIcon="arrow_right"  // 字符串类型
/>

// 迁移后
import { Selector } from '@sfe/wand-rn'
import { Icon } from '@sfe/wand-rn'  // 或其他图标库

<Selector
  value={[]}
  options={options}
  leftIcon={<Icon type="check" size={14} />}  // JSX.Element
  rightIcon={<Icon type="arrow_right" size={14} />}  // JSX.Element
/>
```

### 案例 3：使用 light 类型样式

```tsx
// 迁移前
<Select
  value={[1]}
  options={options}
  type="light"
/>

// 迁移后
<Selector
  value={[1]}
  options={options}
  type="light"
/>
```

### 案例 4：使用可滚动模式

```tsx
// 迁移前
<Select
  value={[]}
  options={manyOptions}
  scrollable={true}
/>

// 迁移后
<Selector
  value={[]}
  options={manyOptions}
  scrollable={true}
/>
```

### 案例 5：使用分列布局

```tsx
// 迁移前
<Select
  value={[]}
  options={options}
  column={3}  // 一行3列
/>

// 迁移后
<Selector
  value={[]}
  options={options}
  column={3}  // 一行3列
/>
```

### 案例 6：禁用选项

```tsx
// 迁移前
const options = [
  { value: 1, label: '可用', disabled: false },
  { value: 2, label: '禁用', disabled: true },
  { value: 3, label: '可用', disabled: false }
]

<Select
  value={[1]}
  options={options}
/>

// 迁移后
const options = [
  { value: 1, label: '可用', disabled: false },
  { value: 2, label: '禁用', disabled: true },
  { value: 3, label: '可用', disabled: false }
]

<Selector
  value={[1]}
  options={options}
/>
```

### 案例 7：自定义样式

```tsx
// 迁移后支持通过 styles prop 进行样式定制
<Selector
  value={[]}
  options={options}
  styles={{
    containerWrap: { padding: 10 },
    item: { margin: 5 }
  }}
/>
```

## 关键点

- **类名改变**：从 `Select` 改为 `Selector`，这是迁移中必须更改的地方
- **属性改为可选**：`value` 和 `options` 从必需改为可选，默认值为 `[]`
- **图标必须是 JSX.Element**：不再支持字符串类型的图标名称，必须传递 JSX.Element
- **其他属性保持兼容**：`type`、`scrollable`、`column`、`onPress` 等属性保持兼容
- **SelectOption 接口不变**：`SelectOption` 接口保持不变
- **主题定制**：新版本对主题的支持更完善，可通过 `styles` prop 进行自定义
- **渐变色处理**：`plane` 类型在有主题 `noLinearGradient` 标记时，会使用主题色而不是固定的黄色渐变
