# ActionSheet 动作面板

## 从何处迁移
- **源库**: `@roo/roo-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface ActionSheetOptionItem {
  label: string
  noAutoClose?: boolean
  [propName: string]: any
}

interface ActionSheetContainerProps extends WithThemeStyles<ActionSheetStyles> {
  /** 头部自定义内容 */
  header?: JSX.Element
  /** 底部自定义内容 */
  footer?: JSX.Element
  /** 标题 */
  title?: string
  /** 选项列表 */
  options?: ActionSheetOptionItem[]
  /** 最大可见选项数 */
  maxShowNum?: number
  /** 容器样式 */
  containerStyle?: ViewStyle
  /** 选项主体样式 */
  itemBodyStyle?: ViewStyle
  /** 选项样式 */
  itemStyle?: ViewStyle
  /** 选项按压透明度 */
  itemActiveOpacity?: number  // 默认 0.2
  /** 自定义选项渲染 */
  renderItem?: (item, index) => JSX.Element
  /** 取消回调 */
  cancelCallback?: (data?) => void
  /** 确认回调 */
  confirmCallback?: (data, index) => void
  /** 是否使用安全区域 */
  useSafeAreaView?: boolean  // 默认 true
  /** 弹窗属性 */
  modalProps?: ModalProps
  /** 滑动弹窗属性 */
  slideModalProps?: SlideModalProps
  /** 是否自动关闭 */
  autoClose?: boolean  // 默认 true
}

interface ActionSheetProps extends ActionSheetContainerProps {
  /** 是否可见 */
  visible?: boolean  // 默认 false
}

// 静态方法
ActionSheet.open(options)    // 命令式打开
ActionSheet.openIOS(options) // iOS 风格命令式打开
```

## 新组件 API

```tsx
interface ActionSheetOptionItem {
  title: string          // 原 label
  value: any             // 新增，必填
  description?: string   // 新增
  color?: string         // 新增
  disabled?: boolean     // 新增
  [propName: string]: unknown
}

interface ActionSheetContainerProps extends WithThemeStyles<ActionSheetStyles> {
  /** 选项列表 */
  options?: ActionSheetOptionItem[]
  /** 头部自定义内容 */
  header?: JSX.Element
  /** 标题 */
  title?: string
  /** 底部自定义内容 */
  footer?: JSX.Element
  /** 最大可见选项数 */
  maxCount?: number  // 原 maxShowNum
  /** 取消按钮文案 */
  cancelText?: string  // 新增，默认 '取消'
  /** 取消回调 */
  onCancel?: () => void  // 原 cancelCallback，无参数
  /** 选项变更回调 */
  onChange?: (value, index, item) => void  // 原 confirmCallback，签名不同
}

interface ActionSheetProps extends ActionSheetContainerProps {
  /** 是否可见 */
  visible?: boolean  // 默认 false
  /** 点击蒙层是否可关闭 */
  maskClosable?: boolean  // 新增，默认 true
  /** 关闭回调 */
  onClose?: () => void  // 新增
}

// 静态方法
ActionSheet.open(options)  // 命令式打开（无 openIOS）
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| options.label | options.title | 选项文案字段重命名 |
| options.noAutoClose | - | 移除，新版本无自动关闭机制 |
| - | options.value | 新增，必填，选项值 |
| - | options.description | 新增，选项描述文案 |
| - | options.color | 新增，选项文字颜色 |
| - | options.disabled | 新增，选项禁用状态 |
| visible | visible | 保持一致 |
| header | header | 保持一致 |
| footer | footer | 保持一致 |
| title | title | 保持一致 |
| maxShowNum | maxCount | 重命名 |
| cancelCallback | onCancel | 重命名，且不再接收参数 |
| confirmCallback | onChange | 重命名，签名变更为 (value, index, item) |
| autoClose | - | 移除，需消费方自行管理关闭 |
| containerStyle | - | 移除 |
| itemBodyStyle | - | 移除 |
| itemStyle | - | 移除 |
| itemActiveOpacity | - | 移除（新版内部硬编码 0.8） |
| renderItem | - | 移除，不再支持自定义选项渲染 |
| useSafeAreaView | - | 移除（新版始终使用 SafeAreaView） |
| modalProps | - | 移除，由 maskClosable / onClose 替代 |
| slideModalProps | - | 移除，由 maskClosable / onClose 替代 |
| - | cancelText | 新增，取消按钮文案，默认 '取消' |
| - | maskClosable | 新增，点击蒙层关闭，默认 true |
| - | onClose | 新增，关闭回调 |
| ActionSheet.openIOS | - | 移除，仅保留 ActionSheet.open |

## 迁移示例

### 案例 1：基础用法

```tsx
// 迁移前
import { ActionSheet } from '@roo/roo-rn'

