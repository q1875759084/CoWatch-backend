# List 列表

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

### List Component Props

```tsx
export interface Props<Item> extends FlatListProps<Item> {
    // 状态属性
    loadingMore: boolean
    loadingMoreError?: boolean
    reloading: boolean
    noMore: boolean
    
    // 事件回调
    onHeaderLoad?: () => void
    onFooterLoad?: (status?: RefreshStatus) => void
    
    // 文本提示
    footerLoadingText?: string  // 默认 '正在加载更多'
    noMoreDataText?: string  // 默认 '已加载全部数据'
    emptyDataText?: string  // 默认 '暂时没有数据'
    errorDataText?: string  // 默认 '加载失败，点击重试'
    
    // 自定义组件
    refreshControl?: ReactElement
    ListHeaderComponent?: ReactElement
    
    // 加载器样式
    spinnerSize?: number | 'small' | 'large'
    spinnerColor?: string
    
    // Ref 和阈值
    ref?: Ref<FlatList<unknown>>
    onEndReachedThreshold?: number
}
```

### useList Hook Options

```tsx
export interface ListOptions<TData extends Data> {
    isNoMore?: (data?: TData) => boolean
    
    defaultCurrent?: number  // 默认 1
    defaultPageSize?: number
    manual?: boolean  // 默认 false
    reloadDeps?: DependencyList
    
    onBefore?: () => void
    onSuccess?: (data: TData) => void
    onError?: (e: Error) => void
    onFinally?: (data?: TData, e?: Error) => void
    
    getList?: (data?: TData) => []
    getNextPage?: (data?: TData) => void
    
    // ahooks 相关配置
    refreshDepsAction?: () => void
    loadingDelay?: number
    pollingInterval?: number
    pollingWhenHidden?: boolean
    pollingErrorRetryCount?: number
    refreshOnWindowFocus?: boolean
    focusTimespan?: number
    debounceWait?: number
    debounceLeading?: boolean
    debounceTrailing?: boolean
    debounceMaxWait?: number
    throttleWait?: number
    throttleLeading?: boolean
    throttleTrailing?: boolean
    cacheKey?: string
    cacheTime?: number
    staleTime?: number
    setCache?: () => void
    getCache?: () => any
    retryCount?: number
    retryInterval?: number
    ready?: boolean
}
```

### Pagination

```tsx
export interface Pagination {
    page: number
    pageSize?: number
    total?: number
    totalPage?: number
}
```

## 新组件 API

### List Component Props

```tsx
export interface Props<Item> extends FlatListProps<Item> {
    // 状态属性
    loadingMore: boolean
    loadingMoreError?: boolean
    reloading: boolean
    noMore: boolean
    
    // 事件回调
    onHeaderLoad?: () => void
    onFooterLoad?: () => void
    
    // 文本提示
    footerLoadingText?: string  // 默认 '正在加载更多'
    noMoreDataText?: string  // 默认 '已加载全部数据'
    emptyDataText?: string  // 默认 '暂时没有数据'
    errorDataText?: string  // 默认 '加载失败，点击重试'
    
    // 自定义组件
    refreshControl?: ReactElement
    ListHeaderComponent?: ReactElement
    
    // 加载器样式
    spinnerSize?: number | 'small' | 'large'
    spinnerColor?: string
    
    // Ref 和阈值
    ref?: Ref<FlatList<unknown>>
    onEndReachedThreshold?: number
}
```

### useList Hook Options

```tsx
export interface ListOptions<TData extends Data> {
    isNoMore?: (data?: TData) => boolean
    
    defaultCurrent?: number  // 默认 1
    defaultPageSize?: number
    manual?: boolean  // 默认 false
    reloadDeps?: DependencyList
    
    onBefore?: () => void
    onSuccess?: (data: TData) => void
    onError?: (e: Error) => void
    onFinally?: (data?: TData, e?: Error) => void
    
    getList?: (data?: TData) => TData[]
    getNextPage?: (data?: TData) => void
    
    // ahooks 相关配置
    refreshDepsAction?: () => void
    loadingDelay?: number
    pollingInterval?: number
    pollingWhenHidden?: boolean
    pollingErrorRetryCount?: number
    refreshOnWindowFocus?: boolean
    focusTimespan?: number
    debounceWait?: number
    debounceLeading?: boolean
    debounceTrailing?: boolean
    debounceMaxWait?: number
    throttleWait?: number
    throttleLeading?: boolean
    throttleTrailing?: boolean
    cacheKey?: string
    cacheTime?: number
    staleTime?: number
    setCache?: () => void
    getCache?: () => any
    retryCount?: number
    retryInterval?: number
    ready?: boolean
}
```

