# SlideSheet 选择弹窗

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface SlideSheetProps extends ViewProps {
    show: boolean                    // 是否显示
    onBlankPressed: () => void      // 点击空白区域/关闭时的回调
    extraData?: any                 // 额外数据，用于触发更新
    children?: React.ReactNode      // 子元素内容
    style?: StyleProp<ViewStyle>    // 样式
}
```

**旧组件特点**:
- 基础容器组件，只提供底部弹出动画和遮罩
- 需要自行实现内容区域（选项列表、搜索框等）
- 固定最大高度为屏幕高度的 80%
- 使用 Class Component 实现
- 动画时长固定 400ms

## 新组件 API

```tsx
interface SlideSelectProps<TValue> {
    visible?: boolean                                      // 是否显示，默认 false
    title: string                                          // 标题（必填）
    value?: TValue | TValue[]                             // 选中值，单选为单值，多选为数组
    multiple?: boolean                                     // 是否多选模式，默认 false
    loading?: boolean                                      // 是否加载中，默认 false
    options: SlideSelectOption<TValue>[]                  // 选项列表（必填）
    searchable?: boolean                                   // 是否显示搜索框
    placeholder?: string                                   // 搜索框占位符，默认 "请输入搜索信息"
    keywords?: string                                      // 搜索框初始关键词
    empty?: string | React.ReactNode                      // 空状态自定义内容
    testID?: string                                        // 测试 ID
    onSelect?: (value: TValue, index: number) => void     // 单选时选中回调
    onChange?: (values: TValue[]) => void                 // 多选时选择变化回调
    onConfirm?: (values: TValue[]) => void               // 多选时确认回调
    onReset?: (values: TValue[]) => void                 // 多选时重置回调
    onClose?: () => void                                  // 关闭回调
}

interface SlideSelectOption<TValue> {
    label: string | React.ReactNode  // 选项文本
    subLabel?: string                // 副标题
    value: TValue                    // 选项值
    enabled?: boolean                // 是否可用，默认 true
}
```

**新组件特点**:
- 功能完整的选择弹窗组件
- 内置单选/多选模式
- 内置搜索功能（支持高亮）
- 内置加载状态
- 基于 BottomModal 实现
- 使用 Function Component + Hooks

## 核心差异

| 维度 | 旧组件 | 新组件 |
|------|--------|--------|
| **定位** | 容器组件（需自行实现内容） | 功能组件（完整选择功能） |
| **内容** | children 自定义 | options 数据驱动 |
| **标题** | 需在 children 中自行实现 | title 属性内置 |
| **选择逻辑** | 需自行实现单选/多选逻辑 | 内置 multiple 模式切换 |
| **搜索** | 需自行实现 | searchable 属性开启 |
| **底部按钮** | 需在 children 中实现 | 多选模式自动显示"重置"和"确定" |
| **关闭回调** | onBlankPressed | onClose |
| **显示控制** | show | visible |

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| show | visible | 显示/隐藏控制 |
| onBlankPressed | onClose | 关闭回调 |
| extraData | - | 新组件使用 React Hooks 自动管理更新 |
| children | options + title | 从 JSX 内容迁移到数据配置 |
| style | - | 新组件样式由主题系统控制 |

## 迁移示例

### 案例 1：简单底部弹窗（仅容器）

```tsx
// 迁移前 - 旧组件作为容器使用
import { SlideSheet } from '@mtfe/empower-trantor-mrn'

<SlideSheet 
  show={visible} 
  onBlankPressed={handleClose}>
  <View style={styles.header}>
    <Text>选择城市</Text>
  </View>
  <View style={styles.content}>
    <TouchableOpacity onPress={() => handleSelect('北京')}>
      <Text>北京</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleSelect('上海')}>
      <Text>上海</Text>
    </TouchableOpacity>
  </View>
</SlideSheet>

// 迁移后 - 使用 BottomModal 作为容器
import { BottomModal } from '@sfe/wand-rn'

<BottomModal
  visible={visible}
  header={{ title: '选择城市' }}
  onClose={handleClose}>
  <View style={styles.content}>
    <TouchableOpacity onPress={() => handleSelect('北京')}>
      <Text>北京</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleSelect('上海')}>
      <Text>上海</Text>
    </TouchableOpacity>
  </View>
