# Input 输入框

## 从何处迁移
- **源库**: `@roo/roo-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface InputProps
  extends Omit<TextInputProps, 'onChange' | 'onChangeText'>,
  WithThemeStyles<InputStyles> {
  /** 对齐方式 'left' | 'center' | 'right' */
  textAlign?: 'left' | 'center' | 'right' | 'auto'  // 默认 'left'
  /** 校验是否合格 */
  validated?: boolean  // 默认 true
  /** 是否显示剩余文字数量，且需要设置 maxLength 与 multiline=true 时生效，配合 style: height 使用 */
  showRestCount?: boolean  // 默认 false
  /** 自定义显示剩余文字数量样式，且需要设置 showRestCount 时生效 */
  renderRest?: (
    maxLength: number,
    wordCount: number,
    restCount: number,
    styles: TextStyle
  ) => JSX.Element
  /** 延迟执行时间 */
  debounce?: number  // 默认 0
  /** 延迟执行callback */
  debounceCallback?: (value: string) => void
  /** 合并了官方的 onChangeText 和 onChange 方法 */
  onChange?: (
    text: string,
    e?: NativeSyntheticEvent<TextInputChangeEventData>
  ) => void
  /** 自定义包裹 Input 组件最外层的 View 样式 */
  style?: StyleProp<ViewStyle>
  /** 自定义 Android 删除 Icon 的大小 */
  delIconSize?: number  // 默认 17
  /** 自定义清空按钮 Icon */
  renderClearIcon?: JSX.Element
  /** 输入框类型 */
  inputType?: 'search' | 'normal'  // 默认 'normal'
  /** 自定义前置 Icon */
  renderPreIcon?: JSX.Element
  /** 右侧扩展项配置（仅在 inputType='search' 时生效） */
  rightExtension?: {
    text?: string
    render?: () => JSX.Element
    onPress?: () => void
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    touchable?: boolean
    visible?: boolean
  }
  // 以下继承自 TextInputProps
  editable?: boolean  // 默认 true
  autoFocus?: boolean  // 默认 false
  placeholder?: string  // 默认 ''
  autoCorrect?: boolean  // 默认 true
  keyboardType?: KeyboardTypeOptions  // 默认 'default'
  maxLength?: number
  clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always'  // 默认 'while-editing'
  multiline?: boolean
  value?: string
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
}
```

## 新组件 API

