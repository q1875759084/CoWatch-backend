# MTDButton 按钮

> **重定向**：`MTDButton` 是 `@ss/mtd-react-native` 中 `Button` 的直接 re-export，迁移文档见：
> [`references/mtd-react-native/Button.md`](../../mtd-react-native/Button.md)

## 说明

```ts
// shuguopai/components/mtd-button/index.tsx
export { Button as MTDButton, ButtonProps as MTDButtonProps } from '@ss/mtd-react-native'
```

`MTDButton` 与 `@ss/mtd-react-native` 的 `Button` API 完全一致，迁移方式相同，唯一区别是导入语句：

```tsx
// 迁移前
import { MTDButton } from '@mtfe/empower-mrn-components/shuguopai'
<MTDButton ... />

// 迁移后
import { Button } from '@sfe/wand-rn'
<Button ... />
```
