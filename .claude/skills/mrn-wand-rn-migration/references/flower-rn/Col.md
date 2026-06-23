# Col 栅格列

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface ColProps {
    /** 栅格占位格数，为 0 时相当于 display: none */
    span?: number
    /** 栅格左侧的间隔格数 */
    offset?: number
    /** 栅格向右移动格数 */
    push?: number
    /** 栅格向左移动格数 */
    pull?: number
    /** flex 布局属性 */
    flex?: number
    /** 样式 */
    style?: ViewStyle
    /** 内容 */
    children?: React.ReactNode
}
```

## 新组件 API

```tsx
interface ColProps {
    /** 栅格占位格数，为 0 时相当于 display: none */
    span?: number
    /** 栅格左侧的间隔格数 */
    offset?: number
    /** 栅格向右移动格数 */
    push?: number
    /** 栅格向左移动格数 */
    pull?: number
    /** flex 布局属性 */
    flex?: number
    /** 样式 */
    style?: ViewStyle
    /** 内容 */
    children?: React.ReactNode
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| `span` | `span` | 保持不变 |
| `offset` | `offset` | 保持不变 |
| `push` | `push` | 保持不变 |
| `pull` | `pull` | 保持不变 |
| `flex` | `flex` | 保持不变 |
| `style` | `style` | 保持不变 |
| `children` | `children` | 保持不变 |

## 关键变更

### 1. Col 组件 API 完全兼容

**重要提示**: `Col` 组件的所有 Props、类型和默认值均与 flower-rn 完全相同。迁移 `Col` 组件**无需做任何代码修改**。

### 2. Row 组件 Gutter 类型更新

虽然此文档重点是 `Col` 组件，但需要了解 `Row` 组件中 Gutter 的变化，因为它会影响 `Col` 的间距计算：

**flower-rn Gutter 值对应关系**：
- `'xxs'` → 2px
- `'xs'` → 4px
- `'s'` → 8px
- `'m'` → 12px
- `'l'` → 16px
- `'xl'` → 20px
- `'xxl'` → 24px

**wand-rn Gutter 值对应关系**（变化了）：
- `'2xs'` / `'xxs'` → 2px
- `'xs'` → 4px
- `'s'` → 8px
- `'m'` → 12px
- `'l'` → 14px ⚠️ （从 16px 改为 14px）
- `'xl'` → 16px ⚠️ （从 20px 改为 16px）
- `'2xl'` → 20px
- `'3xl'` → 24px

### 3. 关键的 Gutter 数值变化

部分 Gutter 的像素值发生了变化。如果在 `Row` 中使用了这些 Gutter 值，会影响 `Col` 之间的间距：

```tsx
// 迁移前
<Row gutter="l">  {/* 对应 32px */}
    <Col span={6}>内容</Col>
    <Col span={6}>内容</Col>
</Row>

// 迁移后
<Row gutter="l">  {/* 现在对应 28px（实际的 gutter 是 14px × 2） */}
    <Col span={6}>内容</Col>
    <Col span={6}>内容</Col>
</Row>
```

## 迁移示例

### 案例 1：简单栅格布局

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row>
    <Col span={12}>
        <View>占满全宽</View>
    </Col>
</Row>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row>
    <Col span={12}>
        <View>占满全宽</View>
    </Col>
</Row>
```

### 案例 2：两列等分

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row>
    <Col span={6}>
        <View>左列</View>
    </Col>
    <Col span={6}>
        <View>右列</View>
    </Col>
</Row>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row>
    <Col span={6}>
        <View>左列</View>
    </Col>
    <Col span={6}>
        <View>右列</View>
    </Col>
</Row>
```

### 案例 3：三列等分

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row>
    <Col span={4}>
        <View>第一列</View>
    </Col>
    <Col span={4}>
        <View>第二列</View>
    </Col>
    <Col span={4}>
        <View>第三列</View>
    </Col>
</Row>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row>
    <Col span={4}>
        <View>第一列</View>
    </Col>
    <Col span={4}>
        <View>第二列</View>
    </Col>
    <Col span={4}>
        <View>第三列</View>
    </Col>
</Row>
```

### 案例 4：使用 offset 属性

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row>
    <Col span={8} offset={2}>
        <View>左侧偏移 2 格</View>
    </Col>
    <Col span={2}>
        <View>右列</View>
    </Col>
</Row>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row>
    <Col span={8} offset={2}>
        <View>左侧偏移 2 格</View>
    </Col>
    <Col span={2}>
        <View>右列</View>
    </Col>
</Row>
```

### 案例 5：使用 push/pull 属性

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row>
    <Col span={6} push={3}>
        <View>向右移动 3 格</View>
    </Col>
    <Col span={3} pull={6}>
        <View>向左移动 6 格</View>
    </Col>
</Row>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row>
    <Col span={6} push={3}>
        <View>向右移动 3 格</View>
    </Col>
    <Col span={3} pull={6}>
        <View>向左移动 6 格</View>
    </Col>
</Row>
```

### 案例 6：使用 flex 属性

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row>
    <Col flex={1}>
        <View>flex: 1</View>
    </Col>
    <Col flex={2}>
        <View>flex: 2</View>
    </Col>
</Row>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row>
    <Col flex={1}>
        <View>flex: 1</View>
    </Col>
    <Col flex={2}>
        <View>flex: 2</View>
    </Col>
</Row>
```

### 案例 7：使用 span={0} 隐藏列

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row>
    <Col span={12}>
        <View>始终显示</View>
    </Col>
    <Col span={0}>
        <View>隐藏</View>
    </Col>
</Row>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row>
    <Col span={12}>
        <View>始终显示</View>
    </Col>
    <Col span={0}>
        <View>隐藏</View>
    </Col>
</Row>
```

### 案例 8：带 Gutter 的布局（需要注意数值变化）

```tsx
// 迁移前 - 使用字符串 Gutter
import { Row, Col } from '@sgfe/flower-rn'

<Row gutter="m">  {/* 水平间距 12px */}
    <Col span={6}>
        <View>左列</View>
    </Col>
    <Col span={6}>
        <View>右列</View>
    </Col>
</Row>

// 迁移后 - 字符串值数值可能变化
import { Row, Col } from '@sfe/wand-rn'

<Row gutter="m">  {/* 仍是水平间距 12px，保持一致 */}
    <Col span={6}>
        <View>左列</View>
    </Col>
    <Col span={6}>
        <View>右列</View>
    </Col>
</Row>
```

### 案例 9：自定义样式

```tsx
// 迁移前
import { Row, Col } from '@sgfe/flower-rn'

<Row>
    <Col span={6} style={{ padding: 10 }}>
        <View>自定义样式</View>
    </Col>
    <Col span={6} style={{ backgroundColor: '#f0f0f0' }}>
        <View>背景颜色</View>
    </Col>
</Row>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row>
    <Col span={6} style={{ padding: 10 }}>
        <View>自定义样式</View>
    </Col>
    <Col span={6} style={{ backgroundColor: '#f0f0f0' }}>
        <View>背景颜色</View>
    </Col>
</Row>
```

## 关键点

- ✅ **API 完全兼容**：所有 Col Props 的名称、类型和默认值完全相同
- ⚠️ **Row Gutter 数值变化**：部分 Gutter 字符串值对应的像素值发生了变化
  - `'l'` 从 16px → 14px（实际 gutter 值）
  - `'xl'` 从 20px → 16px
  - `'xxl'` 从 24px → 20px（新库中改名为 `'2xl'`）
- ✅ **直接迁移 Col**：可以直接修改导入路径，不需要改动代码逻辑
- 📍 **需要重新设计 Row gutter**：如果设计中依赖了具体的 Gutter 数值，需要重新验证间距是否符合预期

## 迁移步骤

1. **更新导入路径**：`@sgfe/flower-rn` → `@sfe/wand-rn`
2. **验证 Gutter 数值**：
   - 如果使用了 `'l'`、`'xl'`、`'xxl'` 等 Gutter，检查新的数值是否满足设计需求
   - 如需保持原有间距，考虑使用 `number` 类型的 gutter 替代字符串值
3. **测试布局**：确保栅格展示、间距都符合预期
4. **无需修改 Col 代码**：Col 组件的所有代码保持不变

## Gutter 迁移速查表

| 字符串 | flower-rn px | wand-rn px | 新库字符串别名 | 是否变化 |
|--------|------------|-----------|------------|--------|
| `'xxs'` | 2 | 2 | `'2xs'` | ✅ 无 |
| `'xs'` | 4 | 4 | - | ✅ 无 |
| `'s'` | 8 | 8 | - | ✅ 无 |
| `'m'` | 12 | 12 | - | ✅ 无 |
| `'l'` | 16 | 14 | - | ⚠️ 变化 |
| `'xl'` | 20 | 16 | - | ⚠️ 变化 |
| `'xxl'` | 24 | 20 | `'2xl'` | ⚠️ 变化 + 改名 |
| - | - | 24 | `'3xl'` | ✅ 新增 |