### Pagination

```tsx
export interface Pagination {
    page: number
    pageSize?: number
    total?: number
    totalPage?: number
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| Props 属性 | Props 属性 | 所有 Props 属性保持一致 |
| onFooterLoad | onFooterLoad | 移除了 RefreshStatus 参数 |
| useList Options | useList Options | 所有配置项保持一致 |
| lodash | lodash-es | 内部实现改为使用 lodash-es |
| 依赖库 | 依赖库 | 使用 @mrn/react-native 保持一致 |

## 关键变更

### 1. onFooterLoad 回调参数变更
- **旧版本**：`onFooterLoad?: (status?: RefreshStatus) => void`
- **新版本**：`onFooterLoad?: () => void`
- 参数 `status` 已移除，回调中无需处理 RefreshStatus 参数

### 2. getList 返回类型更严格
- **旧版本**：`getList?: (data?: TData) => []`（总是返回空数组）
- **新版本**：`getList?: (data?: TData) => TData[]`（返回正确类型的数组）

### 3. 内部实现优化
- 从 `lodash` 改为 `lodash-es`（更好的 tree-shaking）
- 其他功能和表现保持完全一致

### 4. Props 继承
- 两个版本都继承 FlatListProps<Item>
- 所有 FlatList 原生属性都支持

## 迁移示例

### 案例 1：基础列表使用

```tsx
// 迁移前
import { List, useList } from '@sgfe/flower-rn'

const App = () => {
  const { data, loading, reloading, loadingMore, noMore, loadMore, reload } = useList(
    async (pagination) => {
      const res = await fetchList(pagination)
      return res
    },
    {
      defaultCurrent: 1,
      defaultPageSize: 10,
    }
  )

  return (
    <List
      data={data?.list}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      reloading={reloading}
      loadingMore={loadingMore}
      noMore={noMore}
      onHeaderLoad={reload}
      onFooterLoad={loadMore}
    />
  )
}

// 迁移后 - 代码完全相同
import { List, useList } from '@sfe/wand-rn'

const App = () => {
  const { data, loading, reloading, loadingMore, noMore, loadMore, reload } = useList(
    async (pagination) => {
      const res = await fetchList(pagination)
      return res
    },
    {
      defaultCurrent: 1,
      defaultPageSize: 10,
    }
  )

  return (
    <List
      data={data?.list}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      reloading={reloading}
      loadingMore={loadingMore}
      noMore={noMore}
      onHeaderLoad={reload}
      onFooterLoad={loadMore}
    />
  )
}
```

### 案例 2：使用自定义文案

```tsx
// 迁移前
import { List } from '@sgfe/flower-rn'

<List
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  reloading={reloading}
  loadingMore={loadingMore}
  noMore={noMore}
  onHeaderLoad={handleReload}
  onFooterLoad={handleLoadMore}
  footerLoadingText="加载中..."
  noMoreDataText="没有更多数据了"
  emptyDataText="暂无数据"
/>

// 迁移后
import { List } from '@sfe/wand-rn'

<List
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  reloading={reloading}
  loadingMore={loadingMore}
  noMore={noMore}
  onHeaderLoad={handleReload}
  onFooterLoad={handleLoadMore}
  footerLoadingText="加载中..."
  noMoreDataText="没有更多数据了"
  emptyDataText="暂无数据"
/>
```

### 案例 3：带列表头部的列表

```tsx
// 迁移前
import { List } from '@sgfe/flower-rn'
import { View, Text } from '@mrn/react-native'

