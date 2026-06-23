# Refresh 下拉刷新

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `Refresh` 组件迁移到 `@sfe/wand-rn` 的 `Refresh` 组件。

## 迁移示例

```tsx
// 迁移前
import { Refresh } from '@mtfe/empower-mrn-components'

// 迁移后
import { Refresh } from '@sfe/wand-rn'
```

## 迁移检查清单

- [ ] 更新导入语句（Refresh → Refresh）
- [ ] 检查 props 是否有差异，参考 wand-rn 文档
- [ ] 验证下拉触发、刷新动画、完成回调功能正常
