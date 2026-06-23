# location 定位相关

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@mtfe/empower-atom-interface`

## 迁移对照表

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| checkIsRider | location.checkIsRider | 命名空间导入 |
| LocationExceptionType | locationTypes.LocationExceptionType | 命名空间导入 |
| setLocationServiceFlag | location.setLocationServiceFlag | 命名空间导入 |
| getLocationServiceFlag | location.getLocationServiceFlag | 命名空间导入 |
| startLocating | location.startLocating | 命名空间导入 |
| setConfig | location.setConfig | 命名空间导入 |
| autoStopLocating | location.autoStopLocating | 命名空间导入 |
| stopLocating | location.stopLocating | 命名空间导入 |
| getLocationInfo | location.getLocationInfo | 命名空间导入 |
| startListenLocatingChanged | location.startListenLocatingChanged | 命名空间导入 |
| stopListenLocatingChanged | location.stopListenLocatingChanged | 命名空间导入 |
| reportLocationException | location.reportLocationException | 命名空间导入 |
| setRiderFlag | location.setRiderFlag | 命名空间导入 |
| reportUnreportedLocations | location.reportUnreportedLocations | 命名空间导入 |
| getUnreportedLocations | location.getUnreportedLocations | 命名空间导入 |
| traceKeyEvent | location.traceKeyEvent | 命名空间导入 |

## 迁移示例

### 案例 1：检查是否为骑手

```tsx
// 迁移前
import { checkIsRider } from '@mtfe/empower-trantor-mrn'

const isRider = checkIsRider()

// 迁移后
import { location } from '@mtfe/empower-atom-interface'

const isRider = location.checkIsRider()
```

### 案例 2：设置定位服务标志

```tsx
// 迁移前
import { setLocationServiceFlag } from '@mtfe/empower-trantor-mrn'

setLocationServiceFlag(true)

// 迁移后
import { location } from '@mtfe/empower-atom-interface'

location.setLocationServiceFlag(true)
```

### 案例 3：获取定位服务标志

```tsx
// 迁移前
import { getLocationServiceFlag } from '@mtfe/empower-trantor-mrn'

const flag = getLocationServiceFlag()

// 迁移后
import { location } from '@mtfe/empower-atom-interface'

const flag = location.getLocationServiceFlag()
```

### 案例 4：开始定位

```tsx
// 迁移前
import { startLocating } from '@mtfe/empower-trantor-mrn'

startLocating()

// 迁移后
import { location } from '@mtfe/empower-atom-interface'

location.startLocating()
```

### 案例 5：设置定位配置

```tsx
// 迁移前
import { setConfig } from '@mtfe/empower-trantor-mrn'

setConfig({
    interval: 5000,
    distance: 10
})

// 迁移后
import { location } from '@mtfe/empower-atom-interface'

location.setConfig({
    interval: 5000,
    distance: 10
})
```

### 案例 6：自动停止定位

```tsx
// 迁移前
import { autoStopLocating } from '@mtfe/empower-trantor-mrn'

autoStopLocating()

// 迁移后
import { location } from '@mtfe/empower-atom-interface'

location.autoStopLocating()
```

### 案例 7：停止定位

```tsx
// 迁移前
import { stopLocating } from '@mtfe/empower-trantor-mrn'

stopLocating()

// 迁移后
import { location } from '@mtfe/empower-atom-interface'

location.stopLocating()
```

### 案例 8：获取定位信息

```tsx
// 迁移前
import { getLocationInfo } from '@mtfe/empower-trantor-mrn'

const locationInfo = getLocationInfo()

// 迁移后
import { location } from '@mtfe/empower-atom-interface'

const locationInfo = location.getLocationInfo()
```

### 案例 9：监听定位变化

```tsx
// 迁移前
import { startListenLocatingChanged, stopListenLocatingChanged } from '@mtfe/empower-trantor-mrn'

const handleLocationChange = (locationInfo) => {
    console.log('Location changed:', locationInfo)
}

startListenLocatingChanged(handleLocationChange)

// 组件卸载时
stopListenLocatingChanged(handleLocationChange)

// 迁移后
import { location } from '@mtfe/empower-atom-interface'

