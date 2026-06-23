# Radio 单选框

## 从何处迁移
- **源库**: `@roo/roo-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

### Radio Props

```tsx
export interface RadioProps extends WithThemeStyles<RadioStyles> {
  // Icon 位置
  iconPosition?: 'left' | 'right'  // 默认 'left'
  children: ReactChild[]
  /** 已选中项的值，需要与某个选择项值相等 */
  checkedValue: string | number
  /** Icon 类型 */
  type?: 'check' | 'circle'  // 默认 'check'
  /** 自定义 Icon */
  renderIcon?: (checked: boolean, disabled: boolean, theme: Theme) => JSX.Element
  /** 自定义包裹组件最外层的 View 的样式 */
  style?: StyleProp<ViewStyle>
  /** 选择项变化的回调 */
  onChange?: (value: string | number) => void
  /** 排列方向 */
  direction?: 'vertical' | 'horizontal'  // 默认 'vertical'
  /** 横向排列时标签位置 */
  horizontalLabelPosition?: 'bottom' | 'right'  // 默认 'bottom'
  /** 简洁模式，去除背景色和内边距 */
  plain?: boolean  // 默认 false
}
```

### Radio.Item Props

```tsx
export interface RadioItemProps extends WithThemeStyles<RadioStyles> {
  /** 选择项的文案 */
  label?: string | JSX.Element
  /** 选择项的 value 值 */
  value: string | number
  /** 是否禁止选择项 */
  disabled?: boolean  // 默认 false
  /** 是否包含下划线 */
  hasLine?: boolean  // 默认 false
  /** Icon 类型 */
  type?: 'check' | 'circle'  // 默认 'check'
  /** 自定义 Icon */
  renderIcon?: (checked: boolean, disabled: boolean, theme: Theme) => JSX.Element
  /** 组件状态变化的回调 */
  onChange?: (isChecked: boolean) => void
  /** 自定义渲染选择项 */
  renderItem?: (checked: boolean) => JSX.Element
  /** 自定义 Icon 大小 */
  iconSize?: number  // 默认 22
}
```

## 新组件 API

### Radio Props

```tsx
export interface RadioProps {
  block?: boolean  // 块级模式，默认 false
  checked?: boolean  // 指定是否选中，默认 false
  children?: React.ReactNode | (() => React.ReactNode)
  disabled?: boolean  // 禁用，默认 false
  labelPosition?: 'left' | 'right'  // 标签位置，默认 'right'（block模式下为 'left'）
  type?: string  // 选中类型：'default' 或 'tick'，默认 'default'
  value?: number | string  // 组件标记值，用于 Group 模式
  style?: ViewStyle  // 自定义样式
  onChange?: (value: boolean) => void  // 单个 Radio 的 change 回调
}
```

### Radio.Group Props

```tsx
export interface RadioGroupProps extends Omit<RadioProps, 'checked' | 'onChange'> {
  value?: number | string  // 必填，当前选中值
  options?: RadioOptionItem[]  // 配置形式设置子元素
  onChange?: (value: number | string) => void  // Group 级别的 change 回调
  direction?: 'horizontal' | 'vertical'  // 水平或垂直方向布局，默认 'horizontal'
  spaceSize?: SpaceSize  // 间距，默认 'xl'
  radioStyle?: ViewStyle  // 单选按钮样式
  labelStyle?: TextStyle  // 文本样式
}

