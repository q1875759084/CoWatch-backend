# router 路由相关

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`, `@mrn/mrn-knb`
- **目标库**: `@mtfe/empower-atom-interface`

## 迁移对照表

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| jumpToPage | router.jumpToPage | 命名空间导入 |
| jumpToPageWithCallback | router.jumpToPageWithCallback | 命名空间导入 |
| jumpToWebPage | router.jumpToWebPage | 命名空间导入 |
| jumpToOutWebPage | router.jumpToOutWebPage | 命名空间导入 |
| jumpToRoute | router.jumpToRoute | 命名空间导入 |
| openOutH5 | router.openOutH5 | 命名空间导入 |
| openPage | router.openPage | 命名空间导入 |
| isInstalledApp | router.isInstalledApp | 命名空间导入 |
| jumpToAppStore | router.jumpToAppStore | 命名空间导入 |
| navigator | navigator | 命名空间导入 |
| navigate | navigator.navigate | 命名空间导入 |
| pop | navigator.pop | 命名空间导入 |
| getTopNavigator | navigator.getTopNavigator | 命名空间导入 |
| setTopLevelNavigator | navigator.setTopLevelNavigator | 命名空间导入 |
| KNB.openPage | router.openPage | 命名空间导入 |

## 迁移示例

### 案例 1：跳转到 MRN 页面

```tsx
// 迁移前
import { jumpToPage } from '@mtfe/empower-trantor-mrn'

jumpToPage({
    url: 'mrn://app/page',
    params: { id: 123 }
})

// 迁移后
import { router } from '@mtfe/empower-atom-interface'

router.jumpToPage({
    url: 'mrn://app/page',
    params: { id: 123 }
})
```

### 案例 2：跳转到 MRN 页面（带回调）

```tsx
// 迁移前
import { jumpToPageWithCallback } from '@mtfe/empower-trantor-mrn'

jumpToPageWithCallback({
    url: 'mrn://app/page',
    params: { id: 123 },
    callback: (result) => {
        console.log('返回结果:', result)
    }
})

// 迁移后
import { router } from '@mtfe/empower-atom-interface'

router.jumpToPageWithCallback({
    url: 'mrn://app/page',
    params: { id: 123 },
    callback: (result) => {
        console.log('返回结果:', result)
    }
})
```

### 案例 3：跳转到内嵌 H5

```tsx
// 迁移前
import { jumpToWebPage } from '@mtfe/empower-trantor-mrn'

jumpToWebPage({
    url: 'https://example.com'
})

// 迁移后
import { router } from '@mtfe/empower-atom-interface'

router.jumpToWebPage({
    url: 'https://example.com'
})
```

### 案例 4：跳转到外部 H5

```tsx
// 迁移前
import { jumpToOutWebPage } from '@mtfe/empower-trantor-mrn'

jumpToOutWebPage({
    url: 'https://example.com'
})

// 迁移后
import { router } from '@mtfe/empower-atom-interface'

router.jumpToOutWebPage({
    url: 'https://example.com'
})
```

### 案例 5：跳转到路由

```tsx
// 迁移前
import { jumpToRoute } from '@mtfe/empower-trantor-mrn'

jumpToRoute({
    route: '/detail',
    params: { id: 123 }
})

// 迁移后
import { router } from '@mtfe/empower-atom-interface'

router.jumpToRoute({
    route: '/detail',
    params: { id: 123 }
})
```

### 案例 6：打开外部 H5

```tsx
// 迁移前
import { openOutH5 } from '@mtfe/empower-trantor-mrn'

openOutH5('https://example.com')

// 迁移后
import { router } from '@mtfe/empower-atom-interface'

router.openOutH5('https://example.com')
```

### 案例 7：打开页面

```tsx
// 迁移前
import { openPage } from '@mtfe/empower-trantor-mrn'

openPage({
    url: 'mrn://app/page'
})

// 迁移后
import { router } from '@mtfe/empower-atom-interface'

router.openPage({
    url: 'mrn://app/page'
})
```

### 案例 8：检查应用是否已安装

```tsx
// 迁移前
import { isInstalledApp } from '@mtfe/empower-trantor-mrn'

