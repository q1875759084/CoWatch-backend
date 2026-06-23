# permissionConnect → WithPermission

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sgfe/permission/mrn`（`WithPermission`）

> 详细设计背景见 [`references/docs/permission-design.md`](../docs/permission-design.md)

## 迁移规则

`permissionConnect` 接收一个配置对象（`Type` + `defaultKey`），生成一个有权限控制的包裹组件。
迁移时：将生成的包裹组件的 JSX 用法，替换为 `<WithPermission code={defaultKey}>` 包裹原 `Type` 组件。

### 新增导入

```tsx
import { WithPermission } from '@sgfe/permission/mrn';
```

## 迁移示例

```tsx
// 迁移前
const SelfDeliveryAuthView = permissionConnect({
    Type: View,
    defaultKey: 'SELF_DELIVERY_VERIFICATION_BUTTON'
})

<SelfDeliveryAuthView
    style={[styles.box, { top: top }]}
    {..._panResponder.panHandlers}>
    <Button type='primary' onPress={setTrue}>自提取货码</Button>
</SelfDeliveryAuthView>

// 迁移后（删除 permissionConnect 定义，直接用 WithPermission 包裹）
<WithPermission code="SELF_DELIVERY_VERIFICATION_BUTTON">
    <View
        style={[styles.box, { top: top }]}
        {..._panResponder.panHandlers}>
        <Button type='primary' onPress={setTrue}>自提取货码</Button>
    </View>
</WithPermission>
```

## 复杂场景

### 场景 1：`permissionConnect` 嵌套在其他 HOC 中（如 `appearHoc`）

提取一个中间组件，再传给外层 HOC：

```tsx
// 迁移前
const AppearTips = appearHoc(
    permissionConnect({
        Type: Tip,
        defaultKey: PermissionKey.ISSUSE_MERCHANDISE,
    })
);

// 迁移后：提取中间组件
const PermissionTip = (props) => (
    <WithPermission code={PermissionKey.ISSUSE_MERCHANDISE}>
        <Tip {...props} />
    </WithPermission>
);
const AppearTips = appearHoc(PermissionTip);
```

### 场景 2：`permissionConnect` 嵌套在 `connect`（redux）中

将 `connect` 和权限控制拆分为两个独立层：

```tsx
// 迁移前
const EntryButton = connect(undefined, mapDispatch)(
    permissionConnect({ Type: PureTouchHighlight, defaultKey: PermissionKey.CREATE_MERCHANDISE })
);

// 迁移后：先 connect，再用 WithPermission 包裹
const ConnectedTouchHighlight = connect(undefined, mapDispatch)(PureTouchHighlight);

const EntryButton = (props: { id: string }) => (
    <WithPermission code={PermissionKey.CREATE_MERCHANDISE}>
        <ConnectedTouchHighlight {...props} />
    </WithPermission>
);
```

### 场景 3：`permissionConnect` 包裹的是函数（非 React 组件）

直接调用函数并将结果作为子节点：

```tsx
// 迁移前
const PermissionChangePrice = permissionConnect({
    Type: changePriceBtn,   // changePriceBtn 是一个返回 JSX 的函数
    defaultKey: PermissionKey.CHANGE_ONLINE_PRICE,
});
<PermissionChangePrice id={id} closeCurModal={closeCurModal} />

// 迁移后
<WithPermission code={PermissionKey.CHANGE_ONLINE_PRICE}>
    {changePriceBtn({ id, closeCurModal })}
</WithPermission>
```

## 关键点

- `defaultKey` 的值直接作为 `WithPermission` 的 `code` prop
- 原 `Type` 组件作为 `WithPermission` 的直接子节点，原来传给包裹组件的 props 移到 `Type` 组件上
- 删除 `permissionConnect` 的变量定义行
- 嵌套在其他 HOC 中时，提取中间组件再传给 HOC
- 嵌套在 `connect` 中时，先 `connect` 再用 `WithPermission` 包裹
