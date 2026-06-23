# Verifier / RuleParams / VerifierError 表单校验器

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@utils/trantor`（`src/utils/trantor`）

> 注意：API **完全兼容**，只需替换 import 路径，无需修改调用代码。

## 迁移规则

将所有从 `@mtfe/empower-trantor-mrn` 导入的 `Verifier`、`RuleParams`、`VerifierError` 改为从 `@utils/trantor` 导入。

## 迁移示例

### 案例 1：导入 Verifier 类

```tsx
// 迁移前
import { Verifier } from '@mtfe/empower-trantor-mrn';

// 迁移后
import { Verifier } from '@utils/trantor';
```

### 案例 2：导入类型

```tsx
// 迁移前
import { RuleParams, VerifierError } from '@mtfe/empower-trantor-mrn';

// 迁移后
import type { RuleParams } from '@utils/trantor';
import { VerifierError } from '@utils/trantor';
```

> 注意：`RuleParams` 是 interface，可用 `import type`；`VerifierError` 是 class，不能用 `import type`。

### 案例 3：混合导入（部分可迁移）

```tsx
// 迁移前
import { Verifier, RuleParams, VerifierError, ModuleProvider } from '@mtfe/empower-trantor-mrn';

// 迁移后
import { ModuleProvider } from '@mtfe/empower-trantor-mrn';
import { Verifier, VerifierError } from '@utils/trantor';
import type { RuleParams } from '@utils/trantor';
```

### 案例 4：调用方式（无需修改）

```tsx
import { Verifier, VerifierError } from '@utils/trantor';
import type { RuleParams } from '@utils/trantor';

// 链式调用，与原来完全一致
const result = await new Verifier({ key: 'price', required: true })
    .trim()
    .nonEmpty('价格不能为空')
    .money('请输入有效价格')
    .validate(value);

// 捕获校验错误
try {
    await verifier.validate(value);
} catch (e) {
    if (e instanceof VerifierError) {
        console.log(e.message);
    }
}
```

## Verifier 常用方法

| 方法 | 说明 |
|------|------|
| `trim()` | 过滤首尾空白字符 |
| `filterEmoji()` | 过滤 Emoji 表情 |
| `nonEmpty(msg?)` | 不得为空 |
| `noEmoji(msg?)` | 不得包含 Emoji |
| `noCh(msg?)` | 不得包含中文 |
| `limitedStr({ min, max, message? })` | 字符串长度限制 |
| `intNum(msg?)` | 整型数值校验 |
| `floatNum(msg?)` | 浮点数值校验 |
| `money(msg?)` | 金钱格式校验 |
| `limitedNum({ min, max, inMin?, inMax?, message? })` | 数值范围限制 |
| `phone(msg?)` | 手机号校验 |
| `validate(v)` | 异步执行校验，返回 `Promise<string>` |
| `syncValidate(v)` | 同步执行校验 |

## 关键点

- `Verifier` 是 class，支持链式调用
- `RuleParams` 是 interface（类型），建议用 `import type`
- `VerifierError` 是 class，不能用 `import type`
