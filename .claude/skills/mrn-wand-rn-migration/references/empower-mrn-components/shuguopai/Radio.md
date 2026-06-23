# Radio 单选框

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **源路径**: `shuguopai/components/radio`
- **目标库**: `@sfe/wand-rn`
- **目标路径**: `src/components/radio`

## 旧组件 API

### Radio 组件

```tsx
interface RadioOptionItem {
    label: string
    value: any
    isDisable?: boolean
}

interface RadioProps {
    activeStyle?: StyleProp<TextStyle>
    checkedValue?: any
    options: RadioOptionItem[]
    onChange?: (checkedValue: any) => void
    renderItemView?: (item: RadioOptionItem, index: number) => JSX.Element
    showScrollIndicator?: boolean
}
```

**关键特性**：
- 类组件实现，基于 ScrollView 包装
- `checkedValue` 用于控制当前选中值
- `renderItemView` 支持自定义渲染单项
- 使用 Icon 组件展示选中状态（check 图标）
- 选中/禁用文本颜色自动变更
- 固定行高 56px，内边距 16px

## 新组件 API

### Radio 组件

```tsx
export enum RadioModeEnum {
    DEFAULT = 'default',
    TICK = 'tick'
}

export enum LabelPositionEnum {
    LEFT = 'left',
    RIGHT = 'right'
}

interface RadioProps {
    block?: boolean
    checked?: boolean
    children?: React.ReactNode | (() => React.ReactNode)
    disabled?: boolean
    labelPosition?: 'left' | 'right'
    type?: string  // RadioModeEnum: 'default' | 'tick'
    value?: RadioValue  // number | string
    style?: ViewStyle
    onChange?: (value: boolean) => void
}
```

### RadioGroup 组件

```tsx
interface RadioGroupProps extends Omit<RadioProps, 'checked' | 'onChange'> {
    options?: RadioOptionItem[]
    checkedValue?: RadioValue
    direction?: 'horizontal' | 'vertical'
    spaceSize?: SpaceSize
    radioStyle?: ViewStyle
    labelStyle?: TextStyle
    onChange?: (value: RadioValue) => void
}

interface RadioOptionItem {
    label?: string | React.ReactNode
    value: RadioValue
    disabled?: boolean
}
```

**关键特性**：
- 函数组件实现，支持 Hooks
- 支持 `Radio` 单个使用或 `Radio.Group` 组合使用
- `type` 支持两种模式：'default'（圆形）和 'tick'（勾号）
- `labelPosition` 支持标签位置切换（left / right）
- `block` 模式下为块级展示
- `direction` 支持水平/垂直方向
- `spaceSize` 自定义间距大小
- 支持自定义 `radioStyle` 和 `labelStyle`

## 迁移对照表

### 组件级别

| 旧组件 | 新组件 | 说明 |
|--------|--------|------|
| `<Radio />` | `<Radio.Group />` 或 `<Radio />` | 旧组件为单纯的选项列表容器，新组件拆分为单选和分组两种用法 |

### Props 对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| `checkedValue` | `Radio.Group` 的 `checkedValue` 或 `<Radio>` 的 `checked` | 控制选中状态，与组件使用方式相关 |
| `options` | `Radio.Group` 的 `options` | 配置选项列表 |
| `onChange` | `Radio.Group` 的 `onChange` 或 `<Radio>` 的 `onChange` | 选中变更回调 |
| `renderItemView` | 无对应属性 | 使用 `options` 配置中的 `label` 字段或自定义渲染 `<Radio>` 子元素 |
| `activeStyle` | `labelStyle` | 选中状态文本样式，迁移到 Group 的 `labelStyle` prop |
| `showScrollIndicator` | 无对应属性 | 新组件使用 `Space` 或 `View` 包装，不再内置 ScrollView |
| `isDisable` 在选项中 | `disabled` 在选项中 | 禁用状态属性名变更 |

## 迁移示例

### 案例 1：基础列表选择（使用 RadioGroup）

```tsx
// 迁移前
<Radio
  options={[
    { label: '选项1', value: 'opt1' },
    { label: '选项2', value: 'opt2' },
    { label: '选项3', value: 'opt3', isDisable: true }
  ]}
  checkedValue={selectedValue}
  onChange={(value) => setSelectedValue(value)}
/>

// 迁移后
<Radio.Group
  options={[
    { label: '选项1', value: 'opt1' },
    { label: '选项2', value: 'opt2' },
    { label: '选项3', value: 'opt3', disabled: true }
  ]}
  checkedValue={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  direction="vertical"
  block
/>
```

### 案例 2：自定义样式

```tsx
// 迁移前
<Radio
  options={[
    { label: '高优先级', value: 'high' },
    { label: '低优先级', value: 'low' }
  ]}
  checkedValue={priority}
  onChange={setPriority}
  activeStyle={{ color: '#FF0000', fontSize: 16 }}
/>

// 迁移后
<Radio.Group
  options={[
    { label: '高优先级', value: 'high' },
    { label: '低优先级', value: 'low' }
  ]}
  checkedValue={priority}
  onChange={setPriority}
  labelStyle={{ fontSize: 16, color: '#666' }}
  direction="vertical"
  block
/>
```

