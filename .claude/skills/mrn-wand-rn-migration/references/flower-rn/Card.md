# Card 卡片

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
// Card 类型和大小枚举
enum CardType {
  Card = 'card',
  Full = 'full'
}

enum CardRadiusSize {
  L = 10.5,
  M = 6.5,
  S = 4,
  Zero = 0
}

enum CardPaddingSize {
  L = 16,
  M = 12,
  S = 8
}

// Card 主组件
interface CardProps {
  /** 卡片类型 */
  type?: 'card' | 'full'  // 默认 'card'
  /** 卡片圆角尺寸 */
  radiusSize?: 'L' | 'M' | 'S' | number  // 默认 'L'
  /** 卡片内边距 */
  paddingSize?: 'L' | 'M' | 'S' | number | ('L' | 'M' | 'S' | number)[]  // 默认 'M'
  /** 自定义外层样式 */
  style?: StyleProp<ViewStyle>
  /** 子元素 */
  children?: React.ReactNode
  /** 点击回调 */
  onPress?: () => void
}

// Card.Header 子组件
interface CardHeaderProps {
  title?: React.ReactNode
  extra?: React.ReactNode
  showDivider?: boolean  // 默认 false
  gapSize?: 'L' | 'M' | 'S' | number  // 默认 'S'
  style?: StyleProp<ViewStyle>
  onPress?: () => void
  children?: React.ReactNode
}

// Card.Body 子组件 - 预设最小高度 48
interface CardBodyProps {
  children?: React.ReactNode
}

// Card.Footer 子组件
interface CardFooterProps {
  content?: React.ReactNode
  extra?: React.ReactNode
  showDivider?: boolean  // 默认 false
  gapSize?: 'L' | 'M' | 'S' | number  // 默认 'L'
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}

// Card.Gap 子组件
interface CardGapProps {
  size?: 'L' | 'M' | 'S' | number
  showDivider?: boolean  // 默认 false
}
```

## 新组件 API

```tsx
// Card 类型和大小枚举 - 命名改为小写
enum CardType {
  Card = 'card',
  Full = 'full'
}

enum CardRadiusSize {
  lg = 10.5,
  md = 6.5,
  sm = 4,
  zero = 0
}

enum CardPaddingSize {
  lg = 16,
  md = 12,
  sm = 8
}

// Card 主组件 - 属性名改为更简洁的名称
interface CardProps {
  /** 卡片类型 */
  type?: 'card' | 'full'  // 默认 'card'
  /** 圆角尺寸 */
  radius?: number  // 默认 10.5（使用主题系统，默认为 theme.borderRadiusL）
  /** 内边距，支持 CSS 式 padding 数组：[top, right, bottom, left] */
  padding?: number | number[]  // 默认 12
  /** 自定义外层样式 */
  style?: StyleProp<ViewStyle>
  /** 子元素 */
  children?: React.ReactNode
  /** 点击回调 */
  onPress?: () => void
}

// Card.Header 子组件 - gapSize 改为 number 类型
interface CardHeaderProps {
  title?: React.ReactNode
  extra?: React.ReactNode
  showDivider?: boolean  // 默认 false
  gapSize?: number  // 默认值：showDivider 为 false 时为 8，为 true 时为 24
  style?: StyleProp<ViewStyle>
  onPress?: () => void
  children?: React.ReactNode
}

// Card.Body 子组件 - 保持一致
interface CardBodyProps {
  children?: React.ReactNode
}

// Card.Footer 子组件 - gapSize 改为 number 类型
interface CardFooterProps {
  content?: React.ReactNode
  extra?: React.ReactNode
  showDivider?: boolean  // 默认 false
  gapSize?: number  // 默认值：showDivider 为 false 时为 12，为 true 时为 24
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}

