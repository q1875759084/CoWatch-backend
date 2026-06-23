---
name: atom-interface-migration
description: '支持从旧 MRN 库（@mtfe/empower-trantor-mrn、@mtfe/empower-mrn-components、@mtfe/empower-mrn-bizcomponents、@mrn/mrn-knb、@sgfe/flower-rn、@sgfe/operation-mrn）迁移工具函数和类型定义到 @mtfe/empower-atom-interface。包含自动检测、代码生成、API 映射指南和最佳实践。使用此 Skill 来: (1) 查询具体函数/类型的迁移规则和示例, (2) 自动化导入语句替换, (3) 处理类型定义的迁移, (4) 处理命名空间导入, (5) 查询技能支持哪些函数/类型的迁移'
---

# atom-interface-migration Skill

一个 MRN 工具函数和类型迁移工具，用于帮助团队从旧的 MRN 库迁移到统一的 `@mtfe/empower-atom-interface` 库。

## 查询支持迁移的函数/类型

当用户询问「这个技能支持哪些函数/类型的迁移？」时，按以下步骤获取列表：

1. 读取 [`references/`](references/) 目录下所有 `.md` 文件
2. 将结果按模块分组展示给用户

## 迁移对照总览

### 账号相关 (account)

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

### 路由相关 (router/navigator)

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

### 设备相关 (device)

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

### 保活相关 (keepalive)

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| isAppInnerLocationEnable | keepalive.isAppInnerLocationEnable | 命名空间导入 |
| requestIgnoreBatteryOptimizations | keepalive.requestIgnoreBatteryOptimizations | 命名空间导入 |
| hasIgnoreBatteryOptimizations | keepalive.isIgnoreBatteryOptimizations | 命名空间导入 |
| jumpToIgnoreBatteryOptimizations | keepalive.jumpToIgnoreBatteryOptimizations | 命名空间导入 |
| supportBatteryOptimizations | keepalive.supportBatteryOptimizations | 命名空间导入 |
| isTooShortActiveTime | keepalive.isTooShortActiveTime | 命名空间导入 |
| getDurationTimestamps | keepalive.getDurationTimestamps | 命名空间导入 |

### 定位相关 (location)

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

### 推送相关 (push/pushNotification)

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| KNBPushNotificationEventType | pushNotificationTypes.EventType | 命名空间导入 |
| PushDeliveryComponent | pushNotification.PushDeliveryComponent | 命名空间导入 |
| sharkPush | push.sharkPush | 命名空间导入 |
| registerDevice | push.registerDevice | 命名空间��入 |
| cancelDevice | push.cancelDevice | 命名空间导入 |
| PushProvider | pushNotification.PushProvider | 命名空间导入 |
| PushConsumer | pushNotification.PushConsumer | 命名空间导入 |

### 存储相关 (cache/storage)

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

### 日志/埋点相关 (codeLog/uat/utils)

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| reportMessage | codeLog.report.reportMessage | 命名空间导入 |
| uploadLogan | codeLog.logan.uploadLogan | 命名空间导入 |
| Type | codeLogTypes.Type | 命名空间导入 |
| Level | codeLogTypes.Level | 命名空间导入 |
| lxUtils | uat.lxUtils | 命名空间导入 |
| debugLog | utils.debugLog | 命名空间导入 |
| log | utils.log | 命名空间导入 |
| util | utils.util | 命名空间导入 |
| version | utils.version | 命名空间导入 |

### 环境/配置相关 (env/utils)

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| environment | env | 命名空间导入 |
| storeEnv | env.storeEnv | 命名空间导入 |
| getScheme | env.getScheme | 命名空间导入 |
| getSchemeDirect | env.getSchemeDirect | 命名空间导入 |
| isDebug | env.isDebug | 命名空间导入 |
| getNotificationChannel | env.getNotificationChannel | 命名空间导入 |
| EntityType | 类型定义 | 复制到本地 |
| SubAppAuthId | 类型定义 | 复制到本地 |
| IsAllStore | 类型定义 | 复制到本地 |
| versionUtils | utils.version | 命名空间导入 |

