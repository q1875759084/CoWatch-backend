# Checkbox 复选框

## 从何处迁移
- **源库**: `@ss/mtd-react-native`
- **目标库**: `@sfe/wand-rn`
- **目标组件**: `Checkbox`

## 架构差异（重要）

两个库的 Checkbox 组件**架构完全不同**，不能简单替换导入路径，需要重构用法。

| 维度 | @ss/mtd-react-native | @sfe/wand-rn |
|------|---------------------|--------------|
| 组件范式 | Class Component | Function Component |
| 子组件 | `Checkbox.Item` (CheckboxItem) | 无 Item，单个 `Checkbox` 即可 |
| 分组 | `Checkbox` 本身就是分组容器 | `Checkbox.Group` 独立分组组件 |
| 选中值 | `checkedValues: any[]` 传入容器 | `value / defaultValue: (string\|number)[]` 传入 Group |
| 单项标识 | `label` 或 `trueValue` | `value: string \| number` |
| 全选 | 内置 `showAllChecked` + `CheckboxAllChecked` | 无内置全选，需自行实现 |
| min/max 限制 | 内置 `min` / `max` 属性 | 无内置，需自行实现 |
| 图标位置 | `iconPosition: 'left' \| 'right'` | `labelPosition: 'left' \| 'right'`（语义相反，见下方说明） |
| Form 集成 | 通过 `FormItemConsumer` 内置集成 | 通过 `CheckboxGroupContext` 实现 |
| 主题 | `WithTheme` + `styles` prop | `WithTheme`（内部使用） |

## 旧组件 API

### Checkbox（容器/分组组件）

```tsx
interface CheckboxProps {
    label?: string | JSX.Element           // 多选列表标题
    checkedValues?: any[]                  // 选中值数组
    iconPosition?: 'left' | 'right'        // Icon 位置，默认 'left'
    min?: number                           // 最少可选数量
    max?: number                           // 最多可选数量
    onChange?: (values: any[]) => void      // 值变化回调
    showAllChecked?: boolean               // 是否展示全选按钮
    style?: StyleProp<ViewStyle>           // 容器样式
    renderItem?: (checked: boolean, disabled: boolean, index: number) => JSX.Element
    renderItemIcon?: (checked: boolean, disabled: boolean, index: number) => React.ReactNode
    renderCheckboxAllChecked?: (props: CheckboxItemProps) => JSX.Element
    styles?: Partial<CheckboxStyles>       // 主题样式覆盖
}
```

### Checkbox.Item（单选项）

```tsx
interface CheckboxItemProps {
    label: string | ((checked: boolean, disabled: boolean) => React.ReactNode)
    trueValue: any                         // 选中时的值，默认为 label
    disabled?: boolean
    checked?: boolean                      // 内部由容器控制
    hasLine?: boolean                      // 底部分割线
    iconPosition?: 'left' | 'right'        // 内部由容器传入
    style?: StyleProp<ViewStyle>
    iconSize?: number                      // Icon 大小，默认 16
    textNumberOfLines?: number             // 文案行数限制，默认 1
    renderContent?: (checked: boolean, disabled: boolean, index?: number) => ReactElement
    renderIcon?: (checked: boolean, disabled: boolean) => JSX.Element
}
```

## 新组件 API

### Checkbox（单个复选框）

```tsx
interface CheckboxProps {
    checked?: boolean                      // 受控选中状态
    defaultChecked?: boolean               // 初始选中状态（非受控）
    block?: boolean                        // 块级模式（带边框背景的卡片样式）
    disabled?: boolean
    indeterminate?: boolean                // 半选状态（仅样式控制）
    value?: number | string                // 与 Group 结合时标识当前选项
    labelPosition?: 'left' | 'right'       // 标签位置，默认 'left'（block 模式）/ 'right'（inline 模式）
    onChange?: (checked?: boolean) => void  // 变化回调
    children?: React.ReactNode | ((checked: boolean, value: any) => React.ReactNode)
}
```

