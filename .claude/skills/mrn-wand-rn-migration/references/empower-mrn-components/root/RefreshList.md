# RefreshList 刷新列表

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export enum RefreshStatus {
    Idle,
    Loading,
    HeaderRefreshing,
    FooterLoading,
    NoMoreData,
    Failure,
    EmptyData
}

export interface RefreshListProps<Item> extends FlatListProps<Item> {
    refreshStatus: RefreshStatus  // 刷新状态（必填）
    refreshable?: boolean  // 是否可下拉刷新，默认 true
    refreshableColors?: string[]  // 下拉刷新指示器颜色
    refreshableProgressBackgroundColor?: string  // 下拉刷新背景颜色
    refreshableSize?: number  // 下拉刷新指示器大小
    refreshableTitle?: string  // 下拉刷新标题
    refreshableTintColor?: string  // 下拉刷新色调颜色

    firstLoader?: boolean  // 初始化时是否自动加载，默认 false
    onHeaderRefresh?: Function  // 下拉刷新回调
    onFooterLoad?: Function  // 上拉加载回调

    loadingText?: string  // 加载中的提示文案，默认 '正在加载'
    footerLoadingText?: string  // 底部加载中文案，默认 '正在加载更多'
    footerFailureText?: string  // 底部加载失败文案，默认 '加载失败，点击重试'
    footerNoMoreDataText?: string  // 底部无更多数据文案，默认 '已加载全部数据'
    footerEmptyDataText?: string  // 底部空数据文案，默认 '暂时没有数据'

    refreshControl?: any  // 自定义 RefreshControl
    loadingComponent?: any  // 自定义初始加载中组件
    footerLoadingComponent?: any  // 自定义底部加载中组件
    footerFailureComponent?: ReactElement  // 自定义底部加载失败组件
    footerNoMoreDataComponent?: any  // 自定义底部无更多数据组件
    footerEmptyDataComponent?: any  // 自定义底部空数据组件

    spinnerSize?: number | 'small' | 'large'  // 加载指示器大小，默认 'small'
    spinnerColor?: string  // 加载指示器颜色，默认 'gray'
}
```

## 新组件 API

> ⚠️ **重要**：新版 `List` 组件必须与 `useList` hook 配套使用。`List` 组件本身不管理任何请求状态，所有状态（`reloading`、`loadingMore`、`noMore`、`loadingMoreError`）及回调（`reload`、`loadMore`）均由 `useList` 提供。

### List Props

```tsx
export interface Props<Item> extends FlatListProps<Item> {
    loadingMore: boolean  // 是否正在加载更多数据（必填，由 useList 提供）
    loadingMoreError?: boolean  // 加载更多数据是否出错，默认 false（由 useList 提供）
    reloading: boolean  // 是否正在刷新（必填，由 useList 提供）
    noMore: boolean  // 是否没有更多数据（必填，由 useList 提供）
    onHeaderLoad?: () => void  // 下拉刷新事件，不传将不展示下拉刷新（使用 useList 返回的 reload）
    onFooterLoad?: () => void  // 上拉加载事件，不传将不展示上拉加载（使用 useList 返回的 loadMore）

    footerLoadingText?: string  // 上拉加载时展示文案，默认 '正在加载更多'
    noMoreDataText?: string  // 无更多数据时展示文案，默认 '已加载全部数据'
    emptyDataText?: string  // 空数据时展示文案，默认 '暂时没有数据'
    errorDataText?: string  // 加载失败时展示文案，默认 '加载失败，点击重试'

    refreshControl?: ReactElement  // 自定义 RefreshControl
    ListHeaderComponent?: ReactElement  // 列表头部组件

    spinnerSize?: number | 'small' | 'large'  // 加载指示器大小，默认 'small'
    spinnerColor?: string  // 加载指示器颜色，默认 'gray'
    onEndReachedThreshold?: number  // 到底部的阈值，默认 0.01
}
```

### useList

`useList` 是与 `List` 组件配套的 hook，负责管理分页请求、数据聚合和所有状态。

#### Service 类型

```tsx
// Pagination 类型
export interface Pagination {
    page: number        // 当前页
    pageSize?: number   // 每页条数
    total?: number      // 总条数
    totalPage?: number  // 总页数
}

