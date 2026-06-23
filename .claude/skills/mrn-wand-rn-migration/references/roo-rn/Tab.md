# Tab 选项卡

## 重要警告：组件本质差异

roo-rn 的 `Tab` 是一个**全功能导航选项卡组件**，支持 9 种样式类型（default/defaultv2/line/plane/planev2/custom/customv2/balanced/simple）、滚动模式、下划线动画指示器、自定义渲染等丰富功能。

wand-rn 的 `SwitchTab` 是一个**简单的分段控制器（Segment Control）**，仅支持 2-3 个选项的切换，固定宽高，无滚动、无下划线、无自定义渲染能力。

**两者不是同类组件，只有极少数简单场景可以迁移。大部分 Tab 使用场景在 wand-rn 中没有对等组件，需要自行实现。**

## 从何处迁移
- **源库**: `@roo/roo-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface TabItem {
  /** Tab 选中的值，配置项中的唯一标识 */
  value?: number | string
  /** Tab 按钮的文案 */
  label?: string | JSX.Element | ((selected: boolean, disabled: boolean, index: number) => JSX.Element)
  /** Tab 是否是禁用状态 */
  disabled?: boolean
}

export interface TabProps extends WithThemeStyles<TabStyles> {
  /** 对应数据源对象的 value 值 */
  value: number | string
  /** 数据源，数组中项为对象 */
  options: Array<TabItem>
  /** 自定义渲染Tab的每一项，函数参数：item, selected, disabled, index */
  renderItem?: (item: TabExtendItem, selected: boolean, disabled: boolean, index: number) => JSX.Element
  /** 状态切换时的回调 */
  onChange?: (data: TabExtendItem) => void
  /** 是否可滚动 */
  scrollable?: boolean  // 默认 false
  /** 是否等分空间 */
  isBalanced?: boolean  // 默认 true
  /** Tab 内各项对齐方式，仅在 isBalanced: false 时生效 */
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  /** 默认底部横线样式自定义 */
  underlineStyle?: ViewStyle | RegisteredStyle<ViewStyle>
  /** 选中状态底部横线样式自定义 */
  activeUnderlineStyle?: ViewStyle | RegisteredStyle<ViewStyle>
  /** Tab 底部横线是否与文字同宽 */
  suteTabUnderLineWidth?: boolean
  /** Tabs 整体样式自定义 */
  wrapperStyles?: ViewStyle | RegisteredStyle<ViewStyle>
  /** tab 内置的样式风格 */
  tabType?: 'default' | 'defaultv2' | 'line' | 'plane' | 'planev2' | 'custom' | 'customv2' | 'balanced' | 'simple'  // 默认 'default'
  /** Tab 单项样式自定义 */
  itemStyle?: ViewStyle | RegisteredStyle<ViewStyle>
  /** 选中状态 Tab 单项样式自定义 */
  activeItemStyle?: ViewStyle | RegisteredStyle<ViewStyle>
  /** Tab 单项文本样式自定义 */
  textStyle?: TextStyle | RegisteredStyle<TextStyle>
  /** 选中状态下 Tab 单项文本样式自定义 */
  activeTextStyle?: TextStyle | RegisteredStyle<TextStyle>
  /** 禁用状态下 tab 文本自定义样式 */
  disabledTextStyle?: TextStyle | RegisteredStyle<TextStyle>
  /** balanced 类型的容器样式 */
  balancedContainerStyle?: ViewStyle | RegisteredStyle<ViewStyle>
  /** balanced 类型的 Tab 项之间的间距 */
  balancedItemGap?: number
  /** simple 类型的容器样式 */
  simpleContainerStyle?: ViewStyle | RegisteredStyle<ViewStyle>
  /** 自定义渲染 Tab 底部下划线 */
  customTabLine?: () => JSX.Element
  /** 自定义渲染的 Tab，底部是否有下划线 */
  customTabContentHasLine?: boolean  // 默认 false
  /** 自定义 Tab 底部横线样式，参数：tabWidth */
  customUnderlineStyle?: (tabWidth: number) => ViewStyle | RegisteredStyle<ViewStyle>
  /** 是否显示 Tab 容器默认的底部横线 */
  disableHairline?: boolean  // 默认 false
  /** 自定义渲染Tab的每一项内容（仅 custom/customv2 类型） */
  renderCutomItemContent?: (item: TabExtendItem, selected: boolean, disabled: boolean, index: number) => JSX.Element
  /** 自定义渐变色 */
  customGradientColors?: string[]
  /** 自定义未选中渐变色 */
  unSelectGradientColors?: string[]
  /** 自定义选中底部箭头 */
  customSelectedTriangle?: JSX.Element
}
```