```tsx
interface ShowCountProps {
  formatter: (args: {
    count: number
    value: string
    maxLength?: number
  }) => string | React.ReactElement
}

export interface InputProps {
  value?: string | number
  /** 对齐方式 'left' | 'center' | 'right' */
  textAlign?: 'left' | 'center' | 'right' | 'auto'  // 默认 'left'
  /** 是否显示剩余文字数量，且需要设置 maxLength 与 type=textarea 时生效 */
  showRestCount?: boolean | ShowCountProps  // 默认 false
  /** 是否启用清除图标，点击清除图标后会清空输入框 */
  clearable?: boolean
  /** 输入框类型 */
  type?: 'input' | 'textarea'  // 默认 'input'
  /** 是否禁用 */
  disabled?: boolean  // 默认 false
  maxLength?: number
  /** 是否自动聚焦 */
  autoFocus?: boolean  // 默认 false
  placeholder?: string  // 默认 ''
  /** 拼写自动修正 */
  autoCorrect?: TextInputProps['autoCorrect']  // 默认 true
  /** 键盘类型 */
  keyboardType?: TextInputProps['keyboardType']  // 默认 'default'
  returnKeyType?: TextInputProps['returnKeyType']
  autoCapitalize?: TextInputProps['autoCapitalize']
  blurOnSubmit?: TextInputProps['blurOnSubmit']
  /** 多行输入框的高度 */
  textareaHeight?: number
  defaultValue?: string | number
  onKeyPress?: TextInputProps['onKeyPress']
  onSubmitEditing?: TextInputProps['onSubmitEditing']
  /** 合并了官方的 onChangeText 和 onChange 方法 */
  onChange?: (
    text: string,
    e?: NativeSyntheticEvent<TextInputChangeEventData>
  ) => void
  onFocus?: TextInputProps['onFocus']
  onBlur?: TextInputProps['onBlur']
  onEndEditing?: TextInputProps['onEndEditing']
  /** 延迟执行时间 */
  debounceWait?: number
  /** 延迟执行callback */
  debounceCallback?: (value: string) => void
  /** 自定义包裹 Input 组件最外层的 View 样式 */
  containerStyle?: StyleProp<ViewStyle>
  /** 自定义 TextInput 样式 */
  style?: StyleProp<ViewStyle>
  /**
   * @deprecated 即将废弃。校验是否报错
   */
  error?: boolean  // 默认 false
  /**
   * @deprecated 即将废弃，请使用 textareaHeight 代替
   */
  textInputMultilineHeight?: number
  /**
   * @deprecated 即将废弃，请用 debounceWait 代替
   */
  debounce?: number
  /**
   * @deprecated 即将废弃
   */
  onlyShowClearWhenFocus?: boolean  // 默认 true
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| textAlign | textAlign | 保持一致 |
| validated | error | 语义反转：旧 validated=false 对应新 error=true |
| showRestCount | showRestCount | 新版支持 boolean 或 ShowCountProps 对象（含 formatter 函数） |
| renderRest | showRestCount.formatter | 使用 ShowCountProps 的 formatter 替代 renderRest |
| debounce | debounceWait | 属性重命名（debounce 仍可用但已废弃） |
| debounceCallback | debounceCallback | 保持一致 |
| onChange | onChange | 保持一致，签名相同 |
| style | containerStyle | 外层 View 样式从 style 改为 containerStyle |
| - | style | 新版 style 作用于 TextInput 本身而非外层 View |
| delIconSize | - | 移除，清除图标固定 16px |
| renderClearIcon | - | 移除，使用内置清除图标 |
| clearButtonMode | clearable | 从枚举模式改为布尔开关 |
| inputType | - | 移除，不再内置 search 类型输入框 |
| renderPreIcon | - | 移除，不再内置前置图标 |
| rightExtension | - | 移除，不再内置右侧扩展项 |
| editable | disabled | 反转：旧 editable=false 对应新 disabled=true |
| multiline | type | 旧 multiline=true 对应新 type='textarea' |
| value (string) | value | 新版支持 string \| number |
| - | defaultValue | 新增，支持 string \| number |
| - | textareaHeight | 新增，多行输入框高度 |
| - | returnKeyType | 新增 |
| - | autoCapitalize | 新增 |
| - | blurOnSubmit | 新增 |
| - | onKeyPress | 新增 |
| - | onSubmitEditing | 新增 |
| - | onEndEditing | 新增 |
| onFocus | onFocus | 保持一致 |
| onBlur | onBlur | 保持一致 |
| maxLength | maxLength | 保持一致 |
| autoFocus | autoFocus | 保持一致 |
| placeholder | placeholder | 保持一致 |
| autoCorrect | autoCorrect | 保持一致 |
| keyboardType | keyboardType | 保持一致 |

## 迁移示例

### 案例 1：基础输入框

```tsx
// 迁移前
import { Input } from '@roo/roo-rn'

<Input
  value={text}
  onChange={(val) => setText(val)}
  placeholder="请输入"
/>

// 迁移后
import { Input } from '@sfe/wand-rn'

<Input
  value={text}
  onChange={(val) => setText(val)}
  placeholder="请输入"
/>
```

### 案例 2：禁用状态

```tsx
// 迁移前 - 使用 editable
import { Input } from '@roo/roo-rn'

<Input
  value={text}
  editable={false}
  onChange={(val) => setText(val)}
/>

// 迁移后 - 使用 disabled
import { Input } from '@sfe/wand-rn'

<Input
  value={text}
  disabled={true}
  onChange={(val) => setText(val)}
/>
```

### 案例 3：校验状态

```tsx
// 迁移前 - 使用 validated
import { Input } from '@roo/roo-rn'

<Input
  value={text}
  validated={false}
  onChange={(val) => setText(val)}
/>

// 迁移后 - 使用 error（语义反转）
import { Input } from '@sfe/wand-rn'

<Input
  value={text}
  error={true}
  onChange={(val) => setText(val)}
/>
```

### 案例 4：多行输入框

```tsx
// 迁移前 - 使用 multiline
import { Input } from '@roo/roo-rn'

<Input
  value={text}
  multiline={true}
  style={{ height: 100 }}
  onChange={(val) => setText(val)}
/>

// 迁移后 - 使用 type='textarea'
import { Input } from '@sfe/wand-rn'

