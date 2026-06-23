# BottomModal 底部弹窗

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface TitleConfig {
    title?: string  // 标题文本
    showCancel?: boolean  // 默认 true，是否显示取消按钮
    showConfirm?: boolean  // 默认 true，是否显示完成按钮
    cancelText?: string  // 默认 '取消'，取消按钮文案
    confirmText?: string  // 默认 '完成'，完成按钮文案
}

interface BottomModalProps {
    show: boolean  // 是否显示弹窗
    cancelable?: boolean  // 默认 true，是否可以通过蒙层关闭
    title?: TitleConfig | string  // 标题配置或文本
    contentContainerStyle?: StyleProp<ViewStyle>  // 内容区域容器样式
    onRequestFinish?: () => void  // 完成按钮点击回调
    onRequestClose: () => void  // 关闭回调（取消按钮或蒙层点击）
    maskOpacity?: number  // 默认 0.6，蒙层透明度
    alignItems?: FlexAlignType  // 默认 'flex-end'，弹窗对齐方式
    mask?: boolean  // 默认 true，是否显示蒙层
    children?: React.ReactNode  // 弹窗内容
}

// 静态方法 - 函数式调用
BottomModal.open(props: Omit<BottomModalProps, 'show'> & {
    children: React.ReactNode
    banKeyboardAvoid?: boolean  // 是否禁用键盘回避
}): TopViewManager  // 返回 TopView 管理器实例
```

## 新组件 API

```tsx
interface BottomModalHeaderProps {
    title?: string  // 弹窗标题
    leftLabel?: string | JSX.Element  // 标题左侧内容（通常为取消按钮）
    rightLabel?: string | JSX.Element  // 标题右侧内容（通常为完成按钮）
    onPressLeft?: () => void  // 左侧内容点击回调
    onPressRight?: () => void  // 右侧内容点击回调
}

interface BottomModalButtonProps extends ButtonProps {
    text: string  // 按钮文本
}

interface BottomModalProps {
    visible: boolean  // 控制弹窗显示
    maskClosable?: boolean  // 默认 true，是否可点击蒙层关闭
    header?: BottomModalHeaderProps | JSX.Element  // 自定义头部
    footer?: BottomModalButtonProps[]  // 底部按钮（最多 2 个）
    children: React.ReactNode  // 内容区域
    testID?: string  // 测试 ID
    paddingHorizontal?: number  // 内容区水平边距（已废弃）
    onClose?: () => void  // 关闭回调
    onAnimationEnd?: () => void  // 动画结束回调
    callType?: 'method' | 'jsx'  // 调用方式
    mode?: 'default' | 'slide-modal'  // 弹窗模式
    styles?: Partial<BottomModalStyleType>  // 自定义样式
}

// 函数式调用
interface BottomModalOpenProps extends Omit<BottomModalProps, 'visible' | 'children'> {
    content: React.ReactNode  // 弹框内容
}

BottomModal.open(props: BottomModalOpenProps): () => void  // 返回关闭方法
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| show | visible | 属性名变更，控制显示/隐藏 |
| children | children | 保持不变，内容区域 |
| title (string) | header.title | 标题配置改为对象式 |
| title (TitleConfig) | header | 完整标题配置改为 header 属性 |
| title.showCancel + onRequestClose | header.leftLabel + onPressLeft | 取消按钮配置改为左侧标签 |
| title.cancelText | header.leftLabel | 取消按钮文案改为左侧标签 |
| title.showConfirm + onRequestFinish | header.rightLabel + onPressRight | 完成按钮配置改为右侧标签 |
| title.confirmText | header.rightLabel | 完成按钮文案改为右侧标签 |
| onRequestClose | onClose | 关闭回调属性名变更 |
| onRequestFinish | header.onPressRight | 完成回调改为头部右侧回调 |
| cancelable | maskClosable | 属性名变更，语义更明确 |
| contentContainerStyle | - | 新组件样式通过 styles.content 定制 |
| maskOpacity | - | 新组件使用固定遮罩透明度 |
| alignItems | - | 已移除，弹窗位置固定为底部 |
| mask | - | 已移除，遮罩固定显示 |
| - | footer | 新增底部按钮配置（最多 2 个） |
| - | onAnimationEnd | 新增动画结束回调 |
| - | mode | 新增模式配置（default/slide-modal） |
| - | styles | 新增自定义样式配置 |
| - | callType | 新增调用方式配置 |

