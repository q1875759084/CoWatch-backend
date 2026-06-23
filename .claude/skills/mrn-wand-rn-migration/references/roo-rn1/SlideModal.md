# SlideModal 滑动弹窗

## 从何处迁移
- **源库**: `@roo/roo-rn1`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface SlideModalContainerProps extends WithThemeStyles<SlideModalStyles> {
  /** 是否使用原生动画驱动 */
  useNativeDriver?: boolean  // 默认 false
  /** 动画持续时间（毫秒） */
  duration?: number  // 默认 200
  /** 动画缓动函数 */
  easing?: (value: number) => number
  /** 自定义头部 */
  header?: JSX.Element
  /** 头部样式 */
  headerStyles?: SlideModalHeaderStyles
  /** 标题 */
  title?: string | JSX.Element
  /** 右侧按钮文案 */
  rightLabel?: string | JSX.Element
  /** 左侧按钮文案 */
  leftLabel?: string | JSX.Element
  /** 左侧按钮回调 */
  leftCallback?: (data?: ModalState) => void
  /** 右侧按钮回调 */
  rightCallback?: (data?: ModalState) => void
  /** 滑入方向 */
  direction?: 'up' | 'down' | 'left' | 'right'  // 默认 'up'
  /** X 轴偏移量 */
  offsetX?: number  // 默认 0
  /** Y 轴偏移量 */
  offsetY?: number  // 默认 0
  /** 包裹层样式 */
  wrapperStyles?: StyleProp<ViewStyle>
  /** 透传给 Modal 的属性 */
  modalProps?: ModalProps
}

interface SlideModalProps extends SlideModalContainerProps {
  /** 是否可见 */
  visible?: boolean  // 默认 false
}

// 静态方法：SlideModal.open(options) 返回 TopViewManager
```

## 新组件 API

```tsx
interface SlideSelectOption<TValue> {
  /** 选项文案 */
  label: string | React.ReactNode
  /** 选项副文案 */
  subLabel?: string
  /** 选项值 */
  value: TValue
  /** 是否可用 */
  enabled?: boolean
}

