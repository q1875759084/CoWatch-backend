# Picker 下拉弹框

## 从何处迁移

- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
// 单个 Picker 项目配置
interface SinglePickerItem {
    /** 按钮名称 */
    label: string
    /** 内容，默认容器在 picker 按钮下方 */
    view?: ReactElement
    /** 点击按钮时的回调 */
    toggle?: (data: PickerToggleParams) => void
    /** 是否有选中内容 */
    selected?: boolean
    /** 包括容器的内容 */
    containerView?: (props: ContainerProps) => ReactElement
}

interface ContainerProps {
    offsetY: number
    onOpen: () => void
    onClose: () => void
}

interface PickerToggleParams {
    active: boolean
}

// Picker Props
interface PickerProps {
    /** 筛选子组件 */
    items: SinglePickerItem[]
    /** 自定义按钮 */
    renderView?: (active: boolean) => React.Component
    /** 按钮被点击后的颜色 */
    activeColor?: string
    /** 按钮被点击后的样式 */
    activeStyle?: StyleProp<TextStyle>
    /** 按钮默认的颜色 */
    defaultColor?: string
    /** 按钮默认的样式 */
    defaultStyle?: StyleProp<TextStyle>
    /** 蒙层透明度 */
    maskOpacity?: number
    /** 模态框样式 */
    modalProps?: ModalProps
    /** 面板样式 */
    contentStyle?: StyleProp<ViewStyle>
    /** 筛选按钮样式 */
    buttonStyle?: StyleProp<ViewStyle>
    /** 筛选按钮文本样式 */
    textStyle?: StyleProp<TextStyle>
    /** 筛选按钮容器样式 */
    buttonWrapStyle?: StyleProp<ViewStyle>
    onClose?: () => void
    onOpen?: () => void
}

// 实例方法
interface PickerRef {
    close(): void
    onClose(): void  // 别名
}
```

## 新组件 API

```tsx
// Picker Props
interface PickerProps {
    // 按钮文字
    label?: string
    // 自定义 icon
    icon?: JSX.Element
    // 激活状态 icon
    activeIcon?: JSX.Element
    // 点击回调
    toggle?: ({ active, isSelected, offsetY }: {
        active: boolean
        isSelected: boolean
        offsetY: number
    }) => void
    // 是否可关闭蒙层，默认 true
    maskClosable?: boolean
    // 子元素
    children?: JSX.Element | JSX.Element[]
    // 激活后的 label 文案显示，该字段有值时，则常亮
    selectedLabel?: string
    // 元素索引
    dataKey?: string
    animationType?: 'slide-down' | 'slide-left'
    textMode?: 'text' | 'button'
    modalBodyStyle?: StyleProp<ViewStyle>
}

// Picker Ref
interface PickerRefProps {
    close: () => void
    open: () => void
    active: boolean
    offsetY: number
}

// PickerGroup Props
interface PickerGroupProps {
    style?: ViewStyle
    maskClosable?: boolean
    children?: JSX.Element | JSX.Element[]
    toggle?: ({ active, dataKey }: {
        active: boolean
        dataKey: string
    }) => void
}

// PickerGroup Ref
interface PickerGroupRefProps {
    close: (dataKey?: string) => void
    open: (dataKey: string) => void
    activeKey: string
}
```

## 迁移对照表

| 旧特性 | 新特性 | 说明 |
|--------|--------|------|
| `items` 数组配置 | `children` 子组件 | 从数据驱动改为组件嵌套方式 |
| `SinglePickerItem.label` | `Picker label` | 按钮文案 |
| `SinglePickerItem.view` | `Picker children` | 弹框内容 |
| `SinglePickerItem.containerView` | `children` | 完全自定义容器 |
| `SinglePickerItem.selected` | `selectedLabel` | 选中状态的按钮文案 |
| `SinglePickerItem.toggle` | `toggle` 回调 | 状态切换回调 |
| `renderView` | 无（需要自定义 label 时使用 children） | 自定义按钮渲染方式 |
| `activeColor` / `defaultColor` | `icon` / `activeIcon` | 通过 icon 元素替换 |
| `activeStyle` / `defaultStyle` | 无（使用 icon 代替） | 样式方式改变 |
| `maskOpacity` | 无（Modal 默认处理） | 统一由 Modal 管理 |
| `modalProps` | 无 | 由组件内部处理 |
| `contentStyle` | `modalBodyStyle` | 弹框内容样式 |
| `buttonStyle` | 无 | 按钮样式由 icon 和 label 控制 |
| `textStyle` | 无 | 文本样式由主题系统控制 |
| `buttonWrapStyle` | `style`（在 PickerGroup 中） | 包装容器样式 |
| `onClose()` | `close()` | 实例方法改名 |
| 没有 Group 支持 | `PickerGroup` | 新增组件用于多 Picker 联动 |
| 没有 dataKey | `dataKey`（在 Group 中必填） | 用于 Group 中的 Picker 标识 |
| 没有 selectedLabel 常亮 | `selectedLabel` | 选中内容可常亮显示 |
| 没有动画类型 | `animationType` | 支持 slide-down 和 slide-left |
| 没有文本模式 | `textMode` | 支持 text 和 button 两种模式 |

## 迁移示例

### 案例 1：基础 Picker - 简单内容

```tsx
// 迁移前 - 数据驱动
<Picker
    items={[
        {
            label: '甜点饮品',
            view: <View><Text>内容区</Text></View>
        }
    ]}
    ref={(c) => { this.picker = c }}
