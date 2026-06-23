# Toast 轻提示

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `Toast` 组件迁移到 `@sfe/wand-rn` 的 `Toast` 组件。

## 迁移示例

```tsx
// 迁移前
import { Toast } from '@mtfe/empower-mrn-components'
Toast.show('提示信息')

// 迁移后
import { Toast } from '@sfe/wand-rn'
Toast.info('提示信息')
```

## 迁移检查清单

- [ ] 更新导入语句（Toast → Toast）
- [ ] 检查调用方式是否有差异（如 show → info）
- [ ] 验证各类型提示（成功、失败、警告）显示正常
