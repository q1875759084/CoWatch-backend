# Modal 弹窗

## 从何处迁移
- **源库**: `@roo/roo-rn1`
- **目标库**: `@sfe/wand-rn`（包级别导出为 `RCModal`，而非高级 `Modal`）

## 旧组件 API

```tsx
interface ModalProps extends WithThemeStyles<ModalStyles> {
  /** 是否可见 */
  visible?: boolean  // 默认 false
  /** 是否显示遮罩 */
  mask?: boolean  // 默认 true
  /** 遮罩透明度 */
  maskOpacity?: number  // 默认 0.6
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean  // 默认 true
  /** 是否强制全屏 */
  forceFullScreen?: boolean  // 默认 false
  /** 是否显示关闭按钮 */
  closable?: boolean  // 默认 false
  /** 动画时长 */
  duration?: number  // 默认 300
  /** 是否使用原生动画驱动 */
  useNativeDriver?: boolean  // 默认 false
  /** 动画缓动函数 */
  easing?: (value: number) => number  // 默认 Easing.elastic(0.8)
  /** 内容对齐方式 */
  alignItems?: FlexAlignType  // 默认 'center'
  /** flex 值 */
  flex?: number  // 默认 null
  /** 水平外边距 */
  marginHorizontal?: number  // 默认 0
  /** 顶部外边距 */
  marginTop?: number  // 默认 90
  /** 底部外边距 */
  marginBottom?: number  // 默认 90
  /** 关闭按钮点击回调 */
  onPressClose?: (state: ModalState) => void
  /** 打开前回调 */
  onBeforeOpen?: (state: ModalState) => void
  /** 关闭前回调 */
  onBeforeClose?: (state: ModalState) => void
  /** 打开后回调 */
  onOpen?: (state: ModalState) => void
  /** 关闭后回调 */
  onClose?: (state: ModalState) => void
  /** 动画结束回调 */
  onAnimationEnd?: (state: ModalState) => void
  /** 外层容器样式 */
  wrapperStyles?: StyleProp<ViewStyle>
  /** 内容容器样式 */
  containerStyles?: StyleProp<ViewStyle>
  /** 动画 X 轴偏移 */
  animatedTranslateX?: number
  /** 动画 Y 轴偏移 */
  animatedTranslateY?: number
  /** 是否开启动画 */
  animateable?: boolean  // 默认 true
  /** 键盘垂直偏移 */
  keyboardVerticalOffset?: number
  /** 键盘行为 */
  keyboardBehavior?: 'height' | 'position' | 'padding' | null
  /** 是否阻止安卓返回键 */
  preventAndroidBackHandler?: boolean  // 默认 true
  /** 是否显示底部关闭按钮 */
  showBottomClose?: boolean  // 默认 false
}

// 静态方法：Modal.open(options) 返回 TopViewManager 实例
```

## 新组件 API

