# NavigationBar 导航栏

## 从何处迁移
- **源库**: `@roo/roo-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface NavigationBarProps extends WithThemeStyles<NavigationBarStyles> {
  /** 自定义导航栏高度 */
  height?: number  // 默认 44
  /** 自定义导航栏背景色 */
  backgroundColor?: string  // 默认 '#ffffff'
  /** 自定义包裹导航栏最外层 `View` 的样式 */
  style?: StyleProp<ViewStyle>
  /** 自定义导航栏背景填充物 */
  scene?: JSX.Element
  /** 自定义标题 */
  title?: string | JSX.Element
  /** 自定义副标题 */
  subTitle?: string  // 默认 ''
  /** 自定义标题样式 */
  titleStyles?: StyleProp<TextStyle>
  /** 是否展示搜索栏 */
  hasSearchBar?: boolean  // 默认 false
  /** 搜索栏未输入时提示文字 */
  searchPlaceholder: string  // 默认 '请输入搜索内容'
  /** 是否展示搜索栏搜索 Icon */
  hasSearchBarIcon?: boolean  // 默认 false
  /** 自定义搜索栏搜索内容区域 */
  renderSearchBar?: () => JSX.Element
  /** 自定义搜索栏 Icon */
  renderSearchBarIcon?: () => JSX.Element
  /** 搜索按钮自定义 */
  renderSearchBarButton?: () => JSX.Element
  /** 搜索按钮文字 */
  searchButtonText: string  // 默认 '搜索'
  /** 搜索按钮被点击 */
  onSearchButtonClick: (text: string) => void
  /** 输入框文字改变 */
  onSearchTextChange: (text: string) => void
  /** 自定义返回按钮 */
  backButton?: string | JSX.Element
  /** 自定义包裹 backButton 的 TouchableHighlight 的 activeOpacity */
  backButtonActiveOpacity?: number  // 默认 0.3
  /** 自定义返回按钮 Icon 颜色 */
  backButtonTintColor?: string
  /** 返回按钮的点击回调 */
  onPressBackButton?: (data: GestureResponderEvent) => void
  /** searchBar 中 TextInput 的 props 属性 */
  inputProps?: TextInputProps
  /** 自定义右侧按钮 */
  right?: string | JSX.Element
  /** 搜索栏提示文字颜色 */
  placeholderTextColor?: string  // 默认 '#999999'
  /** 搜索栏 Focus 提示文字颜色 */
  placeholderTextFocusColor?: string  // 默认 '#cccccc'
  /** 搜索栏光标颜色 */
  searchInputSelectionColor?: string  // 默认 '#FFD100'
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
  title?: string | JSX.Element
  /** 自定义副标题 */
  subTitle?: string
  /** 自定义标题样式 */
  titleStyles?: StyleProp<TextStyle>
  /** 是否展示搜索栏 */
  hasSearchBar?: boolean  // 默认 false
  /** 搜索栏未输入时提示文字 */
  searchPlaceholder?: string
  /** 是否展示搜索栏搜索 Icon */
  hasSearchBarIcon?: boolean  // 默认 false
  /** 搜索框 SearchBar 的 Props（新增，使用 SearchBar 组件） */
  searchBarProps?: SearchBarProps
  /** 自定义搜索栏搜索内容区域 */
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
  backButtonTintColor?: string
  /** 返回按钮的点击回调 */
  onPressBackButton?: (data: GestureResponderEvent) => void
  /** searchBar 中 TextInput 的 props 属性 */
  inputProps?: TextInputProps
  /** 自定义右侧按钮 */
  right?: string | JSX.Element
  /** 搜索栏提示文字颜色 */
  placeholderTextColor?: string
  /** 搜索栏 Focus 提示文字颜色 */
  placeholderTextFocusColor?: string
  /** 搜索栏光标颜色 */
  searchInputSelectionColor?: string
  statusbarStyle?: string
}

export interface NavigationBarRef {
  searchFocus: () => void  // 聚焦搜索框（新增）
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| 所有属性 | 所有属性 | 大部分属性保持一致，但需要注意以下变化 |
| - | searchBarProps | 新增，支持传入 SearchBar 的 Props |
| - | navigation | 新增，支持 navigation 对象自动返回 |
| renderSearchBar 等 | renderSearchBar 等 | 保持一致 |
| inputProps | inputProps | 保持一致，但当使用 searchBarProps 时该属性被忽略 |
| - | searchFocus() | 新增 Ref 方法，用于聚焦搜索框 |

## 迁移示例

### 案例 1：基础导航栏

```tsx
// 迁移前
import { NavigationBar } from '@roo/roo-rn'

