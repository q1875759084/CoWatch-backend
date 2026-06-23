# 支持清空的字段（清空协议）

> 本文档记录商品创建/编辑页面中支持清空协议的字段。
> 清空协议：编辑模式下，字段值为空时，需要向后端传递 `{clean: true}` 标记以明确清空该字段。

## 变更日期

2024-04-28

## 涉及模块

租户主档商品创建/编辑（tenant-spu-detail）

## 支持清空的字段列表

| 字段名 | 字段说明 | 所属模块 | 数据类型 | 特殊处理逻辑 |
|--------|---------|---------|---------|-------------|
| `videoInfo` | 视频信息 | 基础信息-视频 | `object` | 需包含 `videoUrl` 字段才视为有效值 |
| `aiRecommendInfo` | AI推荐卖点 | 基础信息-AI卖点 | `object` | 需包含 `aiRecommendSellingPoint` 字段 |
| `backendCategoryCode` | 后端类目编码 | 基础信息-类目 | `string` | 取类目数组最后一项的 `value` |
| `nameSupplement` | 名称补充信息 | 基础信息-名称补充 | `object` | - |
| `storeCategoryList` | 门店前台分类 | 基础信息-门店分类 | `array` | 主档商品可见性控制 |
| `auxiliaryStoreCategoryList` | 辅助前台分类 | 基础信息-门店分类 | `array` | 辅助分类配置 |

## 清空协议实现说明

### 按数据类型的清空方式

| 数据类型 | 清空方式 | 示例 | 说明 |
|---------|---------|------|------|
| `object` 对象 | 传递 `{ clean: true }` | `{ clean: true }` | 用清空标记对象清空 |
| `array` 数组 | 传递空数组 `[]` | `[]` | 直接传递空数组 |
| `string` 字符串 | 传递空字符串 `''` | `''` | 直接传递空字符串 |
| `number` 数字 | ❌ 不支持清空 | - | 数字类型字段不支持清空操作 |

### 核心工具函数

位于 `packages/app-web/src/pages/tenant-spu-detail/utils/data-transform/field-transform-helper.ts`：

```typescript
// 清空标记常量（仅用于对象类型）
export const FIELD_CLEAR_MARKER = { clean: true };

// 通用对象转换函数
export function transformObjectForSubmit<T>(
    value: T | null | undefined,
    isEmptyFn: (val: T) => boolean,
    editMode: boolean,
    visible?: boolean
): T | typeof FIELD_CLEAR_MARKER | undefined;
```

### 字段转换函数

| 字段 | 转换函数 | 文件路径 |
|------|---------|---------|
| `videoInfo` | `transformVideoInfoForSubmit` | `fields/basic-info/video-info/utils.ts` |
| `aiRecommendInfo` | `transformAiRecommendInfoForSubmit` | `fields/basic-info/ai-selling-point/utils.ts` |
| `backendCategoryCode` | `transformBackendCategoryCodeForSubmit` | `fields/basic-info/category-id/utils.ts` |
| `nameSupplement` | `transformNameSupplementForSubmit` | `fields/basic-info/name-supplement/utils.ts` |
| `storeCategory` | `buildSubmitFrontCategoryList` | `fields/basic-info/store-category/utils.ts` |

### 创建模式 vs 编辑模式行为差异

| 模式 | 字段为空时的行为 |
|------|-----------------|
| 创建模式 (`editMode=false`) | 返回 `undefined`，字段不提交到后端 |
| 编辑模式 (`editMode=true`) | 返回 `{clean: true}`，明确告知后端清空该字段 |

### 字段可见性控制

所有字段支持通过 `visible` 参数控制：
- `visible=false`：字段隐藏，返回 `undefined`（不提交）
- `visible=true` 或未指定：按正常逻辑处理

### 具体字段清空示例

#### 对象类型字段（使用 `{ clean: true }`）
- `videoInfo`：视频信息对象
- `aiRecommendInfo`：AI推荐卖点对象  
- `nameSupplement`：名称补充信息对象

**示例**：编辑模式下清空视频信息
```typescript
// 用户清空了视频输入
const videoInfo = null; // 或 undefined
const result = transformVideoInfoForSubmit(videoInfo, true); // editMode=true
// 返回: { clean: true }
```

#### 数组类型字段（使用空数组 `[]`）
- `storeCategoryList`：门店前台分类
- `auxiliaryStoreCategoryList`：辅助前台分类

**示例**：编辑模式下清空门店分类
```typescript
// 用户清空了分类选择
const storeCategoryList = []; // 空数组
const result = buildSubmitFrontCategoryList(storeCategoryList, true); // editMode=true
// 返回: []
```

#### 字符串类型字段（使用空字符串 `''`）
- `backendCategoryCode`：后端类目编码

**示例**：编辑模式下清空类目编码
```typescript
// 用户清空了类目选择
const backendCategoryCode = ''; // 空字符串
const result = transformBackendCategoryCodeForSubmit(backendCategoryCode, true); // editMode=true
// 返回: ''
```

#### 数字类型字段（❌ 不支持清空）
- 不支持清空操作，保持原值或使用默认值

## 单测覆盖

相关单测文件位于 `packages/app-web/src/pages/tenant-spu-detail/__tests__/utils/`：

- `fields/basic-info/video-info.test.ts` - 17个测试用例
- `fields/basic-info/ai-selling-point.test.ts` - 11个测试用例
- `fields/basic-info/category-id.test.ts` - 9个测试用例
- `fields/basic-info/name-supplement.test.ts` - 10个测试用例
- `fields/basic-info/store-category.test.ts` - 20个测试用例
- `data-transform/field-transform-helper.test.ts` - 31个测试用例

## 相关文档

- 需求文档：https://km.sankuai.com/collabpage/2747948093
