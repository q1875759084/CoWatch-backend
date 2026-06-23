# PressOpacity 按钮透明度反馈

## ⚠️ 重要提示：组件名称变更

**最常见的迁移错误：** 迁移到 `@sfe/wand-rn` 后，组件名不是 `PressOpacity`，而是 **`Press.Opacity`**（子组件形式）。

```tsx
// ❌ 错误 - 这会导致导入失败
import { PressOpacity } from '@sfe/wand-rn'

// ✅ 正确
import { Press } from '@sfe/wand-rn'
// 然后使用 <Press.Opacity>
```

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface IPressOpacityProps extends TouchableOpacityProps {
  /** 是否启用默认热区 */
  useHitSlop?: boolean  // 默认 false
  /** 节流时间（毫秒） */
  throttleTime?: number  // 默认 1000
  /** 子元素 */
  children: React.ReactNode
  /** 按下时的透明度 */
  activeOpacity?: number  // 默认 0.7
}

// 默认常量
const HIT_SLOP = { top: 5, bottom: 5, left: 10, right: 10 }
const THROTTLE_TIME = 1000
const ACTIVE_OPACITY = 0.7
```

## 新组件 API

```tsx
interface PressOpacityProps extends TouchableOpacityProps {
  /** 是否启用默认热区 */
  enableHitSlop?: boolean  // 默认 false
  /** 防抖时间（毫秒） */
  debounceTime?: number  // 默认 300（来自 DEBOUNCE_WAIT_TIME）
  /** 子元素 */
  children: React.ReactNode
  /** 按下时的透明度 */
  activeOpacity?: number  // 默认 0.7
}

// 默认常量
const HIT_SLOP = { top: 5, bottom: 5, left: 5, right: 5 }
const WAIT_TIME = 300  // 默认防抖延迟
const ACTIVE_OPACITY = 0.7
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| useHitSlop | enableHitSlop | 属性名变更，功能保持一致 |
| throttleTime | debounceTime | 属性名变更，且默认值从 1000ms 改为 300ms；实现方式从 throttle 改为 debounce |
| activeOpacity | activeOpacity | 保持一致 |
| children | children | 保持一致 |
| 其他 TouchableOpacityProps | 其他 TouchableOpacityProps | 保持一致 |

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
- **新版本**：300ms（DEBOUNCE_WAIT_TIME）

## 迁移示例

### 案例 1：基础用法

```tsx
// 迁移前
import { PressOpacity } from '@sgfe/flower-rn'

<PressOpacity onPress={() => console.log('pressed')}>
  <Text>点我</Text>
</PressOpacity>

// 迁移后
import { Press } from '@sfe/wand-rn'

<Press.Opacity onPress={() => console.log('pressed')}>
  <Text>点我</Text>
</Press.Opacity>
```

### 案例 2：启用热区

```tsx
// 迁移前
import { PressOpacity } from '@sgfe/flower-rn'

<PressOpacity useHitSlop>
  <Icon />
</PressOpacity>

// 迁移后
import { Press } from '@sfe/wand-rn'

<Press.Opacity enableHitSlop>
  <Icon />
</Press.Opacity>
```

### 案例 3：自定义透明度反馈

```tsx
// 迁移前
import { PressOpacity } from '@sgfe/flower-rn'

<PressOpacity activeOpacity={0.5}>
  <Text>自定义反馈</Text>
</PressOpacity>

// 迁移后
import { Press } from '@sfe/wand-rn'

<Press.Opacity activeOpacity={0.5}>
  <Text>自定义反馈</Text>
</Press.Opacity>
```

### 案例 4：自定义防抖时间

```tsx
// 迁移前 - 2秒内防止连续点击
import { PressOpacity } from '@sgfe/flower-rn'

<PressOpacity throttleTime={2000} onPress={handleSubmit}>
  <Text>提交</Text>
</PressOpacity>

// 迁移后 - 使用 debounce，2秒内只处理第一次点击
import { Press } from '@sfe/wand-rn'

<Press.Opacity debounceTime={2000} onPress={handleSubmit}>
  <Text>提交</Text>
</Press.Opacity>
```

### 案例 5：热区与防抖组合

```tsx
// 迁移前
import { PressOpacity } from '@sgfe/flower-rn'

<PressOpacity useHitSlop throttleTime={500} onPress={handlePress}>
  <Icon size={20} />
</PressOpacity>

// 迁移后
import { Press } from '@sfe/wand-rn'

<Press.Opacity enableHitSlop debounceTime={500} onPress={handlePress}>
  <Icon size={20} />
</Press.Opacity>
```

### 案例 6：完整自定义组件

```tsx
// 迁移前
import { PressOpacity } from '@sgfe/flower-rn'

<PressOpacity
  useHitSlop
  throttleTime={800}
  activeOpacity={0.6}
  onPress={handleNavigation}
  style={{ padding: 10 }}
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
  style={{ padding: 10 }}
>
  <Text>导航</Text>
</Press.Opacity>
```

## 关键点

- 🔴 **【最重要】组件名称**: `PressOpacity` → **`Press.Opacity`**（必须通过 `Press` 对象访问）
  - ❌ 错误：`import { PressOpacity } from '@sfe/wand-rn'`
  - ✅ 正确：`import { Press } from '@sfe/wand-rn'` 然后使用 `<Press.Opacity>`
- `useHitSlop` 改为 `enableHitSlop`，作用一致
- `throttleTime` 改为 `debounceTime`，且默认值从 1000ms 改为 300ms
- 防抖实现方式改变：从 `throttle` 改为 `debounce`（`leading: true`）
  - 实际使用中，新版本在相同延迟时间内只执行第一次点击
  - 如果需要完全相同的防抖逻辑，建议适当调整 `debounceTime` 的值
- 热区数值调整：左右从 10px 改为 5px
- 所有其他 `TouchableOpacityProps` 属性保持兼容
- 建议在迁移时统一检查防抖时间是否符合新的防抖逻辑预期
