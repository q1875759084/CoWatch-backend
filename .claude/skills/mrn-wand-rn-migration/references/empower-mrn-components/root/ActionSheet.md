# ActionSheet 行动面板

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `ActionSheet` 组件迁移到 `@sfe/wand-rn` 的 `ActionSheet` 组件。

> 注意：`@mtfe/empower-mrn-components/shuguopai` 也有 `ActionSheet` 组件，迁移规则相同，但请参考 `shuguopai/ActionSheet.md` 获取详细的 API 对照。

## 迁移示例

```tsx
// 迁移前
import { ActionSheet } from '@mtfe/empower-mrn-components'

// 迁移后
import { ActionSheet } from '@sfe/wand-rn'
```

## 迁移检查清单

- [ ] 更新导入语句（ActionSheet → ActionSheet）
- [ ] 检查 props 是否有差异，参考 wand-rn 文档及 shuguopai/ActionSheet.md
- [ ] 验证选项显示和点击回调功能正常