<Input
  value={text}
  type="textarea"
  textareaHeight={100}
  onChange={(val) => setText(val)}
/>
```

### 案例 5：清除按钮

```tsx
// 迁移前 - 使用 clearButtonMode
import { Input } from '@roo/roo-rn'

<Input
  value={text}
  clearButtonMode="while-editing"
  onChange={(val) => setText(val)}
/>

// 迁移后 - 使用 clearable
import { Input } from '@sfe/wand-rn'

<Input
  value={text}
  clearable={true}
  onChange={(val) => setText(val)}
/>
```

### 案例 6：自定义清除图标

```tsx
// 迁移前 - 支持自定义清除图标
import { Input } from '@roo/roo-rn'

<Input
  value={text}
  clearButtonMode="while-editing"
  renderClearIcon={<Icon type="close" size={14} />}
  delIconSize={14}
  onChange={(val) => setText(val)}
/>

// 迁移后 - 移除自定义清除图标，使用内置图标
import { Input } from '@sfe/wand-rn'

<Input
  value={text}
  clearable={true}
  onChange={(val) => setText(val)}
/>
```

### 案例 7：剩余字数显示

```tsx
// 迁移前 - 使用 showRestCount + multiline
import { Input } from '@roo/roo-rn'

<Input
  value={text}
  multiline={true}
  maxLength={200}
  showRestCount={true}
  style={{ height: 100 }}
  onChange={(val) => setText(val)}
/>

// 迁移后 - 使用 showRestCount + type='textarea'
import { Input } from '@sfe/wand-rn'

<Input
  value={text}
  type="textarea"
  maxLength={200}
  showRestCount={true}
  textareaHeight={100}
  onChange={(val) => setText(val)}
/>
```

### 案例 8：自定义剩余字数渲染

```tsx
// 迁移前 - 使用 renderRest
import { Input } from '@roo/roo-rn'

<Input
  value={text}
  multiline={true}
  maxLength={200}
  showRestCount={true}
  renderRest={(maxLength, wordCount, restCount, styles) => (
    <Text style={styles}>{wordCount}/{maxLength}</Text>
  )}
  style={{ height: 100 }}
  onChange={(val) => setText(val)}
/>

// 迁移后 - 使用 ShowCountProps.formatter
import { Input } from '@sfe/wand-rn'

<Input
  value={text}
  type="textarea"
  maxLength={200}
  showRestCount={{
    formatter: ({ count, value, maxLength }) => `${count}/${maxLength}`
  }}
  textareaHeight={100}
  onChange={(val) => setText(val)}
/>
```

### 案例 9：防抖回调

```tsx
// 迁移前
import { Input } from '@roo/roo-rn'

<Input
  value={text}
  debounce={300}
  debounceCallback={(val) => search(val)}
  onChange={(val) => setText(val)}
/>

// 迁移后 - debounce 重命名为 debounceWait
import { Input } from '@sfe/wand-rn'

<Input
  value={text}
  debounceWait={300}
  debounceCallback={(val) => search(val)}
  onChange={(val) => setText(val)}
/>
```

### 案例 10：搜索输入框

```tsx
// 迁移前 - 内置 search 类型
import { Input } from '@roo/roo-rn'

<Input
  inputType="search"
  value={text}
  placeholder="搜索"
  clearButtonMode="while-editing"
  onChange={(val) => setText(val)}
/>

// 迁移后 - 需手动组合搜索布局（新组件无内置 search 类型）
import { Input, Icon } from '@sfe/wand-rn'

<View style={{
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F5F6FA',
  borderRadius: 16,
  padding: 4,
}}>
  <Icon type="search" size={16} color="#999" style={{ marginHorizontal: 2 }} />
  <Input
    value={text}
    placeholder="搜索"
    clearable={true}
    onChange={(val) => setText(val)}
  />
</View>
```

### 案例 11：搜索输入框带右侧扩展

```tsx
// 迁移前 - 使用 rightExtension
import { Input } from '@roo/roo-rn'

<Input
  inputType="search"
  value={text}
  placeholder="搜索"
  rightExtension={{
    text: '取消',
    visible: true,
    touchable: true,
    onPress: () => handleCancel(),
  }}
  onChange={(val) => setText(val)}
/>

// 迁移后 - 手动组合布局
import { Input, Icon } from '@sfe/wand-rn'

