# Scrollpicker 滚动选择器

## 重要说明：组件类型根本不同

**roo-rn 的 Scrollpicker 和 wand-rn 的 Picker 是完全不同类型的组件，不能直接一对一替换。**

- **Scrollpicker（@roo/roo-rn1）**：滚轮式滚动选择器，类似 iOS 原生日期选择器的滚轮效果。用户通过上下滑动滚轮来选择选项，支持多列并排、级联联动。它是一个纯数据选择控件，不包含弹窗/下拉容器。
- **Picker（@sfe/wand-rn）**：下拉筛选器/过滤器组件，点击后弹出下拉面板展示子内容。它是一个容器型组件，内部放置任意筛选内容（如 CascaderMultiple），带有蒙层、动画等能力。

**wand-rn 中没有与 Scrollpicker 功能等价的滚轮选择器组件。** 迁移时必须根据实际业务场景选择合适的方案。

## 从何处迁移
- **源库**: `@roo/roo-rn1`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface ScrollpickerListItem {
  value: string | number
  label: string
  [propName: string]: any
  children?: ScrollpickerListItem[]
}

export interface ScrollpickerChangeInfo {
  /** 选中列号 */
  scrollIndex: number
  /** 选中行号 */
  targetItemIndex: number
  /** 返回选中的对象 */
  treeNode: Object
}

export interface ScrollpickerProps extends WithThemeStyles<ScrollpickerStyles> {
  /** 数据源，级联模式下：Array<{value, label, children}>，普通模式下：Array<Array<{value, label}>> */
  list?: ScrollpickerListItem[] | ScrollpickerListItem[][]
  /** 选中项的 value 值，格式是 [value1, value2, value3]，对应数据源的相应级层 value */
  value?: (string | number)[]
  /** 列布局的分区比例，注意和数据源长度保持一致 */
  proportion?: number[]  // 默认 [2, 1, 1]
  /** 选中项的偏移量（可见行数 = 2 * offsetCount + 1） */
  offsetCount?: number  // 默认 3
  /** 数据变化回调（滚动时触发） */
  onScrollChange?: (values: (string | number)[], info: ScrollpickerChangeInfo) => void
  /** 数据变化回调（选中项变化时触发） */
  onChange?: (values: (string | number)[], info: ScrollpickerChangeInfo) => void
  /** 获取初始值的回调 */
  onInit?: (values: (string | number)[], info: ScrollpickerChangeInfo) => void
  /** 自定义每一项的渲染 */
  renderItem?: (item: ScrollpickerListItem, index: number, selected: boolean) => JSX.Element
  /** 是否开启级联模式 */
  cascade?: boolean  // 默认 false
  /** 是否无限循环滚动（暂未支持） */
  infinite?: boolean  // 默认 false
  /** 内容区水平内边距 */
  contentPaddingHorizontal?: number  // 默认 0
  /** 自定义包裹组件最外层的样式 */
  style?: StyleProp<ViewStyle>
  /** 选项被选中的样式 */
  targetItemSelectedStyles?: TextStyle
  /** 自定义 ScrollView Props 属性 */
  scrollViewProps?: ScrollViewProps
  /** 是否显示选中行的横线 */
  hasIndicatorLine?: boolean  // 默认 true
}
```

**Scrollpicker 还提供实例方法：**
- `getSelectedValue()`：获取当前选中值

## 新组件 API

```tsx
export interface PickerProps {
  /** 按钮文字 */
  label?: string  // 默认 '请选择'
  /** 自定义图标 */
  icon?: JSX.Element
  /** 激活状态图标 */
  activeIcon?: JSX.Element
  /** 点击回调 */
  toggle?: ({ active, isSelected, offsetY }: {
    active: boolean
    isSelected: boolean
    offsetY: number
  }) => void
  /** 是否可关闭蒙层 */
  maskClosable?: boolean  // 默认 true
  /** 子元素（下拉面板内容） */
  children?: JSX.Element | JSX.Element[]
  /** 激活后的 label 文案（有值时常亮） */
  selectedLabel?: string
  /** 元素索引标识 */
  dataKey?: string
  /** 动画类型 */
  animationType?: 'slide-down' | 'slide-left'  // 默认 'slide-down'
  /** 文本模式 */
  textMode?: 'text' | 'button'  // 默认 'text'
  /** 弹窗内容区样式 */
  modalBodyStyle?: StyleProp<ViewStyle>
}

