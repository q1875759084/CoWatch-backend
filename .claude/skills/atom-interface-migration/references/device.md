# device 设备相关

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`, `@mrn/mrn-knb`
- **目标库**: `@mtfe/empower-atom-interface`

## 迁移对照表

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| isAudioMute | device.isAudioMute | 命名空间导入 |
| setVoiceLouder | device.setVoiceLouder | 命名空间导入 |
| isVoiceTooSmall | device.isVoiceTooSmall | 命名空间导入 |
| hasNotificationPermission | device.hasNotificationPermission | 命名空间导入 |
| openNotificationSettings | device.openNotificationSettings | 命名空间导入 |
| hasLocationPermission | device.hasLocationPermission | 命名空间导入 |
| requestLocationPermission | device.requestLocationPermission | 命名空间导入 |
| enableSystemLocation | device.enableLocation | 命名空间导入 |
| isSystemLocationEnable | device.isLocationEnabled | 命名空间导入 |
| getWhiteListConfig | device.getWhiteListConfig | 命名空间导入 |
| getUserGuideUrl | device.getUserGuideUrl | 命名空间导入 |
| enableAppInnerLocation | device.enableAppInnerLocation | 命名空间导入 |
| openWhiteListIntent | device.openWhiteListIntent | 命名空间导入 |
| getDeviceInfo | device.getDeviceInfo | 命名空间导入 |
| hideKeyboard | device.hideKeyboard | 命名空间导入 |
| deleteCache | device.deleteCache | 命名空间导入 |
| hasLocationOncePermission | device.hasLocationOncePermission | 命名空间导入 |
| requestLocationOncePermission | device.requestLocationOncePermission | 命名空间导入 |
| hasLocationContinuousPermission | device.hasLocationContinuousPermission | 命名空间导入 |
| requestLocationContinuousPermission | device.requestLocationContinuousPermission | 命名空间导入 |
| isLowDevice | device.isLowDevice | 命名空间导入 |
| enablePlayBackgroundRemind | device.enablePlayBackgroundRemind | 命名空间导入 |
| hasBackgroundLocationPermission | device.hasBackgroundLocationPermission | 命名空间导入 |
| requestBackgroundLocationPermission | device.requestBackgroundLocationPermission | 命名空间导入 |
| hasLocationPermissionWhenUsing | device.hasLocationPermissionWhenUsing | 命名空间导入 |
| hasAudioOrNotificationError | device.hasAudioOrNotificationError | 命名空间导入 |
| KNB.getDeviceInfo | device.getDeviceInfo | 命名空间导入 |

## 迁移示例

### 案例 1：检查音频是否静音

```tsx
// 迁移前
import { isAudioMute } from '@mtfe/empower-trantor-mrn'

const muted = isAudioMute()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

const muted = device.isAudioMute()
```

### 案例 2：设置音量更大

```tsx
// 迁移前
import { setVoiceLouder } from '@mtfe/empower-trantor-mrn'

setVoiceLouder(true)

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

device.setVoiceLouder(true)
```

### 案例 3：检查音量是否过小

```tsx
// 迁移前
import { isVoiceTooSmall } from '@mtfe/empower-trantor-mrn'

const tooSmall = isVoiceTooSmall()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

const tooSmall = device.isVoiceTooSmall()
```

### 案例 4：检查通知权限

```tsx
// 迁移前
import { hasNotificationPermission } from '@mtfe/empower-trantor-mrn'

const hasPermission = hasNotificationPermission()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

const hasPermission = device.hasNotificationPermission()
```

### 案例 5：打开通知设置

```tsx
// 迁移前
import { openNotificationSettings } from '@mtfe/empower-trantor-mrn'

openNotificationSettings()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

device.openNotificationSettings()
```

### 案例 6：检查定位权限

```tsx
// 迁移前
import { hasLocationPermission } from '@mtfe/empower-trantor-mrn'

const hasPermission = hasLocationPermission()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

const hasPermission = device.hasLocationPermission()
```

### 案例 7：请求定位权限

```tsx
// 迁移前
import { requestLocationPermission } from '@mtfe/empower-trantor-mrn'

requestLocationPermission()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

device.requestLocationPermission()
```

### 案例 8：启用系统定位

```tsx
// 迁移前
import { enableSystemLocation } from '@mtfe/empower-trantor-mrn'