interface SlideSelectProps<TValue> {
  /** 是否可见 */
  visible?: boolean
  /** 标题（必填） */
  title: string
  /** 当前选中值（单选传单值，多选传数组） */
  value?: TValue | TValue[]
  /** 是否多选 */
  multiple?: boolean  // 默认 false
  /** 是否加载中 */
  loading?: boolean
  /** 选项列表（必填） */
  options: SlideSelectOption<TValue>[]
  /** 是否可搜索 */
  searchable?: boolean
  /** 搜索框占位文字 */
  placeholder?: string
  /** 搜索关键词 */
  keywords?: string
  /** 空状态展示内容 */
  empty?: string | React.ReactNode
  /** 测试 ID */
  testID?: string
  /** 选中回调（单选时触发） */
  onSelect?: (value: TValue, index: number) => void
  /** 值变更回调（多选时触发） */
  onChange?: (values: TValue[]) => void
  /** 确认回调（多选时触发） */
  onConfirm?: (values: TValue[]) => void
  /** 重置回调（多选时触发） */
  onReset?: (values: TValue[]) => void
  /** 关闭回调 */
  onClose?: () => void
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| visible | visible | 保持一致 |
| title | title | 新组件中为必填项，且仅支持 string 类型 |
| leftLabel | - | 移除，新组件内置底部操作区（多选时有重置/确认按钮） |
| rightLabel | - | 移除，同上 |
| leftCallback | onReset | 左侧"重置"语义可通过 onReset 实现（仅多选） |
| rightCallback | onConfirm | 右侧"确认"语义可通过 onConfirm 实现（仅多选） |
| header | - | 移除，新组件使用内置标题栏 |
| headerStyles | - | 移除 |
| direction | - | 移除，新组件固定从底部滑出 |
| offsetX | - | 移除 |
| offsetY | - | 移除 |
| useNativeDriver | - | 移除，动画由新组件内部控制 |
| duration | - | 移除 |
| easing | - | 移除 |
| wrapperStyles | - | 移除 |
| modalProps | - | 移除 |
| - | options | 新增，必填，数据驱动的选项列表 |
| - | value | 新增，当前选中值 |
| - | multiple | 新增，是否多选模式 |
| - | loading | 新增，加载状态 |
| - | searchable | 新增，是否支持搜索 |
| - | placeholder | 新增，搜索框占位文字 |
| - | keywords | 新增，搜索关键词 |
| - | empty | 新增，空状态展示 |
| - | onSelect | 新增，单选时的选中回调 |
| - | onChange | 新增，多选时的值变更回调 |
| - | onClose | 新增，关闭回调 |

## 迁移示例

### 案例 1：作为选择列表使用（直接迁移到 SlideSheet）

```tsx
// 迁移前 - 使用 SlideModal 包裹自定义选择列表
import { SlideModal } from '@roo/roo-rn1'

const [visible, setVisible] = useState(false)
const [selected, setSelected] = useState(null)

const options = ['选项一', '选项二', '选项三']

<SlideModal
  visible={visible}
  title="请选择"
  rightLabel="确认"
  rightCallback={() => setVisible(false)}
>
  {options.map((item, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => setSelected(item)}
      style={selected === item ? styles.selected : styles.item}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  ))}
</SlideModal>

// 迁移后 - 使用 SlideSheet 数据驱动
import { SlideSheet } from '@sfe/wand-rn'

const [visible, setVisible] = useState(false)
const [selected, setSelected] = useState(null)

<SlideSheet
  visible={visible}
  title="请选择"
  value={selected}
  options={[
    { label: '选项一', value: '选项一' },
    { label: '选项二', value: '选项二' },
    { label: '选项三', value: '选项三' },
  ]}
  onSelect={(value) => {
    setSelected(value)
    setVisible(false)
  }}
  onClose={() => setVisible(false)}
/>
```

### 案例 2：多选场景

```tsx
// 迁移前 - 使用 SlideModal 包裹自定义多选列表
import { SlideModal } from '@roo/roo-rn1'

const [visible, setVisible] = useState(false)
const [selectedItems, setSelectedItems] = useState([])

<SlideModal
  visible={visible}
  title="多选"
  leftLabel="重置"
  leftCallback={() => setSelectedItems([])}
  rightLabel="确认"
  rightCallback={() => setVisible(false)}
>
  {items.map((item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => {
        if (selectedItems.includes(item.id)) {
          setSelectedItems(selectedItems.filter(id => id !== item.id))
        } else {
          setSelectedItems([...selectedItems, item.id])
        }
      }}
    >
      <Checkbox checked={selectedItems.includes(item.id)} />
      <Text>{item.name}</Text>
    </TouchableOpacity>
  ))}
</SlideModal>

// 迁移后 - 使用 SlideSheet 多选模式
import { SlideSheet } from '@sfe/wand-rn'

const [visible, setVisible] = useState(false)
const [selectedItems, setSelectedItems] = useState([])

<SlideSheet
  visible={visible}
  title="多选"
  multiple
  value={selectedItems}
  options={items.map(item => ({
    label: item.name,
    value: item.id,
  }))}
  onChange={(values) => setSelectedItems(values)}
  onConfirm={(values) => {
    setSelectedItems(values)
    setVisible(false)
  }}
  onReset={() => setSelectedItems([])}
  onClose={() => setVisible(false)}
/>
```

### 案例 3：带搜索的选择列表

```tsx
// 迁移前 - 使用 SlideModal 包裹搜索框和列表
import { SlideModal } from '@roo/roo-rn1'

const [visible, setVisible] = useState(false)
const [keyword, setKeyword] = useState('')
const [selected, setSelected] = useState(null)

const filteredList = cityList.filter(c => c.name.includes(keyword))

<SlideModal visible={visible} title="选择城市">
  <TextInput
    value={keyword}
    onChangeText={setKeyword}
    placeholder="搜索城市"
  />
  <FlatList
    data={filteredList}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => {
        setSelected(item.code)
        setVisible(false)
      }}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    )}
  />
</SlideModal>

// 迁移后 - SlideSheet 内置搜索
import { SlideSheet } from '@sfe/wand-rn'

const [visible, setVisible] = useState(false)
const [selected, setSelected] = useState(null)

<SlideSheet
  visible={visible}
  title="选择城市"
  searchable
  placeholder="搜索城市"
  value={selected}
  options={cityList.map(city => ({
    label: city.name,
    value: city.code,
  }))}
  onSelect={(value) => {
    setSelected(value)
    setVisible(false)
  }}
  onClose={() => setVisible(false)}
/>
```

### 案例 4：静态方法 SlideModal.open 迁移

```tsx
// 迁移前 - 使用命令式 API
import { SlideModal } from '@roo/roo-rn1'

const handleOpenPicker = () => {
  SlideModal.open({
    title: '选择类型',
    rightLabel: '确认',
    rightCallback: (data) => {
      console.log('选中:', data)
    },
    children: <CustomPickerContent />,
  })
}

<Button onPress={handleOpenPicker}>打开选择器</Button>

// 迁移后 - 使用声明式 API（SlideSheet 无命令式调用）
import { SlideSheet } from '@sfe/wand-rn'

const [visible, setVisible] = useState(false)
const [selected, setSelected] = useState(null)

<Button onPress={() => setVisible(true)}>打开选择器</Button>

<SlideSheet
  visible={visible}
  title="选择类型"
  value={selected}
  options={typeOptions}
  onSelect={(value) => {
    setSelected(value)
    setVisible(false)
  }}
  onClose={() => setVisible(false)}
/>
```

### 案例 5：带副标签和禁用项的选择列表

```tsx
// 迁移前 - 自行实现副标签和禁用逻辑
import { SlideModal } from '@roo/roo-rn1'

<SlideModal visible={visible} title="选择套餐">
  {plans.map((plan) => (
    <TouchableOpacity
      key={plan.id}
      disabled={!plan.available}
      onPress={() => handleSelect(plan.id)}
      style={!plan.available ? styles.disabled : styles.item}
    >
      <Text>{plan.name}</Text>
      <Text style={styles.subText}>{plan.desc}</Text>
    </TouchableOpacity>
  ))}
</SlideModal>

// 迁移后 - 使用 SlideSheet 的 subLabel 和 enabled 属性
import { SlideSheet } from '@sfe/wand-rn'

<SlideSheet
  visible={visible}
  title="选择套餐"
  value={selectedPlan}
  options={plans.map(plan => ({
    label: plan.name,
    subLabel: plan.desc,
    value: plan.id,
    enabled: plan.available,
  }))}
  onSelect={(value) => {
    setSelectedPlan(value)
    setVisible(false)
  }}
  onClose={() => setVisible(false)}
/>
```

### 案例 6：加载状态和空状态

```tsx
// 迁移前 - 手动处理加载和空状态
import { SlideModal } from '@roo/roo-rn1'

<SlideModal visible={visible} title="选择门店">
  {loading ? (
    <ActivityIndicator />
  ) : stores.length === 0 ? (
    <Text>暂无门店数据</Text>
  ) : (
    stores.map((store) => (
      <TouchableOpacity key={store.id} onPress={() => handleSelect(store.id)}>
        <Text>{store.name}</Text>
      </TouchableOpacity>
    ))
  )}
</SlideModal>

// 迁移后 - 使用内置的 loading 和 empty 属性
import { SlideSheet } from '@sfe/wand-rn'

<SlideSheet
  visible={visible}
  title="选择门店"
  loading={loading}
  empty="暂无门店数据"
  value={selectedStore}
  options={stores.map(store => ({
    label: store.name,
    value: store.id,
  }))}
  onSelect={(value) => {
    setSelectedStore(value)
    setVisible(false)
  }}
  onClose={() => setVisible(false)}
/>
```

### 案例 7：作为通用弹窗容器使用（应迁移到 BottomModal）

```tsx
// 迁移前 - SlideModal 作为通用弹窗容器承载自定义内容
import { SlideModal } from '@roo/roo-rn1'

<SlideModal
  visible={visible}
  title="编辑信息"
  direction="up"
  leftLabel="取消"
  leftCallback={() => setVisible(false)}
  rightLabel="保存"
  rightCallback={() => handleSave()}
>
  <View style={styles.form}>
    <TextInput placeholder="姓名" value={name} onChangeText={setName} />
    <TextInput placeholder="电话" value={phone} onChangeText={setPhone} />
    <DatePicker value={date} onChange={setDate} />
  </View>
</SlideModal>

// 迁移后 - 通用弹窗容器应使用 BottomModal（而非 SlideSheet）
// 注意：SlideSheet 是数据驱动的选择组件，不能承载任意自定义内容
import { BottomModal } from '@sfe/wand-rn'

<BottomModal
  visible={visible}
  title="编辑信息"
  onClose={() => setVisible(false)}
>
  <View style={styles.form}>
    <TextInput placeholder="姓名" value={name} onChangeText={setName} />
    <TextInput placeholder="电话" value={phone} onChangeText={setPhone} />
    <DatePicker value={date} onChange={setDate} />
  </View>
</BottomModal>
```

### 案例 8：非底部方向弹窗（应迁移到 BottomModal 并调整布局）

```tsx
// 迁移前 - 从右侧滑入的弹窗
import { SlideModal } from '@roo/roo-rn1'

<SlideModal
  visible={visible}
  title="筛选"
  direction="right"
  wrapperStyles={{ width: '80%' }}
>
  <FilterContent onApply={() => setVisible(false)} />
</SlideModal>

// 迁移后 - wand-rn 无右侧滑入弹窗，如果内容是选择列表，使用 SlideSheet
// 如果内容是自定义筛选面板，使用 BottomModal 并将布局调整为底部弹出
import { BottomModal } from '@sfe/wand-rn'

<BottomModal
  visible={visible}
  title="筛选"
  onClose={() => setVisible(false)}
>
  <FilterContent onApply={() => setVisible(false)} />
</BottomModal>
```

### 案例 9：自定义动画配置

```tsx
// 迁移前 - 自定义动画参数
import { SlideModal } from '@roo/roo-rn1'
import { Easing } from 'react-native'

<SlideModal
  visible={visible}
  title="详情"
  useNativeDriver={true}
  duration={300}
  easing={Easing.bezier(0.25, 0.1, 0.25, 1)}
  direction="up"
>
  <DetailContent />
</SlideModal>

// 迁移后 - 动画参数由新组件内部控制，无法自定义
// 如果用作选择列表
import { SlideSheet } from '@sfe/wand-rn'

<SlideSheet
  visible={visible}
  title="详情"
  options={detailOptions}
  onSelect={(value) => handleSelect(value)}
  onClose={() => setVisible(false)}
/>

// 如果用作通用内容容器
import { BottomModal } from '@sfe/wand-rn'

<BottomModal
  visible={visible}
  title="详情"
  onClose={() => setVisible(false)}
>
  <DetailContent />
</BottomModal>
```

### 案例 10：完整复杂场景

```tsx
// 迁移前 - 带搜索、多选、自定义头部的完整场景
import { SlideModal } from '@roo/roo-rn1'

const [visible, setVisible] = useState(false)
const [keyword, setKeyword] = useState('')
const [selectedTags, setSelectedTags] = useState<string[]>([])

const filteredTags = allTags.filter(t => t.name.includes(keyword))

<SlideModal
  visible={visible}
  title="选择标签"
  header={
    <View style={styles.header}>
      <Text style={styles.title}>选择标签</Text>
      <Text style={styles.count}>已选 {selectedTags.length} 个</Text>
    </View>
  }
  leftLabel="重置"
  leftCallback={() => setSelectedTags([])}
  rightLabel={`确认(${selectedTags.length})`}
  rightCallback={() => {
    onTagsChange(selectedTags)
    setVisible(false)
  }}
  direction="up"
  useNativeDriver
  duration={250}
>
  <TextInput
    placeholder="搜索标签"
    value={keyword}
    onChangeText={setKeyword}
  />
  <ScrollView>
    {filteredTags.map(tag => (
      <TouchableOpacity
        key={tag.id}
        onPress={() => {
          if (selectedTags.includes(tag.id)) {
            setSelectedTags(selectedTags.filter(id => id !== tag.id))
          } else {
            setSelectedTags([...selectedTags, tag.id])
          }
        }}
      >
        <Checkbox checked={selectedTags.includes(tag.id)} />
        <Text>{tag.name}</Text>
        <Text style={styles.subText}>{tag.category}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</SlideModal>

// 迁移后 - SlideSheet 内置搜索 + 多选 + 副标签
import { SlideSheet } from '@sfe/wand-rn'

const [visible, setVisible] = useState(false)
const [selectedTags, setSelectedTags] = useState<string[]>([])

<SlideSheet
  visible={visible}
  title="选择标签"
  multiple
  searchable
  placeholder="搜索标签"
  value={selectedTags}
  options={allTags.map(tag => ({
    label: tag.name,
    subLabel: tag.category,
    value: tag.id,
  }))}
  onChange={(values) => setSelectedTags(values)}
  onConfirm={(values) => {
    onTagsChange(values)
    setVisible(false)
  }}
  onReset={() => setSelectedTags([])}
  onClose={() => setVisible(false)}
/>
```

## 关键点

### 1. 组件定位根本性变化
- 旧组件 SlideModal 是一个**通用滑动弹窗容器**，可承载任意子内容
- 新组件 SlideSheet 是一个**专用选择面板**，内置单选/多选列表
- 如果原有用法是承载**任意自定义内容**，应迁移到 `BottomModal` 而非 `SlideSheet`
- 如果原有用法是实现**选择列表**，`SlideSheet` 是正确的目标组件

### 2. 从自由布局到数据驱动
- 旧组件通过 `children` 接收任意 JSX 内容
- 新组件通过 `options` 数组驱动列表渲染，不接受自定义 children
- 每个选项由 `label`、`subLabel`、`value`、`enabled` 描述

### 3. 滑动方向移除
- 旧组件支持四个方向：up、down、left、right
- 新组件固定从底部滑出，无方向配置
- 如需侧边滑入效果，wand-rn 中暂无直接替代，需自行实现或使用 BottomModal 替代

### 4. 动画配置移除
- 旧组件支持：useNativeDriver、duration、easing
- 新组件的动画完全内置，不暴露动画相关属性
- 无需手动配置动画参数

### 5. 命令式 API 移除
- 旧组件支持 `SlideModal.open(options)` 命令式调用
- 新组件仅支持声明式（通过 `visible` 属性控制显隐）
- 迁移时需引入 state 管理显隐状态

### 6. 头部区域变更
- 旧组件支持完全自定义 header、leftLabel、rightLabel 及回调
- 新组件标题栏内置，仅支持 `title` 字符串
- 多选模式下内置重置/确认按钮，通过 `onReset`/`onConfirm` 回调

### 7. 内置搜索能力
- 旧组件需手动实现搜索功能（TextInput + 过滤逻辑）
- 新组件通过 `searchable` 启用内置搜索，支持 `placeholder` 和 `keywords` 配置

### 8. 选择模式支持
- 新组件内置单选（默认）和多选（`multiple`）模式
- 单选通过 `onSelect` 回调，多选通过 `onChange`/`onConfirm`/`onReset` 回调
- 内置 Radio/Checkbox 样式，无需手动实现选中状态 UI

## 注意事项

1. **判断迁移目标**：迁移前必须确认原有 SlideModal 的用途。作为选择列表用则迁移到 SlideSheet；作为通用弹窗容器用则迁移到 BottomModal
2. **title 必填且仅支持字符串**：旧组件 title 支持 string | JSX.Element 且可选，新组件 title 为必填 string
3. **命令式调用重构**：使用 `SlideModal.open()` 的代码需重构为声明式 visible + state 模式
4. **方向不可配置**：使用 direction 为 left/right/down 的场景需重新设计交互方式
5. **自定义内容不可用**：SlideSheet 不接受 children，所有自定义选择列表内容需转换为 `options` 数组格式
6. **动画无法定制**：依赖自定义 duration/easing 的场景需接受新组件的内置动画
7. **偏移量移除**：使用 offsetX/offsetY 的场景无法在新组件中实现
8. **modalProps 透传移除**：直接传递给 RN Modal 的属性不再支持

## 迁移检查清单

- [ ] 确认每个 SlideModal 实例的用途（选择列表 vs 通用容器）
- [ ] 选择列表用途：迁移到 SlideSheet，将子内容改为 `options` 数组
- [ ] 通用容器用途：迁移到 BottomModal，保留 children 内容
- [ ] 将 `SlideModal.open()` 命令式调用重构为 visible + state 声明式模式
- [ ] 移除 direction 属性，确认底部滑出方式可接受
- [ ] 移除 useNativeDriver/duration/easing 等动画配置
- [ ] 移除 offsetX/offsetY 偏移量属性
- [ ] 将 title 从 JSX.Element 转换为纯字符串（如适用）
- [ ] 将 leftLabel/rightLabel 逻辑迁移到 onReset/onConfirm（多选场景）
- [ ] 移除 header/headerStyles 自定义头部
- [ ] 移除 wrapperStyles/modalProps 属性
- [ ] 添加 `onClose` 回调处理关闭逻辑
- [ ] 如有搜索功能，使用 `searchable` 替代手动实现
- [ ] 测试单选和多选场景的交互行为
- [ ] 验证加载状态和空状态的展示效果
