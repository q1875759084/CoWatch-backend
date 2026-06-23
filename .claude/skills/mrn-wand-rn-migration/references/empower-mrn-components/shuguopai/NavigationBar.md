# NavigationBar 导航栏

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface IconTextItem {
    text?: string
    type?: AllIcons  // 图标类型，支持 'left', 'search', 'add', 'menus-o', 'scan', 'share', 'ellipsis' 等
    source?: ImageSourcePropType
    tintColor?: string
    onPress: () => void
}

type NavigationBarItem = IconTextItem | ReactNode
type NavigationBarItems = NavigationBarItem | NavigationBarItem[]

interface NavigationBarProps {
    navigation?: NavigationScreenProp<any>  // React Navigation 对象
    statusBar?: StatusBarProps
    
    title?: ReactNode  // 标题
    titleStyle?: StyleProp<TextStyle>  // 标题样式
    
    showBack?: boolean  // 是否显示返回按钮，默认 true
    rightItems?: NavigationBarItems  // 右侧按钮项
    
    onBackPress?: () => void  // 返回按钮点击回调
}
```

### 默认值
- `title`: null
- `statusBar`: {}
- `showBack`: true
- `rightItems`: []

## 新组件 API

```tsx
interface NavigationBarProps extends WithThemeStyles<NavigationBarStyles> {
    navigation?: NavigationScreenProp<any>  // React Navigation 对象
    
    // 高度和背景
    height?: number  // 自定义导航栏高度，默认 44
    backgroundColor?: string  // 自定义导航栏背景色，默认 '#ffffff'
    style?: StyleProp<ViewStyle>  // 自定义包裹导航栏最外层 View 的样式
    
    // 标题和副标题
    title?: string | JSX.Element  // 自定义标题
    subTitle?: string  // 自定义副标题
    titleStyles?: StyleProp<TextStyle>  // 自定义标题样式
    
    // 搜索栏相关
    hasSearchBar?: boolean  // 是否展示搜索栏，默认 false
    searchPlaceholder?: string  // 搜索栏未输入时提示文字，默认 '请输入搜索内容'
    hasSearchBarIcon?: boolean  // 是否展示搜索栏搜索 Icon，默认 false
    searchBarProps?: SearchBarProps  // 搜索框 SearchBar 的 props
    renderSearchBar?: () => JSX.Element  // 自定义搜索栏内容区域
    renderSearchBarIcon?: () => JSX.Element  // 自定义搜索栏 Icon
    renderSearchBarButton?: () => JSX.Element  // 搜索按钮自定义
    searchButtonText?: string  // 搜索按钮文字，默认 '搜索'
    onSearchButtonClick?: (text: string) => void  // 搜索按钮被点击
    onSearchTextChange?: (text: string) => void  // 输入框文字改变
    
    // 返回按钮相关
    backButton?: string | JSX.Element  // 自定义返回按钮
    backButtonActiveOpacity?: number  // 自定义返回按钮 activeOpacity，默认 0.3
    backButtonTintColor?: string  // 自定义返回按钮 Icon 颜色
    onPressBackButton?: (data: GestureResponderEvent) => void  // 返回按钮的点击回调
    
    // 右侧内容
    right?: string | JSX.Element  // 自定义右侧按钮
    
    // 其他
    scene?: JSX.Element  // 自定义导航栏背景填充物
    transparentBackground?: boolean  // 设置透明背景，默认 false
    inputProps?: TextInputProps  // searchBar 中 TextInput 的 props 属性
    placeholderTextFocusColor?: string  // 搜索框聚焦时占位符颜色，默认 '#cccccc'
    placeholderTextColor?: string  // 搜索框占位符颜色，默认 '#999999'
    searchInputSelectionColor?: string  // 搜索框选择文字时高亮颜色，默认 '#FFD100'
    statusbarStyle?: string  // 状态栏样式，默认 'dark-content'
    