const handleLocationChange = (locationInfo) => {
    console.log('Location changed:', locationInfo)
}

location.startListenLocatingChanged(handleLocationChange)

// 组件卸载时
location.stopListenLocatingChanged(handleLocationChange)
```

### 案例 10：上报定位异常

```tsx
// 迁移前
import { reportLocationException, LocationExceptionType } from '@mtfe/empower-trantor-mrn'

reportLocationException({
    type: LocationExceptionType.PERMISSION_DENIED,
    message: 'Location permission denied'
})

// 迁移后
import { location, locationTypes } from '@mtfe/empower-atom-interface'

location.reportLocationException({
    type: locationTypes.LocationExceptionType.PERMISSION_DENIED,
    message: 'Location permission denied'
})
```

### 案例 11：设置骑手标志

```tsx
// 迁移前
import { setRiderFlag } from '@mtfe/empower-trantor-mrn'

setRiderFlag(true)

// 迁移后
import { location } from '@mtfe/empower-atom-interface'

location.setRiderFlag(true)
```

### 案例 12：上报未上报的定位

```tsx
// 迁移前
import { reportUnreportedLocations } from '@mtfe/empower-trantor-mrn'

reportUnreportedLocations()

// 迁移后
import { location } from '@mtfe/empower-atom-interface'

location.reportUnreportedLocations()
```

### 案例 13：获取未上报的定位

```tsx
// 迁移前
import { getUnreportedLocations } from '@mtfe/empower-trantor-mrn'

const locations = getUnreportedLocations()

// 迁移后
import { location } from '@mtfe/empower-atom-interface'

const locations = location.getUnreportedLocations()
```

### 案例 14：完整示例

```tsx
// 迁移前
import {
    startLocating,
    stopLocating,
    getLocationInfo,
    startListenLocatingChanged,
    stopListenLocatingChanged,
    checkIsRider,
    LocationExceptionType,
    reportLocationException
} from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const isRider = checkIsRider()

    useEffect(() => {
        const handleLocationChange = (info) => {
            console.log('Location:', info)
        }

        startLocating()
        startListenLocatingChanged(handleLocationChange)

        return () => {
            stopListenLocatingChanged(handleLocationChange)
            stopLocating()
        }
    }, [])

    const getCurrentLocation = () => {
        return getLocationInfo()
    }

    const reportError = () => {
        reportLocationException({
            type: LocationExceptionType.PERMISSION_DENIED,
            message: 'Permission denied'
        })
    }

    return <View>...</View>
}

// 迁移后
import { location, locationTypes } from '@mtfe/empower-atom-interface'

function MyComponent() {
    const isRider = location.checkIsRider()

    useEffect(() => {
        const handleLocationChange = (info) => {
            console.log('Location:', info)
        }

        location.startLocating()
        location.startListenLocatingChanged(handleLocationChange)

        return () => {
            location.stopListenLocatingChanged(handleLocationChange)
            location.stopLocating()
        }
    }, [])

    const getCurrentLocation = () => {
        return location.getLocationInfo()
    }

    const reportError = () => {
        location.reportLocationException({
            type: locationTypes.LocationExceptionType.PERMISSION_DENIED,
            message: 'Permission denied'
        })
    }

    return <View>...</View>
}
```

## 关键点

- **location 命名空间**：所有定位相关函数都通过 `location` 命名空间导入
- **locationTypes 命名空间**：类型定义通过 `locationTypes` 命名空间导入
- **监听器管理**：确保在组件卸载时正确清理监听器

## 迁移检查清单

- [ ] 将所有定位相关函数改为 `location.xxx()` 调用方式
- [ ] 将类型定义改为 `locationTypes.xxx`
- [ ] 更新 `LocationExceptionType` 为 `locationTypes.LocationExceptionType`
- [ ] 验证定位功能是否正常
- [ ] 验证监听器是否正确注册和清理
- [ ] 验证异常上报是否正常

## 注意事项

1. **类型导入**：类型定义从 `locationTypes` 命名空间导入
2. **监听器清理**：确保在组件卸载时调用 `stopListenLocatingChanged` 清理监听器
3. **异常类型**：`LocationExceptionType` 是枚举类型，确保使用正确的枚举值
