# NavigationBar 导航栏

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface NavigationBarProps {
  /** 自定义标题 */
  title?: string | JSX.Element
  /** 自定义副标题 */
  subTitle?: string
  /** 是否展示搜索栏 */
  showSearchBar?: boolean
  /** 搜索栏未输入时提示文字 */
  searchPlaceholder?: string
  /** 是否展示搜索栏搜索 Icon */
  showSearchBarIcon?: boolean
  /** 搜索按钮文字 */
  searchButtonText?: string
  /** 自定义返回按钮 */
  backButton?: string | JSX.Element
  /** 自定义返回按钮 Icon 颜色 */
  backButtonColor?: string
  /** 自定义右侧按钮 */
  right?: string | JSX.Element
  /** 自定义搜索按钮 */
  renderSearchBarButton?: () => JSX.Element
  /** 搜索按钮被点击 */
  onSearchButtonClick?: (text: string) => void
  /** 输入框文字改变 */
  onSearchTextChange?: (text: string) => void
  /** 返回按钮的点击回调 */
  onPressBackButton?: (data: GestureResponderEvent) => void
}
```

## 新组件 API

```tsx
interface AdaptorNavigationBarProps {
  /** React Navigation 对象（新增） */
  navigation?: NavigationScreenProp<any>
  
  /** 自定义标题 */
  title?: string | JSX.Element
  
  /** 自定义副标题 */
  subTitle?: string
  
  /** 是否展示搜索栏 */
  showSearchBar?: boolean
  
  /** 搜索栏未输入时提示文字 */
  searchPlaceholder?: string
  
  /** 是否展示搜索栏搜索 Icon */
  showSearchBarIcon?: boolean
  
  /** 搜索框 SearchBar 的 Props（新增） */
  searchBarProps?: SearchBarProps
  
  /** 搜索按钮文字 */
  searchButtonText?: string
  
  /** 自定义返回按钮 */
  backButton?: string | JSX.Element
  
  /** 自定义返回按钮 Icon 颜色 */
  backButtonColor?: string
  
  /** 自定义右侧按钮 */
  right?: string | JSX.Element
  
  /** 设置透明背景（新增） */
  transparentBackground?: boolean
  
  /** 自定义搜索按钮 */
  renderSearchBarButton?: () => JSX.Element
  
  /** 搜索按钮被点击 */
  onSearchButtonClick?: (text: string) => void
  
  /** 输入框文字改变 */
  onSearchTextChange?: (text: string) => void
  
  /** 返回按钮的点击回调 */
  onPressBackButton?: (data: GestureResponderEvent) => void
}