const installed = isInstalledApp('com.example.app')

// 迁移后
import { router } from '@mtfe/empower-atom-interface'

const installed = router.isInstalledApp('com.example.app')
```

### 案例 9：跳转到应用商店

```tsx
// 迁移前
import { jumpToAppStore } from '@mtfe/empower-trantor-mrn'

jumpToAppStore('com.example.app')

// 迁移后
import { router } from '@mtfe/empower-atom-interface'

router.jumpToAppStore('com.example.app')
```

### 案例 10：Navigator 导航

```tsx
// 迁移前
import { navigator, navigate, pop } from '@mtfe/empower-trantor-mrn'

navigate('DetailPage', { id: 123 })
pop()

// 迁移后
import { navigator } from '@mtfe/empower-atom-interface'

navigator.navigate('DetailPage', { id: 123 })
navigator.pop()
```

### 案例 11：获取顶层 Navigator

```tsx
// 迁移前
import { getTopNavigator } from '@mtfe/empower-trantor-mrn'

const nav = getTopNavigator()
nav.navigate('Home')

// 迁移后
import { navigator } from '@mtfe/empower-atom-interface'

const nav = navigator.getTopNavigator()
nav.navigate('Home')
```

### 案例 12：设置顶层 Navigator

```tsx
// 迁移前
import { setTopLevelNavigator } from '@mtfe/empower-trantor-mrn'

setTopLevelNavigator(navigationRef)

// 迁移后
import { navigator } from '@mtfe/empower-atom-interface'

navigator.setTopLevelNavigator(navigationRef)
```

### 案例 13：KNB.openPage 迁移

```tsx
// 迁移前
import { KNB } from '@mrn/mrn-knb'

KNB.openPage({
    url: 'mrn://app/page'
})

// 迁移后
import { router } from '@mtfe/empower-atom-interface'

router.openPage({
    url: 'mrn://app/page'
})
```

### 案例 14：完整示例

```tsx
// 迁移前
import {
    jumpToPage,
    jumpToWebPage,
    navigator,
    navigate,
    pop
} from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const handleGoToDetail = () => {
        jumpToPage({
            url: 'mrn://app/detail',
            params: { id: 123 }
        })
    }

    const handleGoToWeb = () => {
        jumpToWebPage({
            url: 'https://example.com'
        })
    }

    const handleNavigate = () => {
        navigate('DetailPage', { id: 123 })
    }

    const handleBack = () => {
        pop()
    }

    return <View>...</View>
}

// 迁移后
import { router, navigator } from '@mtfe/empower-atom-interface'

function MyComponent() {
    const handleGoToDetail = () => {
        router.jumpToPage({
            url: 'mrn://app/detail',
            params: { id: 123 }
        })
    }

    const handleGoToWeb = () => {
        router.jumpToWebPage({
            url: 'https://example.com'
        })
    }

    const handleNavigate = () => {
        navigator.navigate('DetailPage', { id: 123 })
    }

    const handleBack = () => {
        navigator.pop()
    }

    return <View>...</View>
}
```

## 关键点

- **router 命名空间**：页面跳转相关函数通过 `router` 命名空间导入
- **navigator 命名空间**：导航相关函数通过 `navigator` 命名空间导入
- **KNB 迁移**：`KNB.openPage` 迁移到 `router.openPage`

## 迁移检查清单

- [ ] 将所有路由相关函数改为 `router.xxx()` 调用方式
- [ ] 将所有导航相关函数改为 `navigator.xxx()` 调用方式
- [ ] 更新 `KNB.openPage` 为 `router.openPage`
- [ ] 验证页面跳转功能是否正常
- [ ] 验证导航功能是否正常
- [ ] 验证回调函数是否正常触发

## 注意事项

1. **参数一致性**：确保函数参数与原版本一致
2. **回调处理**：`jumpToPageWithCallback` 的回调参数需要保持一致
3. **Navigator 引用**：使用 `navigator.getTopNavigator()` 获取 Navigator 引用时，确保已正确设置顶层 Navigator
