# List 列表

## 从何处迁移
- **源库**: `@roo/roo-rn1`
- **目标库**: `@sfe/wand-rn`

> **重要说明**：两个库的 List 组件是**架构完全不同**的组件。roo-rn 的 List 是基于 View 的静态布局组件（类似 HTML 的 `<ul>/<li>`），而 wand-rn 的 List 是基于 FlatList 的分页列表组件（带下拉刷新、上拉加载更多）。迁移时需要根据实际使用场景选择合适的方案。

## 旧组件 API

```tsx
// List 主组件 — 静态 View 布局容器
export interface ListProps extends WithThemeStyles<ListStyles> {
  /** 自定义渲染列表头部 */
  renderHeader?: (() => JSX.Element) | string | JSX.Element
  /** 自定义渲染列表底部 */
  renderFooter?: (() => JSX.Element) | string | JSX.Element
  /** 自定义样式 */
  style?: StyleProp<ViewStyle>
}

// List.Item 子组件 — 列表行
export interface ListItemProps extends WithThemeStyles<ListStyles> {
  /** 子元素垂直对齐 */
  align?: 'top' | 'middle' | 'bottom'
  /** 是否禁用 */
  disabled?: boolean
  /** 是否多行 */
  multipleLine?: boolean
  /** 左侧缩略图 */
  thumb?: JSX.Element | string
  /** 右侧额外内容 */
  extra?: ReactNode
  /** 右侧箭头方向 */
  arrow?: 'horizontal' | 'down' | 'up'
  /** 是否换行 */
  wrap?: boolean
  /** 点击事件 */
  onPress?: (event: GestureResponderEvent) => void
  /** 按住回调 */
  onPressIn?: (event: GestureResponderEvent) => void
  /** 放开回调 */
  onPressOut?: (event: GestureResponderEvent) => void
  /** 长按延迟 */
  delayLongPress?: number
  /** 长按回调 */
  onLongPress?: (event: GestureResponderEvent) => void
  /** 自定义样式 */
  style?: StyleProp<ViewStyle>
}

// List.Item.Brief 子组件 — 描述文字
export interface BriefProps {
  /** 是否换行 */
  wrap?: boolean
  /** 自定义样式 */
  style?: StyleProp<TextStyle>
}
```

## 新组件 API

```tsx
// List 主组件 — FlatList 分页列表
export interface Props<Item> extends FlatListProps<Item> {
  /** 是否正在加载更多 */
  loadingMore: boolean
  /** 加载更多是否出错 */
  loadingMoreError?: boolean
  /** 是否正在刷新 */
  reloading: boolean
  /** 是否没有更多数据 */
  noMore: boolean
  /** 下拉刷新回调 */
  onHeaderLoad?: () => void
  /** 上拉加载回调 */
  onFooterLoad?: () => void
  /** 加载更多文案 */
  footerLoadingText?: string
  /** 没有更多数据文案 */
  noMoreDataText?: string
  /** 空数据文案 */
  emptyDataText?: string
  /** 加载失败文案 */
  errorDataText?: string
  /** 自定义刷新控件 */
  refreshControl?: ReactElement
  /** 头部组件 */
  ListHeaderComponent?: ReactElement
  /** 加载指示器大小 */
  spinnerSize?: number | 'small' | 'large'
  /** 加载指示器颜色 */
  spinnerColor?: string
}

// useList Hook — 分页数据管理
export const useList = <TData extends Data>(
  service: Service<TData>,
  options?: ListOptions<TData>
) => {
  data: TData | undefined
  loading: boolean
  noMore: boolean
  loadMore: () => void
  loadMoreAsync: () => Promise<TData>
  reload: (page?: number) => void
  reloadAsync: (page?: number) => Promise<TData>
  mutate: (data: TData) => void
  loadingMore: boolean
  reloading: boolean
  loadingMoreError: boolean
  cancel: () => void
  error: Error | undefined
}

export interface ListOptions<TData extends Data> {
  isNoMore?: (data?: TData) => boolean
  defaultCurrent?: number
  defaultPageSize?: number
  manual?: boolean
  reloadDeps?: DependencyList
  onBefore?: () => void
  onSuccess?: (data: TData) => void
  onError?: (e: Error) => void
  onFinally?: (data?: TData, e?: Error) => void
  // ... 更多 ahooks useRequest 选项
}
```

## 迁移对照表