## 核心结构变化

### 旧架构（@mtfe/empower-mrn-components/shuguopai）
```tsx
// 组件式调用 - 状态管理在业务代码
<BottomModal
  show={show}
  title="标题"
  onRequestClose={() => setShow(false)}
>
  内容
</BottomModal>

// 函数式调用 - 返回 TopViewManager 实例
BottomModal.open({
  title: "标题",
  onRequestClose: () => {},
  children: <Content />
})
```

### 新架构（@sfe/wand-rn）
```tsx
// 组件式调用 - 结构化配置
<BottomModal
  visible={visible}
  header={{ title: "标题" }}
  onClose={() => setVisible(false)}
>
  内容
</BottomModal>

// 函数式调用 - 返回关闭函数
const close = BottomModal.open({
  header: { title: "标题" },
  onClose: () => {},
  content: <Content />
})
```

## 迁移示例

### 案例 1：基础弹窗（组件式）

```tsx
// 迁移前
import { BottomModal } from '@mtfe/empower-mrn-components/shuguopai'
import { useState } from 'react'

const [show, setShow] = useState(false)

<BottomModal
  show={show}
  title="选择城市"
  onRequestClose={() => setShow(false)}
>
  <CityList />
</BottomModal>

// 迁移后
import { BottomModal } from '@sfe/wand-rn'
import { useState } from 'react'

const [visible, setVisible] = useState(false)

<BottomModal
  visible={visible}
  header={{ title: "选择城市" }}
  onClose={() => setVisible(false)}
>
  <CityList />
</BottomModal>
```

### 案例 2：仅取消按钮

```tsx
// 迁移前
import { BottomModal } from '@mtfe/empower-mrn-components/shuguopai'

<BottomModal
  show={show}
  title={{
    title: "提示",
    showConfirm: false,
    cancelText: "知道了"
  }}
  onRequestClose={() => setShow(false)}
>
  <Text>这是一条提示信息</Text>
</BottomModal>

// 迁移后
import { BottomModal } from '@sfe/wand-rn'

<BottomModal
  visible={visible}
  header={{
    title: "提示",
    leftLabel: "知道了"
  }}
  onClose={() => setVisible(false)}
>
  <Text>这是一条提示信息</Text>
</BottomModal>
```

### 案例 3：自定义取消和完成按钮文案

```tsx
// 迁移前
import { BottomModal } from '@mtfe/empower-mrn-components/shuguopai'

<BottomModal
  show={show}
  title={{
    title: "选择项目",
    showCancel: true,
    showConfirm: true,
    cancelText: "返回",
    confirmText: "确认"
  }}
  onRequestClose={() => setShow(false)}
  onRequestFinish={() => handleConfirm()}
>
  <ProjectList />
</BottomModal>

// 迁移后
import { BottomModal } from '@sfe/wand-rn'

<BottomModal
  visible={visible}
  header={{
    title: "选择项目",
    leftLabel: "返回",
    rightLabel: "确认",
    onPressLeft: () => setVisible(false),
    onPressRight: () => handleConfirm()
  }}
  onClose={() => setVisible(false)}
>
  <ProjectList />
</BottomModal>
```

### 案例 4：只有标题，无按钮

```tsx
// 迁移前
import { BottomModal } from '@mtfe/empower-mrn-components/shuguopai'

<BottomModal
  show={show}
  title={{
    title: "温馨提示",
    showCancel: false,
    showConfirm: false
  }}
  onRequestClose={() => setShow(false)}
>
  <Text>请注意：此操作不可撤销</Text>
</BottomModal>

// 迁移后
import { BottomModal } from '@sfe/wand-rn'

<BottomModal
  visible={visible}
  header={{
    title: "温馨提示"
  }}
  onClose={() => setVisible(false)}
>
  <Text>请注意：此操作不可撤销</Text>
</BottomModal>
```

### 案例 5：函数式调用