### Toast相关 (toast)

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| showToast | toast.showToast | 命名空间导入 |
| showErrorToast | toast.showErrorToast | 命名空间导入 |

### IM相关 (IM)

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| enableIM | IM.enableIM | 命名空间导入 |
| startLoginListen | IM.startLoginListen | 命名空间导入 |
| removeLoginListen | IM.removeLoginListen | 命名空间导入 |
| addLoginListener | IM.addLoginListener | 命名空间导入 |
| startChatListen | IM.startChatListen | 命名空间导入 |
| removeChatListen | IM.removeChatListen | 命名空间导入 |
| addChatListener | IM.addChatListener | 命名空间导入 |
| login | IM.login | 命名空间导入 |
| logoff | IM.logoff | 命名空间导入 |
| intoChatList | IM.intoChatList | 命名空间导入 |
| leaveChatList | IM.leaveChatList | 命名空间导入 |
| getChatMessageList | IM.getChatMessageList | 命名空间导入 |
| getTotalUnReadMessageCount | IM.getTotalUnReadMessageCount | 命名空间导入 |
| queryAccountInfo | IM.queryAccountInfo | 命名空间导入 |
| startChat | IM.startChat | 命名空间导入 |
| getCurrentDXUid | IM.getCurrentDXUid | 命名空间导入 |
| isDXLogin | IM.isDXLogin | 命名空间导入 |
| supportMultiDevices | IM.supportMultiDevices | 命名空间导入 |
| addSendCustomMessageListen | IM.addSendCustomMessageListen | 命名空间导入 |
| ensureConnect | IM.ensureConnect | 命名空间导入 |
| getImPubId | IM.getImPubId | 命名空间导入 |
| getImPubInfoList | IM.getImPubInfoList | 命名空间导入 |
| getImPubIdByStoreId | IM.getImPubIdByStoreId | 命名空间导入 |
| getPubIdsByIMChannelId | IM.getPubIdsByIMChannelId | 命名空间导入 |
| getPubIdsByStoreId | IM.getPubIdsByStoreId | 命名空间导入 |
| getPubIdByStoreIdAndIMChannelId | IM.getPubIdByStoreIdAndIMChannelId | 命名空间导入 |
| getStoreInfoByPubId | IM.getStoreInfoByPubId | 命名空间导入 |
| getCUserInfoByUidAndChannel | IM.getCUserInfoByUidAndChannel | 命名空间导入 |
| createChatPageConfig | IM.createChatPageConfig | 命名空间导入 |
| queryImPubId | IM.queryImPubId | 命名空间导入 |
| getIMAccountInfo | IM.getIMAccountInfo | 命名空间导入 |
| enableNewIMAccount | IM.enableNewIMAccount | 命名空间导入 |
| enableIMUserOptimization | IM.enableIMUserOptimization | 命名空间导入 |
| getIMBizConfig | IM.getIMBizConfig | 命名空间导入 |
| saveImChatPoiInfo | IM.saveImChatPoiInfo | 命名空间导入 |
| getImChatPoiInfo | IM.getImChatPoiInfo | 命名空间导入 |

