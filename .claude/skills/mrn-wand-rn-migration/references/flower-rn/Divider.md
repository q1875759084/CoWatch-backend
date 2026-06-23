# Divider 分割线

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface DividerProps {
  /** 自定义高度（已废弃，推荐使用 thickness） */
  height?: number
  
  /** 线的粗细 */
  thickness?: number  // 默认：水平实线 0.5，虚线或垂直 1
  
  /** 线的类型 */
  type?: 'horizontal' | 'vertical'  // 默认 'horizontal'
  
  /** 线的长度 */
  length?: number  // 默认：水平 '100%'，垂直 9
  
  /** 线条颜色 */
  color?: string  // 默认 '#EEEEEE'
  
  /** 是否虚线 */
  dashed?: boolean  // 默认 false
  
  /** 虚线设置 */
  dashedProps?: {
    length?: number  // 默认 6
    gap?: number  // 默认 4
  }
  
  /** 外边距，数组表示 [上下, 左右] */
  margin?: number | [number, number]  // 默认 [0, 0]
}
```

## 新组件 API

```tsx
interface DividerProps {
  /** 自定义高度（已废弃，推荐使用 thickness） */
  height?: number
  
  /** 线的粗细 */
  thickness?: number  // 默认：水平实线 0.5，虚线或垂直 1
  
  /** 线的类型 */
  type?: 'horizontal' | 'vertical'  // 默认 'horizontal'
  
  /** 线的长度 */
  length?: number  // 默认：水平 '100%'，垂直 9
  
  /** 线条颜色 */
  color?: string  // 默认 '#EEEEEE'
  
  /** 是否虚线 */
  dashed?: boolean  // 默认 false
  
  /** 虚线设置 */
  dashedProps?: {
    length?: number  // 默认 3
    gap?: number  // 默认 2
  }
  