// Service 函数签名：接收分页参数，返回包含 list 和 pagination 的数据
export type Service<TData extends Data> = (param: Pagination) => Promise<TData>

// TData 至少需要包含 list 数组和 pagination 字段
// type Data = { pagination: Pagination; list: any[]; [key: string]: any }
```

#### hook 参数（options）

```tsx
export interface ListOptions<TData extends Data> {
    isNoMore?: (data?: TData) => boolean         // 自定义判断是否到最后一页的逻辑。不传时根据 totalPage 自动计算
    defaultCurrent?: number                       // 初始页码，刷新时也取该页码，默认 1
    defaultPageSize?: number                      // 初始每页大小，根据该值和 total 计算总页数
    manual?: boolean                             // 是否手动触发。true 时初始化不自动请求，需手动调用 reload，默认 false
    reloadDeps?: DependencyList                  // 变化后自动触发 reload（类似 useEffect 的依赖数组）
    onBefore?: () => void                        // service 执行前回调
    onSuccess?: (data: TData) => void            // service resolve 时回调
    onError?: (e: Error) => void                 // service reject 时回调
    onFinally?: (data?: TData, e?: Error) => void // service 执行完成时回调（无论成功或失败）
    // 以下为高级选项（基于 ahooks/useRequest）
    loadingDelay?: number                        // loading 延迟时间（ms），防止闪烁
    pollingInterval?: number                     // 轮询间隔（ms），不传则不轮询
    debounceWait?: number                        // 防抖等待时间（ms）
    throttleWait?: number                        // 节流等待时间（ms）
    cacheKey?: string                            // 缓存 key，设置后会缓存请求结果
    retryCount?: number                          // 失败自动重试次数，-1 为无限次
}
```

#### hook 返回值

```tsx
const {
    data,             // TData | undefined — service 返回的聚合数据，其中 list 为所有页数据合并后的数组
    loading,          // boolean — 是否正在进行首次加载（非刷新、非加载更多时的 loading）
    reloading,        // boolean — 是否正在进行下拉刷新请求
    loadingMore,      // boolean — 是否正在进行上拉加载更多请求
    loadingMoreError, // boolean — 上拉加载更多是否出错
    noMore,           // boolean — 是否已加载全部数据（无更多）
    reload,           // (page?: number) => void — 刷新数据，默认从第一页开始；传入 page 可刷新指定页
    reloadAsync,      // (page?: number) => Promise — 同 reload，但返回 Promise，需自行处理异常
    loadMore,         // () => void — 加载下一页数据，noMore 时无效
    loadMoreAsync,    // () => Promise — 同 loadMore，但返回 Promise，需自行处理异常
    mutate,           // (data?: TData) => void — 直接修改 data（不触发请求）
    cancel,           // () => void — 取消当前请求
    run,              // 底层 useRequest 的 run 方法（一般不直接使用）
    runAsync,         // 底层 useRequest 的 runAsync 方法（一般不直接使用）
    error,            // Error | undefined — 最后一次请求的错误信息
} = useList(service, options)
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| refreshStatus | reloading / loadingMore / noMore / loadingMoreError | 状态拆分为多个布尔值属性，均由 useList 自动管理 |
| refreshable | onHeaderLoad | 需要下拉刷新时传入 onHeaderLoad（useList 的 reload），不传则不展示 |
| onFooterLoad | onFooterLoad | 传入 useList 的 loadMore 函数 |
| onHeaderRefresh | onHeaderLoad | 回调函数签名不同，新组件无参数 |
| firstLoader | manual | useList 的 manual 选项控制是否手动触发初始请求，默认 false（自动触发） |
| refreshableColors | - | 不支持自定义 RefreshControl 颜色，使用 refreshControl prop |
| refreshableProgressBackgroundColor | - | 不支持自定义背景颜色，使用 refreshControl prop |
| refreshableSize | spinnerSize | 加载指示器大小 |
| refreshableTitle | - | 不支持下拉刷新标题 |
| refreshableTintColor | - | 不支持自定义色调 |
| loadingText | - | 初始加载状态已移除，使用 FlatList 的 ListEmptyComponent 替代 |
| footerLoadingText | footerLoadingText | 上拉加载文案 |
| footerFailureText | errorDataText | 加载失败文案 |
| footerNoMoreDataText | noMoreDataText | 无更多数据文案 |
| footerEmptyDataText | emptyDataText | 空数据文案 |
| loadingComponent | - | 不支持自定义初始加载组件 |
| footerLoadingComponent | - | 自动渲染，不支持自定义 |
| footerFailureComponent | - | 自动渲染，不支持自定义 |
| footerNoMoreDataComponent | - | 自动渲染，不支持自定义 |
| footerEmptyDataComponent | - | 自动渲染，不支持自定义 |
| spinnerSize | spinnerSize | 加载指示器大小 |
| spinnerColor | spinnerColor | 加载指示器颜色 |