// Ref 接口（新增）
interface AdaptorNavigationBarRef {
  /** 展示搜索栏时，使 input 聚焦 */
  searchFocus: () => void
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| - | navigation | 新增，React Navigation 对象用于自动返回 |
| title | title | 保持一致 |
| subTitle | subTitle | 保持一致 |
| showSearchBar | showSearchBar | 保持一致 |
| searchPlaceholder | searchPlaceholder | 保持一致 |
| showSearchBarIcon | showSearchBarIcon | 保持一致 |
| - | searchBarProps | 新增，搜索框 SearchBar 的 Props |
| searchButtonText | searchButtonText | 保持一致 |
| backButton | backButton | 保持一致 |
| backButtonColor | backButtonColor | 保持一致 |
| right | right | 保持一致 |
| - | transparentBackground | 新增，设置透明背景 |
| renderSearchBarButton | renderSearchBarButton | 保持一致 |
| onSearchButtonClick | onSearchButtonClick | 保持一致 |
| onSearchTextChange | onSearchTextChange | 保持一致 |
| onPressBackButton | onPressBackButton | 保持一致 |

## 关键变更

### 1. 新增 navigation 属性
- **新版本**：支持传入 React Navigation 对象，用于自动处理返回逻辑
- **旧版本**：需要手动处理返回按钮逻辑
- 不传 navigation 时，需要通过 `onPressBackButton` 手动处理

### 2. 新增 searchBarProps 属性
- **新版本**：可以传入 SearchBar 组件的 Props，进行更灵活的搜索栏配置
- **旧版本**：搜索栏配置受限，仅支持基础属性

### 3. 新增 transparentBackground 属性
- **新版本**：支持透明背景，用于特殊场景如商品详情页
- **旧版本**：背景固定为白色

### 4. 新增 Ref 支持
- **新版本**：支持通过 ref 获取组件实例，可调用 `searchFocus()` 方法
- **旧版本**：无 ref 支持

### 5. 组件使用方式改变
- **旧版本**：直接导入使用，组件为函数组件
- **新版本**：使用 forwardRef 包装，支持 ref 转发

## 迁移示例

### 案例 1：基础导航栏

```tsx
// 迁移前
import { NavigationBar } from '@sgfe/flower-rn'

<NavigationBar title="标题" />

// 迁移后 - 无需改动
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar title="标题" />
```

### 案例 2：带返回按钮和右侧按钮

```tsx
// 迁移前
import { NavigationBar } from '@sgfe/flower-rn'

<NavigationBar
  title="标题"
  backButton="返回"
  right="完成"
  onPressBackButton={() => handleBack()}
/>

// 迁移后 - 无需改动
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar
  title="标题"
  backButton="返回"
  right="完成"
  onPressBackButton={() => handleBack()}
/>
```

### 案例 3：带搜索栏

```tsx
// 迁移前
import { NavigationBar } from '@sgfe/flower-rn'

<NavigationBar
  title="搜索"
  showSearchBar
  searchPlaceholder="输入关键词"
  onSearchButtonClick={(text) => handleSearch(text)}
/>

// 迁移后 - 无需改动
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar
  title="搜索"
  showSearchBar
  searchPlaceholder="输入关键词"
  onSearchButtonClick={(text) => handleSearch(text)}
/>
```

### 案例 4：使用 Navigation 对象自动处理返回

```tsx
// 迁移前 - 需要手动处理返回
import { NavigationBar } from '@sgfe/flower-rn'

<NavigationBar
  title="标题"
  backButton="返回"
  onPressBackButton={() => navigation.goBack()}
/>

// 迁移后 - 可以通过 navigation 属性自动处理
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar
  title="标题"
  backButton="返回"
  navigation={navigation}
/>
```

### 案例 5：搜索栏聚焦（新功能）

```tsx
// 迁移前 - 无法实现搜索栏自动聚焦
import { NavigationBar } from '@sgfe/flower-rn'

<NavigationBar
  showSearchBar
  searchPlaceholder="搜索..."
/>

// 迁移后 - 可以通过 ref 实现搜索栏聚焦
import { NavigationBar } from '@sfe/wand-rn'
import { useRef } from 'react'

const navBarRef = useRef<NavigationBarRef>(null)

const handleFocusSearch = () => {
  navBarRef.current?.searchFocus()
}

<NavigationBar
  ref={navBarRef}
  showSearchBar
  searchPlaceholder="搜索..."
/>
```

### 案例 6：透明背景（新功能）

```tsx
// 迁移前 - 无法实现透明背景
import { NavigationBar } from '@sgfe/flower-rn'

<NavigationBar title="标题" />

// 迁移后 - 可以设置透明背景
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar
  title="标题"
  transparentBackground
/>
```

### 案例 7：自定义搜索栏 Props（新功能）

```tsx
// 迁移前 - 搜索栏配置受限
import { NavigationBar } from '@sgfe/flower-rn'

<NavigationBar
  showSearchBar
  searchPlaceholder="搜索商品"
/>

// 迁移后 - 可以传入 SearchBar 组件的 Props 进行更灵活配置
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar
  showSearchBar
  searchPlaceholder="搜索商品"
  searchBarProps={{
    showCancelButton: true,
    onCancel: () => handleCancel()
  }}
/>
```

### 案例 8：自定义右侧按钮为组件

```tsx
// 迁移前
import { NavigationBar } from '@sgfe/flower-rn'

<NavigationBar
  title="商品详情"
  right={<Icon name="share" />}
/>

// 迁移后 - 无需改动
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar
  title="商品详情"
  right={<Icon name="share" />}
/>
```

### 案例 9：副标题

```tsx
// 迁移前
import { NavigationBar } from '@sgfe/flower-rn'

<NavigationBar
  title="店铺"
  subTitle="5.0 分，1.2K 条评价"
/>

// 迁移后 - 无需改动
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar
  title="店铺"
  subTitle="5.0 分，1.2K 条评价"
/>
```

### 案例 10：完整的导航栏示例

```tsx
// 迁移前
import { NavigationBar } from '@sgfe/flower-rn'

<NavigationBar
  title="搜索"
  showSearchBar
  searchPlaceholder="搜索商品"
  showSearchBarIcon
  searchButtonText="搜索"
  backButtonColor="#333"
  right={<Icon name="filter" />}
  onSearchButtonClick={(text) => handleSearch(text)}
  onSearchTextChange={(text) => handleTextChange(text)}
  onPressBackButton={() => navigation.goBack()}
/>

// 迁移后 - 可以使用更多功能
import { NavigationBar } from '@sfe/wand-rn'
import { useRef } from 'react'

const navBarRef = useRef(null)

<NavigationBar
  ref={navBarRef}
  navigation={navigation}
  title="搜索"
  showSearchBar
  searchPlaceholder="搜索商品"
  showSearchBarIcon
  searchButtonText="搜索"
  backButtonColor="#333"
  right={<Icon name="filter" />}
  onSearchButtonClick={(text) => handleSearch(text)}
  onSearchTextChange={(text) => handleTextChange(text)}
  searchBarProps={{
    showCancelButton: true
  }}
/>
```

### 案例 11：搜索栏聚焦 + 导航自动返回

```tsx
// 迁移后 - 新功能组合使用
import { NavigationBar } from '@sfe/wand-rn'
import { useRef, useEffect } from 'react'

const navBarRef = useRef(null)

useEffect(() => {
  // 页面加载时聚焦搜索栏
  navBarRef.current?.searchFocus()
}, [])

<NavigationBar
  ref={navBarRef}
  navigation={navigation}
  title="搜索商品"
  showSearchBar
  searchPlaceholder="输入商品名称"
  onSearchButtonClick={(text) => handleSearch(text)}
/>
```

### 案例 12：商品详情页透明导航栏

```tsx
// 迁移后 - 使用透明背景
import { NavigationBar } from '@sfe/wand-rn'

<ImageBackground source={{ uri: productImage }}>
  <NavigationBar
    navigation={navigation}
    title=""
    transparentBackground
    right={<Icon name="share" />}
  />
  {/* 商品详情内容 */}
</ImageBackground>
```

## 关键点

- **基本属性保持兼容**：所有原有属性都能直接使用，无需改动
- **新增 navigation 属性**：可选，用于自动处理返回逻辑，简化代码
- **新增 searchBarProps 属性**：可选，用于更灵活地配置搜索栏
- **新增 transparentBackground 属性**：可选，用于特殊场景如商品详情页
- **新增 ref 支持**：支持通过 ref 调用 `searchFocus()` 方法实现搜索栏聚焦
- **推荐迁移步骤**：
  1. 直接将导入改为 `@sfe/wand-rn`
  2. 如使用 navigation，可添加 `navigation` 属性简化代码
  3. 如需搜索栏聚焦，使用 ref 和 `searchFocus()` 方法
  4. 如需透明背景，添加 `transparentBackground` 属性
  5. 如需更灵活的搜索栏配置，使用 `searchBarProps` 属性
- **完全向后兼容**：旧代码无需改动即可直接使用新版本