### 案例 3：使用单个 Radio 组件

```tsx
// 迁移前 - 通常无这种用法，Radio 主要用于列表

// 迁移后 - 支持单个使用
<View>
  <Radio 
    value={1} 
    checked={selectedId === 1}
    onChange={(checked) => checked && setSelectedId(1)}
  >
    选项一
  </Radio>
  <Radio 
    value={2} 
    checked={selectedId === 2}
    onChange={(checked) => checked && setSelectedId(2)}
  >
    选项二
  </Radio>
</View>
```

### 案例 4：使用 Group 包装多个 Radio

```tsx
// 迁移前 - 列表方式

// 迁移后 - 组件组合方式
<Radio.Group
  checkedValue={selectedValue}
  onChange={setSelectedValue}
  direction="vertical"
  block
>
  <Radio value="option1">选项一</Radio>
  <Radio value="option2">选项二</Radio>
  <Radio value="option3" disabled>选项三（禁用）</Radio>
</Radio.Group>
```

### 案例 5：不同选择模式

```tsx
// 迁移前 - 仅支持 checkmark 模式

// 迁移后 - 支持 tick 模式（勾号）
<Radio.Group
  options={[
    { label: '赞成', value: 'yes' },
    { label: '反对', value: 'no' }
  ]}
  checkedValue={vote}
  onChange={setVote}
  type="tick"  // 使用 tick 模式显示为勾号，而非圆圈
  block
/>
```

## 关键迁移点

### 1. 组件结构变更
- **旧**: `<Radio options={...} />` - 单一组件承载列表
- **新**: `<Radio.Group>` 或 `<Radio>` - 按需使用组合或单个

### 2. 配置选项格式
- **旧**: `isDisable?: boolean`
- **新**: `disabled?: boolean`
- 两处都要改：单个 Radio props 和 options 配置中

### 3. 回调函数签名
- **旧**: `onChange?: (checkedValue: any) => void`
- **新**: 
  - `Radio.Group` 的 `onChange?: (value: RadioValue) => void`
  - `Radio` 的 `onChange?: (value: boolean) => void`

### 4. 样式处理
- **旧**: 通过 `activeStyle` 自定义选中文本样式
- **新**: 使用 `labelStyle` 统一应用所有标签样式
- 旧的样式覆盖逻辑需要改为通过 CSS-in-JS 或主题配置

### 5. ScrollView 移除
- **旧**: 内置 ScrollView 包装
- **新**: 无内置滚动，若需要滚动请外层包装 ScrollView 或使用 Space 组件
- 移除 `showScrollIndicator` prop

### 6. 自定义渲染
- **旧**: `renderItemView` 回调函数提供完全自由度
- **新**: 通过 `label` 字段支持 React.ReactNode，或使用子元素方式
- 如需复杂自定义，直接使用多个 `<Radio>` 组件而非 `options` 配置

### 7. 默认行为
- **旧**: 固定高度 56px，固定内边距 16px
- **新**: 灵活的布局，需要通过 `radioStyle` 或外层包装控制尺寸

## 常见问题

**Q: 如何在新组件中实现自定义渲染？**
A: 有两种方式：
1. 使用 `options` 的 `label` 字段传递 React 元素
2. 直接使用多个 `<Radio>` 组件作为 `<Radio.Group>` 的子元素

**Q: 旧组件的固定尺寸在哪里控制？**
A: 新组件通过 `radioStyle` 控制单选按钮样式，通过外层 View 或 Space 控制整体布局。

**Q: 如何实现水平排列？**
A: 使用 `<Radio.Group direction="horizontal">` 或 `direction="horizontal"`。

**Q: 选中项的文字颜色怎么改？**
A: 使用 `labelStyle` prop 自定义标签样式。

**Q: 如何处理 renderItemView 的复杂逻辑？**
A: 放弃使用 `options` 配置，改为直接编写多个 `<Radio>` 组件，在每个 Radio 内部编写自定义内容。

## 迁移检查清单

- [ ] 替换导入语句：`import { Radio } from '@sfe/wand-rn'`
- [ ] 决定使用 `<Radio.Group>` 还是 `<Radio>` 单个模式
- [ ] 将 `options` 中的 `isDisable` 改为 `disabled`
- [ ] 将 `activeStyle` 迁移到 `labelStyle`（如果有）
- [ ] 验证回调函数签名（单 Radio vs Group Radio）
- [ ] 删除 `renderItemView` 相关代码，改用 options.label 或子元素
- [ ] 删除 `showScrollIndicator` 相关代码
- [ ] 设置 `direction` 和 `block` 属性以匹配旧样式
- [ ] 如需固定尺寸，使用 `radioStyle` 或外层 View 包装
- [ ] 设备测试验证功能和样式