/>

// 迁移后 - 组件嵌套
const pickerRef = useRef<PickerRefProps>()

<Picker
    ref={pickerRef}
    label='甜点饮品'>
    <View><Text>内容区</Text></View>
</Picker>
```

### 案例 2：多个筛选项 - 使用数组映射

```tsx
// 迁移前
const items = [
    { label: '甜点饮品', view: <View><Text>内容1</Text></View> },
    { label: '筛选', view: <View><Text>内容2</Text></View> },
    { label: '排序', view: <View><Text>内容3</Text></View> }
]

<Picker
    items={items}
    ref={(c) => { this.picker = c }}
    buttonWrapStyle={{ flexDirection: 'row' }}
/>

// 迁移后 - 使用 PickerGroup
<PickerGroup style={{ flexDirection: 'row' }}>
    <Picker dataKey='1' label='甜点饮品'>
        <View><Text>内容1</Text></View>
    </Picker>
    <Picker dataKey='2' label='筛选'>
        <View><Text>内容2</Text></View>
    </Picker>
    <Picker dataKey='3' label='排序'>
        <View><Text>内容3</Text></View>
    </Picker>
</PickerGroup>
```

### 案例 3：选中状态显示和回调

```tsx
// 迁移前
<Picker
    items={[
        {
            label: '库区',
            view: <Cascader />,
            selected: hasSelected,
            toggle: (data) => {
                console.log('选中状态:', data.active)
            }
        }
    ]}
    activeColor='#FF6A00'
    onClose={() => console.log('关闭')}
/>

// 迁移后
const [selectedValue, setSelectedValue] = useState<string>('')
const pickerRef = useRef<PickerRefProps>()

<Picker
    ref={pickerRef}
    label='库区'
    selectedLabel={selectedValue}  // 选中后常亮显示
    toggle={({ active, isSelected, offsetY }) => {
        console.log('选中状态:', isSelected, '激活:', active)
    }}>
    <Cascader
        onConfirm={(value) => {
            setSelectedValue(formatValue(value))
            pickerRef.current.close()
        }} />
</Picker>
```

### 案例 4：自定义容器

```tsx
// 迁移前 - 使用 containerView
<Picker
    items={[
        {
            label: '日期',
            containerView: (props) => {
                const { onClose, offsetY } = props
                return <CalendarDialog show={true} onRequestClose={onClose} />
            }
        }
    ]}
/>

// 迁移后 - 直接在 children 中使用组件
<Picker label='日期'>
    <CalendarDialog show={true} />
</Picker>
```

### 案例 5：自定义按钮样式 - 从颜色改为 icon

```tsx
// 迁移前 - 使用颜色和样式
<Picker
    items={[{ label: '筛选', view: <FilterContent /> }]}
    defaultColor='#666'
    activeColor='#FF6A00'
    defaultStyle={{ fontSize: 14 }}
    activeStyle={{ fontSize: 14, fontWeight: 'bold' }}
/>

// 迁移后 - 使用 icon 组件
import { Icon } from '@sfe/wand-rn'

<Picker
    label='筛选'
    icon={<Icon type='mini-down-arrow' size={12} color='#666' />}
    activeIcon={<Icon type='mini-top-arrow' size={12} color='#FF6A00' />}>
    <FilterContent />
