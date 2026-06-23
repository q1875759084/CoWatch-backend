# Provider 权限提供者

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: 重命名为 `OldPermissionProvider`（仍从 `@mtfe/empower-trantor-mrn` 导入）

> 注意：此组件**不迁移到 `@sfe/wand-rn`**，仅做别名重命名，以避免与 `react-redux` 的 `Provider` 命名冲突并明确语义。

## 迁移规则

将导入语句中的 `Provider` 重命名为 `OldPermissionProvider`，JSX 中同步替换。

## 迁移示例

### 案例 1：直接导入 Provider

```tsx
// 迁移前
import { Provider } from '@mtfe/empower-trantor-mrn';

// 迁移后
import { Provider as OldPermissionProvider } from '@mtfe/empower-trantor-mrn';
```

### 案例 2：与其他组件一起导入，且已有别名

```tsx
// 迁移前
import { ErrorBoundary, Provider as PermissionProvider, RootTagProvider } from '@mtfe/empower-trantor-mrn';

// 迁移后
import { ErrorBoundary, Provider as OldPermissionProvider, RootTagProvider } from '@mtfe/empower-trantor-mrn';
```

### 案例 3：JSX 中的使用

```tsx
// 迁移前
<PermissionProvider config={permissions}>
    <App />
</PermissionProvider>

// 迁移后
<OldPermissionProvider config={permissions}>
    <App />
</OldPermissionProvider>
```

## 配合 @sgfe/permission/mrn 的 PermissionProvider 使用

重命名后，还需在 `<OldPermissionProvider>` 外层包一层来自 `@sgfe/permission/mrn` 的 `PermissionProvider`，用于替代旧的权限体系。

### 需要新增的导入

```tsx
import { PermissionProvider } from '@sgfe/permission/mrn';
import { PlaceHolder } from '@sfe/wand-rn';
import axios from '@sgfe/enhanced-axios/mrn';
import { codeLog, Level, Type } from '@mtfe/empower-atom-interface';
// 注意：若文件已有上述部分导入，合并到已有行，不要重复导入
```

### JSX 结构

```tsx
// 迁移后：OldPermissionProvider 外层包 PermissionProvider
<PermissionProvider
    axiosInstance={axios}
    onError={({ retry }) => (
        <PlaceHolder
            type="Load"
            onPress={retry}
            buttonText="重试"
            description="权限获取失败，页面无法使用，请刷新重试或联系您的业务经理/客户成功经理"
        />
    )}
    reportMessage={({ error, type, level }) => {
        codeLog.report.reportMessage({
            scene: 'ocms',
            module: '<当前模块名>',   // 替换为实际模块名，参考文件中已有的 module 字段
            event: 'fetch_permission_info_fail',
            type: type ?? Type.REPORT_TYPE_ERROR,
            level: level ?? Level.REPORT_IMPORT,
            extra: { error: error },
        });
    }}
>
    <OldPermissionProvider config={permissionMap}>
        {/* 原有子树 */}
    </OldPermissionProvider>
</PermissionProvider>
```

### 参考实现

可参考 `src/bundles/merchandise-pool/edit.tsx` 中 `PermissionProvider` 的完整用法。

## 关键点

- 此组件**不迁移**到 `@sfe/wand-rn`，仍从 `@mtfe/empower-trantor-mrn` 导入
- 统一别名为 `OldPermissionProvider`，无论原来是 `Provider` 还是 `PermissionProvider`
- `react-redux` 的 `Provider` 不受影响，不要修改
- `PlaceHolder` 从 `@sfe/wand-rn` 导入，若文件已有该库的导入，合并到同一行
- `module` 字段使用文件中已有的模块名，保持一致