### Checkbox.Group（分组）

```tsx
interface CheckboxGroupProps {
    defaultValue?: (string | number)[]     // 初始选中值
    disabled?: boolean                     // 全组禁用
    options?: CheckboxOptions              // 选项配置（简写模式）
    value?: (string | number)[]            // 受控选中值
    onChange?: (checkedValue?: (string | number)[]) => void
}

type CheckboxOptionItem = {
    label: string
    value: string | number
    disabled?: boolean
}
type CheckboxOptions = (string | number | CheckboxOptionItem)[]
```

## 迁移对照表

### 容器层（Checkbox → Checkbox.Group）

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| `checkedValues` | `value` 或 `defaultValue` | **类型变更**：旧版 `any[]`，新版 `(string\|number)[]`。如果旧代码 `checkedValues` 只初始化不受控更新，用 `defaultValue`；如果外部动态更新，用 `value` |
| `onChange` | `onChange` | **签名兼容**，均为 `(values) => void`，但新版值类型为 `(string\|number)[]` |
| `iconPosition` | — | 删除。改为在每个 `Checkbox` 上设置 `labelPosition`（注意：旧版 `iconPosition='right'` 表示图标在右边、文字在左边，等价于新版 `labelPosition='left'`） |
| `label` | — | 删除。新组件无内置标题，需自行在 Group 外部添加标题 |
| `showAllChecked` | — | **删除**，新组件无内置全选。需自行实现（见迁移示例） |
| `min` / `max` | — | **删除**，新组件无内置数量限制。需在 `onChange` 中自行实现逻辑 |
| `renderItem` | — | 删除。改为在 `Checkbox` 的 `children` 中使用 render function |
| `renderItemIcon` | — | 删除。新组件不支持自定义 icon |
| `renderCheckboxAllChecked` | — | 删除。全选需自行实现 |
| `style` | `style`（在 Group 外层 View） | Group 本身无 style prop，需要外层 View 包裹 |
| `styles` | — | 删除。新组件不支持主题样式覆盖 prop |

### 单项层（Checkbox.Item → Checkbox）

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| `label` | `children` | 文案内容。旧版 `label` 为 string 或 render function `(checked, disabled) => ReactNode`，新版 `children` 支持 string 或 `(checked, value) => ReactNode`（注意第二个参数从 `disabled` 变为 `value`） |
| `trueValue` | `value` | 选项标识值。**必须迁移**：旧版可省略（默认用 label），新版与 Group 配合时必须提供 |
| `disabled` | `disabled` | 兼容 |
| `checked` | — | 删除。新版由 Group 的 `value`/`defaultValue` 控制，或单独使用时用 `checked`/`defaultChecked` |
| `hasLine` | — | **删除**，新组件无内置分割线样式 |
| `iconSize` | — | **删除**，新组件 icon 固定 16px |
| `textNumberOfLines` | — | **删除**，新组件不限制文字行数（inline 模式下有 `numberOfLines={1}`） |
| `renderContent` | `children` (render function) | 用 children render function 代替 |
| `renderIcon` | — | **删除**，新组件不支持自定义 icon |
| `style` | — | 新 Checkbox 无 style prop，需用外层 View 包裹 |

### iconPosition vs labelPosition 映射

旧版 `iconPosition` 描述的是**图标**的位置，新版 `labelPosition` 描述的是**标签**的位置，两者语义相反：

| 旧 iconPosition | 新 labelPosition | 实际布局 |
|-----------------|------------------|---------|
| `'left'` | `'right'`（inline 默认值，可省略） | 左图标 右文字 |
| `'right'` | `'left'` | 左文字 右图标 |

## 迁移示例

### 案例 1：基础多选列表