## 新组件 API

```tsx
export enum SwitchTabSize {
  Large = 'L',
  Small = 'S'
}

export interface SwitchTabItemType {
  value: number | string
  label: string
}

export interface SwitchTabProps {
  /** 提供切换选择的标签项内容 */
  items: SwitchTabItemType[]
  /** 宽高度大小 */
  size?: 'L' | 'S'  // 默认 'L'
  /** 选中的标签 value 值 */
  value?: number | string  // 默认第一个 item 的 value
  /** 是否禁用 */
  disabled?: boolean  // 默认 false
  /** 最外层容器自定义样式 */
  style?: StyleProp<ViewStyle>
  /** 内部 item 项自定义样式 */
  itemStyle?: StyleProp<ViewStyle>
  /** 状态切换时的回调 */
  onChange?: (value: number | string, index: number) => void
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| value | value | 保持一致 |
| options | items | 属性名变更，数据结构简化：label 仅支持 string，不再支持 JSX.Element 或函数 |
| onChange | onChange | **回调签名不同**：旧版 `(data: TabExtendItem) => void`，新版 `(value: number \| string, index: number) => void` |
| scrollable | - | **移除，无替代**。SwitchTab 不支持滚动 |
| isBalanced | - | 移除。SwitchTab 始终等分 |
| justifyContent | - | 移除。SwitchTab 固定 space-between 布局 |
| underlineStyle | - | **移除，无替代**。SwitchTab 无下划线指示器 |
| activeUnderlineStyle | - | **移除，无替代**。SwitchTab 无下划线指示器 |
| suteTabUnderLineWidth | - | **移除，无替代** |
| wrapperStyles | style | 语义变更，新版仅支持最外层容器样式 |
| tabType | - | **移除，无替代**。SwitchTab 仅一种固定的分段控制样式 |
| itemStyle | itemStyle | 保持一致 |
| activeItemStyle | - | 移除。选中样式由组件内部控制（白色背景） |
| textStyle | - | 移除。文字样式由组件内部控制 |
| activeTextStyle | - | 移除。选中文字样式由组件内部控制（fontWeight: 500） |
| disabledTextStyle | - | 移除 |
| balancedContainerStyle | - | 移除 |
| balancedItemGap | - | 移除 |
| simpleContainerStyle | - | 移除 |
| customTabLine | - | **移除，无替代** |
| customTabContentHasLine | - | 移除 |
| customUnderlineStyle | - | **移除，无替代** |
| disableHairline | - | 移除。SwitchTab 无底部分割线 |
| renderItem | - | **移除，无替代**。SwitchTab 不支持自定义渲染 |
| renderCutomItemContent | - | **移除，无替代** |
| customGradientColors | - | **移除，无替代**。SwitchTab 无渐变色支持 |
| unSelectGradientColors | - | **移除，无替代** |
| customSelectedTriangle | - | **移除，无替代** |
| - | size | 新增，支持 'L'（大）和 'S'（小）两种尺寸 |
| - | disabled | 新增，全局禁用所有选项（旧版仅支持单项禁用） |

## 可迁移场景判断

### 可以迁移的场景
仅当 **同时满足以下所有条件** 时，才能从 Tab 迁移到 SwitchTab：
1. 选项数量为 2-3 个
2. tabType 为 `'balanced'` 或 `'simple'` 或使用默认类型且选项很少
3. 不使用 scrollable 模式
4. label 均为纯字符串（不使用 JSX 或函数渲染）
5. 不使用 renderItem 或 renderCutomItemContent 自定义渲染
6. 不依赖下划线动画指示器
7. 不使用渐变色（customGradientColors、unSelectGradientColors）
8. 不使用 customSelectedTriangle

### 无法迁移的场景（需自行实现）
- tabType 为 `'default'`/`'defaultv2'`/`'line'`/`'plane'`/`'planev2'`/`'custom'`/`'customv2'` 且依赖其特有视觉样式
- 使用 scrollable 滚动模式（多选项横滑）
- 使用 renderItem 自定义每项渲染内容
- label 使用 JSX.Element 或函数渲染
- 需要下划线动画指示器
- 选项数量超过 3 个
- 需要渐变色背景
- 需要单项 disabled 控制（SwitchTab 仅支持全局 disabled）

## 迁移示例

### 案例 1：简单的 2-3 项选项卡（可迁移）

```tsx
// 迁移前
import { Tab } from '@roo/roo-rn'

