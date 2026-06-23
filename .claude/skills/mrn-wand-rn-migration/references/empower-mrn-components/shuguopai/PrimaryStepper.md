# PrimaryStepper 主要步进器

## 从何处迁移
- **源库**: `@mtfe/empower-fulfillment-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`
- **对应目标组件**: `Stepper`

## 旧组件 API

```tsx
interface StepperProps extends Omit<TextInputProps, 'value' | 'onChange'> {
    /**
     * 最小允许的值 默认不限制
     */
    min?: number

    /**
     * 最大允许的值 默认不限制
     */
    max?: number

    /**
     * 是否禁用
     */
    disable?: boolean

    /**
     * 校验的规则, 默认为数字
     */
    rule?: RegExp

    /**
     * 每次增减的步长
     */
    step?: number

    value?: string | number

    /**
     * 是否允许手动输入，默认允许
     */
    editable?: boolean

    /**
     * 无值时默认展示的内容，会置灰展示
     */
    placeholder?: string
    
    /**
     * 是否启用输入规则校验,默认false不启用,目前不支持负数、小数的校验
     */
    enableInputValidate?: boolean

    onChange?: StepperChangeCallback
    controlSource?: StepperControlSourceFunc
    underlayColor?: string

    style?: StyleProp<ViewStyle>
    inputStyle?: StyleProp<TextStyle>
    constrolStyle?: StyleProp<ImageStyle> | StepperControlStyleFunc
}

type PrimaryStepperProps = StepperProps
```

## 新组件 API

```tsx
interface StepperProps {
    value: number
    /**
     * @default primary
     */
    type?: 'primary' | 'normal'
    /**
     * @default 1
     */
    step?: number
    /**
     * 格式化到小数点后固定位数，设置为 0 表示格式化到整数
     */
    digits?: number
    min?: number
    max?: number
    disabled?: boolean
    /**
     * 输入框是否只读
     * @default false
     */
    inputReadOnly?: boolean
    /**
     * input 呼起键盘的类型
     * @default 'numeric'
     */
    inputKeyboardType?: TextInputProps['keyboardType']
    returnKeyType?: TextInputProps['returnKeyType']
    onSubmitEditing?: TextInputProps['onSubmitEditing']
    blurOnSubmit?: TextInputProps['blurOnSubmit']
    /**
     * 步进器尺寸
     */
    size?: 's' | 'm'
    onChange?: (value: number) => void
    onBlur?: () => void
    onFocus?: () => void
    onPressWhenDisabled?: (option: { scene: 'minus' | 'plus'; min: number; max: number; value: number }) => void
    /**
     * 自定义大小
     */
    customSize?: number
    inputStyle?: TextStyle
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| value | value | 值，但新组件要求 number 类型，不支持 string |
| min | min | 最小值 |
| max | max | 最大值 |
| disable | disabled | 禁用属性，属性名变更 |
| step | step | 步长，默认值均为 1 |
| editable | inputReadOnly | 反向逻辑：editable=true 对应 inputReadOnly=false |
| placeholder | - | 新组件不支持 placeholder |
| rule | - | 新组件移除了正则校验，使用内置的数字验证 |
| enableInputValidate | - | 新组件移除了此配置，总是启用数字验证 |
| onChange | onChange | 回调签名变更：(value: string \| number, operateType: StepperOperateType) 变为 (value: number) |
| controlSource | type | 新组件用 type='primary' 代替自定义的 controlSource |
| underlayColor | - | 新组件移除了此属性 |
| style | - | 样式通过标准 React Native 方式处理 |
| inputStyle | inputStyle | 保留，但仅支持 TextStyle 类型 |
| constrolStyle | - | 新组件移除了，按钮样式由 type 属性控制 |
| - | digits | 新增：小数点位数格式化 |
| - | onBlur | 新增：失焦回调 |
| - | onFocus | 新增：聚焦回调 |
| - | inputKeyboardType | 新增：键盘类型配置 |
| - | size | 新增：尺寸配置（'s' 或 'm'） |
| - | customSize | 新增：自定义按钮尺寸 |
| - | onPressWhenDisabled | 新增：禁用状态下的点击回调 |

## 关键差异

### 1. 值类型变化
- **旧**：支持 `string | number`
- **新**：仅支持 `number`
- 需要确保传入和处理的值都是数字类型

### 2. 禁用属性命名
- **旧**：`disable`
- **新**：`disabled`

### 3. 编辑控制
- **旧**：通过 `editable` 属性
- **新**：通过 `inputReadOnly` 属性（逻辑相反）
  ```tsx
  // 旧
  <PrimaryStepper editable={true} />
  
  // 新
  <Stepper inputReadOnly={false} />
  ```

### 4. 样式定制
- **旧**：支持自定义 `controlSource`（控制按钮图标）和 `underlayColor`（点击效果）
- **新**：通过 `type` 属性选择样式（'primary' 或 'normal'），不支持自定义图标
- 如果需要完全自定义外观，可能需要修改业务逻辑

### 5. 回调函数变化
- **旧**：`onChange(val: string | number, operateType: StepperOperateType)`
  - 包含操作类型信息（增加、减少、编辑）
- **新**：`onChange(value: number)`
  - 仅传递新值，不区分操作类型
- 如需操作类型，使用 `onPressWhenDisabled` 的 `scene` 参数

### 6. 键盘管理
- **旧**：自动处理
- **新**：提供了更多键盘相关属性控制
  - `inputKeyboardType`：键盘类型
  - `returnKeyType`：返回键样式
  - `onSubmitEditing`：提交事件
  - `blurOnSubmit`：提交后是否失焦

### 7. 小数处理
- **旧**：无内置小数支持，需自行处理
- **新**：通过 `digits` 属性指定小数位数
  ```tsx
  <Stepper digits={2} />  // 保留两位小数
  ```

## 迁移示例

### 案例 1：基础使用

```tsx
// 迁移前
import { PrimaryStepper } from '@mtfe/empower-fulfillment-mrn-components/shuguopai'

