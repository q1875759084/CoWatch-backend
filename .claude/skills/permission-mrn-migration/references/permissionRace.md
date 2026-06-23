# permissionRace → usePermission

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sgfe/permission/mrn`（`usePermission`）

> 详细设计背景见 [`references/docs/permission-design.md`](../docs/permission-design.md)

## 迁移规则

`permissionRace` 是最复杂的迁移场景。它表达一种"隐形竞争关系"：接收一组 `{ permissionKey, props, visible }` 配置，按优先级依次检查权限，渲染第一个有权限的组件。权限与组件功能耦合严重。

迁移时：
1. 将类组件重构为函数式组件
2. 用 `usePermission` 逐一检查每个权限 code
3. 按原优先级顺序用 `if` 判断，返回对应组件

### 新增导入

```tsx
import { usePermission } from '@sgfe/permission/mrn';
```

## 迁移示例

```tsx
// 迁移前
export const PermissionButton = permissionRace(DefaultButton)

// 使用处（优先级：PURCHASE_PRICE > CHANGE_ONLINE_PRICE > CHANGE_OFFLINE_PRICE）
<PermissionButton params={[editOnlinePurchasePriceItem, editOnlinePriceItem, editPriceItem]} />

const editOnlinePurchasePriceItem = {
    props: { name: '改价', onPress: () => goOnlinePricePage(merchandise.id) },
    permissionKey: PermissionKey.PURCHASE_PRICE,
    visible: true
}
const editOnlinePriceItem = {
    props: { name: '改价', onPress: () => goChangePrice() },
    permissionKey: PermissionKey.CHANGE_ONLINE_PRICE,
    visible: true
}
const editPriceItem = isConvenience ? {} : {
    props: { name: '报价', onPress: () => setPostPriceVisible(true) },
    permissionKey: PermissionKey.CHANGE_OFFLINE_PRICE,
    visible: true
}

// 迁移后（函数式组件，按优先级逐一判断）
const hasPurchasePrice = usePermission(PermissionKey.PURCHASE_PRICE);
const hasChangeOnlinePrice = usePermission(PermissionKey.CHANGE_ONLINE_PRICE);
const hasChangeOfflinePrice = usePermission(PermissionKey.CHANGE_OFFLINE_PRICE);

if (hasPurchasePrice) {
    return <DefaultButton name="改价" onPress={() => goOnlinePricePage(merchandise.id)} />;
}
if (hasChangeOnlinePrice) {
    return <DefaultButton name="改价" onPress={() => goChangePrice()} />;
}
if (!isConvenience && hasChangeOfflinePrice) {
    return <DefaultButton name="报价" onPress={() => setPostPriceVisible(true)} />;
}
return null;
```

## 复杂场景：`params` 数组动态传入（竞争组件作为公共组件导出）

当 `permissionRace` 包裹的组件被导出为公共组件、由调用方通过 `params` 数组传入竞争项时，将组件改造为接收 `params` prop 的函数式组件：

```tsx
// 迁移前
export const PermissionButton = permissionRace(DefaultButton);
// 调用方
<PermissionButton params={[itemA, itemB, itemC].filter(item => item.visible)} />

// 迁移后：组件内部用 usePermission 批量查询，findIndex 找第一个有权限的
export interface PermissionButtonRaceItem {
    props: PermissionButtonProps;
    permissionKey: string;
    visible?: boolean;
}

export const PermissionButton: React.FC<{ params: PermissionButtonRaceItem[] }> = ({ params }) => {
    const permissionKeys = params.map((item) => item.permissionKey);
    const permissionResults = usePermission(permissionKeys);
    const index = params.findIndex((_, i) => permissionResults[i]);
    if (index === -1) return null;
    return <DefaultButton {...params[index].props} />;
};
```

> 注意：调用方的 `params` 过滤逻辑（`filter(item => item.visible)`）保持不变，`visible` 字段仍由调用方控制。

## 关键点

- 必须将类组件重构为函数式组件才能使用 `usePermission`
- 保留原有优先级顺序，用 `if` 链替代 `permissionRace` 的内部竞争逻辑
- 原 `params` 数组中每个 item 的 `visible: false` 或空对象（`{}`）对应条件判断中的额外 guard（如 `!isConvenience`）
- 删除 `permissionRace` 的变量定义行
- 当竞争组件作为公共组件导出时，用 `usePermission(keys[])` + `findIndex` 模式替代逐一 `if` 判断
