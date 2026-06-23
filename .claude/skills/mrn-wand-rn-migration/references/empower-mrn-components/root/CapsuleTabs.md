# CapsuleTabs 胶囊标签页

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `CapsuleTabs` 组件迁移到 `@sfe/wand-rn` 的 `CapsuleTabs` 组件，子项使用 `CapsuleTabs.Tab`。

## 迁移示例

```tsx
// 迁移前
import { CapsuleTabs } from '@mtfe/empower-mrn-components'

<CapsuleTabs>
    <CapsuleTabs.Tab key="1" title="标签一" />
    <CapsuleTabs.Tab key="2" title="标签二" />
</CapsuleTabs>

// 迁移后
import { CapsuleTabs } from '@sfe/wand-rn'

<CapsuleTabs>
    <CapsuleTabs.Tab key="1" title="标签一" />
    <CapsuleTabs.Tab key="2" title="标签二" />
</CapsuleTabs>
```

## 迁移检查清单

- [ ] 更新导入语句（CapsuleTabs → CapsuleTabs）
- [ ] 确认子项使用 `CapsuleTabs.Tab`
- [ ] 检查 props 是否有差异，参考 wand-rn 文档
- [ ] 验证胶囊样式标签切换功能正常
