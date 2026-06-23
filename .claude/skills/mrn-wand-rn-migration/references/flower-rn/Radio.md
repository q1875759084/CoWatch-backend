# Radio 单选框

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface RadioProps {
    /** 块级模式 */
    block?: boolean  // 默认 false
    /** 指定当前是否选中 */
    checked?: boolean  // 默认 false
    /** 自定义标签位置 */
    labelPosition?: 'left' | 'right'
    /** 组件类型 */
    type?: 'default' | 'tick'  // 默认 'default'
    /** 携带的标识值，用于 Group 模式 */
    value?: number | string
    /** 是否禁用 */
    disabled?: boolean  // 默认 false
    /** Radio 标签内容 */
    children?: React.ReactNode | (() => React.ReactNode)
    /** 监听 change 事件 */
    onChange?: (value: boolean) => void
}

interface RadioGroupProps extends Omit<RadioProps, 'checked' | 'onChange'> {
    /** 必填，当前选中的值 */
    value: number | string
    /** 以配置形式设置子元素 */
    options?: RadioOptionItem[]
    /** 样式 */
    style?: StyleProp<ViewStyle>
    /** 监听 change 事件 */
    onChange?: (value: RadioValue) => void
}

interface RadioOptionItem {
    label?: string
    value: number | string
    disabled?: boolean
}

export const Radio: React.FC<RadioProps> & {
    Group: React.FC<RadioGroupProps>
}
```

## 新组件 API

```tsx
interface RadioProps {
    /** 块级模式 */
    block?: boolean  // 默认 false
    /** 指定当前是否选中 */
    checked?: boolean  // 默认 false
    /** 自定义标签位置 */
    labelPosition?: 'left' | 'right'
    /** 组件类型 */
    type?: 'default' | 'tick'  // 默认 'default'
    /** 携带的标识值，用于 Group 模式 */
    value?: number | string
    /** 是否禁用 */
    disabled?: boolean  // 默认 false
    /** Radio 标签内容 */
    children?: React.ReactNode | (() => React.ReactNode)
    /** 自定义样式 */
    style?: ViewStyle  // 新增
    /** 监听 change 事件 */
    onChange?: (value: boolean) => void
}

interface RadioGroupProps extends Omit<RadioProps, 'checked' | 'onChange'> {
    /** 当前选中的值 */
    value?: number | string  // 改为可选
    /** 当前选中的值（Form 表单上下文提供） */
    checkedValue?: number | string  // 新增
    /** 以配置形式设置子元素 */
    options?: RadioOptionItem[]
    /** 水平或垂直方向布局 */
    direction?: 'horizontal' | 'vertical'  // 新增，默认 'horizontal'
    /** 间距 */
    spaceSize?: SpaceSize  // 新增，默认 'xl'
    /** 单选按钮样式 */
    radioStyle?: ViewStyle  // 新增
    /** 文本样式 */
    labelStyle?: TextStyle  // 新增
    /** 监听 change 事件 */
    onChange?: (value: RadioValue) => void
}

interface RadioOptionItem {
    label?: string | React.ReactNode  // 支持 ReactNode
    value: number | string
    disabled?: boolean
}

