# Calendar 日历

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `Calendar` 组件迁移到 `@sfe/wand-rn` 的 `Calendar` 组件，支持 `Calendar.Day`（单日选择）、`Calendar.Range`（日期范围）、`Calendar.Multi`（多选）三种模式。

## 迁移示例

```tsx
// 迁移前
import { Calendar } from '@mtfe/empower-mrn-components'

// 迁移后
import { Calendar } from '@sfe/wand-rn'

// 单日选择
<Calendar.Day value={date} onChange={setDate} />

// 日期范围
<Calendar.Range value={[startDate, endDate]} onChange={setRange} />

// 多选
<Calendar.Multi value={dates} onChange={setDates} />
```

## 迁移检查清单

- [ ] 更新导入语句（Calendar → Calendar）
- [ ] 根据使用场景选择 Calendar.Day / Calendar.Range / Calendar.Multi
- [ ] 检查 props 是否有差异，参考 wand-rn 文档
- [ ] 验证日期选择、范围限制功能正常
