# ElementConfigProvider / getCurElementType / getElementConfig Element 配置

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@utils/trantor`（`src/utils/trantor`）

> 注意：API **完全兼容**，只需替换 import 路径，无需修改调用代码。

## 迁移规则

将所有从 `@mtfe/empower-trantor-mrn` 导入的 `ElementConfigProvider`、`getCurElementType`、`getElementConfig` 改为从 `@utils/trantor` 导入。

## 迁移示例

### 案例 1：单独导入 ElementConfigProvider

```tsx
// 迁移前
import { ElementConfigProvider } from '@mtfe/empower-trantor-mrn';

// 迁移后
import { ElementConfigProvider } from '@utils/trantor';
```

### 案例 2：与不可迁移 symbol 混合导入（需拆分）

```tsx
// 迁移前
import { LxProvider, ElementConfigProvider } from '@mtfe/empower-trantor-mrn';

// 迁移后（LxProvider 不可迁移，保留原库；ElementConfigProvider 拆出）
import { LxProvider } from '@mtfe/empower-trantor-mrn';
import { ElementConfigProvider } from '@utils/trantor';
```

### 案例 3：导入 getElementConfig

```tsx
// 迁移前
import { getElementConfig } from '@mtfe/empower-trantor-mrn';

// 迁移后
import { getElementConfig } from '@utils/trantor';
```

### 案例 4：调用方式（无需修改）

```tsx
import { ElementConfigProvider, getCurElementType, getElementConfig } from '@utils/trantor';
import { BusinessType } from '@config/type';
import { offlineElementConfig } from '@config/offline-element-config';
import { onLineElementConfig } from '@config/online-element-config';

// ElementConfigProvider 用法不变
<ElementConfigProvider
    config={{
        type: BusinessType.ONLINE,
        map: {
            [BusinessType.OFFLINE]: offlineElementConfig,
            [BusinessType.ONLINE]: onLineElementConfig,
        },
    }}
>
    {children}
</ElementConfigProvider>

// getCurElementType 用法不变
const currentType = getCurElementType();

// getElementConfig 用法不变
const config = getElementConfig({ type: BusinessType.ONLINE, key: 'someKey' });
```

## 关键点

- `ElementConfigProvider` 是 React 组件，props 与原版本完全一致
- `getCurElementType` 返回当前 Element 类型字符串
- `getElementConfig` 根据参数获取对应的 Element 配置值
- 三者均为本地实现，不依赖 `@mtfe/empower-trantor-mrn`
