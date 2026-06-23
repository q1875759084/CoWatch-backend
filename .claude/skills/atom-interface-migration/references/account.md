# account 账号相关

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@mtfe/empower-atom-interface`

## 迁移对照表

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| shopUser | account.shopUser | 命名空间导入 |
| shopUserLogin | account.shopUserLogin | 命名空间导入 |
| shopUserLogout | account.shopUserLogout | 命名空间导入 |
| shopUserToken | account.shopUserToken | 命名空间导入 |
| saveShopUser | account.saveShopUser | 命名空间导入 |
| clearShopUser | account.clearShopUser | 命名空间导入 |
| getStoreInfo | account.getStoreInfo | 命名空间导入 |
| saveStoreInfo | account.saveStoreInfo | 命名空间导入 |
| saveCommonData | account.saveCommonData | 命名空间导入 |
| getHistoryAccounts | account.getHistoryAccounts | 命名空间导入 |
| saveHistoryAccounts | account.saveHistoryAccounts | 命名空间导入 |
| UserInfo | 类型定义 | 复制到本地 |
| StoreInfo | account.StoreInfo | 命名空间导入 |
| LOGOUT_BROADCAST_KEY | LOGOUT_BROADCAST_KEY | 直接导入 |

## 迁移示例

### 案例 1：获取店铺用户信息

```tsx
// 迁移前
import { shopUser } from '@mtfe/empower-trantor-mrn'

const user = shopUser()

// 迁移后
import { account } from '@mtfe/empower-atom-interface'

const user = account.shopUser()
```

### 案例 2：获取店铺信息

```tsx
// 迁移前
import { getStoreInfo } from '@mtfe/empower-trantor-mrn'

const storeInfo = getStoreInfo()

// 迁移后
import { account } from '@mtfe/empower-atom-interface'

const storeInfo = account.getStoreInfo()
```

### 案例 3：保存店铺信息

```tsx
// 迁移前
import { saveStoreInfo } from '@mtfe/empower-trantor-mrn'

saveStoreInfo(storeData)

// 迁移后
import { account } from '@mtfe/empower-atom-interface'

account.saveStoreInfo(storeData)
```

### 案例 4：用户登录

```tsx
// 迁移前
import { shopUserLogin } from '@mtfe/empower-trantor-mrn'

shopUserLogin()

// 迁移后
import { account } from '@mtfe/empower-atom-interface'

account.shopUserLogin()
```

### 案例 5：用户登出

```tsx
// 迁移前
import { shopUserLogout, LOGOUT_BROADCAST_KEY } from '@mtfe/empower-trantor-mrn'

shopUserLogout()

// 迁移后
import { account, LOGOUT_BROADCAST_KEY } from '@mtfe/empower-atom-interface'

account.shopUserLogout()
```

### 案例 6：获取用户 Token

```tsx
// 迁移前
import { shopUserToken } from '@mtfe/empower-trantor-mrn'

const token = shopUserToken()

// 迁移后
import { account } from '@mtfe/empower-atom-interface'

const token = account.shopUserToken()
```

### 案例 7：保存用户信息

```tsx
// 迁移前
import { saveShopUser } from '@mtfe/empower-trantor-mrn'

saveShopUser(userData)

// 迁移后
import { account } from '@mtfe/empower-atom-interface'

account.saveShopUser(userData)
```

### 案例 8：清除用户信息

```tsx
// 迁移前
import { clearShopUser } from '@mtfe/empower-trantor-mrn'

clearShopUser()

// 迁移后
import { account } from '@mtfe/empower-atom-interface'

account.clearShopUser()
```

### 案例 9：获取历史账号

```tsx
// 迁移前
import { getHistoryAccounts } from '@mtfe/empower-trantor-mrn'

const history = getHistoryAccounts()

// 迁移后
import { account } from '@mtfe/empower-atom-interface'

const history = account.getHistoryAccounts()
```

### 案例 10：保存历史账号

```tsx
// 迁移前
import { saveHistoryAccounts } from '@mtfe/empower-trantor-mrn'

saveHistoryAccounts(accounts)

// 迁移后
import { account } from '@mtfe/empower-atom-interface'

account.saveHistoryAccounts(accounts)
```

### 案例 11：保存公共数据

```tsx
// 迁移前
import { saveCommonData } from '@mtfe/empower-trantor-mrn'

saveCommonData(key, value)

// 迁移后
import { account } from '@mtfe/empower-atom-interface'

account.saveCommonData(key, value)
```

### 案例 12：类型定义 - UserInfo

```tsx
// 迁移前
import { UserInfo } from '@mtfe/empower-trantor-mrn'

const user: UserInfo = { ... }

// 迁移后 - 复制类型定义到本地
interface UserInfo {
    id: string
    name: string
    mobile: string
    // ... 其他字段根据业务需求定义
}

const user: UserInfo = { ... }
```

### 案例 13：类型定义 - StoreInfo

```tsx
// 迁移前
import { StoreInfo } from '@mtfe/empower-trantor-mrn'

const store: StoreInfo = { ... }

// 迁移后
import { account } from '@mtfe/empower-atom-interface'

const store: account.StoreInfo = { ... }
```

### 案例 14：完整示例

```tsx
// 迁移前
import {
    shopUser,
    getStoreInfo,
    shopUserLogin,
    shopUserLogout,
    UserInfo,
    StoreInfo,
    LOGOUT_BROADCAST_KEY
} from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const user = shopUser()
    const storeInfo = getStoreInfo()

    const handleLogin = () => {
        shopUserLogin()
    }

    const handleLogout = () => {
        shopUserLogout()
    }

    return <View>...</View>
}

// 迁移后
import { account, LOGOUT_BROADCAST_KEY } from '@mtfe/empower-atom-interface'

// UserInfo 类型定义复制到本地
interface UserInfo {
    id: string
    name: string
    // ...
}

function MyComponent() {
    const user = account.shopUser()
    const storeInfo = account.getStoreInfo()

    const handleLogin = () => {
        account.shopUserLogin()
    }

    const handleLogout = () => {
        account.shopUserLogout()
    }

    return <View>...</View>
}
```

## 关键点

- **命名空间导入**：所有账号相关函数都通过 `account` 命名空间导入
- **类型处理**：`UserInfo` 需要复制到本地，`StoreInfo` 可以从 `account.StoreInfo` 获取
- **常量导入**：`LOGOUT_BROADCAST_KEY` 直接从 atom-interface 导入

## 迁移检查清单

- [ ] 将所有账号相关函数改为 `account.xxx()` 调用方式
- [ ] 处理 `UserInfo` 类型定义，复制到本地或从 atom-interface 获取
- [ ] 处理 `StoreInfo` 类型，改为 `account.StoreInfo`
- [ ] 更新 `LOGOUT_BROADCAST_KEY` 的导入路径
- [ ] 验证登录/登出功能是否正常
- [ ] 验证店铺信息获取/保存是否正常
- [ ] 验证历史账号功能是否正常

## 注意事项

1. **UserInfo 类型**：需要根据业务需求复制到本地，atom-interface 中不提供此类型
2. **StoreInfo 类型**：可以从 `account.StoreInfo` 获取
3. **函数签名**：确保函数签名与原版本一致
