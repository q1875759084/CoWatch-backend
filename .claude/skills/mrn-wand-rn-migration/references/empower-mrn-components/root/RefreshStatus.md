# RefreshStatus 列表刷新状态枚举

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`（通过 `List` + `useList` 替代）

## 说明

`RefreshStatus` 是配合 `RefreshList` 组件使用的枚举，用于描述列表的刷新/加载状态。
迁移到 `@sfe/wand-rn` 后，`List` 组件改用多个布尔值 props 代替单一枚举，由 `useList` hook 自动管理这些状态，**不再需要手动维护 `RefreshStatus` 枚举**。

## 枚举值对照

| RefreshStatus | 对应 useList 状态 | 说明 |
|---|---|---|
| `Idle` | `reloading=false, loadingMore=false` | 空闲状态 |
| `Loading` | `loading=true`（useList 返回值，不传给 List） | 首次加载中 |
| `HeaderRefreshing` | `reloading=true` | 下拉刷新中 |
| `FooterLoading` | `loadingMore=true` | 上拉加载中 |
| `NoMoreData` | `noMore=true` | 无更多数据 |
| `Failure` | `loadingMoreError=true` | 加载失败 |
| `EmptyData` | `data.list.length === 0` | 空数据 |

## 迁移示例

```tsx
// 迁移前 - 手动维护 RefreshStatus 枚举
import { RefreshStatus } from '@mtfe/empower-mrn-components'

const [status, setStatus] = useState(RefreshStatus.Idle)

const handleHeaderRefresh = () => {
    setStatus(RefreshStatus.HeaderRefreshing)
    fetchData().then(res => {
        setStatus(res.length === 0 ? RefreshStatus.EmptyData : RefreshStatus.Idle)
    }).catch(() => {
        setStatus(RefreshStatus.Failure)
    })
}

// 在其他地方判断状态
const reloading = status === RefreshStatus.HeaderRefreshing
const loadingMore = status === RefreshStatus.FooterLoading
const noMore = status === RefreshStatus.NoMoreData


// 迁移后 - 移除 RefreshStatus，使用 useList 自动管理状态
import { List, useList } from '@sfe/wand-rn'

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
        onHeaderLoad={reload}
        onFooterLoad={loadMore}
        renderItem={renderItem}
    />
)
```

## 仅作为类型/状态机使用时的迁移

如果 `RefreshStatus` 仅用于状态机（不直接关联 `RefreshList` 渲染），迁移时需要：

1. 移除 `RefreshStatus` 枚举导入
2. 将枚举值替换为对应的布尔值逻辑（参见上方枚举值对照表）
3. 将状态管理迁移到 `useList`，或改用本地 `boolean` state

```tsx
// 迁移前 - 使用枚举传递状态
import { RefreshStatus } from '@mtfe/empower-mrn-components'

function getRefreshStatus(pageStatus: PageStatus, list: any[], hasMore: boolean): RefreshStatus {
    switch (pageStatus) {
        case PageStatus.HEAD_LOADING:
            return list.length > 0 ? RefreshStatus.HeaderRefreshing : RefreshStatus.Idle
        case PageStatus.FOOT_LOADING:
            return RefreshStatus.FooterLoading
        default:
            return hasMore ? RefreshStatus.Idle : RefreshStatus.NoMoreData
    }
}

// 迁移后 - 改为直接返回 boolean 状态
function getListState(pageStatus: PageStatus, hasMore: boolean) {
    return {
        reloading: pageStatus === PageStatus.HEAD_LOADING,
        loadingMore: pageStatus === PageStatus.FOOT_LOADING,
        noMore: !hasMore && pageStatus !== PageStatus.HEAD_LOADING && pageStatus !== PageStatus.FOOT_LOADING,
        loadingMoreError: pageStatus === PageStatus.ERROR,
    }
}
```

## 迁移检查清单

- [ ] 移除 `RefreshStatus` 枚举的导入
- [ ] 将 `RefreshStatus.HeaderRefreshing` 替换为 `reloading=true`（由 `useList` 管理）
- [ ] 将 `RefreshStatus.FooterLoading` 替换为 `loadingMore=true`（由 `useList` 管理）
- [ ] 将 `RefreshStatus.NoMoreData` 替换为 `noMore=true`（由 `useList` 管理）
- [ ] 将 `RefreshStatus.Failure` 替换为 `loadingMoreError=true`（由 `useList` 管理）
- [ ] 将 `RefreshStatus.EmptyData` 替换为 `data?.list.length === 0` 判断
- [ ] 同步迁移 `RefreshList` → `List`（参考 `RefreshList.md`）
- [ ] 验证列表各状态显示正常

> 详细的 `List` + `useList` 迁移说明请参考 [`RefreshList.md`](RefreshList.md)
