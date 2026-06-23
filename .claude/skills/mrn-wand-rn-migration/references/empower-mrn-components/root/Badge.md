# Badge 徽标

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `Badge` 组件迁移到 `@sfe/wand-rn` 的 `Badge` 组件。

## 迁移示例

```tsx
// 迁移前
import { Badge } from '@mtfe/empower-mrn-components'

// 迁移后
import { Badge } from '@sfe/wand-rn'
```

## 迁移检查清单

- [ ] 更新导入语句（Badge → Badge）
- [ ] 检查 props 是否有差异，参考 wand-rn 文档
- [ ] 验证数字、小红点等显示正常