// Card.Gap 子组件 - size 改为 number 类型
interface CardGapProps {
  size?: number
  showDivider?: boolean  // 默认 false
}
```

## 迁移对照表

### Card 主组件

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| radiusSize | radius | 属性名简化，类型从枚举改为 number |
| paddingSize | padding | 属性名简化，类型从枚举改为 number 或数组 |
| type | type | 保持一致 |
| style | style | 保持一致 |
| onPress | onPress | 保持一致 |
| children | children | 保持一致 |

### CardRadiusSize & CardPaddingSize 枚举

| 旧值 | 新值 | 说明 |
|-----|-----|------|
| L | lg | 大 (Large) - 命名改为小写 |
| M | md | 中 (Medium) - 命名改为小写 |
| S | sm | 小 (Small) - 命名改为小写 |
| Zero | zero | 无 - 命名改为小写 |

### Card.Header 子组件

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| title | title | 保持一致 |
| extra | extra | 保持一致 |
| showDivider | showDivider | 保持一致 |
| gapSize | gapSize | 类型从枚举改为 number，默认值改为动态计算 |
| style | style | 保持一致 |
| onPress | onPress | 保持一致 |
| children | children | 保持一致 |

### Card.Footer 子组件

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| content | content | 保持一致 |
| extra | extra | 保持一致 |
| showDivider | showDivider | 保持一致 |
| gapSize | gapSize | 类型从枚举改为 number，默认值改为动态计算 |
| style | style | 保持一致 |
| children | children | 保持一致 |

### Card.Gap 子组件

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| size | size | 类型从枚举改为 number |
| showDivider | showDivider | 保持一致 |

## 关键变更

### 1. Card 主组件属性名简化
- `radiusSize` → `radius`
- `paddingSize` → `padding`

### 2. 枚举值命名规范改变
- **旧版本**：`'L'`、`'M'`、`'S'`、`'Zero'`（大写）
- **新版本**：`'lg'`、`'md'`、`'sm'`、`'zero'`（小写）

### 3. 圆角配置改为数值型
- **旧版本**：必须使用枚举值 `'L'`、`'M'`、`'S'`，或直接传数值
- **新版本**：直接传 number，更灵活；支持通过主题系统自动匹配圆角

### 4. 内边距配置改为数值型
- **旧版本**：支持枚举或单一数值或数组
- **新版本**：支持单一数值或数组，数组顺序遵循 CSS padding 规则：`[top, right, bottom, left]`

### 5. Gap 组件 size 参数改为数值型
- **旧版本**：`'L'`(12) | `'M'`(8) | `'S'`(4) | number
- **新版本**：直接使用 number

### 6. Card.Header/Footer gapSize 默认值改为动态
- **旧版本**：Header 默认 `'S'`(4)，Footer 默认 `'L'`(12)
- **新版本**：Header 默认 showDivider false 时为 8，true 时为 24；Footer 默认 showDivider false 时为 12，true 时为 24

### 7. 主题系统集成
- **新版本**：集成主题系统（WithTheme），可通过主题自定义卡片样式

## 迁移示例

### 案例 1：基础卡片

```tsx
// 迁移前
import { Card } from '@sgfe/flower-rn'

<Card>
  <Card.Body>
    <Text>卡片内容</Text>
  </Card.Body>
</Card>

// 迁移后
import { Card } from '@sfe/wand-rn'

<Card>
  <Card.Body>
    <Text>卡片内容</Text>
  </Card.Body>
</Card>
```

### 案例 2：自定义圆角和内边距

```tsx
// 迁移前 - 使用枚举值
import { Card } from '@sgfe/flower-rn'

<Card radiusSize="M" paddingSize="L">
  <Card.Body>
    <Text>内容</Text>
  </Card.Body>
</Card>

// 迁移后 - 直接使用 number
import { Card } from '@sfe/wand-rn'

<Card radius={6.5} padding={16}>
  <Card.Body>
    <Text>内容</Text>
  </Card.Body>
</Card>
```

### 案例 3：卡片带标题

```tsx
// 迁移前
import { Card } from '@sgfe/flower-rn'

<Card>
  <Card.Header title="标题" gapSize="M" />
  <Card.Body>
    <Text>卡片内容</Text>
  </Card.Body>
</Card>

// 迁移后
import { Card } from '@sfe/wand-rn'

<Card>
  <Card.Header title="标题" gapSize={8} />
  <Card.Body>
    <Text>卡片内容</Text>
  </Card.Body>
</Card>
```

### 案例 4：卡片带分割线

```tsx
// 迁移前
import { Card } from '@sgfe/flower-rn'

<Card>
  <Card.Header 
    title="标题" 
    showDivider 
    gapSize="S"
  />
  <Card.Body>
    <Text>卡片内容</Text>
  </Card.Body>
</Card>

// 迁移后 - 注意：showDivider 为 true 时，新版本默认 gapSize 为 24
import { Card } from '@sfe/wand-rn'

<Card>
  <Card.Header 
    title="标题" 
    showDivider 
    gapSize={24}
  />
  <Card.Body>
    <Text>卡片内容</Text>
  </Card.Body>
</Card>
```

### 案例 5：卡片带页脚

```tsx
// 迁移前
import { Card } from '@sgfe/flower-rn'

<Card>
  <Card.Header title="标题" />
  <Card.Body>
    <Text>卡片内容</Text>
  </Card.Body>
  <Card.Footer content="左侧" extra="右侧" />
