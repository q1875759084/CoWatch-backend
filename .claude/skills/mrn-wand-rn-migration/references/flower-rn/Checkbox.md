# Checkbox 复选框

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

### Checkbox Props

```tsx
interface CheckboxProps {
    /** 指定当前是否选中 */
    checked?: boolean;
    /** 初始是否选中 */
    defaultChecked?: boolean;
    /** 是否渲染为块级元素 */
    block?: boolean;
    /** 失效状态 */
    disabled?: boolean;
    /** 设置 indeterminate 状态，只负责样式控制 */
    indeterminate?: boolean;
    /** 与group结合时使用，用于标识当前选项 */
    value?: number | string;
    /** 标签位置，块级模式生效，默认 'left' */
    labelPosition?: 'left' | 'right';
    /** 变化时的回调函数 */
    onChange?: (checked?: boolean) => void;
}
```

### Checkbox.Group Props

```tsx
interface CheckboxGroupProps {
    /** 初始是否选中 */
    defaultValue?: (string | number)[];
    /** 失效状态 */
    disabled?: boolean;
    /** 指定可选项 */
    options?: (string | number | CheckboxOptionItem)[];
    /** 指定选中的选项 */
    value?: (string | number)[];
    /** 变化时的回调函数 */
    onChange?: (checkedValue?: (string | number)[]) => void;
}

interface CheckboxOptionItem {
    label: string;
    value: string | number;
    disabled?: boolean;
}
```

## 新组件 API

### Checkbox Props

```tsx
interface CheckboxProps {
    /** 指定当前是否选中 */
    checked?: boolean
    /** 初始是否选中 */
    defaultChecked?: boolean
    /** 是否渲染为块级元素 */
    block?: boolean
    /** 失效状态 */
    disabled?: boolean
    /** 设置 indeterminate 状态，只负责样式控制 */
    indeterminate?: boolean
    /** 与group结合时使用，用于标识当前选项 */
    value?: number | string
    /** 标签位置，块级模式生效，默认 'left' */
    labelPosition?: 'left' | 'right'
    /** 变化时的回调函数 */
    onChange?: (checked?: boolean) => void
}
```

### Checkbox.Group Props

```tsx
interface CheckboxGroupProps {
    /** 初始是否选中 */
    defaultValue?: (string | number)[]
    /** 失效状态 */
    disabled?: boolean
    /** 指定可选项 */
    options?: (string | number | CheckboxOptionItem)[]
    /** 指定选中的选项 */
    value?: (string | number)[]
    /** 变化时的回调函数 */
    onChange?: (checkedValue?: (string | number)[]) => void
}

interface CheckboxOptionItem {
    label: string
    value: string | number
    disabled?: boolean
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| N/A | N/A | **所有 Props 兼容** |
| `Icon.type="checkmark-o"` | `Icon.type="check-outlined"` | 选中状态图标类型变更 |
| `Icon.type="reduction-o"` | `Icon.type="remove-outlined-lg"` | 半选状态图标类型变更 |

## 关键变更

### 1. Icon 类型更新

新库使用了不同的 Icon 类型名称。在 `indeterminate` 为 `true` 时，以及选中状态时，图标类型发生了变化。

### 2. hitSlop 增强

新库在行内模式（非 block 模式）下增加了 `hitSlop` 属性，使触摸区域更大（上下左右各 8）：

```tsx
hitSlop={block ? undefined : { top: 8, bottom: 8, left: 8, right: 8 }}
```

这是内部实现改进，不影响外部 API，但可提升行内 Checkbox 的可用性。

### 3. CheckboxGroup 中的 key 处理

新库在 CheckboxGroup 生成 options 时添加了更规范的 key 处理：

```tsx
// 迁移前
{children ? children :
    innerOptions?.map?.(option => 
        <Checkbox ... >
            {option.label}
        </Checkbox>
    )
}

