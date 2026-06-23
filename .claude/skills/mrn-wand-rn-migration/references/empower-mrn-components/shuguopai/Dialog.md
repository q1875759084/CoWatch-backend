# Dialog 对话框

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface DialogProps {
    show?: boolean  // 默认 false，是否显示对话框
    closable?: boolean  // 默认 false，是否显示关闭图标
    cancelable?: boolean  // 默认 true，是否可以通过蒙层关闭
    maskOpacity?: number  // 默认 0.6，蒙层透明度
    maskStyle?: StyleProp<ViewStyle>  // 蒙层样式
    title?: string | React.ReactElement<any>  // 对话框标题
    titleStyle?: StyleProp<TextStyle>  // 对话框标题样式
    message?: string | React.ReactElement<any>  // 对话框提示语
    messageStyle?: StyleProp<TextStyle>  // 对话框提示语样式
    image?: ImageSourcePropType | React.ReactElement<any>  // 图片
    imageShape?: 'square' | 'circle'  // 默认 'circle'，图片形状
    imagePosition?: 'above-title' | 'under-title'  // 图片位置（由 imageShape 决定）
    imageStyle?: StyleProp<ImageStyle>  // 图片样式
    imageProps?: ImageProps  // 图片其他属性
    input?: boolean | React.ReactElement<any>  // 默认 false，是否显示输入框
    inputValue?: string  // 默认 ''，输入框初始值
    inputPlaceholder?: string  // 默认 '请输入'，输入框占位
    inputStyle?: StyleProp<TextStyle>  // 输入框样式
    inputProps?: TextInputProps  // 输入框其他属性
    buttons?: Array<DailogButtonProps>  // 操作按钮列表
    layout?: 'horizontal' | 'vertical'  // 默认 'horizontal'，操作按钮布局
    style?: StyleProp<ViewStyle>  // 对话框样式
    contentStyle?: StyleProp<ViewStyle>  // 内容区域样式
    footerStyle?: StyleProp<ViewStyle>  // 按钮区域样式
    onRequestClose?: () => void  // 关闭回调
    onInputSubmit?: (text: string) => void  // 输入框提交回调
}

interface DailogButtonProps extends Omit<TouchableHighlightProps, 'onPress'> {
    text: string  // 按钮文案
    type?: 'cancel' | 'confirm'  // 默认 'confirm'，按钮类型
    textStyle?: StyleProp<TextStyle>  // 按钮文案样式
    onPress?: (val?: string) => void  // 按钮事件
}
```

## 新组件 API

```tsx
interface DialogProps {
    visible: boolean  // 是否展示
    title?: string | React.ReactNode  // 自定义标题
    content?: string | React.ReactNode  // 自定义内容区域
    actions?: Array<DialogActionsProps>  // 底部按钮组
    image?: ImageSourcePropType  // 自定义头部区域图片配置
    bottomText?: string | React.ReactNode  // 自定义底部提示
    showCloseIcon?: boolean  // 默认 false，是否展示关闭 icon
    scrollable?: boolean  // 默认 false，内容区过长是否可以竖直滚动
    maskClosable?: boolean  // 默认 false，是否可以点击 mask 关闭
    onClose?: () => void  // 关闭弹窗时的回调
    showInput?: boolean  // 是否展示输入框
    inputPlaceholder?: string  // 输入框 placeholder
    inputValue?: string  // 输入框的内容
    inputType?: 'input' | 'textArea'  // 默认 'input'，输入框类型
    maxLength?: number  // 最多可输入的字符长度
    onAnimationEnd?: (visible: boolean) => void  // 打开或关闭时动画结束回调
}

interface DialogActionsProps {
    text: string  // 按钮文案
    type?: 'cancel' | 'confirm'  // 默认 'cancel'，按钮类型
    onPress?: (val?: string) => void  // 按钮事件
}

