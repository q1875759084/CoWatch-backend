# Press 点击

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface IPressProps extends TouchableWithoutFeedbackProps {
  /** 是否启用默认热区 */
  useHitSlop?: boolean  // 默认 false
  /** 节流时间（毫秒） */
  throttleTime?: number  // 默认 1000
  /** 子元素 */
  children: React.ReactNode
}

// 默认常量
const HIT_SLOP = { top: 5, bottom: 5, left: 10, right: 10 }
const THROTTLE_TIME = 1000

// Press 基础组件（基于 TouchableWithoutFeedback）
<Press useHitSlop={false} throttleTime={1000} onPress={() => {}} >
  {children}
</Press>

// Press 还提供了衍生组件
<PressOpacity />  // 基于 TouchableOpacity
<PressHighlight />  // 基于 TouchableHighlight
<DoublePress onDoublePress={() => {}} />  // 双击组件
```

## 新组件 API

```tsx
interface PressProps extends TouchableWithoutFeedbackProps {
  /** 是否启用默认热区 */
  enableHitSlop?: boolean  // 默认 false
  /** 自定义热区（优先级高于 enableHitSlop） */
  hitSlop?: Insets
  /** 防抖时间（毫秒） */
  debounceTime?: number  // 默认 300
  /** 子元素 */
  children: React.ReactNode
}

interface DoublePressProps extends Omit<PressProps, 'debounceTime'> {
  /** 双击回调函数 */
  onDoublePress: (event: GestureResponderEvent) => void
}

// 默认常量
const HIT_SLOP = { top: 5, bottom: 5, left: 5, right: 5 }
const WAIT_TIME = 300  // 默认防抖延迟
const DEBOUNCE_WAIT_TIME = 300

// Press 基础组件（基于 TouchableWithoutFeedback）
<Press enableHitSlop={false} debounceTime={300} onPress={() => {}} >
  {children}
</Press>

// Press 提供了静态方法/属性访问衍生组件
<Press.Opacity />  // 基于 TouchableOpacity
<Press.Highlight />  // 基于 TouchableHighlight
<Press.Double onDoublePress={() => {}} />  // 双击组件
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| useHitSlop | enableHitSlop | 属性名变更，功能保持一致 |
| - | hitSlop | 新增，用于自定义热区，优先级高于 enableHitSlop |
| throttleTime | debounceTime | 属性名变更，默认值从 1000ms 改为 300ms；实现方式从 throttle 改为 debounce |
| 其他 TouchableWithoutFeedbackProps | 其他 TouchableWithoutFeedbackProps | 保持一致 |

## 关键变更

### 1. 属性名称变更
- `useHitSlop` → `enableHitSlop`
- `throttleTime` → `debounceTime`

### 2. 防抖实现方式改变
- **旧版本**：使用 `throttle` 实现，防止频繁触发（`trailing: false`）
- **新版本**：使用 `debounce` 实现，立即执行首次点击（`leading: true, trailing: false`）
- 旧版本：1000ms 内连续点击只执行第一次
- 新版本：相同的 debounceTime 内只执行第一次点击，之后 debounceTime 时间后可再点击

### 3. 热区数值变更
- **旧版本**：`{ top: 5, bottom: 5, left: 10, right: 10 }`
- **新版本**：`{ top: 5, bottom: 5, left: 5, right: 5 }`
- 左右热区从 10px 改为 5px

### 4. 默认防抖时间变更
- **旧版本**：1000ms
- **新版本**：300ms

### 5. 组件导入方式变更
- **旧版本**：直接导入 `Press`、`PressOpacity`、`PressHighlight`、`DoublePress`
  ```tsx
  import { Press, PressOpacity, PressHighlight, DoublePress } from '@sgfe/flower-rn'
  ```
- **新版本**：通过 Press 的静态属性/方法访问
  ```tsx
  import { Press } from '@sfe/wand-rn'
  
  // Press.Opacity (原 PressOpacity)
  // Press.Highlight (原 PressHighlight)
  // Press.Double (原 DoublePress)
  ```

### 6. 新增自定义热区属性
- **旧版本**：只能通过 `useHitSlop` 布尔值来启用/禁用固定热区
- **新版本**：新增 `hitSlop` 属性，允许灵活自定义热区大小，优先级高于 `enableHitSlop`

## 迁移示例

### 案例 1：基础 Press 组件

```tsx
// 迁移前
import { Press } from '@sgfe/flower-rn'

<Press onPress={() => console.log('pressed')}>
  <Text>点我</Text>
</Press>

// 迁移后
import { Press } from '@sfe/wand-rn'

<Press onPress={() => console.log('pressed')}>
  <Text>点我</Text>
</Press>
```

### 案例 2：启用热区

```tsx
// 迁移前
import { Press } from '@sgfe/flower-rn'

<Press useHitSlop>
  <Icon />
</Press>

// 迁移后
import { Press } from '@sfe/wand-rn'

<Press enableHitSlop>
  <Icon />
</Press>
```

### 案例 3：自定义防抖时间