    children?: ReactNode  // 子元素，可用于自定义内容
}
```

### Ref 属性
- `searchFocus: () => void` - 展示搜索栏时，使 input 聚焦

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| title | title | 标题，保持一致 |
| titleStyle | titleStyles | 标题样式属性名 |
| showBack | - | 新组件无此属性，通过 `backButton` 和 `onPressBackButton` 结合实现 |
| rightItems | right | 右侧项目，新组件仅支持单个元素或 JSX，不支持数组 |
| onBackPress | onPressBackButton | 返回按钮点击回调 |
| statusBar | statusbarStyle | 新组件简化为仅支持 statusbarStyle 属性 |
| - | backButton | 新增：自定义返回按钮 |
| - | backButtonTintColor | 新增：返回按钮颜色 |
| - | hasSearchBar | 新增：是否显示搜索栏 |
| - | searchPlaceholder | 新增：搜索栏提示文字 |
| - | hasSearchBarIcon | 新增：是否显示搜索栏 Icon |
| - | searchBarProps | 新增：SearchBar 组件的 props |
| - | height | 新增：导航栏高度可配置 |
| - | backgroundColor | 新增：背景色可配置 |
| - | subTitle | 新增：副标题支持 |
| - | children | 新增：支持子元素 |

## 关键差异

### 1. rightItems 数组变成 right 单一元素
**旧版本**支持通过数组传递多个按钮项：
```tsx
rightItems={[
    { text: '操作', onPress: () => {...} },
    { type: 'search', onPress: () => {...} }
]}
```

**新版本**只支持单个元素，如需多按钮需要包装在一个组件中。

### 2. showBack 逻辑变化
**旧版本**通过 `showBack` 布尔值自动生成返回按钮。

**新版本**：
- 默认没有返回按钮
- 通过 `backButton` prop 自定义或使用默认返回图标
- 通过 `onPressBackButton` 处理返回逻辑

### 3. 搜索栏功能增强
**旧版本**使用 `InputNavigation` 组件来实现搜索。

**新版本**集成到 `NavigationBar` 中：
- `hasSearchBar` 控制搜索栏显示
- `searchBarProps` 可传入 SearchBar 组件 props
- 更灵活的搜索栏定制选项

### 4. 图标项目处理
**旧版本**支持 `IconTextItem` 对象，通过 `type` 字段使用内置图标。

**新版本**：
- `right` 属性只接受字符串或 JSX.Element
- 需要手动使用 Icon 组件构建右侧内容
- 更灵活但需要更多代码

## 迁移示例

### 案例 1：简单标题和返回按钮

```tsx
// 迁移前
<NavigationBar 
  title='标题' 
  showBack={true}
  onBackPress={() => navigation.back()}
/>

// 迁移后
<NavigationBar 
  title='标题'
  onPressBackButton={() => navigation.back()}
/>
```

### 案例 2：右侧单个文字按钮

```tsx
// 迁移前
<NavigationBar 
  title='标题'
  showBack={true}
  rightItems={[{
    text: '操作',
    tintColor: '#FF6B00',
    onPress: () => handleAction()
  }]}
/>

// 迁移后
import { Button } from '@sfe/wand-rn'

<NavigationBar 
  title='标题'
  right={
    <Button 
      type='text' 
      onPress={() => handleAction()}
    >
      操作
    </Button>
  }
/>
```

### 案例 3：右侧多个图标按钮（需要包装）

```tsx
// 迁移前
<NavigationBar 
  title='标题'
  showBack={true}
  rightItems={[
    { type: 'search', onPress: () => handleSearch() },
    { type: 'add', onPress: () => handleAdd() },
    { type: 'menus-o', onPress: () => handleMenu() }
  ]}
/>

// 迁移后
import { Icon } from '@sfe/wand-rn'
import { Press } from '@sfe/wand-rn'
import { View } from '@mrn/react-native'

<NavigationBar 
  title='标题'
  right={
    <View style={{ flexDirection: 'row' }}>
      <Press.Opacity onPress={() => handleSearch()}>
        <Icon type='search' />
      </Press.Opacity>
      <Press.Opacity onPress={() => handleAdd()}>
        <Icon type='add' />
      </Press.Opacity>
      <Press.Opacity onPress={() => handleMenu()}>
        <Icon type='menus-o' />
      </Press.Opacity>
    </View>
  }
