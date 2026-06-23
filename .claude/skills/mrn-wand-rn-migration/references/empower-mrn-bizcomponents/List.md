# List 业务列表容器

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-bizcomponents`
- **目标库**: `@sfe/wand-rn`

## 迁移结论

**部分对应。** 源组件 List 是整合了 RefreshList + 空态/错误态/Loading 指示器的业务列表容器，深度耦合 `@mtfe/empower-react-base` 状态管理。wand-rn 的 `List` + `useList` 覆盖了列表渲染和分页状态管理，但空态/错误态/加载态需要手动实现。

## 旧组件 API

### List 组件

```tsx
import { List } from '@mtfe/empower-mrn-bizcomponents'

type ListProps<ITEM> = {
    renderItem: ListRenderItem<ITEM>  // 列表项渲染函数（必填）
    filter?: (item: ITEM) => boolean  // 数据过滤函数（可选）
}

// 用法 - 必须在 ListPage 内部使用
<ListPage pageKey="orders" fetch={fetchOrders}>
    <List renderItem={({ item }) => <OrderCard order={item} />} />
</ListPage>
```

### 内部子组件

List 组件内部由三个子组件组成：

```tsx
// PlaceHolder - 空态/错误态
export function PlaceHolder()
// - 数据为空 + Idle/NoMoreData 状态时：
//   - 有 error → ErrorPlaceHolder（带重试按钮，调用 reloadListPage）
//   - 无 error → EmptyPlaceHolder

// ListContent - 列表内容（RefreshList）
export function ListContent<DATA extends object>(props: ListProps<DATA>)
// - 数据非空时渲染 RefreshList
// - 自动处理下拉刷新、上拉加载
// - key 提取：优先 item.id，回退 index

// ListIndicator - 加载指示器
export function ListInidcator()
// - 数据为空 + HeaderRefreshing 或 Loading 状态时显示 TopIndicator
```

### 状态依赖

List 从 `@mtfe/empower-react-base` 的 Context 中获取状态：
- `useListItemState(filter?)` — 获取列表数据（支持过滤）
- `useRefreshListStatus()` — 获取刷新状态（RefreshStatus 枚举）
- `useListError()` — 获取错误信息
- `usePageKey()` — 获取页面 key
- `useListFetch()` — 获取数据加载函数

### 依赖

- `@mrn/react-native` — StyleSheet、View、ListRenderItem
- `@mtfe/empower-mrn-components` — RefreshList、RefreshStatus、EmptyPlaceHolder、ErrorPlaceHolder
- `@mtfe/empower-mrn-components/shuguopai` — TopIndicator、colors
- `@mtfe/empower-react-base` — useListItemState、useListError、useRefreshListStatus、usePageKey、RefreshType

## 新组件 API

> 详细 API 请参考 [RefreshList.md](../empower-mrn-components/root/RefreshList.md) 中的 wand-rn List + useList 文档。

### List Props（wand-rn）

```tsx
import { List, useList } from '@sfe/wand-rn'