// 函数式调用
Dialog.alert(options: AlertProps)  // 警告提示
Dialog.prompt(options: PromptProps)  // 输入提示
Dialog.show(options: OperationProps)  // 通用弹窗
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| show | visible | 属性名变更，控制显示/隐藏 |
| message | content | 内容属性名变更 |
| messageStyle | - | 新组件不支持自定义内容样式 |
| buttons | actions | 按钮属性名变更 |
| closable | showCloseIcon | 属性名变更 |
| cancelable | maskClosable | 属性名变更，语义更明确 |
| onRequestClose | onClose | 回调名变更 |
| input | showInput | 布尔值属性名变更 |
| inputValue | inputValue | 保持不变 |
| inputPlaceholder | inputPlaceholder | 保持不变 |
| inputStyle | - | 新组件不支持自定义输入框样式 |
| inputProps | inputType + maxLength | 简化为特定属性 |
| onInputSubmit | - | 新组件通过 actions 按钮的 onPress 获取输入值 |
| layout | - | 新组件固定横向布局（单按钮除外） |
| maskOpacity | - | 新组件使用固定遮罩透明度 |
| maskStyle | - | 新组件不支持自定义遮罩样式 |
| style | - | 新组件不支持自定义整体样式 |
| contentStyle | - | 新组件不支持自定义内容区域样式 |
| footerStyle | - | 新组件不支持自定义底部样式 |
| titleStyle | - | 新组件不支持自定义标题样式 |
| imageShape | - | 新组件不支持图片形状配置 |
| imagePosition | - | 新组件图片固定在标题上方 |
| imageStyle | - | 新组件不支持自定义图片样式 |
| imageProps | - | 新组件不支持图片其他属性 |
| - | bottomText | 新增底部提示文本 |
| - | scrollable | 新增滚动支持 |
| - | maxLength | 新增输入框最大长度限制 |
| - | onAnimationEnd | 新增动画结束回调 |

## 迁移示例

### 案例 1：基础对话框

```tsx
// 迁移前
import { Dialog } from '@mtfe/empower-mrn-components/shuguopai'

const [show, setShow] = useState(false)

<Dialog
  show={show}
  title="提示"
  message="确认删除该项吗？"
  buttons={[
    { text: '取消', type: 'cancel', onPress: () => setShow(false) },
    { text: '确认', type: 'confirm', onPress: () => handleDelete() }
  ]}
  onRequestClose={() => setShow(false)}
/>

// 迁移后
import { Dialog } from '@sfe/wand-rn'

const [visible, setVisible] = useState(false)

<Dialog
  visible={visible}
  title="提示"
  content="确认删除该项吗？"
  actions={[
    { text: '取消', type: 'cancel', onPress: () => setVisible(false) },
    { text: '确认', type: 'confirm', onPress: () => handleDelete() }
  ]}
  onClose={() => setVisible(false)}
/>
```

### 案例 2：带图片的对话框

```tsx
// 迁移前
import { Dialog } from '@mtfe/empower-mrn-components/shuguopai'

<Dialog
  show={show}
  title="领取成功"
  message="恭喜你成功领取任务"
  image={require('./success.png')}
  imageShape="circle"
  buttons={[
    { text: '我知道了', type: 'confirm', onPress: () => setShow(false) }
  ]}
/>

// 迁移后
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  title="领取成功"
  content="恭喜你成功领取任务"
  image={require('./success.png')}
  actions={[
    { text: '我知道了', type: 'confirm', onPress: () => setVisible(false) }
  ]}
/>
```

### 案例 3：带输入框的对话框

