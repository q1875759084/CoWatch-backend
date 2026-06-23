# NavBar 导航栏

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `NavBar` 组件迁移到 `@sfe/wand-rn` 的 `NavigationBar` 组件。

## 迁移示例

```tsx
// 迁移前
import { NavBar } from '@mtfe/empower-mrn-components'

// 迁移后
import { NavigationBar } from '@sfe/wand-rn'
```

## 迁移检查清单

- [ ] 更新导入语句（NavBar → NavigationBar）
- [ ] 检查 props 是否有差异，参考 wand-rn 文档
- [ ] 验证标题、返回按钮、右侧操作功能正常