```tsx
// RCModal（包级别导出，低级组件）
interface RCModalProps {
  /** 外层容器样式 */
  wrapStyle?: StyleProp<ViewStyle>
  /** 遮罩样式 */
  maskStyle?: StyleProp<ViewStyle>
  /** 动画类型 */
  animationType: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'slide-left'
  /** 动画时长 */
  animationDuration?: number  // 默认 300
  /** 是否可见 */
  visible: boolean
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean  // 默认 true
  /** 是否在首次出现时播放动画 */
  animateAppear?: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 动画结束回调 */
  onAnimationEnd?: (visible: boolean) => void
  /** 安卓返回键回调 */
  onRequestClose?: () => boolean
}

// AntmModal（高级组件，未在包级别导出）
interface ModalProps extends ModalPropsType<TextStyle>, WithThemeStyles<ModalStyle> {
  /** 是否可见 */
  visible: boolean
  /** 标题 */
  title?: React.ReactNode
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean  // 默认 false
  /** 是否显示关闭按钮 */
  closable?: boolean  // 默认 false
  /** 底部操作按钮 */
  footer?: Action[]
  /** 是否透明模式（对话框模式） */
  transparent?: boolean  // 默认 false
  /** 是否弹出模式（底部滑出） */
  popup?: boolean  // 默认 false
  /** 是否开启动画 */
  animated?: boolean
  /** 动画类型 */
  animationType?: string
  /** 内容区域样式 */
  bodyStyle?: StyleProp<ViewStyle>
  /** 容器样式 */
  style?: StyleProp<ViewStyle>
  /** 关闭回调（无 ModalState 参数） */
  onClose?: () => void
  /** 动画结束回调 */
  onAnimationEnd?: (visible: boolean) => void
  /** 安卓返回键回调 */
  onRequestClose?: () => boolean
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| visible | visible | 保持一致 |
| mask | - | 移除，新组件始终显示遮罩 |
| maskOpacity | - | 移除，新组件遮罩透明度固定为 0.5，不可配置 |
| maskClosable | maskClosable | 默认值变更：true -> false（AntmModal）/ true（RCModal） |
| forceFullScreen | - | 移除，无等效属性 |
| closable | closable | 保持一致（仅 AntmModal） |
| duration | animationDuration | 属性名变更，默认值均为 300 |
| useNativeDriver | - | 移除 |
| easing | - | 移除，新组件使用内置缓动函数 |
| alignItems | style | 移除，通过 style/wrapStyle 自行实现布局 |
| flex | style | 移除，通过 style/wrapStyle 自行实现布局 |
| marginHorizontal | style | 移除，通过 style/wrapStyle 自行实现布局 |
| marginTop | style | 移除，通过 style/wrapStyle 自行实现布局 |
| marginBottom | style | 移除，通过 style/wrapStyle 自行实现布局 |
| onPressClose | - | 移除，无等效属性 |
| onBeforeOpen | - | 移除，无等效属性 |
| onBeforeClose | - | 移除，无等效属性 |
| onOpen | - | 移除，无等效属性（可通过 onAnimationEnd 配合 visible 判断） |
| onClose | onClose | 回调签名变更：`(state: ModalState) => void` -> `() => void` |
| onAnimationEnd | onAnimationEnd | 回调签名变更：`(state: ModalState) => void` -> `(visible: boolean) => void` |
| wrapperStyles | wrapStyle | 属性名变更（仅 RCModal） |
| containerStyles | style / bodyStyle | 属性名变更 |
| animatedTranslateX | - | 移除，使用 animationType 替代 |
| animatedTranslateY | - | 移除，使用 animationType 替代 |
| animateable | animated | 属性名变更（仅 AntmModal） |
| keyboardVerticalOffset | - | 移除，需自行处理键盘避让 |
| keyboardBehavior | - | 移除，需自行处理键盘避让 |
| preventAndroidBackHandler | onRequestClose | 从布尔值改为回调函数 |
| showBottomClose | - | 移除，无等效属性 |
| Modal.open() | - | 移除，无等效命令式 API |
| - | title | 新增，标题内容（仅 AntmModal） |
| - | footer | 新增，底部操作按钮（仅 AntmModal） |
| - | transparent | 新增，透明/对话框模式（仅 AntmModal） |
| - | popup | 新增，弹出/底部滑出模式（仅 AntmModal） |
| - | bodyStyle | 新增，内容区域样式（仅 AntmModal） |
| - | maskStyle | 新增，遮罩样式（仅 RCModal） |
| - | animationType | 新增，支持 'none'/'fade'/'slide-up'/'slide-down'/'slide-left' |

## 迁移示例

### 案例 1：基础弹窗

```tsx
// 迁移前
import { Modal } from '@roo/roo-rn1'

<Modal visible={visible} onClose={(state) => setVisible(false)}>
  <Text>弹窗内容</Text>
</Modal>

// 迁移后
import { RCModal } from '@sfe/wand-rn'

<RCModal
  visible={visible}
  animationType="fade"
  onClose={() => setVisible(false)}
>
  <Text>弹窗内容</Text>
</RCModal>
```

### 案例 2：遮罩透明度与点击关闭

```tsx
// 迁移前
import { Modal } from '@roo/roo-rn1'

<Modal
  visible={visible}
  maskOpacity={0.8}
  maskClosable={true}
  onClose={(state) => setVisible(false)}
>
  <Text>自定义遮罩</Text>
</Modal>

// 迁移后 - maskOpacity 不可配置（固定 0.5），maskClosable 在 RCModal 中默认 true
import { RCModal } from '@sfe/wand-rn'

<RCModal
  visible={visible}
  animationType="fade"
  maskClosable={true}
  onClose={() => setVisible(false)}
>
  <Text>自定义遮罩</Text>
