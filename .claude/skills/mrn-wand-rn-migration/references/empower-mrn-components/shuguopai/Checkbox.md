# Checkbox 复选框

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

### Checkbox Props

```tsx
interface CheckboxProps extends WithThemeStyles<CheckboxStyles> {
  /** 多选列表标题 */
  label?: string | JSX.Element
  /** 默认选中的值，其中的值就是 Checkbox.Item 的 label 或者 trueValue（优先级高），再次被设置时会相应改变, 并联动全选状态的改变 */
  checkedValues?: any[]
  /** 选项扭 Icon 位置 */
  iconPosition?: 'left' | 'right'
  /** min 最少可选数量 */
  min?: number
  /** max 最多可选数量 */
  max?: number
  /** 有数值变化的回调,参数是数组 */
  onChange?: (values: any[]) => void
  /** 是否展示全选按钮 */
  showAllChecked?: boolean
  /** 自定义 Checkbox 容器的样式 */
  style?: StyleProp<ViewStyle>
  /** 自定义单个 Checkbox.Item 的内容，参数：checked, disabled, index */
  renderItem?: (checked: boolean, disabled: boolean, index: number) => JSX.Element
  /** 自定义渲染 Checkbox.Item 中的 Icon，参数：checked, disabled, index */
  renderItemIcon?: (checked: boolean, disabled: boolean, index: number) => React.ReactNode
  /** 自定义渲染全选选项 */
  renderCheckboxAllChecked?: (CheckboxAllCheckedProps: CheckboxItemProps) => JSX.Element
}
```

### Checkbox.Item Props

```tsx
interface CheckboxItemProps {
  /** checkbox的值 */
  label: string
  /** 检查时返回的值 */
  trueValue?: string | number
  /** 是否被选中 */
  checked?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否展示分割线 */
  hasLine?: boolean
  /** 是否半选 */
  halfAllChecked?: boolean
  /** icon的位置 */
  iconPosition?: 'left' | 'right'
  /** 点击回调 */
  onChange?: (value: any, checked: boolean) => void
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
| 整体架构变更 | - | 从多层级 Checkbox + Checkbox.Item + Checkbox.AllChecked，迁移到简化的 Checkbox + Checkbox.Group |
| label | - | 移除，标题功能不再需要 |
| checkedValues | value | 选中值数组，名称改变，需在 Group 中使用 |
| iconPosition | labelPosition | Icon 位置改为标签位置，left/right 保持一致 |
| min / max | - | 移除最小/最大限制，需在业务代码中处理 |
| onChange | onChange | 回调签名变更，新组件参数为 (checkedValue?: (string \| number)[]) => void |
| showAllChecked | - | 移除全选功能，需自行实现 |
| renderItem | - | 移除自定义渲染 Item 的方法，使用 children 替代 |
| renderItemIcon | - | 移除自定义渲染 Icon 的方法 |
| renderCheckboxAllChecked | - | 移除全选选项自定义渲染 |
| Checkbox.Item | - | 不再需要，直接在 Group 中使用 options 或 children |

## 关键变更

### 1. 架构大幅简化

**旧组件**：基于 MTD 的复杂多层级设计
- Checkbox（容器组件）
- Checkbox.Item（单个选项）
- Checkbox.AllChecked（全选项）
- 支持多种自定义渲染方法

**新组件**：简化到单 Checkbox + Group
- Checkbox（单个复选框）
- Checkbox.Group（组合容器）
- 通过 children 或 options 定义选项

### 2. 受控/非受控模式变更

**旧组件**：
```tsx
// 主要通过 Container 的 checkedValues 管理
<Checkbox checkedValues={[1, 2]} onChange={values => console.log(values)}>
  <Checkbox.Item label="选项1" trueValue={1} />
  <Checkbox.Item label="选项2" trueValue={2} />
</Checkbox>
```

**新组件**：
```tsx
// Group 管理选中状态
<Checkbox.Group value={[1, 2]} onChange={values => console.log(values)}>
  <Checkbox value={1} block>选项1</Checkbox>
  <Checkbox value={2} block>选项2</Checkbox>
</Checkbox.Group>
```

### 3. 全选功能需要自行实现

旧组件的 `showAllChecked` 和全选/全不选功能需要在业务代码中实现。

### 4. min/max 限制需要业务层处理

新组件不支持 min/max，需要在 onChange 中手动校验。

### 5. Icon 类型更新

使用的 Icon 类型已更新：
- 选中状态：`check-outlined`
- 半选状态：`remove-outlined-lg`

## 迁移示例

### 案例 1：简单列表迁移

```tsx
// 迁移前
import { Checkbox } from '@mtfe/empower-mrn-components/shuguopai'