export interface PickerRefProps {
  close: () => void
  open: () => void
  active: boolean
  offsetY: number
}
```

**PickerGroup 组件（可选，用于多个 Picker 联动）：**

```tsx
export interface PickerGroupProps {
  style?: ViewStyle
  maskClosable?: boolean
  children?: JSX.Element | JSX.Element[]
  toggle?: ({ active, dataKey }: {
    active: boolean
    dataKey: string
  }) => void
}

export interface PickerGroupRefProps {
  close: (dataKey?: string) => void
  open: (dataKey: string) => void
  activeKey: string
}
```

## 迁移对照表

由于两个组件类型完全不同，不存在属性级别的一一对应关系。以下列出 Scrollpicker 的每个属性在迁移时的处理方式：

| 旧属性 (Scrollpicker) | 新组件处理方式 | 说明 |
|--------|--------|------|
| list | children 内部自行实现 | Picker 不接受数据源，需将选项列表作为 children 内容自行渲染 |
| value | 业务层自行管理 | Picker 不管理选中值，需在 children 内部组件中管理 |
| proportion | - | 无对应概念，Picker 不涉及多列比例 |
| offsetCount | - | 无对应概念，Picker 不是滚轮 |
| onScrollChange | - | 无对应概念，Picker 没有滚动选择行为 |
| onChange | children 内部回调 | 数据变化回调需在 children 内部组件中处理 |
| onInit | - | 无对应概念 |
| renderItem | children 内部自行实现 | Picker 的子内容完全自定义 |
| cascade | children 内部自行实现 | 如需级联可使用 CascaderMultiple 等组件作为 children |
| infinite | - | 无对应概念 |
| contentPaddingHorizontal | modalBodyStyle | 可通过 modalBodyStyle 设置面板内边距 |
| style | - | 需分别处理触发按钮和面板的样式 |
| targetItemSelectedStyles | - | 无对应概念 |
| scrollViewProps | - | 无对应概念 |
| hasIndicatorLine | - | 无对应概念 |
| - | label | 新增，设置触发按钮的文字 |
| - | icon / activeIcon | 新增，设置触发按钮的图标 |
| - | toggle | 新增，展开/收起回调 |
| - | maskClosable | 新增，是否可点击蒙层关闭 |
| - | selectedLabel | 新增，选中后显示的文案 |
| - | dataKey | 新增，用于 PickerGroup 联动标识 |
| - | animationType | 新增，弹出动画类型 |
| - | textMode | 新增，触发器显示模式 |

## 迁移示例

### 案例 1：基础单列选择 -> 下拉筛选

```tsx
// 迁移前 - 滚轮式单列选择
import { Scrollpicker, SlideModal } from '@roo/roo-rn1'

const [visible, setVisible] = useState(false)
const [value, setValue] = useState([100])

<SlideModal
  visible={visible}
  title="选项标题"
  leftLabel="取消"
  rightLabel="确定"
  leftCallback={() => setVisible(false)}
  rightCallback={() => setVisible(false)}
>
  <Scrollpicker
    value={value}
    proportion={[1]}
    list={[
      [
        { label: '选项一', value: 100 },
        { label: '选项二', value: 200 },
        { label: '选项三', value: 300 },
      ]
    ]}
    onChange={(val) => setValue(val)}
  />
</SlideModal>

// 迁移后 - 下拉筛选器（注意：交互形态完全不同）
import { Picker, PickerRefProps } from '@sfe/wand-rn'
import { View, Text, TouchableOpacity } from 'react-native'

const pickerRef = useRef<PickerRefProps>()
const [selectedValue, setSelectedValue] = useState(100)
const options = [
  { label: '选项一', value: 100 },
  { label: '选项二', value: 200 },
  { label: '选项三', value: 300 },
]

<Picker
  ref={pickerRef}
  label="请选择"
  selectedLabel={options.find(o => o.value === selectedValue)?.label}
