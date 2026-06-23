# Icon 图标

## 从何处迁移
- **源库**: `@roo/roo-rn1`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface IconProps {
  /** 图标类型名称（约 182 种） */
  type: AllIcons  // 必填
  /** 图标大小 */
  size?: number  // 默认 22
  /** 图标颜色 */
  tintColor?: string
  /** 自定义样式 */
  style?: StyleProp<ImageStyle>
  /** 自定义图标资源（覆盖 type 查找） */
  source?: ImageSourcePropType
}
```

## 新组件 API

```tsx
export interface IconProps {
  /** 图标类型名称（约 52 种） */
  type: AllIcons  // 必填
  /** 图标大小 */
  size?: number  // 默认 22
  /** 图标颜色 */
  color?: string
  /** 自定义样式 */
  style?: StyleProp<ImageStyle> | ViewStyle
  /** 自定义图标资源（覆盖 type 查找） */
  source?: ImageSourcePropType
  /** 图标透明度 */
  opacity?: number  // 默认 1
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| type | type | 图标名称体系完全不同，需逐一映射（见下方映射表） |
| size | size | 保持一致，默认值均为 22 |
| tintColor | color | 重命名，功能一致 |
| style | style | 类型更宽泛，新增支持 ViewStyle |
| source | source | 保持一致，可作为无对应图标时的逃生通道 |
| - | opacity | 新增，控制图标透明度，默认 1 |

## 图标名称映射表

以下为 roo-rn 常用图标在 wand-rn 中的对应名称：

| roo-rn (旧) | wand-rn (新) | 说明 |
|-------------|-------------|------|
| `chevron-left` | `left-arrow` | 左箭头 |
| `chevron-right` | `right-arrow` | 右箭头 |
| `left` | `navigation-back` | 左方向 |
| `right` | `mini-right-arrow` | 右方向 |
| `up` | `go-up` | 上方向 |
| `down` | `mini-down-arrow` | 下方向 |
| `arrow-left` | `navigation-back` | 左箭头 |
| `arrow-right` | `right-arrow` | 右箭头 |
| `close` | `close-outlined` | 关闭 |
| `search` | `search` | 搜索（名称相同） |
| `loading` | `loading` | 加载（名称相同，新增 `spinner-loading`） |
| `info-circle-o` | `info-circle-outlined` | 信息 |
| `question-circle-o` | `question-circle-outlined` | 问号 |
| `error-o` | `exclamation-circle-outlined` | 错误 |
| `success-o` | `check-outlined` | 成功 |
| `warning-circle-o` | `warning-circle-filled` | 警告 |
| `filter-o` | `filter-outlined` | 筛选 |
| `add` | `add-outlined-lg` | 添加 |
| `remove` | `remove-outlined-lg` | 移除 |
| `delete-o` | `delete` | 删除 |
| `setting` | `set-up` | 设置 |
| `edit-o` | `edit-lg` | 编辑 |

**重要**：roo-rn 拥有约 182 种图标，wand-rn 仅约 52 种。大量 roo-rn 图标（尤其是业务类的 `-f` 和 `-o` 系列）在 wand-rn 中没有对应图标。对于无对应的图标，使用 `source` 属性传入自定义图片资源作为逃生通道。

## 迁移示例

### 案例 1：基础图标

```tsx
// 迁移前
import { Icon } from '@roo/roo-rn1'

<Icon type="search" size={24} />

// 迁移后
import { Icon } from '@sfe/wand-rn'

<Icon type="search" size={24} />
```

### 案例 2：tintColor 重命名为 color

```tsx
// 迁移前
import { Icon } from '@roo/roo-rn1'

<Icon type="close" tintColor="#FF0000" />

// 迁移后
import { Icon } from '@sfe/wand-rn'

<Icon type="close-outlined" color="#FF0000" />
```

### 案例 3：方向箭头图标迁移

```tsx
// 迁移前
import { Icon } from '@roo/roo-rn1'

<Icon type="chevron-left" size={20} />
<Icon type="chevron-right" size={20} />
<Icon type="up" size={20} />
<Icon type="down" size={20} />

// 迁移后
import { Icon } from '@sfe/wand-rn'

<Icon type="left-arrow" size={20} />
<Icon type="right-arrow" size={20} />
<Icon type="go-up" size={20} />
<Icon type="mini-down-arrow" size={20} />
```

### 案例 4：状态图标迁移

```tsx
// 迁移前
import { Icon } from '@roo/roo-rn1'

<Icon type="success-o" tintColor="green" />
<Icon type="error-o" tintColor="red" />
<Icon type="warning-circle-o" tintColor="orange" />
<Icon type="info-circle-o" tintColor="blue" />

// 迁移后
import { Icon } from '@sfe/wand-rn'

<Icon type="check-outlined" color="green" />
<Icon type="exclamation-circle-outlined" color="red" />
<Icon type="warning-circle-filled" color="orange" />
<Icon type="info-circle-outlined" color="blue" />
```

### 案例 5：无对应图标 - 使用 source 逃生通道

```tsx
// 迁移前 - 使用 roo-rn 专有图标
import { Icon } from '@roo/roo-rn1'

<Icon type="shop-f" size={24} tintColor="#333" />

// 迁移后 - wand-rn 无对应图标，使用 source 属性
import { Icon } from '@sfe/wand-rn'

// 方案：将旧图标资源提取为本地图片，通过 source 属性引入
<Icon type="close-outlined" source={require('./assets/shop-icon.png')} size={24} color="#333" />
// 注意：type 仍为必填项，可填写任意有效值，source 会覆盖 type 的图标查找
```

### 案例 6：导航返回按钮

```tsx
// 迁移前
import { Icon } from '@roo/roo-rn1'

<TouchableOpacity onPress={goBack}>
  <Icon type="arrow-left" size={24} tintColor="#333" />
</TouchableOpacity>

// 迁移后
import { Icon } from '@sfe/wand-rn'

<TouchableOpacity onPress={goBack}>
  <Icon type="navigation-back" size={24} color="#333" />
</TouchableOpacity>
```

### 案例 7：带样式的图标

```tsx
// 迁移前
import { Icon } from '@roo/roo-rn1'

<Icon 
  type="setting" 
  size={28} 
  tintColor="#666"
  style={{ marginRight: 8 }} 
/>

// 迁移后
import { Icon } from '@sfe/wand-rn'

<Icon 
  type="set-up" 
  size={28} 
  color="#666"
  style={{ marginRight: 8 }} 
/>
```

### 案例 8：使用 opacity 新属性

```tsx
// 迁移前 - 通过 style 模拟透明度
import { Icon } from '@roo/roo-rn1'

<Icon type="info-circle-o" size={20} style={{ opacity: 0.5 }} />

// 迁移后 - 直接使用 opacity 属性
import { Icon } from '@sfe/wand-rn'

<Icon type="info-circle-outlined" size={20} opacity={0.5} />
```

### 案例 9：操作图标迁移

```tsx
// 迁移前
import { Icon } from '@roo/roo-rn1'

<Icon type="add" size={24} />
<Icon type="remove" size={24} />
<Icon type="delete-o" size={24} />
<Icon type="edit-o" size={24} />
<Icon type="filter-o" size={24} />

// 迁移后
import { Icon } from '@sfe/wand-rn'

<Icon type="add-outlined-lg" size={24} />
<Icon type="remove-outlined-lg" size={24} />
<Icon type="delete" size={24} />
<Icon type="edit-lg" size={24} />
<Icon type="filter-outlined" size={24} />
```

### 案例 10：完整复杂场景

```tsx
// 迁移前
import { Icon } from '@roo/roo-rn1'

const StatusIcon = ({ status }: { status: string }) => {
  const iconMap: Record<string, { type: string; color: string }> = {
    success: { type: 'success-o', color: '#00B365' },
    error: { type: 'error-o', color: '#FF4D4F' },
    warning: { type: 'warning-circle-o', color: '#FAAD14' },
    info: { type: 'info-circle-o', color: '#1677FF' },
  }
  const config = iconMap[status] || iconMap.info
  return <Icon type={config.type} size={20} tintColor={config.color} style={{ marginRight: 4 }} />
}

// 迁移后
import { Icon } from '@sfe/wand-rn'

const StatusIcon = ({ status }: { status: string }) => {
  const iconMap: Record<string, { type: string; color: string }> = {
    success: { type: 'check-outlined', color: '#00B365' },
    error: { type: 'exclamation-circle-outlined', color: '#FF4D4F' },
    warning: { type: 'warning-circle-filled', color: '#FAAD14' },
    info: { type: 'info-circle-outlined', color: '#1677FF' },
  }
  const config = iconMap[status] || iconMap.info
  return <Icon type={config.type} size={20} color={config.color} style={{ marginRight: 4 }} />
}
```

## 关键点

### 1. 图标名称体系完全不同
- roo-rn 拥有约 182 种图标，wand-rn 仅约 52 种
- 两者的命名规则不同，无法通过简单的字符串替换完成迁移
- 必须逐一对照映射表进行替换

### 2. tintColor 重命名为 color
- 旧版本：`tintColor` 属性
- 新版本：`color` 属性
- 功能完全一致，仅名称变化

### 3. 新增 opacity 属性
- 新版本新增 `opacity` 属性，默认值为 1
- 旧版本需通过 `style={{ opacity: 0.5 }}` 实现，新版本可直接使用属性

### 4. style 类型更宽泛
- 旧版本：`StyleProp<ImageStyle>`
- 新版本：`StyleProp<ImageStyle> | ViewStyle`
- 新版本额外支持 ViewStyle，兼容性更好

### 5. 无对应图标的处理
- 大量 roo-rn 图标在 wand-rn 中没有对应项
- 特别是业务类图标（`-f` 后缀的填充图标、部分 `-o` 后缀的线性图标）
- **解决方案**：使用 `source` 属性传入自定义图片资源，`source` 会覆盖 `type` 的图标查找逻辑
- `type` 仍为必填属性，传入任意有效值即可

### 6. source 属性保持一致
- 两个版本中 `source` 属性行为相同
- 传入 `ImageSourcePropType` 类型的资源
- 会覆盖基于 `type` 的图标查找

## 注意事项

1. **图标名称必须逐一映射**：不要假设名称相似就能直接使用，两套图标体系命名规则完全不同
2. **tintColor 必须改为 color**：这是一个必要的属性重命名，遗漏会导致颜色丢失
3. **无对应图标务必处理**：检查每一个使用的图标是否在 wand-rn 中有对应项，没有的需使用 `source` 逃生通道
4. **不要忽略动态图标名称**：如果代码中通过变量动态设置 `type`，需要在映射逻辑中统一处理
5. **opacity 属性可选优化**：如果旧代码通过 style 设置透明度，可考虑迁移为 `opacity` 属性（非必须）
6. **size 和 source 属性无需修改**：默认值和行为均保持一致

## 迁移检查清单

- [ ] 将所有 `import { Icon } from '@roo/roo-rn1'` 改为 `import { Icon } from '@sfe/wand-rn'`
- [ ] 将所有 `tintColor` 属性重命名为 `color`
- [ ] 逐一检查每个 `type` 值，按映射表替换为 wand-rn 对应的图标名称
- [ ] 对无对应的图标，使用 `source` 属性传入自定义图片资源
- [ ] 检查是否有动态设置 `type` 的场景，确保映射逻辑覆盖所有分支
- [ ] 可选：将 `style={{ opacity: x }}` 优化为 `opacity={x}` 属性
- [ ] 测试所有图标在不同尺寸和颜色下的显示效果
- [ ] 验证使用 `source` 逃生通道的图标显示正常
- [ ] 确认图标在暗色模式或主题切换时表现正确