interface Props<Item> extends FlatListProps<Item> {
    loadingMore: boolean          // 是否正在加载更多（必填，由 useList 提供）
    loadingMoreError?: boolean    // 加载更多出错（由 useList 提供）
    reloading: boolean            // 是否正在刷新（必填，由 useList 提供）
    noMore: boolean               // 是否没有更多数据（必填，由 useList 提供）
    onHeaderLoad?: () => void     // 下拉刷新回调（传 useList 的 reload）
    onFooterLoad?: () => void     // 上拉加载回调（传 useList 的 loadMore）
    footerLoadingText?: string    // 默认 '正在加载更多'
    noMoreDataText?: string       // 默认 '已加载全部数据'
    emptyDataText?: string        // 默认 '暂时没有数据'
    errorDataText?: string        // 默认 '加载失败，点击重试'
    spinnerSize?: number | 'small' | 'large'
    spinnerColor?: string
}
```

## 迁移对照表

| 旧能力 | 新实现 | 说明 |
|--------|--------|------|
| `renderItem` | `renderItem` | 直接对应，签名相同 |
| `filter` prop | 在 data 传入前手动过滤 | `data={data?.list.filter(filterFn) \|\| []}` |
| PlaceHolder（空态） | List 的 `emptyDataText` 或手动渲染 | wand-rn List 内置空态文案 |
| PlaceHolder（错误态 + 重试） | 手动条件渲染 | 需自行实现错误态 UI 和重试按钮 |
| ListIndicator（TopIndicator） | useList 的 `loading` 状态 | 首次加载时自行渲染 Loading |
| RefreshList（下拉刷新） | List 的 `onHeaderLoad` + `reloading` | 传入 useList 的 reload |
| RefreshList（上拉加载） | List 的 `onFooterLoad` + `loadingMore` | 传入 useList 的 loadMore |
| useListItemState | useList 的 `data.list` | 数据源切换 |
| useRefreshListStatus | useList 的布尔值状态 | RefreshStatus 枚举 → 多个布尔值 |
| useListError | useList 的 `error` | 错误信息 |
| reloadListPage | useList 的 `reload()` | 触发列表重新加载 |
| RefreshStatus 枚举 | 多个布尔值 | 见下方状态映射表 |

### 状态映射

| 旧 RefreshStatus | 新 useList 状态 |
|---|---|
| Idle | reloading=false, loadingMore=false |
| Loading | loading=true（首次） |
| HeaderRefreshing | reloading=true |
| FooterLoading | loadingMore=true |
| NoMoreData | noMore=true |
| Failure | loadingMoreError=true 或 error 有值 |
| EmptyData | data.list.length === 0 |

## 迁移示例

### 案例 1：基础列表（ListPage + List → useList + List）

```tsx
// 迁移前 - 必须套在 ListPage 内
import { ListPage, List } from '@mtfe/empower-mrn-bizcomponents'

const OrderListPage = () => (
    <ListPage
        pageKey="orderList"
        fetch={async (pagination) => {
            const res = await api.getOrders(pagination)
            return { items: res.data, pagination: res.pagination }
        }}
    >
        <List renderItem={({ item }) => <OrderCard order={item} />} />
    </ListPage>
)

// 迁移后 - 独立使用 useList + List
import { List, useList } from '@sfe/wand-rn'

const OrderListPage = () => {
    const { data, loading, reloading, loadingMore, noMore, loadingMoreError, reload, loadMore, error } = useList(
        async (pagination) => {
            const res = await api.getOrders({
                page: pagination.page,
                pageSize: pagination.pageSize
            })
            return {
                list: res.data,
                pagination: {
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    total: res.pagination.total
                }
            }
        },
        { defaultCurrent: 1, defaultPageSize: 20 }
    )

    // 首次加载中（替代 ListIndicator/TopIndicator）
    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} />
    }

    // 错误态 + 重试（替代 PlaceHolder/ErrorPlaceHolder）
    if (error && !data?.list?.length) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{error.message}</Text>
                <Button onPress={() => reload()}>点击重试</Button>
            </View>
        )
    }

    return (
        <List
            data={data?.list || []}
            reloading={reloading}
            loadingMore={loadingMore}
            noMore={noMore}
            loadingMoreError={loadingMoreError}
            renderItem={({ item }) => <OrderCard order={item} />}
            onHeaderLoad={reload}
            onFooterLoad={loadMore}
        />
    )
}
```

### 案例 2：带过滤的列表

```tsx
// 迁移前
<List
    renderItem={({ item }) => <OrderCard order={item} />}
    filter={(item) => item.status === 'active'}
/>

// 迁移后 - 在 data 传入前过滤
import { List, useList } from '@sfe/wand-rn'
import { useMemo } from 'react'