>
  <View>
    {options.map(item => (
      <TouchableOpacity
        key={item.value}
        onPress={() => {
          setSelectedValue(item.value)
          pickerRef.current?.close()
        }}
      >
        <Text>{item.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
</Picker>
```

### 案例 2：级联选择 -> CascaderMultiple

```tsx
// 迁移前 - 滚轮式级联选择（省市县）
import { Scrollpicker, SlideModal } from '@roo/roo-rn1'

const [visible, setVisible] = useState(false)
const [value, setValue] = useState(['11', '1101', '110108'])

<SlideModal
  visible={visible}
  title="选择地区"
  leftLabel="取消"
  rightLabel="确定"
  leftCallback={() => setVisible(false)}
  rightCallback={() => setVisible(false)}
>
  <Scrollpicker
    cascade={true}
    value={value}
    list={cityData}
    onChange={(val) => setValue(val)}
  />
</SlideModal>

// 迁移后 - 使用 CascaderMultiple 作为 Picker 的 children
import { Picker, PickerRefProps, CascaderMultiple } from '@sfe/wand-rn'

const pickerRef = useRef<PickerRefProps>()
const [value, setValue] = useState({})

// 注意：CascaderMultiple 的数据格式可能与 Scrollpicker 不同，需要转换
const onConfirm = (val) => {
  setValue(val)
  pickerRef.current?.close()
}

<Picker
  ref={pickerRef}
  label="选择地区"
  selectedLabel={formatSelectedLabel(value)}
>
  <CascaderMultiple
    value={value}
    dataSource={convertedCityData}
    onConfirm={onConfirm}
  />
</Picker>
```

### 案例 3：多列独立选择

```tsx
// 迁移前 - 多列滚轮
import { Scrollpicker, SlideModal } from '@roo/roo-rn1'

const [visible, setVisible] = useState(false)

<SlideModal
  visible={visible}
  title="选择日期"
  leftLabel="取消"
  rightLabel="确定"
  leftCallback={() => setVisible(false)}
  rightCallback={() => setVisible(false)}
>
  <Scrollpicker
    value={[2024, 1, 1]}
    proportion={[2, 1, 1]}
    list={[yearList, monthList, dayList]}
    onChange={(val) => console.log(val)}
  />
</SlideModal>

// 迁移后 - wand-rn 的 Picker 不支持多列滚轮交互
// 方案 1：使用多个 Picker 分别选择（推荐，如果业务允许）
import { Picker, PickerGroup, PickerRefProps } from '@sfe/wand-rn'

const [year, setYear] = useState('2024')
const [month, setMonth] = useState('1')

<PickerGroup>
  <Picker label={`${year}年`} selectedLabel={`${year}年`} dataKey="year">
    <YearSelector value={year} onChange={setYear} />
  </Picker>
  <Picker label={`${month}月`} selectedLabel={`${month}月`} dataKey="month">
    <MonthSelector value={month} onChange={setMonth} />
  </Picker>
</PickerGroup>

// 方案 2：如果必须保留滚轮交互，需要自行实现或使用第三方滚轮组件
```

### 案例 4：带自定义渲染的选择

```tsx
// 迁移前 - 自定义渲染每一行
import { Scrollpicker } from '@roo/roo-rn1'

<Scrollpicker
  value={[1]}
  list={[[
    { label: '红色', value: 1, color: '#FF0000' },
    { label: '蓝色', value: 2, color: '#0000FF' },
  ]]}
  renderItem={(item, index, selected) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: 6 }} />
      <Text style={{ marginLeft: 8, fontWeight: selected ? 'bold' : 'normal' }}>
        {item.label}
      </Text>
    </View>
  )}
  onChange={(val) => console.log(val)}
/>

// 迁移后 - Picker 的 children 内容完全自由
import { Picker, PickerRefProps } from '@sfe/wand-rn'

const pickerRef = useRef<PickerRefProps>()
const [selected, setSelected] = useState(1)
const colors = [
  { label: '红色', value: 1, color: '#FF0000' },
  { label: '蓝色', value: 2, color: '#0000FF' },
]

<Picker
  ref={pickerRef}
  label="选择颜色"
  selectedLabel={colors.find(c => c.value === selected)?.label}
>
  <View>
    {colors.map(item => (
      <TouchableOpacity
        key={item.value}
        style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}
        onPress={() => {
          setSelected(item.value)
          pickerRef.current?.close()
        }}
      >
        <View style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: 6 }} />
        <Text style={{ marginLeft: 8, fontWeight: selected === item.value ? 'bold' : 'normal' }}>
          {item.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</Picker>
```

### 案例 5：使用 PickerGroup 实现多筛选联动

```tsx
// 迁移前 - 无对应场景（Scrollpicker 不具备筛选器功能）

// 迁移后 - PickerGroup 管理多个筛选器的互斥展开
import { Picker, PickerGroup, PickerGroupRefProps } from '@sfe/wand-rn'

const groupRef = useRef<PickerGroupRefProps>()

<PickerGroup
  ref={groupRef}
  maskClosable={true}
  toggle={({ active, dataKey }) => console.log(active, dataKey)}
>
  <Picker label="类型" dataKey="type" selectedLabel={selectedType}>
    <TypeFilterContent />
  </Picker>
  <Picker label="状态" dataKey="status" selectedLabel={selectedStatus}>
    <StatusFilterContent />
  </Picker>
</PickerGroup>
```

### 案例 6：SlideModal + Scrollpicker 的完整迁移

```tsx
// 迁移前 - 底部弹窗 + 滚轮选择
import { Scrollpicker, SlideModal } from '@roo/roo-rn1'

const [visible, setVisible] = useState(false)
const [value, setValue] = useState([100])

<TouchableOpacity onPress={() => setVisible(true)}>
  <Text>点击选择</Text>
</TouchableOpacity>

<SlideModal
  visible={visible}
  title="选项标题"
  leftLabel="取消"
  rightLabel="确定"
  leftCallback={() => setVisible(false)}
  rightCallback={() => {
    setVisible(false)
    handleConfirm(value)
  }}
>
  <Scrollpicker
    offsetCount={2}
    value={value}
    proportion={[1]}
    contentPaddingHorizontal={80}
    list={[
      [
        { label: '选项一', value: 100 },
        { label: '选项二', value: 200 },
        { label: '选项三', value: 300 },
      ]
    ]}
    onChange={(val) => setValue(val)}
  />
</SlideModal>

// 迁移后 - Picker 自带弹窗能力，不需要额外的 SlideModal
import { Picker, PickerRefProps } from '@sfe/wand-rn'

const pickerRef = useRef<PickerRefProps>()
const [selectedValue, setSelectedValue] = useState(100)
const options = [
  { label: '选项一', value: 100 },
  { label: '选项二', value: 200 },
  { label: '选项三', value: 300 },
]

<Picker
  ref={pickerRef}
  label="点击选择"
  selectedLabel={options.find(o => o.value === selectedValue)?.label}
>
  <View style={{ padding: 16 }}>
    {options.map(item => (
      <TouchableOpacity
        key={item.value}
        style={{ padding: 12 }}
        onPress={() => {
          setSelectedValue(item.value)
          pickerRef.current?.close()
        }}
      >
        <Text style={{
          color: selectedValue === item.value ? '#FF6A00' : '#222',
          fontWeight: selectedValue === item.value ? '500' : '400',
        }}>
          {item.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</Picker>
```

### 案例 7：Picker 的 ref 控制

```tsx
// 迁移前 - Scrollpicker 的 ref 用于获取选中值
import { Scrollpicker } from '@roo/roo-rn1'

const scrollpickerRef = useRef<Scrollpicker>()
// 通过 ref 获取当前值
const currentValue = scrollpickerRef.current?.getSelectedValue()

// 迁移后 - Picker 的 ref 用于控制展开/关闭
import { Picker, PickerRefProps } from '@sfe/wand-rn'

const pickerRef = useRef<PickerRefProps>()
// 通过 ref 控制展开/关闭
pickerRef.current?.open()
pickerRef.current?.close()
// 获取当前状态
const isActive = pickerRef.current?.active
```

### 案例 8：列比例与横线配置

```tsx
// 迁移前 - Scrollpicker 支持列比例和指示线
import { Scrollpicker } from '@roo/roo-rn1'

<Scrollpicker
  proportion={[2, 1, 1]}
  hasIndicatorLine={false}
  contentPaddingHorizontal={20}
  list={[yearList, monthList, dayList]}
  value={[2024, 1, 1]}
  onChange={(val) => console.log(val)}
/>

// 迁移后 - 这些属性在 Picker 中无对应概念
// proportion、hasIndicatorLine、contentPaddingHorizontal 直接移除
// 如果业务必须保持滚轮式交互，需自行实现滚轮组件
```

## 关键点

### 1. 组件本质差异
- **Scrollpicker** 是滚轮选择器：通过上下滑动选择值，类似 iOS 原生 UIPickerView
- **Picker** 是下拉筛选器：点击触发器后弹出面板，面板内放置自定义内容
- 两者的交互模式、视觉呈现、使用场景均不同

### 2. 数据管理方式差异
- **Scrollpicker** 内部管理数据：通过 `list` 传入数据源，通过 `value` 控制选中项，通过 `onChange` 回调
- **Picker** 不管理数据：它只是一个容器，数据的管理完全由 `children` 内部组件负责

### 3. 级联模式的处理
- **Scrollpicker** 内置级联支持：`cascade={true}` 配合树形 `list` 即可
- **Picker** 需要配合其他组件：如 `CascaderMultiple` 来实现级联选择

### 4. 弹窗容器差异
- **Scrollpicker** 需要搭配 `SlideModal` 使用才能实现弹窗选择
- **Picker** 自带弹窗（基于 Modal），不需要额外的弹窗组件

### 5. ref 用途差异
- **Scrollpicker** 的 ref：`getSelectedValue()` 获取当前选中值
- **Picker** 的 ref：`open()` / `close()` 控制展开收起，`active` 获取状态

### 6. PickerGroup 的联动能力
- **Scrollpicker** 的多列是在同一个组件内并排显示
- **Picker** 通过 `PickerGroup` 实现多个独立 Picker 的互斥联动展开

### 7. 不可迁移的功能
以下 Scrollpicker 特性在 wand-rn Picker 中无法实现：
- 滚轮式滑动选择交互
- 多列并排滚轮
- 列比例控制（proportion）
- 偏移量设置（offsetCount）
- 滚动过程中的渐变样式（选中项高亮、偏移项变灰）
- 选中行指示线（hasIndicatorLine）

## 注意事项

1. **交互形态完全不同**：迁移后用户操作方式从"滑动滚轮选择"变为"点击后在下拉面板中选择"，需要产品确认是否可以接受
2. **数据格式可能需要转换**：Scrollpicker 的 `list` 格式（`Array<Array<{value, label}>>`）与 Picker 的 children 组件所需的数据格式不同
3. **SlideModal 可以移除**：Picker 自带弹窗能力，不再需要 SlideModal 包裹
4. **onChange 回调位置变化**：从 Scrollpicker 的 `onChange` prop 迁移到 children 内部组件的回调
5. **onInit 回调无替代方案**：如需在初始化时获取值，使用 `useEffect` 配合初始状态实现
6. **onScrollChange 无替代方案**：Picker 没有滚动过程回调，只有最终选择结果
7. **Class 组件迁移**：Scrollpicker 是 Class 组件，Picker 是函数组件（forwardRef），迁移时注意 ref 用法变化
8. **如果业务强依赖滚轮交互**：wand-rn 没有滚轮选择器，需要保留 Scrollpicker 或引入第三方滚轮组件

## 迁移检查清单

- [ ] 确认业务是否可以接受从滚轮选择变为下拉筛选的交互变更
- [ ] 如果不可接受交互变更，考虑保留原组件或使用第三方滚轮库
- [ ] 移除 `SlideModal` 包裹，Picker 自带弹窗
- [ ] 将 `list` 数据源转换为 children 内部组件的数据格式
- [ ] 将 `onChange` 逻辑迁移到 children 内部组件的回调中
- [ ] 使用 `selectedLabel` 显示当前选中项文案
- [ ] 使用 `ref` 的 `close()` 方法在选中后关闭面板
- [ ] 如有级联需求，引入 `CascaderMultiple` 作为 Picker 的 children
- [ ] 如有多列需求，考虑使用 `PickerGroup` 管理多个独立 Picker
- [ ] 移除所有 Scrollpicker 特有属性：proportion、offsetCount、hasIndicatorLine、targetItemSelectedStyles、scrollViewProps、contentPaddingHorizontal
- [ ] 移除 `onInit` 回调，改用 `useEffect` 处理初始化逻辑
- [ ] 移除 `onScrollChange` 回调（无替代方案）
- [ ] 测试 Picker 的展开/关闭/蒙层点击行为
- [ ] 验证选中状态的视觉反馈是否符合设计要求
