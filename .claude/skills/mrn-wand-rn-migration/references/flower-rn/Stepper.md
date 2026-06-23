# Stepper 步进器

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface StepperProps {
    value: number  // 数值，必填
    type?: 'primary' | 'normal'  // 默认 'primary'，样式类型
    step?: number  // 默认 1，增减量
    digits?: number  // 格式化到小数点后固定位数，设置为 0 表示格式化到整数
    min?: number  // 限制最小值
    max?: number  // 限制最大值
    disabled?: boolean  // 默认 false，是否禁用
    inputReadOnly?: boolean  // 默认 false，输入框是否只读
    inputKeyboardType?: TextInputProps['keyboardType']  // 默认 'numeric'，input 呼起键盘的类型
    onChange?: (value: number) => void  // 数值变化回调
    onBlur?: () => void  // 输入框 blur 回调
    onFocus?: () => void  // 输入框 focus 回调
}

// Ref 方法
interface StepperRef {
    focus: () => void  // 使 input 聚焦
}
```

## 新组件 API

```tsx
export enum StepperOperateType {
    DECREASE = 1,  // 减少操作
    INCREASE = 2,  // 增加操作
    EDIT = 3  // 编辑操作
}

interface StepperChangeCallback {
    (val: string | number, operateType: StepperOperateType): void
}

interface StepperControlRenderFunc {
    (operateType: StepperOperateType, disabled: boolean): ReactNode
}

interface StepperControlSourceFunc {
    (operateType: StepperOperateType, disabled: boolean): ImageSourcePropType
}

interface StepperControlStyleFunc {
    (operateType: StepperOperateType, disabled: boolean): StyleProp<ImageStyle>
}

