# Empty 空状态

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `Empty` 组件迁移到 `@sfe/wand-rn` 的 `Placeholder` 组件。

## 迁移示例

```tsx
// 迁移前
import { Empty } from '@mtfe/empower-mrn-components'
<Empty description="暂无数据" />

// 迁移后
import { Placeholder } from '@sfe/wand-rn'
<Placeholder description="暂无数据" />
```

## 迁移检查清单

- [ ] 更新导入语句（Empty → Placeholder）
- [ ] 检查 props 是否有差异，参考 wand-rn 文档
- [ ] 验证空状态图片和描述显示正常