</BottomModal>
```

### 案例 2：单选列表

```tsx
// 迁移前 - 自行实现单选逻辑
import { SlideSheet } from '@mtfe/empower-trantor-mrn'

const [visible, setVisible] = useState(false)
const [selected, setSelected] = useState('')

const cities = ['北京', '上海', '广州', '深圳']

<SlideSheet 
  show={visible} 
  onBlankPressed={() => setVisible(false)}>
  <View style={styles.header}>
    <Text>选择城市</Text>
  </View>
  <ScrollView>
    {cities.map((city) => (
      <TouchableOpacity
        key={city}
        onPress={() => {
          setSelected(city)
          setVisible(false)
        }}>
        <View style={styles.item}>
          <Text>{city}</Text>
          {selected === city && <Icon name="check" />}
        </View>
      </TouchableOpacity>
    ))}
  </ScrollView>
</SlideSheet>

// 迁移后 - 使用 SlideSheet 的单选模式
import { SlideSheet } from '@sfe/wand-rn'

const [visible, setVisible] = useState(false)
const [selected, setSelected] = useState('')

const options = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
]

<SlideSheet
  visible={visible}
  title="选择城市"
  value={selected}
  options={options}
  onSelect={(value) => {
    setSelected(value)
  }}
  onClose={() => setVisible(false)} />
```

### 案例 3：多选列表

```tsx
// 迁移前 - 自行实现多选逻辑
import { SlideSheet } from '@mtfe/empower-trantor-mrn'

const [visible, setVisible] = useState(false)
const [selected, setSelected] = useState<string[]>([])

const toggleItem = (item: string) => {
  setSelected(prev => 
    prev.includes(item) 
      ? prev.filter(i => i !== item)
      : [...prev, item]
  )
}

<SlideSheet 
  show={visible} 
  onBlankPressed={() => setVisible(false)}>
  <View style={styles.header}>
    <Text>选择标签</Text>
  </View>
  <ScrollView>
    {tags.map((tag) => (
      <TouchableOpacity
        key={tag}
        onPress={() => toggleItem(tag)}>
        <View style={styles.item}>
          <Checkbox checked={selected.includes(tag)} />
          <Text>{tag}</Text>
        </View>
      </TouchableOpacity>
    ))}
  </ScrollView>
  <View style={styles.footer}>
    <Button onPress={() => setSelected([])}>重置</Button>
    <Button onPress={() => {
      handleConfirm(selected)
      setVisible(false)
    }}>
      确定({selected.length})
    </Button>
  </View>
</SlideSheet>

// 迁移后 - 使用 multiple 模式
import { SlideSheet } from '@sfe/wand-rn'

const [visible, setVisible] = useState(false)
const [selected, setSelected] = useState<string[]>([])

const options = [
  { label: '前端', value: 'frontend' },
  { label: '后端', value: 'backend' },
  { label: '测试', value: 'test' },
  { label: '产品', value: 'product' },
]

<SlideSheet
  visible={visible}
  title="选择标签"
  multiple
  value={selected}
  options={options}
  onChange={(values) => {
    // 实时变化回调（可选）
    console.log('当前选中:', values)
  }}
  onConfirm={(values) => {
    setSelected(values)
    handleConfirm(values)
  }}
  onReset={(currentValues) => {
    console.log('重置前的值:', currentValues)
  }}
  onClose={() => setVisible(false)} />
```

### 案例 4：带搜索功能

```tsx
// 迁移前 - 自行实现搜索逻辑
import { SlideSheet } from '@mtfe/empower-trantor-mrn'

const [visible, setVisible] = useState(false)
const [searchText, setSearchText] = useState('')
const [selected, setSelected] = useState('')

const filteredCities = cities.filter(city => 
  city.includes(searchText)
)