// 迁移后
{children || innerOptions?.map?.((option, index) => {
    const key = `group-${index}`
    return (
        <Checkbox key={key} ... >
            {option.label}
        </Checkbox>
    )
})}
```

虽然这是内部改进，但若在代码中直接使用 CheckboxGroup 的 options 模式，务必确保 Checkbox 子元素有正确的 key。

## 迁移示例

### 案例 1：简单复选框

```tsx
// 迁移前
import { Checkbox } from '@sgfe/flower-rn'

<Checkbox onChange={(checked) => console.log(checked)}>
    我已同意
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'

<Checkbox onChange={(checked) => console.log(checked)}>
    我已同意
</Checkbox>
```

### 案例 2：受控复选框

```tsx
// 迁移前
import { Checkbox } from '@sgfe/flower-rn'

const [checked, setChecked] = useState(false)

<Checkbox checked={checked} onChange={setChecked}>
    选项
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'

const [checked, setChecked] = useState(false)

<Checkbox checked={checked} onChange={setChecked}>
    选项
</Checkbox>
```

### 案例 3：块级复选框

```tsx
// 迁移前
import { Checkbox } from '@sgfe/flower-rn'

<Checkbox block labelPosition="right">
    块级显示的标签
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'

<Checkbox block labelPosition="right">
    块级显示的标签
</Checkbox>
```

### 案例 4：半选状态

```tsx
// 迁移前
import { Checkbox } from '@sgfe/flower-rn'

<Checkbox indeterminate disabled>
    部分已选
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'

<Checkbox indeterminate disabled>
    部分已选
</Checkbox>
```

### 案例 5：CheckboxGroup 使用 options

```tsx
// 迁移前
import { Checkbox } from '@sgfe/flower-rn'

<Checkbox.Group
    options={[
        { label: '选项 A', value: 'a' },
        { label: '选项 B', value: 'b' },
        { label: '选项 C', value: 'c', disabled: true }
    ]}
    onChange={(values) => console.log(values)}
/>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'

<Checkbox.Group
    options={[
        { label: '选项 A', value: 'a' },
        { label: '选项 B', value: 'b' },
        { label: '选项 C', value: 'c', disabled: true }
    ]}
    onChange={(values) => console.log(values)}
/>
```

### 案例 6：CheckboxGroup 使用 children

```tsx
// 迁移前
import { Checkbox } from '@sgfe/flower-rn'

<Checkbox.Group value={[1, 2]} onChange={(v) => console.log(v)}>
    <Checkbox value={1} block>选项 1</Checkbox>
    <Checkbox value={2} block>选项 2</Checkbox>
    <Checkbox value={3} block>选项 3</Checkbox>
</Checkbox.Group>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'

<Checkbox.Group value={[1, 2]} onChange={(v) => console.log(v)}>
    <Checkbox value={1} block>选项 1</Checkbox>
    <Checkbox value={2} block>选项 2</Checkbox>
    <Checkbox value={3} block>选项 3</Checkbox>
</Checkbox.Group>
```

### 案例 7：函数型 label

```tsx
// 迁移前
import { Checkbox } from '@sgfe/flower-rn'

<Checkbox value={1}>
    {(checked, value) => `选项 ${value} - ${checked ? '已选中' : '未选中'}`}
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'

<Checkbox value={1}>
    {(checked, value) => `选项 ${value} - ${checked ? '已选中' : '未选中'}`}
</Checkbox>
```

## 关键点

- ✅ **API 完全兼容**：所有 Props 的名称、类型和默认值均相同
- ✅ **Icon 类型更新**：内部使用的 Icon 类型已更新，无需修改调用代码
- ✅ **行内模式交互优化**：新库增加了 `hitSlop`，使行内 Checkbox 更易点击
- ✅ **CheckboxGroup 改进**：CheckboxGroup 的 key 处理更规范，无影响
- 🔄 **直接迁移**：只需更改导入路径即可完成迁移，无需修改任何业务逻辑
