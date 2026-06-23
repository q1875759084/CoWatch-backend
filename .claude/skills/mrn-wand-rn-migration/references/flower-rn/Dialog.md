# Dialog 对话框

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface DialogProps {
  /** 是否展示 */
  visible: boolean
  
  /** 头部区域的图片 */
  image?: ImageSourcePropType
  
  /** 标题 */
  title?: string | React.ReactNode
  
  /** 主内容 */
  content?: string | React.ReactNode
  
  /** 底部按钮组 */
  actions?: Array<{
    text: string
    type?: 'cancel' | 'confirm'  // 默认 'cancel'
    onPress?: (val?: string) => void
  }>
  
  /** 底部提示 */
  bottomText?: string | React.ReactNode
  
  /** 是否可以点击 mask 关闭 */
  maskClosable?: boolean  // 默认 false
  
  /** 点击 x 的回调 */
  onClose?: () => void
  
  /** 是否展示输入框 */
  showInput?: boolean
  
  /** 输入框 placeholder */
  inputPlaceholder?: string
  
  /** 输入框的内容 */
  inputValue?: string
  
  /** 输入框类型 */
  inputType?: 'input' | 'textArea'  // 默认 'input'
  
  /** 最多可输入的字符长度 */
  maxLength?: number
  
  /** 是否内容可以滚动 */
  scrollable?: boolean  // 默认 false
  
  /** 是否展示关闭 icon */
  showCloseIcon?: boolean  // 默认 false
  
  /** 打开或关闭时动画结束回调 */
  onAnimationEnd?: (visible: boolean) => void
}

// 静态方法
Dialog.alert({ title, content, actions })
Dialog.prompt({ title, content, actions, type, placeholder, maxLength })
Dialog.show({ title, content, actions, image, bottomText, showCloseIcon, onClose, scrollable })
```

## 新组件 API

```tsx
interface DialogProps {
  /** 是否展示 */
  visible: boolean
  
  /** 头部区域的图片 */
  image?: ImageSourcePropType
  
  /** 标题 */
  title?: string | React.ReactNode
  
  /** 主内容 */
  content?: string | React.ReactNode
  
  /** 底部按钮组 */
  actions?: Array<{
    text: string
    type?: 'cancel' | 'confirm'  // 默认 'cancel'
    onPress?: (val?: string) => void
  }>
  
  /** 底部提示 */
  bottomText?: string | React.ReactNode
  
  /** 是否可以点击 mask 关闭 */
  maskClosable?: boolean  // 默认 false
  
  /** 点击 x 的回调 */
  onClose?: () => void
  
  /** 是否展示输入框 */
  showInput?: boolean
  
  /** 输入框 placeholder */
  inputPlaceholder?: string
  
  /** 输入框的内容 */
  inputValue?: string
  
  /** 输入框类型 */
  inputType?: 'input' | 'textArea'  // 默认 'input'
  
  /** 最多可输入的字符长度 */
  maxLength?: number
  
  /** 是否内容可以滚动 */
  scrollable?: boolean  // 默认 false
  
  /** 是否展示关闭 icon */
  showCloseIcon?: boolean  // 默认 false
  
  /** 打开或关闭时动画结束回调 */
  onAnimationEnd?: (visible: boolean) => void
}

// 静态方法 - 返回 number（Dialog id）
Dialog.alert({ title, content, actions }): number
Dialog.prompt({ title, content, actions, type, placeholder, maxLength }): number
Dialog.show({ title, content, actions, image, bottomText, showCloseIcon, onClose, scrollable }): number
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| visible | visible | 保持一致 |
| image | image | 保持一致 |
| title | title | 保持一致 |
| content | content | 保持一致 |
| actions | actions | 保持一致 |
| bottomText | bottomText | 保持一致 |
| maskClosable | maskClosable | 保持一致 |
| onClose | onClose | 保持一致 |
| showInput | showInput | 保持一致 |
| inputPlaceholder | inputPlaceholder | 保持一致 |
| inputValue | inputValue | 保持一致 |
| inputType | inputType | 保持一致 |
| maxLength | maxLength | 保持一致 |
| scrollable | scrollable | 保持一致 |
| showCloseIcon | showCloseIcon | 保持一致 |
| onAnimationEnd | onAnimationEnd | 保持一致 |

