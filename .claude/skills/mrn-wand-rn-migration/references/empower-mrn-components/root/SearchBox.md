# SearchBox 搜索框

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn` (组件名为 `SearchBar`)

## 旧组件 API

```tsx
export interface SearchBoxProps extends TextInputProps {
    style?: StyleProp<ViewStyle>  // 容器样式
    
    inputStyle?: StyleProp<TextStyle>  // 输入框样式
    
    showSearchIcon?: boolean  // 是否显示搜索 Icon，默认 true
    
    searchIconSource?: ImageSourcePropType  // 自定义搜索 Icon
    searchIconStyle?: StyleProp<ImageStyle>  // 搜索 Icon 样式
    
    clearIconSource?: ImageSourcePropType  // 自定义清除 Icon
    clearIconStyle?: StyleProp<ImageStyle>  // 清除 Icon 样式
    
    searchOnClear?: boolean  // 清除时是否触发搜索，默认 false
    iconHitSlop?: number | Insets  // Icon 热区
    
    onClear?: () => any  // 清除按钮点击回调
    onSearch?: (text: string) => any  // 搜索回调
}

export class SearchBox extends PureComponent<SearchBoxProps> {
    focus(): void
    blur(): void
}
```

## 新组件 API

```tsx
export interface SearchBarProps {
    value?: string  // 输入框值
    placeholder?: string  // 占位符，默认 '请输入搜索信息'
    label?: string  // 自定义前缀文案（有文字标注则不展示搜索 Icon）
    showScanIcon?: boolean  // 是否展示扫描 Icon，默认 false
    noHorizontalMargin?: boolean  // 去除左右默认边距，默认 false
    returnKeyType?: TextInputProps['returnKeyType']  // 确定按钮显示内容
    allowEmptyText?: boolean  // 是否允许空文本
    