const [value, setValue] = useState(1)

<Tab
  value={value}
  options={[
    { value: 1, label: '选项一' },
    { value: 2, label: '选项二' },
    { value: 3, label: '选项三' },
  ]}
  onChange={(data) => setValue(data.value)}
/>

// 迁移后
import { SwitchTab } from '@sfe/wand-rn'

const [value, setValue] = useState<number | string>(1)

<SwitchTab
  value={value}
  items={[
    { value: 1, label: '选项一' },
    { value: 2, label: '选项二' },
    { value: 3, label: '选项三' },
  ]}
  onChange={(val) => setValue(val)}
/>
```

### 案例 2：onChange 回调签名变更

```tsx
// 迁移前 - onChange 接收完整的 TabExtendItem 对象
import { Tab } from '@roo/roo-rn'

<Tab
  value={value}
  options={options}
  onChange={(data) => {
    console.log('选中值:', data.value)
    console.log('选中标签:', data.label)
    console.log('是否禁用:', data.disabled)
    setValue(data.value)
  }}
/>

// 迁移后 - onChange 仅接收 value 和 index
import { SwitchTab } from '@sfe/wand-rn'

<SwitchTab
  value={value}
  items={items}
  onChange={(val, index) => {
    console.log('选中值:', val)
    console.log('选中索引:', index)
    // 如需获取 label，需自行从 items 中查找
    console.log('选中标签:', items[index].label)
    setValue(val)
  }}
/>
```

### 案例 3：balanced 类型迁移

```tsx
// 迁移前
import { Tab } from '@roo/roo-rn'

<Tab
  tabType="balanced"
  value={value}
  options={[
    { value: 1, label: '选项一' },
    { value: 2, label: '选项二' },
  ]}
  onChange={(data) => setValue(data.value)}
/>

// 迁移后 - SwitchTab 外观上类似 balanced 类型（等分、灰色背景、白色选中）
import { SwitchTab } from '@sfe/wand-rn'

<SwitchTab
  value={value}
  items={[
    { value: 1, label: '选项一' },
    { value: 2, label: '选项二' },
  ]}
  onChange={(val) => setValue(val)}
/>
```

### 案例 4：simple 类型迁移

```tsx
// 迁移前
import { Tab } from '@roo/roo-rn'

<Tab
  tabType="simple"
  value={value}
  options={[
    { value: 1, label: '选项一' },
    { value: 2, label: '选项二' },
    { value: 3, label: '选项三' },
  ]}
  onChange={(data) => setValue(data.value)}
/>

// 迁移后
import { SwitchTab } from '@sfe/wand-rn'

<SwitchTab
  value={value}
  items={[
    { value: 1, label: '选项一' },
    { value: 2, label: '选项二' },
    { value: 3, label: '选项三' },
  ]}
  onChange={(val) => setValue(val)}
/>
```

### 案例 5：尺寸控制

```tsx
// 迁移前 - 通过 itemStyle/textStyle 控制尺寸
import { Tab } from '@roo/roo-rn'

<Tab
  tabType="balanced"
  value={value}
  options={options}
  textStyle={{ fontSize: 12 }}
  itemStyle={{ height: 25 }}
  onChange={(data) => setValue(data.value)}
/>

// 迁移后 - 使用 size 属性
import { SwitchTab } from '@sfe/wand-rn'

// size='S': 宽 84(2项)/72(3项), 高 25, fontSize 12
// size='L': 宽 90(2项)/78(3项), 高 28, fontSize 14
<SwitchTab
  size="S"
  value={value}
  items={items}
  onChange={(val) => setValue(val)}
/>
```

### 案例 6：全局禁用

```tsx
// 迁移前 - 仅支持单项禁用
import { Tab } from '@roo/roo-rn'