export const Radio: React.FC<RadioProps> & {
    Group: React.FC<RadioGroupProps>
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| 无 | style | Radio 新增 style 属性 |
| value (必填) | value (可选) | RadioGroup 的 value 改为可选 |
| 无 | checkedValue | RadioGroup 新增 checkedValue 属性，用于 Form 表单上下文 |
| 无 | direction | RadioGroup 新增方向布局属性 |
| 无 | spaceSize | RadioGroup 新增间距属性 |
| 无 | radioStyle | RadioGroup 新增单选按钮样式属性 |
| 无 | labelStyle | RadioGroup 新增文本样式属性 |
| labelPosition (string) | labelPosition ('left' \| 'right') | 类型更严格 |

## 关键变更

### 1. Radio 新增 style 属性
**旧版本**：Radio 不支持 style 属性。

**新版本**：Radio 支持 style 属性用于自定义样式。

```tsx
// 迁移前
<Radio value="a">选项 A</Radio>

// 迁移后可以添加样式
<Radio 
  value="a"
  style={{ marginBottom: 10 }}
>
  选项 A
</Radio>
```

### 2. RadioGroup value 改为可选
**旧版本**：RadioGroup 的 value 是必填属性。

**新版本**：RadioGroup 的 value 改为可选，新增 checkedValue 属性用于 Form 表单集成。

```tsx
// 迁移前
<Radio.Group
  value={selectedValue}  // 必填
  options={options}
  onChange={setSelectedValue}
/>

// 迁移后
<Radio.Group
  value={selectedValue}  // 改为可选
  options={options}
  onChange={setSelectedValue}
/>

// 或在 Form 表单中使用 checkedValue
<Form.Item name="radio">
  <Radio.Group
    checkedValue={selectedValue}  // 新增
    options={options}
    onChange={setSelectedValue}
  />
</Form.Item>
```

### 3. RadioGroup 新增方向和间距控制
**新版本**增加了 `direction` 和 `spaceSize` 属性，支持水平和垂直布局。

```tsx
// 旧版本，选项纵向排列，需要手动布局
<Radio.Group value={selected} onChange={setSelected}>
  {options.map(opt => (
    <View key={opt.value} style={{ marginBottom: 10 }}>
      <Radio value={opt.value}>{opt.label}</Radio>
    </View>
  ))}
</Radio.Group>

// 新版本，可通过 direction 和 spaceSize 控制
<Radio.Group 
  value={selected}
  options={options}
  onChange={setSelected}
  direction="vertical"
  spaceSize="md"
/>
```

### 4. RadioGroup 新增样式自定义属性
**新版本**增加了 `radioStyle` 和 `labelStyle` 属性，用于自定义单选按钮和标签样式。

```tsx
// 新版本支持
<Radio.Group
  value={selected}
  options={options}
  onChange={setSelected}
  radioStyle={{ width: 20, height: 20 }}
  labelStyle={{ fontSize: 14, color: '#333' }}
/>
```

### 5. RadioOptionItem label 支持 ReactNode
**旧版本**：label 只支持字符串。

**新版本**：label 支持 string 或 React.ReactNode。

```tsx
// 迁移前
const options = [
  { label: '选项 A', value: 'a' },
  { label: '选项 B', value: 'b' }
]

// 迁移后可以使用 ReactNode
const options = [
  { label: '选项 A', value: 'a' },
  { label: <View><Icon /> <Text>选项 B</Text></View>, value: 'b' }
]
```

## 迁移示例

### 案例 1：基础单选框（无需改动）

```tsx
// 迁移前
import { Radio } from '@sgfe/flower-rn'

<Radio value="a" checked={true}>
  选项 A
</Radio>

// 迁移后（完全兼容）
import { Radio } from '@sfe/wand-rn'

<Radio value="a" checked={true}>
  选项 A
</Radio>
```

### 案例 2：单选框组（改进的 API）

```tsx
// 迁移前
import { Radio } from '@sgfe/flower-rn'

const [value, setValue] = useState('a')

<Radio.Group
  value={value}
  options={[
    { label: '选项 A', value: 'a' },
    { label: '选项 B', value: 'b' }
  ]}
  onChange={setValue}
/>

// 迁移后（API 兼容）
import { Radio } from '@sfe/wand-rn'

const [value, setValue] = useState('a')

<Radio.Group
  value={value}
  options={[
    { label: '选项 A', value: 'a' },
    { label: '选项 B', value: 'b' }
  ]}
  onChange={setValue}
/>
```

### 案例 3：使用新的方向和间距控制

```tsx
// 新版本支持水平布局
import { Radio } from '@sfe/wand-rn'

<Radio.Group
  value={selected}
  options={[
    { label: '选项 A', value: 'a' },
    { label: '选项 B', value: 'b' },
    { label: '选项 C', value: 'c' }
  ]}
  onChange={setSelected}
  direction="horizontal"  // 水平布局
  spaceSize="lg"  // 大间距
/>
```

### 案例 4：垂直布局，自定义样式

```tsx
// 新版本支持自定义样式
import { Radio } from '@sfe/wand-rn'

<Radio.Group
  value={selected}
  options={[
    { label: '选项 A', value: 'a' },
    { label: '选项 B', value: 'b' },
    { label: '选项 C', value: 'c' }
  ]}
  onChange={setSelected}
  direction="vertical"
  spaceSize="md"
  radioStyle={{ width: 20, height: 20 }}
  labelStyle={{ fontSize: 14, marginLeft: 8 }}
/>
```

### 案例 5：使用 ReactNode 作为 label

```tsx
// 新版本支持复杂 label
import { Radio } from '@sfe/wand-rn'

<Radio.Group
  value={selected}
  options={[
    { 
      label: '选项 A', 
      value: 'a' 
    },
    { 
      label: (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon type="check" />
          <Text>选项 B</Text>
        </View>
      ), 
      value: 'b' 
    }
  ]}
  onChange={setSelected}
/>
```

### 案例 6：Tick 类型单选框

```tsx
// 迁移前后都支持
import { Radio } from '@sfe/wand-rn'

<Radio.Group
  type="tick"  // 使用 tick 样式（对勾）
  value={selected}
  options={[
    { label: '同意条款', value: '1' }
  ]}
  onChange={setSelected}
/>
```

### 案例 7：块级模式

```tsx
// 迁移前后都支持
import { Radio } from '@sfe/wand-rn'

<Radio.Group
  block={true}  // 块级模式，label 在左边
  value={selected}
  options={[
    { label: '选项 A', value: 'a' },
    { label: '选项 B', value: 'b' }
  ]}
  onChange={setSelected}
/>
```

## 关键点

- **基础 API 兼容**：所有基础属性和方法保持兼容
- **Radio style 支持**：新版本支持为单个 Radio 组件添加样式
- **RadioGroup 新增属性**：direction、spaceSize、radioStyle、labelStyle 提供更灵活的配置
- **value 改为可选**：RadioGroup 的 value 从必填改为可选，添加 checkedValue 用于 Form 集成
- **label 支持 ReactNode**：RadioOptionItem 的 label 现在支持更复杂的内容
- **labelPosition 类型更严格**：从 string 改为 'left' | 'right' 的严格类型
- **其他属性保持一致**：block、type、disabled、checked 等属性保持不变
- **子元素渲染兼容**：children 既可以是字符串，也可以是 JSX 或函数
- **Group 继承 Radio 属性**：RadioGroup 继承 Radio 的大多数属性
- **Form 表单集成**：通过 checkedValue 更好地支持 Form 表单集成