    onChange?: (text: string, event: NativeSyntheticEvent<TextInputChangeEventData>) => void  // 文本改变回调
    onSearch?: (text: string) => void  // 搜索回调
    onClear?: () => void  // 清除 Icon 点击回调
    onScan?: () => void  // 扫描 Icon 点击回调
    onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void  // 获得焦点回调
    onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void  // 失去焦点回调
    onEndEditing?: (event: NativeSyntheticEvent<TextInputEndEditingEventData>) => void  // 编辑结束回调
    onSubmitEditing?: (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void  // 提交编辑回调
}

export class SearchBar extends PureComponent<SearchBarProps> {
    focus(): void
    blur(): void
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| style | - | 容器样式已固定，通过 noHorizontalMargin 控制边距 |
| inputStyle | - | 输入框样式已固定 |
| showSearchIcon | label | 逻辑反转：通过 label 属性控制 |
| searchIconSource | - | 搜索 Icon 不可自定义 |
| searchIconStyle | - | 搜索 Icon 样式已固定 |
| clearIconSource | - | 清除 Icon 不可自定义 |
| clearIconStyle | - | 清除 Icon 样式已固定 |
| searchOnClear | - | 不再支持，但 onClear 时会自动搜索空字符串 |
| iconHitSlop | - | Icon 热区已固定 |
| placeholder | placeholder | 占位符文案 |
| onClear | onClear | 清除回调 |
| onSearch | onSearch | 搜索回调 |
| onChangeText | onChange | 文本改变回调，参数变更 |
| - | value | 输入框值（新增） |
| - | label | 自定义前缀文案（新增） |
| - | showScanIcon | 扫描 Icon 显示（新增） |
| - | noHorizontalMargin | 无水平边距（新增） |
| - | returnKeyType | 确定按钮类型（新增） |
| - | allowEmptyText | 允许空文本（新增） |
| - | onFocus | 获得焦点回调（新增） |
| - | onBlur | 失去焦点回调（新增） |
| - | onEndEditing | 编辑结束回调（新增） |
| - | onSubmitEditing | 提交编辑回调（新增） |

## 迁移示例

### 案例 1：基础搜索框

```tsx
// 迁移前
import { SearchBox } from '@mtfe/empower-mrn-components'

<SearchBox 
    placeholder='请输入搜索内容'
    onSearch={(text) => console.log('搜索:', text)}
/>

// 迁移后
import { View, StyleSheet } from '@mrn/react-native'
import { SearchBar } from '@sfe/wand-rn'

// ⚠️ SearchBar 内部最外层 View 设置了 flex:1，需要外层 wrapper 提供明确的高度约束，否则组件可能无法正常显示
<View style={styles.searchBoxWrap}>
    <SearchBar 
        placeholder='请输入搜索内容'
        onSearch={(text) => console.log('搜索:', text)}
    />
</View>

const styles = StyleSheet.create({
    searchBoxWrap: {
        height: 32,  // 必须给 wrapper 指定高度，为 SearchBar 内部的 flex:1 提供约束
    },
})
```

### 案例 2：隐藏搜索 Icon

```tsx
// 迁移前
<SearchBox 
    showSearchIcon={false}
/>

// 迁移后 - 使用 label 显示自定义前缀
<SearchBar 
    label='搜索'  // 有 label 时不显示 Icon
/>
```

### 案例 3：文本改变回调

```tsx
// 迁移前
<SearchBox 
    value={text}
    onChangeText={(text) => setText(text)}
/>

// 迁移后 - 参数和名称都变了
<SearchBar 
    value={text}
    onChange={(text, event) => setText(text)}
/>
```

### 案例 4：清除按钮回调

```tsx
// 迁移前
<SearchBox 
    value={text}
    onClear={() => {
        setText('')
        console.log('已清除')
    }}
/>

// 迁移后 - 新组件会自动清空并搜索，onClear 后不需手动处理
<SearchBar 
    value={text}
    onChange={(text) => setText(text)}
    onClear={() => {
        console.log('已清除')
        // setText('') 会自动被调用并触发 onSearch('')
    }}
/>
```

### 案例 5：显示扫描 Icon

```tsx
// 迁移前 - 不支持扫描 Icon

// 迁移后 - 新增扫描 Icon
<SearchBar 
    showScanIcon
    onScan={() => console.log('扫描')}
/>
```

### 案例 6：自定义前缀文案

```tsx
// 迁移前 - 需要自定义 Icon

// 迁移后 - 使用 label 属性
<SearchBar 
    label='商品'
    placeholder='请搜索'
/>

// 多个搜索框
<SearchBar label='商品' placeholder='请搜索商品' />
<SearchBar label='库位' placeholder='请搜索库位' />
```

### 案例 7：清除时自动搜索

```tsx
// 迁移前
<SearchBox 
    searchOnClear
    onSearch={(text) => handleSearch(text)}
/>

// 迁移后 - 新组件 onClear 时会自动调用 onSearch('')
<SearchBar 
    onSearch={(text) => handleSearch(text)}
    onClear={() => {
        // 已清除，onSearch('') 会自动被调用
        console.log('已清除')
    }}
/>
```

### 案例 8：获取和失去焦点

```tsx
// 迁移前 - 不支持焦点回调

// 迁移后 - 新增焦点回调
<SearchBar 
    onFocus={() => console.log('获得焦点')}
    onBlur={() => console.log('失去焦点')}
/>
```

### 案例 9：无左右边距

```tsx
// 迁移前 - 需要自定义 style

// 迁移后 - 使用 noHorizontalMargin
<SearchBar 
    noHorizontalMargin
/>
```

### 案例 10：自定义确定按钮

```tsx
// 迁移前 - 默认是搜索按钮

// 迁移后 - 可以自定义确定按钮
<SearchBar 
    returnKeyType='done'  // 或 'go', 'next', 'send'
    onSearch={(text) => handleSearch(text)}
/>
```

### 案例 11：搜索流程完整示例

```tsx
// 迁移前
import { SearchBox } from '@mtfe/empower-mrn-components'

const [searchText, setSearchText] = useState('')

<SearchBox 
    value={searchText}
    placeholder='搜索商品'
    showSearchIcon
    onChangeText={(text) => setSearchText(text)}
    onSearch={(text) => {
        console.log('搜索:', text)
        handleSearch(text)
    }}
    onClear={() => {
        setSearchText('')
        console.log('已清除')
    }}
/>

// 迁移后
import { SearchBar } from '@sfe/wand-rn'

const [searchText, setSearchText] = useState('')

<SearchBar 
    value={searchText}
    placeholder='搜索商品'
    onChange={(text) => setSearchText(text)}
    onSearch={(text) => {
        console.log('搜索:', text)
        handleSearch(text)
    }}
    onClear={() => {
        console.log('已清除')
        // setSearchText('') 会自动被调用
    }}
/>
```

### 案例 12：焦点控制

```tsx
// 迁移前（类组件）
searchRef: SearchBox

// 迁移前（函数式组件）
const searchRef = useRef<SearchBox>(null)
<SearchBox ref={searchRef} />

// 迁移后（用法相同）
const searchRef = useRef<SearchBar>(null)

<SearchBar ref={searchRef} />
<Button onPress={() => searchRef.current?.focus()}>聚焦</Button>
<Button onPress={() => searchRef.current?.blur()}>失焦</Button>
```

### 案例 13：多种回调组合

```tsx
// 迁移前 - 回调有限

// 迁移后 - 回调更丰富
<SearchBar 
    onChange={(text) => handleTextChange(text)}
    onFocus={() => handleFocus()}
    onBlur={() => handleBlur()}
    onSearch={(text) => handleSearch(text)}
    onClear={() => handleClear()}
    onScan={() => handleScan()}
/>
```

### 案例 14：允许空文本

```tsx
// 迁移前 - 默认行为

// 迁移后 - 新增选项
<SearchBar 
    allowEmptyText  // 允许空文本，否则会trim
    onChange={(text) => setText(text)}
/>
```

### 案例 15：完整场景 - 页面搜索

```tsx
// 迁移前
import { SearchBox } from '@mtfe/empower-mrn-components'
import { Toast } from '@mtfe/empower-mrn-components'

const [searchText, setSearchText] = useState('')
const [isLoading, setIsLoading] = useState(false)

<SearchBox 
    value={searchText}
    placeholder='搜索商品'
    onChangeText={(text) => setSearchText(text)}
    onSearch={(text) => {
        setIsLoading(true)
        searchProducts(text).then(data => {
            updateList(data)
            setIsLoading(false)
        }).catch(err => {
            Toast.error('搜索失败')
            setIsLoading(false)
        })
    }}
    onClear={() => {
        setSearchText('')
        clearList()
    }}
/>

// 迁移后
import { SearchBar, Toast } from '@sfe/wand-rn'

const [searchText, setSearchText] = useState('')
const [isLoading, setIsLoading] = useState(false)

<SearchBar 
    value={searchText}
    placeholder='搜索商品'
    onChange={(text) => setSearchText(text)}
    onSearch={(text) => {
        if (!text.trim()) {
            Toast.warning('请输入搜索内容')
            return
        }
        setIsLoading(true)
        searchProducts(text).then(data => {
            updateList(data)
            setIsLoading(false)
        }).catch(err => {
            Toast.error('搜索失败')
            setIsLoading(false)
        })
    }}
    onClear={() => {
        clearList()
    }}
/>
```

## 关键点

### 组件名称变化

- **SearchBox → SearchBar**：组件重命名
- 来自不同的库，需要更新导入

### Icon 定制移除

- **Icon 不可自定义**：无法修改搜索和清除 Icon
- **Icon 样式已固定**：无法调整 Icon 的样式
- **新增扫描 Icon**：内置扫描功能

### 样式固定

- **容器样式固定**：通过 `noHorizontalMargin` 控制边距
- **输入框样式固定**：使用主题系统，不支持自定义
- **Icon 热区固定**：预设为 8px

### 前缀文案

- **label 属性**：使用 label 替代自定义 Icon
- **有 label 时不显示搜索 Icon**：自动隐藏 Icon
- **适用于多搜索字段**：如"商品搜索"、"库位搜索"等

### 清除行为

- **新组件改进**：清除时会自动调用 onSearch('')
- **不需要 searchOnClear**：自动处理清除后的搜索
- **onClear 仅用于通知**：不需要手动更新状态

### 回调函数变化

- **onChangeText → onChange**：参数从字符串改为 (text, event)
- **参数扩展**：提供更多上下文信息
- **新增多个回调**：焦点、编辑结束等

### 焦点管理

- **focus() / blur() 保持不变**：可继续使用 ref 控制焦点
- **新增焦点回调**：onFocus / onBlur 可用于追踪状态

## 迁移策略

### 第一步：更新导入和组件名

```tsx
// 旧
import { SearchBox } from '@mtfe/empower-mrn-components'

// 新
import { SearchBar } from '@sfe/wand-rn'
```

### 第二步：更新回调函数名

```tsx
// 旧
onChangeText={(text) => setText(text)}

// 新
onChange={(text) => setText(text)}
```

### 第三步：移除不支持的属性

- 删除 `showSearchIcon`（如需隐藏，使用 `label`）
- 删除所有 Icon 相关属性（searchIconSource、clearIconSource 等）
- 删除 `inputStyle`、`style`（样式已固定）
- 删除 `searchOnClear`（新组件自动处理）

### 第四步：使用新属性

```tsx
// 如需自定义前缀
<SearchBar label='商品' />

// 如需显示扫描 Icon
<SearchBar showScanIcon />

// 如需去除边距
<SearchBar noHorizontalMargin />
```

### 第五步：调整清除逻辑

```tsx
// 旧 - 需要在 onClear 中清空状态
onClear={() => {
    setText('')
    handleClear()
}}

// 新 - 状态自动清空，只需处理业务逻辑
onClear={() => {
    handleClear()
}}
```

## 常见迁移问题

### Q: 如何隐藏搜索 Icon？

A: 使用 `label` 属性，有 label 时 Icon 会自动隐藏：

```tsx
<SearchBar label='搜索' />  // 显示文字而不是 Icon
```

### Q: 如何自定义搜索和清除 Icon？

A: 新组件不支持自定义 Icon，Icon 已预设且不可修改。如需完全自定义，建议：

1. 使用内置的 Icon（固定但通常满足需求）
2. 或创建自定义搜索组件

### Q: onChangeText 如何改为 onChange？

A: 参数格式改变：

```tsx
// 旧
onChangeText={(text) => setText(text)}

// 新
onChange={(text, event) => setText(text)}

// 如果不需要 event，可以简化为
onChange={(text) => setText(text)}
```

### Q: 清除时如何自动搜索？

A: 新组件会自动处理：

```tsx
<SearchBar 
    onClear={() => {
        // onSearch('') 会自动被调用
        console.log('已清除')
    }}
/>
```

### Q: 如何处理焦点管理？

A: 使用 ref 或焦点回调：

```tsx
// 方式1：使用 ref
const searchRef = useRef()
searchRef.current?.focus()

// 方式2：使用回调
onFocus={() => console.log('获得焦点')}
```

### Q: 是否支持自定义样式？

A: 不支持。样式已完全预设。如需定制外观，建议：

1. 使用 `noHorizontalMargin` 控制边距
2. 通过 `label` 自定义前缀
3. 通过主题系统（如果支持）进行全局调整

### Q: 新的 allowEmptyText 是什么作用？

A: 控制是否允许空文本：

```tsx
<SearchBar 
    allowEmptyText  // true：允许空字符串
/>

// 默认为 false，会自动 trim 输入的文本
```

### Q: 如何实现搜索历史等功能？

A: 通过回调函数实现：

```tsx
<SearchBar 
    onChange={(text) => handleInputChange(text)}
    onSearch={(text) => {
        handleSearch(text)
        addToHistory(text)  // 添加到历史
    }}
/>
```

### Q: onBlur 和 onEndEditing 有什么区别？

A: 两者的区别如下：

- **onBlur**：文本框失去焦点时调用。`注意：从 nativeEvent 中获取文本值，可能会得到 undefined`
- **onEndEditing**：当文本输入结束后调用（如按确认或输入完成）。如需获取输入框的最后一个值，建议使用 `onEndEditing` 而不是 `onBlur`

```tsx
// 如需获取最终输入值，推荐使用 onEndEditing
<SearchBar 
    onBlur={() => console.log('失去焦点')}
    onEndEditing={(event) => {
        const text = event.nativeEvent.text
        console.log('最终输入值:', text)  // 可以获取到值
    }}
/>
```

## 注意事项

1. **组件名变化**：SearchBox → SearchBar

2. **Icon 不可自定义**：无法修改搜索和清除 Icon，但新增扫描 Icon

3. **样式固定**：容器和输入框样式均已预设，不支持自定义

4. **外层 wrapper 必须指定高度**：`SearchBar` 内部最外层 `View` 设置了 `flex: 1`，必须用外层 `View` 包裹并设置 `height`（通常为 `32`）来提供高度约束，否则组件可能无法正常显示：

```tsx
<View style={{ height: 32 }}>
    <SearchBar ... />
</View>
```

4. **回调参数变更**：onChangeText → onChange，参数格式改变

5. **清除行为改进**：不需要 searchOnClear，新组件自动处理

6. **焦点控制**：focus() / blur() 方法保持不变

7. **前缀文案**：使用 label 替代 showSearchIcon

8. **主题系统**：使用 WithTheme 管理样式，支持主题切换

9. **外层 wrapper 高度**：`SearchBar` 内部最外层 `View` 设置了 `flex: 1`，必须用外层 `View` 包裹并指定 `height`（通常为 `32`）来提供高度约束

## 迁移检查清单

- [ ] 更新导入语句（SearchBox → SearchBar）
- [ ] 更新 `onChangeText` 为 `onChange`
- [ ] 移除 `showSearchIcon`（如需隐藏，使用 `label`）
- [ ] 移除所有 Icon 相关属性
- [ ] 移除 `inputStyle` 和 `style`
- [ ] 移除 `searchOnClear`
- [ ] 调整清除逻辑（不需要手动清空状态）
- [ ] 用 `View` 包裹 `SearchBar` 并设置 `height: 32`（SearchBar 内部最外层 View 为 flex:1，需外层约束高度）
- [ ] 考虑添加 `showScanIcon`（如需要）
- [ ] 考虑添加 `label`（如需自定义前缀）
- [ ] 考虑添加 `noHorizontalMargin`（如需）
- [ ] 验证搜索功能正常
- [ ] 验证清除功能正常
- [ ] 验证焦点管理正常
- [ ] 测试不同的回调组合
- [ ] 测试 ref 控制焦点

## 与 wand-rn SearchBar 的功能对比

| 功能 | 旧 SearchBox | 新 SearchBar | 说明 |
|------|------------|-----------|------|
| 基础搜索 | ✓ | ✓ | 都支持 |
| 自定义 Icon | ✓ | ✗ | 旧支持，新不支持 |
| 清除功能 | ✓ | ✓ | 都支持，新增自动搜索 |
| 焦点回调 | ✗ | ✓ | 新增 onFocus / onBlur |
| 编辑回调 | ✓ | ✓ | 新增 onEndEditing |
| 扫描 Icon | ✗ | ✓ | 新增 showScanIcon |
| 自定义前缀 | ✗ | ✓ | 新增 label 属性 |
| 无边距选项 | ✗ | ✓ | 新增 noHorizontalMargin |
| 确定按钮定制 | ✗ | ✓ | 新增 returnKeyType |
| 空文本控制 | ✗ | ✓ | 新增 allowEmptyText |
| 样式定制 | ✓ | ✗ | 旧支持，新样式固定 |
| Ref 焦点管理 | ✓ | ✓ | 都支持 |