const options = [
  { label: '选项一' },
  { label: '选项二' },
  { label: '选项三' },
]

<ActionSheet
  visible={visible}
  options={options}
  confirmCallback={(data, index) => {
    console.log('选中:', data.label, index)
  }}
  cancelCallback={() => setVisible(false)}
/>

// 迁移后
import { ActionSheet } from '@sfe/wand-rn'

const options = [
  { title: '选项一', value: 'option1' },
  { title: '选项二', value: 'option2' },
  { title: '选项三', value: 'option3' },
]

<ActionSheet
  visible={visible}
  options={options}
  onChange={(value, index, item) => {
    console.log('选中:', item.title, index)
    setVisible(false)  // 需手动关闭
  }}
  onCancel={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

### 案例 2：带标题

```tsx
// 迁移前
import { ActionSheet } from '@roo/roo-rn'

<ActionSheet
  visible={visible}
  title="请选择操作"
  options={[
    { label: '拍照' },
    { label: '从相册选择' },
  ]}
  confirmCallback={(data, index) => handleSelect(index)}
  cancelCallback={() => setVisible(false)}
/>

// 迁移后
import { ActionSheet } from '@sfe/wand-rn'

<ActionSheet
  visible={visible}
  title="请选择操作"
  options={[
    { title: '拍照', value: 'camera' },
    { title: '从相册选择', value: 'album' },
  ]}
  onChange={(value, index) => {
    handleSelect(index)
    setVisible(false)
  }}
  onCancel={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

### 案例 3：自动关闭迁移

```tsx
// 迁移前 - 默认 autoClose=true，点击选项后自动关闭
import { ActionSheet } from '@roo/roo-rn'

<ActionSheet
  visible={visible}
  options={[
    { label: '选项一' },
    { label: '选项二' },
  ]}
  confirmCallback={(data, index) => {
    handleSelect(data)
    // 无需手动关闭，autoClose 默认生效
  }}
  cancelCallback={() => setVisible(false)}
/>

// 迁移后 - 无 autoClose，必须手动关闭
import { ActionSheet } from '@sfe/wand-rn'

<ActionSheet
  visible={visible}
  options={[
    { title: '选项一', value: 'opt1' },
    { title: '选项二', value: 'opt2' },
  ]}
  onChange={(value, index, item) => {
    handleSelect(item)
    setVisible(false)  // 必须手动关闭
  }}
  onCancel={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

### 案例 4：noAutoClose 选项迁移

```tsx
// 迁移前 - 部分选项设置 noAutoClose
import { ActionSheet } from '@roo/roo-rn'

<ActionSheet
  visible={visible}
  options={[
    { label: '普通选项' },
    { label: '点击不关闭', noAutoClose: true },
  ]}
  confirmCallback={(data, index) => {
    handleSelect(data, index)
  }}
  cancelCallback={() => setVisible(false)}
/>

// 迁移后 - noAutoClose 已移除，由消费方自行控制
import { ActionSheet } from '@sfe/wand-rn'

<ActionSheet
  visible={visible}
  options={[
    { title: '普通选项', value: 'normal' },
    { title: '点击不关闭', value: 'stay' },
  ]}
  onChange={(value, index, item) => {
    handleSelect(item, index)
    // 根据业务逻辑决定是否关闭
    if (value !== 'stay') {
      setVisible(false)
    }
  }}
  onCancel={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

### 案例 5：maxShowNum 迁移

```tsx
// 迁移前
import { ActionSheet } from '@roo/roo-rn'

<ActionSheet
  visible={visible}
  maxShowNum={5}
  options={longOptionList}
  confirmCallback={(data, index) => handleSelect(data, index)}
  cancelCallback={() => setVisible(false)}
/>

// 迁移后
import { ActionSheet } from '@sfe/wand-rn'

<ActionSheet
  visible={visible}
  maxCount={5}
  options={longOptionList}
  onChange={(value, index, item) => {
    handleSelect(item, index)
    setVisible(false)
  }}
  onCancel={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

### 案例 6：自定义样式迁移

```tsx
// 迁移前 - 支持多种样式属性
import { ActionSheet } from '@roo/roo-rn'

<ActionSheet
  visible={visible}
  containerStyle={{ backgroundColor: '#f5f5f5' }}
  itemBodyStyle={{ paddingHorizontal: 20 }}
  itemStyle={{ height: 56 }}
  itemActiveOpacity={0.5}
  options={options}
  confirmCallback={(data, index) => handleSelect(data, index)}
  cancelCallback={() => setVisible(false)}
/>

// 迁移后 - 样式属性已移除，使用主题系统
import { ActionSheet } from '@sfe/wand-rn'

// containerStyle、itemBodyStyle、itemStyle、itemActiveOpacity 均已移除
// 样式由主题系统控制，通过 Provider 统一配置
<ActionSheet
  visible={visible}
  options={options}
  onChange={(value, index, item) => {
    handleSelect(item, index)
    setVisible(false)
  }}
  onCancel={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

### 案例 7：renderItem 迁移

```tsx
// 迁移前 - 自定义渲染选项
import { ActionSheet } from '@roo/roo-rn'

<ActionSheet
  visible={visible}
  options={options}
  renderItem={(item, index) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon type={item.icon} />
      <Text>{item.label}</Text>
    </View>
  )}
  confirmCallback={(data, index) => handleSelect(data, index)}
  cancelCallback={() => setVisible(false)}
/>

// 迁移后 - renderItem 已移除，使用 description 和 color 替代部分场景
import { ActionSheet } from '@sfe/wand-rn'

// 如果仅需描述文案或颜色区分，可用新属性替代
<ActionSheet
  visible={visible}
  options={[
    { title: '编辑', value: 'edit', description: '修改当前内容' },
    { title: '删除', value: 'delete', color: '#FF3B30', description: '不可恢复' },
  ]}
  onChange={(value, index, item) => {
    handleSelect(item, index)
    setVisible(false)
  }}
  onCancel={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

### 案例 8：modalProps / slideModalProps 迁移

```tsx
// 迁移前 - 传递弹窗属性
import { ActionSheet } from '@roo/roo-rn'

<ActionSheet
  visible={visible}
  options={options}
  modalProps={{ animationType: 'fade' }}
  slideModalProps={{ maskClosable: true }}
  confirmCallback={(data, index) => handleSelect(data, index)}
  cancelCallback={() => setVisible(false)}
/>

// 迁移后 - 使用 maskClosable / onClose 替代
import { ActionSheet } from '@sfe/wand-rn'

<ActionSheet
  visible={visible}
  options={options}
  maskClosable={true}
  onChange={(value, index, item) => {
    handleSelect(item, index)
    setVisible(false)
  }}
  onCancel={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

### 案例 9：命令式调用

```tsx
// 迁移前
import { ActionSheet } from '@roo/roo-rn'

ActionSheet.open({
  title: '请选择',
  options: [
    { label: '选项一' },
    { label: '选项二' },
  ],
  confirmCallback: (data, index) => {
    console.log('选中:', data.label)
  },
  cancelCallback: () => {
    console.log('取消')
  },
})

// 迁移后
import { ActionSheet } from '@sfe/wand-rn'

ActionSheet.open({
  title: '请选择',
  options: [
    { title: '选项一', value: 'opt1' },
    { title: '选项二', value: 'opt2' },
  ],
  onChange: (value, index, item) => {
    console.log('选中:', item.title)
  },
  onCancel: () => {
    console.log('取消')
  },
})
```

### 案例 10：openIOS 迁移

```tsx
// 迁移前 - iOS 风格
import { ActionSheet } from '@roo/roo-rn'

ActionSheet.openIOS({
  title: '请选择',
  options: [
    { label: '拍照' },
    { label: '从相册选择' },
  ],
  confirmCallback: (data, index) => handleSelect(data, index),
  cancelCallback: () => console.log('取消'),
})

// 迁移后 - openIOS 已移除，统一使用 open
import { ActionSheet } from '@sfe/wand-rn'

ActionSheet.open({
  title: '请选择',
  options: [
    { title: '拍照', value: 'camera' },
    { title: '从相册选择', value: 'album' },
  ],
  onChange: (value, index, item) => handleSelect(item, index),
  onCancel: () => console.log('取消'),
})
```

### 案例 11：新增禁用选项

```tsx
// 迁移前 - 不支持禁用单个选项
import { ActionSheet } from '@roo/roo-rn'

<ActionSheet
  visible={visible}
  options={[
    { label: '可用选项' },
    { label: '不可用选项' },  // 无法禁用
  ]}
  confirmCallback={(data, index) => handleSelect(data, index)}
  cancelCallback={() => setVisible(false)}
/>

// 迁移后 - 支持 disabled 属性
import { ActionSheet } from '@sfe/wand-rn'

<ActionSheet
  visible={visible}
  options={[
    { title: '可用选项', value: 'enabled' },
    { title: '不可用选项', value: 'disabled', disabled: true },
  ]}
  onChange={(value, index, item) => {
    handleSelect(item, index)
    setVisible(false)
  }}
  onCancel={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

### 案例 12：新增蒙层关闭控制

```tsx
// 迁移前 - 通过 slideModalProps 控制蒙层
import { ActionSheet } from '@roo/roo-rn'

<ActionSheet
  visible={visible}
  options={options}
  slideModalProps={{ maskClosable: false }}
  confirmCallback={(data, index) => handleSelect(data, index)}
  cancelCallback={() => setVisible(false)}
/>

// 迁移后 - 直接使用 maskClosable
import { ActionSheet } from '@sfe/wand-rn'

<ActionSheet
  visible={visible}
  options={options}
  maskClosable={false}
  onChange={(value, index, item) => {
    handleSelect(item, index)
    setVisible(false)
  }}
  onCancel={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

### 案例 13：confirmCallback 签名变更

```tsx
// 迁移前 - confirmCallback 接收 (data, index)
import { ActionSheet } from '@roo/roo-rn'

<ActionSheet
  visible={visible}
  options={[
    { label: '选项一', extra: 'A' },
    { label: '选项二', extra: 'B' },
  ]}
  confirmCallback={(data, index) => {
    // data 是整个 option 对象 { label: '选项一', extra: 'A' }
    console.log(data.label, data.extra, index)
  }}
  cancelCallback={() => setVisible(false)}
/>

// 迁移后 - onChange 接收 (value, index, item)
import { ActionSheet } from '@sfe/wand-rn'

<ActionSheet
  visible={visible}
  options={[
    { title: '选项一', value: 'opt1', extra: 'A' },
    { title: '选项二', value: 'opt2', extra: 'B' },
  ]}
  onChange={(value, index, item) => {
    // value 是 option.value，item 是整个对象
    console.log(item.title, item.extra, index)
    setVisible(false)
  }}
  onCancel={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

### 案例 14：完整复杂场景

```tsx
// 迁移前
import { ActionSheet } from '@roo/roo-rn'

const [visible, setVisible] = useState(false)

const options = [
  { label: '编辑', icon: 'edit' },
  { label: '分享', icon: 'share' },
  { label: '删除', icon: 'delete', noAutoClose: true },
]

<ActionSheet
  visible={visible}
  title="更多操作"
  maxShowNum={5}
  containerStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
  itemStyle={{ height: 56 }}
  itemActiveOpacity={0.3}
  useSafeAreaView={true}
  options={options}
  renderItem={(item, index) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon type={item.icon} />
      <Text style={{ marginLeft: 8 }}>{item.label}</Text>
    </View>
  )}
  confirmCallback={(data, index) => {
    if (index === 2) {
      Alert.alert('确认删除？', '', [
        { text: '取消' },
        { text: '确定', onPress: () => {
          handleDelete()
          setVisible(false)
        }},
      ])
    } else {
      handleAction(data, index)
    }
  }}
  cancelCallback={() => setVisible(false)}
  slideModalProps={{ maskClosable: true }}
/>

// 迁移后
import { ActionSheet } from '@sfe/wand-rn'

const [visible, setVisible] = useState(false)

const options = [
  { title: '编辑', value: 'edit' },
  { title: '分享', value: 'share' },
  { title: '删除', value: 'delete', color: '#FF3B30' },
]

<ActionSheet
  visible={visible}
  title="更多操作"
  maxCount={5}
  maskClosable={true}
  options={options}
  onChange={(value, index, item) => {
    if (value === 'delete') {
      Alert.alert('确认删除？', '', [
        { text: '取消' },
        { text: '确定', onPress: () => {
          handleDelete()
          setVisible(false)
        }},
      ])
    } else {
      handleAction(item, index)
      setVisible(false)
    }
  }}
  onCancel={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

## 关键点

### 1. 选项数据结构变更
- 旧版本：`{ label: string, noAutoClose?: boolean, ...rest }`
- 新版本：`{ title: string, value: any, description?: string, color?: string, disabled?: boolean, ...rest }`
- **label 重命名为 title**，新增必填字段 **value**
- **noAutoClose 移除**，消费方自行管理关闭逻辑

### 2. 回调函数签名变更
- `cancelCallback(data?)` -> `onCancel()`：取消回调不再接收参数
- `confirmCallback(data, index)` -> `onChange(value, index, item)`：第一个参数从整个 option 对象变为 value 值，完整对象移至第三个参数

### 3. 自动关闭机制移除
- 旧版本：`autoClose` 默认 true，点击选项后自动关闭
- 新版本：无 `autoClose` 属性，消费方必须在 `onChange` 和 `onCancel` 中手动调用 `setVisible(false)`
- 旧版本单选项的 `noAutoClose` 同样被移除

### 4. 样式属性全部移除
- 移除：`containerStyle`、`itemBodyStyle`、`itemStyle`、`itemActiveOpacity`
- 新版本按压透明度从 0.2 变为 0.8（内部硬编码）
- 样式由主题系统控制，通过 Provider 统一配置

### 5. 自定义渲染移除
- `renderItem` 已移除，不再支持自定义选项渲染
- 部分场景可通过新增的 `description` 和 `color` 属性替代

### 6. 弹窗控制简化
- `modalProps` 和 `slideModalProps` 移除
- 使用 `maskClosable`（控制蒙层点击关闭）和 `onClose`（关闭回调）替代
- `useSafeAreaView` 移除，新版本始终使用 SafeAreaView

### 7. 静态方法变更
- `ActionSheet.open` 保留，参数需同步更新（label -> title，新增 value 等）
- `ActionSheet.openIOS` 已移除，统一使用 `ActionSheet.open`

### 8. 新增功能
- **cancelText**：自定义取消按钮文案，默认 '取消'
- **maskClosable**：控制蒙层点击是否关闭面板
- **onClose**：面板关闭回调
- **options.description**：选项描述文案
- **options.color**：选项文字颜色
- **options.disabled**：选项禁用状态

## 注意事项

1. **label -> title**：所有选项的 `label` 字段必须重命名为 `title`
2. **新增 value**：每个选项必须添加 `value` 字段，`onChange` 回调第一个参数为该值
3. **手动关闭**：旧版本依赖 `autoClose` 自动关闭的逻辑，迁移后必须在回调中手动关闭
4. **回调参数适配**：`confirmCallback(data, index)` 中的 `data` 是完整对象，新版 `onChange(value, index, item)` 中第一个参数是 `value`，完整对象是第三个参数 `item`
5. **renderItem 不可用**：依赖自定义渲染的场景需重新设计，或使用 `description`/`color` 属性
6. **openIOS 不可用**：使用 `ActionSheet.openIOS` 的代码需改为 `ActionSheet.open`
7. **样式定制**：`containerStyle`、`itemStyle` 等样式属性已移除，需通过主题系统定制
8. **cancelCallback 无参数**：如旧代码在 `cancelCallback` 中使用了参数，需移除

## 迁移检查清单

- [ ] 将所有选项的 `label` 重命名为 `title`
- [ ] 为每个选项添加 `value` 字段
- [ ] 将 `confirmCallback` 替换为 `onChange`，适配新签名 (value, index, item)
- [ ] 将 `cancelCallback` 替换为 `onCancel`，移除回调参数
- [ ] 移除 `autoClose` 属性，在 `onChange` 和 `onCancel` 中手动关闭
- [ ] 移除 `noAutoClose`，在 `onChange` 中根据业务逻辑控制关闭
- [ ] 将 `maxShowNum` 替换为 `maxCount`
- [ ] 移除 `containerStyle`、`itemBodyStyle`、`itemStyle`、`itemActiveOpacity`
- [ ] 移除 `renderItem`，使用 `description`/`color` 替代或重新设计
- [ ] 移除 `useSafeAreaView`
- [ ] 将 `modalProps`/`slideModalProps` 替换为 `maskClosable`/`onClose`
- [ ] 将 `ActionSheet.openIOS` 替换为 `ActionSheet.open`
- [ ] 添加 `onClose` 回调处理面板关闭
- [ ] 测试命令式调用（ActionSheet.open）参数更新
- [ ] 验证所有选项点击后面板正确关闭