<NavigationBar 
  title="首页"
  onPressBackButton={() => navigation.goBack()}
/>

// 迁移后
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar 
  title="首页"
  onPressBackButton={() => navigation.goBack()}
/>
```

### 案例 2：带返回导航的导航栏

```tsx
// 迁移前
import { NavigationBar } from '@roo/roo-rn'

<NavigationBar 
  title="详情页"
  backButton="返回"
  onPressBackButton={() => navigation.goBack()}
/>

// 迁移后 - 可自动识别 navigation 对象
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar 
  title="详情页"
  navigation={navigation}  // 新增，自动处理返回逻辑
  backButton="返回"
/>
```

### 案例 3：带副标题的导航栏

```tsx
// 迁移前
import { NavigationBar } from '@roo/roo-rn'

<NavigationBar 
  title="商店"
  subTitle="北京"
  onPressBackButton={() => navigation.goBack()}
/>

// 迁移后
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar 
  title="商店"
  subTitle="北京"
  onPressBackButton={() => navigation.goBack()}
/>
```

### 案例 4：搜索栏 - 原始 TextInput 模式

```tsx
// 迁移前
import { NavigationBar } from '@roo/roo-rn'

const [searchText, setSearchText] = useState('')

<NavigationBar 
  title="搜索"
  hasSearchBar={true}
  searchPlaceholder="输入商品名称"
  hasSearchBarIcon={true}
  searchButtonText="搜索"
  onSearchTextChange={(text) => setSearchText(text)}
  onSearchButtonClick={(text) => {
    console.log('搜索:', text)
  }}
/>

// 迁移后 - 保持一致
import { NavigationBar } from '@sfe/wand-rn'

const [searchText, setSearchText] = useState('')

<NavigationBar 
  title="搜索"
  hasSearchBar={true}
  searchPlaceholder="输入商品名称"
  hasSearchBarIcon={true}
  searchButtonText="搜索"
  onSearchTextChange={(text) => setSearchText(text)}
  onSearchButtonClick={(text) => {
    console.log('搜索:', text)
  }}
/>
```

### 案例 5：搜索栏 - 使用 SearchBar 组件（新方式）

```tsx
// 迁移前 - 无此功能
import { NavigationBar } from '@roo/roo-rn'

// 只能使用 TextInput 搜索框

// 迁移后 - 新增 SearchBar 支持
import { NavigationBar } from '@sfe/wand-rn'

const navRef = useRef<NavigationBarRef>(null)

<NavigationBar 
  ref={navRef}
  title="搜索"
  hasSearchBar={true}
  searchBarProps={{
    value: searchText,
    placeholder: "输入商品名称",
    onChange: (text) => setSearchText(text),
    onSearch: (text) => {
      console.log('搜索:', text)
    }
  }}
  onSearchButtonClick={(text) => {
    console.log('搜索按钮:', text)
  }}
/>

// 需要时可以聚焦搜索框
<Button onPress={() => navRef.current?.searchFocus()}>
  聚焦搜索
</Button>
```

### 案例 6：右侧按钮

```tsx
// 迁移前
import { NavigationBar } from '@roo/roo-rn'
import { Icon } from '@roo/roo-rn'

<NavigationBar 
  title="首页"
  right={<Icon type="setting-o" />}
/>

// 迁移后
import { NavigationBar } from '@sfe/wand-rn'
import { Icon } from '@sfe/wand-rn'

<NavigationBar 
  title="首页"
  right={<Icon type="set-up" />}
/>
```

### 案例 7：自定义背景色

```tsx
// 迁移前
import { NavigationBar } from '@roo/roo-rn'

<NavigationBar 
  title="自定义背景"
  backgroundColor="#FF6A00"
/>