```tsx
// 迁移前
import { BottomModal } from '@mtfe/empower-mrn-components/shuguopai'

BottomModal.open({
  title: "选择城市",
  onRequestClose: () => {
    console.log('关闭')
  },
  children: <CityPicker />
})

// 迁移后
import { BottomModal } from '@sfe/wand-rn'

const close = BottomModal.open({
  header: { title: "选择城市" },
  onClose: () => {
    console.log('关闭')
  },
  content: <CityPicker />
})

// 调用 close() 来关闭弹窗
```

### 案例 6：可点击蒙层关闭

```tsx
// 迁移前
import { BottomModal } from '@mtfe/empower-mrn-components/shuguopai'

<BottomModal
  show={show}
  title="过滤选项"
  cancelable={true}
  onRequestClose={() => setShow(false)}
>
  <FilterForm />
</BottomModal>

// 迁移后
import { BottomModal } from '@sfe/wand-rn'

<BottomModal
  visible={visible}
  header={{ title: "过滤选项" }}
  maskClosable={true}
  onClose={() => setVisible(false)}
>
  <FilterForm />
</BottomModal>
```

### 案例 7：底部按钮配置（新功能）

```tsx
// 迁移后 - 新增底部按钮配置
import { BottomModal } from '@sfe/wand-rn'

<BottomModal
  visible={visible}
  header={{ title: "确认操作" }}
  footer={[
    {
      text: '取消',
      type: 'default',
      onPress: () => setVisible(false)
    },
    {
      text: '确认',
      type: 'primary',
      onPress: () => handleConfirm()
    }
  ]}
  onClose={() => setVisible(false)}
>
  <Text>确定要删除此项吗？此操作无法撤销</Text>
</BottomModal>
```

### 案例 8：自定义头部内容（JSX）

```tsx
// 迁移后 - 使用 JSX 元素作为自定义头部
import { BottomModal } from '@sfe/wand-rn'
import { View, Text } from '@mrn/react-native'

<BottomModal
  visible={visible}
  header={
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        自定义头部
      </Text>
    </View>
  }
  onClose={() => setVisible(false)}
>
  <Content />
</BottomModal>
```

### 案例 9：函数式调用 - 自定义按钮回调

```tsx
// 迁移前
import { BottomModal } from '@mtfe/empower-mrn-components/shuguopai'

BottomModal.open({
  title: {
    title: "选择城市",
    showCancel: true,
    cancelText: "返回"
  },
  onRequestFinish: () => {
    console.log('完成')
  },
  onRequestClose: () => {
    console.log('取消或蒙层点击')
  },
  children: <CityPicker />
})

// 迁移后
import { BottomModal } from '@sfe/wand-rn'

const close = BottomModal.open({
  header: {
    title: "选择城市",
    leftLabel: "返回",
    rightLabel: "确定",
    onPressLeft: () => {
      console.log('返回')
      close()
    },
    onPressRight: () => {
      console.log('确定')
      close()
    }
  },
  onClose: () => {
    console.log('蒙层点击')
  },
  content: <CityPicker />
})
```

### 案例 10：移除 maskOpacity 配置

```tsx
// 迁移前
import { BottomModal } from '@mtfe/empower-mrn-components/shuguopai'

<BottomModal
  show={show}
  title="选项"
  maskOpacity={0.8}  // 自定义遮罩透明度
  onRequestClose={() => setShow(false)}
>
  <Content />
</BottomModal>

// 迁移后 - 新组件遮罩透明度固定，无法自定义
import { BottomModal } from '@sfe/wand-rn'

<BottomModal
  visible={visible}
  header={{ title: "选项" }}
  onClose={() => setVisible(false)}
>
  <Content />
</BottomModal>

// 如需自定义遮罩样式，使用 styles 属性
<BottomModal
  visible={visible}
  header={{ title: "选项" }}
  styles={{ maskStyle: { backgroundColor: 'rgba(0,0,0,0.8)' } }}
  onClose={() => setVisible(false)}
>
  <Content />
</BottomModal>
```

### 案例 11：SlideModal 兼容模式（新功能）

