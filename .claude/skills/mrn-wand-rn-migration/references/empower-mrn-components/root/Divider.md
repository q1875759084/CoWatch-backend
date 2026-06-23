# Divider 分割线

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
import { Divider } from '@mtfe/empower-mrn-components'

export type DividerDirection = 'horizontal' | 'vertical'
export type DividerStyle = 'solid' | 'dash'

export interface DividerProps {
    direction?: DividerDirection       // 方向，默认 'horizontal'
    color?: string                     // 线条颜色，默认取主题变量 mtdDividerColor
    thickness?: number                 // 线条粗细（dp），默认取主题变量 mtdDividerThickness
    dividerStyle?: DividerStyle        // 线条样式，'solid' 或 'dash'，默认 'solid'
    dashArray?: number[]               // 虚线模式 [dashLength, gapLength]，默认取主题变量 mtdDividerDashArray
    marginStart?: number               // 水平时为左边距，垂直时为上边距，默认 0
    marginEnd?: number                 // 水平时为右边距，垂直时为下边距，默认 0
    useSVG?: boolean                   // 是否强制使用 SVG 渲染，默认取主题变量 mtdDividerUseSVG
    style?: StyleProp<ViewStyle>       // 额外样式
}

// 使用示例
<Divider direction="horizontal" color="#eee" thickness={1} />
```

## 新组件 API

```tsx
import { Divider } from '@sfe/wand-rn'

export interface DividerProps {
    height?: number                    // @deprecated 请使用 thickness 代替
    thickness?: number                 // 线的粗细，默认 0.5
    type?: 'horizontal' | 'vertical'   // 线的类型，默认 'horizontal'
    length?: number                    // 线的长度，水平默认 '100%'，垂直默认 9
    color?: string                     // 线条颜色，默认 '#EEEEEE'
    dashed?: boolean                   // 是否虚线，默认 false
    dashedProps?: {                    // 虚线设置
        length?: number                // 虚线长度，默认 6
        gap?: number                   // 虚线间隔，默认 4
    }
    margin?: number | number[]         // 线条外边距
}

// 使用示例
<Divider type="horizontal" color="#eee" thickness={1} />
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| direction | type | 属性名变更，取值相同 ('horizontal' \| 'vertical') |
| color | color | 保持一致 |
| thickness | thickness | 保持一致 |
| dividerStyle | dashed | 类型变更：字符串枚举 → 布尔值 |
| dashArray | dashedProps | 结构变更：数组 → 对象 |
| marginStart / marginEnd | margin | 合并为单一属性，支持数字或数组 |
| useSVG | - | 移除，新组件内部自动处理渲染方式 |
| style | - | 移除，新组件不支持自定义 style |
| - | length | 新增，控制线的长度 |
| - | height | 新增但已废弃，使用 thickness 代替 |

## 关键变更

### 1. direction → type

属性名从 `direction` 改为 `type`，取值不变。

### 2. dividerStyle → dashed

旧组件使用字符串枚举 `'solid' | 'dash'`，新组件使用布尔值 `dashed`：
- `dividerStyle="solid"` → `dashed={false}` 或省略（默认 false）
- `dividerStyle="dash"` → `dashed={true}`

### 3. dashArray → dashedProps

旧组件使用数组 `[dashLength, gapLength]`，新组件使用对象 `{ length, gap }`：
- `dashArray={[8, 4]}` → `dashedProps={{ length: 8, gap: 4 }}`

### 4. marginStart/marginEnd → margin

旧组件使用两个独立属性，新组件合并为一个 `margin` 属性：
- `marginStart={16} marginEnd={16}` → `margin={16}`（四边相同）
- `marginStart={16} marginEnd={0}` → `margin={[0, 16, 0, 0]}`（需要用数组精确控制）

### 5. 默认值差异

| 属性 | 旧默认值 | 新默认值 |
|------|---------|---------|
| thickness | 主题变量 | 0.5 |
| color | 主题变量 | '#EEEEEE' |

### 6. 垂直虚线限制

新组件仅支持**水平虚线**（`type="horizontal"` + `dashed={true}`）。垂直方向的虚线在新组件中不支持。

## flower-rn 关系

wand-rn 的 Divider 从 flower-rn fork 而来，两者接口完全相同。

## 迁移示例

### 案例 1：基础水平分割线

```tsx
// 迁移前
<Divider />

// 迁移后
<Divider />
```

### 案例 2：指定方向

```tsx
// 迁移前
<Divider direction="horizontal" />

// 迁移后
<Divider type="horizontal" />
```

### 案例 3：垂直分割线

```tsx
// 迁移前
<Divider direction="vertical" color="#ddd" thickness={1} />

// 迁移后
<Divider type="vertical" color="#ddd" thickness={1} />
```

