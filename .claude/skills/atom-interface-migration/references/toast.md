# toast Toast相关

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@mtfe/empower-atom-interface`

## 迁移对照表

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| showToast | toast.showToast | 命名空间导入 |
| showErrorToast | toast.showErrorToast | 命名空间导入 |

## 迁移示例

### 案例 1：显示普通 Toast

```tsx
// 迁移前
import { showToast } from '@mtfe/empower-trantor-mrn'

showToast('操作成功')

// 迁移后
import { toast } from '@mtfe/empower-atom-interface'

toast.showToast('操作成功')
```

### 案例 2：显示带配置的 Toast

```tsx
// 迁移前
import { showToast } from '@mtfe/empower-trantor-mrn'

showToast({
    message: '操作成功',
    duration: 2000
})

// 迁移后
import { toast } from '@mtfe/empower-atom-interface'

toast.showToast({
    message: '操作成功',
    duration: 2000
})
```

### 案例 3：显示错误 Toast

```tsx
// 迁移前
import { showErrorToast } from '@mtfe/empower-trantor-mrn'

showErrorToast('操作失败')

// 迁移后
import { toast } from '@mtfe/empower-atom-interface'

toast.showErrorToast('操作失败')
```

### 案例 4：显示带配置的错误 Toast

```tsx
// 迁移前
import { showErrorToast } from '@mtfe/empower-trantor-mrn'

showErrorToast({
    message: '操作失败',
    duration: 3000
})

// 迁移后
import { toast } from '@mtfe/empower-atom-interface'

toast.showErrorToast({
    message: '操作失败',
    duration: 3000
})
```

### 案例 5：完整示例

```tsx
// 迁移前
import { showToast, showErrorToast } from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const handleSuccess = () => {
        showToast('保存成功')
    }

    const handleError = () => {
        showErrorToast('保存失败，请重试')
    }

    return (
        <View>
            <Button onPress={handleSuccess}>保存</Button>
            <Button onPress={handleError}>失败</Button>
        </View>
    )
}

// 迁移后
import { toast } from '@mtfe/empower-atom-interface'

function MyComponent() {
    const handleSuccess = () => {
        toast.showToast('保存成功')
    }

    const handleError = () => {
        toast.showErrorToast('保存失败，请重试')
    }

    return (
        <View>
            <Button onPress={handleSuccess}>保存</Button>
            <Button onPress={handleError}>失败</Button>
        </View>
    )
}
```

### 案例 6：异步操作中的 Toast

```tsx
// 迁移前
import { showToast, showErrorToast } from '@mtfe/empower-trantor-mrn'

async function handleSubmit() {
    try {
        await submitForm()
        showToast('提交成功')
    } catch (error) {
        showErrorToast('提交失败')
    }
}

// 迁移后
import { toast } from '@mtfe/empower-atom-interface'

async function handleSubmit() {
    try {
        await submitForm()
        toast.showToast('提交成功')
    } catch (error) {
        toast.showErrorToast('提交失败')
    }
}
```

## 关键点

- **toast 命名空间**：所有 Toast 相关函数都通过 `toast` 命名空间导入
- **函数签名**：确保函数签名与原版本一致

## 迁移检查清单

- [ ] 将所有 `showToast` 改为 `toast.showToast`
- [ ] 将所有 `showErrorToast` 改为 `toast.showErrorToast`
- [ ] 验证 Toast 显示是否正常
- [ ] 验证错误 Toast 显示是否正常
- [ ] 验证 Toast 持续时间是否正确

## 注意事项

1. **参数一致性**：确保 Toast 的参数与原版本一致
2. **异步操作**：在异步操作中使用 Toast 时，确保正确处理成功和失败情况
3. **显示优先级**：多个 Toast 同时显示时，注意显示顺序和优先级