<Checkbox 
  checkedValues={[1, 2]} 
  onChange={values => console.log(values)}
>
  <Checkbox.Item label="选项1" trueValue={1} />
  <Checkbox.Item label="选项2" trueValue={2} />
  <Checkbox.Item label="选项3" trueValue={3} />
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'

<Checkbox.Group 
  value={[1, 2]} 
  onChange={values => console.log(values)}
>
  <Checkbox value={1} block>选项1</Checkbox>
  <Checkbox value={2} block>选项2</Checkbox>
  <Checkbox value={3} block>选项3</Checkbox>
</Checkbox.Group>
```

### 案例 2：使用 options 属性

```tsx
// 迁移前
<Checkbox 
  checkedValues={['a', 'b']} 
  onChange={values => console.log(values)}
>
  <Checkbox.Item label="选项A" trueValue="a" />
  <Checkbox.Item label="选项B" trueValue="b" />
  <Checkbox.Item label="选项C" trueValue="c" disabled={true} />
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'

<Checkbox.Group
  value={['a', 'b']}
  onChange={values => console.log(values)}
  options={[
    { label: '选项A', value: 'a' },
    { label: '选项B', value: 'b' },
    { label: '选项C', value: 'c', disabled: true }
  ]}
/>
```

### 案例 3：禁用状态

```tsx
// 迁移前
<Checkbox 
  checkedValues={[1]} 
  onChange={values => console.log(values)}
>
  <Checkbox.Item label="启用项" trueValue={1} />
  <Checkbox.Item label="禁用项" trueValue={2} disabled={true} />
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'

<Checkbox.Group 
  value={[1]} 
  onChange={values => console.log(values)}
>
  <Checkbox value={1} block>启用项</Checkbox>
  <Checkbox value={2} block disabled>禁用项</Checkbox>
</Checkbox.Group>
```

### 案例 4：带标题的列表

```tsx
// 迁移前
import { Checkbox } from '@mtfe/empower-mrn-components/shuguopai'
import { Text, View } from 'react-native'

<Checkbox 
  label="选择配送方式"
  checkedValues={[1]} 
  onChange={values => console.log(values)}
>
  <Checkbox.Item label="快递配送" trueValue={1} />
  <Checkbox.Item label="上门自取" trueValue={2} />
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'
import { Text, View } from '@mrn/react-native'

<View>
  <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>选择配送方式</Text>
  <Checkbox.Group 
    value={[1]} 
    onChange={values => console.log(values)}
  >
    <Checkbox value={1} block>快递配送</Checkbox>
    <Checkbox value={2} block>上门自取</Checkbox>
  </Checkbox.Group>
</View>
```

### 案例 5：单个复选框（不在 Group 中）

```tsx
// 迁移前
import { Checkbox } from '@mtfe/empower-mrn-components/shuguopai'

const [checked, setChecked] = useState(false)

<Checkbox 
  checkedValues={checked ? [1] : []} 
  onChange={values => setChecked(values.includes(1))}
>
  <Checkbox.Item label="我已同意" trueValue={1} />
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'
import { useState } from 'react'

const [checked, setChecked] = useState(false)

<Checkbox 
  checked={checked} 
  onChange={setChecked}
>
  我已同意
</Checkbox>
```

### 案例 6：全选功能（需自行实现）

```tsx
// 迁移前
<Checkbox 
  checkedValues={selectedValues}
  onChange={setSelectedValues}
  showAllChecked={true}
>
  <Checkbox.Item label="选项1" trueValue={1} />
  <Checkbox.Item label="选项2" trueValue={2} />
  <Checkbox.Item label="选项3" trueValue={3} />
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'
import { View, Text, TouchableOpacity } from '@mrn/react-native'
import { useState } from 'react'

const allOptions = [1, 2, 3]
const [selectedValues, setSelectedValues] = useState([])

const allSelected = selectedValues.length === allOptions.length
const isIndeterminate = selectedValues.length > 0 && selectedValues.length < allOptions.length

const handleSelectAll = () => {
  setSelectedValues(allSelected ? [] : allOptions)
}

