# Radio 单选框

## 从何处迁移
- **源库**: `@ss/mtd-react-native`
- **目标库**: `@sfe/wand-rn`
- **目标组件**: `Radio`

## 架构差异（重要）

两个库的 Radio 组件**架构完全不同**，不能简单替换导入路径，需要重构用法。

| 维度 | @ss/mtd-react-native | @sfe/wand-rn |
|------|---------------------|--------------|
| 组件范式 | Class Component | Function Component |
| 子组件 | `Radio.Item` (RadioItem) | 无 Item，单个 `Radio` 即可 |
| 分组 | `Radio` 本身就是分组容器 | `Radio.Group` 独立分组组件 |
| 选中值 | `checkedValue: string \| number` 传入容器 | `checkedValue: RadioValue` 传入 Group（兼容 Form context） |
| 单项标识 | `value: string \| number` 在 Item 上 | `value: string \| number` 在 Radio 上 |
| Icon 类型 | `type: 'check' \| 'circle'` | `type: 'default' \| 'tick'` |
| Icon 位置 | `iconPosition: 'left' \| 'right'` | `labelPosition: 'left' \| 'right'`（语义相反） |
| Form 集成 | 通过 `FormItemConsumer` | 通过 `RadioGroupContext`（支持 `checkedValue` 来自 Form） |
| 动画 | 无 | 内置选中/取消选中缩放动画 |
| 布局方向 | 仅垂直 | 支持 `direction: 'horizontal' \| 'vertical'` |

## 旧组件 API

### Radio（容器/分组组件）

```tsx
interface RadioProps {
    iconPosition?: 'left' | 'right'            // Icon 位置，默认 'left'
    children: ReactChild[]                      // Radio.Item 子元素
    checkedValue: string | number               // 已选中项的值
    type?: 'check' | 'circle'                   // Icon 类型，默认 'check'
    renderIcon?: (checked: boolean, disabled: boolean, theme: Theme) => JSX.Element
    style?: StyleProp<ViewStyle>                // 容器样式
    onChange?: (value: string | number) => void  // 选中值变化回调
    styles?: Partial<RadioStyles>               // 主题样式覆盖
}
```

### Radio.Item（单选项）

```tsx
interface RadioItemProps {
    label?: string | JSX.Element               // 选项文案
    value: string | number                     // 选项值
    disabled?: boolean                         // 是否禁用
    checked?: boolean                          // 内部由容器控制
    iconPosition?: 'left' | 'right'            // 内部由容器传入
    hasLine?: boolean                          // 是否有下划线
    type?: 'check' | 'circle'                  // Icon 类型
    renderIcon?: (checked: boolean, disabled: boolean, theme: Theme) => JSX.Element
    _onChange?: (value: string | number) => void  // 内部回调
    onChange?: (isChecked: boolean) => void     // 单项选中状态变化回调
    renderItem?: (checked: boolean) => JSX.Element  // 自定义渲染
    iconSize?: number                          // 自定义 Icon 大小，默认 24
    styles?: Partial<RadioStyles>              // 主题样式覆盖
}
```

## 新组件 API

### Radio（单个单选框）

```tsx
interface RadioProps {
    block?: boolean                            // 块级模式（卡片样式）
    checked?: boolean                          // 指定当前是否选中（非 Group 模式）
    children?: React.ReactNode | (() => React.ReactNode)
    disabled?: boolean
    labelPosition?: 'left' | 'right'           // 标签位置
    type?: 'default' | 'tick'                  // 选中类型：default=圆点，tick=勾选
    value?: string | number                    // 组件标记值（Group 模式必需）
    style?: ViewStyle
    onChange?: (value: boolean) => void         // 单项变化回调（参数为是否选中）
}
```

### Radio.Group（分组）

```tsx
interface RadioGroupProps {
    block?: boolean                            // 块级模式
    disabled?: boolean                         // 全组禁用
    options?: RadioOptionItem[]                // 选项配置（简写模式）
    checkedValue?: string | number             // 选中值（兼容 Form context）
    value?: string | number                    // 选中值（等效于 checkedValue）
    direction?: 'horizontal' | 'vertical'      // 布局方向
    labelPosition?: 'left' | 'right'           // 全组标签位置
    spaceSize?: SpaceSize                      // 间距大小，默认 'xl'
    radioStyle?: ViewStyle                     // 每个 Radio 的样式
    labelStyle?: TextStyle                     // 每个 Radio 标签的样式
    type?: 'default' | 'tick'                  // 全组 Icon 类型
    style?: ViewStyle
    onChange?: (value: string | number) => void // 选中值变化回调
}

interface RadioOptionItem {
    label?: string | React.ReactNode
    value: string | number
    disabled?: boolean
}
```