### 页面曝光相关 (appear)

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| useAppear | appear.useAppear | 命名空间导入 |
| AppearParam | appearTypes.AppearParam | 命名空间导入 |
| appearHoc | appearHoc | 直接导入 |
| AppearConditionProvider | appear.AppearConditionProvider | 命名空间导入 |
| AppearConditionContext | appear.AppearConditionContext | 命名空间导入 |
| NavigationContextProvider | navigator.NavigationContextProvider | 命名空间导入 |
| useNavigation | appear.useNavigation | 命名空间导入 |
| useRootTag | appear.useRootTag | 命名空间导入 |
| AppearContext | appear.AppearContext | 命名空间导入 |
| AppearContextProvider | appear.AppearContextProvider | 命名空间导入 |
| AppearContextConsumer | appear.AppearContextConsumer | 命名空间导入 |
| RootTagContext | appear.RootTagContext | 命名空间导入 |
| RootTagContextProvider | appear.RootTagContextProvider | 命名空间导入 |
| RootTagContextConsumer | appear.RootTagContextConsumer | 命名空间导入 |
| AppearType | appearTypes.AppearType | 命名空间导入 |
| NavigationProp | appearTypes.NavigationProp | 命名空间导入 |
| usePv | uat.usePv | 命名空间导入 |
| mcHoc | mcHoc | 直接导入 |
| mvHoc | mvHoc | 直接导入 |
| pvHoc | pvHoc | 直接导入 |
| RootTagProvider | appear.RootTagContextProvider | 命名空间导入 |

### 广播相关 (broadcast)

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| register | broadcast.register | 命名空间导入 |
| publish | broadcast.publish | 命名空间导入 |
| Component | broadcast.Component | 命名空间导入 |
| BroadCast | broadcast.Component | 命名空间导入（注意：`BroadCast` 是 `@mtfe/empower-mrn-bizcomponents` 中的 JSX 组件名，对应 `broadcast.Component`） |

### 网络请求相关 (request)

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

### 其他模块

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| openAMap | map.openAMap | 命名空间导入 |
| calculateRouteInfo | mtNavigate.calculateRouteInfo | 命名空间导入 |
| startNavigateWithCustomRoute | mtNavigate.startNavigateWithCustomRoute | 命名空间导入 |
| startNavigateWithSDKRoute | mtNavigate.startNavigateWithSDKRoute | 命名空间导入 |
| scancode | barcode.scancode.scan | 命名空间导入 |

## 迁移方式说明

### 1. 命名空间导入

```tsx
// 迁移前
import { shopUser, getStoreInfo } from '@mtfe/empower-trantor-mrn'

// 迁移后
import { account } from '@mtfe/empower-atom-interface'

const user = account.shopUser()
const storeInfo = account.getStoreInfo()
```

### 2. 直接导入

```tsx
// 迁移前
import { cache } from '@mtfe/empower-trantor-mrn'

// 迁移后
import { cache } from '@mtfe/empower-atom-interface'
```

> **注意**：`mvHoc`、`pvHoc`、`mcHoc`、`appearHoc` 虽然在概念上属于 `uat`/`appear` 模块，但实际上从 `@mtfe/empower-atom-interface` **直接导入**，不需要命名空间前缀：
>
> ```tsx
> // 迁移前
> import { mvHoc } from '@mtfe/empower-trantor-mrn'
>
> // 迁移后（直接导入，不是 uat.mvHoc）
> import { mvHoc } from '@mtfe/empower-atom-interface'
> ```

### 3. 类型定义复制到本地

对于某些类型定义，需要复制到本地项目中：

```tsx
// 迁移前
import { UserInfo } from '@mtfe/empower-trantor-mrn'

// 迁移后 - 复制类型定义到本地
interface UserInfo {
    id: string
    name: string
    // ... 其他字段
}
```

## 迁移步骤

1. **扫描项目**：识别所有需要迁移的函数/类型
2. **分类处理**：根据迁移方式（命名空间导入、直接导入、复制到本地）分类
3. **修改导入**：更新 import 语句
4. **调整调用**：更新函数调用方式
5. **类型处理**：处理类型定义的迁移
6. **测试验证**：确保功能正常

## 不在迁移范围的 API（勿误操作）

以下 `@mtfe/empower-trantor-mrn` 中的 API **不在 atom-interface 迁移范围内**，`@mtfe/empower-atom-interface` 中没有对应实现，**不要尝试替换**：

