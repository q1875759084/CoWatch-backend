# Icon 图标

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
type AllIcons = 'check' | 'chevron-left' | 'chevron-right' | 'close' | 'warning-circle-o' | 
  'direction-right-m-o' | 'expand-more' | 'closed-l-o' | 'expand-less' | 'system-message-o' | 
  'position' | 'time-o' | 'printer-o' | 'question-circle-o' | 'closed-o' | 'add' | 'checkmark-o' | 
  'search' | 'bell-o' | 'backs-m-o' | 'forward-m-o' | 'forwards-m-o' | 'back-m-o' | 
  'direction-right-l-o' | 'reduction-o' | 'down' | 'delete-o' | 'right' | 'cart-o' | 'left' | 
  'error' | 'search-o' | 'direction-top-m-o' | 'direction-bottom-m-o' | 'praise-o' | 
  'expand_down' | 'expand_right' | 'up' | 'doubt' | 'doubt-o' | 'info-circle-o' | 'success-o' | 
  'scan' | 'add-o' | 'announcement-o' | 'loading' | 'avatar-o' | 'zoom-in' | 'direction-top-s-o' | 
  'direction-bottom-s-o' | 'success-f' | 'refresh-o' | 'shop-o' | 'careful-o' | 'fast-backward' | 
  'fast-forward' | 'remove' | 'edit-o' | 'error-o' | 'ellipsis' | 'setting' | 'lstop' | 
  'good-o' | 'bad-o' | 'copy-o' | 'filter-o' | 'picture-o' | 'help-o' | 'directions-left-l-o' | 
  'directions-right-l-o' | 'task'

interface IconProps {
  type: AllIcons
  size?: number  // 默认 22
  color?: string
  source?: ImageSourcePropType
  opacity?: number  // 默认 1
  style?: StyleProp<ImageStyle>
}
```

## 新组件 API

```tsx
type AllIcons = 
  | 'navigation-back'
  | 'left-arrow'
  | 'right-arrow'
  | 'double-left-arrow'
  | 'double-right-arrow'
  | 'mini-top-arrow'
  | 'mini-right-arrow'
  | 'mini-down-arrow'
  | 'edit-lg'
  | 'edit-md'
  | 'print'
  | 'phone'
  | 'amplify'
  | 'communicate'
  | 'scan-code'
  | 'delete'
  | 'set-up'
  | 'data'
  | 'search'
  | 'replace'
  | 'horn'
  | 'notice'
  | 'positioning'
  | 'device'
  | 'info-circle-outlined'
  | 'exclamation-circle-outlined'
  | 'question-circle-outlined'
  | 'close-outlined'
  | 'check-outlined'
  | 'add-outlined-lg'
  | 'add-outlined-md'
  | 'remove-outlined-lg'
  | 'remove-outlined-md'
  | 'clean'
  | 'back'
  | 'play'
  | 'loading'
  | 'spinner-loading'
  | 'download'
  | 'filter-outlined'
  | 'warning-circle-filled'
  | 'go-up'
  | 'go-down'
  | 'open-fullscreen'
  | 'close-fullscreen'
  | 'customer-service'