// 迁移后
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar 
  title="自定义背景"
  backgroundColor="#FF6A00"
/>
```

### 案例 8：透明背景（新增）

```tsx
// 迁移前 - 需要手动传递透明颜色
import { NavigationBar } from '@roo/roo-rn'

<NavigationBar 
  title="透明导航栏"
  backgroundColor="transparent"
/>

// 迁移后 - 通过 Adaptor 层支持
import { NavigationBar } from '@sfe/wand-rn'

// 如果使用 Adaptor 层
<NavigationBar 
  title="透明导航栏"
  transparentBackground={true}  // Adaptor 层新增属性
/>

// 或直接使用原始组件
<NavigationBar 
  title="透明导航栏"
  backgroundColor="transparent"
/>
```

### 案例 9：自定义返回按钮颜色

```tsx
// 迁移前
import { NavigationBar } from '@roo/roo-rn'

<NavigationBar 
  title="自定义返回按钮"
  backButtonTintColor="#FF6A00"
  onPressBackButton={() => navigation.goBack()}
/>

// 迁移后 - Adaptor 层使用 backButtonColor
import { NavigationBar } from '@sfe/wand-rn'

// 方案 1：使用原始 NavigationBar
<NavigationBar 
  title="自定义返回按钮"
  backButtonTintColor="#FF6A00"
  onPressBackButton={() => navigation.goBack()}
/>

// 方案 2：使用 Adaptor 层（如果可用）
<NavigationBar 
  title="自定义返回按钮"
  backButtonColor="#FF6A00"
  onPressBackButton={() => navigation.goBack()}
/>
```

### 案例 10：自定义搜索栏

```tsx
// 迁移前
import { NavigationBar } from '@roo/roo-rn'

<NavigationBar 
  title="搜索"
  hasSearchBar={true}
  renderSearchBar={() => (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <TextInput placeholder="自定义搜索框" />
    </View>
  )}
/>

// 迁移后
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar 
  title="搜索"
  hasSearchBar={true}
  renderSearchBar={() => (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <TextInput placeholder="自定义搜索框" />
    </View>
  )}
/>
```

### 案例 11：自定义标题样式

```tsx
// 迁移前
import { NavigationBar } from '@roo/roo-rn'

<NavigationBar 
  title="自定义标题"
  titleStyles={{ fontSize: 18, color: '#FF6A00', fontWeight: 'bold' }}
/>

// 迁移后
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar 
  title="自定义标题"
  titleStyles={{ fontSize: 18, color: '#FF6A00', fontWeight: 'bold' }}
/>
```

### 案例 12：使用 scene 背景

```tsx
// 迁移前
import { NavigationBar } from '@roo/roo-rn'
import { LinearGradient } from '@react-native-linear-gradient'

<NavigationBar 
  title="渐变背景"
  scene={
    <LinearGradient 
      colors={['#FF6A00', '#FFB347']} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 0 }}
    />
  }
/>

// 迁移后
import { NavigationBar } from '@sfe/wand-rn'
import { LinearGradient } from '@mrn/react-native-linear-gradient'

<NavigationBar 
  title="渐变背景"
  scene={
    <LinearGradient 
      colors={['#FF6A00', '#FFB347']} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 0 }}
    />
  }
/>
```

### 案例 13：自定义高度

```tsx
// 迁移前
import { NavigationBar } from '@roo/roo-rn'

<NavigationBar 
  title="自定义高度"
  height={64}
/>

// 迁移后
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar 
  title="自定义高度"
  height={64}
/>
```

### 案例 14：完整复杂场景

```tsx
// 迁移前
import { NavigationBar } from '@roo/roo-rn'
import { Icon } from '@roo/roo-rn'

const [searchText, setSearchText] = useState('')

<NavigationBar 
  title="商品列表"
  subTitle="北京"
  hasSearchBar={true}
  hasSearchBarIcon={true}
  searchPlaceholder="搜索商品"
  searchButtonText="搜索"
  backButton="返回"
  backButtonTintColor="#FF6A00"
  right={<Icon type="setting-o" />}
  onPressBackButton={() => navigation.goBack()}
  onSearchTextChange={(text) => setSearchText(text)}
  onSearchButtonClick={(text) => {
    handleSearch(text)
  }}
  titleStyles={{ fontSize: 18, fontWeight: 'bold' }}