<View>
  <TouchableOpacity onPress={handleSelectAll}>
    <Checkbox 
      checked={allSelected}
      indeterminate={isIndeterminate}
      block
    >
      全选
    </Checkbox>
  </TouchableOpacity>
  
  <Checkbox.Group 
    value={selectedValues}
    onChange={setSelectedValues}
  >
    <Checkbox value={1} block>选项1</Checkbox>
    <Checkbox value={2} block>选项2</Checkbox>
    <Checkbox value={3} block>选项3</Checkbox>
  </Checkbox.Group>
</View>
```

### 案例 7：min/max 限制（需在业务代码中处理）

```tsx
// 迁移前
<Checkbox 
  checkedValues={selectedValues}
  onChange={setSelectedValues}
  min={1}
  max={2}
>
  <Checkbox.Item label="选项1" trueValue={1} />
  <Checkbox.Item label="选项2" trueValue={2} />
  <Checkbox.Item label="选项3" trueValue={3} />
</Checkbox>

// 迁移后
import { Checkbox } from '@sfe/wand-rn'
import { useState } from 'react'

const [selectedValues, setSelectedValues] = useState([])

const handleChange = (newValues) => {
  // 业务层验证 min/max
  if (newValues.length >= 1 && newValues.length <= 2) {
    setSelectedValues(newValues)
  }
}

<Checkbox.Group 
  value={selectedValues}
  onChange={handleChange}
>
  <Checkbox value={1} block>选项1</Checkbox>
  <Checkbox value={2} block>选项2</Checkbox>
  <Checkbox value={3} block>选项3</Checkbox>
</Checkbox.Group>
```

### 案例 8：受控模式

```tsx
// 迁移前
class MyComponent extends React.Component {
  state = { checkedValues: [1] }
  
  render() {
    return (
      <Checkbox 
        checkedValues={this.state.checkedValues}
        onChange={checkedValues => this.setState({ checkedValues })}
      >
        <Checkbox.Item label="选项1" trueValue={1} />
        <Checkbox.Item label="选项2" trueValue={2} />
      </Checkbox>
    )
  }
}

// 迁移后
import { Checkbox } from '@sfe/wand-rn'
import { useState } from 'react'

function MyComponent() {
  const [checkedValues, setCheckedValues] = useState([1])
  
  return (
    <Checkbox.Group 
      value={checkedValues}
      onChange={setCheckedValues}
    >
      <Checkbox value={1} block>选项1</Checkbox>
      <Checkbox value={2} block>选项2</Checkbox>
    </Checkbox.Group>
  )
}
```

## 关键点

### ⚠️ 必需改动

1. **架构变更**：从 Checkbox + Checkbox.Item 改为 Checkbox.Group + Checkbox，这是最大的变化
2. **属性名变更**：checkedValues → value（在 Group 中使用）
3. **全选功能移除**：需要在业务代码中自行实现
4. **min/max 限制移除**：需要在 onChange 中手动校验
5. **自定义渲染方法移除**：renderItem、renderItemIcon、renderCheckboxAllChecked 不再支持

### 🔄 迁移步骤

1. **识别旧组件用途**：
   - 单个 checkbox：迁移到 `<Checkbox>` 直接使用
   - 多选列表：迁移到 `<Checkbox.Group>` 包装多个 `<Checkbox>`

2. **转换选项定义**：
   - 从 `<Checkbox.Item>` children 改为 Group 的 `value` prop 或 `options` prop

3. **处理全选功能**：
   - 旧组件的 `showAllChecked` 需自行实现，参考案例 6

4. **处理 min/max**：
   - 在 onChange 回调中添加长度校验

5. **测试验证**：
   - 验证选中状态的同步
   - 验证禁用状态的表现
   - 验证回调函数的触发

### 📋 迁移检查清单

- [ ] 替换导入语句：`@mtfe/empower-mrn-components/shuguopai` → `@sfe/wand-rn`
- [ ] 识别所有 Checkbox 的使用位置
- [ ] 转换 Checkbox.Item 为 Checkbox 或 options 项
- [ ] 将 checkedValues 改为 value
- [ ] 实现全选功能（如有需要）
- [ ] 实现 min/max 校验（如有需要）
- [ ] 移除自定义渲染方法，改用 children 或标准 API
- [ ] 测试所有交互场景

### 💡 最佳实践

1. **优先使用 block 模式**：新组件推荐使用 `block` 属性，提供更好的触摸反馈
2. **使用 options 简化代码**：当选项固定时，使用 options 比 children 更简洁
3. **标签位置**：block 模式下，标签默认在左侧，可通过 labelPosition 调整
4. **indeterminate 用途**：用于表示部分选中的状态（如全选/全不选的中间态）

