# SlidePicker 滑动选择器

## 从何处迁移

- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface OptionItem {
    label: string
    value: any
}

interface SlidePickerProps {
    title?: string  // 默认 '请选择'
    isVisible: boolean
    options: Array<OptionItem[]>  // 多列数据
    selectedValues?: any[]
    onSelect?: (selectedValues: any[]) => void
    onClose?: () => void
    onInit?: (value: (string | number)[], info: ScrollpickerChangeInfo) => void
}
```

## 新组件 API

```tsx
interface PickerProps {
    label?: string  // 按钮文字，默认 '请选择'
    icon?: JSX.Element  // 自定义 icon
    activeIcon?: JSX.Element  // 激活状态 icon
    toggle?: ({ active, isSelected, offsetY }: {
        active: boolean
        isSelected: boolean
        offsetY: number
    }) => void
    maskClosable?: boolean  // 默认 true
    children?: JSX.Element | JSX.Element[]  // 弹框内容
    selectedLabel?: string  // 选中后的按钮文案
    dataKey?: string  // 元素索引（用于 PickerGroup）
    animationType?: 'slide-down' | 'slide-left'  // 默认 'slide-down'
    textMode?: 'text' | 'button'  // 默认 'text'
    modalBodyStyle?: StyleProp<ViewStyle>
}