## 迁移示例

### 案例 1：基础使用（使用 useList）

```tsx
// 迁移前
import { RefreshList, RefreshStatus } from '@mtfe/empower-mrn-components'

class MyList extends PureComponent {
    state = {
        data: [],
        refreshStatus: RefreshStatus.Idle
    }

    handleHeaderRefresh = (status: RefreshStatus) => {
        this.setState({ refreshStatus: status })
        // 调用数据接口
        this.loadData()
    }

    handleFooterLoad = (status: RefreshStatus) => {
        this.setState({ refreshStatus: status })
        // 加载更多
        this.loadMoreData()
    }

    render() {
        return (
            <RefreshList
                data={this.state.data}
                refreshStatus={this.state.refreshStatus}
                renderItem={({ item }) => <Text>{item.title}</Text>}
                onHeaderRefresh={this.handleHeaderRefresh}
                onFooterLoad={this.handleFooterLoad}
            />
        )
    }
}

// 迁移后：List 必须与 useList 配套使用
import { List, useList } from '@sfe/wand-rn'

const MyList = () => {
    // useList 自动管理所有状态和分页逻辑
    const { data, reloading, loadingMore, noMore, loadingMoreError, reload, loadMore } = useList(
        async (pagination) => {
            const response = await fetchData(pagination)
            return {
                list: response.items,
                pagination: { ...pagination, total: response.total }
            }
        },
        { defaultCurrent: 1, defaultPageSize: 20 }
    )

    if (!data) return null

    return (
        <List
            data={data.list}
            reloading={reloading}
            loadingMore={loadingMore}
            noMore={noMore}
            loadingMoreError={loadingMoreError}
            renderItem={({ item }) => <Text>{item.title}</Text>}
            onHeaderLoad={reload}
            onFooterLoad={loadMore}
        />
    )
}
```

### 案例 2：分页加载

