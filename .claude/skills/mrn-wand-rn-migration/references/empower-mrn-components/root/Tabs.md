# Tabs 标签页

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `Tabs` 组件迁移到 `@sfe/wand-rn` 的 `Tabs` 组件，子项使用 `Tabs.TabPane`。

## 迁移示例

```tsx
// 迁移前
import { Tabs } from '@mtfe/empower-mrn-components'

<Tabs>
    <Tabs.TabPane key="1" tab="标签一">内容一</Tabs.TabPane>
    <Tabs.TabPane key="2" tab="标签二">内容二</Tabs.TabPane>
</Tabs>

// 迁移后
import { Tabs } from '@sfe/wand-rn'

<Tabs>
    <Tabs.TabPane key="1" tab="标签一">内容一</Tabs.TabPane>
    <Tabs.TabPane key="2" tab="标签二">内容二</Tabs.TabPane>
</Tabs>
```

## 迁移检查清单

- [ ] 更新导入语句（Tabs → Tabs）
- [ ] 确认子项使用 `Tabs.TabPane`
- [ ] 检查 props 是否有差异，参考 wand-rn 文档
- [ ] 验证标签切换、激活状态显示正常
