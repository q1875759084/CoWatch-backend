# Select 选择器

## 从何处迁移
- **源库**: `@roo/roo-rn1`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface SelectItem {
  value?: number | string
  label?: string
  disabled?: boolean
}

export interface SelectProps extends WithThemeStyles<SelectStyles> {
  /** 自定义包裹组件最外层的样式 */
  style?: StyleProp<ViewStyle>
  /** 选项数据 */
  items: Array<SelectItem>
  /** 初始选中值 */
  initSelected: number | string | Array<number> | Array<string>
  /** 是否多选 */
  multiple: boolean  // 默认 true
  /** 右侧图标 */
  rightIcon?: JSX.Element
  /** 是否可滚动 */
  scrollable?: boolean  // 默认 false
  /** 选择器类型 */
  type?: 'line' | 'plane'  // 默认 'line'
  /** 点击选项回调 */
  onPress?: (item: SelectItem, selected: boolean, e?) => void
  /** 自定义渲染选项 */
  renderItem?: (item: SelectExtendItem, selected: boolean, index: number) => JSX.Element
}
```

## 新组件 API

```tsx
export interface SelectOption {
  value: number | string  // 必填
  label: string  // 必填
  disabled?: boolean
}

export interface SelectProps extends WithThemeStyles<SelectStyles> {
  /** 当前选中值 */
  value?: Array<number> | Array<string>  // 默认 []
  /** 选项数据 */
  options?: Array<SelectOption>  // 默认 []
  /** 右侧图标 */
  rightIcon?: JSX.Element
  /** 左侧图标 */
  leftIcon?: JSX.Element
  /** 是否可滚动 */
  scrollable?: boolean  // 默认 false
  /** 选择器类型 */
  type?: 'plane' | 'light'  // 默认 'plane'
  /** 列数（网格布局） */
  column?: number
  /** 点击选项回调 */
  onPress?: (item: SelectOption, e?) => void
  /** 自定义样式 */
  styles?: object
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| items | options | 属性名变更；子项 value 和 label 变为必填 |
| initSelected | value | 从初始值变为受控值；类型收窄为仅支持 Array |
| multiple | - | 移除，消费方自行实现单选/多选逻辑 |
| rightIcon | rightIcon | 保持一致 |
| scrollable | scrollable | 保持一致 |
| type | type | 可选值变更：'line'\|'plane' -> 'plane'\|'light'；'line' 无对应值 |
| onPress | onPress | 签名变更：移除第二个参数 selected |
| renderItem | - | 移除，不再支持自定义渲染 |
| style | - | 移除 |
| - | leftIcon | 新增，左侧图标 |
| - | column | 新增，网格布局列数 |
| - | styles | 新增，自定义样式对象 |

## 迁移示例

### 案例 1：组件名与导入变更

```tsx
// 迁移前
import { Select } from '@roo/roo-rn1'

<Select
  items={[
    { value: 1, label: '选项一' },
    { value: 2, label: '选项二' },
  ]}
  initSelected={1}
  multiple={false}
/>

// 迁移后 - 组件名改为 Selector，需受控管理选中状态
import { Selector } from '@sfe/wand-rn'

const [value, setValue] = useState<number[]>([1])

<Selector
  options={[
    { value: 1, label: '选项一' },
    { value: 2, label: '选项二' },
  ]}
  value={value}
  onPress={(item) => {
    setValue([item.value as number])
  }}
/>
```

### 案例 2：多选场景

```tsx
// 迁移前 - 组件内部管理多选状态
import { Select } from '@roo/roo-rn1'

<Select
  items={[
    { value: 'a', label: '苹果' },
    { value: 'b', label: '香蕉' },
    { value: 'c', label: '橙子' },
  ]}
  initSelected={['a', 'b']}
  multiple={true}
  onPress={(item, selected) => {
    console.log(item.label, selected ? '选中' : '取消')
  }}
/>

// 迁移后 - 消费方自行管理多选状态
import { Selector } from '@sfe/wand-rn'

const [value, setValue] = useState<string[]>(['a', 'b'])

<Selector
  options={[
    { value: 'a', label: '苹果' },
    { value: 'b', label: '香蕉' },
    { value: 'c', label: '橙子' },
  ]}
  value={value}
  onPress={(item) => {
    const val = item.value as string
    if (value.includes(val)) {
      setValue(value.filter(v => v !== val))
    } else {
      setValue([...value, val])
    }
  }}
/>
```

### 案例 3：单选场景

```tsx
// 迁移前 - 通过 multiple={false} 控制单选
import { Select } from '@roo/roo-rn1'

<Select
  items={[
    { value: 1, label: '男' },
    { value: 2, label: '女' },
  ]}
  initSelected={1}
  multiple={false}
  onPress={(item, selected) => {
    console.log('选中:', item.label)
  }}
/>

// 迁移后 - 消费方自行实现单选逻辑
import { Selector } from '@sfe/wand-rn'

const [value, setValue] = useState<number[]>([1])

<Selector
  options={[
    { value: 1, label: '男' },
    { value: 2, label: '女' },
  ]}
  value={value}
  onPress={(item) => {
    setValue([item.value as number])
  }}
/>
```

### 案例 4：type 属性值变更

```tsx
// 迁移前 - 使用 'line' 或 'plane' 类型
import { Select } from '@roo/roo-rn1'

<Select
  items={items}
  initSelected={1}
  multiple={false}
  type="line"
/>

<Select
  items={items}
  initSelected={1}
  multiple={false}
  type="plane"
/>

// 迁移后 - 'line' 无对应值，使用 'plane' 或 'light'
import { Selector } from '@sfe/wand-rn'

const [value, setValue] = useState<number[]>([1])

// 'line' 类型无等效替代，使用 'plane'（默认值）
<Selector
  options={options}
  value={value}
  type="plane"
  onPress={(item) => setValue([item.value as number])}
/>

// 'plane' 类型保持一致
<Selector
  options={options}
  value={value}
  type="plane"
  onPress={(item) => setValue([item.value as number])}
/>
```

### 案例 5：选项数据格式变更

```tsx
// 迁移前 - value 和 label 可选
import { Select } from '@roo/roo-rn1'

<Select
  items={[
    { label: '仅标签' },
    { value: 1 },
    { value: 2, label: '完整项', disabled: true },
  ]}
  initSelected={1}
  multiple={false}
/>

// 迁移后 - value 和 label 必填，需补全缺失字段
import { Selector } from '@sfe/wand-rn'

const [value, setValue] = useState<number[]>([1])

<Selector
  options={[
    { value: 0, label: '仅标签' },       // 补充 value
    { value: 1, label: '选项 1' },        // 补充 label
    { value: 2, label: '完整项', disabled: true },
  ]}
  value={value}
  onPress={(item) => setValue([item.value as number])}
/>
```

### 案例 6：onPress 回调签名变更

```tsx
// 迁移前 - onPress 提供 selected 状态
import { Select } from '@roo/roo-rn1'

<Select
  items={items}
  initSelected={[1, 2]}
  multiple={true}
  onPress={(item, selected, e) => {
    if (selected) {
      console.log(`${item.label} 被选中`)
    } else {
      console.log(`${item.label} 被取消`)
    }
  }}
/>

// 迁移后 - 无 selected 参数，需自行判断
import { Selector } from '@sfe/wand-rn'

const [value, setValue] = useState<number[]>([1, 2])

<Selector
  options={options}
  value={value}
  onPress={(item) => {
    const val = item.value as number
    const isSelected = value.includes(val)
    if (isSelected) {
      console.log(`${item.label} 被取消`)
      setValue(value.filter(v => v !== val))
    } else {
      console.log(`${item.label} 被选中`)
      setValue([...value, val])
    }
  }}
/>
```

### 案例 7：移除 renderItem 自定义渲染

```tsx
// 迁移前 - 使用 renderItem 自定义渲染
import { Select } from '@roo/roo-rn1'

<Select
  items={items}
  initSelected={1}
  multiple={false}
  renderItem={(item, selected, index) => (
    <View style={selected ? styles.activeItem : styles.item}>
      <Icon type={item.icon} />
      <Text>{item.label}</Text>
    </View>
  )}
/>

// 迁移后 - renderItem 已移除，使用标准选项配置
import { Selector } from '@sfe/wand-rn'

const [value, setValue] = useState<number[]>([1])

// 不再支持自定义渲染，使用 leftIcon 等内置能力
<Selector
  options={options}
  value={value}
  leftIcon={<Icon type="check" />}
  onPress={(item) => setValue([item.value as number])}
/>
```

### 案例 8：移除 style 属性

```tsx
// 迁移前 - 使用 style 设置外层样式
import { Select } from '@roo/roo-rn1'

<Select
  style={{ marginTop: 16, paddingHorizontal: 12 }}
  items={items}
  initSelected={1}
  multiple={false}
/>

// 迁移后 - style 被移除，用外层 View 包裹
import { Selector } from '@sfe/wand-rn'

const [value, setValue] = useState<number[]>([1])

<View style={{ marginTop: 16, paddingHorizontal: 12 }}>
  <Selector
    options={options}
    value={value}
    onPress={(item) => setValue([item.value as number])}
  />
</View>
```

### 案例 9：新增 leftIcon 属性

```tsx
// 迁移前 - 仅支持 rightIcon
import { Select } from '@roo/roo-rn1'

<Select
  items={items}
  initSelected={1}
  multiple={false}
  rightIcon={<Icon type="check" />}
/>

// 迁移后 - 新增 leftIcon 支持
import { Selector } from '@sfe/wand-rn'

const [value, setValue] = useState<number[]>([1])

<Selector
  options={options}
  value={value}
  leftIcon={<Icon type="star" />}
  rightIcon={<Icon type="check" />}
  onPress={(item) => setValue([item.value as number])}
/>
```

### 案例 10：新增 column 网格布局

```tsx
// 迁移前 - 无网格布局支持
import { Select } from '@roo/roo-rn1'

<Select
  items={items}
  initSelected={1}
  multiple={false}
/>

// 迁移后 - 使用 column 控制每行显示列数
import { Selector } from '@sfe/wand-rn'

const [value, setValue] = useState<number[]>([1])

<Selector
  options={options}
  value={value}
  column={3}
  onPress={(item) => setValue([item.value as number])}
/>
```

### 案例 11：initSelected 到 value 的受控迁移

```tsx
// 迁移前 - 半受控，仅设置初始值
import { Select } from '@roo/roo-rn1'

<Select
  items={items}
  initSelected={[1, 3]}
  multiple={true}
  onPress={(item, selected) => {
    // 组件内部自动管理选中状态
    // 外部仅监听变化
    reportToServer(item.value, selected)
  }}
/>

// 迁移后 - 完全受控，必须管理状态
import { Selector } from '@sfe/wand-rn'

const [value, setValue] = useState<number[]>([1, 3])

<Selector
  options={options}
  value={value}
  onPress={(item) => {
    const val = item.value as number
    let newValue: number[]
    if (value.includes(val)) {
      newValue = value.filter(v => v !== val)
    } else {
      newValue = [...value, val]
    }
    setValue(newValue)
    reportToServer(val, !value.includes(val))
  }}
/>
```

### 案例 12：完整复杂场景

```tsx
// 迁移前
import { Select } from '@roo/roo-rn1'

<Select
  style={{ marginVertical: 12 }}
  items={[
    { value: 'sz', label: '深圳' },
    { value: 'bj', label: '北京' },
    { value: 'sh', label: '上海' },
    { value: 'gz', label: '广州' },
    { value: 'cd', label: '成都', disabled: true },
    { value: 'hz', label: '杭州' },
  ]}
  initSelected={['sz', 'bj']}
  multiple={true}
  type="plane"
  scrollable={true}
  rightIcon={<Icon type="check" />}
  onPress={(item, selected, e) => {
    console.log(`${item.label}: ${selected ? '选中' : '取消'}`)
  }}
  renderItem={(item, selected, index) => (
    <View style={[styles.customItem, selected && styles.activeItem]}>
      <Text>{item.label}</Text>
      {selected && <Icon type="check" />}
    </View>
  )}
/>

// 迁移后
import { Selector } from '@sfe/wand-rn'

const [value, setValue] = useState<string[]>(['sz', 'bj'])

<View style={{ marginVertical: 12 }}>
  <Selector
    options={[
      { value: 'sz', label: '深圳' },
      { value: 'bj', label: '北京' },
      { value: 'sh', label: '上海' },
      { value: 'gz', label: '广州' },
      { value: 'cd', label: '成都', disabled: true },
      { value: 'hz', label: '杭州' },
    ]}
    value={value}
    type="plane"
    scrollable={true}
    rightIcon={<Icon type="check" />}
    column={3}
    onPress={(item) => {
      const val = item.value as string
      if (value.includes(val)) {
        console.log(`${item.label}: 取消`)
        setValue(value.filter(v => v !== val))
      } else {
        console.log(`${item.label}: 选中`)
        setValue([...value, val])
      }
    }}
  />
</View>
```

## 关键点

### 1. 组件名变更
- 旧版本：`Select`
- 新版本：`Selector`
- 导入路径从 `@roo/roo-rn1` 变为 `@sfe/wand-rn`

### 2. 选项数据结构变更
- 旧版本：`items` 属性，`SelectItem` 中 `value` 和 `label` 为可选字段
- 新版本：`options` 属性，`SelectOption` 中 `value` 和 `label` 为必填字段
- **迁移建议**：检查所有选项数据，确保每项都包含 `value` 和 `label`

### 3. 从半受控到完全受控
- 旧版本：`initSelected` 设置初始值，组件内部管理选中状态变更
- 新版本：`value` 为受控属性，消费方必须在 `onPress` 中更新 `value` 才能改变选中状态
- `initSelected` 支持单值 `number | string` 或数组；`value` 仅支持数组 `Array<number> | Array<string>`
- **迁移建议**：新增 `useState` 管理选中值，并在 `onPress` 中实现 toggle 逻辑

### 4. multiple 属性移除
- 旧版本：`multiple` 属性控制单选/多选模式
- 新版本：移除该属性，消费方通过 `onPress` 中的逻辑自行决定单选或多选行为
- **单选实现**：`onPress` 中直接 `setValue([item.value])`
- **多选实现**：`onPress` 中判断是否已选中，做 toggle 操作

### 5. onPress 签名变更
- 旧版本：`(item: SelectItem, selected: boolean, e?) => void`，提供当前项是否被选中的状态
- 新版本：`(item: SelectOption, e?) => void`，移除 `selected` 参数
- **迁移建议**：通过对比 `value` 数组自行判断当前项的选中状态

### 6. renderItem 移除
- 旧版本：支持 `renderItem` 完全自定义每个选项的渲染
- 新版本：移除该属性，使用内置的 `leftIcon`、`rightIcon` 等属性定制外观
- 无法实现完全自定义渲染

### 7. type 属性值变更
- 旧版本：`'line' | 'plane'`，默认 `'line'`
- 新版本：`'plane' | 'light'`，默认 `'plane'`
- `'line'` 无对应值，建议使用 `'plane'` 替代
- `'plane'` 在两个版本中一致

### 8. 新增功能
- **leftIcon**：选项左侧图标
- **column**：网格布局列数控制
- **styles**：自定义样式对象

## 注意事项

1. **组件名变更**：`Select` 改为 `Selector`，需全局替换导入语句
2. **状态管理模式转变**：从半受控变为完全受控，必须新增 state 和 toggle 逻辑
3. **选项数据校验**：确保每个选项都包含必填的 `value` 和 `label` 字段
4. **initSelected 类型收窄**：单值形式 `number | string` 不再支持，必须转为数组形式
5. **multiple 逻辑外移**：单选/多选逻辑需要消费方在 `onPress` 中自行实现
6. **onPress 参数减少**：不再提供 `selected` 参数，需通过 `value.includes(item.value)` 自行判断
7. **renderItem 不可替代**：如依赖自定义渲染，需评估新组件内置能力是否满足需求
8. **style 属性移除**：使用外层 `View` 包裹来实现布局样式
9. **type='line' 无替代**：需视觉评估 `'plane'` 或 `'light'` 作为替代方案

## 迁移检查清单

- [ ] 将所有 `Select` 导入改为 `Selector`，来源改为 `@sfe/wand-rn`
- [ ] 将 `items` 属性改为 `options`
- [ ] 确保每个选项的 `value` 和 `label` 字段都有值
- [ ] 将 `initSelected` 替换为受控的 `value`（数组类型），新增对应 `useState`
- [ ] 在 `onPress` 中实现选中状态的 toggle 逻辑
- [ ] 移除 `multiple` 属性，在 `onPress` 中实现单选或多选行为
- [ ] 更新 `onPress` 回调签名，移除 `selected` 参数
- [ ] 移除 `renderItem` 属性，评估使用 `leftIcon`/`rightIcon` 替代
- [ ] 移除 `style` 属性，必要时用外层 `View` 包裹
- [ ] 检查 `type` 属性值，将 `'line'` 替换为 `'plane'` 或 `'light'`
- [ ] 验证所有选择器的交互场景（单选、多选、禁用项）
- [ ] 确认选中状态在 UI 上正确响应