### 静态方法变更

| 旧版本 | 新版本 | 说明 |
|--------|--------|------|
| `Dialog.alert()` | `Dialog.alert()` | 保持一致，但返回值从 void 改为 number |
| `Dialog.prompt()` | `Dialog.prompt()` | 保持一致，但返回值从 void 改为 number |
| `Dialog.show()` | `Dialog.show()` | 保持一致，但返回值从 void 改为 number |

## 关键变更

### 1. 静态方法返回值改变
- **旧版本**：`Dialog.alert()` 等方法不返回值（void）
- **新版本**：`Dialog.alert()` 等方法返回 Dialog id（number）
- 返回的 id 可以用于后续关闭 Dialog 或其他操作

### 2. 完全 API 兼容
- 所有属性名称、类型、默认值保持完全一致
- 使用方式无需改动
- 仅需改变导入路径

### 3. 组件结构保持一致
- 仍然支持 JSX 组件方式
- 仍然支持函数调用方式
- 两种方式的功能保持一致

## 迁移示例

### 案例 1：基础对话框

```tsx
// 迁移前
import { Dialog } from '@sgfe/flower-rn'
import { useState } from 'react'

function MyComponent() {
  const [visible, setVisible] = useState(false)
  
  return (
    <>
      <Button onPress={() => setVisible(true)}>打开</Button>
      <Dialog
        visible={visible}
        title="提示"
        content="这是一条提示信息"
        actions={[
          { text: '取消', type: 'cancel', onPress: () => setVisible(false) },
          { text: '确认', type: 'confirm', onPress: () => setVisible(false) }
        ]}
        onClose={() => setVisible(false)}
      />
    </>
  )
}

// 迁移后 - 无需改动
import { Dialog } from '@sfe/wand-rn'
import { useState } from 'react'

function MyComponent() {
  const [visible, setVisible] = useState(false)
  
  return (
    <>
      <Button onPress={() => setVisible(true)}>打开</Button>
      <Dialog
        visible={visible}
        title="提示"
        content="这是一条提示信息"
        actions={[
          { text: '取消', type: 'cancel', onPress: () => setVisible(false) },
          { text: '确认', type: 'confirm', onPress: () => setVisible(false) }
        ]}
        onClose={() => setVisible(false)}
      />
    </>
  )
}
```

### 案例 2：函数调用方式 - alert

```tsx
// 迁移前
import { Dialog } from '@sgfe/flower-rn'

Dialog.alert({
  title: '温馨提示',
  content: '删除成功',
  actions: [
    { text: '关闭', type: 'confirm', onPress: () => {} }
  ]
})

// 迁移后 - 无需改动
import { Dialog } from '@sfe/wand-rn'

const dialogId = Dialog.alert({
  title: '温馨提示',
  content: '删除成功',
  actions: [
    { text: '关闭', type: 'confirm', onPress: () => {} }
  ]
})
// 返回值是 Dialog id，可以用于关闭 Dialog
```

### 案例 3：函数调用方式 - prompt

```tsx
// 迁移前
import { Dialog } from '@sgfe/flower-rn'

Dialog.prompt({
  title: '请输入反馈内容',
  content: '您的意见很重要',
  type: 'textArea',
  placeholder: '输入内容...',
  maxLength: 200,
  actions: [
    { text: '取消', type: 'cancel' },
    { text: '提交', type: 'confirm', onPress: (text) => handleSubmit(text) }
  ]
})

// 迁移后 - 无需改动
import { Dialog } from '@sfe/wand-rn'

const dialogId = Dialog.prompt({
  title: '请输入反馈内容',
  content: '您的意见很重要',
  type: 'textArea',
  placeholder: '输入内容...',
  maxLength: 200,
  actions: [
    { text: '取消', type: 'cancel' },
    { text: '提交', type: 'confirm', onPress: (text) => handleSubmit(text) }
  ]
})
```

