# BottomModal 半页弹窗

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface BottomModalButtonHeaderProps {
    // 标题
    title?: string
    // 右按钮文案
    rightLabel?: string | JSX.Element
    // 左按钮文案
    leftLabel?: string | JSX.Element
    // 左按钮点击回调
    onPressLeft?: () => void
    // 右按钮点击回调
    onPressRight?: () => void
    // testID
    testID?: string
}

interface BottomModalButtonProps extends ButtonProps {
    // 按钮文本
    text: string
}

interface BottomModalProps {
    // 控制弹框显示
    visible: boolean
    // 是否可关闭蒙层，默认 true
    maskClosable?: boolean
    // 头部
    header?: BottomModalButtonHeaderProps | JSX.Element
    // 底部区域
    footer?: BottomModalButtonProps[]
    // 是否保留内容区水平padding，默认 16
    paddingHorizontal?: number
    // 点击关闭的回调
    onClose?: () => void
    // 动画结束时的回调
    onAnimationEnd?: () => void
    // 模态窗口子元素
    children: React.ReactNode
}

interface BottomModalOpenProps extends Omit<BottomModalProps, 'visible' | 'children' | 'onAnimationEnd'> {
    // 弹框内容
    content: React.ReactNode
}

// 静态方法
BottomModal.open(options: BottomModalOpenProps): () => void
```

## 新组件 API

```tsx
interface BottomModalHeaderProps {
    // 标题
    title?: string
    // 右按钮文案
    rightLabel?: string | JSX.Element
    // 左按钮文案
    leftLabel?: string | JSX.Element
    // 左按钮点击回调
    onPressLeft?: () => void
    // 右按钮点击回调
    onPressRight?: () => void
}

/**
 * @deprecated 即将废弃，请使用 BottomModalHeaderProps
 */
export type BottomModalButtonHeaderProps = BottomModalHeaderProps

interface BottomModalButtonProps extends ButtonProps {
    // 按钮文本
    text: string
}

interface BottomModalProps {
    // 控制弹框显示
    visible: boolean
    // 是否可关闭蒙层，默认 true
    maskClosable?: boolean
    // 头部
    header?: BottomModalHeaderProps | JSX.Element
    // 底部区域
    footer?: BottomModalButtonProps[]
    // testID
    testID?: string
    /**
     * @deprecated 即将废弃
     * 是否保留内容区水平 padding，默认 12
     */
    paddingHorizontal?: number
    // 点击关闭的回调
    onClose?: () => void
    // 动画结束时的回调
    onAnimationEnd?: () => void
    // 模态窗口子元素
    children: React.ReactNode
    // 调用RCModal的方式
    callType?: 'method' | 'jsx'
    // 原 SlideModal 和 BottomModal 二合一，默认 'default'
    mode?: 'default' | 'slide-modal'
    // 外部自定义样式，兼容 SlideModal 组件
    styles?: {
        [K in keyof BottomModalStyleType]?: Partial<BottomModalStyleType[K]>
    }
}

interface BottomModalOpenProps extends Omit<BottomModalProps, 'visible' | 'children' | 'onAnimationEnd'> {
    // 弹框内容
    content: React.ReactNode
}

interface BottomModalType extends React.FC<BottomModalProps> {
    open: (props: BottomModalOpenProps) => () => void
}

// 静态方法
BottomModal.open(props: BottomModalOpenProps): () => void
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| 无 | testID | 新增，用于测试 ID 标识 |
| paddingHorizontal (默认 16) | paddingHorizontal (默认 12) | 默认值改变，已标记为废弃 |
| 无 | mode | 新增，支持原 SlideModal 和 BottomModal 二合一 |
| 无 | styles | 新增，支持外部自定义样式 |
| header.testID (在 BottomModalButtonHeaderProps) | 移至 BottomModalProps.testID | testID 从 header 专属属性移至 props 顶层 |
| BottomModalButtonHeaderProps | BottomModalHeaderProps | 类型名改变，旧名称标记为废弃的别名 |

## 关键变更

### 1. testID 处理变化
**旧版本**：`testID` 是 `BottomModalButtonHeaderProps` 的属性，用于标识 header 按钮的测试 ID。

**新版本**：`testID` 移至 `BottomModalProps` 顶层属性，但在内部仍用于标识 header 按钮。

```tsx
// 迁移前
<BottomModal
  visible={true}
  header={{
    title: '标题',
    testID: 'header-test'
  }}
/>

// 迁移后
<BottomModal
  visible={true}
  testID="header-test"  // 移至顶层
  header={{
    title: '标题'
  }}
/>
```

### 2. paddingHorizontal 默认值改变
**旧版本**：默认值为 16。

**新版本**：默认值改为 12（已标记为废弃）。

### 3. 新增 mode 属性
**新版本**支持 `mode` 属性用于兼容原 `SlideModal` 组件。

```tsx
// 支持的 mode 值
'default' | 'slide-modal'
```

