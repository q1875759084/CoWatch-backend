# Space 间距

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
type directionType = 'vertical' | 'horizontal'
type spaceSize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'
type wrapType = 'wrap' | 'nowrap'
type alignType = 'start' | 'end' | 'center' | 'baseline'

interface SpaceProps {
  /** 间距方向 */
  direction?: directionType  // 默认 'horizontal'
  /** 间距大小，支持单个值或数组 */
  size?: spaceSize | spaceSize[]  // 默认 'l'
  /** 是否自动换行，仅在 horizontal 时有效 */
  wrap?: wrapType  // 默认 'nowrap'
  /** 对齐方式 */
  align?: alignType  // 默认 'start'
  /** 子元素 */
  children: any
  /** 自定义样式 */
  style?: ViewStyle | ViewStyle[]
}

// spaceSize 大小映射
// 'xxs': 4px, 'xs': 8px, 's': 16px, 'm': 24px
// 'l': 28px, 'xl': 32px, 'xxl': 40px, 'xxxl': 48px
```

## 新组件 API

```tsx
type DirectionType = 'vertical' | 'horizontal'
type SpaceSize = '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl'
type WrapType = 'wrap' | 'nowrap'
type AlignType = 'start' | 'end' | 'center' | 'baseline'

interface SpaceProps {
  /** 间距方向 */
  direction?: DirectionType  // 默认 'horizontal'
  /** 间距大小，支持单个值或数组 */
  size?: SpaceSize | SpaceSize[]  // 默认 'l'
  /** 是否自动换行，仅在 horizontal 时有效 */
  wrap?: WrapType  // 默认 'nowrap'
  /** 对齐方式 */
  align?: AlignType  // 默认 'start'
  /** 子元素 */
  children: React.ReactNode
  /** 自定义样式 */
  style?: ViewStyle | ViewStyle[]
}

// SpaceSize 大小映射 - 新版本命名改为数字前缀
// '2xs': 4px (原 'xxs'), 'xs': 8px, 's': 16px, 'm': 24px
// 'l': 28px, 'xl': 32px, '2xl': 40px (原 'xxl'), '3xl': 48px (原 'xxxl')
```

## 迁移对照表

| 旧值 | 新值 | 说明 |
|-----|-----|------|
| `'xxs'` | `'2xs'` | 间距大小命名改为数字前缀 |
| `'xs'` | `'xs'` | 保持一致 |
| `'s'` | `'s'` | 保持一致 |
| `'m'` | `'m'` | 保持一致 |
| `'l'` | `'l'` | 保持一致（默认值） |
| `'xl'` | `'xl'` | 保持一致 |
| `'xxl'` | `'2xl'` | 间距大小命名改为数字前缀 |
| `'xxxl'` | `'3xl'` | 间距大小命名改为数字前缀 |

### 属性兼容性

| 属性 | 旧版本 | 新版本 | 说明 |
|-----|--------|--------|------|
| direction | 'horizontal' \| 'vertical' | 'horizontal' \| 'vertical' | 保持一致 |
| size | spaceSize \| spaceSize[] | SpaceSize \| SpaceSize[] | 类型命名改变，值需要升级 |
| wrap | 'wrap' \| 'nowrap' | 'wrap' \| 'nowrap' | 保持一致 |
| align | 'start' \| 'end' \| 'center' \| 'baseline' | 'start' \| 'end' \| 'center' \| 'baseline' | 保持一致 |
| children | any | React.ReactNode | 类型更严格 |
| style | ViewStyle \| ViewStyle[] | ViewStyle \| ViewStyle[] | 保持一致 |

## 关键变更

### 1. 间距大小枚举值改变
- **旧版本**：`'xxs'`、`'xxl'`、`'xxxl'`（双/三倍字母前缀）
- **新版本**：`'2xs'`、`'2xl'`、`'3xl'`（数字前缀）
- 其他值（`'xs'`、`'s'`、`'m'`、`'l'`、`'xl'`）保持不变

### 2. children 类型更严格
- **旧版本**：`any` 类型
- **新版本**：`React.ReactNode` 类型
- 实际使用无影响，仅为类型安全提升

### 3. 新版本兼容旧值
- wand-rn 的 white-space 内部 sizeMap 包含了对旧值的兼容性支持
- 可以继续使用 `'xxs'`、`'xxl'`、`'xxxl'` 而不会出错
- 但建议迁移至新值以保持代码一致性

### 4. 间距数值保持一致
- 所有间距大小的 px 值保持不变
- 仅是命名规范的改变，不会影响布局

## 迁移示例

### 案例 1：基础水平间距

```tsx
// 迁移前
import { Space } from '@sgfe/flower-rn'

<Space>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</Space>

// 迁移后 - 无需改动，默认值相同
import { Space } from '@sfe/wand-rn'

<Space>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</Space>
```

### 案例 2：垂直方向间距

```tsx
// 迁移前
import { Space } from '@sgfe/flower-rn'

<Space direction="vertical">
  <Text>Line 1</Text>
  <Text>Line 2</Text>
  <Text>Line 3</Text>
</Space>

// 迁移后 - 无需改动
import { Space } from '@sfe/wand-rn'

<Space direction="vertical">
  <Text>Line 1</Text>
  <Text>Line 2</Text>
  <Text>Line 3</Text>
</Space>
```

### 案例 3：自定义间距大小

```tsx
// 迁移前
import { Space } from '@sgfe/flower-rn'

<Space size="m">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Space>

// 迁移后 - 无需改动，'m' 值保持一致
import { Space } from '@sfe/wand-rn'

<Space size="m">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Space>
```

### 案例 4：超小间距

```tsx
// 迁移前 - 使用 'xxs'
import { Space } from '@sgfe/flower-rn'