| 旧属性/组件 | 新属性/组件 | 说明 |
|-------------|-------------|------|
| `<List>` | `<List>` | 架构完全不同：View 容器 → FlatList 分页列表 |
| `<List.Item>` | - | 移除，无直接对应。需改用 `renderItem` |
| `<List.Item.Brief>` | - | 移除，在 renderItem 中自行实现 |
| renderHeader | ListHeaderComponent | FlatList 的标准属性 |
| renderFooter | - | 新组件有内置的 Footer（加载状态、空数据等） |
| List.Item.thumb | - | 在 renderItem 中自行实现 |
| List.Item.extra | - | 在 renderItem 中自行实现 |
| List.Item.arrow | - | 在 renderItem 中自行实现 |
| List.Item.onPress | - | 在 renderItem 中自行实现 |
| List.Item.align | - | 在 renderItem 中自行实现 |
| List.Item.multipleLine | - | 在 renderItem 中自行实现 |
| - | data | 新增，FlatList 数据源 |
| - | renderItem | 新增，FlatList 渲染函数 |
| - | loadingMore | 新增，加载更多状态 |
| - | reloading | 新增，刷新状态 |
| - | noMore | 新增，无更多数据标记 |
| - | onHeaderLoad | 新增，下拉刷新回调 |
| - | onFooterLoad | 新增，上拉加载回调 |
| - | useList | 新增 Hook，封装分页逻辑 |

## 迁移示例

### 案例 1：简单静态列表（推荐使用 View 替代）

```tsx
// 迁移前
import { List } from '@roo/roo-rn1'

<List renderHeader="设置">
  <List.Item arrow="horizontal" onPress={() => navigate('profile')}>
    个人信息
  </List.Item>
  <List.Item arrow="horizontal" onPress={() => navigate('settings')}>
    系统设置
  </List.Item>
  <List.Item extra="已开启">
    通知
  </List.Item>
</List>

// 迁移后 — 对于静态列表，直接用 View 布局替代
import { View, Text, TouchableOpacity } from 'react-native'

<View>
  <Text style={styles.header}>设置</Text>
  <TouchableOpacity style={styles.item} onPress={() => navigate('profile')}>
    <Text>个人信息</Text>
    <Icon type="right" />
  </TouchableOpacity>
  <TouchableOpacity style={styles.item} onPress={() => navigate('settings')}>
    <Text>系统设置</Text>
    <Icon type="right" />
  </TouchableOpacity>
  <View style={styles.item}>
    <Text>通知</Text>
    <Text style={styles.extra}>已开启</Text>
  </View>
</View>
```

### 案例 2：带缩略图和描述的列表

```tsx
// 迁移前
import { List } from '@roo/roo-rn1'

<List>
  <List.Item
    thumb="https://example.com/avatar.png"
    multipleLine
    extra="管理员"
    arrow="horizontal"
    onPress={() => navigate('user/1')}
  >
    张三
    <List.Item.Brief>技术部 - 前端工程师</List.Item.Brief>
  </List.Item>
</List>

// 迁移后 — 使用 View 自行实现
import { View, Text, Image, TouchableOpacity } from 'react-native'

<TouchableOpacity style={styles.item} onPress={() => navigate('user/1')}>
  <Image source={{ uri: 'https://example.com/avatar.png' }} style={styles.thumb} />
  <View style={styles.content}>
    <Text style={styles.title}>张三</Text>
    <Text style={styles.brief}>技术部 - 前端工程师</Text>
  </View>
  <Text style={styles.extra}>管理员</Text>
  <Icon type="right" />
</TouchableOpacity>
```

### 案例 3：动态分页列表

```tsx
// 迁移前 — roo-rn 的 List 不支持分页，通常自行封装 FlatList
import { FlatList } from 'react-native'

<FlatList
  data={list}
  renderItem={({ item }) => <CustomItem item={item} />}
  onEndReached={loadMore}
  onRefresh={refresh}
  refreshing={refreshing}
/>

// 迁移后 — 使用 wand-rn List + useList
import { List, useList } from '@sfe/wand-rn'

const { data, loadingMore, reloading, noMore, loadMore, reload } = useList(
  async (params) => {
    const res = await fetchList(params.page, params.pageSize)
    return {
      list: res.items,
      pagination: { page: params.page, total: res.total },
    }
  },
  {
    defaultCurrent: 1,
    defaultPageSize: 20,
    isNoMore: (d) => (d?.list?.length ?? 0) >= (d?.pagination?.total ?? 0),
  }
)

<List
  data={data?.list}
  renderItem={({ item }) => <CustomItem item={item} />}
  loadingMore={loadingMore}
  reloading={reloading}
  noMore={noMore}
  onHeaderLoad={reload}
  onFooterLoad={loadMore}
  keyExtractor={(item) => item.id}
/>
```

