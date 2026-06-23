# SearchBar 搜索框

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface SearchBarProps {
    /** 输入框的值 */
    value?: string
    /** 占位符文案 */
    placeholder?: string
    /** 是否展示扫描 Icon，默认 false */
    showScanIcon?: boolean
    /** 自定义前缀文案 */
    label?: string
    /** 自动获得焦点，默认 false */
    autoFocus?: boolean
    /** 内容变化回调 */
    onChange?: (text: string, event: NativeSyntheticEvent<TextInputChangeEventData>) => void
    /** 按下软键盘确定时的回调 */
    onSearch?: (text: string) => void
    /** 点击清除图标时的回调 */
    onClear?: () => void
    /** 点击扫描图标时的回调 */
    onScan?: () => void
    /** 获取焦点回调 */
    onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void
    /** 失去焦点回调 */
    onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void
    /** 软键盘确定被按下的回调 */
    onSubmitEditing?: (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void
}
```

## 新组件 API

```tsx
interface SearchBarProps {
    /** 输入框的值 */
    value?: string
    /** 占位符文案 */
    placeholder?: string
    /** 是否展示扫描 Icon，默认 false */
    showScanIcon?: boolean
    /** 自定义前缀文案 */
    label?: string
    /** 去除 SearchBar 组件左右默认边距，默认 false */
    noHorizontalMargin?: boolean
    /** 决定"确定"按钮显示的内容 */
    returnKeyType?: TextInputProps['returnKeyType']
    /** 内容变化回调 */
    onChange?: (text: string, event: NativeSyntheticEvent<TextInputChangeEventData>) => void
    /** 按下软键盘确定时的回调 */
    onSearch?: (text: string) => void
    /** 点击清除图标时的回调 */
    onClear?: () => void
    /** 点击扫描图标时的回调 */
    onScan?: () => void
    /** 获取焦点回调 */
    onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void
    /** 失去焦点回调 */
    onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void
    /** 文本输入结束后的回调 */
    onEndEditing?: (event: NativeSyntheticEvent<TextInputEndEditingEventData>) => void
    /** 软键盘确定被按下的回调 */
    onSubmitEditing?: (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void
    /** 是否允许输入空文本，默认 false */
    allowEmptyText?: boolean
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| `value` | `value` | 保持不变 |
| `placeholder` | `placeholder` | 保持不变 |
| `showScanIcon` | `showScanIcon` | 保持不变 |
| `label` | `label` | 保持不变 |
| `autoFocus` | 移除 | 不再支持 |
| `onChange` | `onChange` | 保持不变 |
| `onSearch` | `onSearch` | 保持不变 |
| `onClear` | `onClear` | 保持不变 |
| `onScan` | `onScan` | 保持不变 |
| `onFocus` | `onFocus` | 保持不变 |
| `onBlur` | `onBlur` | 保持不变 |
| `onSubmitEditing` | `onSubmitEditing` | 保持不变 |
| N/A | `noHorizontalMargin` | 新增 |
| N/A | `returnKeyType` | 新增 |
| N/A | `onEndEditing` | 新增 |
| N/A | `allowEmptyText` | 新增 |

## 关键变更

### 1. Icon 类型更新

新库更新了内部使用的 Icon 类型，虽然外部 API 无需修改，但如果自定义了图标，需要使用新的 Icon 类型：

- 搜索图标：`search-o` → `search`
- 清除图标：`error` → `clean`
- 扫描图标：图片形式 → `scan-code` Icon

### 2. PressOpacity 改为 Press.Opacity

新库使用了统一的 Press 组件 API（Press.Opacity 而不是独立的 PressOpacity），这是内部实现改进，不影响外部 API。

### 3. 删除 autoFocus 属性

新库不再支持 `autoFocus` 属性。如果需要自动获得焦点，需要通过 ref 手动调用 `.focus()` 方法：

```tsx
// 迁移前
<SearchBar autoFocus />

// 迁移后
const searchBarRef = useRef<SearchBar>(null)
useEffect(() => {
    searchBarRef.current?.focus()
}, [])
<SearchBar ref={searchBarRef} />
```

### 4. 新增 Props

#### 4.1 noHorizontalMargin
去除 SearchBar 组件左右默认边距，用于需要全宽展示的场景：

```tsx
// 默认有边距
<SearchBar />

// 去除边距
<SearchBar noHorizontalMargin />
```

#### 4.2 returnKeyType
控制软键盘上"确定"按钮显示的内容，支持的值：`'done'` | `'go'` | `'next'` | `'search'` | `'send'`

#### 4.3 onEndEditing
当文本输入结束后调用此回调函数。与 `onBlur` 的区别是 `onEndEditing` 能更准确地获取最终的输入值。

#### 4.4 allowEmptyText
允许输入空文本。默认为 false，会 trim() 输入值。设为 true 时会保留原始输入：

```tsx
// 默认行为：trim() 输入
<SearchBar onChange={(text) => console.log(text)} />  // 输入"  test  "会输出"test"

// 保留原始输入
<SearchBar allowEmptyText onChange={(text) => console.log(text)} />  // 输入"  test  "会输出"  test  "
```

### 5. Placeholder 处理改进

新库在清除输入时，会重置 placeholder 状态，以解决某些 Android 版本上 placeholder 换行的问题。这个改进对用户透明，无需修改代码。

### 6. hitSlop 增强

新库为各个图标按钮增加了 `hitSlop` 属性，使触摸区域更大，提升可用性。这是内部实现改进。

## 迁移示例

### 案例 1：基础使用

```tsx
// 迁移前
import { SearchBar } from '@sgfe/flower-rn'

<SearchBar />

// 迁移后
import { SearchBar } from '@sfe/wand-rn'

<SearchBar />
```

### 案例 2：自定义 placeholder

```tsx
// 迁移前
import { SearchBar } from '@sgfe/flower-rn'

<SearchBar placeholder="搜索商品" />

// 迁移后
import { SearchBar } from '@sfe/wand-rn'

<SearchBar placeholder="搜索商品" />
```

### 案例 3：受控输入框

```tsx
// 迁移前
import { SearchBar } from '@sgfe/flower-rn'

const [value, setValue] = useState('')

<SearchBar 
    value={value}
    onChange={(text) => setValue(text)}
/>

// 迁移后
import { SearchBar } from '@sfe/wand-rn'

const [value, setValue] = useState('')

<SearchBar 
    value={value}
    onChange={(text) => setValue(text)}
/>
```

### 案例 4：显示扫描图标

```tsx
// 迁移前
import { SearchBar } from '@sgfe/flower-rn'

<SearchBar 
    showScanIcon 
    onScan={() => console.log('扫描')}
/>

// 迁移后
import { SearchBar } from '@sfe/wand-rn'

<SearchBar 
    showScanIcon 
    onScan={() => console.log('扫描')}
/>
```

### 案例 5：自定义前缀文案

```tsx
// 迁移前
import { SearchBar } from '@sgfe/flower-rn'

<SearchBar label="商品" placeholder="请搜索" />

// 迁移后
import { SearchBar } from '@sfe/wand-rn'

<SearchBar label="商品" placeholder="请搜索" />
```

### 案例 6：处理搜索和清除事件

```tsx
// 迁移前
import { SearchBar } from '@sgfe/flower-rn'

const [value, setValue] = useState('')

<SearchBar
    value={value}
    onChange={(text) => setValue(text)}
    onSearch={(text) => console.log('搜索:', text)}
    onClear={() => {
        setValue('')
        console.log('清除')
    }}
/>

// 迁移后
import { SearchBar } from '@sfe/wand-rn'

const [value, setValue] = useState('')

<SearchBar
    value={value}
    onChange={(text) => setValue(text)}
    onSearch={(text) => console.log('搜索:', text)}
    onClear={() => {
        setValue('')
        console.log('清除')
    }}
/>
```

### 案例 7：autoFocus 迁移

```tsx
// 迁移前
import { SearchBar } from '@sgfe/flower-rn'

<SearchBar autoFocus />

// 迁移后（需要使用 ref）
import { SearchBar } from '@sfe/wand-rn'
import { useEffect, useRef } from 'react'

const searchBarRef = useRef(null)

useEffect(() => {
    searchBarRef.current?.focus()
}, [])

<SearchBar ref={searchBarRef} />
```

### 案例 8：使用 noHorizontalMargin

```tsx
// 迁移前（没有此选项）
import { SearchBar } from '@sgfe/flower-rn'

<SearchBar />  // 默认有边距

// 迁移后（新增选项）
import { SearchBar } from '@sfe/wand-rn'

// 默认有边距
<SearchBar />

// 去除边距，用于全宽场景
<SearchBar noHorizontalMargin />
```

### 案例 9：使用 returnKeyType

```tsx
// 迁移前（无此选项）
import { SearchBar } from '@sgfe/flower-rn'

<SearchBar />

// 迁移后
import { SearchBar } from '@sfe/wand-rn'

<SearchBar returnKeyType="search" />
```

### 案例 10：使用 onEndEditing

```tsx
// 迁移前（无此选项）
import { SearchBar } from '@sgfe/flower-rn'

<SearchBar 
    onBlur={() => {
        // onBlur 可能无法准确获取最终值
    }}
/>

// 迁移后
import { SearchBar } from '@sfe/wand-rn'

<SearchBar 
    onEndEditing={(event) => {
        const finalText = event.nativeEvent.text
        console.log('最终输入值:', finalText)
    }}
/>
```

### 案例 11：使用 allowEmptyText

```tsx
// 迁移前（默认会 trim）
import { SearchBar } from '@sgfe/flower-rn'

<SearchBar 
    onChange={(text) => console.log(text)}
/>  // 输入"  test  "输出"test"

// 迁移后
import { SearchBar } from '@sfe/wand-rn'

// 默认仍然 trim
<SearchBar 
    onChange={(text) => console.log(text)}
/>  // 输入"  test  "输出"test"

// 保留原始输入
<SearchBar 
    allowEmptyText
    onChange={(text) => console.log(text)}
/>  // 输入"  test  "输出"  test  "
```

### 案例 12：完整示例

```tsx
// 迁移前
import { SearchBar } from '@sgfe/flower-rn'

const [searchValue, setSearchValue] = useState('')

<SearchBar
    value={searchValue}
    placeholder="搜索商品"
    showScanIcon
    onChange={(text) => setSearchValue(text)}
    onSearch={(text) => console.log('搜索:', text)}
    onClear={() => setSearchValue('')}
    onScan={() => console.log('打开扫描')}
    onFocus={() => console.log('获得焦点')}
    onBlur={() => console.log('失去焦点')}
/>

// 迁移后（完全相同）
import { SearchBar } from '@sfe/wand-rn'

const [searchValue, setSearchValue] = useState('')

<SearchBar
    value={searchValue}
    placeholder="搜索商品"
    showScanIcon
    onChange={(text) => setSearchValue(text)}
    onSearch={(text) => console.log('搜索:', text)}
    onClear={() => setSearchValue('')}
    onScan={() => console.log('打开扫描')}
    onFocus={() => console.log('获得焦点')}
    onBlur={() => console.log('失去焦点')}
    returnKeyType="search"  // 可选，新增
    noHorizontalMargin={false}  // 可选，新增
/>
```

## 关键点

- ✅ **核心 API 保持兼容**：`value`、`placeholder`、`showScanIcon`、`label`、回调函数等均保持不变
- ❌ **autoFocus 被移除**：需要使用 ref 手动调用 `.focus()` 方法
- ✅ **Icon 类型内部更新**：无需修改外部代码
- ✅ **新增功能**：`noHorizontalMargin`、`returnKeyType`、`onEndEditing`、`allowEmptyText` 提供更多控制
- ✅ **内部实现改进**：hitSlop 增强、Placeholder 处理改进、WithTheme 集成
- 🔄 **迁移难度**：**极低** - 大多数代码无需修改，仅需处理 `autoFocus` 的迁移

## 迁移步骤

1. **更新导入路径**：`@sgfe/flower-rn` → `@sfe/wand-rn`
2. **移除 autoFocus 属性**（如果有使用）：
   - 改为使用 ref 手动调用 `.focus()`
3. **评估新增功能**（可选）：
   - `noHorizontalMargin`：根据设计需求决定是否使用
   - `returnKeyType`：如需自定义软键盘按钮，可以使用
   - `onEndEditing`：替代 `onBlur` 以获取更准确的最终输入值
   - `allowEmptyText`：如需保留空格等空白字符，设为 `true`
4. **测试验证**：确保搜索框功能符合预期

## 补充说明

### 关于 onBlur vs onEndEditing
- `onBlur`：在文本框失去焦点时调用，但从 nativeEvent 中获取的文本值可能会是 undefined
- `onEndEditing`：在文本输入结束时调用，能准确获取最终的输入值，推荐使用

### 关于 allowEmptyText
- 默认为 `false`：所有输入都会 trim()，用于搜索等不需要空白的场景
- 设为 `true`：保留原始输入，包括前后空白字符，用于特殊的输入场景