<Tab
  value={value}
  options={[
    { value: 1, label: '选项一', disabled: false },
    { value: 2, label: '选项二', disabled: true },
    { value: 3, label: '选项三', disabled: true },
  ]}
  onChange={(data) => setValue(data.value)}
/>

// 迁移后 - 仅支持全局禁用，不支持单项禁用
import { SwitchTab } from '@sfe/wand-rn'

// 注意：SwitchTab 的 disabled 会禁用所有选项
// 如需单项禁用效果，无法直接迁移
<SwitchTab
  disabled
  value={value}
  items={items}
  onChange={(val) => setValue(val)}
/>
```

### 案例 7：不可迁移 - 滚动模式（需自行实现）

```tsx
// 迁移前 - 滚动选项卡，无法迁移到 SwitchTab
import { Tab } from '@roo/roo-rn'

<Tab
  scrollable={true}
  suteTabUnderLineWidth={true}
  value={value}
  options={[
    { value: 1, label: '选项一' },
    { value: 2, label: '选项二' },
    { value: 3, label: '选项三' },
    { value: 4, label: '选项四' },
    { value: 5, label: '选项五' },
    { value: 6, label: '选项六' },
    { value: 7, label: '选项七' },
  ]}
  onChange={(data) => setValue(data.value)}
/>

// 迁移后 - 无法迁移！SwitchTab 不支持滚动模式
// 需要自行使用 ScrollView + 自定义 Tab 项实现
```

### 案例 8：不可迁移 - 自定义渲染（需自行实现）

```tsx
// 迁移前 - 使用 renderItem 自定义渲染
import { Tab } from '@roo/roo-rn'

<Tab
  value={value}
  options={options}
  renderItem={(item, selected, disabled, index) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon name={selected ? 'star-fill' : 'star'} />
      <Text style={{ fontWeight: selected ? '500' : '400' }}>
        {item.label}
      </Text>
    </View>
  )}
  onChange={(data) => setValue(data.value)}
/>

// 迁移后 - 无法迁移！SwitchTab 不支持自定义渲染
// SwitchTab 的 label 仅接受 string，不支持 JSX
```

### 案例 9：不可迁移 - 下划线动画指示器（需自行实现）

```tsx
// 迁移前 - 使用下划线动画指示器
import { Tab } from '@roo/roo-rn'

<Tab
  value={value}
  options={options}
  suteTabUnderLineWidth={true}
  activeUnderlineStyle={{ marginTop: 10 }}
  customGradientColors={['#FFE74D', '#FFDD1A']}
  onChange={(data) => setValue(data.value)}
/>

// 迁移后 - 无法迁移！SwitchTab 无下划线动画
// SwitchTab 使用白色背景标记选中项，无下划线指示器
```

### 案例 10：不可迁移 - line/plane/custom 类型（需自行实现）

```tsx
// 迁移前 - 使用 line 类型（边框卡片式）
import { Tab } from '@roo/roo-rn'

<Tab
  tabType="line"
  scrollable={true}
  isBalanced={false}
  value={value}
  options={options}
  onChange={(data) => setValue(data.value)}
/>

// 迁移后 - 无法迁移！SwitchTab 仅一种视觉样式
// line 类型（边框卡片）、plane 类型（渐变填充）、custom 类型（渐变+箭头）
// 均无法在 SwitchTab 中实现
```

### 案例 11：不可迁移 - label 为函数渲染（需自行实现）

```tsx
// 迁移前 - label 使用函数返回 JSX
import { Tab } from '@roo/roo-rn'

<Tab
  value={value}
  options={[
    {
      value: 1,
      label: (selected, disabled, index) => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={selected ? { fontWeight: '500' } : {}}>选项一</Text>
          <Text style={{ marginLeft: 5 }}>110</Text>
        </View>
      ),
    },
    // ...
  ]}
  onChange={(data) => setValue(data.value)}
/>