  /** 外边距，数组表示 [上下, 左右] */
  margin?: number | number[]  // 默认 0
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| type | type | 保持一致 |
| thickness | thickness | 保持一致 |
| length | length | 保持一致 |
| color | color | 保持一致 |
| dashed | dashed | 保持一致 |
| dashedProps | dashedProps | 虚线配置保持一致，但默认值改变 |
| margin | margin | 保持一致 |
| height | height | 已废弃，建议使用 thickness |

## 关键变更

### 1. 虚线默认值改变
- **旧版本**：虚线段长度默认 `6`，间隔默认 `4`
- **新版本**：虚线段长度默认 `3`，间隔默认 `2`
- 如需保持旧版本外观，需要显式设置 `dashedProps={{ length: 6, gap: 4 }}`

### 2. margin 默认值改变
- **旧版本**：默认 `[0, 0]`
- **新版本**：默认 `0`（等同于 `[0, 0]`）
- 实际使用没有变化，两者等价

### 3. API 完全兼容
- 所有属性名称保持不变
- 所有功能保持不变
- 仅为组件内部实现优化，无需改动代码

## 迁移示例

### 案例 1：简单水平实线

```tsx
// 迁移前
import { Divider } from '@sgfe/flower-rn'

<Divider />

// 迁移后 - 无需改动
import { Divider } from '@sfe/wand-rn'

<Divider />
```

### 案例 2：自定义粗细的水平线

```tsx
// 迁移前
import { Divider } from '@sgfe/flower-rn'

<Divider thickness={2} />

// 迁移后
import { Divider } from '@sfe/wand-rn'

<Divider thickness={2} />
```

### 案例 3：自定义颜色的分割线

```tsx
// 迁移前
import { Divider } from '@sgfe/flower-rn'

<Divider color="#FF0000" />

// 迁移后
import { Divider } from '@sfe/wand-rn'

<Divider color="#FF0000" />
```

### 案例 4：垂直分割线

```tsx
// 迁移前
import { Divider } from '@sgfe/flower-rn'

<Divider type="vertical" length={20} />

// 迁移后
import { Divider } from '@sfe/wand-rn'

<Divider type="vertical" length={20} />
```

### 案例 5：带外边距的分割线

```tsx
// 迁移前
import { Divider } from '@sgfe/flower-rn'

<Divider margin={10} />

// 迁移后 - 无需改动
import { Divider } from '@sfe/wand-rn'

<Divider margin={10} />
```

### 案例 6：指定上下左右不同外边距

```tsx
// 迁移前
import { Divider } from '@sgfe/flower-rn'

<Divider margin={[8, 16]} />  // 上下 8，左右 16

// 迁移后
import { Divider } from '@sfe/wand-rn'

<Divider margin={[8, 16]} />
```

### 案例 7：虚线 - 使用默认配置

```tsx
// 迁移前 - 默认虚线段长 6，间隔 4
import { Divider } from '@sgfe/flower-rn'

<Divider dashed />

// 迁移后 - 默认虚线段长 3，间隔 2（外观会改变）
import { Divider } from '@sfe/wand-rn'

<Divider dashed />
```

### 案例 8：虚线 - 保持旧版本外观

```tsx
// 迁移前
import { Divider } from '@sgfe/flower-rn'

<Divider dashed />

// 迁移后 - 需要显式设置虚线参数以保持旧版本外观
import { Divider } from '@sfe/wand-rn'

<Divider dashed dashedProps={{ length: 6, gap: 4 }} />
```

### 案例 9：虚线 - 自定义配置

```tsx
// 迁移前
import { Divider } from '@sgfe/flower-rn'

<Divider 
  dashed 
  dashedProps={{ length: 4, gap: 2 }}
  margin={[10, 0]}
/>

// 迁移后
import { Divider } from '@sfe/wand-rn'

<Divider 
  dashed 
  dashedProps={{ length: 4, gap: 2 }}
  margin={[10, 0]}
/>
```

### 案例 10：完整配置示例

```tsx
// 迁移前
import { Divider } from '@sgfe/flower-rn'

<Divider
  type="horizontal"
  thickness={1}
  color="#999999"
  dashed={false}
  margin={[12, 16]}
/>

// 迁移后 - 无需改动
import { Divider } from '@sfe/wand-rn'

<Divider
  type="horizontal"
  thickness={1}
  color="#999999"
  dashed={false}
  margin={[12, 16]}
/>
```

### 案例 11：容器内使用分割线

```tsx
// 迁移前
import { Divider } from '@sgfe/flower-rn'

<View>
  <Text>第一项</Text>
  <Divider margin={[8, 0]} />
  <Text>第二项</Text>
  <Divider margin={[8, 0]} />
  <Text>第三项</Text>
</View>

// 迁移后 - 无需改动
import { Divider } from '@sfe/wand-rn'

<View>
  <Text>第一项</Text>
  <Divider margin={[8, 0]} />
  <Text>第二项</Text>
  <Divider margin={[8, 0]} />
  <Text>第三项</Text>
</View>
```

### 案例 12：卡片中的分割线

```tsx
// 迁移前
import { Divider } from '@sgfe/flower-rn'

<Card>
  <Card.Header title="标题" />
  <Divider margin={[8, 12]} />
  <Card.Body>
    <Text>内容</Text>
  </Card.Body>
</Card>

// 迁移后 - 无需改动
import { Divider } from '@sfe/wand-rn'

<Card>
  <Card.Header title="标题" />
  <Divider margin={[8, 12]} />
  <Card.Body>
    <Text>内容</Text>
  </Card.Body>
</Card>
```

## 关键点

- **API 完全兼容**：所有属性名和功能保持不变，可直接替换使用
- **虚线默认值改变**：如使用虚线且需保持旧版本外观，需显式设置 `dashedProps={{ length: 6, gap: 4 }}`
- **margin 默认值等价**：`[0, 0]` 和 `0` 效果相同
- **height 属性已废弃**：建议使用 `thickness` 属性，但 wand-rn 仍保持兼容
- **无需任何代码改动**：即使默认值改变也不会导致 break，只是虚线外观会变细致
- 所有其他属性保持完全一致