<List
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  ListHeaderComponent={
    <View style={{ padding: 16 }}>
      <Text>列表头部</Text>
    </View>
  }
  reloading={reloading}
  loadingMore={loadingMore}
  noMore={noMore}
  onHeaderLoad={handleReload}
  onFooterLoad={handleLoadMore}
/>

// 迁移后
import { List } from '@sfe/wand-rn'
import { View, Text } from '@mrn/react-native'

<List
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  ListHeaderComponent={
    <View style={{ padding: 16 }}>
      <Text>列表头部</Text>
    </View>
  }
  reloading={reloading}
  loadingMore={loadingMore}
  noMore={noMore}
  onHeaderLoad={handleReload}
  onFooterLoad={handleLoadMore}
/>
```

### 案例 4：自定义加载器样式

```tsx
// 迁移前
import { List } from '@sgfe/flower-rn'

<List
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  reloading={reloading}
  loadingMore={loadingMore}
  noMore={noMore}
  onHeaderLoad={handleReload}
  onFooterLoad={handleLoadMore}
  spinnerSize="large"
  spinnerColor="#FF0000"
/>

// 迁移后
import { List } from '@sfe/wand-rn'

<List
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  reloading={reloading}
  loadingMore={loadingMore}
  noMore={noMore}
  onHeaderLoad={handleReload}
  onFooterLoad={handleLoadMore}
  spinnerSize="large"
  spinnerColor="#FF0000"
/>
```

### 案例 5：自定义滚动阈值

```tsx
// 迁移前
import { List } from '@sgfe/flower-rn'

<List
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  reloading={reloading}
  loadingMore={loadingMore}
  noMore={noMore}
  onHeaderLoad={handleReload}
  onFooterLoad={handleLoadMore}
  onEndReachedThreshold={0.1}  // 距离底部 10% 时触发
/>

// 迁移后
import { List } from '@sfe/wand-rn'

<List
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  reloading={reloading}
  loadingMore={loadingMore}
  noMore={noMore}
  onHeaderLoad={handleReload}
  onFooterLoad={handleLoadMore}
  onEndReachedThreshold={0.1}
/>
```

### 案例 6：使用 useList 手动模式

```tsx
// 迁移前
import { useList } from '@sgfe/flower-rn'

const { data, reload, loadMore } = useList(
  fetchData,
  {
    defaultCurrent: 1,
    defaultPageSize: 20,
    manual: true,  // 手动模式，不自动加载
  }
)

// 需要时手动调用
useEffect(() => {
  reload()
}, [])

// 迁移后
import { useList } from '@sfe/wand-rn'

const { data, reload, loadMore } = useList(
  fetchData,
  {
    defaultCurrent: 1,
    defaultPageSize: 20,
    manual: true,
  }
)

useEffect(() => {
  reload()
}, [])
```

### 案例 7：监听依赖变化自动重新加载

```tsx
// 迁移前
import { useList } from '@sgfe/flower-rn'
import { useState } from 'react'

const [filter, setFilter] = useState('all')

const { data, reloading } = useList(
  async (pagination) => {
    const res = await fetchList({ ...pagination, filter })
    return res
  },
  {
    defaultCurrent: 1,
    defaultPageSize: 10,
    reloadDeps: [filter],  // filter 变化时自动重新加载
  }
)

// 迁移后
import { useList } from '@sfe/wand-rn'
import { useState } from 'react'

const [filter, setFilter] = useState('all')

const { data, reloading } = useList(
  async (pagination) => {
    const res = await fetchList({ ...pagination, filter })
    return res
  },
  {
    defaultCurrent: 1,
    defaultPageSize: 10,
    reloadDeps: [filter],
  }
)
```

### 案例 8：处理加载事件

```tsx
// 迁移前
import { useList } from '@sgfe/flower-rn'

const { data } = useList(
  fetchData,
  {
    defaultCurrent: 1,
    defaultPageSize: 10,
    onBefore: () => {
      console.log('请求开始')
    },
    onSuccess: (data) => {
      console.log('请求成功', data)
    },
    onError: (error) => {
      console.log('请求失败', error)
    },
    onFinally: (data, error) => {
      console.log('请求完成')
    },
  }
)

