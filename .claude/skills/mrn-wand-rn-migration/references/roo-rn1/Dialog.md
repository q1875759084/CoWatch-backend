# Dialog 对话框

## 从何处迁移
- **源库**: `@roo/roo-rn1`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface DialogOperationItem {
  /** 按钮文案 */
  label: string
  /** 按钮类型 */
  type: 'cancel' | 'confirm'
  /** 是否不需要主动关闭弹窗 */
  noAutoClose?: boolean
  /** 点击按钮的回调 */
  callback?: (
    data: Omit<DialogOperationItem, 'callback'> & { inputValue: string },
    index: number
  ) => void
}

export interface DialogContainerProps extends WithThemeStyles<DialogStyles> {
  /** 头部区域，可以是 ReactElement 或字符串 */
  header?: JSX.Element | string
  /** 内容区域 */
  body?: DialogBodyItem[] | string | JSX.Element
  /** 点击取消按钮的回调 */
  cancelCallback?: (data: DialogOperationItem, index: number) => void
  /** 取消按钮的文案 */
  cancelLabel?: string
  /** 点击确认按钮的回调 */
  confirmCallback?: (data: DialogOperationItem, index: number) => void
  /** 确认按钮的文案 */
  confirmLabel?: string
  /** 是否展示输入框 */
  showInput?: boolean
  /** 输入框的 placeholder */
  placeholder?: string
  /** 默认 input value */
  defaultInputValue?: any
  /** 自定义 TextInput 组件 props */
  textInputProps?: TextInputProps
  /** 输入框 onFocus */
  inputFocus?: (event: TextInputFocusEventData | '') => void
  /** 输入框 onChange */
  inputChange?: (value: string, event: NativeSyntheticEvent<TextInputChangeEventData>) => void
  /** 操作按钮布局方式 */
  operationLayout?: 'row' | 'column'
  /** 操作按钮数组 */
  operationList?: Array<DialogOperationItem>
  /** 自定义按钮渲染 */
  renderOperationItem?: (item: DialogOperationItem, index: number) => JSX.Element
  /** 控制 Modal 弹窗 */
  modalProps?: ModalProps
  /** 输入框包裹样式 */
  inputWrapperStyle?: StyleProp<ViewStyle>
  /** 输入框样式 */
  inputStyle?: StyleProp<ViewStyle>
  /** 副标题样式 */
  subTitleStyles?: StyleProp<TextStyle>
  /** 包裹弹窗内容区域样式 */
  wrapperStyles?: StyleProp<ViewStyle>
  /** 弹窗内容区域样式 */
  containerStyles?: StyleProp<ViewStyle>
  /** 是否点击按钮时自动关闭 */
  autoClose?: boolean
  /** 自定义操作按钮下方内容 */
  renderOperationsBelow?: () => JSX.Element
  /** 自定义输入框下方内容 */
  renderInputBelow?: () => JSX.Element
}

export interface DialogProps extends DialogContainerProps {
  /** 控制 Dialog 的显示隐藏 */
  visible?: boolean
}

// 静态方法（命令式调用）
Dialog.open(options: DialogOption): TopViewManager
Dialog.alert(options: DialogOption): TopViewManager
Dialog.prompt(options: DialogOption): TopViewManager
```

## 新组件 API

```tsx
export interface DialogProps extends WithThemeStyles<DialogStyle> {
  /** 是否展示 dialog */
  visible: boolean
  /** 头部图片 */
  image?: ImageSourcePropType
  /** 标题 */
  title?: string | React.ReactNode
  /** 主内容 */
  content?: string | React.ReactNode
  /** 底部按钮 */
  actions?: {
    text: string
    type?: 'cancel' | 'confirm'
    onPress?: (val?: string) => void
  }[]
  /** 底部提示 */
  bottomText?: string | React.ReactNode
  /** 是否可以点击 mask 关闭 */
  maskClosable?: boolean
  /** 点击关闭的回调 */
  onClose?: () => void
  /** 是否展示输入框 */
  showInput?: boolean
  /** 输入框 placeholder */
  inputPlaceholder?: string
  /** 输入框内容 */
  inputValue?: string
  /** 输入框类型 */
  inputType?: 'input' | 'textArea'
  /** 最多可输入的字符长度 */
  maxLength?: number
  /** 内容是否可滚动 */
  scrollable?: boolean
  /** 是否展示关闭图标 */
  showCloseIcon?: boolean
  /** 动画结束回调 */
  onAnimationEnd?: (visible: boolean) => void
}

