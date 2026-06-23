# Form 表单

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 迁移说明

`@mtfe/empower-mrn-components` 的 `Form` 组件迁移到 `@sfe/wand-rn` 的 `Form` 组件，表单项使用 `Form.Item`。

## 迁移示例

```tsx
// 迁移前
import { Form } from '@mtfe/empower-mrn-components'

<Form>
    <Form.Item label="姓名" name="name">
        <Input />
    </Form.Item>
</Form>

// 迁移后
import { Form } from '@sfe/wand-rn'

<Form>
    <Form.Item label="姓名" name="name">
        <Input />
    </Form.Item>
</Form>
```

## 迁移检查清单

- [ ] 更新导入语句（Form → Form）
- [ ] 确认表单项使用 `Form.Item`
- [ ] 检查 props 是否有差异，参考 wand-rn 文档
- [ ] 验证表单验证、提交、重置功能正常