### 案例 4：虚线样式

```tsx
// 迁移前
<Divider dividerStyle="dash" />

// 迁移后
<Divider dashed />
```

### 案例 5：自定义虚线模式

```tsx
// 迁移前
<Divider dividerStyle="dash" dashArray={[8, 4]} />

// 迁移后
<Divider dashed dashedProps={{ length: 8, gap: 4 }} />
```

### 案例 6：带边距

```tsx
// 迁移前
<Divider marginStart={16} marginEnd={16} />

// 迁移后
<Divider margin={[0, 16]} />
```

### 案例 7：仅左边距

```tsx
// 迁移前
<Divider marginStart={16} marginEnd={0} />

// 迁移后
<Divider margin={[0, 16, 0, 0]} />
```

### 案例 8：自定义颜色和粗细

```tsx
// 迁移前
<Divider color="#FF8D62" thickness={2} />

// 迁移后
<Divider color="#FF8D62" thickness={2} />
```

### 案例 9：列表项分割线

```tsx
// 迁移前
<View>
  <ListItem title="选项一" />
  <Divider direction="horizontal" marginStart={16} color="#eee" />
  <ListItem title="选项二" />
</View>

// 迁移后
<View>
  <ListItem title="选项一" />
  <Divider type="horizontal" margin={[0, 16, 0, 0]} color="#eee" />
  <ListItem title="选项二" />
</View>
```

### 案例 10：完整属性迁移

```tsx
// 迁移前
<Divider
  direction="horizontal"
  color="#ddd"
  thickness={1}
  dividerStyle="dash"
  dashArray={[6, 3]}
  marginStart={12}
  marginEnd={12}
  useSVG={true}
  style={{ marginVertical: 8 }}
/>

// 迁移后
<View style={{ marginVertical: 8 }}>
  <Divider
    type="horizontal"
    color="#ddd"
    thickness={1}
    dashed
    dashedProps={{ length: 6, gap: 3 }}
    margin={[0, 12]}
  />
</View>
```

## 关键点

- **属性名变更**：`direction` → `type`，取值相同。
- **虚线配置变更**：`dividerStyle="dash"` → `dashed={true}`，`dashArray` → `dashedProps` 对象。
- **边距合并**：`marginStart`/`marginEnd` 合并为 `margin` 属性。
- **useSVG 移除**：新组件内部自动选择渲染方式。
- **style 移除**：新组件不暴露自定义 style 属性，如需外部样式需包裹 View。
- **垂直虚线不支持**：新组件仅支持水平虚线。如果旧代码使用垂直虚线，需自行实现。
- **默认粗细差异**：旧组件默认值来自主题变量，新组件固定 0.5dp。

## 迁移策略

### 第一步：批量替换属性名

1. `direction=` → `type=`
2. `dividerStyle="solid"` → 删除该属性（默认值即 solid）
3. `dividerStyle="dash"` → `dashed`

### 第二步：转换虚线配置

将 `dashArray={[x, y]}` 替换为 `dashedProps={{ length: x, gap: y }}`。

### 第三步：合并边距属性

将 `marginStart` 和 `marginEnd` 合并为 `margin`。

### 第四步：移除不支持的属性

删除 `useSVG`、`style` 属性。如果 `style` 中有重要样式，将其移至外层包裹 View。

### 第五步：验证

- 确认分割线方向、颜色、粗细正确
- 确认虚线样式正确
- 确认边距符合预期
- 特别注意垂直虚线场景

## 常见问题

### Q: useSVG 属性移除了，渲染效果会有差异吗？
A: 新组件内部使用 SVG 渲染虚线，View 渲染实线，效果与旧组件基本一致。

### Q: 旧组件的主题变量默认值在新组件中如何处理？
A: 新组件使用固定默认值（thickness: 0.5, color: '#EEEEEE'）。如果项目依赖旧的主题变量，需显式传入对应值。

### Q: margin 属性支持哪些格式？
A: 支持单个数字（四边相同）或数组。数组格式遵循 CSS margin 规则：`[上下, 左右]` 或 `[上, 右, 下, 左]`。

### Q: 垂直虚线怎么办？
A: 新组件不支持垂直虚线。如有此需求，可自行使用 SVG 实现，或使用多个短 View 模拟虚线效果。

## 注意事项

1. **类型导出变化**：旧组件导出 `DividerDirection`、`DividerStyle` 类型，新组件的 `type` 和 `dashed` 使用基础类型，无需额外导入。
2. **渲染依赖变化**：旧组件可能依赖 `react-native-dash` 包，迁移后可移除该依赖（如项目无其他使用处）。
3. **flower-rn 一致**：如果项目中同时使用 `@sgfe/flower-rn` 的 Divider，迁移方式相同（flower-rn 与 wand-rn 接口完全一致）。