```tsx
// 迁移前 - 手动处理多个状态
import { RefreshList, RefreshStatus } from '@mtfe/empower-mrn-components'

const MyList = () => {
    const [status, setStatus] = useState(RefreshStatus.Idle)
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)

    const handleHeaderRefresh = () => {
        setStatus(RefreshStatus.HeaderRefreshing)
        setPage(1)
        fetchData(1).then((response) => {
            setData(response.items)
            setStatus(RefreshStatus.Idle)
        }).catch(() => {
            setStatus(RefreshStatus.Failure)
        })
    }

    const handleFooterLoad = () => {
        if (status === RefreshStatus.Idle) {
            setStatus(RefreshStatus.FooterLoading)
            fetchData(page + 1).then((response) => {
                setData([...data, ...response.items])
                setPage(page + 1)
                if (response.items.length === 0) {
                    setStatus(RefreshStatus.NoMoreData)
                } else {
                    setStatus(RefreshStatus.Idle)
                }
            }).catch(() => {
                setStatus(RefreshStatus.Failure)
            })
        }
    }

    return (
        <RefreshList
            data={data}
            refreshStatus={status}
            renderItem={({ item }) => <Text>{item.name}</Text>}
            onHeaderRefresh={handleHeaderRefresh}
            onFooterLoad={handleFooterLoad}
            footerLoadingText="加载中..."
            footerNoMoreDataText="没有更多了"
        />
    )
}

// 迁移后：使用 useList hook，自动管理分页和所有状态
import { List, useList } from '@sfe/wand-rn'

const MyList = () => {
    const { data, reloading, loadingMore, noMore, loadingMoreError, reload, loadMore } = useList(
        (pagination) => fetchData(pagination),
        {
            defaultCurrent: 1,
            defaultPageSize: 20,
            // 自定义判断是否已到最后一页
            isNoMore: (data) => data?.list.length === 0
        }
    )

    if (!data) return null

    return (
        <List
            data={data.list}
            reloading={reloading}
            loadingMore={loadingMore}
            noMore={noMore}
            loadingMoreError={loadingMoreError}
            renderItem={({ item }) => <Text>{item.name}</Text>}
            onHeaderLoad={reload}
            onFooterLoad={loadMore}
            footerLoadingText="加载中..."
            noMoreDataText="没有更多了"
        />
    )
}
```

### 案例 3：自定义文案

```tsx
// 迁移前
<RefreshList
    data={items}
    refreshStatus={status}
    renderItem={({ item }) => <Text>{item.title}</Text>}
    loadingText="数据加载中"
    footerLoadingText="更多内容加载中"
    footerFailureText="加载出错了，点击重试"
    footerNoMoreDataText="已到底部"
    footerEmptyDataText="列表为空"
    onHeaderRefresh={handleRefresh}
    onFooterLoad={handleLoadMore}
/>

// 迁移后
import { List, useList } from '@sfe/wand-rn'

const MyList = () => {
    const { data, reloading, loadingMore, noMore, loadingMoreError, reload, loadMore } = useList(
        (pagination) => fetchData(pagination),
        { defaultCurrent: 1, defaultPageSize: 20 }
    )

    if (!data) return null

    return (
        <List
            data={data.list}
            reloading={reloading}
            loadingMore={loadingMore}
            noMore={noMore}
            loadingMoreError={loadingMoreError}
            renderItem={({ item }) => <Text>{item.title}</Text>}
            footerLoadingText="更多内容加载中"
            errorDataText="加载出错了，点击重试"
            noMoreDataText="已到底部"
            emptyDataText="列表为空"
            onHeaderLoad={reload}
            onFooterLoad={loadMore}
        />
    )
}
```

### 案例 4：禁用下拉刷新或上拉加载

```tsx
// 迁移前 - 通过 refreshable 属性控制
<RefreshList
    data={items}
    refreshStatus={status}
    refreshable={false}  // 禁用下拉刷新
    renderItem={({ item }) => <Text>{item.title}</Text>}
    onFooterLoad={handleLoadMore}
/>

// 迁移后：不传对应的回调函数即可
import { List, useList } from '@sfe/wand-rn'

const MyList = () => {
    const { data, reloading, loadingMore, noMore, loadingMoreError, loadMore } = useList(
        (pagination) => fetchData(pagination),
        { defaultCurrent: 1, defaultPageSize: 20 }
    )

    if (!data) return null

    return (
        <List
            data={data.list}
            reloading={reloading}
            loadingMore={loadingMore}
            noMore={noMore}
            loadingMoreError={loadingMoreError}
            renderItem={({ item }) => <Text>{item.title}</Text>}
            // 不传 onHeaderLoad，下拉刷新自动禁用
            onFooterLoad={loadMore}
        />
    )
}
```

### 案例 5：自定义列表头部

