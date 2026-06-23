# NavigationBar 导航栏

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface IconTextProps {
    style?: StyleProp<ViewStyle>
    layout?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    gap?: number
    text?: string
    textStyle?: StyleProp<TextStyle>

    // 支持 MTD Icon
    type?: AllIcons
    size?: number
    tintColor?: string
    source?: ImageSourcePropType
    imageStyle?: StyleProp<ImageStyle>

    disabled?: boolean

    onPress?: () => void
}
export type NavigationBarItem = IconTextProps | ReactNode
export type NavigationBarItems = NavigationBarItem | NavigationBarItem[]

export interface NavigationBarProps {
    reverse?: boolean  // 是否反转（深色主题），默认 false
    
    navigation?: NavigationScreenProp<any>  // react-navigation 对象
    statusBar?: StatusBarProps  // 自定义状态栏
    
    title?: ReactNode  // 标题（字符串或 JSX）
    titleStyle?: StyleProp<TextStyle>  // 标题样式
    
    showBack?: boolean  // 是否显示返回按钮，默认 true
    backItem?: NavigationBarItem  // 自定义返回按钮
    leftItems?: NavigationBarItems  // 左侧项目
    rightItems?: NavigationBarItems  // 右侧项目
    
    style?: StyleProp<ViewStyle>  // 容器样式
    
    actionAreaWidth?: number  // 操作区域宽度，默认 30
    leftAreaWidth?: number  // 左侧区域宽度
    rightAreaWidth?: number  // 右侧区域宽度
    
    onBackPress?: () => void  // 返回按钮点击回调
}

export class NavigationBar extends PureComponent<NavigationBarProps> {
    // 已废弃，建议使用 shuguopai/components/navigation 替代
}
```

## 新组件 API

```tsx
export interface AdaptorNavigationBarProps {
    navigation?: NavigationScreenProp<any>  // react-navigation 对象
    
    /** 自定义标题 */
    title?: string | JSX.Element
    
    /** 自定义副标题 */
    subTitle?: string
    
    /** 是否展示搜索栏 */
    showSearchBar?: boolean  // 默认 false
    
    /** 搜索栏未输入时提示文字 */
    searchPlaceholder?: string  // 默认 '请输入搜索内容'
    
    /** 是否展示搜索栏搜索 Icon */
    showSearchBarIcon?: boolean  // 默认 false
    
    /** 搜索框 SearchBar 的 props */
    searchBarProps?: SearchBarProps
    
    /** 搜索按钮文字 */
    searchButtonText?: string  // 默认 '搜索'
    
    /** 自定义返回按钮 */
    backButton?: string | JSX.Element
    
    /** 自定义返回按钮 Icon 颜色 */
    backButtonColor?: string
    
    /** 自定义右侧按钮 */
    right?: string | JSX.Element
    
    /** 设置透明背景 */
    transparentBackground?: boolean  // 默认 false
    
    /** 自定义搜索按钮 */
    renderSearchBarButton?: () => JSX.Element
    
    /** 搜索按钮被点击 */
    onSearchButtonClick?: (text: string) => void
    
    /** 输入框文字改变 */
    onSearchTextChange?: (text: string) => void
    
    /** 返回按钮的点击回调 */
    onPressBackButton?: (data: GestureResponderEvent) => void
}

export interface AdaptorNavigationBarRef {
    searchFocus: () => void  // 搜索框聚焦方法
}