| API | 原因 |
|-----|------|
| `createMonitorMiddleware` | Redux 中间件，自动拦截 action 上报耗时/成功/失败，底层调用 `reportMessage`，但职责完全不同，无法用手动 `codeLog.report.reportMessage` 替换 |
| `eventMonitor` | 与 `createMonitorMiddleware` 配套的全局监控实例，注册事件/设置 handler |
| `SagaHandler` | redux-saga 的 effect 监控 handler，配合 `eventMonitor` 追踪异步 action |
| `ModuleEvents` | 上述监控体系的配置类型，描述哪些 Redux action 需要被监控 |
| `LxProvider` | LX 埋点上下文 Provider，框架级组件 |
| `ModuleProvider` / `ChannelProvider` | 业务框架 Provider，非工具函数 |
| `getModules` | 业务框架 API |
| `Channel` | 业务框架类型 |
| `SpuMessage` | 业务数据类型，应保留在业务代码中 |

**判断准则**：扫描到 `@mtfe/empower-trantor-mrn` 的 import 时，先查上方迁移对照表，**表中没有的 symbol 一律不迁移**，不要猜测或推断对应关系。

## 重要约束

1. **只迁移函数和类型**：不迁移 React 组件
2. **鸿蒙适配**：某些功能在鸿蒙分支中需要直接删除
3. **业务实现**：某些业务相关的功能需要业务自行实现

## 常见陷阱（来自实战反思）

### 1. HOC 直接导入，不加命名空间前缀

`mvHoc`、`pvHoc`、`mcHoc`、`appearHoc` 虽然概念上属于 `uat`/`appear` 模块，但 `@mtfe/empower-atom-interface` 将它们作为**顶层导出**，必须直接解构导入：

```tsx
// ❌ 错误：不存在 uat.mvHoc 这种用法
import { uat } from '@mtfe/empower-atom-interface'
uat.mvHoc(...)

// ✅ 正确：直接导入
import { mvHoc } from '@mtfe/empower-atom-interface'
mvHoc(...)
```

### 2. `BroadCast` JSX 组件的迁移

`@mtfe/empower-mrn-bizcomponents` 中的 `BroadCast` JSX 组件（注意大写）对应 `broadcast.Component`，**不是** `broadcast.BroadCast`：

```tsx
// 迁移前
import { BroadCast } from '@mtfe/empower-mrn-bizcomponents'
<BroadCast action={KEY} onReceive={handler} />

// 迁移后
import { broadcast } from '@mtfe/empower-atom-interface'
<broadcast.Component action={KEY} onReceive={handler} />
```

### 3. 扫描时排除已迁移项

扫描旧库 import 时，需排除**已在 `@mtfe/empower-atom-interface` 中导入**的同名项，避免误报。同一文件可能同时从旧库和新库导入同名函数（如 `codeLog`），只有旧库中尚未迁移的才需处理。

### 4. 旧库 import 中混合了可迁移和不可迁移的 symbol

一个 `import` 语句中可能同时包含**可迁移**（如 `mvHoc`）和**暂不可迁移**（如 `useBatchStoreContext`、`MultiLocationType`）的 symbol。
迁移时不能因为"还有其他 symbol 无法迁移"就跳过整行，必须**逐个 symbol 判断**，将可迁移的单独提取出来：

```tsx
// ❌ 错误：因为 useBatchStoreContext 无法迁移，整行跳过，导致 mvHoc 漏迁移
import {
    mvHoc,
    useBatchStoreContext,
    MultiLocationType,
} from '@mtfe/empower-trantor-mrn';

// ✅ 正确：将 mvHoc 单独迁移，其余保留
import { mvHoc } from '@mtfe/empower-atom-interface';
import {
    useBatchStoreContext,
    MultiLocationType,
} from '@mtfe/empower-trantor-mrn';
```

**扫描验证**：迁移完成后，应对旧库的每个 import 语句做二次检查，确认其中没有遗留可迁移的 symbol。

## 版本支持

- atom-interface 版本：@mtfe/empower-atom-interface@4.0.0-alpha.6
- Node.js：12.0.0+