const [value, setValue] = useState(1)

<PrimaryStepper
  value={value}
  onChange={(val) => setValue(val)}
/>

// 迁移后
import { Stepper } from '@sfe/wand-rn'

const [value, setValue] = useState(1)

<Stepper
  value={value}
  type="primary"
  onChange={setValue}
/>
```

### 案例 2：带范围限制

```tsx
// 迁移前
<PrimaryStepper
  value={value}
  min={0}
  max={100}
  step={5}
  disable={isDisabled}
  onChange={(val) => setValue(val)}
/>

// 迁移后
<Stepper
  value={value}
  min={0}
  max={100}
  step={5}
  disabled={isDisabled}
  type="primary"
  onChange={setValue}
/>
```

### 案例 3：只读输入框

```tsx
// 迁移前
<PrimaryStepper
  value={value}
  editable={false}
  onChange={(val) => setValue(val)}
/>

// 迁移后
<Stepper
  value={value}
  inputReadOnly={true}
  type="primary"
  onChange={setValue}
/>
```

### 案例 4：小数处理

```tsx
// 迁移前 - 需要手动处理小数
<PrimaryStepper
  value={value}
  step={0.1}
  onChange={(val) => setValue(Number(val).toFixed(2))}
/>

// 迁移后 - 内置小数支持
<Stepper
  value={value}
  step={0.1}
  digits={2}  // 自动格式化到两位小数
  type="primary"
  onChange={setValue}
/>
```

### 案例 5：禁用时的交互反馈

```tsx
// 迁移前 - 无直接支持
<PrimaryStepper
  value={value}
  min={0}
  max={100}
  disable={value >= 100}
  onChange={(val) => setValue(val)}
/>

// 迁移后 - 提供禁用状态回调
<Stepper
  value={value}
  min={0}
  max={100}
  type="primary"
  disabled={value >= 100}
  onChange={setValue}
  onPressWhenDisabled={({ scene, min, max }) => {
    if (scene === 'plus' && value >= max) {
      console.log('已达到最大值')
    }
  }}
/>
```

## 常见迁移问题

### Q1: 旧代码有 `controlSource` 自定义按钮图标，如何迁移？
- **A**: 新组件不支持自定义按钮图标。如果需要完全自定义外观，需要：
  1. 基于 `Stepper` 重新包装
  2. 或使用其他组件库方案
  3. 联系设计团队，使用新的样式规范

### Q2: onChange 回调中需要操作类型信息？
- **A**: 新组件的 onChange 不提供操作类型。可选方案：
  1. 在禁用状态下通过 `onPressWhenDisabled` 的 `scene` 字段判断
  2. 对于编辑场景，通过 `onFocus`/`onBlur` 判断用户是否在编辑

### Q3: 需要支持负数或特殊格式验证？
- **A**: 新组件内置数字验证，不支持自定义规则。如需特殊验证：
  1. 在 onChange 回调中手动验证
  2. 在需要时重新设置正确的值

### Q4: 旧代码中 value 是字符串怎么办？
- **A**: 确保在迁移前转换为 number：
  ```tsx
  const value = Number(oldStringValue) || 0
  ```

## 迁移检查清单

- [ ] 确认所有 `value` 都是 number 类型
- [ ] 将 `disable` 改为 `disabled`
- [ ] 将 `editable` 反向转换为 `inputReadOnly`
- [ ] 更新 onChange 回调，移除 StepperOperateType 参数
- [ ] 如果使用 `controlSource`，需要重新评估实现方案
- [ ] 如果有 placeholder 需求，考虑使用其他方案
- [ ] 测试 min/max 边界情况
- [ ] 如果需要小数，配置 `digits` 属性
- [ ] 如果有禁用状态反馈需求，使用 `onPressWhenDisabled`