/>
```

### 案例 4：搜索栏

```tsx
// 迁移前（使用 InputNavigation）
<InputNaviagation 
  placeholder='搜索提示语'
  showBack={true}
  onChangeText={(value) => setState(value)}
/>

// 迁移后
<NavigationBar 
  showSearchBar
  hasSearchBarIcon
  searchPlaceholder='搜索提示语'
  onSearchTextChange={(value) => setState(value)}
  onPressBackButton={() => navigation.back()}
/>
```

### 案例 5：搜索栏 + SearchBar 组件集成

```tsx
// 迁移前
// 需要自己组合

// 迁移后
<NavigationBar 
  showSearchBar
  searchBarProps={{
    placeholder: '请输入商品名称',
    value: searchText,
    onChange: (value) => setSearchText(value),
    onClear: () => setSearchText('')
  }}
  onSearchButtonClick={(text) => handleSearch(text)}
/>
```

### 案例 6：副标题和自定义返回按钮

```tsx
// 迁移前
// 不支持副标题
<NavigationBar 
  title='购物车'
  showBack={true}
/>

// 迁移后
import { Button } from '@sfe/wand-rn'

<NavigationBar 
  title='购物车'
  subTitle='9.9 购物狂欢'
  backButton={<Button type='text'>返回</Button>}
  onPressBackButton={() => navigation.back()}
/>
```

### 案例 7：透明背景和自定义样式

```tsx
// 迁移前
// 需要通过样式表处理

// 迁移后
<NavigationBar 
  title='标题'
  transparentBackground
  backgroundColor='rgba(0,0,0,0.5)'
  height={50}
  titleStyles={{ fontSize: 18 }}
/>
```

## 迁移步骤

1. **移除 `showBack` 属性**
   - 如果需要返回按钮，添加 `onPressBackButton` 回调
   - 如果需要自定义返回按钮样式，使用 `backButton` prop

2. **迁移 `rightItems` 数组到 `right` 单元素**
   - 如果是单个按钮项，直接转换
   - 如果是多个按钮，需要手动用 View 包装成单个 JSX 元素
   - 使用 Button、Icon、Press 等组件替代 IconTextItem 对象

3. **重命名属性**
   - `titleStyle` → `titleStyles`
   - `onBackPress` → `onPressBackButton`

4. **搜索栏功能迁移**
   - 如果使用 `InputNavigation`，改用 `NavigationBar` 的 `hasSearchBar` 相关属性
   - 可选：集成 `SearchBar` 组件（通过 `searchBarProps`）

5. **处理状态栏**
   - 旧的 `statusBar` prop 在新版本中被简化
   - 使用 `statusbarStyle` 属性

6. **测试用例**
   - 验证返回按钮功能
   - 验证右侧按钮点击
   - 验证搜索功能（如有）
   - 验证标题和副标题显示

## 其他信息

| 属性 | 说明 |
|------|------|
| 导入路径 | `import { NavigationBar } from '@sfe/wand-rn'` |
| 类型 | 组件（可用 ref） |
| 导航栏高度 | 默认 44px |
| 支持 theme 样式 | 是 |
| 支持主题定制 | 是（通过 styles prop） |

## 常见问题

### Q: 如何在新版本中实现右侧多个按钮？
A: 需要将多个按钮包装在一个 View 中，作为单一的 `right` prop 传入。

### Q: 新版本如何关闭返回按钮？
A: 不传递 `backButton` 和 `onPressBackButton` 即可。

### Q: `InputNavigation` 组件怎么迁移？
A: 使用 `NavigationBar` 的 `hasSearchBar` 相关属性替代，或者使用 `renderSearchBar` 自定义搜索栏内容。

### Q: 如何获取搜索框的焦点？
A: 使用 ref，调用 `searchFocus()` 方法：
```tsx
const navRef = useRef()
navRef.current?.searchFocus()
```

### Q: 新版本是否支持 StatusBar？
A: 新版本去掉了复杂的 `statusBar` prop，只保留 `statusbarStyle` 属性。如需更细粒度控制，使用 React Native 的 StatusBar 组件。
