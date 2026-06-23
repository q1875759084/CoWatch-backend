# LoadingFooter 加载页脚

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface FooterProps {
    hasMore?: boolean  // 是否有更多数据
    loadingText?: string  // 默认 '加载中...'
    noMoreText?: string  // 默认 '没有更多内容'
}
```

## 新组件 API

```tsx
interface LoadingProps {
    color?: string  // 默认 '#CCCCCC'，loading 图标颜色
    size?: number  // 默认 20，loading 图标大小
    text?: string | React.ReactElement  // 文字内容
    textSize?: number  // 默认 14，文字大小
    type?: 'spinner' | 'circle'  // 默认 'spinner'，Loading 的样式
    vertical?: boolean  // 默认 false，文字与 loading 图标默认横向排列
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| hasMore | - | 需要通过条件渲染实现 |
| loadingText | text | 加载中的文字内容 |
| noMoreText | - | 需要单独使用 Text 组件显示 |

## 迁移示例

### 案例 1：基础加载状态

```tsx
// 迁移前
<LoadingFooter hasMore={true} />

// 迁移后
{hasMore && (
  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
    <Loading text="加载中..." color="gray" />
  </View>
)}
```

### 案例 2：自定义加载文案

```tsx
// 迁移前
<LoadingFooter 
  hasMore={true} 
  loadingText="正在加载更多..." 
/>

// 迁移后
{hasMore && (
  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
    <Loading text="正在加载更多..." color="gray" />
  </View>
)}
```

### 案例 3：完整的加载页脚（包含"没有更多"状态）

```tsx
// 迁移前
<LoadingFooter 
  hasMore={hasMore}
  loadingText="加载中..."
  noMoreText="没有更多内容"
/>

// 迁移后
<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
  {hasMore ? (
    <Loading text="加载中..." color="gray" />
  ) : (
    <Text style={{ fontSize: 16, color: '#999' }}>没有更多内容</Text>
  )}
</View>
```

### 案例 4：自定义样式和颜色

```tsx
// 迁移前
<LoadingFooter 
  hasMore={true}
  loadingText="加载中..."
/>

// 迁移后
{hasMore && (
  <View style={{ 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 10,
    backgroundColor: '#f5f5f5'  // 自定义背景色
  }}>
    <Loading 
      text="加载中..." 
      color="#1890ff"  // 自定义图标颜色
      textSize={14}
    />
  </View>
)}
```

## 关键点

- `LoadingFooter` 是一个封装了加载状态和无更多数据状态的组合组件，迁移时需要拆分为两个独立状态
- `hasMore` 属性需要通过条件渲染来实现，使用 `{hasMore && <Loading />}` 或三元表达式
- "没有更多内容"状态需要使用独立的 `Text` 组件来显示
- 新组件 `Loading` 不包含默认的容器样式和 padding，需要手动添加外层 `View` 来实现相同的布局效果
- 旧组件使用 `ActivityIndicator`，新组件使用自定义的 `Icon` 组件，视觉效果可能略有差异
- 新组件的 `color` 默认值为 `#CCCCCC`，而旧组件使用 `gray`，可根据设计需求调整
- 新组件提供了更多自定义选项，如 `type`（spinner/circle）、`vertical`（垂直布局）、`textSize` 等
