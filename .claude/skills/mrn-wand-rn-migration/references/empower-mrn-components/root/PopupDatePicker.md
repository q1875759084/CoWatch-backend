# PopupDatePicker 弹出日期选择器

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `PopupDatePicker` 组件迁移到 `@sfe/wand-rn` 的 `PopupDatePicker` 组件。

## 迁移示例

```tsx
// 迁移前
import { PopupDatePicker } from '@mtfe/empower-mrn-components'

// 迁移后
import { PopupDatePicker } from '@sfe/wand-rn'
```

## 迁移检查清单

- [ ] 更新导入语句（PopupDatePicker → PopupDatePicker）
- [ ] 检查 props 是否有差异，参考 wand-rn 文档
- [ ] 验证日期选择、确认、取消功能正常
