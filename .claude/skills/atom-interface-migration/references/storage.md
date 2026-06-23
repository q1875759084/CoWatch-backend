# storage 存储相关

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@mtfe/empower-atom-interface`

## 迁移对照表

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| getLocalStorage | storage.getLocalStorage | 命名空间导入 |
| cache | cache | 直接导入 |
| asyncCache | asyncCache | 直接导入 |
| getString | cache.getString | 命名空间导入 |
| putString | cache.putString | 命名空间导入 |
| remove | cache.remove | 命名空间导入 |
| putStringAsync | asyncCache.putStringAsync | 命名空间导入 |
| getStringAsync | asyncCache.getStringAsync | 命名空间导入 |
| removeAsync | asyncCache.removeAsync | 命名空间导入 |
| weaklyConfig | storage.weaklyConfig | 命名空间导入 |
| AsyncStorage | storage.AsyncStorage | 命名空间导入 |

## 迁移示例

### 案例 1：获取本地存储

```tsx
// 迁移前
import { getLocalStorage } from '@mtfe/empower-trantor-mrn'

const storage = getLocalStorage()
storage.set('key', 'value')
const value = storage.get('key')

// 迁移后
import { storage } from '@mtfe/empower-atom-interface'

const storage = storage.getLocalStorage()
storage.set('key', 'value')
const value = storage.get('key')
```

### 案例 2：使用 cache（内存存储）

```tsx
// 迁移前
import { cache } from '@mtfe/empower-trantor-mrn'

cache.putString('key', 'value')
const value = cache.getString('key')
cache.remove('key')

// 迁移后
import { cache } from '@mtfe/empower-atom-interface'

cache.putString('key', 'value')
const value = cache.getString('key')
cache.remove('key')
```

### 案例 3：使用 asyncCache（异步内存存储）

```tsx
// 迁移前
import { asyncCache } from '@mtfe/empower-trantor-mrn'

await asyncCache.putStringAsync('key', 'value')
const value = await asyncCache.getStringAsync('key')
await asyncCache.removeAsync('key')

// 迁移后
import { asyncCache } from '@mtfe/empower-atom-interface'

await asyncCache.putStringAsync('key', 'value')
const value = await asyncCache.getStringAsync('key')
await asyncCache.removeAsync('key')
```

### 案例 4：使用 weaklyConfig（持久化存储）

```tsx
// 迁移前
import { weaklyConfig } from '@mtfe/empower-trantor-mrn'

weaklyConfig.putString('key', 'value')
const value = weaklyConfig.getString('key')
weaklyConfig.remove('key')

// 迁移后
import { storage } from '@mtfe/empower-atom-interface'

const weaklyConfig = storage.weaklyConfig
weaklyConfig.putString('key', 'value')
const value = weaklyConfig.getString('key')
weaklyConfig.remove('key')
```

### 案例 5：使用 AsyncStorage

```tsx
// 迁移前
import { AsyncStorage } from '@mtfe/empower-trantor-mrn'

await AsyncStorage.setItem('key', 'value')
const value = await AsyncStorage.getItem('key')
await AsyncStorage.removeItem('key')

// 迁移后
import { storage } from '@mtfe/empower-atom-interface'

const AsyncStorage = storage.AsyncStorage
await AsyncStorage.setItem('key', 'value')
const value = await AsyncStorage.getItem('key')
await AsyncStorage.removeItem('key')
```

### 案例 6：AsyncStorage 批量操作

```tsx
// 迁移前
import { AsyncStorage } from '@mtfe/empower-trantor-mrn'

const pairs = [['key1', 'value1'], ['key2', 'value2']]
await AsyncStorage.multiSet(pairs)
const values = await AsyncStorage.multiGet(['key1', 'key2'])
await AsyncStorage.multiRemove(['key1', 'key2'])
await AsyncStorage.getAllKeys()
await AsyncStorage.clear()

// 迁移后
import { storage } from '@mtfe/empower-atom-interface'

const AsyncStorage = storage.AsyncStorage
const pairs = [['key1', 'value1'], ['key2', 'value2']]
await AsyncStorage.multiSet(pairs)
const values = await AsyncStorage.multiGet(['key1', 'key2'])
await AsyncStorage.multiRemove(['key1', 'key2'])
await AsyncStorage.getAllKeys()
await AsyncStorage.clear()
```

### 案例 7：完整示例

```tsx
// 迁移前
import {
    getLocalStorage,
    cache,
    asyncCache,
    weaklyConfig
} from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const handleSave = () => {
        // 内存存储
        cache.putString('tempKey', 'tempValue')

        // 持久化存储
        const storage = getLocalStorage()
        storage.set('persistKey', 'persistValue')

        // 持久化存储（weaklyConfig）
        weaklyConfig.putString('configKey', 'configValue')
    }

    const handleLoad = async () => {
        // 内存存储
        const tempValue = cache.getString('tempKey')

        // 持久化存储
        const storage = getLocalStorage()
        const persistValue = storage.get('persistKey')

        // 异步内存存储
        const asyncValue = await asyncCache.getStringAsync('asyncKey')

        // 持久化存储（weaklyConfig）
        const configValue = weaklyConfig.getString('configKey')
    }

    return <View>...</View>
}

// 迁移后
import { cache, asyncCache, storage } from '@mtfe/empower-atom-interface'

function MyComponent() {
    const weaklyConfig = storage.weaklyConfig

    const handleSave = () => {
        // 内存存储
        cache.putString('tempKey', 'tempValue')

        // 持久化存储
        const localStorage = storage.getLocalStorage()
        localStorage.set('persistKey', 'persistValue')

        // 持久化存储（weaklyConfig）
        weaklyConfig.putString('configKey', 'configValue')
    }

    const handleLoad = async () => {
        // 内存存储
        const tempValue = cache.getString('tempKey')

        // 持久化存储
        const localStorage = storage.getLocalStorage()
        const persistValue = localStorage.get('persistKey')

        // 异步内存存储
        const asyncValue = await asyncCache.getStringAsync('asyncKey')

        // 持久化存储（weaklyConfig）
        const configValue = weaklyConfig.getString('configKey')
    }

    return <View>...</View>
}
```

## 关键点

- **cache**：内存存储，App 重启清空，直接导入
- **asyncCache**：异步内存存储，直接导入
- **storage.getLocalStorage**：JSON 存储器工厂函数，返回 `{get, set, remove, empty}`
- **storage.weaklyConfig**：持久化存储实例
- **storage.AsyncStorage**：完整的 AsyncStorage API

## 迁移检查清单

- [ ] 将 `getLocalStorage` 改为 `storage.getLocalStorage`
- [ ] 将 `weaklyConfig` 改为 `storage.weaklyConfig`
- [ ] 将 `AsyncStorage` 改为 `storage.AsyncStorage`
- [ ] 验证内存存储功能是否正常
- [ ] 验证持久化存储功能是否正常
- [ ] 验证异步存储功能是否正常
- [ ] 验证 App 重启后持久化数据是否保留

## 注意事项

1. **存储类型选择**：
   - `cache`：内存存储，App 重启清空
   - `asyncCache`：异步内存存储，App 重启清空
   - `storage.getLocalStorage()`：JSON 存储器，持久化
   - `storage.weaklyConfig`：持久化存储实例
   - `storage.AsyncStorage`：完整的 AsyncStorage API

2. **数据类型**：`getLocalStorage()` 返回的存储器支持 JSON 序列化/反序列化

3. **异步操作**：`asyncCache` 和 `AsyncStorage` 的操作都是异步的，需要使用 `await`

4. **存储容量**：注意不同存储方式的容量限制