```tsx
// 迁移后 - BottomModal 已支持 SlideModal 的 slide-modal 模式
import { BottomModal } from '@sfe/wand-rn'

<BottomModal
  visible={visible}
  mode="slide-modal"  // 兼容原 FlowerRN SlideModal
  onClose={() => setVisible(false)}
>
  <Content />
</BottomModal>
```

### 案例 12：动画结束回调（新功能）

```tsx
// 迁移后 - 新增动画结束回调
import { BottomModal } from '@sfe/wand-rn'

<BottomModal
  visible={visible}
  header={{ title: "动画测试" }}
  onAnimationEnd={() => {
    console.log('动画结束')
  }}
  onClose={() => setVisible(false)}
>
  <Content />
</BottomModal>
```

### 案例 13：移除 alignItems 和 mask 配置

```tsx
// 迁移前
import { BottomModal } from '@mtfe/empower-mrn-components/shuguopai'

<BottomModal
  show={show}
  title="中心对齐"
  alignItems="center"  // 自定义对齐方式
  mask={false}  // 隐藏遮罩
  onRequestClose={() => setShow(false)}
>
  <Content />
</BottomModal>

// 迁移后 - 位置和遮罩已固定
import { BottomModal } from '@sfe/wand-rn'

// 新组件弹窗始终显示在底部，遮罩始终显示
// 如需完全不同的布局，建议使用 Modal 或 Dialog 组件
<BottomModal
  visible={visible}
  header={{ title: "选项" }}
  onClose={() => setVisible(false)}
>
  <Content />
</BottomModal>
```

### 案例 14：完整迁移示例 - 城市选择器

```tsx
// 迁移前
import { BottomModal } from '@mtfe/empower-mrn-components/shuguopai'
import { useState } from 'react'

const CitySelector = () => {
  const [show, setShow] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')

  const handleFinish = () => {
    console.log('选择完成:', selectedCity)
    setShow(false)
  }

  return (
    <>
      <Button onPress={() => setShow(true)}>选择城市</Button>
      <BottomModal
        show={show}
        title={{
          title: "选择城市",
          showCancel: true,
          showConfirm: true,
          cancelText: "返回",
          confirmText: "确认"
        }}
        onRequestClose={() => setShow(false)}
        onRequestFinish={handleFinish}
      >
        <CityList onChange={setSelectedCity} />
      </BottomModal>
    </>
  )
}

// 迁移后
import { BottomModal } from '@sfe/wand-rn'
import { useState } from 'react'

const CitySelector = () => {
  const [visible, setVisible] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')

  const handleFinish = () => {
    console.log('选择完成:', selectedCity)
    setVisible(false)
  }

  return (
    <>
      <Button onPress={() => setVisible(true)}>选择城市</Button>
      <BottomModal
        visible={visible}
        header={{
          title: "选择城市",
          leftLabel: "返回",
          rightLabel: "确认",
          onPressLeft: () => setVisible(false),
          onPressRight: handleFinish
        }}
        onClose={() => setVisible(false)}
      >
        <CityList onChange={setSelectedCity} />
      </BottomModal>
    </>
  )
}
```

## 关键迁移点

1. **属性重命名**:
   - `show` → `visible`
   - `onRequestClose` → `onClose`
   - `onRequestFinish` → `header.onPressRight`
   - `cancelable` → `maskClosable`

2. **标题配置结构变化**:
   - 旧: `title` 属性支持 string 或 TitleConfig 对象
   - 新: `header` 属性，使用 BottomModalHeaderProps 对象
   - 旧的 TitleConfig 需要重构为 BottomModalHeaderProps

3. **按钮配置改进**:
   - 旧: 通过 title.showCancel/showConfirm 和回调分开管理
   - 新: 通过 header.leftLabel/rightLabel 和对应的回调统一管理
   - 新增 footer 属性支持底部按钮配置

4. **功能移除**:
   - `maskOpacity`: 遮罩透明度固定
   - `alignItems`: 弹窗位置固定为底部
   - `mask`: 遮罩固定显示
   - `contentContainerStyle`: 改用 styles 属性定制

5. **函数式调用变化**:
   - 旧: `BottomModal.open()` 返回 TopViewManager 实例
   - 新: `BottomModal.open()` 返回关闭函数
   - 旧: `children` 属性
   - 新: `content` 属性

