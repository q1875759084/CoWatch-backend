# Input 输入框

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface InputProps {
  // 值和默认值
  value?: string | number
  defaultValue?: string | number
  
  // 输入框类型和状态
  type?: 'input' | 'textarea'  // 默认 'input'
  disabled?: boolean  // 默认 false
  error?: boolean  // 默认 false，校验报错样式
  
  // 对齐方式
  textAlign?: 'left' | 'center' | 'right' | 'auto'  // 默认 'left'
  
  // 字符数统计
  maxLength?: number
  showRestCount?: boolean | ShowCountProps  // 默认 false
  
  // 清除功能
  clearable?: boolean  // 默认 false
  onlyShowClearWhenFocus?: boolean  // 默认 true，是否只在聚焦时显示清除按钮
  
  // 焦点和占位符
  autoFocus?: boolean  // 默认 false
  placeholder?: string
  
  // 键盘相关
  autoCorrect?: TextInputProps['autoCorrect']  // 默认 true
  keyboardType?: TextInputProps['keyboardType']  // 默认 'default'
  returnKeyType?: TextInputProps['returnKeyType']
  autoCapitalize?: TextInputProps['autoCapitalize']
  
  // 多行文本
  textInputMultilineHeight?: number  // 多行时input高度
  
  // 事件回调
  onChange?: (text: string, e?: NativeSyntheticEvent<TextInputChangeEventData>) => void
  onFocus?: TextInputProps['onFocus']
  onBlur?: TextInputProps['onBlur']
  onKeyPress?: TextInputProps['onKeyPress']
  onSubmitEditing?: TextInputProps['onSubmitEditing']
  
  // 防抖相关
  debounce?: number  // 默认 0，延迟执行时间（毫秒）
  debounceCallback?: (value: string) => void  // 延迟执行的回调
}

// ShowCountProps 接口
interface ShowCountProps {
  formatter: (args: {
    count: number
    value: string
    maxLength?: number
  }) => string | React.ReactElement
}

// Ref 方法
interface InputRefMethods {
  focus: () => void  // 让输入框获得焦点
  blur: () => void  // 让输入框失去焦点
  clear: () => void  // 清空输入内容
  textInputRef: TextInput  // 内部的原生 TextInput 组件引用
}
```

## 新组件 API

```tsx
interface InputProps {
  // 值和默认值
  value?: string | number
  defaultValue?: string | number
  
  // 输入框类型和状态
  type?: 'input' | 'textarea'  // 默认 'input'
  disabled?: boolean  // 默认 false
  error?: boolean  // 默认 false，校验报错样式
  
  // 对齐方式
  textAlign?: 'left' | 'center' | 'right' | 'auto'  // 默认 'left'
  
  // 字符数统计
  maxLength?: number
  showRestCount?: boolean | ShowCountProps  // 默认 false
  
  // 清除功能
  clearable?: boolean  // 默认 false
  onlyShowClearWhenFocus?: boolean  // 默认 true
  
  // 焦点和占位符
  autoFocus?: boolean  // 默认 false
  placeholder?: string
  placeholderTextColor?: string  // 新增：自定义占位符文字颜色
  
  // 键盘相关
  autoCorrect?: TextInputProps['autoCorrect']  // 默认 true
  keyboardType?: TextInputProps['keyboardType']  // 默认 'default'
  returnKeyType?: TextInputProps['returnKeyType']
  autoCapitalize?: TextInputProps['autoCapitalize']
  
  // 多行文本
  textInputMultilineHeight?: number
  
  // 事件回调
  onChange?: (text: string, e?: NativeSyntheticEvent<TextInputChangeEventData>) => void
  onFocus?: TextInputProps['onFocus']
  onBlur?: TextInputProps['onBlur']
  onKeyPress?: TextInputProps['onKeyPress']
  onSubmitEditing?: TextInputProps['onSubmitEditing']
  
  // 防抖相关
  debounce?: number  // 默认 0
  debounceCallback?: (value: string) => void
  
  // 新增样式相关
  style?: StyleProp<ViewStyle>  // 容器样式
  inputStyle?: StyleProp<TextStyle>  // 输入框样式（新增）
  
  // 新增功能
  editable?: boolean  // 新增：是否可编辑（替代 disabled 逻辑）
  onContentSizeChange?: (e: NativeSyntheticEvent) => void  // 新增：多行文本内容大小变化回调
}