// 迁移后
import { useList } from '@sfe/wand-rn'

const { data } = useList(
  fetchData,
  {
    defaultCurrent: 1,
    defaultPageSize: 10,
    onBefore: () => {
      console.log('请求开始')
    },
    onSuccess: (data) => {
      console.log('请求成功', data)
    },
    onError: (error) => {
      console.log('请求失败', error)
    },
    onFinally: (data, error) => {
      console.log('请求完成')
    },
  }
)
```

### 案例 9：自定义"无更多数据"判断

```tsx
// 迁移前
import { useList } from '@sgfe/flower-rn'

const { data } = useList(
  fetchData,
  {
    defaultCurrent: 1,
    defaultPageSize: 10,
    isNoMore: (data) => {
      // 自定义判断逻辑
      return data?.list?.length === 0 || data?.pagination?.page >= data?.pagination?.totalPage
    },
  }
)

// 迁移后
import { useList } from '@sfe/wand-rn'

const { data } = useList(
  fetchData,
  {
    defaultCurrent: 1,
    defaultPageSize: 10,
    isNoMore: (data) => {
      return data?.list?.length === 0 || data?.pagination?.page >= data?.pagination?.totalPage
    },
  }
)
```

### 案例 10：完整实际场景

```tsx
// 迁移前
import { useList, List } from '@sgfe/flower-rn'
import { View, Text, FlatList } from '@mrn/react-native'
import { useState } from 'react'

const ProductList = () => {
  const [category, setCategory] = useState('all')
  
  const { 
    data, 
    reloading, 
    loadingMore, 
    noMore, 
    reload, 
    loadMore,
    loadingMoreError 
  } = useList(
    async (pagination) => {
      const response = await fetch(`/api/products?category=${category}&page=${pagination.page}&pageSize=${pagination.pageSize}`)
      const result = await response.json()
      return {
        list: result.items,
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: result.total,
        }
      }
    },
    {
      defaultCurrent: 1,
      defaultPageSize: 20,
      reloadDeps: [category],
      onError: (error) => {
        console.error('加载失败:', error)
      }
    }
  )

  return (
    <View>
      <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
        <Text 
          onPress={() => setCategory('all')}
          style={{ marginRight: 10, fontWeight: category === 'all' ? 'bold' : 'normal' }}
        >
          全部
        </Text>
        <Text 
          onPress={() => setCategory('new')}
          style={{ fontWeight: category === 'new' ? 'bold' : 'normal' }}
        >
          新品
        </Text>
      </View>
      
      <List
        data={data?.list}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
            <Text>{item.name}</Text>
            <Text style={{ color: '#999', marginTop: 5 }}>${item.price}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        reloading={reloading}
        loadingMore={loadingMore}
        loadingMoreError={loadingMoreError}
        noMore={noMore}
        onHeaderLoad={reload}
        onFooterLoad={loadMore}
        footerLoadingText="加载中..."
        noMoreDataText="没有更多商品了"
        emptyDataText="暂无商品"
        ListHeaderComponent={<Text style={{ padding: 10 }}>产品列表</Text>}
      />
    </View>
  )
}

// 迁移后 - 代码完全相同
import { useList, List } from '@sfe/wand-rn'
import { View, Text, FlatList } from '@mrn/react-native'
import { useState } from 'react'