```tsx
// 迁移前 - 通过 ListHeaderComponent 属性（在 FlatListProps 中）
<RefreshList
    data={items}
    refreshStatus={status}
    ListHeaderComponent={<View><Text>这是列表头部</Text></View>}
    renderItem={({ item }) => <Text>{item.title}</Text>}
    onHeaderRefresh={handleRefresh}
/>

// 迁移后 - 直接使用 ListHeaderComponent
import { List, useList } from '@sfe/wand-rn'

const MyList = () => {
    const { data, reloading, loadingMore, noMore, loadingMoreError, reload, loadMore } = useList(
        (pagination) => fetchData(pagination),
        { defaultCurrent: 1, defaultPageSize: 20 }
    )

    if (!data) return null

    return (
        <List
            data={data.list}
            reloading={reloading}
            loadingMore={loadingMore}
            noMore={noMore}
            loadingMoreError={loadingMoreError}
            ListHeaderComponent={<View><Text>这是列表头部</Text></View>}
            renderItem={({ item }) => <Text>{item.title}</Text>}
            onHeaderLoad={reload}
            onFooterLoad={loadMore}
        />
    )
}
```

### 案例 6：手动触发初始加载（替代 firstLoader）

```tsx
// 迁移前 - firstLoader 控制初始化是否自动加载
<RefreshList
    data={data}
    refreshStatus={status}
    firstLoader={false}  // 不自动加载
    renderItem={({ item }) => <Text>{item.title}</Text>}
    onHeaderRefresh={handleRefresh}
/>

// 迁移后：使用 manual 选项，通过 reload 手动触发
import { List, useList } from '@sfe/wand-rn'

const MyList = () => {
    const { data, reloading, loadingMore, noMore, loadingMoreError, reload, loadMore } = useList(
        (pagination) => fetchData(pagination),
        {
            defaultCurrent: 1,
            defaultPageSize: 20,
            manual: true,  // 不自动触发，需要手动调用 reload
            onSuccess: (data) => console.log('加载成功', data),
            onError: (error) => console.error('加载失败', error),
        }
    )

    return (
        <>
            <Button onPress={() => reload()}>手动加载</Button>
            <List
                data={data?.list || []}
                reloading={reloading}
                loadingMore={loadingMore}
                noMore={noMore}
                loadingMoreError={loadingMoreError}
                renderItem={({ item }) => <Text>{item.title}</Text>}
                onHeaderLoad={reload}
                onFooterLoad={loadMore}
            />
        </>
    )
}
```

### 案例 7：依赖变化自动刷新（reloadDeps）

```tsx
// 迁移前 - 手动监听依赖变化并刷新
const MyList = () => {
    const [keyword, setKeyword] = useState('')
    const [status, setStatus] = useState(RefreshStatus.Idle)
    const [data, setData] = useState([])

    useEffect(() => {
        setStatus(RefreshStatus.HeaderRefreshing)
        fetchData({ keyword }).then((res) => {
            setData(res.items)
            setStatus(RefreshStatus.Idle)
        })
    }, [keyword])

    return (
        <RefreshList
            data={data}
            refreshStatus={status}
            renderItem={({ item }) => <Text>{item.title}</Text>}
        />
    )
}

// 迁移后：使用 reloadDeps，依赖变化自动触发 reload
import { List, useList } from '@sfe/wand-rn'

const MyList = () => {
    const [keyword, setKeyword] = useState('')

    const { data, reloading, loadingMore, noMore, loadingMoreError, reload, loadMore } = useList(
        (pagination) => fetchData({ ...pagination, keyword }),
        {
            defaultCurrent: 1,
            defaultPageSize: 20,
            reloadDeps: [keyword],  // keyword 变化时自动从第一页重新加载
        }
    )

    if (!data) return null

    return (
        <List
            data={data.list}
            reloading={reloading}
            loadingMore={loadingMore}
            noMore={noMore}
            loadingMoreError={loadingMoreError}
            renderItem={({ item }) => <Text>{item.title}</Text>}
            onHeaderLoad={reload}
            onFooterLoad={loadMore}
        />
    )
}
```

### 案例 8：使用 useList 的完整示例

