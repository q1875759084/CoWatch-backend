# Row 栅格行

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
type RowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
type RowAligns = 'top' | 'middle' | 'bottom' | 'stretch'
type Gutter = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | number | undefined

interface RowProps {
    /** 栅格间隔，可选值: 字符串或数字，或数组 [水平间距, 垂直间距] */
    gutter?: Gutter | [Gutter, Gutter]
    /** 垂直对齐方式，可选值: top | middle | bottom | stretch */
    align?: RowAligns
    /** 水平排列方式，可选值: start | end | center | space-around | space-between | space-evenly */
    justify?: RowJustify
    /** 是否自动换行，默认 true */
    wrap?: boolean
    /** 样式 */
    style?: ViewStyle
    /** 内容 */
    children?: React.ReactNode
}
```

## 新组件 API

```tsx
type RowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
type RowAligns = 'top' | 'middle' | 'bottom' | 'stretch'
type Gutter = '2xs' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | 'xxxl' | '3xl' | number | undefined

interface RowProps {
    /** 栅格间隔，可选值: 字符串或数字，或数组 [水平间距, 垂直间距] */
    gutter?: Gutter | Gutter[]
    /** 垂直对齐方式，可选值: top | middle | bottom | stretch */
    align?: RowAligns
    /** 水平排列方式，可选值: start | end | center | space-around | space-between | space-evenly */
    justify?: RowJustify
    /** 是否自动换行，默认 true */
    wrap?: boolean
    /** 样式 */
    style?: ViewStyle
    /** 内容 */
    children?: React.ReactNode
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| `gutter` | `gutter` | Gutter 字符串值的像素数值发生变化 |
| `align` | `align` | 保持不变 |
| `justify` | `justify` | 保持不变 |
| `wrap` | `wrap` | 保持不变 |
| `style` | `style` | 保持不变 |
| `children` | `children` | 保持不变 |

## 关键变更

### 1. Gutter 字符串值的像素映射变化

虽然 Row 组件支持的 Props 基本相同，但 Gutter 字符串值对应的实际像素值发生了变化。这是最重要的迁移考虑：

**flower-rn Gutter 映射**：
- `'xxs'` → 2px
- `'xs'` → 4px
- `'s'` → 8px
- `'m'` → 12px
- `'l'` → 16px
- `'xl'` → 20px
- `'xxl'` → 24px

**wand-rn Gutter 映射**（新值）：
- `'2xs'` / `'xxs'` → 2px（`xxs` 别名保留，新增 `2xs`）
- `'xs'` → 4px（保持不变）
- `'s'` → 8px（保持不变）
- `'m'` → 12px（保持不变）
- `'l'` → 14px ⚠️ **从 16px 改为 14px**
- `'xl'` → 16px ⚠️ **从 20px 改为 16px**
- `'xxl'` → 20px ⚠️ **从 24px 改为 20px**（推荐改用 `'2xl'`）
- `'2xl'` → 20px（新增别名）
- `'xxxl'` → 24px（新增）
- `'3xl'` → 24px（新增别名）

### 2. Gutter 类型数组形式保持一致

虽然 TypeScript 类型有细微差异（`[Gutter, Gutter]` vs `Gutter[]`），但使用上完全兼容：

```tsx
// 迁移前
<Row gutter={[16, 8]}>  // 水平 16px，垂直 8px

// 迁移后
<Row gutter={[16, 8]}>  // 同样效果
```

### 3. 新增 Gutter 选项

新库增加了更多 Gutter 预设值以提供更细粒度的间距控制。可选择使用新增的值：

```tsx
// 新库特有
<Row gutter="3xl">  // 对应 24px
<Row gutter="xxxl">  // 对应 24px（同义词）
```

### 4. justify 值保持一致

所有 `justify` 的值和含义完全保持一致，无需修改。

## 迁移示例

### 案例 1：基础行布局

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row justify="start" align="top">
    <Col span={6}>左列</Col>
    <Col span={6}>右列</Col>
</Row>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row justify="start" align="top">
    <Col span={6}>左列</Col>
    <Col span={6}>右列</Col>
</Row>
```

### 案例 2：使用小间距（无需修改）

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row gutter="m">  {/* 12px 间距 */}
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
</Row>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row gutter="m">  {/* 仍然是 12px 间距，无需修改 */}
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
</Row>
```

### 案例 3：使用大间距（数值变化，需验证）

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row gutter="l">  {/* 16px 间距 */}
    <Col span={6}>内容</Col>
    <Col span={6}>内容</Col>
</Row>

// 迁移后（间距变化）
import { Row, Col } from '@sfe/wand-rn'

<Row gutter="l">  {/* 现在是 14px 间距，需要检查是否满足设计需求 */}
    <Col span={6}>内容</Col>
    <Col span={6}>内容</Col>
</Row>

// 如果需要保持 16px，改用数值
<Row gutter={16}>  {/* 明确指定像素值 */}
    <Col span={6}>内容</Col>
    <Col span={6}>内容</Col>
</Row>
```

### 案例 4：使用超大间距（推荐改名）

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row gutter="xxl">  {/* 24px 间距 */}
    <Col span={3}>内容</Col>
    <Col span={3}>内容</Col>
    <Col span={3}>内容</Col>
    <Col span={3}>内容</Col>
</Row>

// 迁移方案 1：使用新的别名（推荐）
import { Row, Col } from '@sfe/wand-rn'

<Row gutter="2xl">  {/* 新库中推荐使用 2xl，同样是 24px */}
    <Col span={3}>内容</Col>
    <Col span={3}>内容</Col>
    <Col span={3}>内容</Col>
    <Col span={3}>内容</Col>
</Row>

// 迁移方案 2：使用数值（最保险）
<Row gutter={24}>  {/* 明确指定像素值 */}
    <Col span={3}>内容</Col>
    <Col span={3}>内容</Col>
    <Col span={3}>内容</Col>
    <Col span={3}>内容</Col>
</Row>
```

### 案例 5：二维间距（水平 + 垂直）

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row gutter={['l', 'xs']}>  {/* 水平 16px，垂直 4px */}
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
</Row>

// 迁移后（注意水平间距变化）
import { Row, Col } from '@sfe/wand-rn'

<Row gutter={['l', 'xs']}>  {/* 水平 14px，垂直 4px（水平变化） */}
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
</Row>

// 或使用数值保证一致性
<Row gutter={[16, 4]}>  {/* 明确指定像素值 */}
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
</Row>
```

### 案例 6：justify 属性（完全相同）

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row justify="center">
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
</Row>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row justify="center">
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
    <Col span={4}>内容</Col>
</Row>
```

### 案例 7：align 属性（完全相同）

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row align="middle">
    <Col span={6}><View style={{ height: 100 }}>内容</View></Col>
    <Col span={6}>内容</Col>
</Row>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row align="middle">
    <Col span={6}><View style={{ height: 100 }}>内容</View></Col>
    <Col span={6}>内容</Col>
</Row>
```

### 案例 8：wrap 和 style

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row wrap={false} style={{ padding: 16 }}>
    <Col span={6}>内容</Col>
    <Col span={6}>内容</Col>
</Row>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row wrap={false} style={{ padding: 16 }}>
    <Col span={6}>内容</Col>
    <Col span={6}>内容</Col>
</Row>
```

## 关键点

- ✅ **大多数 Props 完全兼容**：`align`、`justify`、`wrap`、`style`、`children` 均保持不变
- ⚠️ **Gutter 字符串值的像素映射变化**：需要特别注意
  - `'l'`: 16px → 14px（**-2px**）
  - `'xl'`: 20px → 16px（**-4px**）
  - `'xxl'`: 24px → 20px（**-4px**，建议改用 `'2xl'`）
- ✅ **Gutter 数值形式保持一致**：使用 `number` 类型完全兼容
- ✅ **新增 Gutter 选项**：`'2xs'`、`'2xl'`、`'3xl'`、`'xxxl'` 提供更多选择
- 🔄 **迁移策略**：
  - 简单迁移：直接修改导入路径
  - 保险迁移：将 Gutter 字符串值改为数值形式，确保像素值一致
  - 推荐迁移：使用新库的新 Gutter 预设值

## 迁移步骤

1. **更新导入路径**：`@sgfe/flower-rn` → `@sfe/wand-rn`
2. **评估 Gutter 使用**：
   - 如果使用 `'xxs'`、`'xs'`、`'s'`、`'m'` 等小间距，无需修改
   - 如果使用 `'l'`、`'xl'`、`'xxl'` 等大间距，需要验证设计效果
3. **修改策略选择**：
   - **推荐方案**：将容易出现差异的 Gutter 改为数值形式，例如 `gutter="l"` 改为 `gutter={16}`
   - **简化方案**：如果新的间距效果符合预期，保持不变
   - **升级方案**：使用新库新增的 Gutter 预设值（`'2xl'`、`'3xl'` 等）
4. **测试验证**：确保布局间距符合设计规范
5. **统一规范**：建议跨项目统一使用数值形式的 gutter，以便跨库迁移

## Gutter 迁移速查表

| 字符串 | flower-rn | wand-rn | 新库别名 | 变化 | 建议 |
|--------|-----------|---------|---------|------|------|
| `'xxs'` | 2px | 2px | `'2xs'` | ✅ 无 | 无需改动 |
| `'xs'` | 4px | 4px | - | ✅ 无 | 无需改动 |
| `'s'` | 8px | 8px | - | ✅ 无 | 无需改动 |
| `'m'` | 12px | 12px | - | ✅ 无 | 无需改动 |
| `'l'` | 16px | 14px | - | ⚠️ 变化 | 改为 `{16}` 或接受差异 |
| `'xl'` | 20px | 16px | - | ⚠️ 变化 | 改为 `{20}` 或接受差异 |
| `'xxl'` | 24px | 20px | `'2xl'` | ⚠️ 变化 | 改为 `'2xl'` 或 `{24}` |
| - | - | 24px | `'3xl'` | ✅ 新增 | 可选使用 |
| - | - | 24px | `'xxxl'` | ✅ 新增 | 可选使用 |

## 常见问题

### Q: 是否必须改动 Gutter 值？
**A**: 不一定。如果设计允许新的间距值，可以保持不变。但建议使用数值形式以避免跨库差异。

### Q: 能否使用 number 类型的 gutter？
**A**: 完全可以。两个库都支持 `number` 类型，这是最保险的做法。

### Q: 新库的 `'2xl'` 和 `'xxl'` 有什么区别？
**A**: 在旧库中没有 `'2xl'`，`'xxl'` 对应 24px。新库中 `'2xl'` 对应 20px，`'3xl'` 对应 24px，推荐使用新库的新命名。