export const NavigationBar: React.FC<AdaptorNavigationBarProps>
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| title | title | 标题，用法一致 |
| titleStyle | - | 标题样式已固定，无法自定义 |
| showBack | - | 总是显示返回按钮（无法关闭） |
| backItem | backButton | 自定义返回按钮 |
| leftItems | - | 左侧项目不再支持 |
| rightItems | right | 右侧项目，仅支持单个按钮 |
| style | - | 导航栏样式已固定 |
| actionAreaWidth | - | 操作区域宽度已固定 |
| leftAreaWidth | - | 左侧区域宽度已固定 |
| rightAreaWidth | - | 右侧区域宽度已固定 |
| onBackPress | onPressBackButton | 返回按钮点击回调 |
| reverse | - | 深色主题不再支持 |
| navigation | navigation | react-navigation 对象 |
| statusBar | - | 状态栏配置已内置 |
| - | subTitle | 副标题（新增） |
| - | showSearchBar | 搜索栏支持（新增） |
| - | searchPlaceholder | 搜索框占位符（新增） |
| - | showSearchBarIcon | 搜索栏 Icon 显示（新增） |
| - | searchBarProps | SearchBar 组件配置（新增） |
| - | searchButtonText | 搜索按钮文字（新增） |
| - | backButtonColor | 返回按钮颜色（新增） |
| - | transparentBackground | 透明背景（新增） |
| - | renderSearchBarButton | 自定义搜索按钮（新增） |
| - | onSearchButtonClick | 搜索按钮点击回调（新增） |
| - | onSearchTextChange | 搜索文本改变回调（新增） |

## 迁移示例

### 案例 1：基础导航栏

```tsx
// 迁移前
import { NavigationBar } from '@mtfe/empower-mrn-components'

<NavigationBar 
    navigation={navigation}
    title='页面标题'
    onBackPress={() => navigation.goBack()}
/>

// 迁移后
import { NavigationBar } from '@sfe/wand-rn'

<NavigationBar 
    navigation={navigation}
    title='页面标题'
    onPressBackButton={() => navigation.goBack()}
/>
```

### 案例 2：自定义标题

```tsx
// 迁移前
<NavigationBar 
    navigation={navigation}
    title='购物车'
    titleStyle={{ fontSize: 16, color: '#000' }}
/>

// 迁移后 - 标题样式已固定
<NavigationBar 
    navigation={navigation}
    title='购物车'
/>

// 如需自定义标题，使用 JSX.Element
<NavigationBar 
    navigation={navigation}
    title={
        <View>
            <Text style={{ fontSize: 16 }}>购物车</Text>
        </View>
    }
/>
```

### 案例 3：添加副标题

```tsx
// 迁移前 - 无副标题支持，需要自定义标题

// 迁移后 - 内置副标题支持
<NavigationBar 
    navigation={navigation}
    title='购物车'
    subTitle='9.9 购物狂欢'
/>
```

### 案例 4：自定义返回按钮

```tsx
// 迁移前
import { IconText } from '@mtfe/empower-mrn-components'

<NavigationBar 
    navigation={navigation}
    title='页面'
    backItem={{
        source: require('./back.png'),
        onPress: () => navigation.goBack()
    }}
/>

// 迁移后
import { Button } from '@sfe/wand-rn'

<NavigationBar 
    navigation={navigation}
    title='页面'
    backButton={
        <Button 
            type='text'
            onPress={() => navigation.goBack()}
        >
            返回
        </Button>
    }
/>
```

### 案例 5：自定义返回按钮颜色

```tsx
// 迁移前 - 需要使用 backItem

// 迁移后 - 直接设置颜色
<NavigationBar 
    navigation={navigation}
    title='页面'
    backButtonColor='#FF0000'
    onPressBackButton={() => navigation.goBack()}
/>
```

### 案例 6：右侧按钮

```tsx
// 迁移前
import { IconText } from '@mtfe/empower-mrn-components'

<NavigationBar 
    navigation={navigation}
    title='购物车'
    rightItems={[
        {
            source: require('./edit.png'),
            onPress: () => handleEdit()
        }
    ]}
/>

// 迁移后 - 仅支持单个右侧项
import { Button } from '@sfe/wand-rn'

<NavigationBar 
    navigation={navigation}
    title='购物车'
    right={
        <Button 
            type='text'
            onPress={() => handleEdit()}
        >
            编辑
        </Button>
    }
/>
```

### 案例 7：透明背景