```tsx
// 迁移前
import { Dialog } from '@mtfe/empower-mrn-components/shuguopai'

<Dialog
  show={show}
  title="请输入备注"
  input={true}
  inputValue=""
  inputPlaceholder="请输入备注信息"
  buttons={[
    { text: '取消', type: 'cancel', onPress: () => setShow(false) },
    { 
      text: '确认', 
      type: 'confirm', 
      onPress: (val) => {
        console.log('输入值:', val)
        setShow(false)
      }
    }
  ]}
/>

// 迁移后
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  title="请输入备注"
  showInput={true}
  inputValue=""
  inputPlaceholder="请输入备注信息"
  inputType="input"
  actions={[
    { text: '取消', type: 'cancel', onPress: () => setVisible(false) },
    { 
      text: '确认', 
      type: 'confirm', 
      onPress: (val) => {
        console.log('输入值:', val)
        setVisible(false)
      }
    }
  ]}
/>
```

### 案例 4：多行文本输入

```tsx
// 迁移前
import { Dialog } from '@mtfe/empower-mrn-components/shuguopai'

<Dialog
  show={show}
  title="请输入备注"
  input={true}
  inputProps={{ multiline: true, maxLength: 200 }}
  buttons={[
    { text: '取消', type: 'cancel', onPress: () => setShow(false) },
    { text: '提交', type: 'confirm', onPress: (val) => handleSubmit(val) }
  ]}
/>

// 迁移后
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  title="请输入备注"
  showInput={true}
  inputType="textArea"
  maxLength={200}
  actions={[
    { text: '取消', type: 'cancel', onPress: () => setVisible(false) },
    { text: '提交', type: 'confirm', onPress: (val) => handleSubmit(val) }
  ]}
/>
```

### 案例 5：可点击遮罩关闭

```tsx
// 迁移前
import { Dialog } from '@mtfe/empower-mrn-components/shuguopai'

<Dialog
  show={show}
  title="提示"
  message="这是一条消息"
  cancelable={true}
  onRequestClose={() => setShow(false)}
  buttons={[
    { text: '知道了', type: 'confirm', onPress: () => setShow(false) }
  ]}
/>

// 迁移后
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  title="提示"
  content="这是一条消息"
  maskClosable={true}
  onClose={() => setVisible(false)}
  actions={[
    { text: '知道了', type: 'confirm', onPress: () => setVisible(false) }
  ]}
/>
```

### 案例 6：带关闭图标

```tsx
// 迁移前
import { Dialog } from '@mtfe/empower-mrn-components/shuguopai'

<Dialog
  show={show}
  title="提示"
  message="这是一条消息"
  closable={true}
  onRequestClose={() => setShow(false)}
  buttons={[]}
/>

// 迁移后
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  title="提示"
  content="这是一条消息"
  showCloseIcon={true}
  onClose={() => setVisible(false)}
  actions={[]}
/>
```

### 案例 7：内容可滚动

```tsx
// 迁移前
import { Dialog } from '@mtfe/empower-mrn-components/shuguopai'

<Dialog
  show={show}
  title="用户协议"
  message={longText}
  buttons={[
    { text: '不同意', type: 'cancel', onPress: () => setShow(false) },
    { text: '同意', type: 'confirm', onPress: () => handleAgree() }
  ]}
/>

// 迁移后 - 使用 scrollable 属性
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  title="用户协议"
  content={longText}
  scrollable={true}
  actions={[
    { text: '不同意', type: 'cancel', onPress: () => setVisible(false) },
    { text: '同意', type: 'confirm', onPress: () => handleAgree() }
  ]}
/>
```

### 案例 8：底部提示文本（新功能）

```tsx
// 迁移后 - 使用新增的 bottomText 属性
import { Dialog } from '@sfe/wand-rn'

<Dialog
  visible={visible}
  title="领取任务"
  content="复核任务领取后将由你来完成，确认是否领取？"
  bottomText="温馨提示：领取后需在24小时内完成"
  actions={[
    { text: '取消', type: 'cancel', onPress: () => setVisible(false) },
    { text: '领取', type: 'confirm', onPress: () => handleClaim() }
  ]}
/>
```

### 案例 9：函数式调用 - 警告提示