<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <View style={{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 16,
    padding: 5,
    marginRight: 8,
  }}>
    <Icon type="search" size={16} color="#999" style={{ marginHorizontal: 2 }} />
    <Input
      value={text}
      placeholder="搜索"
      clearable={true}
      onChange={(val) => setText(val)}
    />
  </View>
  <TouchableOpacity onPress={() => handleCancel()}>
    <Text style={{ fontSize: 14, color: '#222222' }}>取消</Text>
  </TouchableOpacity>
</View>
```

### 案例 12：自定义前置图标

```tsx
// 迁移前 - 使用 renderPreIcon
import { Input, Icon } from '@roo/roo-rn'

<Input
  inputType="search"
  renderPreIcon={<Icon type="location" size={16} />}
  value={text}
  onChange={(val) => setText(val)}
/>

// 迁移后 - 手动在外部放置图标
import { Input, Icon } from '@sfe/wand-rn'

<View style={{
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F5F6FA',
  borderRadius: 16,
  padding: 4,
}}>
  <Icon type="location" size={16} style={{ marginHorizontal: 2 }} />
  <Input
    value={text}
    clearable={true}
    onChange={(val) => setText(val)}
  />
</View>
```

### 案例 13：外层样式

```tsx
// 迁移前 - style 作用于外层 View
import { Input } from '@roo/roo-rn'

<Input
  value={text}
  style={{ marginHorizontal: 16, backgroundColor: '#F5F5F5' }}
  onChange={(val) => setText(val)}
/>

// 迁移后 - 使用 containerStyle 作用于外层 View，style 作用于 TextInput
import { Input } from '@sfe/wand-rn'

<Input
  value={text}
  containerStyle={{ marginHorizontal: 16 }}
  style={{ backgroundColor: '#F5F5F5' }}
  onChange={(val) => setText(val)}
/>
```

### 案例 14：完整复杂场景

```tsx
// 迁移前
import { Input } from '@roo/roo-rn'

<Input
  value={text}
  multiline={true}
  maxLength={500}
  showRestCount={true}
  validated={isValid}
  editable={!isSubmitting}
  clearButtonMode="while-editing"
  debounce={300}
  debounceCallback={(val) => autoSave(val)}
  textAlign="left"
  style={{ height: 150, margin: 16 }}
  renderRest={(maxLength, wordCount, restCount, styles) => (
    <Text style={styles}>{wordCount}/{maxLength}</Text>
  )}
  onChange={(val) => setText(val)}
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
/>

// 迁移后
import { Input } from '@sfe/wand-rn'

<Input
  value={text}
  type="textarea"
  maxLength={500}
  showRestCount={{
    formatter: ({ count, maxLength }) => `${count}/${maxLength}`
  }}
  error={!isValid}
  disabled={isSubmitting}
  clearable={true}
  debounceWait={300}
  debounceCallback={(val) => autoSave(val)}
  textAlign="left"
  textareaHeight={150}
  containerStyle={{ margin: 16 }}
  onChange={(val) => setText(val)}
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
/>
```

### 案例 15：ref 操作

```tsx
// 迁移前
import { Input } from '@roo/roo-rn'

const inputRef = useRef<Input>(null)

<Input
  ref={inputRef}
  value={text}
  onChange={(val) => setText(val)}
/>

// 调用 ref 方法
inputRef.current.textInputRef.focus()
inputRef.current.textInputRef.blur()
inputRef.current.textInputRef.clear()

// 迁移后 - 新组件暴露 focus/blur/clear 方法
import { Input } from '@sfe/wand-rn'

const inputRef = useRef<Input>(null)

<Input
  ref={inputRef}
  value={text}
  onChange={(val) => setText(val)}
/>