export interface RadioOptionItem {
  label?: string | React.ReactNode
  value: number | string
  disabled?: boolean
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| checkedValue | value (在 Group 中) | Group 层面的选中值 |
| children (RadioItem 数组) | children 或 options | 子选项，支持配置数组或 JSX |
| onChange | onChange | 回调签名改变，Group 返回选中值，单个 Radio 返回布尔值 |
| type ('check'/'circle') | type ('default'/'tick') | check → default，circle → default，新增 'tick' 类型 |
| direction | direction | 保持一致 |
| iconPosition | labelPosition | 属性名改变，功能相同 |
| horizontalLabelPosition | - | 移除，通过 labelPosition 控制 |
| plain | - | 移除，通过 block 属性控制 |
| iconSize | - | 移除，样式由主题控制 |
| renderIcon | - | 移除，不支持自定义 Icon 渲染 |
| renderItem | - | 移除，不支持自定义项渲染 |
| hasLine | - | 移除 |
| style | style | 保持一致 |

## 迁移示例

### 案例 1：基础单选框 - 竖向

```tsx
// 迁移前
import { Radio } from '@roo/roo-rn'

<Radio 
  checkedValue={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  direction="vertical"
>
  <Radio.Item label="选项1" value={1} />
  <Radio.Item label="选项2" value={2} />
  <Radio.Item label="选项3" value={3} />
</Radio>

// 迁移后
import { Radio } from '@sfe/wand-rn'

<Radio.Group 
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  direction="vertical"
>
  <Radio value={1}>选项1</Radio>
  <Radio value={2}>选项2</Radio>
  <Radio value={3}>选项3</Radio>
</Radio.Group>
```

### 案例 2：基础单选框 - 横向

```tsx
// 迁移前
import { Radio } from '@roo/roo-rn'

<Radio 
  checkedValue={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  direction="horizontal"
  horizontalLabelPosition="right"
>
  <Radio.Item label="选项1" value={1} />
  <Radio.Item label="选项2" value={2} />
</Radio>

// 迁移后
import { Radio } from '@sfe/wand-rn'

<Radio.Group 
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  direction="horizontal"
  labelPosition="right"
>
  <Radio value={1}>选项1</Radio>
  <Radio value={2}>选项2</Radio>
</Radio.Group>
```

### 案例 3：简洁模式（plain）

```tsx
// 迁移前
import { Radio } from '@roo/roo-rn'

<Radio 
  checkedValue={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  direction="horizontal"
  plain={true}
>
  <Radio.Item label="选项1" value={1} />
  <Radio.Item label="选项2" value={2} />
</Radio>

// 迁移后
import { Radio } from '@sfe/wand-rn'

<Radio.Group 
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  direction="horizontal"
  labelPosition="right"
  // 新组件中无 plain 属性，使用默认紧凑样式
>
  <Radio value={1}>选项1</Radio>
  <Radio value={2}>选项2</Radio>
</Radio.Group>
```

### 案例 4：块级模式

```tsx
// 迁移前
import { Radio } from '@roo/roo-rn'

<Radio 
  checkedValue={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  direction="vertical"
>
  <Radio.Item label="选项1" value={1} />
  <Radio.Item label="选项2" value={2} />
  <Radio.Item label="选项3" value={3} />
</Radio>

// 迁移后 - 块级模式
import { Radio } from '@sfe/wand-rn'

<Radio.Group 
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  block={true}
  direction="vertical"
>
  <Radio value={1}>选项1</Radio>
  <Radio value={2}>选项2</Radio>
  <Radio value={3}>选项3</Radio>
</Radio.Group>
```

### 案例 5：使用配置数组

```tsx
// 迁移前
import { Radio } from '@roo/roo-rn'

const options = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3, disabled: true }
]

<Radio 
  checkedValue={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  direction="vertical"
>
  {options.map(opt => (
    <Radio.Item 
      key={opt.value}
      label={opt.label} 
      value={opt.value}
      disabled={opt.disabled}
    />
  ))}
</Radio>

// 迁移后
import { Radio } from '@sfe/wand-rn'

const options = [
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3, disabled: true }
]

<Radio.Group 
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  direction="vertical"
  options={options}
/>
```

### 案例 6：禁用状态

```tsx
// 迁移前
import { Radio } from '@roo/roo-rn'

<Radio 
  checkedValue={selectedValue}
  onChange={(value) => setSelectedValue(value)}
>
  <Radio.Item label="选项1" value={1} />
  <Radio.Item label="选项2" value={2} disabled={true} />
</Radio>

// 迁移后
import { Radio } from '@sfe/wand-rn'

<Radio.Group 
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
>
  <Radio value={1}>选项1</Radio>
  <Radio value={2} disabled>选项2</Radio>
</Radio.Group>
```

### 案例 7：单独使用 Radio 组件（非 Group 模式）

```tsx
// 迁移前
import { Radio } from '@roo/roo-rn'

const [checked, setChecked] = useState(false)

<Radio 
  checkedValue={checked}
  onChange={(value) => setChecked(value === 'single')}
>
  <Radio.Item label="单独选项" value="single" />
</Radio>

// 迁移后
import { Radio } from '@sfe/wand-rn'

const [checked, setChecked] = useState(false)

<Radio 
  checked={checked}
  onChange={(value) => setChecked(value)}
>
  单独选项
</Radio>
```

### 案例 8：自定义样式

```tsx
// 迁移前
import { Radio } from '@roo/roo-rn'

<Radio 
  checkedValue={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  style={{ marginBottom: 10 }}
  styles={{ itemLabelText: { fontSize: 16 } }}
>
  <Radio.Item label="选项1" value={1} />
  <Radio.Item label="选项2" value={2} />
</Radio>

// 迁移后
import { Radio } from '@sfe/wand-rn'

<Radio.Group 
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  style={{ marginBottom: 10 }}
  labelStyle={{ fontSize: 16 }}
>
  <Radio value={1}>选项1</Radio>
  <Radio value={2}>选项2</Radio>
</Radio.Group>
```

### 案例 9：Icon 类型变更

```tsx
// 迁移前 - check 类型
import { Radio } from '@roo/roo-rn'

<Radio 
  checkedValue={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  type="check"  // 打钩样式
>
  <Radio.Item label="选项1" value={1} />
  <Radio.Item label="选项2" value={2} />
</Radio>

// 迁移后 - 使用 'default' 或 'tick'
import { Radio } from '@sfe/wand-rn'

<Radio.Group 
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  type="tick"  // 新的打钩样式
>
  <Radio value={1}>选项1</Radio>
  <Radio value={2}>选项2</Radio>
</Radio.Group>
```

### 案例 10：完整复杂场景

```tsx
// 迁移前
import { Radio } from '@roo/roo-rn'
import { Form } from '@roo/roo-rn'

const [formData, setFormData] = useState({ gender: 'male' })

<Form.Item label="性别">
  <Radio 
    checkedValue={formData.gender}
    onChange={(value) => setFormData({ ...formData, gender: value })}
    direction="horizontal"
    type="circle"
  >
    <Radio.Item label="男" value="male" />
    <Radio.Item label="女" value="female" />
    <Radio.Item label="其他" value="other" disabled />
  </Radio>
</Form.Item>

// 迁移后
import { Radio } from '@sfe/wand-rn'
import { Form } from '@sfe/wand-rn'

const [formData, setFormData] = useState({ gender: 'male' })

<Form.Item label="性别">
  <Radio.Group 
    value={formData.gender}
    onChange={(value) => setFormData({ ...formData, gender: value })}
    direction="horizontal"
    type="default"  // 或 'tick'
  >
    <Radio value="male">男</Radio>
    <Radio value="female">女</Radio>
    <Radio value="other" disabled>其他</Radio>
  </Radio.Group>
</Form.Item>
```

## 关键点

### 1. 结构变化
- 旧版本：`<Radio><Radio.Item /></Radio>`
- 新版本：`<Radio.Group><Radio /></Radio.Group>` 或直接使用配置数组

### 2. 值传递方式
- 旧版本：`checkedValue` 属性
- 新版本：Group 中使用 `value` 属性

### 3. 回调签名变化
- 旧版本 Group：`onChange: (value: string | number) => void`
- 旧版本 Item：`onChange: (isChecked: boolean) => void`
- 新版本 Group：`onChange: (value: number | string) => void`
- 新版本 Radio：`onChange: (value: boolean) => void`

### 4. Icon 类型
- 旧版本：'check' 和 'circle'
- 新版本：'default' 和 'tick'
  - 'default'：圆形单选框（对应旧的 'circle'）
  - 'tick'：打钩样式（对应旧的 'check'）

### 5. 属性移除
- `plain` 属性已移除，新组件默认为紧凑样式
- `iconSize` 已移除，大小由主题控制
- `renderIcon` 已移除，不支持自定义 Icon
- `renderItem` 已移除，不支持自定义项渲染
- `hasLine` 已移除
- `horizontalLabelPosition` 已移除，使用 `labelPosition` 替代

### 6. Block 模式
- 旧版本：通过 `plain={false}` 隐含实现
- 新版本：显式使用 `block={true}` 属性

### 7. 间距控制
- 新版本 Group 中使用 `spaceSize` 属性控制间距（支持 'xl'、'lg'、'md' 等）
- 默认值为 'xl'

## 注意事项

1. **自定义 Icon 功能移除**：如果依赖旧版本的 `renderIcon` 自定义图标功能，需要重新考虑实现方案
2. **自定义项渲染移除**：如果使用 `renderItem` 自定义项内容，建议在 `children` 中使用 JSX 实现
3. **类型系统更新**：新版本使用 TypeScript 的 Enum，确保 type 值正确
4. **Group 的必填性**：新版本中推荐使用 `Radio.Group` 包装多个 Radio，单个 Radio 主要用于独立场景
5. **样式定制**：新版本通过 `labelStyle`、`radioStyle` 等属性定制样式，不再支持 `styles` 对象

## 迁移检查清单

- [ ] 检查是否使用了 `renderIcon` 自定义 Icon 功能
- [ ] 检查是否使用了 `renderItem` 自定义项渲染
- [ ] 确认 `type` 属性值映射正确（'check' → 'tick' 或 'default'）
- [ ] 检查 `horizontalLabelPosition` 是否存在，需改为 `labelPosition`
- [ ] 确认 `onChange` 回调处理逻辑是否正确（回调参数已改变）
- [ ] 如果使用了 `plain` 属性，按需迁移到新的紧凑样式
- [ ] 测试禁用状态下的交互行为
- [ ] 验证样式定制是否通过新的 `labelStyle`、`radioStyle` 实现