</Picker>
```

### 案例 6：按钮文本模式

```tsx
// 迁移前 - 没有此功能
<Picker items={[{ label: '确认', view: <Content /> }]} />

// 迁移后 - 支持两种文本模式
// 方式 1: 文本模式（默认）
<Picker label='确认' textMode='text'>
    <Content />
</Picker>

// 方式 2: 按钮模式
<Picker label='确认' textMode='button'>
    <Content />
</Picker>
```

### 案例 7：滑出动画方向

```tsx
// 迁移前 - 只支持向下滑出
<Picker items={[{ label: '选择', view: <Content /> }]} />

// 迁移后 - 支持多种动画
// 向下滑出（默认）
<Picker label='选择' animationType='slide-down'>
    <Content />
</Picker>

// 向左滑出
<Picker label='选择' animationType='slide-left'>
    <Content />
</Picker>
```

### 案例 8：Group 控制多个 Picker

```tsx
// 迁移前 - 需要手动管理多个 Picker 的状态
const items1 = [{ label: '库区1', view: <View /> }]
const items2 = [{ label: '库区2', view: <View /> }]

<View>
    <Picker items={items1} ref={(c) => { this.picker1 = c }} />
    <Picker items={items2} ref={(c) => { this.picker2 = c }} />
</View>

// 迁移后 - 使用 PickerGroup 自动管理
const groupRef = useRef<PickerGroupRefProps>()

<PickerGroup ref={groupRef} toggle={({ active, dataKey }) => {
    console.log(`Picker ${dataKey} 状态: ${active}`)
}}>
    <Picker dataKey='1' label='库区1'>
        <CascaderMultiple />
    </Picker>
    <Picker dataKey='2' label='库区2'>
        <CascaderMultiple />
    </Picker>
</PickerGroup>

// 通过 ref 控制
groupRef.current.open('1')  // 打开 dataKey 为 1 的 Picker
groupRef.current.close('1')  // 关闭特定 Picker
groupRef.current.close()  // 关闭当前激活的 Picker
```

## 关键迁移要点

### 1. 架构变化
- **旧版**: 数据驱动的 items 数组模式
- **新版**: React 组件嵌套模式，更符合 React 最佳实践

### 2. 状态管理
- **旧版**: 通过 ref 调用 `onClose()` 和 `close()` 方法
- **新版**: 同时支持 `open()` 和 `close()` 两个方法，提供 `active` 状态读取

### 3. 按钮自定义
- **旧版**: 通过 `renderView`、`activeColor`、`defaultColor` 等
- **新版**: 使用标准的 `icon` 和 `activeIcon` JSX 元素

### 4. 多项管理
- **旧版**: 单个 Picker 管理多个项，需要手动控制状态
- **新版**: 引入 `PickerGroup` 组件，自动管理多个 Picker 的互斥状态

### 5. 样式方式
- **旧版**: `contentStyle`、`buttonStyle`、`textStyle` 分离
- **新版**: 主要使用 `modalBodyStyle` 控制内容样式，icon 和 label 通过组件属性控制外观

### 6. 新增功能
- 支持多种动画类型 (`slide-down` / `slide-left`)
- 支持按钮和文本两种显示模式
- `selectedLabel` 可在选中后常亮显示
- `dataKey` 用于在 Group 中标识唯一 Picker

### 7. 推荐做法
- 优先使用 `PickerGroup` 处理多个相关的 Picker
- 使用 `selectedLabel` 显示选中状态，而非依赖颜色变化
- 通过 `icon` 和 `activeIcon` 自定义外观，保持视觉一致性
- 充分利用 `children` 的灵活性，可以包含任何复杂组件

## 类型导入

```tsx
import { Picker, PickerRefProps, PickerGroup, PickerGroupRefProps } from '@sfe/wand-rn'
```

## 注意事项

1. **必填项变化**: 在 PickerGroup 中，Picker 的 `dataKey` 属性必填且需唯一
2. **回调参数变化**: 新版 `toggle` 回调包含 `active`、`isSelected` 和 `offsetY` 三个参数
3. **实例方法**: 新版同时支持 `open()` 和 `close()` 两个方法，旧版只有 `close()`
4. **内容约束**: 新版 `children` 不支持数组，需包裹在 Fragment 中时请使用单一子组件
5. **主题系统**: 新版使用 wand-rn 的主题系统，颜色和样式应通过 icon 和 theme token 控制