</RCModal>
```

### 案例 3：布局属性迁移

```tsx
// 迁移前 - 使用布局属性控制弹窗位置
import { Modal } from '@roo/roo-rn1'

<Modal
  visible={visible}
  alignItems="center"
  marginHorizontal={20}
  marginTop={100}
  marginBottom={50}
  onClose={(state) => setVisible(false)}
>
  <Text>居中弹窗</Text>
</Modal>

// 迁移后 - 通过 wrapStyle 实现布局
import { RCModal } from '@sfe/wand-rn'

<RCModal
  visible={visible}
  animationType="fade"
  wrapStyle={{
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 100,
    marginBottom: 50,
  }}
  onClose={() => setVisible(false)}
>
  <Text>居中弹窗</Text>
</RCModal>
```

### 案例 4：动画配置

```tsx
// 迁移前 - 自定义动画参数
import { Modal } from '@roo/roo-rn1'
import { Easing } from 'react-native'

<Modal
  visible={visible}
  duration={500}
  easing={Easing.bezier(0.25, 0.1, 0.25, 1)}
  animatedTranslateY={200}
  onClose={(state) => setVisible(false)}
>
  <Text>自定义动画</Text>
</Modal>

// 迁移后 - 使用预设动画类型，easing 不可配置
import { RCModal } from '@sfe/wand-rn'

<RCModal
  visible={visible}
  animationType="slide-up"
  animationDuration={500}
  onClose={() => setVisible(false)}
>
  <Text>自定义动画</Text>
</RCModal>
```

### 案例 5：生命周期回调

```tsx
// 迁移前 - 丰富的生命周期回调
import { Modal } from '@roo/roo-rn1'

<Modal
  visible={visible}
  onBeforeOpen={(state) => console.log('即将打开', state)}
  onOpen={(state) => console.log('已打开', state)}
  onBeforeClose={(state) => console.log('即将关闭', state)}
  onClose={(state) => {
    console.log('已关闭', state)
    setVisible(false)
  }}
  onAnimationEnd={(state) => console.log('动画结束', state)}
>
  <Text>生命周期</Text>
</Modal>

// 迁移后 - 仅保留 onClose 和 onAnimationEnd，且回调签名变更
import { RCModal } from '@sfe/wand-rn'

<RCModal
  visible={visible}
  animationType="fade"
  onClose={() => {
    console.log('已关闭')
    setVisible(false)
  }}
  onAnimationEnd={(visible) => {
    if (visible) {
      console.log('打开动画结束')
    } else {
      console.log('关闭动画结束')
    }
  }}
>
  <Text>生命周期</Text>
</RCModal>
```

### 案例 6：安卓返回键处理

```tsx
// 迁移前 - 布尔值控制
import { Modal } from '@roo/roo-rn1'

<Modal
  visible={visible}
  preventAndroidBackHandler={true}
  onClose={(state) => setVisible(false)}
>
  <Text>阻止返回键关闭</Text>
</Modal>

// 迁移后 - 使用 onRequestClose 回调
import { RCModal } from '@sfe/wand-rn'

<RCModal
  visible={visible}
  animationType="fade"
  onClose={() => setVisible(false)}
  onRequestClose={() => {
    // 返回 true 阻止默认关闭行为
    return true
  }}
>
  <Text>阻止返回键关闭</Text>
</RCModal>
```

### 案例 7：命令式 Modal.open 迁移

```tsx
// 迁移前 - 命令式调用
import { Modal } from '@roo/roo-rn1'

const manager = Modal.open({
  children: <Text>命令式弹窗</Text>,
  maskClosable: true,
  onClose: (state) => console.log('closed', state),
})

// 稍后关闭
manager.close()

// 迁移后 - 无等效命令式 API，需改为声明式
import { RCModal } from '@sfe/wand-rn'

const [visible, setVisible] = useState(false)

// 打开弹窗
setVisible(true)

// 关闭弹窗
setVisible(false)

<RCModal
  visible={visible}
  animationType="fade"
  maskClosable={true}
  onClose={() => setVisible(false)}
>
  <Text>声明式弹窗</Text>
</RCModal>
```

### 案例 8：关闭按钮与底部关闭按钮

```tsx
// 迁移前 - 内置关闭按钮
import { Modal } from '@roo/roo-rn1'