interface StepperProps extends Omit<TextInputProps, 'value' | 'onChange'> {
    min?: number  // 限制最小值
    max?: number  // 限制最大值
    rule?: RegExp  // 数值验证规则，默认 /^\s*[+-]?\d+\s*$|^$/
    step?: number  // 默认 1，增减量
    value?: string | number  // 数值，可以是字符串或数字
    onChange?: StepperChangeCallback  // 数值变化回调，回调包含操作类型
    controlSource?: StepperControlSourceFunc  // 自定义控制按钮的图标源
    controlRender?: StepperControlRenderFunc  // 自定义控制按钮的渲染函数
    style?: StyleProp<ViewStyle>  // 容器样式
    inputStyle?: StyleProp<TextStyle>  // 输入框样式
    constrolStyle?: StyleProp<ImageStyle> | StepperControlStyleFunc  // 控制按钮样式或样式函数
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| value: number | value: string \| number | 值类型扩展为字符串或数字 |
| type | 无对应属性 | 新组件不支持 'primary'/'normal' 样式切换，使用 controlRender 自定义样式 |
| step | step | 增减量，保持一致 |
| digits | 无对应属性 | 新组件不支持小数位格式化，需要在 onChange 回调中手动处理 |
| min | min | 最小值，保持一致 |
| max | max | 最大值，保持一致 |
| disabled | 通过 Omit\<TextInputProps\> | 需要使用 TextInput 原生的 editable 属性 |
| inputReadOnly | editable | 属性名称改为 editable（反义布尔值） |
| inputKeyboardType | keyboardType | 属性名称改为 keyboardType |
| onChange 回调值 | onChange 回调 + operateType | 新组件回调函数包含操作类型（DECREASE/INCREASE/EDIT） |
| onBlur | onBlur | 通过 TextInputProps 继承，保持一致 |
| onFocus | onFocus | 通过 TextInputProps 继承，保持一致 |
| ref.focus() | 无直接支持 | 新组件不支持 ref 的 focus 方法，需要通过 TextInput ref 实现 |
| - | rule | 新增属性，用于数值验证 |
| - | controlSource | 新增属性，自定义控制按钮图标 |
| - | controlRender | 新增属性，完全自定义控制按钮渲染 |

## 迁移示例

### 案例 1：基础数值增减

```tsx
// 迁移前 - flower-rn
import { Stepper } from '@sgfe/flower-rn'
import { useState } from 'react'

const MyComponent = () => {
  const [value, setValue] = useState(1)

  return (
    <Stepper 
      value={value} 
      step={1}
      min={0}
      max={10}
      onChange={(newValue) => setValue(newValue)}
    />
  )
}

// 迁移后 - wand-rn
import { Stepper, StepperOperateType } from '@sfe/wand-rn'
import { useState } from 'react'

const MyComponent = () => {
  const [value, setValue] = useState(1)

  return (
    <Stepper 
      value={value} 
      step={1}
      min={0}
      max={10}
      onChange={(newValue, operateType) => {
        // 新 API 的 onChange 会传入操作类型
        // operateType: DECREASE | INCREASE | EDIT
        setValue(newValue)
      }}
    />
  )
}
```

### 案例 2：禁用状态和只读输入框

```tsx
// 迁移前 - flower-rn
import { Stepper } from '@sgfe/flower-rn'
import { useState } from 'react'

const MyComponent = () => {
  const [value, setValue] = useState(5)

  return (
    <>
      {/* 完全禁用 */}
      <Stepper 
        value={value} 
        disabled={true}
        onChange={(newValue) => setValue(newValue)}
      />

      {/* 只读输入框 */}
      <Stepper 
        value={value} 
        inputReadOnly={true}
        onChange={(newValue) => setValue(newValue)}
      />
    </>
  )
}

// 迁移后 - wand-rn
import { Stepper } from '@sfe/wand-rn'
import { useState } from 'react'

const MyComponent = () => {
  const [value, setValue] = useState(5)

  return (
    <>
      {/* 完全禁用 - 需要将所有 TextInput 属性设置为禁用 */}
      <Stepper 
        value={value} 
        editable={false}
        onChange={(newValue) => setValue(newValue)}
      />

      {/* 只读输入框 - 使用 editable={false} */}
      <Stepper 
        value={value} 
        editable={false}
        onChange={(newValue) => setValue(newValue)}
      />
    </>
  )
}
```

### 案例 3：小数值处理

```tsx
// 迁移前 - flower-rn
import { Stepper } from '@sgfe/flower-rn'
import { useState } from 'react'

const MyComponent = () => {
  const [value, setValue] = useState(0.1)

  return (
    <Stepper 
      value={value} 
      step={0.1}
      digits={2}  // 格式化到小数点后 2 位
      min={0}
      max={1}
      onChange={(newValue) => setValue(newValue)}
    />
  )
}

// 迁移后 - wand-rn
import { Stepper } from '@sfe/wand-rn'
import { useState } from 'react'

const MyComponent = () => {
  const [value, setValue] = useState(0.1)

  // 辅助函数：格式化到指定小数位
  const formatDigits = (num: number, digits: number) => {
    return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits)
  }

  return (
    <Stepper 
      value={value} 
      step={0.1}
      min={0}
      max={1}
      onChange={(newValue) => {
        // 手动处理小数位格式化
        const numValue = typeof newValue === 'string' ? parseFloat(newValue) : newValue
        const formattedValue = formatDigits(numValue, 2)
        setValue(formattedValue)
      }}
    />
  )
}
```

### 案例 4：自定义键盘类型

```tsx
// 迁移前 - flower-rn
import { Stepper } from '@sgfe/flower-rn'
import { useState } from 'react'

const MyComponent = () => {
  const [value, setValue] = useState(10)

  return (
    <Stepper 
      value={value} 
      inputKeyboardType="number-pad"
      onChange={(newValue) => setValue(newValue)}
    />
  )
}

// 迁移后 - wand-rn
import { Stepper } from '@sfe/wand-rn'
import { useState } from 'react'

const MyComponent = () => {
  const [value, setValue] = useState(10)

  return (
    <Stepper 
      value={value} 
      keyboardType="number-pad"  // 属性名改为 keyboardType
      onChange={(newValue) => setValue(newValue)}
    />
  )
}
```

### 案例 5：自定义控制按钮样式

```tsx
// 迁移前 - flower-rn
import { Stepper } from '@sgfe/flower-rn'
import { useState } from 'react'
import { StyleSheet } from '@mrn/react-native'

const MyComponent = () => {
  const [value, setValue] = useState(5)

  return (
    <Stepper 
      value={value} 
      type="primary"  // 直接使用预设样式
      onChange={(newValue) => setValue(newValue)}
    />
  )
}

// 迁移后 - wand-rn
import { Stepper, StepperOperateType } from '@sfe/wand-rn'
import { useState } from 'react'
import { StyleSheet, Image } from '@mrn/react-native'

const MyComponent = () => {
  const [value, setValue] = useState(5)

  // 自定义样式
  const customControlStyle = (operateType: StepperOperateType, disabled: boolean) => {
    if (disabled) {
      return { opacity: 0.5 }
    }
    return { opacity: 1 }
  }

  return (
    <Stepper 
      value={value} 
      constrolStyle={customControlStyle}  // 自定义按钮样式
      onChange={(newValue) => setValue(newValue)}
    />
  )
}
```

### 案例 6：完全自定义控制按钮

```tsx
// 迁移前 - flower-rn
import { Stepper } from '@sgfe/flower-rn'
import { useState } from 'react'

const MyComponent = () => {
  const [value, setValue] = useState(5)

  return (
    <Stepper 
      value={value} 
      onChange={(newValue) => setValue(newValue)}
    />
  )
}

// 迁移后 - wand-rn
import { Stepper, StepperOperateType } from '@sfe/wand-rn'
import { useState } from 'react'
import { TouchableOpacity, Text } from '@mrn/react-native'

const MyComponent = () => {
  const [value, setValue] = useState(5)

  // 自定义渲染控制按钮
  const renderControl = (operateType: StepperOperateType, disabled: boolean) => {
    const isIncrease = operateType === StepperOperateType.INCREASE
    return (
      <TouchableOpacity disabled={disabled}>
        <Text style={{ fontSize: 20 }}>
          {isIncrease ? '➕' : '➖'}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <Stepper 
      value={value} 
      controlRender={renderControl}  // 完全自定义按钮渲染
      onChange={(newValue) => setValue(newValue)}
    />
  )
}
```

### 案例 7：使用操作类型判断用户行为

```tsx
// 迁移前 - flower-rn
import { Stepper } from '@sgfe/flower-rn'
import { useState } from 'react'

const MyComponent = () => {
  const [value, setValue] = useState(1)

  return (
    <Stepper 
      value={value} 
      onChange={(newValue) => {
        // 旧 API 不区分用户操作类型
        setValue(newValue)
      }}
    />
  )
}

// 迁移后 - wand-rn
import { Stepper, StepperOperateType } from '@sfe/wand-rn'
import { useState } from 'react'

const MyComponent = () => {
  const [value, setValue] = useState(1)
  const [operationType, setOperationType] = useState('')

  return (
    <Stepper 
      value={value} 
      onChange={(newValue, operateType) => {
        // 新 API 可以获知用户是点击按钮还是直接编辑
        switch (operateType) {
          case StepperOperateType.INCREASE:
            console.log('用户点击增加按钮')
            break
          case StepperOperateType.DECREASE:
            console.log('用户点击减少按钮')
            break
          case StepperOperateType.EDIT:
            console.log('用户直接编辑输入框')
            break
        }
        setValue(newValue)
        setOperationType(StepperOperateType[operateType])
      }}
    />
  )
}
```

### 案例 8：输入框焦点处理

```tsx
// 迁移前 - flower-rn
import { Stepper } from '@sgfe/flower-rn'
import { useState, useRef } from 'react'

const MyComponent = () => {
  const [value, setValue] = useState(5)
  const stepperRef = useRef()

  const handleFocus = () => {
    // 通过 ref 使输入框聚焦
    stepperRef.current?.focus()
  }

  return (
    <Stepper 
      ref={stepperRef}
      value={value} 
      onChange={(newValue) => setValue(newValue)}
      onFocus={() => console.log('focused')}
      onBlur={() => console.log('blurred')}
    />
  )
}

// 迁移后 - wand-rn
import { Stepper } from '@sfe/wand-rn'
import { useState, useRef } from 'react'
import { TextInput } from '@mrn/react-native'

const MyComponent = () => {
  const [value, setValue] = useState(5)
  const inputRef = useRef<TextInput>()

  const handleFocus = () => {
    // 新组件需要获取 TextInput ref，但 Stepper 组件没有暴露 ref 接口
    // 建议通过 onFocus callback 处理
    // 或者考虑直接使用 TextInput
  }

  return (
    <Stepper 
      value={value} 
      onChange={(newValue) => setValue(newValue)}
      onFocus={() => console.log('focused')}
      onBlur={() => console.log('blurred')}
    />
  )
}
```

## 关键点

### 1. API 差异较大
- flower-rn 的 Stepper 采用函数式组件设计，支持 React Hooks
- wand-rn 的 Stepper 是基于 PureComponent 的类组件，更接近原生 TextInput API
- 两个版本的设计思路完全不同，需要仔细调整代码

### 2. type 属性不再支持
- 旧版本的 `type: 'primary' | 'normal'` 属性在新版本中不存在
- 需要使用 `controlRender` 或 `controlSource` 自定义样式
- 如果只是简单的样式变化，建议使用 `constrolStyle` prop

### 3. 回调函数签名改变
- 旧版本：`onChange: (value: number) => void`
- 新版本：`onChange: (val: string | number, operateType: StepperOperateType) => void`
- 需要处理操作类型（DECREASE/INCREASE/EDIT）

### 4. 小数点处理
- 旧版本通过 `digits` 属性自动格式化小数
- 新版本需要在 onChange 回调中手动处理
- 建议创建辅助函数来处理小数格式化

### 5. 属性命名改变
- `inputReadOnly` → `editable`（注意反义：inputReadOnly=true 对应 editable=false）
- `inputKeyboardType` → `keyboardType`

### 6. 禁用状态处理
- 旧版本有专门的 `disabled` 属性
- 新版本通过 TextInput 的 `editable` 属性控制
- 可能需要通过 props spreading (Omit<TextInputProps>) 来传递其他 TextInput 属性

### 7. Ref 方法不再支持
- 旧版本通过 ref.focus() 使输入框聚焦
- 新版本的 Stepper 组件没有暴露 ref 接口
- 需要通过 onFocus callback 处理焦点逻辑，或考虑直接使用底层 TextInput

### 8. 值类型差异
- 旧版本：`value: number`（必填）
- 新版本：`value?: string | number`（可选）
- 需要注意字符串和数字的类型转换

### 9. 控制按钮自定义
- 新版本提供了更强的自定义能力
- 可以通过 `controlSource` 自定义图标
- 可以通过 `controlRender` 完全自定义按钮的渲染逻辑
- 可以通过 `constrolStyle` 或 `constrolStyle` 函数自定义样式

### 10. 验证规则
- 新版本新增 `rule` 属性用于数值验证
- 默认规则：`/^\s*[+-]?\d+\s*$|^$/`（只允许整数）
- 如果需要接受小数，需要自定义规则

## 迁移步骤

1. **更新 import 语句**
```tsx
// 从
import { Stepper } from '@sgfe/flower-rn'

// 改为
import { Stepper, StepperOperateType } from '@sfe/wand-rn'
```

2. **调整 onChange 回调处理**
```tsx
// 旧版本
onChange={(newValue) => setValue(newValue)}

// 新版本
onChange={(newValue, operateType) => {
  // 如果不需要操作类型，直接使用 newValue
  setValue(newValue)
}}
```

3. **处理 type 属性**
   - 如果使用了 `type="primary"` 或 `type="normal"`，改用 `controlRender` 或 `controlSource` 自定义样式
   - 或者删除 type 属性，使用默认样式

4. **处理 digits 属性**
   - 在 onChange 回调中手动格式化小数
   - 创建格式化辅助函数

5. **更新属性名称**
   - `inputReadOnly` → `editable`（反义）
   - `inputKeyboardType` → `keyboardType`

6. **处理 Ref 相关操作**
   - 如果使用了 `ref.focus()`，改用 `onFocus` callback 或其他方法
   - 考虑业务是否真正需要 focus 功能

7. **处理 disabled 属性**
   - 改用 `editable` 属性或通过 TextInput props 传递
   - 确保所有禁用状态都被正确处理

8. **验证和测试**
   - 测试数值增减功能
   - 测试边界条件（min/max）
   - 测试小数值处理（如果需要）
   - 测试禁用和只读状态
   - 测试自定义样式（如果有）

## 总结

Stepper 组件在 flower-rn 和 wand-rn 之间有较大的 API 差异：
- 旧版本更现代化（函数式、Hooks 支持）
- 新版本更接近原生 TextInput API（类组件）
- 迁移需要调整回调函数、删除或重写 type 属性、手动处理小数等
- 总体迁移复杂度中等

**迁移优先级**: 需要测试和调整，建议先在小范围内验证迁移效果。

迁移清单：
- ✅ 更新 import 语句，导入 StepperOperateType
- ✅ 调整 onChange 回调，处理新的签名
- ✅ 删除或重写 type 属性
- ✅ 处理 digits 小数格式化
- ✅ 更新属性名称 (inputReadOnly → editable, inputKeyboardType → keyboardType)
- ✅ 处理 Ref 相关操作
- ✅ 处理 disabled 状态
- ✅ 完整测试所有功能
