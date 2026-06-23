# permissionHoc → WithPermission

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sgfe/permission/mrn`（`WithPermission`）

> 详细设计背景见 [`references/docs/permission-design.md`](../docs/permission-design.md)

## 迁移规则

`permissionHoc(Component, undefined, { parentId, permissionId, parentType })` 生成一个有权限控制的包裹组件。
其中只有 `permissionId` 有效，`parentId` 和 `parentType` 未使用。

迁移时：取 `permissionId` 的值作为 `WithPermission` 的 `code` prop，原 `Component` 作为子节点。

### 新增导入

```tsx
import { WithPermission } from '@sgfe/permission/mrn';
```

## 迁移示例

```tsx
// 迁移前
export const AmountAuthView = permissionHoc(View, undefined, {
    parentId: GROUP_AUTH_CODE,       // 未使用，忽略
    permissionId: AMOUNT_AUTH_CODE,  // 权限 code
    parentType: PermissionType.PAGE_ELEMENT  // 未使用，忽略
})

<AmountAuthView>
    {!!actualPay && <Text>￥{formatPrice(actualPay)}</Text>}
</AmountAuthView>

// 迁移后（删除 permissionHoc 定义，直接用 WithPermission 包裹）
<WithPermission code={AMOUNT_AUTH_CODE}>
    <View>
        {!!actualPay && <Text>￥{formatPrice(actualPay)}</Text>}
    </View>
</WithPermission>
```

## 关键点

- 只取 `permissionId` 字段，`parentId` 和 `parentType` 直接丢弃
- 原 `Component`（通常是 `View`）作为 `WithPermission` 的直接子节点
- 删除 `permissionHoc` 的变量定义行