// 静态方法（命令式调用，基于 Portal）
Dialog.alert(props: AlertProps): number
Dialog.prompt(props: PromptProps): number
Dialog.show(props: OperationProps): number
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| visible | visible | 保持一致 |
| header | title | 重命名，类型从 `JSX.Element \| string` 改为 `string \| React.ReactNode` |
| body | content | 重命名，不再支持 `DialogBodyItem[]` 数组 |
| cancelCallback + cancelLabel | actions | 合并为统一的 actions 数组 |
| confirmCallback + confirmLabel | actions | 合并为统一的 actions 数组 |
| operationList | actions | 重命名，按钮结构从 `{label, type, callback}` 改为 `{text, type, onPress}` |
| operationLayout | - | 移除，新组件不支持 column 布局 |
| renderOperationItem | - | 移除，不再支持自定义按钮渲染 |
| showInput | showInput | 保持一致 |
| placeholder | inputPlaceholder | 重命名 |
| defaultInputValue | inputValue | 从非受控改为受控模式 |
| textInputProps | - | 移除 |
| inputFocus | - | 移除 |
| inputChange | - | 移除，通过 actions 的 onPress 获取输入值 |
| - | inputType | 新增，支持 'input' \| 'textArea' |
| - | maxLength | 新增，输入字符限制 |
| modalProps | maskClosable | 不再透传整个 modalProps，仅保留 maskClosable |
| autoClose | - | 移除，按钮点击自动关闭 |
| inputWrapperStyle | - | 移除 |
| inputStyle | - | 移除 |
| subTitleStyles | - | 移除 |
| wrapperStyles | - | 移除 |
| containerStyles | - | 移除 |
| renderOperationsBelow | - | 移除 |
| renderInputBelow | - | 移除 |
| - | image | 新增，支持头部图片 |
| - | bottomText | 新增，底部提示文字 |
| - | scrollable | 新增，内容可滚动 |
| - | showCloseIcon | 新增，显示关闭图标 |
| - | onClose | 新增，关闭回调 |
| - | onAnimationEnd | 新增，动画结束回调 |

### 静态方法对照

| 旧方法 | 新方法 | 说明 |
|--------|--------|------|
| Dialog.open(options) | Dialog.show(props) | 重命名，返回值从 TopViewManager 改为 Portal key (number) |
| Dialog.alert(options) | Dialog.alert(props) | 保持，但参数结构变更 |
| Dialog.prompt(options) | Dialog.prompt(props) | 保持，但参数结构变更 |

## 迁移示例

### 案例 1：基础 JSX 对话框

```tsx
// 迁移前
import { Dialog } from '@roo/roo-rn1'

<Dialog
  visible={visible}
  header="提示"
  body="确定要删除吗？"
  cancelLabel="取消"
  cancelCallback={() => setVisible(false)}
  confirmLabel="确定"
  confirmCallback={() => {
    handleDelete()
    setVisible(false)
  }}
/>

// 迁移后
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  title="提示"
  content="确定要删除吗？"
  actions={[
    { text: '取消', type: 'cancel', onPress: () => setVisible(false) },
    { text: '确定', type: 'confirm', onPress: () => {
      handleDelete()
      setVisible(false)
    }},
  ]}
/>
```

### 案例 2：命令式调用 alert

```tsx
// 迁移前
import { Dialog } from '@roo/roo-rn1'

const instance = Dialog.alert({
  title: '温馨提示',
  message: '操作成功',
  confirmLabel: '知道了',
  confirmCallback: () => null,
})
// instance.close() 可手动关闭

// 迁移后
import { Dialog } from '@sfe/wand-rn'

Dialog.alert({
  title: '温馨提示',
  content: '操作成功',
  actions: [
    { text: '知道了', type: 'confirm' },
  ],
})
```

### 案例 3：命令式调用 open → show

