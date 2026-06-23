# Collapsing 折叠面板

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `Collapsing` 组件迁移到 `@sfe/wand-rn` 的 `Collapsing` 组件。

## 迁移示例

```tsx
// 迁移前
import { Collapsing } from '@mtfe/empower-mrn-components'

// 迁移后
import { Collapsing } from '@sfe/wand-rn'
```

## 迁移检查清单

- [ ] 更新导入语句（Collapsing → Collapsing）
- [ ] 检查 props 是否有差异，参考 wand-rn 文档
- [ ] 验证展开/折叠动画和状态切换正常