### 案例 4：renderHeader 迁移

```tsx
// 迁移前
import { List } from '@roo/roo-rn1'

<List
  renderHeader={() => <View style={styles.header}><Text>标题</Text></View>}
  renderFooter="共 5 项"
>
  {items.map(item => (
    <List.Item key={item.id}>{item.name}</List.Item>
  ))}
</List>

// 迁移后
import { List } from '@sfe/wand-rn'

<List
  data={items}
  renderItem={({ item }) => <View style={styles.item}><Text>{item.name}</Text></View>}
  ListHeaderComponent={<View style={styles.header}><Text>标题</Text></View>}
  loadingMore={false}
  reloading={false}
  noMore={true}
  keyExtractor={(item) => item.id}
/>
// 注意：renderFooter 由 List 内部管理（显示加载状态等）
```

## 关键点

### 1. 架构范式完全不同
- **roo-rn List**：基于 View 的静态布局组件，通过 `<List.Item>` 声明式组合子元素
- **wand-rn List**：基于 FlatList 的分页列表组件，通过 `data` + `renderItem` 数据驱动渲染
- 两者解决的问题不同：前者是 UI 布局，后者是长列表性能 + 分页管理

### 2. 静态列表不需要迁移到 wand-rn List
- 如果原来的 `<List>` + `<List.Item>` 只是用来做设置页、表单列表等静态 UI 布局
- 建议直接用 `View` / `TouchableOpacity` 替代，无需使用 wand-rn 的 List
- wand-rn 的 List 更适合动态数据、需要分页的场景

### 3. List.Item / List.Item.Brief 无直接替代
- wand-rn List 没有提供 ListItem 子组件
- 需要在 `renderItem` 中自行实现行的布局（thumb、content、extra、arrow 等）
- 可以抽取一个通用的 ListItem 组件复用

### 4. useList Hook 提供完整的分页状态管理
- 封装了加载更多、下拉刷新、错误重试等状态
- 基于 ahooks 的 useRequest，支持防抖、缓存、轮询等高级功能
- 返回值直接作为 `<List>` 组件的 props

### 5. Footer 状态内置
- wand-rn List 内置了加载中、无更多数据、空数据、加载失败等 Footer 状态
- 通过 `footerLoadingText`、`noMoreDataText`、`emptyDataText`、`errorDataText` 自定义文案

## 注意事项

1. **不要一对一迁移**：roo-rn 的 List 和 wand-rn 的 List 不是同一类组件，不能简单替换 import
2. **静态场景用 View**：设置页、表单布局等静态列表，应直接用 RN 原生 View 实现
3. **动态场景用 List + useList**：接口分页列表，使用 wand-rn 的 `<List>` + `useList` 组合
4. **必填 props**：wand-rn List 要求 `loadingMore`、`reloading`、`noMore` 这三个状态 props
5. **data 需要展开**：List 组件内部会 `[...data]` 创建新引用，注意不要传 undefined
6. **memo 比较**：wand-rn List 使用 `React.memo` + `_.isEqual` 比较 props，如果 data 引用没变但内容变了，也会正确更新

## 迁移检查清单

- [ ] 判断当前 List 的使用场景：静态布局 or 动态分页
- [ ] 静态布局场景：将 `<List>` + `<List.Item>` 替换为 View 布局
- [ ] 动态分页场景：引入 `List` + `useList` 组合
- [ ] 移除 `<List.Item>` 组件，改为 `renderItem` 函数
- [ ] 移除 `<List.Item.Brief>` 组件，在 renderItem 中自行实现描述文字
- [ ] 将 `renderHeader` 替换为 `ListHeaderComponent`
- [ ] 移除 `renderFooter`，使用内置的加载状态 Footer
- [ ] 实现 thumb、extra、arrow 等 UI 元素（wand-rn List 不内置）
- [ ] 提供 `loadingMore`、`reloading`、`noMore` 状态 props
- [ ] 测试下拉刷新和上拉加载更多功能
- [ ] 检查列表为空时的显示效果
- [ ] 确认 keyExtractor 已正确设置