```tsx
// 迁移前 - 需要自定义样式或 reverse

// 迁移后 - 内置透明背景选项
<NavigationBar 
    navigation={navigation}
    title='页面'
    transparentBackground
/>
```

### 案例 8：基础搜索栏

```tsx
// 迁移前 - 无搜索栏支持

// 迁移后 - 内置搜索栏
<NavigationBar 
    navigation={navigation}
    showSearchBar
    showSearchBarIcon
    onSearchButtonClick={(text) => handleSearch(text)}
/>
```

### 案例 9：自定义搜索栏

```tsx
// 迁移前 - 无搜索栏

// 迁移后 - 自定义搜索栏配置
<NavigationBar 
    navigation={navigation}
    showSearchBar
    showSearchBarIcon
    searchPlaceholder='请输入商品名称'
    searchButtonText='搜索'
    onSearchButtonClick={(text) => handleSearch(text)}
    onSearchTextChange={(text) => handleTextChange(text)}
/>
```

### 案例 10：使用 SearchBar 组件

```tsx
// 迁移前 - 无搜索栏

// 迁移后 - 使用 SearchBar 组件处理搜索
const [searchText, setSearchText] = useState('')

<NavigationBar 
    navigation={navigation}
    showSearchBar
    searchBarProps={{
        placeholder: '搜索',
        value: searchText,
        onChange: (value) => setSearchText(value),
        onClear: () => setSearchText('')
    }}
    onSearchButtonClick={(text) => handleSearch(text)}
/>
```

### 案例 11：自定义搜索按钮

```tsx
// 迁移前 - 无搜索栏

// 迁移后 - 自定义搜索按钮
import { Button, Icon } from '@sfe/wand-rn'

<NavigationBar 
    navigation={navigation}
    showSearchBar
    renderSearchBarButton={() => (
        <Button 
            type='primary'
            size='sm'
            icon={<Icon type='search' />}
            onPress={() => handleSearch()}
        >
            查找
        </Button>
    )}
/>
```

### 案例 12：搜索框聚焦

```tsx
// 迁移前 - 无搜索栏

// 迁移后 - 使用 ref 控制搜索框聚焦
import { useRef } from 'react'

const navRef = useRef()

<View>
    <NavigationBar 
        ref={navRef}
        navigation={navigation}
        showSearchBar
    />
    <Button onPress={() => navRef.current?.searchFocus()}>
        聚焦搜索框
    </Button>
</View>
```

### 案例 13：完整导航栏示例

```tsx
// 迁移前
import { NavigationBar } from '@mtfe/empower-mrn-components'

<NavigationBar 
    navigation={navigation}
    title='商品详情'
    showBack
    backItem={{
        source: require('./back.png'),
        onPress: () => navigation.goBack()
    }}
    rightItems={[
        {
            source: require('./share.png'),
            onPress: () => handleShare()
        }
    ]}
    onBackPress={() => navigation.goBack()}
/>

// 迁移后
import { NavigationBar, Button, Icon } from '@sfe/wand-rn'

<NavigationBar 
    navigation={navigation}
    title='商品详情'
    backButtonColor='#000'
    right={
        <Button 
            type='text'
            icon={<Icon type='share' />}
            onPress={() => handleShare()}
        />
    }
    onPressBackButton={() => navigation.goBack()}
/>
```

### 案例 14：搜索导航栏示例

```tsx
// 迁移前 - 无搜索功能

// 迁移后 - 完整搜索导航栏
const [searchText, setSearchText] = useState('')
const navRef = useRef()

<NavigationBar 
    ref={navRef}
    navigation={navigation}
    title='订单'
    subTitle='全部订单'
    showSearchBar
    showSearchBarIcon
    searchPlaceholder='请输入订单号'
    searchButtonText='查询'
    searchBarProps={{
        placeholder: '请输入订单号',
        value: searchText,
        onChange: (value) => setSearchText(value),
        onClear: () => setSearchText('')
    }}
    onSearchButtonClick={(text) => handleOrderSearch(text)}
    onSearchTextChange={(text) => setSearchText(text)}
    onPressBackButton={() => navigation.goBack()}
/>
```