<Modal
  visible={visible}
  closable={true}
  showBottomClose={true}
  onPressClose={(state) => {
    console.log('关闭按钮点击', state)
    setVisible(false)
  }}
  onClose={(state) => setVisible(false)}
>
  <Text>带关闭按钮的弹窗</Text>
</Modal>

// 迁移后 - showBottomClose 无等效属性，需自行实现关闭按钮
import { RCModal } from '@sfe/wand-rn'

<RCModal
  visible={visible}
  animationType="fade"
  onClose={() => setVisible(false)}
>
  <View>
    <View style={{ alignItems: 'flex-end' }}>
      <TouchableOpacity onPress={() => setVisible(false)}>
        <Text>X</Text>
      </TouchableOpacity>
    </View>
    <Text>带关闭按钮的弹窗</Text>
  </View>
</RCModal>
```

### 案例 9：完整复杂场景

```tsx
// 迁移前
import { Modal } from '@roo/roo-rn1'

<Modal
  visible={visible}
  maskOpacity={0.7}
  maskClosable={true}
  closable={true}
  duration={400}
  alignItems="center"
  marginHorizontal={30}
  marginTop={120}
  marginBottom={80}
  animateable={true}
  preventAndroidBackHandler={true}
  onBeforeOpen={(state) => trackEvent('modal_opening')}
  onOpen={(state) => trackEvent('modal_opened')}
  onClose={(state) => {
    trackEvent('modal_closed')
    setVisible(false)
  }}
  onAnimationEnd={(state) => console.log('animation done', state)}
  wrapperStyles={{ backgroundColor: 'transparent' }}
  containerStyles={{ borderRadius: 12, padding: 20 }}
>
  <Text>复杂弹窗</Text>
</Modal>

// 迁移后
import { RCModal } from '@sfe/wand-rn'

<RCModal
  visible={visible}
  animationType="fade"
  animationDuration={400}
  maskClosable={true}
  wrapStyle={{
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 120,
    marginBottom: 80,
    backgroundColor: 'transparent',
  }}
  onClose={() => {
    trackEvent('modal_closed')
    setVisible(false)
  }}
  onAnimationEnd={(visible) => {
    if (visible) {
      trackEvent('modal_opened')
    }
    console.log('animation done', visible)
  }}
  onRequestClose={() => true}
>
  <View style={{ borderRadius: 12, padding: 20 }}>
    <View style={{ alignItems: 'flex-end' }}>
      <TouchableOpacity onPress={() => setVisible(false)}>
        <Text>X</Text>
      </TouchableOpacity>
    </View>
    <Text>复杂弹窗</Text>
  </View>
</RCModal>
```

### 案例 10：键盘避让

```tsx
// 迁移前 - 内置键盘避让
import { Modal } from '@roo/roo-rn1'

<Modal
  visible={visible}
  keyboardBehavior="padding"
  keyboardVerticalOffset={60}
  onClose={(state) => setVisible(false)}
>
  <TextInput placeholder="输入内容" />
</Modal>

// 迁移后 - 需自行包裹 KeyboardAvoidingView
import { RCModal } from '@sfe/wand-rn'
import { KeyboardAvoidingView, Platform } from 'react-native'

<RCModal
  visible={visible}
  animationType="fade"
  onClose={() => setVisible(false)}
>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={60}
  >
    <TextInput placeholder="输入内容" />
  </KeyboardAvoidingView>