const ProductList = () => {
  const [category, setCategory] = useState('all')
  
  const { 
    data, 
    reloading, 
    loadingMore, 
    noMore, 
    reload, 
    loadMore,
    loadingMoreError 
  } = useList(
    async (pagination) => {
      const response = await fetch(`/api/products?category=${category}&page=${pagination.page}&pageSize=${pagination.pageSize}`)
      const result = await response.json()
      return {
        list: result.items,
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: result.total,
        }
      }
    },
    {
      defaultCurrent: 1,
      defaultPageSize: 20,
      reloadDeps: [category],
      onError: (error) => {
        console.error('加载失败:', error)
      }
    }
  )

  return (
    <View>
      <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
        <Text 
          onPress={() => setCategory('all')}
          style={{ marginRight: 10, fontWeight: category === 'all' ? 'bold' : 'normal' }}
        >
          全部
        </Text>
        <Text 
          onPress={() => setCategory('new')}
          style={{ fontWeight: category === 'new' ? 'bold' : 'normal' }}
        >
          新品
        </Text>
      </View>
      
      <List
        data={data?.list}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
            <Text>{item.name}</Text>
            <Text style={{ color: '#999', marginTop: 5 }}>${item.price}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        reloading={reloading}
        loadingMore={loadingMore}
        loadingMoreError={loadingMoreError}
        noMore={noMore}
        onHeaderLoad={reload}
        onFooterLoad={loadMore}
        footerLoadingText="加载中..."
        noMoreDataText="没有更多商品了"
        emptyDataText="暂无商品"
        ListHeaderComponent={<Text style={{ padding: 10 }}>产品列表</Text>}
      />
    </View>
  )
}
```

## 关键点

### 1. onFooterLoad 参数移除（重要）
- 旧版本可能有 `RefreshStatus` 参数
- 新版本完全移除该参数
- 回调签名：`() => void`

### 2. 接近 100% 兼容
- List 组件的 Props 保持完全一致
- useList Hook 的配置选项完全相同
- 数据结构和返回值完全相同
- 仅是内部依赖库版本更新

### 3. 迁移非常简单
- 只需将 import 路径从 `@sgfe/flower-rn` 改为 `@sfe/wand-rn`
- 代码逻辑不需要任何修改
- 完全向后兼容

### 4. FlatList 属性支持
- 两个版本都完全支持 FlatList 的所有原生属性
- 可以传递 FlatList 相关的 Props，如 `keyExtractor`、`scrollEventThrottle` 等

### 5. Pagination 数据结构
- 两个版本的 Pagination 接口完全相同
- 包含：`page`、`pageSize`、`total`、`totalPage`

## 迁移检查清单

- [ ] 将所有 `import { List, useList } from '@sgfe/flower-rn'` 改为 `import { List, useList } from '@sfe/wand-rn'`
- [ ] 检查是否有使用 `onFooterLoad` 的回调中获取参数，需要移除（如果有的话）
- [ ] 验证列表的基本功能是否正常（下拉刷新、上拉加载）
- [ ] 测试不同的加载状态显示（加载中、加载失败、无更多数据、空数据）
- [ ] 检查自定义文案是否显示正确
- [ ] 验证 ListHeaderComponent 是否正常显示
- [ ] 测试滚动阈值配置是否生效
- [ ] 检查列表项的 keyExtractor 配置是否正确
- [ ] 测试分页数据是否正确聚合
- [ ] 验证错误重试功能是否正常工作

## 注意事项

1. **完全兼容**：
   - 这个迁移是最简单的，因为两个组件功能几乎完全相同
   - 主要改动只是内部使用 lodash-es 代替 lodash

2. **参数检查**：
   - 注意 onFooterLoad 不再有 status 参数
   - 如果代码中有使用该参数，需要移除

3. **导入语句**：
   - 确保更新所有的 import 语句
   - 包括 List 组件和 useList Hook

4. **测试覆盖**：
   - 重点测试列表的分页功能
   - 测试各种加载状态
   - 验证错误处理是否正常

5. **保持一致**：
   - 两个库的列表实现思路完全一致
   - 迁移过程中无需改变业务逻辑

## 常见问题

### Q: 迁移后列表功能变化了吗？
A: 不会。功能完全相同，行为保持一致。只是库的改变，不影响功能。

### Q: onFooterLoad 参数被移除了，这会不会导致错误？
A: 如果代码中没有使用 onFooterLoad 的参数（这是常见情况），则不会有任何问题。如果有使用，需要移除参数即可。

### Q: 分页数据结构变了吗？
A: 完全相同。Pagination 接口的字段和含义都保持一致。

### Q: 是否可以同时使用两个库的 List 组件？
A: 不建议。建议统一迁移到 @sfe/wand-rn。

### Q: 如何处理迁移过程中的兼容性问题？
A: 使用配接器模式，在过渡期同时支持两个库，然后逐步迁移。