```tsx
// 迁移前 - 使用旧的函数式调用
import { openDialog, DialogResult } from '@mtfe/empower-mrn-components/shuguopai'

const result = await openDialog({
  message: '确认删除该项吗？',
  title: '提示',
  buttons: [
    { text: '取消', result: DialogResult.CANCEL },
    { text: '确认', emphasize: true, result: DialogResult.POSITIVE }
  ]
})

if (result === DialogResult.POSITIVE) {
  handleDelete()
}

// 迁移后 - 使用 Dialog.alert
import { Dialog } from '@sfe/wand-rn'

Dialog.alert({
  title: '提示',
  content: '确认删除该项吗？',
  actions: [
    { text: '取消', type: 'cancel', onPress: () => {} },
    { text: '确认', type: 'confirm', onPress: () => handleDelete() }
  ]
})
```

### 案例 10：函数式调用 - 输入提示

```tsx
// 迁移前 - 使用旧的函数式调用
import { openDialog, DialogResult } from '@mtfe/empower-mrn-components/shuguopai'

const result = await openDialog({
  type: 'custom-input',  // 需要预先注册自定义组件
  props: { placeholder: '请输入备注' },
  buttons: [
    { text: '取消', result: DialogResult.CANCEL },
    { text: '确认', emphasize: true, result: DialogResult.POSITIVE }
  ]
})

// 迁移后 - 使用 Dialog.prompt
import { Dialog } from '@sfe/wand-rn'

Dialog.prompt({
  title: '请输入备注',
  content: '请填写备注信息',
  placeholder: '请输入备注',
  actions: [
    { text: '取消', type: 'cancel', onPress: () => {} },
    { 
      text: '确认', 
      type: 'confirm', 
      onPress: (val) => {
        console.log('输入值:', val)
        handleSubmit(val)
      }
    }
  ]
})
```

### 案例 11：函数式调用 - 多行输入

```tsx
// 迁移后 - 使用 Dialog.prompt 的 textArea 类型
import { Dialog } from '@sfe/wand-rn'

Dialog.prompt({
  title: '请输入反馈意见',
  content: '您的意见对我们很重要',
  placeholder: '请输入您的反馈意见',
  type: 'textArea',
  maxLength: 200,
  actions: [
    { text: '取消', type: 'cancel', onPress: () => {} },
    { 
      text: '提交', 
      type: 'confirm', 
      onPress: (val) => submitFeedback(val)
    }
  ]
})
```

### 案例 12：函数式调用 - 通用弹窗

```tsx
// 迁移前 - 使用 openDialog
import { openDialog } from '@mtfe/empower-mrn-components/shuguopai'

const topView = openDialog({
  message: '操作成功',
  buttons: [{ text: '我知道了', emphasize: true, result: DialogResult.POSITIVE }]
})

// 迁移后 - 使用 Dialog.show
import { Dialog } from '@sfe/wand-rn'

const key = Dialog.show({
  title: '提示',
  content: '操作成功',
  showCloseIcon: true,
  onClose: () => {},
  actions: [
    { text: '我知道了', type: 'confirm', onPress: () => {} }
  ]
})
```

### 案例 13：自定义样式迁移（需调整方案）

```tsx
// 迁移前 - 支持丰富的样式自定义
import { Dialog } from '@mtfe/empower-mrn-components/shuguopai'

<Dialog
  show={show}
  title="提示"
  titleStyle={{ fontSize: 18, color: '#333' }}
  message="这是一条消息"
  messageStyle={{ fontSize: 14, color: '#666' }}
  style={{ width: 300, borderRadius: 12 }}
  contentStyle={{ padding: 20 }}
  footerStyle={{ height: 50 }}
  buttons={[
    { 
      text: '确认', 
      textStyle: { color: '#ff0000', fontWeight: 'bold' },
      style: { backgroundColor: '#f0f0f0' }
    }
  ]}
/>

// 迁移后 - 新组件不支持样式自定义，需使用默认样式或自定义 React.ReactNode
import { Dialog } from '@sfe/wand-rn'
import { Text, View } from '@mrn/react-native'

<Dialog
  visible={visible}
  title={
    <Text style={{ fontSize: 18, color: '#333' }}>提示</Text>
  }
  content={
    <Text style={{ fontSize: 14, color: '#666' }}>这是一条消息</Text>
  }
  actions={[
    { text: '确认', type: 'confirm', onPress: () => {} }
  ]}
/>

// 注意：新组件的按钮样式无法自定义，如需高度自定义建议使用 content 传入自定义组件
```