## 迁移对照表

### 容器层（Radio → Radio.Group）

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| `checkedValue` | `checkedValue` 或 `value` | **兼容**，新版同时支持两个属性名（`checkedValue` 兼容 Form context） |
| `onChange` | `onChange` | **签名兼容**，均为 `(value: string \| number) => void` |
| `iconPosition` | `labelPosition` | **语义相反**：旧版 `iconPosition='right'` → 新版 `labelPosition='left'`（见映射表） |
| `type` | `type` | **值变更**：旧 `'check'` → 新 `'tick'`，旧 `'circle'` → 新 `'default'` |
| `renderIcon` | — | **删除**，新组件不支持自定义 icon |
| `style` | `style` | 兼容 |
| `children` | `children` 或 `options` | 兼容子元素方式；新增 `options` 简写模式 |
| `styles` | — | **删除**，新组件不支持主题样式覆盖 prop |
| — | `direction` | 新增：支持水平/垂直布局 |
| — | `block` | 新增：块级卡片模式 |
| — | `spaceSize` | 新增：间距控制 |
| — | `radioStyle` | 新增：统一每个 Radio 的样式 |
| — | `labelStyle` | 新增：统一标签样式 |

### 单项层（Radio.Item → Radio）

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| `label` | `children` | 文案。旧版 `label` 为 string 或 JSX.Element，新版 `children` 为 ReactNode 或 render function |
| `value` | `value` | **兼容** |
| `disabled` | `disabled` | **兼容** |
| `checked` | — | 删除。由 Group 的 `checkedValue`/`value` 控制 |
| `hasLine` | — | **删除**，新组件无内置分割线 |
| `type` | `type` | 继承 Group 或单独设置，值映射：`'check'` → `'tick'`，`'circle'` → `'default'` |
| `renderIcon` | — | **删除** |
| `renderItem` | `children` (render function) | 自定义渲染改用 children render function |
| `iconSize` | — | **删除**，新组件 icon 大小固定 |
| `onChange` | `onChange` | **签名变更**：旧版 `(isChecked: boolean) => void`，新版 `(value: boolean) => void`，语义兼容 |
| `style` | `style` | 兼容 |
| `styles` | — | 删除 |

### type 值映射

| 旧 type | 新 type | 视觉效果 |
|---------|---------|---------|
| `'check'` | `'tick'` | 选中时显示勾选标记 |
| `'circle'` | `'default'` | 选中时显示实心圆点 |

### iconPosition vs labelPosition 映射

| 旧 iconPosition | 新 labelPosition | 实际布局 |
|-----------------|------------------|---------|
| `'left'` | `'right'`（inline 默认值，可省略） | 左图标 右文字 |
| `'right'` | `'left'` | 左文字 右图标 |

## 迁移示例

### 案例 1：基础单选列表（type='check' 对勾模式）

```tsx
// 迁移前
import { Radio } from '@ss/mtd-react-native'

<Radio
    checkedValue={selected}
    type="check"
    onChange={(value) => setSelected(value)}>
    <Radio.Item label="选项A" value="a" />
    <Radio.Item label="选项B" value="b" />
    <Radio.Item label="选项C" value="c" />
</Radio>

// 迁移后
import { Radio } from '@sfe/wand-rn'

<Radio.Group
    checkedValue={selected}
    type="tick"
    onChange={(value) => setSelected(value)}>
    <Radio value="a" block>选项A</Radio>
    <Radio value="b" block>选项B</Radio>
    <Radio value="c" block>选项C</Radio>
</Radio.Group>
```

### 案例 2：圆点模式（type='circle'）

```tsx
// 迁移前
<Radio checkedValue={selected} type="circle" onChange={setSelected}>
    <Radio.Item label="男" value="male" />
    <Radio.Item label="女" value="female" />
</Radio>

// 迁移后
<Radio.Group checkedValue={selected} type="default" onChange={setSelected}>
    <Radio value="male">男</Radio>
    <Radio value="female">女</Radio>
</Radio.Group>
```

### 案例 3：使用 options 简写（新版独有）

```tsx
// 迁移前
<Radio checkedValue={selected} onChange={setSelected}>
    <Radio.Item label="选项A" value="a" />
    <Radio.Item label="选项B" value="b" />
    <Radio.Item label="选项C" value="c" disabled />
</Radio>

// 迁移后 — 使用 options 简写
<Radio.Group
    checkedValue={selected}
    onChange={setSelected}
    options={[
        { label: '选项A', value: 'a' },
        { label: '选项B', value: 'b' },
        { label: '选项C', value: 'c', disabled: true },
    ]}
/>
```