```tsx
// 迁移前
import { Checkbox } from '@ss/mtd-react-native'

<Checkbox
    checkedValues={['apple', 'banana']}
    iconPosition="left"
    onChange={(values) => setSelected(values)}>
    <Checkbox.Item label="苹果" trueValue="apple" />
    <Checkbox.Item label="香蕉" trueValue="banana" />
    <Checkbox.Item label="橙子" trueValue="orange" />
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'

<Checkbox.Group
    defaultValue={['apple', 'banana']}
    onChange={(values) => setSelected(values)}>
    <Checkbox value="apple" block>苹果</Checkbox>
    <Checkbox value="banana" block>香蕉</Checkbox>
    <Checkbox value="orange" block>橙子</Checkbox>
</Checkbox.Group>
```

### 案例 2：使用 options 简写（新版独有）

```tsx
// 迁移前
import { Checkbox } from '@ss/mtd-react-native'

<Checkbox checkedValues={selected} onChange={setSelected}>
    <Checkbox.Item label="选项A" trueValue="a" />
    <Checkbox.Item label="选项B" trueValue="b" />
    <Checkbox.Item label="选项C" trueValue="c" disabled />
</Checkbox>

// 迁移后 — 使用 options 简写
import { Checkbox } from '@sfe/wand-rn'

<Checkbox.Group
    value={selected}
    onChange={setSelected}
    options={[
        { label: '选项A', value: 'a' },
        { label: '选项B', value: 'b' },
        { label: '选项C', value: 'c', disabled: true },
    ]}
/>
```

### 案例 3：受控模式

```tsx
// 迁移前
import { Checkbox } from '@ss/mtd-react-native'

<Checkbox
    checkedValues={selectedValues}
    onChange={(values) => setSelectedValues(values)}>
    <Checkbox.Item label="A" trueValue="a" />
    <Checkbox.Item label="B" trueValue="b" />
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'

<Checkbox.Group
    value={selectedValues}
    onChange={(values) => setSelectedValues(values)}>
    <Checkbox value="a" block>A</Checkbox>
    <Checkbox value="b" block>B</Checkbox>
</Checkbox.Group>
```

### 案例 4：iconPosition='right'（文字在左，图标在右）

```tsx
// 迁移前
<Checkbox iconPosition="right" checkedValues={values} onChange={setValues}>
    <Checkbox.Item label="选项" trueValue="opt" />
</Checkbox>

// 迁移后
<Checkbox.Group value={values} onChange={setValues}>
    <Checkbox value="opt" block labelPosition="left">选项</Checkbox>
</Checkbox.Group>
```

### 案例 5：带标题的多选列表

```tsx
// 迁移前
<Checkbox label="请选择水果" checkedValues={values} onChange={setValues}>
    <Checkbox.Item label="苹果" trueValue="apple" />
    <Checkbox.Item label="香蕉" trueValue="banana" />
</Checkbox>

// 迁移后（标题需手动添加）
import { Text, View } from 'react-native'
import { Checkbox } from '@sfe/wand-rn'

<View>
    <Text style={{ fontSize: 14, marginBottom: 8 }}>请选择水果</Text>
    <Checkbox.Group value={values} onChange={setValues}>
        <Checkbox value="apple" block>苹果</Checkbox>
        <Checkbox value="banana" block>香蕉</Checkbox>
    </Checkbox.Group>
</View>
```

### 案例 6：全选功能（手动实现）

```tsx
// 迁移前
<Checkbox
    showAllChecked
    checkedValues={values}
    onChange={setValues}>
    <Checkbox.Item label="A" trueValue="a" />
    <Checkbox.Item label="B" trueValue="b" />
    <Checkbox.Item label="C" trueValue="c" />
</Checkbox>

// 迁移后（自行实现全选逻辑）
import { Checkbox } from '@sfe/wand-rn'

const allOptions = ['a', 'b', 'c']
const isAllChecked = values.length === allOptions.length
const isIndeterminate = values.length > 0 && values.length < allOptions.length

<View>
    <Checkbox
        checked={isAllChecked}
        indeterminate={isIndeterminate}
        onChange={(checked) => {
            setValues(checked ? [...allOptions] : [])
        }}>
        全选
    </Checkbox>
    <Checkbox.Group value={values} onChange={setValues}>
        <Checkbox value="a" block>A</Checkbox>
        <Checkbox value="b" block>B</Checkbox>
        <Checkbox value="c" block>C</Checkbox>
    </Checkbox.Group>
</View>
```

