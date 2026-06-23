# Button 按钮

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface ButtonProps {
    type?: 'default' | 'primary' | 'danger' | 'info' | 'success' | 'warning' | 'text'
    size?: 'sm' | 'md' | 'lg'
    style?: any
    disabled?: boolean
    onPress?: Function
    reverse?: boolean
    textStyle?: any
}
```

## 新组件 API

```tsx
export type ButtonPropsType = 
    | 'default' | 'primary' | 'textPrimary' | 'danger' 
    | 'other' | 'success' | 'warning' | 'text'

export type ButtonPropsSize = 'lg' | 'md' | 'sm' | 'xs' | '2xs'

export interface ButtonProps {
    type?: ButtonPropsType
    size?: ButtonPropsSize
    width?: number | string
    icon?: JSX.Element
    disabled?: boolean
    loading?: boolean
    onPress?: (event: GestureResponderEvent) => void
    onPressIn?: (event: GestureResponderEvent) => void
    onPressOut?: (event: GestureResponderEvent) => void
    children?: string | JSX.Element
    enableDebounce?: EnableDebounce
    style?: StyleProp<ViewStyle>  // 向后兼容
    onPressWhenDisabled?: (event: GestureResponderEvent) => void
    hitSlop?: Insets
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| type | type | 新增 'textPrimary' 和 'other' 类型 |
| size | size | 新增 'xs' 和 '2xs' 尺寸 |
| textStyle | children | 内容使用 children，样式通过 Text 控制 |
| reverse | - | 移除，需使用新的样式方式 |
| onPress | onPress | 签名从 Function 变为 (event: GestureResponderEvent) => void |

## 迁移示例

### 案例 1：基础按钮

```tsx
// 迁移前
<Button type='text' onPress={() => fn()}>按钮</Button>

// 迁移后
<Button type="text" onPress={() => fn()}>按钮</Button>
```

### 案例 2：带样式的按钮

```tsx
// 迁移前
<Button 
  style={styles.loganBtn} 
  textStyle={styles.text} 
  type='text' 
  onPress={() => fn()}
>
  按钮
</Button>

// 迁移后
<Button 
  type="text" 
  onPress={() => fn()}
  style={styles.buttonContainer}
>
  <Text style={styles.text}>按钮</Text>
</Button>
```

### 案例 3：主按钮

```tsx
// 迁移前
<Button type='primary' size='lg' onPress={handleSubmit}>提交</Button>

// 迁移后
<Button type="primary" size="lg" onPress={handleSubmit}>提交</Button>
```

### 案例 4：禁用状态

```tsx
// 迁移前
<Button type='primary' disabled={!isValid} onPress={handleSubmit}>提交</Button>

// 迁移后
<Button type="primary" disabled={!isValid} onPress={handleSubmit}>提交</Button>
```

### 案例 5：带图标的按钮

```tsx
// 迁移前
<Button type='primary' icon={<Icon name="share" />}>分享</Button>

// 迁移后
<Button type="primary" icon={<Icon name="share" />}>分享</Button>
```

## 关键点

- `textStyle` 被移除，需要用 Text 组件或使用 `children` + 自定义样式
- 新增 `loading`、`enableDebounce` 等实用功能
- 移除了 `reverse` 属性，使用新的类型系统替代
- 新组件支持更精细的事件控制（`onPressIn`、`onPressOut`、`onPressWhenDisabled`）