### 案例 4：iconPosition='right'（图标在右，文字在左）

```tsx
// 迁移前
<Radio iconPosition="right" checkedValue={selected} onChange={setSelected}>
    <Radio.Item label="选项" value="opt" />
</Radio>

// 迁移后
<Radio.Group
    checkedValue={selected}
    labelPosition="left"
    onChange={setSelected}>
    <Radio value="opt" block>选项</Radio>
</Radio.Group>
```

### 案例 5：禁用选项

```tsx
// 迁移前
<Radio checkedValue={selected} onChange={setSelected}>
    <Radio.Item label="可选" value="a" />
    <Radio.Item label="禁用" value="b" disabled />
</Radio>

// 迁移后
<Radio.Group checkedValue={selected} onChange={setSelected}>
    <Radio value="a" block>可选</Radio>
    <Radio value="b" block disabled>禁用</Radio>
</Radio.Group>
```

### 案例 6：自定义渲染（renderItem → children）

```tsx
// 迁移前
<Radio checkedValue={selected} onChange={setSelected}>
    <Radio.Item
        value="a"
        renderItem={(checked) => (
            <View style={checked ? styles.activeCard : styles.card}>
                <Text>自定义内容A</Text>
            </View>
        )}
    />
    <Radio.Item
        value="b"
        renderItem={(checked) => (
            <View style={checked ? styles.activeCard : styles.card}>
                <Text>自定义内容B</Text>
            </View>
        )}
    />
</Radio>

// 迁移后
<Radio.Group checkedValue={selected} onChange={setSelected}>
    <Radio value="a">
        {() => {
            const checked = selected === 'a'
            return (
                <View style={checked ? styles.activeCard : styles.card}>
                    <Text>自定义内容A</Text>
                </View>
            )
        }}
    </Radio>
    <Radio value="b">
        {() => {
            const checked = selected === 'b'
            return (
                <View style={checked ? styles.activeCard : styles.card}>
                    <Text>自定义内容B</Text>
                </View>
            )
        }}
    </Radio>
</Radio.Group>
```

### 案例 7：水平布局（新能力）

```tsx
// 迁移前 — mtd-react-native 仅支持垂直布局
// 如果需要水平布局，旧版需要自行包裹 flex 容器

// 迁移后
<Radio.Group
    checkedValue={selected}
    direction="horizontal"
    onChange={setSelected}>
    <Radio value="a">选项A</Radio>
    <Radio value="b">选项B</Radio>
    <Radio value="c">选项C</Radio>
</Radio.Group>
```

### 案例 8：带分割线样式（手动实现）

```tsx
// 迁移前
<Radio checkedValue={selected} onChange={setSelected}>
    <Radio.Item label="A" value="a" hasLine />
    <Radio.Item label="B" value="b" hasLine />
    <Radio.Item label="C" value="c" />
</Radio>

// 迁移后（新组件无 hasLine，需用外层 View + borderBottom 实现）
<Radio.Group checkedValue={selected} onChange={setSelected}>
    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' }}>
        <Radio value="a" block>A</Radio>
    </View>
    <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' }}>
        <Radio value="b" block>B</Radio>
    </View>
    <Radio value="c" block>C</Radio>
</Radio.Group>
```

## 关键点

1. **架构变更**：旧版 `Radio` 是分组容器 + `Radio.Item` 子项；新版 `Radio` 是独立单选框 + `Radio.Group` 分组容器
2. **checkedValue 属性兼容**：新版 `Radio.Group` 同样支持 `checkedValue` 属性名（兼容 Form context），迁移时可保留
3. **onChange 签名兼容**：容器级 `onChange` 签名均为 `(value: string | number) => void`，可直接迁移
4. **type 值变更**：`'check'` → `'tick'`（勾选模式），`'circle'` → `'default'`（圆点模式）
5. **iconPosition → labelPosition**：语义相反。旧版 `iconPosition='right'` 等于新版 `labelPosition='left'`
6. **label → children**：旧版 `Radio.Item` 用 `label` prop 传文案，新版用 `children`
7. **renderIcon / renderItem 移除**：自定义 icon 不再支持；自定义渲染改用 children render function
8. **hasLine 移除**：新组件无内置分割线，需用外层样式实现
9. **新增 block 模式**：启用后显示为卡片样式（带边框背景），列表场景通常需要加 `block`
10. **新增 direction 支持**：支持 `'horizontal'` 水平布局，旧版只能垂直
11. **内置动画**：新组件选中/取消选中有缩放动画效果，无需额外处理