### 案例 7：min/max 数量限制（手动实现）

```tsx
// 迁移前
<Checkbox min={1} max={3} checkedValues={values} onChange={setValues}>
    <Checkbox.Item label="A" trueValue="a" />
    <Checkbox.Item label="B" trueValue="b" />
    <Checkbox.Item label="C" trueValue="c" />
    <Checkbox.Item label="D" trueValue="d" />
</Checkbox>

// 迁移后（在 onChange 中实现限制）
<Checkbox.Group
    value={values}
    onChange={(newValues) => {
        if (newValues.length < 1 || newValues.length > 3) return
        setValues(newValues)
    }}>
    <Checkbox value="a" block>A</Checkbox>
    <Checkbox value="b" block>B</Checkbox>
    <Checkbox value="c" block>C</Checkbox>
    <Checkbox value="d" block>D</Checkbox>
</Checkbox.Group>
```

### 案例 8：自定义渲染内容（renderItem → children render function）

```tsx
// 迁移前
<Checkbox
    checkedValues={values}
    onChange={setValues}
    renderItem={(checked, disabled, index) => (
        <View style={checked ? styles.activeCard : styles.card}>
            <Text>{items[index].name}</Text>
        </View>
    )}>
    <Checkbox.Item trueValue="a" label="A" />
    <Checkbox.Item trueValue="b" label="B" />
</Checkbox>

// 迁移后
<Checkbox.Group value={values} onChange={setValues}>
    {items.map((item) => (
        <Checkbox key={item.value} value={item.value}>
            {(checked) => (
                <View style={checked ? styles.activeCard : styles.card}>
                    <Text>{item.name}</Text>
                </View>
            )}
        </Checkbox>
    ))}
</Checkbox.Group>
```

### 案例 9：单独使用（不在 Group 中）

```tsx
// 迁移前 — mtd-react-native 的 Checkbox.Item 单独使用场景较少
// 一般是在 Checkbox 容器内

// 迁移后 — wand-rn 的 Checkbox 可独立使用
import { Checkbox } from '@sfe/wand-rn'

// 非受控
<Checkbox defaultChecked={true} onChange={(checked) => console.log(checked)}>
    同意协议
</Checkbox>

// 受控
<Checkbox checked={agreed} onChange={(checked) => setAgreed(checked)}>
    同意协议
</Checkbox>
```

## 关键点

1. **架构变更**：旧版 `Checkbox` 是分组容器 + `Checkbox.Item` 子项；新版 `Checkbox` 是独立复选框 + `Checkbox.Group` 分组容器。这是最大的变化，所有使用都需要重构
2. **值类型收窄**：旧版 `checkedValues: any[]`（通常用 string），新版严格要求 `value: (string | number)[]`
3. **trueValue → value**：旧版通过 `trueValue`（或 fallback 到 `label`）标识选项，新版通过 `value` 标识
4. **label → children**：旧版用 `label` prop 传文案，新版用 `children`
5. **iconPosition → labelPosition**：语义相反。旧版 `iconPosition='left'` 等于新版 `labelPosition='right'`
6. **全选/min/max 需手动实现**：新组件移除了这些内置功能，需要在业务层自行实现
7. **block 模式**：新组件新增 `block` prop，启用后显示为卡片样式（带边框背景），在 Group 列表场景中通常需要加上 `block`
8. **indeterminate 状态**：新组件支持 `indeterminate` 半选样式（用于全选按钮），旧版通过内部 `halfAllChecked` state 自动处理
9. **renderIcon 不再支持**：新组件不支持自定义勾选图标，如果旧代码依赖 `renderIcon`/`renderItemIcon`，需要评估是否可以接受默认图标
10. **主题/样式覆盖**：旧版通过 `styles` prop 覆盖 `CheckboxStyles`，新版无此能力