### 案例 15：左侧多按钮迁移方案

```tsx
// 迁移前 - 支持左侧多个项
import { NavigationBar, IconText } from '@mtfe/empower-mrn-components'

<NavigationBar 
    navigation={navigation}
    title='页面'
    leftItems={[
        { source: require('./icon1.png'), onPress: () => {} },
        { source: require('./icon2.png'), onPress: () => {} }
    ]}
/>

// 迁移后 - 新组件不支持左侧多按钮
// 方案1：使用自定义标题前置按钮
<View style={{ flexDirection: 'row' }}>
    <Button type='text' onPress={() => {}}>
        <Icon type='icon1' />
    </Button>
    <Button type='text' onPress={() => {}}>
        <Icon type='icon2' />
    </Button>
</View>

// 方案2：简化为仅返回按钮
<NavigationBar 
    navigation={navigation}
    title='页面'
    // 默认返回按钮已包含
/>
```

## 关键点

### 架构变化

- **旧组件**：基于类组件，支持灵活配置左右项目
- **新组件**：基于函数组件和 Adaptor 模式，提供简化和标准化的接口
- **删除复杂性**：移除了 `leftItems`、多个右侧项目等复杂配置
- **增加功能**：内置搜索栏、副标题等常用功能

### 布局简化

- **旧组件**：支持自定义左右区域宽度和多个项目
- **新组件**：标准布局，仅支持返回按钮 + 标题 + 右侧单个按钮
- **结果**：更一致的 UI，但灵活性降低

### 搜索栏新增

新组件内置搜索栏支持，包括：
- 基础搜索栏（简单输入框）
- SearchBar 组件集成（高级搜索）
- 自定义搜索按钮
- 搜索框聚焦控制

### 样式固定

- 标题样式已固定，无法通过 `titleStyle` 自定义
- 导航栏高度和基础样式已固定
- 可通过 `transparentBackground` 修改背景透明度
- 返回按钮和右侧按钮必须是 JSX.Element

### 状态栏配置

- 旧组件：支持 `statusBar` 自定义配置
- 新组件：状态栏配置已内置，无法修改
- 自动处理平台差异（Android 6.0 以下不支持修改）

### 深色主题

- 旧组件：通过 `reverse` 属性支持深色主题
- 新组件：深色主题不再支持，使用 `transparentBackground` 代替

## 迁移策略

### 第一步：更新导入和组件名

```tsx
// 旧
import { NavigationBar } from '@mtfe/empower-mrn-components'

// 新
import { NavigationBar } from '@sfe/wand-rn'
```

### 第二步：更新基本属性

```tsx
// 旧
<NavigationBar 
    navigation={navigation}
    title='标题'
    onBackPress={handleBack}
/>

// 新
<NavigationBar 
    navigation={navigation}
    title='标题'
    onPressBackButton={handleBack}
/>
```

### 第三步：处理返回按钮

如果有自定义返回按钮：

```tsx
// 旧
<NavigationBar 
    backItem={{
        source: require('./back.png'),
        onPress: () => {}
    }}
/>

// 新
<NavigationBar 
    backButton={<CustomButton />}
    backButtonColor='#000'
/>
```

### 第四步：处理右侧按钮

如果有右侧项目，改为单个右侧按钮：

```tsx
// 旧 - 多个右侧项
<NavigationBar 
    rightItems={[
        { source: require('./icon1.png'), onPress: () => {} },
        { source: require('./icon2.png'), onPress: () => {} }
    ]}
/>

// 新 - 仅支持单个右侧项
<NavigationBar 
    right={
        <Button type='text' onPress={() => {}}>
            操作
        </Button>
    }
/>
```

### 第五步：删除不支持的属性

