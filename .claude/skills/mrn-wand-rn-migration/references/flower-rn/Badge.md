# Badge 角标

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface BadgeProps {
    /** 角标中展示的文案 */
    title?: string | number
    /** 角标类型 */
    type?: 'text' | 'dot' | 'pointing' | 'triangle'
    /** type 为 'triangle' 时，Text 组件自定义多行行数 */
    numberOfLines?: number
    /** 角标距离父元素顶部偏移量 */
    top?: number
    /** 角标距离父元素右侧偏移量 */
    right?: number
    /** 自定义样式 */
    textWrapperStyle?: ViewStyle
    textContentStyle?: TextStyle
    triangleStyle?: ViewStyle
    textTriangleStyle?: TextStyle
    dotStyle?: ViewStyle
}
```

## 新组件 API

```tsx
interface BadgeProps {
    /** 角标中展示的文案 */
    title?: string | number
    /** 角标类型，可选值: text | dot | pointing */
    type?: 'text' | 'dot' | 'pointing'
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| `title` | `title` | 保持不变 |
| `type` | `type` | 删除 `'triangle'` 类型，仅支持 `'text'` \| `'dot'` \| `'pointing'` |
| `numberOfLines` | 移除 | 不再支持 |
| `top` | 移除 | 不再支持，需通过父元素定位替代 |
| `right` | 移除 | 不再支持，需通过父元素定位替代 |
| 样式相关 props | 移除 | `textWrapperStyle`、`textContentStyle`、`triangleStyle`、`textTriangleStyle`、`dotStyle` 均不支持 |

## 关键变更

### 1. 删除 `triangle` 类型

新库仅保留三种角标类型：`text`、`dot`、`pointing`。若原代码使用 `type="triangle"`，需进行替换：

- **方案 1**: 若三角角标已不再使用，直接移除相关代码
- **方案 2**: 若必须保留三角效果，使用自定义 View + Badge(`type="dot"`) 或 Badge(`type="text"`) 替代

### 2. 定位从 Props 转移到父元素

新库不再提供 `top` 和 `right` Props，需要通过父元素的定位属性实现：

```tsx
// 迁移前
<Badge title="99+" top={2} right={4} />

// 迁移后
<View style={{ position: 'relative' }}>
    <Badge title="99+" />
</View>
```

### 3. 样式自定义移除

新库不再支持通过 `textWrapperStyle`、`textContentStyle` 等样式 Props 自定义样式。若需自定义样式，建议：
- 使用主题系统覆盖默认样式（通过 theme provider）
- 使用自定义组件包装 Badge

### 4. numberOfLines 移除

`numberOfLines` 属性已移除，不再支持多行文本配置。

## 迁移示例

### 案例 1：简单数字角标

```tsx
// 迁移前
import { Badge } from '@sgfe/flower-rn'

<Badge title="99+" />

// 迁移后
import { Badge } from '@sfe/wand-rn'

<Badge title="99+" />
```

### 案例 2：红点角标

```tsx
// 迁移前
import { Badge } from '@sgfe/flower-rn'

<Badge type="dot" />

// 迁移后
import { Badge } from '@sfe/wand-rn'

<Badge type="dot" />
```

### 案例 3：指向型角标

```tsx
// 迁移前
import { Badge } from '@sgfe/flower-rn'

<Badge title="热" type="pointing" />

// 迁移后
import { Badge } from '@sfe/wand-rn'

<Badge title="热" type="pointing" />
```

### 案例 4：带定位的角标（重要）

```tsx
// 迁移前：使用 top 和 right props
import { Badge } from '@sgfe/flower-rn'

<View style={styles.avatar}>
    <Text>MTD</Text>
    <Badge title="1" top={2} right={7} />
</View>

// 迁移后：通过父元素定位
import { Badge } from '@sfe/wand-rn'

<View style={[styles.avatar, { position: 'relative' }]}>
    <Text>MTD</Text>
    <View style={{ position: 'absolute', top: 2, right: 7 }}>
        <Badge title="1" />
    </View>
</View>
```

### 案例 5：三角角标迁移

```tsx
// 迁移前
import { Badge } from '@sgfe/flower-rn'

<Badge 
    type="triangle" 
    title="优惠" 
    numberOfLines={1}
    top={-8}
    right={-80}
/>

// 迁移后：使用 text 类型替代
import { Badge } from '@sfe/wand-rn'

<View style={{ position: 'absolute', top: -8, right: -80 }}>
    <Badge title="优惠" type="text" />
</View>
```

### 案例 6：在列表项中使用角标

```tsx
// 迁移前
import { Badge } from '@sgfe/flower-rn'
import { List } from '@components/roo-rn/list'

<List.Item
    extra={<Badge title="1" />}
    arrow="horizontal"
>
    多行列表
</List.Item>

// 迁移后
import { Badge } from '@sfe/wand-rn'
import { List } from '@components/roo-rn/list'

<List.Item
    extra={<Badge title="1" />}
    arrow="horizontal"
>
    多行列表
</List.Item>
```

### 案例 7：样式自定义迁移

```tsx
// 迁移前：通过 Props 自定义样式
import { Badge } from '@sgfe/flower-rn'

<Badge 
    title="1" 
    textWrapperStyle={{ padding: 8 }}
    textContentStyle={{ fontSize: 12 }}
/>

// 迁移后：如需自定义样式，使用包装 View
import { Badge } from '@sfe/wand-rn'

<View style={{ padding: 8 }}>
    <Badge title="1" />
</View>
```

## 关键点

- ✅ **基础功能保留**：`text`、`dot`、`pointing` 三种角标类型完全兼容
- ❌ **API 大幅简化**：移除 `top`、`right`、各种样式 Props 和 `numberOfLines`
- ❌ **删除 triangle 类型**：原使用 `type="triangle"` 的代码需要改造
- 🔄 **定位方式改变**：需要从 Badge Props 转移到父容器定位
- 📍 **迁移难度**：中等 - 需要调整定位方式和移除样式定制代码

## 迁移步骤

1. **更新导入路径**：`@sgfe/flower-rn` → `@sfe/wand-rn`
2. **评估 `type` 属性**：
   - 若使用 `triangle`，需要替换为 `text` 或调整组件结构
   - `text` 和 `dot` 保持不变
3. **调整定位逻辑**：
   - 移除 Badge 组件的 `top` 和 `right` Props
   - 将定位转移到父容器，使用 `position: 'absolute'` + `top`/`right` 样式
4. **移除样式 Props**：删除 `textWrapperStyle`、`textContentStyle` 等不支持的属性
5. **测试验证**：确保角标位置和样式符合预期