```tsx
// 迁移前
import { Press } from '@sgfe/flower-rn'

<Press throttleTime={2000} onPress={handleSubmit}>
  <Text>提交</Text>
</Press>

// 迁移后
import { Press } from '@sfe/wand-rn'

<Press debounceTime={2000} onPress={handleSubmit}>
  <Text>提交</Text>
</Press>
```

### 案例 4：PressOpacity - 基础用法

```tsx
// 迁移前
import { PressOpacity } from '@sgfe/flower-rn'

<PressOpacity onPress={() => handlePress()}>
  <Text>点击反馈</Text>
</PressOpacity>

// 迁移后
import { Press } from '@sfe/wand-rn'

<Press.Opacity onPress={() => handlePress()}>
  <Text>点击反馈</Text>
</Press.Opacity>
```

### 案例 5：PressOpacity - 自定义透明度

```tsx
// 迁移前
import { PressOpacity } from '@sgfe/flower-rn'

<PressOpacity activeOpacity={0.5} throttleTime={500}>
  <Text>自定义反馈</Text>
</PressOpacity>

// 迁移后
import { Press } from '@sfe/wand-rn'

<Press.Opacity activeOpacity={0.5} debounceTime={500}>
  <Text>自定义反馈</Text>
</Press.Opacity>
```

### 案例 6：PressHighlight - 基础用法

```tsx
// 迁移前
import { PressHighlight } from '@sgfe/flower-rn'

<PressHighlight onPress={() => handlePress()} useHitSlop>
  <Text>高亮反馈</Text>
</PressHighlight>

// 迁移后
import { Press } from '@sfe/wand-rn'

<Press.Highlight onPress={() => handlePress()} enableHitSlop>
  <Text>高亮反馈</Text>
</Press.Highlight>
```

### 案例 7：DoublePress - 双击事件

```tsx
// 迁移前
import { DoublePress } from '@sgfe/flower-rn'

<DoublePress onDoublePress={() => handleDoublePress()}>
  <Text>双击触发</Text>
</DoublePress>

// 迁移后
import { Press } from '@sfe/wand-rn'

<Press.Double onDoublePress={() => handleDoublePress()}>
  <Text>双击触发</Text>
</Press.Double>
```

### 案例 8：自定义热区（新功能）

```tsx
// 迁移前 - 无法自定义热区大小，只能用固定的 useHitSlop
import { Press } from '@sgfe/flower-rn'

<Press useHitSlop>
  <Icon size={20} />
</Press>

// 迁移后 - 可以灵活自定义热区大小
import { Press } from '@sfe/wand-rn'

<Press hitSlop={{ top: 10, bottom: 10, left: 15, right: 15 }}>
  <Icon size={20} />
</Press>
```

### 案例 9：热区、防抖、反馈综合使用

```tsx
// 迁移前
import { PressOpacity } from '@sgfe/flower-rn'

<PressOpacity
  useHitSlop
  throttleTime={800}
  activeOpacity={0.6}
  onPress={handleNavigation}
>
  <Text>导航</Text>
</PressOpacity>

// 迁移后
import { Press } from '@sfe/wand-rn'

<Press.Opacity
  enableHitSlop
  debounceTime={800}
  activeOpacity={0.6}
  onPress={handleNavigation}
>
  <Text>导航</Text>
</Press.Opacity>

// 或使用自定义热区
<Press.Opacity
  hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }}
  debounceTime={800}
  activeOpacity={0.6}
  onPress={handleNavigation}
>
  <Text>导航</Text>
</Press.Opacity>
```

### 案例 10：Press 基础组件 + 自定义样式

```tsx
// 迁移前
import { Press } from '@sgfe/flower-rn'

<Press
  useHitSlop
  throttleTime={600}
  onPress={handlePress}
  style={{ padding: 10 }}
>
  <Text>自定义样式</Text>
</Press>

// 迁移后
import { Press } from '@sfe/wand-rn'

<Press
  enableHitSlop
  debounceTime={600}
  onPress={handlePress}
  style={{ padding: 10 }}
>
  <Text>自定义样式</Text>
</Press>
```

## 关键点

- `useHitSlop` 改为 `enableHitSlop`
- `throttleTime` 改为 `debounceTime`，且默认值从 1000ms 改为 300ms
- 防抖实现方式改变：从 `throttle` 改为 `debounce`（`leading: true`）
  - 实际使用中，新版本在相同延迟时间内只执行第一次点击
  - 如果需要完全相同的防抖逻辑，建议适当调整 `debounceTime` 的值
- 热区数值调整：左右从 10px 改为 5px
- 新增 `hitSlop` 属性，允许自定义热区大小（优先级高于 `enableHitSlop`）
- 导入方式改变：
  - 原 `PressOpacity` 现为 `Press.Opacity`
  - 原 `PressHighlight` 现为 `Press.Highlight`
  - 原 `DoublePress` 现为 `Press.Double`
- 所有其他 Touchable 属性保持兼容
- 建议在迁移时统一检查防抖时间是否符合新的防抖逻辑预期