- 删除 `reverse`（深色主题）
- 删除 `leftItems`（左侧多项目）
- 删除 `actionAreaWidth`、`leftAreaWidth`、`rightAreaWidth`
- 删除 `titleStyle`（标题样式固定）
- 删除 `statusBar`（状态栏配置内置）

### 第六步：添加新功能（可选）

```tsx
// 可选：添加副标题
<NavigationBar 
    title='订单'
    subTitle='待配送'
/>

// 可选：添加搜索栏
<NavigationBar 
    showSearchBar
    showSearchBarIcon
    onSearchButtonClick={(text) => handleSearch(text)}
/>

// 可选：透明背景
<NavigationBar 
    transparentBackground
/>
```

## 常见迁移问题

### Q: 如何处理左侧多个按钮？

A: 新组件不支持左侧多项目。有以下方案：

1. **简化为仅返回按钮**：大多数场景下只需要返回按钮
2. **使用自定义标题**：通过自定义标题 JSX 实现
3. **单独创建 View**：在导航栏上方创建额外的按钮行

### Q: 如何实现深色主题？

A: 旧的 `reverse` 属性不再支持。使用 `transparentBackground` 替代：

```tsx
<NavigationBar 
    title='页面'
    transparentBackground  // 透明背景
/>
```

### Q: 如何自定义标题样式？

A: 标题样式已固定。如需自定义，使用 JSX.Element：

```tsx
<NavigationBar 
    title={
        <View>
            <Text style={{ fontSize: 20, color: '#FF0000' }}>
                自定义标题
            </Text>
        </View>
    }
/>
```

### Q: 搜索栏如何与后端联动？

A: 使用 `onSearchButtonClick` 或 `onSearchTextChange` 回调：

```tsx
<NavigationBar 
    showSearchBar
    onSearchButtonClick={(text) => {
        // 调用后端 API
        searchAPI(text)
    }}
    onSearchTextChange={(text) => {
        // 实时搜索或筛选
        filterData(text)
    }}
/>
```

### Q: 如何让搜索框自动聚焦？

A: 使用 ref 和 `searchFocus` 方法：

```tsx
const navRef = useRef()

useEffect(() => {
    navRef.current?.searchFocus()
}, [])

<NavigationBar ref={navRef} showSearchBar />
```

### Q: 如何处理返回事件？

A: 使用 `onPressBackButton` 回调：

```tsx
<NavigationBar 
    onPressBackButton={() => {
        // 可以做一些清理工作
        console.log('用户点击返回')
        navigation.goBack()
    }}
/>
```

### Q: 右侧按钮可以有多个吗？

A: 不支持。新组件仅支持单个右侧按钮。如需多个，建议：

1. 简化操作流程，使用菜单按钮
2. 在页面其他区域放置额外按钮
3. 使用底部操作栏

### Q: 将 rightItems 改为 right 后，类型报错说 object 不兼容怎么办？

A: 这是迁移时最常见的类型问题。旧 `rightItems` 接受 `IconTextProps` 对象（如 `{ source, onPress, type, text }`），而新 `right` 只接受 `string | JSX.Element`，直接改属性名会导致类型不匹配，需要同时把对象值转换为 JSX：

```tsx
// ❌ 错误：仅改属性名，值仍是 object，类型不兼容
<NavigationBar
    right={{
        source: require('./edit.png'),
        onPress: () => handleEdit()
    }}
/>

// ✅ 正确：将 IconTextProps 对象转换为 JSX.Element
import { Button, Icon } from '@sfe/wand-rn'

// 场景一：原来是图片图标按钮
<NavigationBar
    right={
        <Button type='text' onPress={() => handleEdit()}>
            <Image source={require('./edit.png')} style={{ width: 20, height: 20 }} />
        </Button>
    }
/>

// 场景二：原来是 MTD 内置图标
<NavigationBar
    right={
        <Button type='text' onPress={() => handleEdit()}>
            <Icon type='edit' />
        </Button>
    }
/>

// 场景三：原来有文字和图标
<NavigationBar
    right={
        <Button type='text' icon={<Icon type='edit' />} onPress={() => handleEdit()}>
            编辑
        </Button>
    }
/>
```