// 调用 ref 方法
inputRef.current.focus()
inputRef.current.blur()
inputRef.current.clear()
```

## 关键点

### 1. 组件架构变化
- 旧版本继承 `Omit<TextInputProps, 'onChange' | 'onChangeText'>`，暴露所有 RN TextInput 属性
- 新版本不继承 TextInputProps，仅显式声明需要的属性
- 内部都基于 Class Component 实现

### 2. 输入框类型变更
- 旧版本：通过 `inputType` 区分搜索和普通输入框，通过 `multiline` 区分多行
- 新版本：通过 `type` 区分 'input' 和 'textarea'，移除搜索类型
- 搜索场景需自行组合外部布局

### 3. 禁用方式变更
- 旧版本：使用 RN 原生 `editable` 属性（editable=false 表示禁用）
- 新版本：使用语义化 `disabled` 属性（disabled=true 表示禁用）

### 4. 校验状态变更
- 旧版本：`validated=true` 表示通过，`validated=false` 表示不通过
- 新版本：`error=true` 表示有错误（语义反转）
- 注意：新版本 `error` 属性已标记为 @deprecated

### 5. 清除按钮变更
- 旧版本：使用 `clearButtonMode` 枚举控制清除按钮显示时机，支持 `renderClearIcon` 和 `delIconSize` 自定义
- 新版本：使用 `clearable` 布尔值启用清除，图标固定为内置图标
- 移除所有清除图标自定义能力

### 6. style 属性语义变更
- 旧版本：`style` 作用于外层包裹 View
- 新版本：`style` 作用于内部 TextInput，`containerStyle` 作用于外层 View
- **重要**：迁移时需将旧 `style` 拆分到 `containerStyle`（布局样式）和 `style`（文本样式）

### 7. 剩余字数计数增强
- 旧版本：`showRestCount` 仅为 boolean，自定义需用 `renderRest` 回调
- 新版本：`showRestCount` 支持 boolean 或 `ShowCountProps` 对象，formatter 提供 count/value/maxLength
- renderRest 回调参数更规范化

### 8. 搜索输入框移除
- 旧版本内置 `inputType='search'` 模式：自动添加搜索图标、圆角背景、右侧扩展项
- 新版本完全移除搜索模式，需外部自行组合实现
- `renderPreIcon`、`rightExtension` 配置均被移除

### 9. 防抖属性重命名
- 旧版本：`debounce`（单位 ms）
- 新版本：`debounceWait`（`debounce` 仍可用但已 @deprecated）

### 10. value 类型扩展
- 旧版本：`value` 仅支持 `string`
- 新版本：`value` 支持 `string | number`，内部自动 toString 转换
- 新增 `defaultValue` 属性，同样支持 `string | number`

## 注意事项

1. **style 拆分**：旧版 `style` 需根据用途拆分为 `containerStyle`（外层布局）和 `style`（输入框样式）
2. **validated 反转**：`validated={false}` 必须改为 `error={true}`，注意语义是反的
3. **editable 反转**：`editable={false}` 必须改为 `disabled={true}`
4. **multiline 改 type**：`multiline={true}` 改为 `type="textarea"`，不要同时传 multiline
5. **搜索场景重构**：使用 `inputType="search"` 的场景需要重写为外部包裹 View + Icon + Input 的组合
6. **rightExtension 重构**：右侧扩展项需手动使用 TouchableOpacity/Text 实现
7. **renderClearIcon 移除**：自定义清除图标不再支持，统一使用内置图标
8. **renderRest 改 formatter**：自定义字数显示需改用 ShowCountProps.formatter，参数不同
9. **TextInputProps 不再继承**：旧版透传的 RN TextInputProps 属性在新版中需确认是否有对应属性
10. **debounce 重命名**：使用 `debounceWait` 替代 `debounce`

## 迁移检查清单

- [ ] 将 `import { Input } from '@roo/roo-rn'` 改为 `import { Input } from '@sfe/wand-rn'`
- [ ] 将 `validated={false}` 改为 `error={true}`（语义反转）
- [ ] 将 `editable={false}` 改为 `disabled={true}`（语义反转）
- [ ] 将 `multiline={true}` 改为 `type="textarea"`
- [ ] 将 `clearButtonMode` 改为 `clearable={true}`
- [ ] 将 `debounce` 改为 `debounceWait`
- [ ] 将旧 `style` 按用途拆分为 `containerStyle` 和 `style`
- [ ] 移除 `inputType="search"` 并重建搜索布局
- [ ] 移除 `renderPreIcon` 并在外部手动添加图标
- [ ] 移除 `rightExtension` 并在外部手动实现扩展项
- [ ] 移除 `renderClearIcon` 和 `delIconSize`
- [ ] 将 `renderRest` 改为 `showRestCount={{ formatter: ... }}`
- [ ] 检查 multiline 高度设置，改用 `textareaHeight`
- [ ] 检查 ref 调用方式，使用组件直接暴露的 focus/blur/clear 方法
- [ ] 验证透传的 TextInputProps 属性在新版中是否可用
- [ ] 测试清除按钮、字数统计、禁用状态等交互场景