// ShowCountProps 接口保持一致
interface ShowCountProps {
  formatter: (args: {
    count: number
    value: string
    maxLength?: number
  }) => string | React.ReactElement
}

// Ref 方法
interface InputRefMethods {
  focus: () => void
  blur: () => void
  clear: () => void
  textInputRef: TextInput
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| value | value | 输入框值，保持一致 |
| defaultValue | defaultValue | 默认值，保持一致 |
| type | type | 输入框类型（input/textarea），保持一致 |
| disabled | disabled 或 editable | 禁用状态，新增 editable 作为反向逻辑 |
| error | error | 错误样式，保持一致 |
| textAlign | textAlign | 文本对齐方式，保持一致 |
| maxLength | maxLength | 最大字符数，保持一致 |
| showRestCount | showRestCount | 显示剩余字数，保持一致 |
| clearable | clearable | 清除功能，保持一致 |
| onlyShowClearWhenFocus | onlyShowClearWhenFocus | 聚焦时显示清除按钮，保持一致 |
| autoFocus | autoFocus | 自动聚焦，保持一致 |
| placeholder | placeholder | 占位符文案，保持一致 |
| - | placeholderTextColor | 占位符颜色（新增） |
| autoCorrect | autoCorrect | 自动纠正，保持一致 |
| keyboardType | keyboardType | 键盘类型，保持一致 |
| returnKeyType | returnKeyType | 确定键类型，保持一致 |
| autoCapitalize | autoCapitalize | 自动大写，保持一致 |
| textInputMultilineHeight | textInputMultilineHeight | 多行高度，保持一致 |
| onChange | onChange | 内容变化回调，保持一致 |
| onFocus | onFocus | 聚焦回调，保持一致 |
| onBlur | onBlur | 失焦回调，保持一致 |
| onKeyPress | onKeyPress | 按键回调，保持一致 |
| onSubmitEditing | onSubmitEditing | 提交回调，保持一致 |
| debounce | debounce | 防抖延迟，保持一致 |
| debounceCallback | debounceCallback | 防抖回调，保持一致 |
| - | style | 容器样式（保持） |
| - | inputStyle | 输入框样式（新增） |
| - | editable | 可编辑状态（新增，与 disabled 互补） |
| - | onContentSizeChange | 内容大小变化回调（新增） |

## 迁移示例

### 案例 1：基础输入框

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'

<Input 
  placeholder="请输入内容"
  value={inputValue}
  onChange={(text) => setInputValue(text)}
/>

// 迁移后
import { Input } from '@sfe/wand-rn'

<Input 
  placeholder="请输入内容"
  value={inputValue}
  onChange={(text) => setInputValue(text)}
/>
```

### 案例 2：默认值处理

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'

<Input
  defaultValue="默认值"
  autoFocus
  onFocus={() => console.log('获得焦点')}
  onBlur={() => console.log('失去焦点')}
/>

// 迁移后
import { Input } from '@sfe/wand-rn'

<Input
  defaultValue="默认值"
  autoFocus
  onFocus={() => console.log('获得焦点')}
  onBlur={() => console.log('失去焦点')}
/>
```

### 案例 3：文本对齐

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'

<Input 
  textAlign="right"
  placeholder="居右对齐"
  keyboardType="decimal-pad"
/>

// 迁移后
import { Input } from '@sfe/wand-rn'

<Input 
  textAlign="right"
  placeholder="居右对齐"
  keyboardType="decimal-pad"
/>
```

### 案例 4：禁用状态

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'

<Input 
  value="此处不可修改"
  disabled={true}
/>

// 迁移后 - 方式 1：使用 disabled
import { Input } from '@sfe/wand-rn'

<Input 
  value="此处不可修改"
  disabled={true}
/>

// 迁移后 - 方式 2：使用 editable（新增）
<Input 
  value="此处不可修改"
  editable={false}
/>
```

### 案例 5：错误状态

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'

<Input
  placeholder="表单报错"
  error={true}
  value={errorValue}
  onChange={(text) => setErrorValue(text)}
/>

// 迁移后
import { Input } from '@sfe/wand-rn'

<Input
  placeholder="表单报错"
  error={true}
  value={errorValue}
  onChange={(text) => setErrorValue(text)}
/>
```

### 案例 6：清除功能 - 聚焦时显示

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'

<Input
  placeholder="可清除 Icon"
  clearable={true}
  onlyShowClearWhenFocus={true}
  value={clearValue}
  onChange={(text) => setClearValue(text)}
/>

// 迁移后
import { Input } from '@sfe/wand-rn'

<Input
  placeholder="可清除 Icon"
  clearable={true}
  onlyShowClearWhenFocus={true}
  value={clearValue}
  onChange={(text) => setClearValue(text)}
/>
```

### 案例 7：清除功能 - 常驻显示

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'

<Input
  placeholder="可清除 Icon 常驻"
  clearable={true}
  onlyShowClearWhenFocus={false}
  value={clearValue}
  onChange={(text) => setClearValue(text)}
/>

// 迁移后
import { Input } from '@sfe/wand-rn'

<Input
  placeholder="可清除 Icon 常驻"
  clearable={true}
  onlyShowClearWhenFocus={false}
  value={clearValue}
  onChange={(text) => setClearValue(text)}
/>
```

### 案例 8：多行文本

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'

<Input
  placeholder="多行文本"
  type="textarea"
  textInputMultilineHeight={100}
  value={multilineValue}
  onChange={(text) => setMultilineValue(text)}
/>

// 迁移后
import { Input } from '@sfe/wand-rn'

<Input
  placeholder="多行文本"
  type="textarea"
  textInputMultilineHeight={100}
  value={multilineValue}
  onChange={(text) => setMultilineValue(text)}
/>
```

### 案例 9：显示剩余字数 - 简单模式

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'

<Input
  placeholder="显示剩余字数"
  type="textarea"
  maxLength={100}
  showRestCount={true}
  value={restValue}
  onChange={(text) => setRestValue(text)}
/>

// 迁移后
import { Input } from '@sfe/wand-rn'

<Input
  placeholder="显示剩余字数"
  type="textarea"
  maxLength={100}
  showRestCount={true}
  value={restValue}
  onChange={(text) => setRestValue(text)}
/>
```

### 案例 10：显示剩余字数 - 自定义格式

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'

<Input
  placeholder="自定义剩余字数"
  type="textarea"
  maxLength={100}
  showRestCount={{
    formatter: ({ value, maxLength }) => `${value.length} / ${maxLength}`
  }}
  value={restValue}
  onChange={(text) => setRestValue(text)}
/>

// 迁移后
import { Input } from '@sfe/wand-rn'

<Input
  placeholder="自定义剩余字数"
  type="textarea"
  maxLength={100}
  showRestCount={{
    formatter: ({ value, maxLength }) => `${value.length} / ${maxLength}`
  }}
  value={restValue}
  onChange={(text) => setRestValue(text)}
/>
```

### 案例 11：显示剩余字数 - JSX 自定义

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'
import { Typography } from '@sgfe/flower-rn'

<Input
  placeholder="自定义剩余字数"
  type="textarea"
  maxLength={100}
  showRestCount={{
    formatter: ({ value, maxLength }) => (
      <Typography.Text type="danger">
        {maxLength - value.length} 字可输入
      </Typography.Text>
    )
  }}
  value={restValue}
  onChange={(text) => setRestValue(text)}
/>

// 迁移后
import { Input } from '@sfe/wand-rn'
import { Text } from '@mrn/react-native'

<Input
  placeholder="自定义剩余字数"
  type="textarea"
  maxLength={100}
  showRestCount={{
    formatter: ({ value, maxLength }) => (
      <Text style={{ color: 'red' }}>
        {maxLength - value.length} 字可输入
      </Text>
    )
  }}
  value={restValue}
  onChange={(text) => setRestValue(text)}
/>
```

### 案例 12：防抖功能 - 简单模式

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'

const handleDebounce = (value: string) => {
  console.log('防抖执行:', value)
  // 执行 API 调用或其他操作
}

<Input
  placeholder="防抖动 600ms"
  debounce={600}
  debounceCallback={handleDebounce}
  value={debounceValue}
  onChange={(text) => setDebounceValue(text)}
/>

// 迁移后
import { Input } from '@sfe/wand-rn'

const handleDebounce = (value: string) => {
  console.log('防抖执行:', value)
}

<Input
  placeholder="防抖动 600ms"
  debounce={600}
  debounceCallback={handleDebounce}
  value={debounceValue}
  onChange={(text) => setDebounceValue(text)}
/>
```

### 案例 13：防抖功能 - 同时监听变化和防抖

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'

<Input
  placeholder="防抖动 600ms"
  debounce={600}
  debounceCallback={(value) => {
    console.log('防抖执行:', value)
  }}
  onChange={(text) => {
    console.log('实时变化:', text)
    setInputValue(text)
  }}
  value={inputValue}
/>

// 迁移后 - 保持一致
import { Input } from '@sfe/wand-rn'

<Input
  placeholder="防抖动 600ms"
  debounce={600}
  debounceCallback={(value) => {
    console.log('防抖执行:', value)
  }}
  onChange={(text) => {
    console.log('实时变化:', text)
    setInputValue(text)
  }}
  value={inputValue}
/>
```

### 案例 14：通过 Ref 控制输入框

```tsx
// 迁移前
import { Input, InputProps } from '@sgfe/flower-rn'
import React from 'react'

const inputRef = React.useRef<Input>(null)

<View>
  <Input ref={inputRef} placeholder="ref 测试" />
  <Button onPress={() => inputRef.current?.focus()}>点击聚焦</Button>
  <Button onPress={() => inputRef.current?.clear()}>点击清空</Button>
  <Button onPress={() => inputRef.current?.blur()}>点击失焦</Button>
</View>

// 迁移后 - 保持一致
import { Input } from '@sfe/wand-rn'
import React from 'react'

const inputRef = React.useRef(null)

<View>
  <Input ref={inputRef} placeholder="ref 测试" />
  <Button onPress={() => inputRef.current?.focus()}>点击聚焦</Button>
  <Button onPress={() => inputRef.current?.clear()}>点击清空</Button>
  <Button onPress={() => inputRef.current?.blur()}>点击失焦</Button>
</View>
```

### 案例 15：键盘类型和返回键

```tsx
// 迁移前
import { Input } from '@sgfe/flower-rn'

<Input
  placeholder="数字输入"
  keyboardType="decimal-pad"
  returnKeyType="done"
  onSubmitEditing={() => console.log('点击了确定')}
/>

// 迁移后
import { Input } from '@sfe/wand-rn'

<Input
  placeholder="数字输入"
  keyboardType="decimal-pad"
  returnKeyType="done"
  onSubmitEditing={() => console.log('点击了确定')}
/>
```

### 案例 16：自定义占位符颜色（新增）

```tsx
// 迁移前 - 不支持
import { Input } from '@sgfe/flower-rn'

<Input placeholder="占位符" />

// 迁移后 - 新增支持
import { Input } from '@sfe/wand-rn'

<Input 
  placeholder="占位符"
  placeholderTextColor="#cccccc"
/>
```

### 案例 17：自定义输入框样式（新增）

```tsx
// 迁移前 - 不支持自定义输入框样式
import { Input } from '@sgfe/flower-rn'

<Input placeholder="输入框" />

// 迁移后 - 新增样式支持
import { Input } from '@sfe/wand-rn'

<Input 
  placeholder="输入框"
  inputStyle={{ fontSize: 16, color: '#333' }}
/>
```

### 案例 18：监听内容大小变化（新增）

```tsx
// 迁移前 - 不支持
import { Input } from '@sgfe/flower-rn'

<Input 
  type="textarea"
  placeholder="多行文本"
/>

// 迁移后 - 新增回调
import { Input } from '@sfe/wand-rn'

<Input 
  type="textarea"
  placeholder="多行文本"
  onContentSizeChange={(e) => {
    console.log('内容高度:', e.nativeEvent.contentSize.height)
  }}
/>
```

### 案例 19：完整复杂场景

```tsx
// 迁移前
import { Input, InputProps } from '@sgfe/flower-rn'
import React from 'react'

export default function InputFormDemo() {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    remarks: '初始备注'
  })
  const inputRef = React.useRef<Input>(null)

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View>
        {/* 用户名 - 基础输入 */}
        <Input
          placeholder="请输入用户名"
          value={formData.name}
          onChange={(text) => setFormData({ ...formData, name: text })}
          clearable
          onlyShowClearWhenFocus
        />
        
        {/* 描述 - 多行 + 字数统计 */}
        <Input
          type="textarea"
          placeholder="请输入描述"
          maxLength={500}
          showRestCount
          textInputMultilineHeight={150}
          value={formData.description}
          onChange={(text) => setFormData({ ...formData, description: text })}
        />
        
        {/* 备注 - ref 控制 */}
        <Input
          ref={inputRef}
          placeholder="备注信息"
          defaultValue={formData.remarks}
          onChange={(text) => setFormData({ ...formData, remarks: text })}
          clearable
          onlyShowClearWhenFocus={false}
        />
        
        {/* 按钮组 */}
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={() => inputRef.current?.focus()}>聚焦备注</Button>
          <Button onPress={() => inputRef.current?.clear()}>清空备注</Button>
        </View>
      </View>
    </ScrollView>
  )
}