interface PickerRefProps {
    close: () => void
    open: () => void
    active: boolean
    offsetY: number
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| `title` | `label` | 按钮文案，属性名改变 |
| `isVisible` | 不需要 | 由 Picker 内部管理状态，无需外部控制 |
| `options` | `children` 中的组件内容 | 从数组驱动改为组件嵌套，需要使用内容组件如 Scrollpicker |
| `selectedValues` | 由子组件管理 | 选中值由内容组件（如 Scrollpicker）维护 |
| `onSelect` | `children` 组件的确认回调 | 确认事件由内容组件处理 |
| `onClose` | 使用 `ref.close()` 或 `toggle` 回调 | 关闭事件由新组件处理 |
| `onInit` | 由内容组件处理 | 初始化事件由内容组件（Scrollpicker）处理 |
| 没有 ref 暴露 | `ref` 实例 | 新组件暴露 open/close 等实例方法 |
| 没有 selectedLabel 常亮 | `selectedLabel` | 支持选中后常亮显示 |
| 没有按钮模式 | `textMode` | 新增 'text' 和 'button' 两种模式 |
| 没有动画方向 | `animationType` | 支持 'slide-down' 和 'slide-left' |

## 迁移示例

### 案例 1：基础滑动选择器

```tsx
// 迁移前
<SlidePicker
    title='选择时间'
    isVisible={visible}
    options={options}
    selectedValues={selectedValues}
    onSelect={(values) => {
        setSelectedValues(values)
        setVisible(false)
    }}
    onClose={() => setVisible(false)}
/>

// 迁移后
import { Picker, PickerRefProps } from '@sfe/wand-rn'

const pickerRef = useRef<PickerRefProps>()

<Picker
    ref={pickerRef}
    label='选择时间'
    maskClosable>
    <Scrollpicker
        value={selectedValues}
        proportion={[1]}
        contentPaddingHorizontal={80}
        list={options}
        onChange={(value) => setSelectedValues(value)}
    />
</Picker>
```

### 案例 2：多列数据选择

```tsx
// 迁移前 - 使用多列数据数组
const optionsData = [
    [
        { label: '2024', value: 2024 },
        { label: '2025', value: 2025 }
    ],
    [
        { label: '01', value: '01' },
        { label: '02', value: '02' }
    ]
]

<SlidePicker
    title='选择年月'
    isVisible={visible}
    options={optionsData}
    onSelect={(values) => {
        console.log('选择年月:', values)
        setVisible(false)
    }}
/>

// 迁移后
<Picker
    ref={pickerRef}
    label='选择年月'>
    <Scrollpicker
        value={selectedValues}
        proportion={[1, 1]}  // 两列均等宽度
        list={optionsData}
        offsetCount={2}
        onChange={(value) => setSelectedValues(value)}
    />
</Picker>
```

### 案例 3：带初始化回调

```tsx
// 迁移前
<SlidePicker
    title='选择'
    isVisible={visible}
    options={options}
    onInit={(value, info) => {
        console.log('初始化:', value, info)
        setSelectedValues(value)
    }}
    onSelect={(values) => {
        console.log('确认选择:', values)
        setVisible(false)
    }}
/>

// 迁移后
<Picker
    ref={pickerRef}
    label='选择'
    toggle={({ active }) => {
        if (active) {
            console.log('弹框已打开')
        }
    }}>
    <Scrollpicker
        value={selectedValues}
        list={options}
        onInit={(value, info) => {
            console.log('初始化:', value, info)
            setSelectedValues(value)
        }}
        onChange={(value) => setSelectedValues(value)}
    />
</Picker>
```

### 案例 4：选中状态显示

```tsx
// 迁移前
const [selected, setSelected] = useState<any[]>([])

<SlidePicker
    title='选择'
    isVisible={visible}
    options={options}
    selectedValues={selected}
    onSelect={(values) => {
        setSelected(values)
        setVisible(false)
    }}
/>

// 迁移后 - 使用 selectedLabel 常亮显示
const [selected, setSelected] = useState<any[]>([])
const pickerRef = useRef<PickerRefProps>()

<Picker
    ref={pickerRef}
    label='选择'
    selectedLabel={selected.length > 0 ? selected.join(',') : undefined}>
    <Scrollpicker
        value={selected}
        list={options}
        onChange={(value) => setSelected(value)}
    />
</Picker>
```

### 案例 5：自定义按钮和动画

```tsx
// 迁移前 - 无此功能
<SlidePicker
    title='选择'
    isVisible={visible}
    options={options}
/>

// 迁移后 - 支持自定义 icon 和动画方向
import { Icon } from '@sfe/wand-rn'

<Picker
    ref={pickerRef}
    label='选择'
    icon={<Icon type='mini-down-arrow' size={12} color='#999' />}
    activeIcon={<Icon type='mini-top-arrow' size={12} color='#FF6A00' />}
    animationType='slide-left'  // 从右侧滑出
    textMode='button'>  // 使用按钮样式
    <Scrollpicker
        value={selectedValues}
        list={options}
        onChange={(value) => setSelectedValues(value)}
    />
</Picker>
```

### 案例 6：完整的滑动选择器迁移

```tsx
// 迁移前
import { SlidePicker } from '@mtfe/empower-mrn-components/shuguopai'

export class MyComponent extends PureComponent {
    state = {
        visible: false,
        selectedValues: []
    }

    render() {
        return (
            <SlidePicker
                title='选择配送方式'
                isVisible={this.state.visible}
                options={this.props.deliveryOptions}
                selectedValues={this.state.selectedValues}
                onSelect={(values) => {
                    this.setState({ 
                        selectedValues: values,
                        visible: false
                    })
                }}
                onClose={() => {
                    this.setState({ visible: false })
                }}
            />
        )
    }
}

// 迁移后
import { Picker, PickerRefProps } from '@sfe/wand-rn'
import { useState, useRef } from 'react'

export const MyComponent = ({ deliveryOptions }) => {
    const [selectedValues, setSelectedValues] = useState<any[]>([])
    const pickerRef = useRef<PickerRefProps>()

    return (
        <Picker
            ref={pickerRef}
            label='选择配送方式'
            selectedLabel={selectedValues.length > 0 ? selectedValues[0]?.label : undefined}>
            <Scrollpicker
                value={selectedValues}
                proportion={[1]}
                contentPaddingHorizontal={80}
                offsetCount={2}
                list={deliveryOptions}
                onChange={(value) => setSelectedValues(value)}
            />
        </Picker>
    )
}
```

## 关键迁移要点

### 1. 状态管理方式变化
- **旧版**: 通过 `isVisible` prop 和 `onClose` 回调由父组件完全控制
- **新版**: Picker 内部维护状态，通过 ref 的 `open()` 和 `close()` 方法控制

### 2. 数据驱动改为组件驱动
- **旧版**: 使用 `options` 数组和 `onSelect` 回调
- **新版**: 使用 `children` 嵌套组件（如 Scrollpicker），由子组件维护数据和事件

### 3. 内容组件集成
- **旧版**: SlidePicker 内置 Scrollpicker，配置较少
- **新版**: 需要显式使用 Scrollpicker 等内容组件，更灵活

### 4. 初始化和确认
- **旧版**: 通过 `onInit` 和 `onSelect` 回调处理
- **新版**: 由嵌套的组件（如 Scrollpicker）处理这些事件

### 5. 样式和表现
- **旧版**: 只有固定的标题显示
- **新版**: 支持 `selectedLabel` 常亮、不同的 `textMode` 和 `animationType`

## 使用场景映射

### 场景 1：简单单列选择
```tsx
// 之前使用 SlidePicker 处理
<SlidePicker
    title='城市'
    options={[cityData]}
/>

// 现在使用 Picker + Scrollpicker
<Picker label='城市'>
    <Scrollpicker list={[cityData]} />
</Picker>
```

### 场景 2：多列级联选择
```tsx
// 之前直接传多列数据
<SlidePicker
    options={[provinceList, cityList, districtList]}
/>

// 现在可以使用更强大的内容组件
<Picker label='地区'>
    <CascaderMultiple dataSource={areaData} />
</Picker>
```

### 场景 3：日期/时间选择
```tsx
// 之前用 SlidePicker 处理日期列表
<SlidePicker
    title='选择日期'
    options={[yearList, monthList, dayList]}
/>

// 现在可以使用专门的日期组件
<Picker label='选择日期'>
    <Calendar />
</Picker>
```

## 类型导入

```tsx
import { Picker, PickerRefProps } from '@sfe/wand-rn'
// Scrollpicker 需要从 @roo/roo-rn 导入
import { Scrollpicker } from '@roo/roo-rn'
```

## 注意事项

1. **Visible 状态管理**: 新版中不需要管理 `isVisible`，由 Picker 内部维护，通过 ref 调用 open/close
2. **选中值管理**: 需要在 Scrollpicker 的 `onChange` 中管理选中值，而非通过 `selectedValues` prop
3. **确认/取消按钮**: 新版弹框内容由子组件决定，Scrollpicker 本身不包含确认/取消按钮，需要在弹框内容中添加
4. **内容组件灵活性**: 可以使用任何 React 组件作为 Picker 的 children，不限于 Scrollpicker
5. **动画方向**: 新版支持 `slide-down` 和 `slide-left` 两种动画，默认为 `slide-down`
6. **按钮样式**: 通过 `icon` 和 `activeIcon` props 自定义按钮外观，或使用 `textMode='button'` 切换到按钮样式

## 迁移检查清单

- [ ] 将 `title` 改为 `label`
- [ ] 移除 `isVisible` prop，使用 ref 的 `open()`/`close()` 方法
- [ ] 将 `options` 数据结构改为组件嵌套
- [ ] 将 `onSelect` 改为在子组件中处理选中确认
- [ ] 将 `selectedValues` 改为在子组件中维护
- [ ] 添加 ref 用于控制打开/关闭
- [ ] 测试 Scrollpicker 的 `onChange` 和 `onInit` 回调
- [ ] 如需要选中状态显示，使用 `selectedLabel` prop
- [ ] 根据需要调整 `animationType` 和 `textMode`