</Card>

// 迁移后
import { Card } from '@sfe/wand-rn'

<Card>
  <Card.Header title="标题" />
  <Card.Body>
    <Text>卡片内容</Text>
  </Card.Body>
  <Card.Footer content="左侧" extra="右侧" />
</Card>
```

### 案例 6：页脚带分割线

```tsx
// 迁移前
import { Card } from '@sgfe/flower-rn'

<Card>
  <Card.Body>
    <Text>卡片内容</Text>
  </Card.Body>
  <Card.Footer 
    content="左侧" 
    extra="右侧" 
    showDivider
    gapSize="L"
  />
</Card>

// 迁移后 - 注意：showDivider 为 true 时，新版本默认 gapSize 为 24
import { Card } from '@sfe/wand-rn'

<Card>
  <Card.Body>
    <Text>卡片内容</Text>
  </Card.Body>
  <Card.Footer 
    content="左侧" 
    extra="右侧" 
    showDivider
    gapSize={24}
  />
</Card>
```

### 案例 7：自定义内边距（四边不同）

```tsx
// 迁移前 - 需要用数组指定
import { Card } from '@sgfe/flower-rn'

<Card paddingSize={[16, 12, 8, 12]}>
  <Card.Body>
    <Text>内容</Text>
  </Card.Body>
</Card>

// 迁移后 - 数组顺序同 CSS padding：[top, right, bottom, left]
import { Card } from '@sfe/wand-rn'

<Card padding={[16, 12, 8, 12]}>
  <Card.Body>
    <Text>内容</Text>
  </Card.Body>
</Card>
```

### 案例 8：Full 类型卡片

```tsx
// 迁移前
import { Card } from '@sgfe/flower-rn'

<Card type="full" paddingSize="M">
  <Card.Header title="全宽卡片" />
  <Card.Body>
    <Text>内容</Text>
  </Card.Body>
</Card>

// 迁移后
import { Card } from '@sfe/wand-rn'

<Card type="full" padding={12}>
  <Card.Header title="全宽卡片" />
  <Card.Body>
    <Text>内容</Text>
  </Card.Body>
</Card>
```

### 案例 9：卡片点击事件

```tsx
// 迁移前
import { Card } from '@sgfe/flower-rn'

<Card onPress={() => handleCardPress()}>
  <Card.Body>
    <Text>点我试试</Text>
  </Card.Body>
</Card>

// 迁移后
import { Card } from '@sfe/wand-rn'

<Card onPress={() => handleCardPress()}>
  <Card.Body>
    <Text>点我试试</Text>
  </Card.Body>
</Card>
```

### 案例 10：完整卡片布局

```tsx
// 迁移前
import { Card } from '@sgfe/flower-rn'

<Card radiusSize="L" paddingSize={[16, 16, 12, 16]}>
  <Card.Header 
    title="订单信息" 
    extra="查看详情"
    showDivider
    gapSize="M"
    onPress={() => handleHeaderPress()}
  />
  <Card.Body>
    <Text>订单号：#12345</Text>
    <Text>金额：¥99.9</Text>
  </Card.Body>
  <Card.Footer
    content="待支付"
    extra="立即支付"
    showDivider
    gapSize="L"
  />
</Card>

// 迁移后
import { Card } from '@sfe/wand-rn'

<Card radius={10.5} padding={[16, 16, 12, 16]}>
  <Card.Header 
    title="订单信息" 
    extra="查看详情"
    showDivider
    gapSize={24}
    onPress={() => handleHeaderPress()}
  />
  <Card.Body>
    <Text>订单号：#12345</Text>
    <Text>金额：¥99.9</Text>
  </Card.Body>
  <Card.Footer
    content="待支付"
    extra="立即支付"
    showDivider
    gapSize={24}
  />
</Card>
```

## 关键点

- `radiusSize` 改为 `radius`，从枚举改为 number 类型
- `paddingSize` 改为 `padding`，从枚举改为 number 或数组
- 枚举值命名改为小写：`'L'` → `'lg'`、`'M'` → `'md'`、`'S'` → `'sm'`、`'Zero'` → `'zero'`
- 所有的 gap/padding 相关属性改为直接使用 number，更加灵活
- Card.Header/Footer 的 gapSize 默认值改为动态：
  - showDivider 为 false 时使用较小值（Header 8，Footer 12）
  - showDivider 为 true 时使用较大值 24，用于分割线周围的间距
- 新版本集成了主题系统，可自动适配设计令牌
- 所有其他属性和功能保持兼容
- Card.Body 仍预设最小高度为 48
