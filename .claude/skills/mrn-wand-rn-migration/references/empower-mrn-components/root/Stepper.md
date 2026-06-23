# Stepper 步进器

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `Stepper` 组件迁移到 `@sfe/wand-rn` 的 `Stepper` 组件。

## 迁移示例

```tsx
// 迁移前
import { Stepper } from '@mtfe/empower-mrn-components'

// 迁移后
import { Stepper } from '@sfe/wand-rn'
```

## 迁移检查清单

- [ ] 更新导入语句（Stepper → Stepper）
- [ ] 检查 props 是否有差异，参考 wand-rn 文档
- [ ] 验证加减、最大最小值限制功能正常