### 4. 新增 styles 自定义样式
**新版本**支持通过 `styles` 属性进行外部样式自定义。

### 5. BottomModalButtonHeaderProps 废弃
**新版本**将 `BottomModalButtonHeaderProps` 标记为废弃，官方推荐使用 `BottomModalHeaderProps`。

## 迁移示例

### 案例 1：基础使用（无需改动）

```tsx
// 迁移前
<BottomModal
  visible={visible}
  header={{
    title: '确认删除',
    leftLabel: '取消',
    rightLabel: '删除',
    onPressLeft: () => {},
    onPressRight: () => {}
  }}
  footer={[
    { text: '取消', onPress: () => {} },
    { text: '确认', onPress: () => {} }
  ]}
  onClose={() => setVisible(false)}
>
  <Text>确认要删除该项目吗？</Text>
</BottomModal>

// 迁移后（完全兼容，无需改动）
<BottomModal
  visible={visible}
  header={{
    title: '确认删除',
    leftLabel: '取消',
    rightLabel: '删除',
    onPressLeft: () => {},
    onPressRight: () => {}
  }}
  footer={[
    { text: '取消', onPress: () => {} },
    { text: '确认', onPress: () => {} }
  ]}
  onClose={() => setVisible(false)}
>
  <Text>确认要删除该项目吗？</Text>
</BottomModal>
```

### 案例 2：使用 testID（需要迁移）

```tsx
// 迁移前
<BottomModal
  visible={visible}
  header={{
    title: '编辑',
    testID: 'edit-header',
    rightLabel: '保存',
    onPressRight: handleSave
  }}
  onClose={() => setVisible(false)}
>
  <Text>编辑内容</Text>
</BottomModal>

// 迁移后
<BottomModal
  visible={visible}
  testID="edit-header"  // 从 header 移至 props 顶层
  header={{
    title: '编辑',
    rightLabel: '保存',
    onPressRight: handleSave
  }}
  onClose={() => setVisible(false)}
>
  <Text>编辑内容</Text>
</BottomModal>
```

### 案例 3：使用 paddingHorizontal

```tsx
// 迁移前
<BottomModal
  visible={visible}
  paddingHorizontal={20}
  header={{ title: '设置' }}
  onClose={() => setVisible(false)}
>
  <Text>内容</Text>
</BottomModal>

// 迁移后（可保持不变，但建议显式指定）
<BottomModal
  visible={visible}
  paddingHorizontal={20}  // 保持不变，但该属性已标记为废弃
  header={{ title: '设置' }}
  onClose={() => setVisible(false)}
>
  <Text>内容</Text>
</BottomModal>

// 或者使用新的 mode 和 styles（如需自定义）
<BottomModal
  visible={visible}
  mode="default"
  styles={{
    modalContent: { paddingHorizontal: 20 }
  }}
  header={{ title: '设置' }}
  onClose={() => setVisible(false)}
>
  <Text>内容</Text>
</BottomModal>
```

### 案例 4：使用静态方法 BottomModal.open()

```tsx
// 迁移前
const closeModal = BottomModal.open({
  header: {
    title: '提示',
    rightLabel: '确认',
    onPressRight: () => closeModal()
  },
  content: <Text>操作成功</Text>
})

// 迁移后（完全兼容，无需改动）
const closeModal = BottomModal.open({
  header: {
    title: '提示',
    rightLabel: '确认',
    onPressRight: () => closeModal()
  },
  content: <Text>操作成功</Text>
})
```

### 案例 5：迁移到 SlideModal 兼容模式

如果你之前使用过 `SlideModal` 组件（原 flower-rn 的另一个组件），新的 wand-rn `BottomModal` 支持通过 `mode="slide-modal"` 进行兼容。

```tsx
// 迁移前（使用 SlideModal）
<SlideModal
  visible={visible}
  onClose={() => setVisible(false)}
>
  <Text>内容</Text>
</SlideModal>

// 迁移后
<BottomModal
  visible={visible}
  mode="slide-modal"  // 使用 slide-modal 模式
  onClose={() => setVisible(false)}
>
  <Text>内容</Text>
</BottomModal>
```

## 关键点

- **完全向后兼容**：基础使用方式无需任何改动，迁移平滑
- **testID 位置改变**：如使用了 `testID` 属性，需要从 `header` 对象移至 `BottomModalProps` 顶层
- **paddingHorizontal 已废弃**：该属性标记为废弃，未来版本可能移除。建议使用 `styles` 进行样式自定义
- **BottomModalButtonHeaderProps 已废弃**：改用 `BottomModalHeaderProps`，两者当前功能相同
- **新增 SlideModal 兼容**：可通过 `mode="slide-modal"` 兼容原 SlideModal 组件
- **HeaderStyle 接口保持不变**：`BottomModalHeaderStyles` 及相关样式接口保持不变
- **Footer 最多 2 个按钮**：限制未变，仍然最多只能有 2 个 footer 按钮
- **静态方法 BottomModal.open() 兼容**：返回值类型和使用方式保持不变