// 迁移后
import { Input } from '@sfe/wand-rn'
import React from 'react'

export default function InputFormDemo() {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    remarks: '初始备注'
  })
  const inputRef = React.useRef(null)

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View>
        {/* 用户名 - 基础输入 */}
        <Input
          placeholder="请输入用户名"
          value={formData.name}
          onChange={(text) => setFormData({ ...formData, name: text })}
          clearable
          onlyShowClearWhenFocus
        />
        
        {/* 描述 - 多行 + 字数统计 */}
        <Input
          type="textarea"
          placeholder="请输入描述"
          maxLength={500}
          showRestCount
          textInputMultilineHeight={150}
          value={formData.description}
          onChange={(text) => setFormData({ ...formData, description: text })}
        />
        
        {/* 备注 - ref 控制 */}
        <Input
          ref={inputRef}
          placeholder="备注信息"
          defaultValue={formData.remarks}
          onChange={(text) => setFormData({ ...formData, remarks: text })}
          clearable
          onlyShowClearWhenFocus={false}
        />
        
        {/* 按钮组 */}
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={() => inputRef.current?.focus()}>聚焦备注</Button>
          <Button onPress={() => inputRef.current?.clear()}>清空备注</Button>
        </View>
      </View>
    </ScrollView>
  )
}
```

## 关键迁移要点

### 1. API 基本保持一致
- 大部分属性和方法保持不变
- 仅需要更改 import 路径
- 现有代码兼容性很好

### 2. 新增属性
- **placeholderTextColor**: 自定义占位符颜色
- **inputStyle**: 自定义输入框样式
- **editable**: 可编辑状态（与 disabled 互补）
- **onContentSizeChange**: 多行文本内容大小变化回调

### 3. 防抖功能保持一致
- `debounce` 和 `debounceCallback` 配合使用
- onChange 会立即触发，debounceCallback 延迟触发
- 适合搜索、校验等防抖场景

### 4. Ref 方法保持一致
- `focus()`: 获得焦点
- `blur()`: 失去焦点
- `clear()`: 清空内容
- `textInputRef`: 内部原生 TextInput 引用

### 5. 清除功能的细节
- `clearable=true` 启用清除 Icon
- `onlyShowClearWhenFocus=true` 仅在聚焦时显示（推荐）
- `onlyShowClearWhenFocus=false` 常驻显示

### 6. 多行文本特性
- `type="textarea"` 启用多行模式
- `textInputMultilineHeight` 设置输入框高度
- `maxLength` 和 `showRestCount` 可显示剩余字数
- 新增 `onContentSizeChange` 回调获取内容大小

### 7. 字数统计的自定义
- `showRestCount=true` 显示默认格式（"剩余数量"）
- `showRestCount={{ formatter: ... }}` 自定义格式
- formatter 支持返回字符串或 JSX.Element

## 迁移检查清单

- [ ] 将所有 `import { Input } from '@sgfe/flower-rn'` 改为 `import { Input } from '@sfe/wand-rn'`
- [ ] 检查是否有使用 `disabled` 的地方，可以保持不变或改用 `editable`
- [ ] 如果需要自定义占位符颜色，使用新增的 `placeholderTextColor` 属性
- [ ] 检查多行文本场景是否需要使用新增的 `onContentSizeChange` 回调
- [ ] 验证 ref 方法（focus、blur、clear）是否正常工作
- [ ] 检查防抖功能是否正常工作
- [ ] 测试清除功能的显示和隐藏
- [ ] 验证字数统计的显示是否正确
- [ ] 测试不同的键盘类型是否正确显示
- [ ] 验证各种状态（disabled、error、clearable）的样式是否正确

## 注意事项

1. **导入路径变更**：
   - 从 `@sgfe/flower-rn` 改为 `@sfe/wand-rn`
   - 其他大部分代码可以保持不变

2. **disabled vs editable**：
   - 旧版本只有 `disabled`
   - 新版本同时支持 `disabled` 和 `editable`
   - 优先使用 `disabled`，除非有特殊需求

3. **ScrollView 的配置**：
   - 使用 ScrollView 包裹 Input 时需要设置 `keyboardShouldPersistTaps="handled"`
   - 这样输入框才能正常失焦和切换焦点

4. **防抖的两个回调**：
   - `onChange` 会立即触发，用于实时更新 UI
   - `debounceCallback` 延迟触发，用于 API 调用等成本较高的操作
   - 两个回调都会执行，但触发时机不同

5. **Ref 的使用**：
   - 使用 `useRef` 或 `createRef` 创建 ref
   - 支持 ref 参数为类组件中的方法

6. **多行文本的高度**：
   - `textInputMultilineHeight` 是初始高度
   - 新增的 `onContentSizeChange` 可以动态获取实际高度
   - 如需自动伸缩，可以在 `onContentSizeChange` 中更新高度

7. **错误状态的样式**：
   - `error=true` 会改变输入框的样式（通常为红色边框）
   - 这是组件内置的样式，无法自定义

8. **占位符颜色**：
   - 新增的 `placeholderTextColor` 属性
   - 旧代码如果需要改变占位符颜色，需要使用这个新属性

## 类型导入

```tsx
import { 
  Input, 
  InputProps 
} from '@sfe/wand-rn'
```

## 完整迁移示例

以下是一个完整的表单场景的迁移对比：

```tsx
// 迁移前 - flower-rn
import React, { useRef, useState } from 'react'
import { View, ScrollView } from '@mrn/react-native'
import { Input, Button } from '@sgfe/flower-rn'