interface IconProps {
  type: AllIcons
  size?: number  // 默认 22
  color?: string
  source?: ImageSourcePropType
  opacity?: number  // 默认 1
  style?: StyleProp<ImageStyle> | ViewStyle
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| type | type | icon 名称，需要根据图标映射表更换 |
| size | size | 大小相同，默认值都是 22 |
| color | color | 颜色属性相同 |
| source | source | 自定义图片源相同 |
| opacity | opacity | 透明度相同，默认值都是 1 |
| style | style | 样式属性相同 |

## 图标名称映射表

由于两个组件库的图标资源不同，需要根据视觉效果选择对应的新图标名称：

| 旧图标名 (flower-rn) | 建议新图标名 (wand-rn) | 说明 |
|---------------------|----------------------|------|
| check | check-outlined | 勾选图标 |
| chevron-left | left-arrow | 左箭头 |
| chevron-right | right-arrow | 右箭头 |
| close | close-outlined | 关闭图标 |
| warning-circle-o | exclamation-circle-outlined | 警告图标 |
| expand-more | mini-down-arrow | 向下展开 |
| expand-less | mini-top-arrow | 向上收起 |
| position | positioning | 定位图标 |
| printer-o | print | 打印图标 |
| question-circle-o | question-circle-outlined | 问号图标 |
| add | add-outlined-lg | 添加图标（大） |
| add-o | add-outlined-md | 添加图标（中） |
| search | search | 搜索图标 |
| back-m-o | navigation-back | 返回图标 |
| left | left-arrow | 左箭头 |
| right | right-arrow | 右箭头 |
| down | mini-down-arrow | 下箭头 |
| up | mini-top-arrow | 上箭头 |
| delete-o | delete | 删除图标 |
| search-o | search | 搜索图标 |
| doubt-o | question-circle-outlined | 疑问图标 |
| info-circle-o | info-circle-outlined | 信息图标 |
| scan | scan-code | 扫码图标 |
| loading | loading 或 spinner-loading | 加载图标 |
| zoom-in | amplify | 放大图标 |
| refresh-o | replace | 刷新/替换图标 |
| edit-o | edit-lg 或 edit-md | 编辑图标 |
| error-o | exclamation-circle-outlined | 错误图标 |
| setting | set-up | 设置图标 |
| filter-o | filter-outlined | 筛选图标 |
| remove | remove-outlined-lg | 移除图标 |

**注意**：以下旧图标在新组件库中没有直接对应，需要使用自定义图片或寻找替代方案：
- chevron-left, chevron-right (可用 left-arrow, right-arrow 替代)
- direction-* 系列 (方向类图标，需用箭头图标替代)
- closed-*, forwards-*, backs-* 等业务特定图标
- success-o, success-f (成功图标，可考虑用 check-outlined)
- error (错误图标，可用 exclamation-circle-outlined 替代)
- cart-o, shop-o, praise-o, bell-o 等业务图标 (需使用自定义 source)

## 迁移示例

### 案例 1：基础图标使用

```tsx
// 迁移前
import { Icon } from '@sgfe/flower-rn'

<Icon type="check" size={24} color="#333" />

// 迁移后
import { Icon } from '@sfe/wand-rn'

<Icon type="check-outlined" size={24} color="#333" />
```

### 案例 2：方向箭头

```tsx
// 迁移前
<Icon type="chevron-left" size={20} color="#666" />
<Icon type="chevron-right" size={20} color="#666" />

// 迁移后
<Icon type="left-arrow" size={20} color="#666" />
<Icon type="right-arrow" size={20} color="#666" />
```

### 案例 3：带样式和透明度

```tsx
// 迁移前
<Icon 
  type="search" 
  size={22} 
  color="#999" 
  opacity={0.8}
  style={{ marginRight: 10 }} 
/>

// 迁移后
<Icon 
  type="search" 
  size={22} 
  color="#999" 
  opacity={0.8}
  style={{ marginRight: 10 }} 
/>
```

### 案例 4：自定义图片源

```tsx
// 迁移前
<Icon 
  type="check"  // type 在使用 source 时会被忽略
  source={require('./custom-icon.png')} 
  size={30}
  color="#FF6600"
/>

// 迁移后
<Icon 
  type="check-outlined"  // type 在使用 source 时会被忽略
  source={require('./custom-icon.png')} 
  size={30}
  color="#FF6600"
/>
```

### 案例 5：加载和警告图标

```tsx
// 迁移前
<Icon type="loading" size={20} />
<Icon type="warning-circle-o" size={24} color="red" />

// 迁移后
<Icon type="loading" size={20} />
<Icon type="exclamation-circle-outlined" size={24} color="red" />
```

### 案例 6：业务特定图标（需要自定义）

```tsx
// 迁移前
<Icon type="cart-o" size={24} />

// 迁移后 - 方案 1：使用自定义图片
<Icon 
  type="navigation-back"  // 占位，实际不使用
  source={require('@sgfe/flower-rn/components/basic-components/icon/images/cart-o.png')} 
  size={24} 
/>

// 迁移后 - 方案 2：寻找新的业务图标资源
// 如果设计团队提供了新的图标资源，建议使用新资源
```

## 关键点

1. **API 完全兼容**：除了图标名称（`type`）不同，其他所有 props 完全一致，迁移成本低
2. **图标名称变更**：两个库的图标资源不同，需要根据映射表替换图标名称
3. **默认值相同**：`size` 默认 22，`opacity` 默认 1，行为一致
4. **染色机制相同**：都使用 `tintColor` 实现图标颜色变更
5. **业务特定图标**：对于新库中不存在的业务图标，有两种方案：
   - 使用 `source` 属性引入旧图标资源
   - 与设计团队沟通，使用新的设计规范图标
6. **批量替换建议**：
   - 先使用 IDE 的查找替换功能批量替换 import 路径
   - 再根据映射表逐个替换图标名称
   - 最后检查视觉效果，确认图标是否符合预期
7. **性能优化**：两个组件都支持 mrn-babel-preset 插件进行图标体积优化，保持优化配置即可

## 注意事项

1. **图标资源差异**：新旧组件库的图标设计规范不同，迁移时需要视觉确认效果
2. **缺失图标处理**：对于映射表中未列出的图标，需要：
   - 查看新组件库的完整图标列表，选择最接近的图标
   - 或使用 `source` 属性自定义图片
   - 或与设计团队确认新的图标方案
3. **类型检查**：新组件的 `AllIcons` 类型会在编译时提示不存在的图标名，需要及时修正
4. **命名规范变化**：
   - 旧库：使用 `-o` 后缀表示 outlined 风格（如 `add-o`）
   - 新库：使用 `-outlined` 后缀（如 `add-outlined-md`）
   - 新库图标名称更语义化（如 `navigation-back` vs `back-m-o`）
