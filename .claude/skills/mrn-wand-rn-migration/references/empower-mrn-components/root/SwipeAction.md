# SwipeAction 滑动操作

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `SwipeAction` 组件迁移到 `@sfe/wand-rn` 的 `SwipeAction` 组件。

## 迁移示例

```tsx
// 迁移前
import { SwipeAction } from '@mtfe/empower-mrn-components'

// 迁移后
import { SwipeAction } from '@sfe/wand-rn'
```

## 迁移检查清单

- [ ] 更新导入语句（SwipeAction → SwipeAction）
- [ ] 检查 props 是否有差异，参考 wand-rn 文档
- [ ] 验证左滑/右滑操作按钮显示和回调正常
