---
name: permission-mrn-migration
description: '支持从 @mtfe/empower-trantor-mrn 迁移权限相关函数和高阶组件到 @sgfe/permission/mrn。包含自动检测、代码生成、API 映射指南和最佳实践。使用此 Skill 来: (1) 查询具体权限函数/组件的迁移规则和示例, (2) 自动化导入语句替换, (3) 处理 HOC 到 Hook 的转换, (4) 处理权限竞争逻辑的迁移, (5) 查询技能支持哪些权限函数/组件的迁移'
---

# permission-mrn-migration Skill

一个 MRN 权限库迁移工具，用于帮助团队从 `@mtfe/empower-trantor-mrn` 迁移到统一的 `@sgfe/permission/mrn` 库。

## 查询支持迁移的函数/组件

当用户询问「这个技能支持哪些函数/组件的迁移？」时，按以下步骤获取列表：

1. 读取 [`references/`](references/) 目录下所有 `.md` 文件
2. 将结果展示给用户

## 迁移对照总览

### 高阶组件迁移

| 原函数/组件 | 新组件 | 说明 |
|-------------|--------|------|
| permissionHoc | WithPermission | 简单的权限包裹组件 |
| permissionConnect | WithPermission | 配置式权限包裹组件 |
| permissionRace | usePermission | 权限竞争逻辑，需重构为函数式组件 |

### 权限检查函数迁移

| 原函数 | 新函数 | 使用场景 |
|--------|--------|----------|
| checkPermissionConfigAsync | hasPermission / usePermission | 检查单个权限配置 |
| checkAsync | hasPermission / usePermission | 检查单个权限 |
| checkListAsync | hasPermission / usePermission | 检查多个权限 |
| checkPermissionConfigListAsync | hasPermission / usePermission | 检查多个权限配置 |

## 迁移方式说明

### 1. HOC → WithPermission 组件

对于 `permissionHoc` 和 `permissionConnect`，直接用 `<WithPermission code="xxx">` 包裹原组件：

```tsx
// 迁移前
const AuthView = permissionHoc(View, undefined, {
    permissionId: 'SOME_PERMISSION'
})

// 迁移后
<WithPermission code="SOME_PERMISSION">
    <View>...</View>
</WithPermission>
```

### 2. HOC → usePermission Hook

对于 `permissionRace`，需要重构为函数式组件，使用 `usePermission` Hook：

```tsx
// 迁移前
const PermissionButton = permissionRace(DefaultButton)

// 迁移后
const hasPermissionA = usePermission('PERMISSION_A');
if (hasPermissionA) {
    return <ButtonA />;
}
```

### 3. 异步权限检查 → usePermission / hasPermission

- **函数式组件**：使用 `usePermission` Hook
- **类组件/普通函数/Saga**：使用 `hasPermission` 函数

```tsx
// 函数式组件
const hasPermission = usePermission('CODE');

// 类组件/普通函数/Saga
const hasPermission = await hasPermission('CODE', axios);
```

## 迁移步骤

1. **扫描项目**：识别所有需要迁移的权限函数/组件
2. **分类处理**：根据迁移方式（HOC → WithPermission、HOC → usePermission、异步检查 → Hook/函数）分类
3. **修改导入**：更新 import 语句
4. **调整调用**：更新函数调用方式
5. **重构组件**：对于 `permissionRace`，需要重构为函数式组件
6. **测试验证**：确保权限控制功能正常

## 重要约束

1. **permissionRace 必须重构为函数式组件**：因为需要使用 `usePermission` Hook
2. **保留原有优先级顺序**：`permissionRace` 的竞争逻辑需要按原优先级顺序用 `if` 链替代
3. **嵌套 HOC 处理**：当权限 HOC 嵌套在其他 HOC 中时，需要提取中间组件
4. **connect 处理**：当权限 HOC 嵌套在 `connect` 中时，先 `connect` 再用 `WithPermission` 包裹

## 版本支持

- @sgfe/permission/mrn 版本：查询最新支持的版本
- Node.js：12.0.0+