```tsx
import { List, useList } from '@sfe/wand-rn'

const ProductList = () => {
    const {
        data,
        loading,          // 首次加载状态（非刷新、非加载更多）
        reloading,
        loadingMore,
        noMore,
        loadingMoreError,
        reload,
        loadMore,
        mutate,           // 直接修改 data，不触发请求
        error,
    } = useList(
        async (pagination) => {
            const response = await api.getProducts({
                page: pagination.page,
                pageSize: pagination.pageSize
            })
            return {
                list: response.data.items,
                pagination: {
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    total: response.data.total  // 用于自动计算 noMore
                }
            }
        },
        {
            defaultCurrent: 1,
            defaultPageSize: 20,
            onBefore: () => console.log('请求前'),
            onSuccess: (data) => console.log('请求成功', data),
            onError: (error) => console.error('请求失败', error)
        }
    )

    if (loading) return <Text>初始加载中...</Text>

    return (
        <List
            data={data?.list || []}
            reloading={reloading}
            loadingMore={loadingMore}
            noMore={noMore}
            loadingMoreError={loadingMoreError}
            renderItem={({ item }) => (
                <View style={{ padding: 10 }}>
                    <Text>{item.name}</Text>
                    <Text>{item.price}</Text>
                </View>
            )}
            onHeaderLoad={reload}
            onFooterLoad={loadMore}
        />
    )
}
```

## 关键点

### List 必须与 useList 配套使用

- **新组件的核心设计**：`List` 组件本身不包含任何请求和状态管理逻辑，所有状态均需通过 `useList` 管理后传入
- **不推荐手动管理状态**：直接用多个 `useState` 手动管理 `reloading`、`loadingMore` 等状态极易出现状态不一致问题
- **标准用法**：`useList` 返回的 `reloading`、`loadingMore`、`noMore`、`loadingMoreError` 直接传入 `List`；`reload` 传给 `onHeaderLoad`，`loadMore` 传给 `onFooterLoad`

```tsx
// ✅ 正确用法
const { data, reloading, loadingMore, noMore, loadingMoreError, reload, loadMore } = useList(service, options)
return (
    <List
        data={data?.list || []}
        reloading={reloading}
        loadingMore={loadingMore}
        noMore={noMore}
        loadingMoreError={loadingMoreError}
        onHeaderLoad={reload}
        onFooterLoad={loadMore}
        renderItem={renderItem}
    />
)
```

### 状态管理变化

- **旧组件**：使用单一的 `RefreshStatus` 枚举表示列表状态（Idle、Loading、HeaderRefreshing、FooterLoading、NoMoreData、Failure、EmptyData）
- **新组件**：使用多个布尔值属性（reloading、loadingMore、noMore、loadingMoreError）由 `useList` 自动管理

| RefreshStatus | 对应 useList 状态 |
|---|---|
| Idle | reloading=false, loadingMore=false |
| Loading（首次） | loading=true（仅 useList 返回值，不传给 List） |
| HeaderRefreshing | reloading=true |
| FooterLoading | loadingMore=true |
| NoMoreData | noMore=true |
| Failure | loadingMoreError=true |
| EmptyData | data.list.length === 0 |

### useList 的 noMore 自动计算

- 如果 service 返回的数据中 `pagination.totalPage` 或 `pagination.total`（配合 `defaultPageSize`）有值，`useList` 会自动计算 `noMore`
- 也可以通过 `isNoMore` 函数自定义判断逻辑

```tsx
// 方式一：service 返回 total，useList 自动计算 noMore
useList(async (pagination) => {
    const res = await fetchData(pagination)
    return {
        list: res.items,
        pagination: { ...pagination, total: res.total }  // total + defaultPageSize 自动计算
    }
}, { defaultCurrent: 1, defaultPageSize: 20 })

// 方式二：自定义 isNoMore
useList(fetchData, {
    defaultCurrent: 1,
    defaultPageSize: 20,
    isNoMore: (data) => data?.list.length < 20  // 返回数量少于一页则认为没有更多
})
```

### 不支持的功能

- 自定义初始加载中组件（loadingComponent）
- 自定义底部各状态组件（footerLoadingComponent、footerFailureComponent 等）
- 自定义下拉刷新控件的样式（refreshableColors、refreshableSize 等）