### 案例 4：函数调用方式 - show

```tsx
// 迁移前
import { Dialog } from '@sgfe/flower-rn'

Dialog.show({
  title: '确认删除',
  content: '删除后无法恢复，是否继续？',
  bottomText: '此操作不可恢复',
  showCloseIcon: true,
  actions: [
    { text: '取消', type: 'cancel' },
    { text: '确认删除', type: 'confirm', onPress: () => handleDelete() }
  ],
  onClose: () => console.log('关闭')
})

// 迁移后 - 无需改动
import { Dialog } from '@sfe/wand-rn'

const dialogId = Dialog.show({
  title: '确认删除',
  content: '删除后无法恢复，是否继续？',
  bottomText: '此操作不可恢复',
  showCloseIcon: true,
  actions: [
    { text: '取消', type: 'cancel' },
    { text: '确认删除', type: 'confirm', onPress: () => handleDelete() }
  ],
  onClose: () => console.log('关闭')
})
```

### 案例 5：带图片的对话框

```tsx
// 迁移前
import { Dialog } from '@sgfe/flower-rn'

<Dialog
  visible={visible}
  image={require('./success.png')}
  title="操作成功"
  content="您的订单已提交"
  actions={[
    { text: '完成', type: 'confirm', onPress: () => setVisible(false) }
  ]}
  onClose={() => setVisible(false)}
/>

// 迁移后 - 无需改动
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  image={require('./success.png')}
  title="操作成功"
  content="您的订单已提交"
  actions={[
    { text: '完成', type: 'confirm', onPress: () => setVisible(false) }
  ]}
  onClose={() => setVisible(false)}
/>
```

### 案例 6：带关闭 icon 的对话框

```tsx
// 迁移前
import { Dialog } from '@sgfe/flower-rn'

<Dialog
  visible={visible}
  showCloseIcon
  title="信息提示"
  content="这是一条重要信息"
  actions={[
    { text: '确认', type: 'confirm', onPress: () => setVisible(false) }
  ]}
  onClose={() => setVisible(false)}
/>

// 迁移后 - 无需改动
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  showCloseIcon
  title="信息提示"
  content="这是一条重要信息"
  actions={[
    { text: '确认', type: 'confirm', onPress: () => setVisible(false) }
  ]}
  onClose={() => setVisible(false)}
/>
```

### 案例 7：可滚动内容的对话框

```tsx
// 迁移前
import { Dialog } from '@sgfe/flower-rn'

<Dialog
  visible={visible}
  title="条款和条件"
  content={<LongContent />}
  scrollable
  actions={[
    { text: '不同意', type: 'cancel', onPress: () => setVisible(false) },
    { text: '同意', type: 'confirm', onPress: () => setVisible(false) }
  ]}
  onClose={() => setVisible(false)}
/>

// 迁移后 - 无需改动
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  title="条款和条件"
  content={<LongContent />}
  scrollable
  actions={[
    { text: '不同意', type: 'cancel', onPress: () => setVisible(false) },
    { text: '同意', type: 'confirm', onPress: () => setVisible(false) }
  ]}
  onClose={() => setVisible(false)}
/>
```

### 案例 8：单输入框 prompt