/>

// 迁移后
import { NavigationBar } from '@sfe/wand-rn'
import { Icon } from '@sfe/wand-rn'

const [searchText, setSearchText] = useState('')
const navRef = useRef<NavigationBarRef>(null)

<NavigationBar 
  title="商品列表"
  subTitle="北京"
  hasSearchBar={true}
  hasSearchBarIcon={true}
  searchPlaceholder="搜索商品"
  searchButtonText="搜索"
  backButton="返回"
  backButtonTintColor="#FF6A00"
  right={<Icon type="set-up" />}
  onPressBackButton={() => navigation.goBack()}
  onSearchTextChange={(text) => setSearchText(text)}
  onSearchButtonClick={(text) => {
    handleSearch(text)
  }}
  titleStyles={{ fontSize: 18, fontWeight: 'bold' }}
  ref={navRef}
/>
```

### 案例 15：使用 Ref 聚焦搜索框（新增）

```tsx
// 迁移前 - 无此功能
import { NavigationBar } from '@roo/roo-rn'

// 无法直接聚焦搜索框

// 迁移后 - 新增 Ref 支持
import { NavigationBar } from '@sfe/wand-rn'
import { Button } from '@sfe/wand-rn'

const navRef = useRef<NavigationBarRef>(null)

<>
  <NavigationBar 
    ref={navRef}
    title="搜索"
    hasSearchBar={true}
  />
  <Button 
    onPress={() => navRef.current?.searchFocus()}
  >
    聚焦搜索框
  </Button>
</>
```

## 关键点

### 1. 搜索栏的两种模式
- **原始 TextInput 模式**：使用旧的 inputProps、搜索按钮等方式
- **新 SearchBar 模式**：使用 searchBarProps，集成 SearchBar 组件（推荐新版本使用）

### 2. Navigation 对象支持
- 旧版本：需要手动在 onPressBackButton 中处理返回
- 新版本：支持传递 navigation 对象，自动处理返回逻辑

### 3. Icon 变化
- 旧版本返回按钮使用 'back-m-o' icon
- 新版本返回按钮使用相应的返回 icon（具体名称可能有所不同）

### 4. Ref 方法
- 新增 `searchFocus()` 方法，用于聚焦搜索框输入框

### 5. 适配层 (Adaptor)
- wand-rn 提供了 Adaptor 层包装，属性名略有不同
- `hasSearchBar` ↔ `showSearchBar`
- `hasSearchBarIcon` ↔ `showSearchBarIcon`
- `backButtonTintColor` ↔ `backButtonColor`
- `height` 被固定为 44（在 Adaptor 层）
- 新增 `transparentBackground` 属性

## 注意事项

1. **searchBarProps 优先级**：如果同时指定 searchBarProps 和 inputProps，searchBarProps 优先
2. **样式定制**：新版本可能更新了默认样式，需要测试确保外观一致
3. **Icon 变化**：确认返回按钮和其他 icon 的具体名称（如返回 icon、设置 icon 等）
4. **TextInput 属性**：当使用 SearchBar 模式时，inputProps 将被忽略
5. **返回处理逻辑**：
   - 如果提供了 `onPressBackButton` 回调，使用该回调
   - 如果没有回调但提供了 `navigation` 对象，自动调用 `navigation.back()`
   - 否则按钮将无作用

## 迁移检查清单

- [ ] 确认所有标题和副标题显示正确
- [ ] 检查返回按钮是否正常工作
- [ ] 验证搜索栏功能（如果使用）
- [ ] 确认右侧按钮位置和显示
- [ ] 检查背景色是否与设计一致
- [ ] 验证自定义标题样式是否生效
- [ ] 测试搜索栏输入和提交功能
- [ ] 确认 icon 显示是否正确（返回、搜索等）
- [ ] 检查适配不同屏幕尺寸的显示
- [ ] 验证 Ref 方法 searchFocus() 的工作（如果使用）
- [ ] 确认搜索框颜色配置（placeholder、焦点等）
- [ ] 测试自定义搜索栏功能（如果使用了 renderSearchBar）