## 关键迁移点

1. **属性重命名**:
   - `show` → `visible`
   - `message` → `content`
   - `buttons` → `actions`
   - `closable` → `showCloseIcon`
   - `cancelable` → `maskClosable`
   - `onRequestClose` → `onClose`
   - `input` → `showInput`

2. **输入框配置简化**:
   - `inputProps` → `inputType` + `maxLength`
   - 单行输入: `inputType="input"`
   - 多行输入: `inputType="textArea"` + `maxLength`

3. **按钮类型默认值变化**:
   - 旧组件: `type` 默认为 `'confirm'`
   - 新组件: `type` 默认为 `'cancel'`

4. **函数式调用变化**:
   - 旧: `openDialog()` + `DialogResult` 枚举
   - 新: `Dialog.alert()` / `Dialog.prompt()` / `Dialog.show()`
   - 新组件不返回 Promise，通过 `onPress` 回调处理

5. **移除的功能**:
   - 不支持 `layout='vertical'` 垂直按钮布局
   - 不支持自定义样式 (`style`, `titleStyle`, `messageStyle`, `contentStyle`, `footerStyle`, `maskStyle`)
   - 不支持 `imageShape` 和 `imagePosition` 配置
   - 不支持 `onInputSubmit` 回调（通过 actions 的 onPress 获取输入值）
   - 不支持自定义 `maskOpacity`

6. **新增功能**:
   - `bottomText`: 底部提示文本
   - `scrollable`: 内容可滚动
   - `inputType`: 输入框类型（单行/多行）
   - `maxLength`: 输入框最大长度（仅 textArea 类型）
   - `onAnimationEnd`: 动画结束回调

7. **样式定制受限**: 新组件样式自定义能力较弱，如需高度自定义：
   - 使用 `React.ReactNode` 传入自定义的 title/content
   - 或考虑封装自定义 Dialog 组件

8. **Provider 依赖**: 使用 `@sfe/wand-rn` 的 Dialog 需要在应用入口处添加 `WandRnProvider`

## 注意事项

1. **Provider 配置**: 使用新组件前需在 App 入口处添加 `WandRnProvider`:
```tsx
import { WandRnProvider } from '@sfe/wand-rn'

const App = () => (
  <WandRnProvider>
    {/* 你的应用内容 */}
  </WandRnProvider>
)
```

2. **样式一致性**: 新旧组件的默认样式可能不同，迁移后需进行视觉验收

3. **按钮默认类型**: 注意按钮的 `type` 默认值从 `'confirm'` 变为 `'cancel'`，需显式指定

4. **函数式调用**: 新组件的函数式调用不返回 Promise，改为通过 `onPress` 回调处理结果

5. **输入框值获取**: 旧组件的 `onInputSubmit` 被移除，输入值统一通过按钮的 `onPress(val)` 参数获取

6. **图片配置**: 新组件的图片配置更简单，不支持形状和位置配置，图片固定显示在标题上方

7. **自定义需求**: 如果项目中大量使用了样式自定义功能，建议：
   - 评估是否可以接受新组件的默认样式
   - 或基于新组件封装一个带样式配置的自定义 Dialog
   - 或使用 `content` 传入完全自定义的 React 组件

8. **迁移优先级**: 建议先迁移功能简单的对话框，复杂的自定义对话框可以后续逐步迁移
