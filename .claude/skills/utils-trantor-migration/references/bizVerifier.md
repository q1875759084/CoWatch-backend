# bizVerifier 业务校验对象

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@utils/trantor`（`src/utils/trantor`）

> 注意：API **完全兼容**，只需替换 import 路径，无需修改调用代码。

## 迁移规则

将 `import { bizVerifier } from '@mtfe/empower-trantor-mrn'` 替换为 `import { bizVerifier } from '@utils/trantor'`。

## 迁移示例

### 案例 1：单独导入

```tsx
// 迁移前
import { bizVerifier } from '@mtfe/empower-trantor-mrn';

// 迁移后
import { bizVerifier } from '@utils/trantor';
```

### 案例 2：与不可迁移 symbol 混合导入

```tsx
// 迁移前
import { bizVerifier, ModuleProvider } from '@mtfe/empower-trantor-mrn';

// 迁移后（拆分）
import { ModuleProvider } from '@mtfe/empower-trantor-mrn';
import { bizVerifier } from '@utils/trantor';
```

### 案例 3：调用方式（无需修改）

```tsx
// 迁移前后调用方式完全一致
const result = await bizVerifier.merchandiseName(value, {
    min: 1,
    max: 50,
    nonEmptyMsg: '商品名不能为空',
});
```

## bizVerifier 支持的校验方法

| 方法 | 说明 |
|------|------|
| `keyword(v, params?)` | 搜索关键词校验 |
| `name(v, params?)` | 人名校验 |
| `phone(v, params?)` | 手机号校验 |
| `money(v, params?)` | 金钱校验 |
| `merchandiseName(v, params?)` | 商品名校验（1-50字符） |
| `merchandiseUnit(v, params?)` | 商品单位校验（1-8字符） |
| `normalizeMerchandisePrice(v, params?)` | 商品价格规格化（过滤，不强校验） |
| `merchandisePrice(v, params?)` | 商品售价校验（0-9999.99） |
| `merchandiseCode(v, params?)` | 商品编码校验 |
| `normalizeMerchandiseStock(v, params?)` | 商品库存规格化 |
| `merchandiseStock(v, params?)` | 商品库存校验（1-99999） |
| `merchandiseSpec(v, params?)` | 商品规格校验（1-50字符） |
| `normalizeMerchandiseWeight(v, params?)` | 商品重量规格化 |
| `merchandiseWeight(v, params?)` | 商品重量校验（0-99999999） |
| `merchandiseSku(v, params?)` | 商品SKU校验（1-30字符） |
| `merchandiseUpc(v, params?)` | 商品UPC校验（1-30字符） |
| `shopName(v, params?)` | 门店名称校验 |
| `account(v, params?)` | 账户名校验 |
| `password(v, params?)` | 账户密码校验 |
| `epassportPassword(v, params?)` | epassport密码校验 |
| `orderSerialNum(v, params?)` | 订单流水号校验 |
| `remark(v, params?)` | 备注校验 |

## 关键点

- 所有方法返回 `Promise<string>`，resolve 时返回处理后的值，reject 时抛出 `VerifierError`
- API 与 `@mtfe/empower-trantor-mrn` 的 `bizVerifier` 完全一致
