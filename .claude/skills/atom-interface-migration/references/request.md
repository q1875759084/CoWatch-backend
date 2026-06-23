# request 网络请求相关

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@mtfe/empower-atom-interface` 或 `axios`

## 迁移对照表

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| fetch | request.fetch | 命名空间导入 |
| upload | request.upload | 命名空间导入 |
| getNetworkStatus | request.getNetworkStatus | 命名空间导入 |
| NetMonitorStatus | request.NetMonitorStatus | 命名空间导入 |
| bizAxios | request.bizAxios | 命名空间导入 |
| ConflictCheckRequest | 使用axios或删除 | 迁移到axios |
| RequestSetting | 使用axios或删除 | 迁移到axios |
| storeRequest | 使用axios或删除 | 迁移到axios |
| RequestOptions | 使用axios或删除 | 迁移到axios |
| getBaseHeader | 使用axios或删除 | 迁移到axios |
| jsonParseResponse | 使用axios或删除 | 迁移到axios |
| getPureData | 使用axios或删除 | 迁移到axios |

## 迁移示例

### 案例 1：基础网络请求

```tsx
// 迁移前
import { fetch } from '@mtfe/empower-trantor-mrn'

fetch({
    url: '/api/data',
    method: 'GET'
}).then(response => {
    console.log(response.data)
})

// 迁移后
import { request } from '@mtfe/empower-atom-interface'

request.fetch({
    url: '/api/data',
    method: 'GET'
}).then(response => {
    console.log(response.data)
})
```

### 案例 2：POST 请求

```tsx
// 迁移前
import { fetch } from '@mtfe/empower-trantor-mrn'

fetch({
    url: '/api/create',
    method: 'POST',
    data: { name: 'test' }
}).then(response => {
    console.log(response.data)
})

// 迁移后
import { request } from '@mtfe/empower-atom-interface'

request.fetch({
    url: '/api/create',
    method: 'POST',
    data: { name: 'test' }
}).then(response => {
    console.log(response.data)
})
```

### 案例 3：文件上传

```tsx
// 迁移前
import { upload } from '@mtfe/empower-trantor-mrn'

upload({
    url: '/api/upload',
    file: fileObject
}).then(response => {
    console.log(response.data)
})

// 迁移后
import { request } from '@mtfe/empower-atom-interface'

request.upload({
    url: '/api/upload',
    file: fileObject
}).then(response => {
    console.log(response.data)
})
```

### 案例 4：获取网络状态

```tsx
// 迁移前
import { getNetworkStatus, NetMonitorStatus } from '@mtfe/empower-trantor-mrn'

const status = getNetworkStatus()
if (status === NetMonitorStatus.GOOD) {
    console.log('网络良好')
}

// 迁移后
import { request } from '@mtfe/empower-atom-interface'

const status = request.getNetworkStatus()
if (status === request.NetMonitorStatus.GOOD) {
    console.log('网络良好')
}
```

### 案例 5：使用 bizAxios

```tsx
// 迁移前
import { bizAxios } from '@mtfe/empower-trantor-mrn'

bizAxios.get('/api/data').then(response => {
    console.log(response.data)
})

// 迁移后
import { request } from '@mtfe/empower-atom-interface'

request.bizAxios.get('/api/data').then(response => {
    console.log(response.data)
})
```

### 案例 6：迁移到 axios

```tsx
// 迁移前 - 使用旧的请求方法
import {
    ConflictCheckRequest,
    RequestSetting,
    storeRequest,
    RequestOptions,
    getBaseHeader,
    jsonParseResponse,
    getPureData
} from '@mtfe/empower-trantor-mrn'

const options: RequestOptions = {
    url: '/api/data',
    method: 'GET'
}

const headers = getBaseHeader()
storeRequest(options)
const response = await ConflictCheckRequest(options)
const data = jsonParseResponse(response)
const pureData = getPureData(data)

// 迁移后 - 使用 axios
import axios from 'axios'

const response = await axios.get('/api/data', {
    headers: {
        // 自定义 headers
    }
})
const data = response.data
```

### 案例 7：完整示例

```tsx
// 迁移前
import {
    fetch,
    upload,
    getNetworkStatus,
    NetMonitorStatus
} from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const loadData = async () => {
        const status = getNetworkStatus()
        if (status !== NetMonitorStatus.GOOD) {
            console.warn('网络状态不佳')
            return
        }

        const response = await fetch({
            url: '/api/data',
            method: 'GET'
        })
        return response.data
    }

    const uploadFile = async (file) => {
        const response = await upload({
            url: '/api/upload',
            file
        })
        return response.data
    }

    return <View>...</View>
}

// 迁移后
import { request } from '@mtfe/empower-atom-interface'

function MyComponent() {
    const loadData = async () => {
        const status = request.getNetworkStatus()
        if (status !== request.NetMonitorStatus.GOOD) {
            console.warn('网络状态不佳')
            return
        }

        const response = await request.fetch({
            url: '/api/data',
            method: 'GET'
        })
        return response.data
    }

    const uploadFile = async (file) => {
        const response = await request.upload({
            url: '/api/upload',
            file
        })
        return response.data
    }

    return <View>...</View>
}
```

## 关键点

- **request 命名空间**：网络请求相关函数都通过 `request` 命名空间导入
- **axios 迁移**：部分旧的请求方法需要迁移到 axios
- **网络状态**：`NetMonitorStatus` 是枚举类型，包含 `OFFLINE`, `BAD`, `GOOD`, `MODERATE`, `UNKNOWN`

## 迁移检查清单

- [ ] 将所有 `fetch` 改为 `request.fetch`
- [ ] 将所有 `upload` 改为 `request.upload`
- [ ] 将所有 `getNetworkStatus` 改为 `request.getNetworkStatus`
- [ ] 将所有 `NetMonitorStatus` 改为 `request.NetMonitorStatus`
- [ ] 将所有 `bizAxios` 改为 `request.bizAxios`
- [ ] 将旧的请求方法迁移到 axios
- [ ] 验证网络请求功能是否正常
- [ ] 验证文件上传功能是否正常
- [ ] 验证网络状态检测是否正常

## 注意事项

1. **axios 迁移**：`ConflictCheckRequest`, `RequestSetting`, `storeRequest`, `RequestOptions`, `getBaseHeader`, `jsonParseResponse`, `getPureData` 需要迁移到 axios
2. **网络状态**：`NetMonitorStatus` 枚举值包括：
   - `OFFLINE`: 离线
   - `BAD`: 网络差
   - `GOOD`: 网络良好
   - `MODERATE`: 网络一般
   - `UNKNOWN`: 未知
3. **请求配置**：确保请求配置与原版本一致
4. **错误处理**：确保错误处理逻辑正确