6. **新增功能**:
   - `footer`: 底部按钮配置（最多 2 个）
   - `mode`: 弹窗模式（default/slide-modal）
   - `onAnimationEnd`: 动画结束回调
   - `styles`: 自定义样式配置
   - `callType`: 调用方式配置

7. **样式定制方式改进**:
   - 旧: `contentContainerStyle` 直接传入样式
   - 新: 通过 `styles` 对象的不同属性定制各个部分

## 注意事项

1. **头部结构重构**:
   - TitleConfig 的 showCancel/showConfirm 逻辑改为通过 leftLabel/rightLabel 是否存在来判断
   - 默认行为变化：旧组件默认同时显示取消和完成按钮，新组件通过 label 是否定义来控制

2. **回调分散化**:
   - 旧组件的 onRequestClose 处理所有关闭场景（取消按钮、完成按钮、蒙层）
   - 新组件中不同操作有不同的回调：onPressLeft、onPressRight、onClose

3. **函数式调用返回值变化**:
   - 旧: 返回 TopViewManager，可以访问实例属性和方法
   - 新: 返回关闭函数，使用更简洁但功能较为简单
   - 如需对关闭过程进行更多控制，使用组件式调用

4. **底部按钮数量限制**:
   - 新组件的 footer 数组最多支持 2 个按钮
   - 超过 2 个按钮会被截断

5. **遮罩透明度**:
   - 新组件遮罩透明度为固定值
   - 无法通过 props 调整
   - 如需完全自定义遮罩，可能需要考虑使用 Modal 组件

6. **键盘回避**:
   - 旧组件的 banKeyboardAvoid 参数已移除
   - 新组件的键盘处理由框架自动处理

7. **SlideModal 兼容**:
   - 新的 BottomModal 已集成 SlideModal 的功能
   - 使用 `mode="slide-modal"` 可以获得原 SlideModal 的效果

## 迁移检查清单

- [ ] 替换 import：`@mtfe/empower-mrn-components/shuguopai` → `@sfe/wand-rn`
- [ ] 属性重命名：`show` → `visible`
- [ ] 属性重命名：`onRequestClose` → `onClose`
- [ ] 重构 title 配置为 header 结构
- [ ] 更新按钮回调：`onRequestFinish` → `header.onPressRight`
- [ ] 更新按钮回调：`onRequestClose` → `header.onPressLeft`（如需）
- [ ] 属性重命名：`cancelable` → `maskClosable`
- [ ] 检查 contentContainerStyle，改用 styles 属性
- [ ] 检查是否使用 maskOpacity，已被移除
- [ ] 检查是否使用 alignItems，已被移除
- [ ] 检查是否使用 mask 属性，已被移除
- [ ] 如使用函数式调用，更新返回值处理方式
- [ ] 考虑是否使用 footer 属性增强底部交互
- [ ] 检查是否需要使用 onAnimationEnd 回调
- [ ] 进行完整的功能测试
- [ ] 进行视觉对比验证

## 与旧组件的对应关系

### 取消和确认按钮配置对应

```tsx
// 旧组件 - 显示取消和确认按钮
title={{
  title: "标题",
  showCancel: true,
  showConfirm: true,
  cancelText: "取消",
  confirmText: "完成"
}}

// 新组件 - 对应配置
header={{
  title: "标题",
  leftLabel: "取消",
  rightLabel: "完成",
  onPressLeft: () => {},  // 对应 onRequestClose
  onPressRight: () => {}  // 对应 onRequestFinish
}}
```

### 仅取消按钮配置对应

```tsx
// 旧组件
title={{
  title: "标题",
  showCancel: true,
  showConfirm: false,
  cancelText: "我知道了"
}}

// 新组件
header={{
  title: "标题",
  leftLabel: "我知道了"
}}
```

### 仅确认按钮配置对应

```tsx
// 旧组件
title={{
  title: "标题",
  showCancel: false,
  showConfirm: true,
  confirmText: "确定"
}}

// 新组件
header={{
  title: "标题",
  rightLabel: "确定"
}}
```