<Space size="xxs">
  <Icon />
  <Icon />
  <Icon />
</Space>

// 迁移后 - 改为 '2xs'
import { Space } from '@sfe/wand-rn'

<Space size="2xs">
  <Icon />
  <Icon />
  <Icon />
</Space>
```

### 案例 5：特大间距

```tsx
// 迁移前 - 使用 'xxl'
import { Space } from '@sgfe/flower-rn'

<Space size="xxl">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
</Space>

// 迁移后 - 改为 '2xl'
import { Space } from '@sfe/wand-rn'

<Space size="2xl">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
</Space>
```

### 案例 6：超大间距

```tsx
// 迁移前 - 使用 'xxxl'
import { Space } from '@sgfe/flower-rn'

<Space size="xxxl" direction="vertical">
  <Section>Section 1</Section>
  <Section>Section 2</Section>
</Space>

// 迁移后 - 改为 '3xl'
import { Space } from '@sfe/wand-rn'

<Space size="3xl" direction="vertical">
  <Section>Section 1</Section>
  <Section>Section 2</Section>
</Space>
```

### 案例 7：数组形式的多个间距

```tsx
// 迁移前
import { Space } from '@sgfe/flower-rn'

<Space size={['s', 'm', 'l']}>
  <Item>Item 1</Item>
  <Item>Item 2</Item>
  <Item>Item 3</Item>
  <Item>Item 4</Item>
</Space>

// 迁移后 - 无需改动，这些值保持一致
import { Space } from '@sfe/wand-rn'

<Space size={['s', 'm', 'l']}>
  <Item>Item 1</Item>
  <Item>Item 2</Item>
  <Item>Item 3</Item>
  <Item>Item 4</Item>
</Space>
```

### 案例 8：包含旧值的数组

```tsx
// 迁移前
import { Space } from '@sgfe/flower-rn'

<Space size={['xxs', 's', 'xxl']}>
  <Item>Item 1</Item>
  <Item>Item 2</Item>
  <Item>Item 3</Item>
  <Item>Item 4</Item>
</Space>

// 迁移后 - 需要更新旧值
import { Space } from '@sfe/wand-rn'

<Space size={['2xs', 's', '2xl']}>
  <Item>Item 1</Item>
  <Item>Item 2</Item>
  <Item>Item 3</Item>
  <Item>Item 4</Item>
</Space>
```

### 案例 9：自动换行

```tsx
// 迁移前
import { Space } from '@sgfe/flower-rn'

<Space wrap="wrap" size="l">
  <Badge>Badge 1</Badge>
  <Badge>Badge 2</Badge>
  <Badge>Badge 3</Badge>
</Space>

// 迁移后 - 无需改动
import { Space } from '@sfe/wand-rn'

<Space wrap="wrap" size="l">
  <Badge>Badge 1</Badge>
  <Badge>Badge 2</Badge>
  <Badge>Badge 3</Badge>
</Space>
```

### 案例 10：对齐方式

```tsx
// 迁移前
import { Space } from '@sgfe/flower-rn'

<Space direction="vertical" align="center">
  <Text>Centered Item 1</Text>
  <Text>Centered Item 2</Text>
</Space>

// 迁移后 - 无需改动
import { Space } from '@sfe/wand-rn'

<Space direction="vertical" align="center">
  <Text>Centered Item 1</Text>
  <Text>Centered Item 2</Text>
</Space>
```

### 案例 11：复杂配置

```tsx
// 迁移前 - 使用旧的间距大小
import { Space } from '@sgfe/flower-rn'

<Space
  direction="horizontal"
  size="xxl"
  wrap="wrap"
  align="center"
  style={{ padding: 12 }}
>
  <Button size="sm">Button 1</Button>
  <Button size="sm">Button 2</Button>
  <Button size="sm">Button 3</Button>
</Space>

// 迁移后 - 更新旧间距大小
import { Space } from '@sfe/wand-rn'

<Space
  direction="horizontal"
  size="2xl"
  wrap="wrap"
  align="center"
  style={{ padding: 12 }}
>
  <Button size="sm">Button 1</Button>
  <Button size="sm">Button 2</Button>
  <Button size="sm">Button 3</Button>
</Space>
```

### 案例 12：自定义样式

```tsx
// 迁移前
import { Space } from '@sgfe/flower-rn'

<Space
  size="m"
  style={{ backgroundColor: '#f5f5f5', padding: 10 }}
>
  <Icon />
  <Text>Text with background</Text>
</Space>

// 迁移后 - 无需改动
import { Space } from '@sfe/wand-rn'

<Space
  size="m"
  style={{ backgroundColor: '#f5f5f5', padding: 10 }}
>
  <Icon />
  <Text>Text with background</Text>
</Space>
```

## 关键点

- **间距大小命名变更**：`'xxs'` → `'2xs'`、`'xxl'` → `'2xl'`、`'xxxl'` → `'3xl'`
- **其他间距值保持一致**：`'xs'`、`'s'`、`'m'`、`'l'`、`'xl'` 无需改动
- **新版本兼容旧值**：即使使用旧的枚举值也不会报错，但建议更新以保持一致
- **所有其他属性完全兼容**：direction、wrap、align、style 等无需改动
- **间距数值不变**：所有间距大小的 px 值保持一致，仅是命名规范改变
- **类型定义优化**：children 类型从 any 改为 React.ReactNode，更加类型安全
- **迁移步骤**：
  1. 将 `import { Space } from '@sgfe/flower-rn'` 改为 `import { Space } from '@sfe/wand-rn'`
  2. 将所有的 `'xxs'` 改为 `'2xs'`
  3. 将所有的 `'xxl'` 改为 `'2xl'`
  4. 将所有的 `'xxxl'` 改为 `'3xl'`