### 需要手动实现的功能

- 自定义下拉刷新样式：通过 refreshControl prop 传入自定义的 RefreshControl
- 自定义样式：所有样式通过继承的 FlatListProps 属性设置

## 迁移策略

### 第一步：替换组件和基本属性

1. 将 `RefreshList` 替换为 `List`，引入 `useList`
2. 将数据请求逻辑迁移到 `useList` 的 service 函数中
3. 将 `RefreshStatus` 枚举替换为 `useList` 返回的布尔值

### 第二步：更新回调函数

1. 将 `onHeaderRefresh` 替换为 `onHeaderLoad`，传入 `useList` 的 `reload`
2. 将 `onFooterLoad` 传入 `useList` 的 `loadMore`
3. 移除 `refreshable` 属性，通过是否传入 `onHeaderLoad` 来控制

### 第三步：处理 service 返回值格式

确保 service 返回值包含 `list` 和 `pagination` 字段：

```tsx
const { data, ...rest } = useList(
    async (pagination) => {
        const res = await api.getList(pagination)
        return {
            list: res.data.items,        // 必须是 list 字段
            pagination: {
                page: pagination.page,
                pageSize: pagination.pageSize,
                total: res.data.total    // 用于自动计算 noMore（或通过 isNoMore 自定义）
            }
        }
    },
    { defaultCurrent: 1, defaultPageSize: 20 }
)
```

### 第四步：验证和调整

- 验证下拉刷新功能正常
- 验证上拉加载功能正常
- 验证加载失败重试功能正常
- 验证空数据和无更多数据提示正常

## 常见迁移问题

### Q: 为什么 List 必须和 useList 配套使用？

A: `List` 组件不内置任何请求逻辑，`reloading`、`loadingMore`、`noMore`、`loadingMoreError` 这些状态需要外部传入且必须保持一致。`useList` 是官方提供的配套 hook，能确保这些状态的正确联动，避免手动管理时出现状态不一致（如 `loadingMore` 还是 `true` 但数据已更新）等问题。

### Q: useList 的 service 函数格式是什么？

A: service 接收 `Pagination` 参数，必须返回包含 `list` 数组和 `pagination` 对象的 Promise：

```tsx
const service = async (pagination: { page: number; pageSize?: number }) => {
    const res = await fetchData(pagination)
    return {
        list: res.items,           // 必填：当前页数据
        pagination: {
            page: pagination.page,
            pageSize: pagination.pageSize,
            total: res.total,      // 用于计算总页数
        }
    }
}
```

### Q: useList hook 中的 isNoMore 是什么作用？

A: `isNoMore` 是一个函数，用来自定义判断是否已到最后一页。不传时，`useList` 会根据 `pagination.total` 和 `defaultPageSize` 自动计算：

```tsx
const { data, noMore } = useList(
    (pagination) => fetchData(pagination),
    {
        defaultCurrent: 1,
        defaultPageSize: 20,
        isNoMore: (data) => {
            // 返回 true 表示没有更多数据
            return data?.list.length < 20
        }
    }
)
```

### Q: 如何实现初始化手动加载（替代 firstLoader）？

A: 使用 `manual: true` 选项，初始化时不自动请求，需要手动调用 `reload`：

```tsx
const { reload, ...rest } = useList(
    (pagination) => fetchData(pagination),
    { defaultCurrent: 1, defaultPageSize: 20, manual: true }
)

// 手动触发加载
useEffect(() => {
    reload()
}, [someCondition])
```

### Q: 如何自定义下拉刷新的外观？

A: 通过 refreshControl prop 传入自定义的 RefreshControl：

