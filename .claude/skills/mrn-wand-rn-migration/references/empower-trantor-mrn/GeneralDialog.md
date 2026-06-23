# GeneralDialog 对话框

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface GeneralDialogProps {
    title?: string
    show: boolean
    message?: string
    leftButtonText?: string
    rightButtonText?: string
    leftButtonAction?: () => void
    rightButtonAction?: () => void
    image?: any
    cancelable: boolean
    buttonStyle?: StyleProp<TextStyle>
    leftButtonStyle?: StyleProp<TextStyle>
    rightButtonStyle?: StyleProp<TextStyle>
    onRequestClose: () => void
    contentView?: ReactElement
    children: React.ReactNode[]
}
```

## 新组件 API

```tsx
export interface DialogProps {
    // 是否展示dialog
    visible: boolean
    // 头部突图片
    image?: ImageSourcePropType
    // title
    title?: string | React.ReactNode
    // 主内容
    content?: string | React.ReactNode
    // 底部按钮
    actions?: {
        text: string
        type?: 'cancel' | 'confirm'
        onPress?: (val?: string) => void
    }[]
    // 底部提示
    bottomText?: string | React.ReactNode
    // 是否可以点击mask关闭
    maskClosable?: boolean
    // 点击x的回调
    onClose?: () => void
    // 是否展示输入框
    showInput?: boolean
    // 输入框placeholder
    inputPlaceholder?: string
    // 输入框的内容
    inputValue?: string
    // 输入框类型
    inputType?: 'input' | 'textArea'
    // 最多可输入的字符长度
    maxLength?: number
    // 是否内容可以滚动
    scrollable?: boolean
    // 是否展示closeIcon
    showCloseIcon?: boolean
    // 打开或关闭时动画结束回调
    onAnimationEnd?: (visible: boolean) => void
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| show | visible | 控制对话框显示/隐藏 |
| onRequestClose | onClose | 关闭回调 |
| cancelable | maskClosable | 点击mask是否关闭 |
| title | title | 标题 |
| message | content | 主内容 |
| children | content | 自定义内容 |
| leftButtonText / rightButtonText | actions[].text | 按钮文本 |
| leftButtonAction / rightButtonAction | actions[].onPress | 按钮回调 |
| image | image | 头部图片 |
| buttonStyle / leftButtonStyle / rightButtonStyle | - | 新版本按钮样式由主题控制 |
| contentView | content | 自定义内容 |

## 迁移示例

### 案例 1：基础对话框

```tsx
// 迁移前
<GeneralDialog
    show={showDialog}
    cancelable={true}
    title={phoneType === PhoneType.CUSTOMER ? '联系顾客' : '联系骑手'}
    buttonStyle={style.dialogButton}
    leftButtonText='取消'
    leftButtonAction={this._hideDialog}
    rightButtonText='联系'
    rightButtonAction={this._callPhoneNo}
    onRequestClose={this._hideDialog}>
    <View style={style.dialogContent}>
        <Text>姓名：{name}</Text>
        <Text>电话：{phoneNumber}</Text>
    </View>
</GeneralDialog>

// 迁移后
<Dialog
    visible={showDialog}
    title={phoneType === PhoneType.CUSTOMER ? '联系顾客' : '联系骑手'}
    content={
        <View>
            <Text>姓名：{name}</Text>
            <Text>电话：{phoneNumber}</Text>
        </View>
    }
    maskClosable
    onClose={this._hideDialog}
    actions={[
        {
            text: '取消',
            type: 'cancel',
            onPress: this._hideDialog,
        },
        {
            text: '联系',
            type: 'confirm',
            onPress: this._callPhoneNo,
        },
    ]}
/>
```

### 案例 2：多内容迁移

```tsx
// 迁移前
<GeneralDialog
    show={showDialog}
    cancelable={true}
    title={'联系骑手'}
    message={
        <View>
            <Text>message</Text>
        </View>
    }
    contentView={
        <View>
            <Text>content view</Text>
        </View>
    }
    leftButtonText='取消'
    leftButtonAction={this._hideDialog}
    rightButtonText='联系'
    rightButtonAction={this._callPhoneNo}
    onRequestClose={this._hideDialog}>
    <Text>children</Text>
</GeneralDialog>

// 迁移后
<Dialog
    visible={showDialog}
    title={'联系骑手'}
    content={
        <View>
            <View>
                <Text>message</Text>
            </View>
            <View>
                <Text>content view</Text>
            </View>
            <Text>children</Text>
        </View>
    }
    maskClosable
    onClose={this._hideDialog}
    actions={[
        {
            text: '取消',
            type: 'cancel',
            onPress: this._hideDialog,
        },
        {
            text: '联系',
            type: 'confirm',
            onPress: this._callPhoneNo,
        },
    ]}
/>
```

## 迁移注意事项

1. **样式简化**: 新版本不支持直接设置按钮样式，使用内置主题样式
2. **按钮顺序**: 旧版本的 leftButton/rightButton 需要按照实际语义映射到 actions 数组
3. **内容合并**: GeneralDialog 的 message、contentView、children 都需要合并到 Dialog 的 content 属性中
4. **组件一个一个迁移**: 不使用包装器/适配器来做
