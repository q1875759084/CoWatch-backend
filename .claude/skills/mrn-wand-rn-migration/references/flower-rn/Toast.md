# Toast 轻提示

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 迁移结论

> **两者 API 完全相同**（wand-rn 的 Toast 是从 flower-rn 直接 fork 而来，未做任何 API 变更），只需替换 import 语句即可，无需修改任何使用代码。

## 迁移方式

仅替换 import 语句：

```tsx
// 迁移前
import { Toast } from '@sgfe/flower-rn'

// 迁移后
import { Toast } from '@sfe/wand-rn'
```

## API 对照（两者完全一致）

### 静态方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `Toast.info(props, duration?, onClose?, mask?)` | `string \| IToastProps` | 普通提示 |
| `Toast.success(props, duration?, onClose?, mask?)` | `string \| IToastProps` | 成功提示（带图标） |
| `Toast.fail(props, duration?, onClose?, mask?)` | `string \| IToastProps` | 失败提示（带图标） |
| `Toast.loading(props, duration?, onClose?, mask?)` | `string \| IToastProps` | 加载提示，默认不自动关闭 |
| `Toast.show(props, duration?, mask?)` | `string \| IToastProps` | **已废弃**，请使用 `Toast.info` |
| `Toast.remove(key)` | `number` | 移除指定 Toast |
| `Toast.removeAll()` | 无 | 移除所有 Toast |
| `Toast.config(props)` | `IToastConfigurable` | 设置全局默认配置 |
| `Toast.getConfig()` | 无 | 获取当前全局配置 |

### Props 接口

```tsx
interface IToastConfigurable {
  duration?: number       // 显示时长（ms），默认 3000；loading 默认 0（不自动关闭）
  onClose?: () => void    // 关闭后回调
  mask?: boolean          // 是否显示透明遮罩，默认 false；loading 默认 true
}

interface IToastProps extends IToastConfigurable {
  content: string | React.ReactNode  // 提示内容（必填）
}
```

### 常量

```tsx
Toast.SHORT = 3000  // 短时时长：3 秒
Toast.LONG = 8      // 长时时长
```

## 迁移示例

### 字符串形式

```tsx
// 迁移前
import { Toast } from '@sgfe/flower-rn'

Toast.info('操作成功')
Toast.success('提交成功', 2000)
Toast.fail('操作失败')
Toast.loading('加载中...')

// 迁移后
import { Toast } from '@sfe/wand-rn'

Toast.info('操作成功')       // 完全不变
Toast.success('提交成功', 2000)
Toast.fail('操作失败')
Toast.loading('加载中...')
```

### 对象形式

```tsx
// 迁移前
import { Toast } from '@sgfe/flower-rn'

const key = Toast.loading({
  content: '请稍候...',
  onClose: () => console.log('done'),
})
setTimeout(() => Toast.remove(key), 2000)

// 迁移后
import { Toast } from '@sfe/wand-rn'

const key = Toast.loading({  // 完全不变
  content: '请稍候...',
  onClose: () => console.log('done'),
})
setTimeout(() => Toast.remove(key), 2000)
```

### 全局配置

```tsx
// 迁移前
import { Toast } from '@sgfe/flower-rn'
Toast.config({ duration: 2000, mask: true })

// 迁移后
import { Toast } from '@sfe/wand-rn'
Toast.config({ duration: 2000, mask: true })  // 完全不变
```

## 关键点

- 两者 API **完全相同**，只需替换 import，不需要改动任何调用代码
- `Toast.show` 在两个库中均已标记为废弃，建议迁移时顺便替换为 `Toast.info`
- `loading` 类型默认 `duration=0`（不自动关闭）、`mask=true`，需手动调用 `Toast.remove(key)` 关闭
- 新显示 Toast 前会自动调用 `removeAll()` 清除已有 Toast（非堆叠模式）