**转换规则对照**：

| 旧 IconTextProps 字段 | 新写法 |
|---|---|
| `type` (MTD 图标名) | `<Icon type={type} />` |
| `source` (图片资源) | `<Image source={source} />` |
| `text` | Button 的 `children` |
| `tintColor` | `<Icon color={tintColor} />` |
| `onPress` | Button 的 `onPress` |
| `disabled` | Button 的 `disabled` |

同理，`backItem` 也存在相同问题，迁移到 `backButton` 时也需要将 `IconTextProps` 对象转换为 JSX。

### Q: 搜索栏可以自定义输入框样式吗？

A: 基础搜索栏样式固定，但可以使用 `searchBarProps` 传入自定义 SearchBar 配置。

## 注意事项

1. **左侧项目删除**：新组件仅支持返回按钮（无法关闭），不支持 `leftItems` 多项目

2. **右侧项目简化**：仅支持单个右侧项，不支持多个按钮

3. **样式固定**：导航栏样式、高度、标题样式都已固定，不支持自定义

4. **搜索栏集成**：新组件内置搜索栏，无需额外集成

5. **深色主题移除**：`reverse` 属性已移除，使用 `transparentBackground` 替代

6. **状态栏自动处理**：新组件会自动处理状态栏，无需手动配置

7. **返回按钮始终显示**：返回按钮始终显示在左侧，无法隐藏

8. **React-Navigation 集成**：仍然支持 `navigation` 属性，用于自动返回

## 迁移检查清单

- [ ] 更新导入语句（NavigationBar）
- [ ] 更新 `onBackPress` 为 `onPressBackButton`
- [ ] 移除 `reverse` 属性（使用 `transparentBackground`）
- [ ] 移除 `titleStyle` 属性
- [ ] 移除 `leftItems`、`actionAreaWidth` 等宽度配置
- [ ] 检查是否有多个右侧按钮（改为单个）
- [ ] 检查 `rightItems` / `backItem` 的值是否为 `IconTextProps` 对象，若是则需转换为 JSX.Element（不能直接传 object 给 `right` / `backButton`）
- [ ] 移除 `statusBar` 配置
- [ ] 移除自定义返回按钮（改为 `backButton`）
- [ ] 检查是否需要添加搜索栏
- [ ] 检查是否需要添加副标题
- [ ] 验证返回按钮功能正常
- [ ] 验证右侧按钮显示正常
- [ ] 验证搜索栏功能正常（如果使用）
- [ ] 测试在不同屏幕上的显示
- [ ] 测试导航和返回流程

## 与 wand-rn NavigationBar 的功能对比

| 功能 | 旧 NavigationBar | 新 NavigationBar | 说明 |
|------|------------------|------------------|------|
| 标题显示 | ✓ | ✓ | 都支持 |
| 副标题 | ✗ | ✓ | 新增 |
| 返回按钮 | ✓ | ✓ | 都支持，新组件始终显示 |
| 自定义返回按钮 | ✓ | ✓ | 都支持 |
| 左侧多按钮 | ✓ | ✗ | 旧支持，新不支持 |
| 右侧单按钮 | ✓ | ✓ | 都支持 |
| 右侧多按钮 | ✓ | ✗ | 旧支持，新不支持 |
| 搜索栏 | ✗ | ✓ | 新增 |
| SearchBar 集成 | ✗ | ✓ | 新增 |
| 深色主题 | ✓ | ✗ | 旧支持，新不支持 |
| 透明背景 | ✗ | ✓ | 新增 |
| 状态栏自定义 | ✓ | ✗ | 旧支持，新自动处理 |
| 自定义样式 | ✓ | ✗ | 旧支持，新样式固定 |
| Ref 支持 | ✗ | ✓ | 新增（用于搜索框聚焦） |