const OrderListPage = () => {
    const { data, reloading, loadingMore, noMore, loadingMoreError, reload, loadMore } = useList(
        (pagination) => fetchOrders(pagination),
        { defaultCurrent: 1, defaultPageSize: 20 }
    )

    const filteredList = useMemo(
        () => (data?.list || []).filter(item => item.status === 'active'),
        [data]
    )

    return (
        <List
            data={filteredList}
            reloading={reloading}
            loadingMore={loadingMore}
            noMore={noMore}
            loadingMoreError={loadingMoreError}
            renderItem={({ item }) => <OrderCard order={item} />}
            onHeaderLoad={reload}
            onFooterLoad={loadMore}
        />
    )
}
```

### 案例 3：外部触发刷新（替代 reloadListPage）

```tsx
// 迁移前
import { reloadListPage } from '@mtfe/empower-mrn-bizcomponents'

// 在其他组件中触发列表刷新
const handleSubmit = () => {
    await api.createOrder(formData)
    reloadListPage('orderList', { force: true, refreshType: RefreshType.Reload })
}

// 迁移后 - 通过回调或 Context 传递 reload
import { List, useList } from '@sfe/wand-rn'
import { createContext, useContext } from 'react'

// 创建 reload context
const ReloadContext = createContext<(() => void) | null>(null)
const useReload = () => useContext(ReloadContext)

const OrderListPage = () => {
    const { data, reloading, loadingMore, noMore, loadingMoreError, reload, loadMore } = useList(
        (pagination) => fetchOrders(pagination),
        { defaultCurrent: 1, defaultPageSize: 20 }
    )

    return (
        <ReloadContext.Provider value={reload}>
            <CreateOrderButton />
            <List
                data={data?.list || []}
                reloading={reloading}
                loadingMore={loadingMore}
                noMore={noMore}
                loadingMoreError={loadingMoreError}
                renderItem={({ item }) => <OrderCard order={item} />}
                onHeaderLoad={reload}
                onFooterLoad={loadMore}
            />
        </ReloadContext.Provider>
    )
}

// 在其他组件中触发刷新
const CreateOrderButton = () => {
    const reload = useReload()
    const handleSubmit = async () => {
        await api.createOrder(formData)
        reload?.()
    }
    return <Button onPress={handleSubmit}>创建订单</Button>
}
```

## 迁移策略

### 第一步：替换状态管理

1. 移除 `ListPage` 包裹，使用 `useList` hook 替代
2. 将 `fetch` 函数适配为 `useList` 的 service 格式
3. 移除 `@mtfe/empower-react-base` 的 hooks（useListItemState、useRefreshListStatus 等）

### 第二步：替换 List 组件

1. 将 `@mtfe/empower-mrn-bizcomponents` 的 `List` 替换为 `@sfe/wand-rn` 的 `List`
2. 传入 `useList` 返回的所有状态和回调
3. 如有 `filter` prop，改为在 data 传入前过滤

### 第三步：实现 UI 状态

1. 实现首次加载态（替代 ListIndicator/TopIndicator）
2. 实现错误态 + 重试（替代 PlaceHolder/ErrorPlaceHolder）
3. 空态由 wand-rn List 的 `emptyDataText` 内置处理

### 第四步：处理外部刷新

1. 将 `reloadListPage` 替换为 `useList` 的 `reload()`
2. 如需跨组件触发刷新，通过 Context 或 props 传递 `reload` 引用

## 迁移检查清单

- [ ] 移除 ListPage 组件包裹
- [ ] 将 fetch 适配为 useList service 格式（返回 { list, pagination }）
- [ ] 替换 @mtfe/empower-mrn-bizcomponents 的 List 为 @sfe/wand-rn 的 List
- [ ] 传入 useList 的状态（reloading, loadingMore, noMore, loadingMoreError）
- [ ] 传入 useList 的回调（reload → onHeaderLoad, loadMore → onFooterLoad）
- [ ] 实现首次加载态 UI
- [ ] 实现错误态 + 重试按钮
- [ ] 处理 filter 逻辑（迁移到数据层）
- [ ] 替换 reloadListPage 为 reload()
- [ ] 移除 @mtfe/empower-react-base 和 rxjs 相关导入
- [ ] 验证下拉刷新
- [ ] 验证上拉加载
- [ ] 验证错误重试
- [ ] 验证空态展示
- [ ] 验证数据过滤