<SlideSheet 
  show={visible} 
  onBlankPressed={() => setVisible(false)}>
  <View style={styles.header}>
    <Text>选择城市</Text>
  </View>
  <TextInput
    value={searchText}
    onChangeText={setSearchText}
    placeholder="搜索城市" />
  <ScrollView>
    {filteredCities.map((city) => (
      <TouchableOpacity
        key={city}
        onPress={() => {
          setSelected(city)
          setVisible(false)
        }}>
        <Text>{city}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</SlideSheet>

// 迁移后 - 使用 searchable 属性
import { SlideSheet } from '@sfe/wand-rn'

const [visible, setVisible] = useState(false)
const [selected, setSelected] = useState('')

const options = cities.map(city => ({
  label: city,
  value: city
}))

<SlideSheet
  visible={visible}
  title="选择城市"
  searchable
  placeholder="请输入城市名称"
  value={selected}
  options={options}
  onSelect={(value) => {
    setSelected(value)
  }}
  onClose={() => setVisible(false)} />
```

### 案例 5：带加载状态

```tsx
// 迁移前 - 自行实现加载状态
import { SlideSheet } from '@mtfe/empower-trantor-mrn'

const [visible, setVisible] = useState(false)
const [loading, setLoading] = useState(false)
const [options, setOptions] = useState([])

useEffect(() => {
  if (visible) {
    setLoading(true)
    fetchOptions().then(data => {
      setOptions(data)
      setLoading(false)
    })
  }
}, [visible])

<SlideSheet 
  show={visible} 
  onBlankPressed={() => setVisible(false)}>
  <View style={styles.header}>
    <Text>选择选项</Text>
  </View>
  {loading ? (
    <ActivityIndicator />
  ) : (
    <ScrollView>
      {options.map((option) => (
        <TouchableOpacity key={option.id} onPress={() => handleSelect(option)}>
          <Text>{option.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )}
</SlideSheet>

// 迁移后 - 使用 loading 属性
import { SlideSheet } from '@sfe/wand-rn'

const [visible, setVisible] = useState(false)
const [loading, setLoading] = useState(false)
const [options, setOptions] = useState([])

useEffect(() => {
  if (visible) {
    setLoading(true)
    fetchOptions().then(data => {
      setOptions(data.map(d => ({ label: d.name, value: d.id })))
      setLoading(false)
    })
  }
}, [visible])

<SlideSheet
  visible={visible}
  title="选择选项"
  loading={loading}
  options={options}
  onSelect={(value) => {
    handleSelect(value)
  }}
  onClose={() => setVisible(false)} />
```

### 案例 6：禁用选项

```tsx
// 迁移前 - 自行实现禁用逻辑
import { SlideSheet } from '@mtfe/empower-trantor-mrn'

const options = [
  { name: '选项1', id: '1', disabled: false },
  { name: '选项2', id: '2', disabled: true },
  { name: '选项3', id: '3', disabled: false },
]

<SlideSheet show={visible} onBlankPressed={() => setVisible(false)}>
  <ScrollView>
    {options.map((option) => (
      <TouchableOpacity
        key={option.id}
        disabled={option.disabled}
        onPress={() => handleSelect(option.id)}>
        <Text style={option.disabled && styles.disabled}>
          {option.name}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</SlideSheet>

// 迁移后 - 使用 enabled 属性
import { SlideSheet } from '@sfe/wand-rn'

const options = [
  { label: '选项1', value: '1', enabled: true },
  { label: '选项2', value: '2', enabled: false },  // 禁用
  { label: '选项3', value: '3', enabled: true },
]

<SlideSheet
  visible={visible}
  title="选择选项"
  options={options}
  onSelect={(value) => {
    handleSelect(value)
  }}
  onClose={() => setVisible(false)} />
```

### 案例 7：自定义空状态

```tsx
// 迁移前 - 自行判断并显示空状态
import { SlideSheet } from '@mtfe/empower-trantor-mrn'

<SlideSheet show={visible} onBlankPressed={() => setVisible(false)}>
  <View style={styles.header}>
    <Text>选择内容</Text>
  </View>
  {options.length === 0 ? (
    <View style={styles.empty}>
      <Image source={emptyIcon} />
      <Text>暂无数据</Text>
    </View>
  ) : (
    <ScrollView>
      {options.map(renderItem)}
    </ScrollView>
  )}
</SlideSheet>

// 迁移后 - 使用 empty 属性
import { SlideSheet } from '@sfe/wand-rn'

<SlideSheet
  visible={visible}
  title="选择内容"
  options={options}
  empty={
    <View style={styles.customEmpty}>
      <Image source={emptyIcon} />
      <Text>暂无数据</Text>
    </View>
  }
  onSelect={(value) => handleSelect(value)}
  onClose={() => setVisible(false)} />
```

## 关键迁移点

### 1. 从容器组件迁移到功能组件

旧组件是一个**通用容器**，需要自行实现所有选择逻辑。新组件是**功能完整的选择器**，内置了常见的选择场景。

**迁移策略**：
- 如果只需要底部弹窗容器 → 使用 `BottomModal`
- 如果需要选择功能 → 使用 `SlideSheet`

### 2. 数据结构转换

需要将原有的列表数据转换为 `options` 格式：

```tsx
// 旧数据格式（任意）
const cities = ['北京', '上海', '广州']
const users = [{ id: 1, name: '张三' }, { id: 2, name: '李四' }]

// 新组件要求格式
const cityOptions = cities.map(city => ({ label: city, value: city }))
const userOptions = users.map(user => ({ label: user.name, value: user.id }))
```

### 3. 回调函数迁移

| 场景 | 旧组件 | 新组件 |
|------|--------|--------|
| 单选选中 | 自行实现 onPress | onSelect(value, index) |
| 多选变化 | 自行实现 onChange | onChange(values) |
| 多选确认 | 自行实现确定按钮 | onConfirm(values) |
| 多选重置 | 自行实现重置按钮 | onReset(values) |
| 关闭弹窗 | onBlankPressed() | onClose() |

### 4. extraData 不再需要

旧组件使用 Class Component，依赖 `extraData` 触发更新。新组件使用 Hooks，自动响应 props 变化：

```tsx
// 迁移前
<SlideSheet 
  show={visible}
  extraData={options}  // 用于触发列表更新
  onBlankPressed={handleClose}>
  {/* ... */}
</SlideSheet>

// 迁移后 - 无需 extraData
<SlideSheet
  visible={visible}
  options={options}    // 直接响应变化
  onClose={handleClose} />
```

### 5. 样式定制

旧组件可通过 `style` prop 定制样式，新组件使用主题系统：

```tsx
// 如需定制新组件样式，使用 Provider 配置主题
import { Provider } from '@sfe/wand-rn'

<Provider theme={customTheme}>
  <SlideSheet {...props} />
</Provider>
```

### 6. TypeScript 泛型支持

新组件支持值类型泛型：

```tsx
// 数字类型值
<SlideSheet<number>
  value={1}
  options={[
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
  ]}
  onSelect={(value) => {
    // value 类型为 number
  }} />

// 字符串类型值
<SlideSheet<string>
  value="a"
  options={[
    { label: '选项A', value: 'a' },
    { label: '选项B', value: 'b' },
  ]}
  onSelect={(value) => {
    // value 类型为 string
  }} />
```

## 完整迁移 Checklist

- [ ] 将 `show` 改为 `visible`
- [ ] 将 `onBlankPressed` 改为 `onClose`
- [ ] 移除 `extraData` 属性
- [ ] 将 `children` 内容转换为 `options` 数据
- [ ] 添加 `title` 属性
- [ ] 确定是否需要 `multiple` 模式
- [ ] 单选场景使用 `onSelect` 回调
- [ ] 多选场景使用 `onConfirm` 回调
- [ ] 如需搜索功能，添加 `searchable` 属性
- [ ] 如需加载状态，添加 `loading` 属性
- [ ] 测试禁用选项（`enabled: false`）
- [ ] 测试空状态显示（`empty` 属性）
- [ ] 移除自定义样式代码（新组件使用主题系统）

## 注意事项

1. **新组件不是旧组件的直接替代**：旧组件是容器，新组件是功能组件。如只需容器，应使用 `BottomModal`。
2. **label 支持 ReactNode**：当 `label` 为 ReactNode 时，搜索功能不可用（仅支持字符串搜索）。
3. **多选模式自动显示底部按钮**：多选时会自动显示"重置"和"确定"按钮，无需手动实现。
4. **单选自动关闭**：单选模式下选中选项后会自动关闭弹窗，多选需要点击"确定"。
5. **值类型一致性**：确保 `value` 和 `options[].value` 的类型一致，便于 TypeScript 类型推断。
