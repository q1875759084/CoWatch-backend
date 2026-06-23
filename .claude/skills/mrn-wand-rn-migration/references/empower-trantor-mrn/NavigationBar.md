# NavigationBar 导航栏

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface NavItem {
    title?: {
        content: string
        style?: StyleProp<TextStyle>
    }
    image?: {
        content: string
        style?: StyleProp<ImageStyle>
    }
    onClick?: () => void
}

export interface NavProps {
    navigation?: NavigationScreenProp<any>
    title?: string | JSX.Element
    hideBack?: boolean
    backItem?: NavItem
    leftItems?: NavItem[] | JSX.Element
    rightItems?: NavItem[] | JSX.Element
}
```

## 新组件 API

```tsx
export interface NavigationBarProps extends WithThemeStyles<NavigationBarStyles> {
    navigation?: NavigationScreenProp<any>
    /** 自定义导航栏高度 */
    height?: number  // 默认 44
    /** 自定义导航栏背景色 */
    backgroundColor?: string  // 默认 '#ffffff'
    /** 自定义包裹导航栏最外层 `View` 的样式 */
    style?: StyleProp<ViewStyle>
    /** 自定义导航栏背景填充物 */
    scene?: JSX.Element
    /** 自定义标题 */
    title?: string | JSX.Element  // 默认 ''
    /** 自定义副标题 */
    subTitle?: string  // 默认 ''
    /** 自定义标题样式 */
    titleStyles?: StyleProp<TextStyle>
    /** 是否展示搜索栏 */
    hasSearchBar?: boolean  // 默认 false
    /** 搜索栏占位符 */
    searchPlaceholder?: string  // 默认 '请输入搜索内容'
    /** 是否展示搜索栏搜索 Icon */
    hasSearchBarIcon?: boolean  // 默认 false
    /** 搜索框 SearchBar 的 Props */
    searchBarProps?: SearchBarProps
    /** 自定义搜索栏内容区域 */
    renderSearchBar?: () => JSX.Element
    /** 自定义搜索栏 Icon */
    renderSearchBarIcon?: () => JSX.Element
    /** 搜索按钮自定义 */
    renderSearchBarButton?: () => JSX.Element
    /** 搜索按钮文字 */
    searchButtonText?: string  // 默认 '搜索'
    /** 搜索按钮被点击 */
    onSearchButtonClick?: (text: string) => void
    /** 输入框文字改变 */
    onSearchTextChange?: (text: string) => void
    /** 自定义返回按钮 */
    backButton?: string | JSX.Element
    /** 自定义包裹 backButton 的 TouchableHighlight 的 activeOpacity */
    backButtonActiveOpacity?: number  // 默认 0.3
    /** 自定义返回按钮 Icon 颜色 */
    backButtonTintColor?: string  // 默认 '#222222'
    /** 返回按钮的点击回调 */
    onPressBackButton?: (data: GestureResponderEvent) => void
    /** searchBar 中 TextInput 的 props 属性 */
    inputProps?: TextInputProps
    /** 右侧内容 */
    right?: string | JSX.Element  // 默认 ''
    /** 搜索框占位符获得焦点时的颜色 */
    placeholderTextFocusColor?: string  // 默认 '#cccccc'
    /** 搜索框占位符颜色 */
    placeholderTextColor?: string  // 默认 '#999999'
    /** 搜索框文本选中颜色 */
    searchInputSelectionColor?: string  // 默认 '#FFD100'
    /** 状态栏样式 */
    statusbarStyle?: string  // 默认 'dark-content'
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| title | title | 直接使用，无需改变 |
| navigation | navigation | 直接使用 |
| hideBack | (移除) | 新版本不再支持该属性，通过不设置 backButton 等实现 |
| backItem | backButton / onPressBackButton | 拆分为独立属性，backItem.onClick → onPressBackButton |
| leftItems | (重构) | 新版本无 leftItems，左侧仅显示返回按钮，其他内容需要放在 title 或自定义 |
| rightItems | right | 改为 right 属性，仅支持单个元素 |
| (无) | subTitle | 新增副标题支持 |
| (无) | hasSearchBar | 新增搜索栏支持 |
| (无) | searchBarProps | 新增通过 SearchBar 组件自定义搜索 |
| (无) | height | 新增自定义高度 |
| (无) | backgroundColor | 新增自定义背景色 |
| (无) | backButtonTintColor | 新增返回按钮颜色自定义 |

## 迁移示例

### 案例 1：基础标题导航栏

```tsx
// 迁移前
<NavigationBar 
  navigation={navigation}
  title="首页" 
/>

// 迁移后
<NavigationBar 
  navigation={navigation}
  title="首页" 
/>
```

### 案例 2：自定义返回按钮

```tsx
// 迁移前
<NavigationBar 
  navigation={navigation}
  title="商品详情"
  hideBack={false}
  backItem={{
    image: {
      content: backIcon,
      style: { width: 24, height: 24 }
    },
    onClick: () => navigation.back()
  }}
/>

// 迁移后
<NavigationBar 
  navigation={navigation}
  title="商品详情"
  backButton={undefined}  // 使用默认返回按钮
  backButtonTintColor="#222222"
  onPressBackButton={() => navigation.back()}
/>
```

### 案例 3：右侧按钮（原 rightItems）

```tsx
// 迁移前
<NavigationBar 
  navigation={navigation}
  title="搜索"
  rightItems={[
    {
      title: {
        content: "完成",
        style: { color: '#ff6000' }
      },
      onClick: () => handleFinish()
    }
  ]}
/>

// 迁移后
<NavigationBar 
  navigation={navigation}
  title="搜索"
  right={
    <TouchableOpacity onPress={() => handleFinish()}>
      <Text style={{ color: '#ff6000', fontSize: 16 }}>完成</Text>
    </TouchableOpacity>
  }
/>
```

### 案例 4：带搜索栏的导航栏

```tsx
// 迁移前 - 原库不支持搜索栏功能

// 迁移后
<NavigationBar 
  navigation={navigation}
  title="搜索页面"
  hasSearchBar={true}
  searchPlaceholder="请输入商品名称"
  onSearchButtonClick={(text) => {
    console.log('搜索:', text)
    handleSearch(text)
  }}
  onSearchTextChange={(text) => {
    setSearchText(text)
  }}
/>
```

### 案例 5：带副标题和自定义样式

```tsx
// 迁移前
<NavigationBar 
  navigation={navigation}
  title={<View><Text>主标题</Text></View>}
/>

// 迁移后
<NavigationBar 
  navigation={navigation}
  title="主标题"
  subTitle="副标题"
  titleStyles={{ fontSize: 18, fontWeight: 'bold' }}
/>
```

### 案例 6：完整示例 - 商品详情页

```tsx
// 迁移前
<NavigationBar 
  navigation={navigation}
  title="商品详情"
  hideBack={false}
  rightItems={[
    {
      image: {
        content: shareIcon,
        style: { width: 24, height: 24 }
      },
      onClick: () => handleShare()
    },
    {
      image: {
        content: moreIcon,
        style: { width: 24, height: 24 }
      },
      onClick: () => handleMore()
    }
  ]}
/>

// 迁移后
<NavigationBar 
  navigation={navigation}
  title="商品详情"
  backgroundColor="#ffffff"
  right={
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <TouchableOpacity onPress={() => handleShare()}>
        <Icon name="share" size={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleMore()}>
        <Icon name="more" size={24} />
      </TouchableOpacity>
    </View>
  }
  onPressBackButton={() => navigation.back()}
/>
```

### 案例 7：自定义搜索栏

```tsx
// 迁移后 - 使用 SearchBar 组件
<NavigationBar 
  navigation={navigation}
  hasSearchBar={true}
  searchBarProps={{
    placeholder: '搜索商品',
    onChange: (value) => handleSearchChange(value),
    onClear: () => setSearchText('')
  }}
  onSearchButtonClick={(text) => {
    performSearch(text)
  }}
/>
```

### 案例 8：无返回按钮的导航栏

```tsx
// 迁移前
<NavigationBar 
  navigation={navigation}
  title="首页"
  hideBack={true}
/>

// 迁移后 - 使用 renderSearchBar 等自定义完全隐藏返回按钮
// 注：新版本无直接隐藏返回按钮的属性，需要通过不传 onPressBackButton 或设置 backButton={null}
<NavigationBar 
  navigation={undefined}  // 不传 navigation，返回按钮会隐藏
  title="首页"
/>
```

## 关键点

- **返回按钮处理**: 旧版本的 `hideBack` 属性已移除，新版本通过不传 `navigation` 或自定义 `backButton` 来控制
- **左侧按钮**: 新版本不再支持 `leftItems` 数组，如需要多个左侧按钮，需要使用 `scene` 属性自定义或修改组件结构
- **右侧按钮**: 从 `rightItems` 数组改为单个 `right` 属性。如需要多个右侧按钮，需要在 `right` 中使用 View 包装多个组件
- **搜索栏**: 新版本新增了搜索栏功能（`hasSearchBar`、`searchBarProps`），提供了更强大的搜索功能支持
- **副标题**: 新增 `subTitle` 属性，支持在标题下方显示副标题
- **样式定制**: 新版本支持 `backgroundColor`、`height`、`titleStyles` 等属性，提供了更细粒度的样式控制
- **返回按钮颜色**: 使用 `backButtonTintColor` 替代旧版本通过 `backItem.image.style` 的方式
- **主题集成**: 新版本支持主题系统（`styles` prop），可以通过主题定制样式

## 迁移清单

- [ ] 检查所有 `hideBack` 的使用，决定是否需要返回按钮
- [ ] 将 `backItem.onClick` 迁移到 `onPressBackButton`
- [ ] 将 `rightItems` 改为 `right`，如有多个右侧按钮，需要用 View 包装
- [ ] 如有 `leftItems` 的高级用法，需要评估是否可以通过 `title` 自定义或使用 `scene`
- [ ] 根据需求评估是否需要使用新增的搜索栏功能
- [ ] 测试返回按钮的点击行为
- [ ] 测试右侧按钮的布局和交互
