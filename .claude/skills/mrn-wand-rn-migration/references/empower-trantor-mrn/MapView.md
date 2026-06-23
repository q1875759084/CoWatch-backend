# MapView 地图

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sfe/wand-rn`

## 概述

MapView 是对 `@mrn/mrnmap` 中 `MRNMapView` 组件的封装，提供地图展示功能。两个库的实现非常相似，主要差异在于版本检测机制和常量配置方式。

## 旧组件 API

```tsx
import { MapView } from '@mtfe/empower-trantor-mrn'
import { MapViewProps } from '@mrn/mrnmap/map/MRNMapView'

type Props = MapViewProps & {
    ref?: Ref<MRNMapView>
    children?: React.ReactNode
}

// 内部常量
const QNH_MAP_KEY = 'maa2864e43f2434c8fe4412a1b6fa48m'
const QNH_MAP_BIZ = 'sgemp'

// 版本检测逻辑
// Android >= 3.0.6
// iOS >= 3.0.4
```

## 新组件 API

```tsx
import { MapView } from '@sfe/wand-rn'
import type { MapViewProps } from '@mrn/mrnmap/map/MRNMapView'

export type FlowerMapViewProps = MapViewProps & {
    ref?: Ref<MRNMapView>
    children?: React.ReactNode
}

// 常量来自 @sfe/wand-rn/common/constant
const SHU_GUO_PAI_MAP_KEY = 'maa2864e43f2434c8fe4412a1b6fa48m'
const SHU_GUO_PAI_BUSINESS_TAG = 'sgemp'

// 使用 wandRn.canIUse('MapView') 进行能力检测
```

## 核心差异

| 差异点 | 旧实现 | 新实现 |
|--------|--------|--------|
| 版本检测 | 手动检查 `env.version` 和 `env.appID` | 使用 `wandRn.canIUse('MapView')` |
| 常量定义 | 组件内部定义 | 统一从 `common/constant` 导入 |
| Props 类型名 | `Props` | `FlowerMapViewProps` |
| 导入方式 | `import { MapViewProps }` | `import type { MapViewProps }` |

## 迁移步骤

### 步骤 1：更新导入语句

```tsx
// 迁移前
import { MapView } from '@mtfe/empower-trantor-mrn'
import { MapViewProps } from '@mrn/mrnmap/map/MRNMapView'

// 迁移后
import { MapView } from '@sfe/wand-rn'
import type { MapViewProps } from '@mrn/mrnmap/map/MRNMapView'
```

### 步骤 2：组件使用保持不变

```tsx
// 两者使用方式完全一致
import { MapProvider, MRNMapView } from '@mrn/mrnmap'

const mapRef = React.useRef<MRNMapView>()

<MapView
    ref={mapRef}
    style={styles.map}
    provider={MapProvider.Meituan}
    // ... 其他 MRNMapView 支持的属性
/>
```

### 步骤 3：版本检测迁移（如有自定义检测）

```tsx
// 迁移前
import { env } from '@mrn/mrn-utils'

const isShuguopai = env.appID === AppId.shuguopai
const isAvailableVersion = Platform.OS === 'android'
    ? versionUtils.greaterThanOrEqual(env.version, '3.0.6')
    : versionUtils.greaterThanOrEqual(env.version, '3.0.4')
const available = isShuguopai && isAvailableVersion

// 迁移后
import { wandRn } from '@sfe/wand-rn'

const available = wandRn.canIUse('MapView')
```

## 迁移示例

### 案例 1：基础地图展示

```tsx
// 迁移前
import React from 'react'
import { MapProvider, MRNMapView } from '@mrn/mrnmap'
import { StyleSheet, View } from '@mrn/react-native'
import { MapView } from '@mtfe/empower-trantor-mrn'

const styles = StyleSheet.create({
    map: {
        height: 300
    }
})

export const MapDemo = () => {
    const mapRef = React.useRef<MRNMapView>()
    
    return (
        <View>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={MapProvider.Meituan} />
        </View>
    )
}

// 迁移后
import React from 'react'
import { MapProvider, MRNMapView } from '@mrn/mrnmap'
import { StyleSheet, View } from '@mrn/react-native'
import { MapView } from '@sfe/wand-rn'

const styles = StyleSheet.create({
    map: {
        height: 300
    }
})

export const MapDemo = () => {
    const mapRef = React.useRef<MRNMapView>()
    
    return (
        <View>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={MapProvider.Meituan} />
        </View>
    )
}
```

### 案例 2：带版本检测的使用

```tsx
// 迁移前
import { env } from '@mrn/mrn-utils'
import { Platform } from '@mrn/react-native'

const checkMapAvailable = () => {
    const isShuguopai = env.appID === '272' // 数果派 AppID
    const minVersion = Platform.OS === 'android' ? '3.0.6' : '3.0.4'
    return isShuguopai && versionCompare(env.version, minVersion) >= 0
}

if (checkMapAvailable()) {
    // 渲染地图
}

// 迁移后
import { wandRn } from '@sfe/wand-rn'

if (wandRn.canIUse('MapView')) {
    // 渲染地图
}
```

### 案例 3：带 Ref 引用的使用

```tsx
// 迁移前
import { MRNMapView } from '@mrn/mrnmap'
import { MapView } from '@mtfe/empower-trantor-mrn'

const MyComponent = () => {
    const mapRef = React.useRef<MRNMapView>()
    
    const handleZoom = () => {
        // 调用地图实例方法
        mapRef.current?.setZoom(15)
    }
    
    return <MapView ref={mapRef} style={{ height: 300 }} />
}

// 迁移后
import { MRNMapView } from '@mrn/mrnmap'
import { MapView } from '@sfe/wand-rn'

const MyComponent = () => {
    const mapRef = React.useRef<MRNMapView>()
    
    const handleZoom = () => {
        // 调用地图实例方法
        mapRef.current?.setZoom(15)
    }
    
    return <MapView ref={mapRef} style={{ height: 300 }} />
}
```

## 关键点

1. **API 完全兼容**：MapView 组件的 Props 完全继承自 `@mrn/mrnmap/map/MRNMapView`，迁移前后 API 无变化
2. **版本检测升级**：新组件使用 `wandRn.canIUse('MapView')` 替代手动版本检测，更加简洁可靠
3. **仅需更换导入**：大多数情况下只需修改 import 语句即可完成迁移
4. **向下兼容处理**：两个组件都内置了版本不支持时的降级提示界面
5. **环境要求一致**：
   - Android >= 3.0.6
   - iOS >= 3.0.4
   - 仅支持牵牛花 App (AppID: 272/585)

## 注意事项

- MapView 依赖 `@mrn/mrnmap` 包，确保项目中已正确安装
- 地图功能仅在牵牛花 App 的 MRN 容器中可用
- 建议使用前先通过 `wandRn.canIUse('MapView')` 检测能力支持
- 所有地图相关的高级 API 请参考 [MRNMapView 官方文档](https://docs.sankuai.com/mt/map/qcs.mrn.map/master/mrnmap/map/)

## 相关链接

- [MRNMapView 官方文档](https://docs.sankuai.com/mt/map/qcs.mrn.map/master/mrnmap/map/)
- [@sfe/wand-rn MapView 组件文档](https://wand.sankuai.com/wand-rn/components/map-view)
