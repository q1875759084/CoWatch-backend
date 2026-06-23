---
name: utils-trantor-migration
description: '支持从旧 MRN 库（@mtfe/empower-trantor-mrn）迁移工具函数、校验器和 Element 配置相关 API 到项目内部封装库 @utils/trantor（即 src/utils/trantor）。包含自动检测、代码生成、API 映射指南和最佳实践。使用此 Skill 来: (1) 分析项目中需要迁移的函数/类型, (2) 查询具体函数/类型的迁移规则和示例, (3) 自动化导入语句替换, (4) 查询技能支持哪些函数/类型的迁移'
---

# utils-trantor-migration Skill

一个迁移工具，用于帮助团队从 `@mtfe/empower-trantor-mrn` 迁移工具函数、表单校验器和 Element 配置 API 到项目内部封装库 `@utils/trantor`（源码位于 `src/utils/trantor`）。

## 背景

`@utils/trantor` 是项目内部对 `@mtfe/empower-trantor-mrn` 中工具类能力的本地封装，实现完全独立、无外部依赖。迁移后可减少对旧库的依赖，同时保持 API 完全兼容。

## 查询支持迁移的函数/类型

当用户询问「这个技能支持哪些函数/类型的迁移？」时，按以下步骤获取列表：

1. 读取 [`references/`](references/) 目录下所有 `.md` 文件
2. 将结果按模块分组展示给用户

## 迁移对照总览

### 校验器相关 (validation)

| 原函数/类型 | @utils/trantor 对应 | 说明 |
|-------------|---------------------|------|
| `bizVerifier` | `bizVerifier` | 业务校验对象，API 完全兼容 |
| `Verifier` | `Verifier` | 表单校验工具类，API 完全兼容 |
| `RuleParams` | `RuleParams` | 校验规则参数类型 |
| `VerifierError` | `VerifierError` | 校验失败异常类 |

### Element 配置相关 (element)

| 原函数/类型 | @utils/trantor 对应 | 说明 |
|-------------|---------------------|------|
| `ElementConfigProvider` | `ElementConfigProvider` | Element 配置 Provider 组件，API 完全兼容 |
| `getCurElementType` | `getCurElementType` | 获取当前 Element 类型，API 完全兼容 |
| `getElementConfig` | `getElementConfig` | 获取 Element 配置，API 完全兼容 |

### 工具函数相关 (utils)

| 原函数/类型 | @utils/trantor 对应 | 说明 |
|-------------|---------------------|------|
| `parseJSONSafely` | `parseJSONSafely` | 安全 JSON 解析，API 完全兼容 |
| `compare` | `compare` | 浅比较两个对象，API 完全兼容 |
| `safeSubString` | `safeSubString` | 安全字符串截取，API 完全兼容 |

## 完整迁移工作流

### 步骤 1：扫描项目中的使用情况

```bash
grep -rn "from '@mtfe/empower-trantor-mrn'" src --include="*.ts" --include="*.tsx"
```

过滤出可迁移的 symbol（见上方对照表），记录涉及文件列表。

### 步骤 2：判断是否可自动迁移

所有上表中的 symbol API 完全兼容，**只需替换 import 路径**，无需修改调用代码。

### 步骤 3：执行替换

**单个 symbol 单独导入时**，直接替换整行：

```tsx
// 迁移前
import { bizVerifier } from '@mtfe/empower-trantor-mrn';

// 迁移后
import { bizVerifier } from '@utils/trantor';
```

**多个 symbol 混合导入时**（部分可迁移、部分不可迁移），需拆分为两行：

```tsx
// 迁移前
import { bizVerifier, ModuleProvider } from '@mtfe/empower-trantor-mrn';

// 迁移后（拆分：可迁移的移到 @utils/trantor，不可迁移的保留原库）
import { ModuleProvider } from '@mtfe/empower-trantor-mrn';
import { bizVerifier } from '@utils/trantor';
```

**同文件已有 `@utils/trantor` import 时**，合并到同一行：

```tsx
// 迁移前
import { getCurElementType } from '@mtfe/empower-trantor-mrn';
import { bizVerifier } from '@utils/trantor';

// 迁移后
import { getCurElementType, bizVerifier } from '@utils/trantor';
```

### 步骤 4：修复 Lint 问题

```bash
npx eslint . --fix --ext .js,.jsx,.ts,.tsx
```

注意：只修复迁移引入的新问题，不修复存量 Lint 问题。

## 重要约束

1. **只迁移上表中列出的 symbol**，其他 symbol（如 `ModuleProvider`、`ChannelProvider`、`ErrorBoundary`、`createMonitorMiddleware` 等）不在此技能范围内
2. **API 完全兼容**，无需修改调用代码，只替换 import 路径
3. **`@utils/trantor` 路径别名**对应 `src/utils/trantor/index.ts`，通过 tsconfig paths 配置

## 不支持迁移的 Symbol（需走其他迁移路径）

以下 symbol 来自 `@mtfe/empower-trantor-mrn` 但**不在本技能范围**：

| Symbol | 迁移方向 |
|--------|---------|
| `Provider`（权限） | 已完成迁移（`OldPermissionProvider` + `@sgfe/permission/mrn`） |
| `ErrorBoundary` / `RootTagProvider` | mrn-wand-rn-migration 或 atom-interface-migration |
| `ModuleProvider` / `ChannelProvider` / `BatchStoreConfigProvider` / `LxProvider` | 专项迁移 |
| `usePermissionHook` | permission-mrn-migration |
| `createMonitorMiddleware` / `eventMonitor` / `SagaHandler` | 专项迁移 |
| `ModuleEvents` / `SpuMessage` / `Channel` / `PermissionConfig` | 专项迁移 |
| `sendCouponMessage` / `sendMerchandiseMessage` / `enableNewIM` | 专项迁移 |
| `mvHoc` / `useBatchStoreContext` / `MultiLocationType` | 专项迁移 |
| `getModules` / `reset` | 专项迁移 |