```tsx
import { RefreshControl } from '@mrn/react-native'

const MyList = () => {
    const { data, reloading, loadingMore, noMore, loadingMoreError, reload, loadMore } = useList(
        (pagination) => fetchData(pagination),
        { defaultCurrent: 1, defaultPageSize: 20 }
    )

    return (
        <List
            data={data?.list || []}
            reloading={reloading}
            loadingMore={loadingMore}
            noMore={noMore}
            loadingMoreError={loadingMoreError}
            refreshControl={
                <RefreshControl
                    refreshing={reloading}
                    onRefresh={reload}
                    colors={['#FF0000']}
                    tintColor="#FF0000"
                />
            }
            renderItem={({ item }) => <Text>{item.name}</Text>}
            onFooterLoad={loadMore}
        />
    )
}
```

### Q: 如何刷新指定页数据？

A: `useList` 的 `reload` 方法支持传入页码参数：

```tsx
const { reload } = useList(service, options)

// 刷新第一页（默认）
reload()

// 刷新指定页（如刷新第 2 页后的数据，保留第 1 页）
reload(2)
```

### Q: 如何在请求成功后更新局部数据？

A: 使用 `mutate` 方法直接修改 data，不触发请求：

```tsx
const { data, mutate } = useList(service, options)

// 直接修改某条数据
const updateItem = (id: string, newData: Item) => {
    mutate({
        ...data,
        list: data?.list.map(item => item.id === id ? newData : item)
    })
}
```

### Q: 如何禁用下拉刷新？

A: 不传 onHeaderLoad 即可：

```tsx
const { data, reloading, loadingMore, noMore, loadingMoreError, loadMore } = useList(
    (pagination) => fetchData(pagination),
    { defaultCurrent: 1, defaultPageSize: 20 }
)

return (
    <List
        data={data?.list || []}
        reloading={reloading}
        loadingMore={loadingMore}
        noMore={noMore}
        loadingMoreError={loadingMoreError}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        // 不传 onHeaderLoad，下拉刷新自动禁用
        onFooterLoad={loadMore}
    />
)
```

## 注意事项

1. **List 必须与 useList 配套使用**：`List` 组件不管理任何请求状态，`reloading`、`loadingMore`、`noMore`、`loadingMoreError` 均由 `useList` 自动维护

2. **service 返回值格式**：必须包含 `list` 数组和 `pagination` 对象，`useList` 依赖此格式进行数据聚合和分页计算

3. **data 初始值为 undefined**：`useList` 在首次请求完成前 `data` 为 `undefined`，渲染时需要判断 `if (!data) return null` 或使用 `data?.list || []`

4. **数据聚合**：`useList` 会自动将多页数据聚合到 `data.list` 中，无需手动维护完整数据列表；调用 `reload()` 会重置为第一页数据

5. **错误处理**：`loadingMoreError` 只表示加载更多出错，下拉刷新的错误通过 `onError` 回调处理；`error` 返回值为最后一次请求的错误对象

6. **RefreshControl 兼容性**：如果使用 refreshControl prop，需要确保传入的是 React Native 的 RefreshControl 组件，并手动将 `reloading` 和 `reload` 传给它

7. **自定义组件限制**：底部各状态（加载中、加载失败等）的显示组件已固定，如需自定义建议使用 FlatList 的 `ListFooterComponent` 替代（此时建议不传 `onFooterLoad` 以禁用内置底部组件）

## 迁移检查清单

- [ ] 移除 RefreshStatus 枚举的导入
- [ ] 引入 `useList`，将数据请求迁移到 `useList` 的 service 函数
- [ ] 确认 service 返回值包含 `list` 和 `pagination` 字段
- [ ] 将 `RefreshList` 替换为 `List`
- [ ] 将 `useList` 返回的布尔值状态传给 `List`
- [ ] 将 `reload` 传给 `onHeaderLoad`，`loadMore` 传给 `onFooterLoad`
- [ ] 移除 `refreshable` 属性（不传 `onHeaderLoad` 即可禁用）
- [ ] 处理 `data` 初始值为 `undefined` 的情况
- [ ] 验证下拉刷新功能
- [ ] 验证上拉加载功能
- [ ] 验证加载失败重试
- [ ] 验证空数据和无更多数据提示
- [ ] 测试首屏加载、刷新、分页等场景
- [ ] 确认文案翻译正确