export function OldInputForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const remarksRef = useRef<Input>(null)

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={{ padding: 16 }}>
        <Input
          placeholder="用户名"
          value={name}
          onChange={(text) => setName(text)}
          clearable
        />
        <Input
          placeholder="邮箱"
          value={email}
          onChange={(text) => setEmail(text)}
          keyboardType="email-address"
          error={email && !email.includes('@')}
          clearable
        />
        <Input
          placeholder="个人介绍（最多100字）"
          type="textarea"
          value={bio}
          onChange={(text) => setBio(text)}
          maxLength={100}
          showRestCount
          textInputMultilineHeight={120}
        />
        <Input
          ref={remarksRef}
          placeholder="备注"
          defaultValue=""
        />
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={() => remarksRef.current?.focus()}>聚焦备注</Button>
          <Button onPress={() => remarksRef.current?.clear()}>清空备注</Button>
        </View>
      </View>
    </ScrollView>
  )
}

// 迁移后 - wand-rn
import React, { useRef, useState } from 'react'
import { View, ScrollView } from '@mrn/react-native'
import { Input, Button } from '@sfe/wand-rn'

export function NewInputForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const remarksRef = useRef(null)

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={{ padding: 16 }}>
        <Input
          placeholder="用户名"
          value={name}
          onChange={(text) => setName(text)}
          clearable
          placeholderTextColor="#999"
        />
        <Input
          placeholder="邮箱"
          value={email}
          onChange={(text) => setEmail(text)}
          keyboardType="email-address"
          error={email && !email.includes('@')}
          clearable
        />
        <Input
          placeholder="个人介绍（最多100字）"
          type="textarea"
          value={bio}
          onChange={(text) => setBio(text)}
          maxLength={100}
          showRestCount
          textInputMultilineHeight={120}
          onContentSizeChange={(e) => {
            console.log('内容高度:', e.nativeEvent.contentSize.height)
          }}
        />
        <Input
          ref={remarksRef}
          placeholder="备注"
          defaultValue=""
        />
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={() => remarksRef.current?.focus()}>聚焦备注</Button>
          <Button onPress={() => remarksRef.current?.clear()}>清空备注</Button>
        </View>
      </View>
    </ScrollView>
  )
}
```