```tsx
// 迁移前
import { Dialog } from '@sgfe/flower-rn'

Dialog.prompt({
  title: '请输入您的名字',
  content: '告诉我们您叫什么',
  type: 'input',
  placeholder: '输入名字...',
  actions: [
    { text: '取消', type: 'cancel' },
    { text: '确认', type: 'confirm', onPress: (name) => handleName(name) }
  ]
})

// 迁移后 - 无需改动
import { Dialog } from '@sfe/wand-rn'

const dialogId = Dialog.prompt({
  title: '请输入您的名字',
  content: '告诉我们您叫什么',
  type: 'input',
  placeholder: '输入名字...',
  actions: [
    { text: '取消', type: 'cancel' },
    { text: '确认', type: 'confirm', onPress: (name) => handleName(name) }
  ]
})
```

### 案例 9：多行输入框 prompt

```tsx
// 迁移前
import { Dialog } from '@sgfe/flower-rn'

Dialog.prompt({
  title: '请提供反馈',
  content: '您的反馈对我们很重要',
  type: 'textArea',
  placeholder: '输入您的想法...',
  maxLength: 500,
  actions: [
    { text: '取消', type: 'cancel' },
    { text: '提交', type: 'confirm', onPress: (feedback) => handleFeedback(feedback) }
  ]
})

// 迁移后 - 无需改动
import { Dialog } from '@sfe/wand-rn'

const dialogId = Dialog.prompt({
  title: '请提供反馈',
  content: '您的反馈对我们很重要',
  type: 'textArea',
  placeholder: '输入您的想法...',
  maxLength: 500,
  actions: [
    { text: '取消', type: 'cancel' },
    { text: '提交', type: 'confirm', onPress: (feedback) => handleFeedback(feedback) }
  ]
})
```

### 案例 10：完整使用示例

```tsx
// 迁移前
import { Dialog } from '@sgfe/flower-rn'
import { Button } from '@sgfe/flower-rn'
import { useState } from 'react'

function OrderConfirmDialog() {
  const [visible, setVisible] = useState(false)
  
  return (
    <>
      <Button onPress={() => setVisible(true)}>确认订单</Button>
      
      <Dialog
        visible={visible}
        title="订单确认"
        content="请确认订单信息无误，提交后不可修改"
        bottomText="确认后将进入支付流程"
        showCloseIcon
        scrollable
        actions={[
          { text: '返回修改', type: 'cancel', onPress: () => setVisible(false) },
          { 
            text: '确认提交', 
            type: 'confirm', 
            onPress: () => {
              handleSubmit()
              setVisible(false)
            } 
          }
        ]}
        onClose={() => setVisible(false)}
      />
    </>
  )
}

// 迁移后 - 无需改动
import { Dialog } from '@sfe/wand-rn'
import { Button } from '@sfe/wand-rn'
import { useState } from 'react'

function OrderConfirmDialog() {
  const [visible, setVisible] = useState(false)
  
  return (
    <>
      <Button onPress={() => setVisible(true)}>确认订单</Button>
      
      <Dialog
        visible={visible}
        title="订单确认"
        content="请确认订单信息无误，提交后不可修改"
        bottomText="确认后将进入支付流程"
        showCloseIcon
        scrollable
        actions={[
          { text: '返回修改', type: 'cancel', onPress: () => setVisible(false) },
          { 
            text: '确认提交', 
            type: 'confirm', 
            onPress: () => {
              handleSubmit()
              setVisible(false)
            } 
          }
        ]}
        onClose={() => setVisible(false)}
      />
    </>
  )
}
```

## 关键点

- **完全 API 兼容**：所有属性、方法、功能保持一致
- **静态方法返回值改变**：返回 Dialog id（number），可用于后续操作
- **使用方式无需改动**：既支持 JSX 组件方式，也支持函数调用方式
- **推荐迁移步骤**：
  1. 将导入改为 `import { Dialog } from '@sfe/wand-rn'`
  2. 如使用了返回值，可以获取 Dialog id
  3. 其他代码无需改动
- **需要 Provider**：使用前需要在 App 入口处增加 `WandRnProvider`
- **函数调用方式优势**：返回 Dialog id 可用于高级场景