</RCModal>
```

## 关键点

### 1. 导入路径变更
- 旧版本：`import { Modal } from '@roo/roo-rn1'`
- 新版本：`import { RCModal } from '@sfe/wand-rn'`（包级别仅导出低级 RCModal，高级 AntmModal 未在包级别导出）

### 2. 命令式 API 移除
- 旧版本：`Modal.open(options)` 返回 TopViewManager，支持 `.close()` 等方法
- 新版本：无等效命令式 API，必须改为声明式（通过 state 控制 visible）

### 3. 回调签名变更
- 旧版本回调均接收 `ModalState` 参数：`onClose(state)`、`onAnimationEnd(state)`
- 新版本回调无 state 参数：`onClose()`、`onAnimationEnd(visible: boolean)`
- `onBeforeOpen`、`onBeforeClose`、`onPressClose` 完全移除，无等效属性

### 4. 遮罩透明度不可配置
- 旧版本：`maskOpacity` 支持自定义，默认 0.6
- 新版本：遮罩透明度固定为 0.5，不可配置

### 5. maskClosable 默认值变更
- 旧版本：默认 `true`（点击遮罩关闭）
- 新版本 RCModal：默认 `true`
- 新版本 AntmModal：默认 `false`（点击遮罩不关闭）
- 迁移时需显式设置 `maskClosable={true}` 以保持旧行为

### 6. 布局属性移除
- 旧版本：`alignItems`、`flex`、`marginHorizontal`、`marginTop`、`marginBottom` 等布局属性
- 新版本：这些属性全部移除，需通过 `wrapStyle`（RCModal）或 `style`（AntmModal）自行实现布局

### 7. 安卓返回键处理方式变更
- 旧版本：`preventAndroidBackHandler` 布尔值控制
- 新版本：`onRequestClose` 回调函数，返回 `true` 阻止默认关闭行为

### 8. 动画系统变更
- 旧版本：`duration` + `easing` + `animatedTranslateX/Y` 自定义动画
- 新版本：`animationDuration` + `animationType`（预设动画类型：none/fade/slide-up/slide-down/slide-left）
- 自定义缓动函数和位移量不再支持

### 9. 新增功能（仅 AntmModal）
- **title**：内置标题展示
- **footer**：内置底部操作按钮（Action[] 类型）
- **transparent**：对话框模式
- **popup**：底部弹出模式
- **bodyStyle**：内容区域样式

## 注意事项

1. **命令式调用迁移**：所有 `Modal.open()` 调用必须重构为声明式组件，需引入 state 管理 visible 状态
2. **回调签名适配**：所有使用 `ModalState` 参数的回调需移除该参数，如需状态信息需自行维护
3. **遮罩行为差异**：`maskClosable` 默认值变更，迁移时需显式指定以保持旧行为
4. **遮罩透明度**：如业务依赖自定义 `maskOpacity`，迁移后无法精确还原（固定 0.5）
5. **布局调整**：布局属性（marginTop、marginBottom、alignItems 等）全部移至样式对象中处理
6. **关闭按钮**：`showBottomClose` 无等效属性，需自行实现底部关闭按钮 UI
7. **键盘避让**：`keyboardBehavior`/`keyboardVerticalOffset` 移除，需自行包裹 `KeyboardAvoidingView`
8. **动画精细控制**：自定义 `easing` 和 `animatedTranslateX/Y` 不再支持，改用预设 `animationType`
9. **生命周期缺失**：`onBeforeOpen`、`onBeforeClose` 无替代方案，如有前置逻辑需在触发 visible 变更前执行

## 迁移检查清单

- [ ] 将 `import { Modal } from '@roo/roo-rn1'` 替换为 `import { RCModal } from '@sfe/wand-rn'`
- [ ] 将所有 `Modal.open()` 命令式调用重构为声明式组件
- [ ] 移除 `maskOpacity` 属性（不可配置）
- [ ] 检查 `maskClosable` 默认值差异，必要时显式设为 `true`
- [ ] 将 `duration` 替换为 `animationDuration`
- [ ] 移除 `easing`、`useNativeDriver` 属性
- [ ] 将 `animatedTranslateX/Y` 替换为合适的 `animationType`
- [ ] 将布局属性（alignItems、flex、marginHorizontal、marginTop、marginBottom）迁移至 `wrapStyle`
- [ ] 更新 `onClose` 回调，移除 `ModalState` 参数
- [ ] 更新 `onAnimationEnd` 回调签名为 `(visible: boolean) => void`
- [ ] 移除 `onBeforeOpen`、`onBeforeClose`、`onPressClose` 回调，将相关逻辑前移
- [ ] 将 `preventAndroidBackHandler` 替换为 `onRequestClose` 回调
- [ ] 移除 `showBottomClose`，如需要自行实现关闭按钮
- [ ] 将 `wrapperStyles` 替换为 `wrapStyle`
- [ ] 将 `containerStyles` 替换为 `style` 或 `bodyStyle`
- [ ] 移除 `keyboardBehavior`/`keyboardVerticalOffset`，自行包裹 `KeyboardAvoidingView`
- [ ] 将 `animateable` 替换为 `animated`
- [ ] 移除 `mask`、`forceFullScreen` 属性
- [ ] 测试所有弹窗的打开、关闭、动画效果
- [ ] 验证安卓返回键行为是否符合预期