```tsx
// 迁移前
import { Dialog } from '@roo/roo-rn1'

const instance = Dialog.open({
  title: '选择操作',
  message: '请选择您要执行的操作',
  cancelLabel: '取消',
  cancelCallback: () => null,
  confirmLabel: '确定',
  confirmCallback: () => handleAction(),
})

// 迁移后
import { Dialog } from '@sfe/wand-rn'

Dialog.show({
  title: '选择操作',
  content: '请选择您要执行的操作',
  actions: [
    { text: '取消', type: 'cancel' },
    { text: '确定', type: 'confirm', onPress: () => handleAction() },
  ],
})
```

### 案例 4：带输入框的 prompt

```tsx
// 迁移前
import { Dialog } from '@roo/roo-rn1'

Dialog.prompt({
  title: '请输入备注',
  placeholder: '请输入',
  showInput: true,
  confirmLabel: '提交',
  confirmCallback: (data) => {
    console.log('输入值:', data.inputValue)
  },
})

// 迁移后
import { Dialog } from '@sfe/wand-rn'

Dialog.prompt({
  title: '请输入备注',
  placeholder: '请输入',
  actions: [
    { text: '取消', type: 'cancel' },
    { text: '提交', type: 'confirm', onPress: (val) => {
      console.log('输入值:', val)
    }},
  ],
})
```

### 案例 5：operationList 多按钮

```tsx
// 迁移前
import { Dialog } from '@roo/roo-rn1'

<Dialog
  visible={visible}
  header="选择操作"
  body="请选择以下操作之一"
  operationList={[
    { label: '取消', type: 'cancel', callback: () => setVisible(false) },
    { label: '删除', type: 'confirm', callback: () => handleDelete() },
    { label: '编辑', type: 'confirm', callback: () => handleEdit() },
  ]}
  operationLayout="column"
/>

// 迁移后
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  title="选择操作"
  content="请选择以下操作之一"
  actions={[
    { text: '取消', type: 'cancel', onPress: () => setVisible(false) },
    { text: '删除', type: 'confirm', onPress: () => handleDelete() },
    { text: '编辑', type: 'confirm', onPress: () => handleEdit() },
  ]}
/>
// 注意：operationLayout="column" 不再支持，按钮固定为横向布局
```

### 案例 6：带 modalProps 配置

```tsx
// 迁移前
import { Dialog } from '@roo/roo-rn1'

<Dialog
  visible={visible}
  header="标题"
  body="内容"
  modalProps={{
    maskClosable: true,
    animationType: 'fade',
  }}
  cancelLabel="取消"
  cancelCallback={() => setVisible(false)}
  confirmLabel="确定"
  confirmCallback={() => setVisible(false)}
/>

// 迁移后
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  title="标题"
  content="内容"
  maskClosable={true}
  onClose={() => setVisible(false)}
  actions={[
    { text: '取消', type: 'cancel', onPress: () => setVisible(false) },
    { text: '确定', type: 'confirm', onPress: () => setVisible(false) },
  ]}
/>
// 注意：animationType 等 modalProps 内部配置不再支持透传
```

### 案例 7：自定义内容

```tsx
// 迁移前
import { Dialog } from '@roo/roo-rn1'

<Dialog
  visible={visible}
  header={<View><Text style={{fontSize: 18}}>自定义标题</Text></View>}
  body={<View><Image source={img} /><Text>自定义内容</Text></View>}
  confirmLabel="确定"
  confirmCallback={() => setVisible(false)}
/>

// 迁移后
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  title={<View><Text style={{fontSize: 18}}>自定义标题</Text></View>}
  content={<View><Image source={img} /><Text>自定义内容</Text></View>}
  actions={[
    { text: '确定', type: 'confirm', onPress: () => setVisible(false) },
  ]}
/>
```

### 案例 8：关闭图标和图片

```tsx
// 迁移前 — 旧组件不支持头部图片和关闭图标
import { Dialog } from '@roo/roo-rn1'

<Dialog
  visible={visible}
  header="标题"
  body="内容"
  confirmLabel="确定"
  confirmCallback={() => setVisible(false)}
/>

// 迁移后 — 新增 image、showCloseIcon、bottomText
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  image={require('./banner.png')}
  title="标题"
  content="内容"
  showCloseIcon={true}
  onClose={() => setVisible(false)}
  bottomText="更多详情请咨询客服"
  actions={[
    { text: '确定', type: 'confirm', onPress: () => setVisible(false) },
  ]}
/>
```