// 迁移后 - 无法迁移！SwitchTab 的 label 仅支持 string
```

## 关键点

### 1. 组件本质完全不同
- **Tab（roo-rn）**：全功能导航选项卡。Class 组件，支持 9 种样式类型、滚动模式、下划线动画、自定义渲染、渐变色背景。适用于任意数量的选项。
- **SwitchTab（wand-rn）**：简单分段控制器。函数组件，固定的灰色背景 + 白色选中样式，仅适用于 2-3 个固定选项的简单切换。

### 2. 数据源属性名和结构变更
- 旧：`options: Array<TabItem>`，其中 `label` 支持 `string | JSX.Element | Function`
- 新：`items: SwitchTabItemType[]`，其中 `label` 仅支持 `string`
- 迁移时必须将 `options` 改为 `items`，并确保 `label` 为纯字符串

### 3. onChange 回调签名不同
- 旧：`onChange?: (data: TabExtendItem) => void` -- 返回完整的选项对象（含 value、label、disabled、width、x 等布局信息）
- 新：`onChange?: (value: number | string, index: number) => void` -- 仅返回 value 和 index
- 如果迁移前依赖 `data.label` 等字段，需要从 items 数组中手动查找

### 4. 大量功能无法迁移
以下旧组件的核心能力在 SwitchTab 中完全不存在，无法通过简单属性映射实现：
- **滚动模式**（scrollable）
- **下划线动画指示器**（animatedValue、activeUnderlineStyle、suteTabUnderLineWidth 等）
- **9 种样式类型**（tabType），SwitchTab 仅一种固定样式
- **自定义渲染**（renderItem、renderCutomItemContent）
- **渐变色背景**（customGradientColors、unSelectGradientColors、LinearGradient）
- **选中箭头**（customSelectedTriangle）
- **单项禁用**（TabItem.disabled），SwitchTab 仅支持全局 disabled
- **布局控制**（isBalanced、justifyContent）
- **ref 方法调用**（scrollTo）

### 5. 尺寸机制不同
- 旧：通过 itemStyle/textStyle/activeTextStyle 等自由控制尺寸
- 新：通过 size 属性选择预设尺寸（L: 90x28px/78x28px, S: 84x25px/72x25px），或通过 itemStyle 自定义

### 6. 禁用机制不同
- 旧：每个 TabItem 可独立设置 `disabled` 属性
- 新：仅支持全局 `disabled`，影响所有选项

## 注意事项

1. **绝大多数场景无法直接迁移**：Tab 组件的使用场景远超 SwitchTab 的能力范围，请先评估是否属于可迁移的简单场景
2. **scrollable 场景需自行实现**：如果使用了滚动选项卡，需要自行基于 ScrollView 实现
3. **下划线动画需自行实现**：SwitchTab 的选中指示为白色背景块，不是下划线动画
4. **label 必须简化为纯字符串**：使用函数或 JSX 渲染 label 的场景无法迁移
5. **onChange 回调需要适配**：注意回调参数从完整对象变为 (value, index) 的变化
6. **options 改为 items**：属性名变更，需要全局搜索替换
7. **单项禁用需自行处理**：如果依赖单项 disabled，需要在 onChange 中自行判断
8. **Class 组件变为函数组件**：旧 Tab 是 Class 组件，支持 ref 调用 scrollTo 等方法；新 SwitchTab 是函数组件，无实例方法
9. **渐变色完全移除**：SwitchTab 无 LinearGradient 依赖，选中和未选中均为纯色

## 迁移检查清单

- [ ] 评估当前使用的 tabType，确认是否属于可迁移的简单场景
- [ ] 确认选项数量不超过 3 个
- [ ] 确认 label 均为纯字符串，不含 JSX 或函数渲染
- [ ] 确认未使用 scrollable 滚动模式
- [ ] 确认未使用 renderItem 或 renderCutomItemContent 自定义渲染
- [ ] 确认未依赖下划线动画指示器
- [ ] 将 `options` 属性重命名为 `items`
- [ ] 适配 `onChange` 回调签名：从 `(data) => data.value` 改为 `(value, index) => value`
- [ ] 移除所有 underline 相关属性
- [ ] 移除 tabType、isBalanced、justifyContent 等布局属性
- [ ] 移除 customGradientColors、unSelectGradientColors 等渐变色属性
- [ ] 将单项 disabled 改为全局 disabled，或在 onChange 中自行过滤
- [ ] 移除 ref 引用和 scrollTo 方法调用
- [ ] 确认视觉效果差异是否可接受（从下划线/渐变色变为白色背景块）
- [ ] 测试 2 项和 3 项场景的宽度是否符合预期