enableSystemLocation()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

device.enableLocation()
```

### 案例 9：检查系统定位是否启用

```tsx
// 迁移前
import { isSystemLocationEnable } from '@mtfe/empower-trantor-mrn'

const enabled = isSystemLocationEnable()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

const enabled = device.isLocationEnabled()
```

### 案例 10：获取白名单配置

```tsx
// 迁移前
import { getWhiteListConfig } from '@mtfe/empower-trantor-mrn'

const config = getWhiteListConfig()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

const config = device.getWhiteListConfig()
```

### 案例 11：获取用户引导 URL

```tsx
// 迁移前
import { getUserGuideUrl } from '@mtfe/empower-trantor-mrn'

const url = getUserGuideUrl()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

const url = device.getUserGuideUrl()
```

### 案例 12：启用应用内定位

```tsx
// 迁移前
import { enableAppInnerLocation } from '@mtfe/empower-trantor-mrn'

enableAppInnerLocation()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

device.enableAppInnerLocation()
```

### 案例 13：打开白名单 Intent

```tsx
// 迁移前
import { openWhiteListIntent } from '@mtfe/empower-trantor-mrn'

openWhiteListIntent()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

device.openWhiteListIntent()
```

### 案例 14：获取设备信息

```tsx
// 迁移前
import { getDeviceInfo } from '@mtfe/empower-trantor-mrn'

const deviceInfo = getDeviceInfo()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

const deviceInfo = device.getDeviceInfo()
```

### 案例 15：隐藏键盘

```tsx
// 迁移前
import { hideKeyboard } from '@mtfe/empower-trantor-mrn'

hideKeyboard()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

device.hideKeyboard()
```

### 案例 16：删除缓存

```tsx
// 迁移前
import { deleteCache } from '@mtfe/empower-trantor-mrn'

deleteCache()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

device.deleteCache()
```

### 案例 17：KNB.getDeviceInfo 迁移

```tsx
// 迁移前
import { KNB } from '@mrn/mrn-knb'

const deviceInfo = KNB.getDeviceInfo()

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

const deviceInfo = device.getDeviceInfo()
```

### 案例 18：完整示例

```tsx
// 迁移前
import {
    isAudioMute,
    hasNotificationPermission,
    hasLocationPermission,
    requestLocationPermission,
    getDeviceInfo
} from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const checkPermissions = () => {
        const audioMuted = isAudioMute()
        const hasNotify = hasNotificationPermission()
        const hasLoc = hasLocationPermission()

        if (!hasLoc) {
            requestLocationPermission()
        }
    }

    const getDevice = () => {
        return getDeviceInfo()
    }

    return <View>...</View>
}

// 迁移后
import { device } from '@mtfe/empower-atom-interface'

function MyComponent() {
    const checkPermissions = () => {
        const audioMuted = device.isAudioMute()
        const hasNotify = device.hasNotificationPermission()
        const hasLoc = device.hasLocationPermission()

        if (!hasLoc) {
            device.requestLocationPermission()
        }
    }

    const getDevice = () => {
        return device.getDeviceInfo()
    }

    return <View>...</View>
}
```

## 关键点

- **命名空间导入**：所有设备相关函数都通过 `device` 命名空间导入
- **函数重命名**：`enableSystemLocation` → `device.enableLocation`，`isSystemLocationEnable` → `device.isLocationEnabled`
- **KNB 迁移**：`KNB.getDeviceInfo` 迁移到 `device.getDeviceInfo`

## 迁移检查清单

- [ ] 将所有设备相关函数改为 `device.xxx()` 调用方式
- [ ] 更新 `enableSystemLocation` 为 `device.enableLocation`
- [ ] 更新 `isSystemLocationEnable` 为 `device.isLocationEnabled`
- [ ] 更新 `KNB.getDeviceInfo` 为 `device.getDeviceInfo`
- [ ] 验证权限检查功能是否正常
- [ ] 验证权限请求功能是否正常
- [ ] 验证设备信息获取是否正常

## 注意事项

1. **函数重命名**：注意 `enableSystemLocation` 和 `isSystemLocationEnable` 的函数名变化
2. **权限处理**：确保权限请求和检查的逻辑正确
3. **设备信息**：`getDeviceInfo` 返回的设备信息类型可能需要调整