## 关键点

### 1. 按钮系统完全重构
- 旧版本：通过 `cancelLabel/cancelCallback` + `confirmLabel/confirmCallback` 或 `operationList` 定义按钮
- 新版本：统一使用 `actions` 数组，每个按钮包含 `{text, type, onPress}`
- 按钮回调从 `callback(data, index)` 改为 `onPress(val?)`，prompt 场景下 `val` 为输入值

### 2. 命令式调用变更
- 旧版本：`Dialog.open/alert/prompt` 返回 `TopViewManager` 实例，可调用 `.close()/.remove()`
- 新版本：`Dialog.show/alert/prompt` 返回 Portal key (`number`)，通过 Portal 管理生命周期
- `Dialog.open` 重命名为 `Dialog.show`

### 3. 头部和内容属性重命名
- `header` → `title`
- `body` → `content`
- `message`（命令式调用参数）→ `content`

### 4. 大量自定义样式属性移除
- 移除 `inputWrapperStyle`、`inputStyle`、`subTitleStyles`、`wrapperStyles`、`containerStyles`
- 移除 `renderOperationItem`、`renderOperationsBelow`、`renderInputBelow`
- 样式定制通过 `styles` (WithThemeStyles) 实现

### 5. 输入框处理变更
- 旧版本：通过 `inputChange/inputFocus/textInputProps` 精细控制输入框
- 新版本：简化为 `showInput/inputPlaceholder/inputType/inputValue/maxLength`
- 输入值在 `actions` 的 `onPress(val)` 中获取

### 6. 新增功能
- `image`：支持头部展示图片
- `showCloseIcon` + `onClose`：支持关闭按钮
- `bottomText`：底部提示文字
- `scrollable`：内容区域可滚动
- `onAnimationEnd`：动画结束回调

## 注意事项

1. **按钮回调参数变更**：旧版 `callback(data, index)` 中 `data` 包含完整按钮信息和 `inputValue`；新版 `onPress(val)` 中 `val` 仅在 prompt 模式下为输入值
2. **operationLayout 移除**：旧版支持 `'row' | 'column'` 布局，新版仅支持横向排列
3. **命令式返回值变更**：旧版返回 `TopViewManager` 可手动 `.close()`，新版返回 `number` 类型的 Portal key
4. **noAutoClose 移除**：旧版可在 operationList 中设置 `noAutoClose`，新版按钮点击后由开发者在 `onPress` 中控制是否关闭
5. **modalProps 简化**：不再支持透传完整的 `ModalProps`，仅提取 `maskClosable` 为独立属性
6. **body 不再支持数组**：旧版 `body` 支持 `DialogBodyItem[]`（title + text），新版 `content` 仅支持 string 或 ReactNode

## 迁移检查清单

- [ ] 将 `header` 属性替换为 `title`
- [ ] 将 `body` 属性替换为 `content`
- [ ] 将 `cancelLabel/cancelCallback` + `confirmLabel/confirmCallback` 替换为 `actions` 数组
- [ ] 将 `operationList` 替换为 `actions`，按钮字段从 `{label, callback}` 改为 `{text, onPress}`
- [ ] 将 `Dialog.open()` 替换为 `Dialog.show()`
- [ ] 更新命令式调用参数：`title/message` → `title/content` + `actions`
- [ ] 移除 `operationLayout` 属性
- [ ] 移除所有自定义样式属性（`inputWrapperStyle`、`containerStyles` 等）
- [ ] 移除 `renderOperationItem`、`renderOperationsBelow`、`renderInputBelow`
- [ ] 移除 `inputChange`、`inputFocus`、`textInputProps`，改用 `inputPlaceholder` + `inputType`
- [ ] 移除 `autoClose`、`noAutoClose` 相关逻辑
- [ ] 将 `placeholder` 替换为 `inputPlaceholder`
- [ ] 检查命令式调用的返回值用法，从 `.close()/.remove()` 改为 Portal 管理
- [ ] 测试 prompt 模式下输入值获取是否正确
- [ ] 确认 `body` 使用 `DialogBodyItem[]` 数组的场景已改为 ReactNode
