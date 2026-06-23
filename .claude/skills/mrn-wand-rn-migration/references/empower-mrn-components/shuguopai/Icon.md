# Icon 图标

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface IconProps {
    type?: AllIcons  // 图标类型
    size?: number  // 默认 22，图标尺寸
    tintColor?: string  // 图标染色颜色
    style?: StyleProp<ImageStyle>  // 图片样式
    source?: ImageSourcePropType  // 自定义图片源
}
```

## 新组件 API

```tsx
interface IconProps {
    type: AllIcons  // 图标类型（必填）
    size?: number  // 默认 22，图标尺寸
    color?: string  // 图标颜色
    opacity?: number  // 默认 1，图标透明度
    style?: StyleProp<ImageStyle> | ViewStyle  // 图片样式
    source?: ImageSourcePropType  // 自定义图片源
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| type | type | 图标类型，新组件为必填属性 |
| size | size | 图标尺寸，默认值相同（22） |
| tintColor | color | 颜色属性名称变更 |
| - | opacity | 新增透明度属性 |
| style | style | 保持不变 |
| source | source | 保持不变 |

## 图标类型差异

### 旧组件图标类型（部分）
`add-square-o`, `add`, `arrow-left`, `arrow-right`, `arrow-up`, `avatar-add-o`, `avatar-group-o`, `avatar-o`, `bankcard-o`, `bell-o`, `calculator`, `calendar-o`, `camera-o`, `cart-o`, `check`, `checkbox-checked-o`, `checkbox-indetermina-o`, `checkbox-unchecked-o`, `chevron-left`, `chevron-right`, `close`, `cloud-o`, `comment-o`, `contacts-o`, `copy-o`, `database-o`, `delete-o`, `down`, `download-o`, `edit-o`, `ellipsis`, `error-o`, `error`, `expand-less`, `expand-more`, `export-o`, `filter-o`, `home-o`, `info-circle-o`, `loading`, `phone`, `phone-o`, `position`, `question-circle-o`, `scan`, `search`, `setting`, `share`, `share-o`, `star`, `star-o`, `star-half`, `success-o`, `time-o`, `warning-circle-o` 等

### 新组件图标类型
`navigation-back`, `left-arrow`, `right-arrow`, `double-left-arrow`, `double-right-arrow`, `mini-top-arrow`, `mini-right-arrow`, `mini-down-arrow`, `edit-lg`, `edit-md`, `print`, `phone`, `amplify`, `communicate`, `scan-code`, `delete`, `set-up`, `data`, `search`, `replace`, `horn`, `notice`, `positioning`, `device`, `info-circle-outlined`, `exclamation-circle-outlined`, `question-circle-outlined`, `close-outlined`, `check-outlined`, `add-outlined-lg`, `add-outlined-md`, `remove-outlined-lg`, `remove-outlined-md`, `clean`, `loading`, `spinner-loading`, `download`, `filter-outlined`, `warning-circle-filled`, `go-up`, `go-down`, `open-fullscreen`, `close-fullscreen`, `customer-service` 等

**注意**: 新旧组件的图标类型名称和图标资源不完全相同，需要根据实际业务需求选择对应的图标，或使用 `source` 属性自定义图标。

## 迁移示例

### 案例 1：基础图标使用

```tsx
// 迁移前
import { Icon } from '@mtfe/empower-mrn-components/shuguopai'

<Icon type="search" size={24} />

// 迁移后
import { Icon } from '@sfe/wand-rn'

<Icon type="search" size={24} />
```

### 案例 2：带颜色的图标

```tsx
// 迁移前
import { Icon } from '@mtfe/empower-mrn-components/shuguopai'

<Icon 
  type="success-o" 
  size={32} 
  tintColor="#64b578" 
/>

// 迁移后
import { Icon } from '@sfe/wand-rn'

<Icon 
  type="check-outlined" 
  size={32} 
  color="#64b578" 
/>
```

### 案例 3：自定义图标源

```tsx
// 迁移前
import { Icon } from '@mtfe/empower-mrn-components/shuguopai'
import customIcon from './assets/custom.png'

<Icon 
  source={customIcon} 
  size={24} 
  tintColor="#333" 
  style={{ marginRight: 8 }}
/>

// 迁移后
import { Icon } from '@sfe/wand-rn'
import customIcon from './assets/custom.png'

<Icon 
  type="navigation-back"  // 使用自定义 source 时 type 仍为必填
  source={customIcon} 
  size={24} 
  color="#333" 
  style={{ marginRight: 8 }}
/>
```

### 案例 4：带样式的图标

```tsx
// 迁移前
import { Icon } from '@mtfe/empower-mrn-components/shuguopai'

<Icon 
  type="close" 
  size={20} 
  style={{ 
    marginTop: 10,
    marginRight: 5 
  }}
/>

// 迁移后
import { Icon } from '@sfe/wand-rn'

<Icon 
  type="close-outlined" 
  size={20} 
  style={{ 
    marginTop: 10,
    marginRight: 5 
  }}
/>
```

### 案例 5：加载图标

```tsx
// 迁移前
import { Icon } from '@mtfe/empower-mrn-components/shuguopai'

<Icon type="loading" size={24} />

// 迁移后
import { Icon } from '@sfe/wand-rn'

<Icon type="loading" size={24} />
// 或使用旋转加载图标
<Icon type="spinner-loading" size={24} />
```

### 案例 6：透明度设置（新增功能）

```tsx
// 迁移后可使用新增的 opacity 属性
import { Icon } from '@sfe/wand-rn'

<Icon 
  type="notice" 
  size={24} 
  color="#fa2c19"
  opacity={0.6}  // 设置 60% 透明度
/>
```

## 关键迁移点

1. **属性重命名**: `tintColor` → `color`
2. **type 必填**: 新组件中 `type` 属性变为必填，即使使用 `source` 自定义图标也需要提供 `type` 值
3. **图标类型映射**: 新旧组件的图标名称不同，需要根据语义找到对应图标：
   - `success-o` → `check-outlined`
   - `error-o` → `exclamation-circle-outlined`
   - `close` → `close-outlined`
   - `add` → `add-outlined-lg` 或 `add-outlined-md`
   - `remove` → `remove-outlined-lg` 或 `remove-outlined-md`
   - `info-circle-o` → `info-circle-outlined`
   - `question-circle-o` → `question-circle-outlined`
   - `warning-circle-o` → `warning-circle-filled`
   - `scan` → `scan-code`
   - `setting` → `set-up`
   - `position` → `positioning`
   - `left` / `arrow-left` / `chevron-left` → `left-arrow` 或 `navigation-back`
   - `right` / `arrow-right` / `chevron-right` → `right-arrow`
   - `up` / `arrow-up` / `expand-less` → `mini-top-arrow` 或 `go-up`
   - `down` / `expand-more` → `mini-down-arrow` 或 `go-down`
   - `filter-o` → `filter-outlined`
   - `download-o` → `download`
   - `edit-o` → `edit-lg` 或 `edit-md`
   - `delete-o` → `delete`
4. **新增功能**: `opacity` 属性可以控制图标透明度
5. **包体积优化**: 两个组件库都需要配合 babel 插件进行图标体积优化，确保项目配置了 `@sfe/wand-babel-preset` 或对应的 babel 预设
6. **不支持的图标**: 如果旧组件的某些图标在新组件中没有对应的类型（如 `avatar-o`, `bankcard-o`, `calculator`, `cart-o`, `checkbox-*`, `invoice-o` 等业务相关图标），需要使用 `source` 属性自定义图标，或联系设计师提供新的图标资源

## 注意事项

1. **图标迁移规划**: 由于两个组件库的图标资源不同，建议在迁移前先梳理项目中使用的所有图标类型，确认是否都有对应的新图标
2. **视觉一致性**: 新旧图标的视觉样式可能存在差异，迁移后需要进行视觉验收
3. **自定义图标**: 对于新组件库不支持的图标，可以将原图标资源导出，通过 `source` 属性使用
4. **resizeMode**: 旧组件默认设置了 `resizeMode='contain'`，新组件未显式设置但继承 Image 默认行为，如需要可通过 style 添加
5. **组件导入路径**: 确保从 `@sfe/wand-rn` 导入，而不是 `@mtfe/empower-mrn-components/shuguopai`
