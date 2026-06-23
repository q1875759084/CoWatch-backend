# Touchable 可触摸组件

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface TouchableProps
    extends TouchableOpacityProps, TouchableHighlightProps {
    highlight?: boolean
}

export class Touchable extends PureComponent<TouchableProps> {
    static defaultProps = {
        hitSlop: variables.hitSlop,  // { top: 8, left: 8, right: 8, bottom: 8 }
        activeOpacity: variables.activeOpacity  // 0.8
    }
}
```

## 新组件 API

### Press (基础)

```tsx
export interface PressProps extends TouchableWithoutFeedbackProps {
    // 是否开启默认热区。设置hitSlop时，该属性不生效。
    enableHitSlop?: boolean
    hitSlop?: Insets
    // 节流时间
    debounceTime?: number
    children: React.ReactNode
}

export const Press = ({
    children,
    enableHitSlop = false,
    hitSlop,
    debounceTime = WAIT_TIME,  // WAIT_TIME = 150ms (DEBOUNCE_WAIT_TIME)
    onPress,
    ...restProps
}: PressProps) => ...
```

### Press.Opacity

```tsx
export interface PressOpacityProps extends TouchableOpacityProps {
    enableHitSlop?: boolean
    debounceTime?: number
    children: React.ReactNode
    activeOpacity?: number  // 默认 0.7 (ACTIVE_OPACITY)
}
```

### Press.Highlight

```tsx
export interface PressHighlightProps extends TouchableHighlightProps {
    enableHitSlop?: boolean
    debounceTime?: number
    children: React.ReactNode
}
```

### Press.Double

```tsx
export interface DoublePressProps extends Omit<PressProps, 'debounceTime'> {
    onDoublePress: (event: GestureResponderEvent) => void
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| highlight=true | Press.Highlight | 当需要高亮效果时使用 |
| highlight=false (默认) | Press.Opacity | 当需要透明度效果时使用 |
| activeOpacity (0.8) | activeOpacity (0.7) | Press.Opacity 默认值为 0.7，需要调整 |
| hitSlop: { top: 8, left: 8, right: 8, bottom: 8 } | enableHitSlop=true | 直接开启默认热区，或使用 hitSlop prop |
| onPress | onPress | 签名保持一致，会自动去抖动处理 |
| - | debounceTime | 新增属性，可自定义去抖动时间（默认150ms） |

## 迁移示例

### 案例 1：基础点击组件 (Opacity)

```tsx
// 迁移前
<Touchable onPress={() => handleClick()}>
    <Text>Click me</Text>
</Touchable>

// 迁移后
<Press.Opacity onPress={() => handleClick()}>
    <Text>Click me</Text>
</Press.Opacity>
```

### 案例 2：带高亮效果

```tsx
// 迁移前
<Touchable highlight onPress={() => handleClick()}>
    <View style={styles.button}>
        <Text>Click me</Text>
    </View>
</Touchable>

// 迁移后
<Press.Highlight onPress={() => handleClick()}>
    <View style={styles.button}>
        <Text>Click me</Text>
    </View>
</Press.Highlight>
```

### 案例 3：自定义热区

```tsx
// 迁移前
<Touchable 
    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
    onPress={() => handleClick()}
>
    <Text>Click me</Text>
</Touchable>

// 迁移后 - 方案A：使用自定义 hitSlop
<Press.Opacity 
    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
    onPress={() => handleClick()}
>
    <Text>Click me</Text>
</Press.Opacity>

// 迁移后 - 方案B：使用默认热区
<Press.Opacity 
    enableHitSlop
    onPress={() => handleClick()}
>
    <Text>Click me</Text>
</Press.Opacity>
```

### 案例 4：自定义透明度

```tsx
// 迁移前
<Touchable 
    activeOpacity={0.5}
    onPress={() => handleClick()}
>
    <Text>Click me</Text>
</Touchable>

// 迁移后
<Press.Opacity 
    activeOpacity={0.5}
    onPress={() => handleClick()}
>
    <Text>Click me</Text>
</Press.Opacity>
```

### 案例 5：自定义去抖动时间

```tsx
// 迁移前 - 旧组件无去抖动功能
<Touchable onPress={() => handleClick()}>
    <Text>Click me</Text>
</Touchable>

// 迁移后 - 新组件自动去抖动，默认150ms
<Press.Opacity 
    debounceTime={300}  // 自定义去抖动时间为300ms
    onPress={() => handleClick()}
>
    <Text>Click me</Text>
</Press.Opacity>
```

### 案例 6：双击事件

```tsx
// 迁移前 - 如需双击，需要自己实现
// 旧方案使用 Touchable 加自定义双击逻辑

// 迁移后 - 使用 Press.Double
<Press.Double 
    onDoublePress={() => handleDoubleClick()}
>
    <Text>Double click me</Text>
</Press.Double>
```

### 案例 7：无反馈 (Press基础版本)

```tsx
// 迁移前 - 如需无反馈效果，需要使用原生 TouchableWithoutFeedback
// <TouchableWithoutFeedback>

// 迁移后 - 使用 Press (基础版本，无视觉反馈)
<Press onPress={() => handleClick()}>
    <Text>Click me</Text>
</Press>
```

## 关键点

- `Touchable` 组件通过 `highlight` 属性在 `TouchableOpacity` 和 `TouchableHighlight` 之间切换
- 新的 `Press` 组件体系提供了三个专用组件：
  - `Press.Opacity`: 透明度反馈（对应旧的 `highlight=false`）
  - `Press.Highlight`: 高亮反馈（对应旧的 `highlight=true`）
  - `Press`: 无视觉反馈（基础包装）
- `Press.Double`: 新增双击组件，简化双击逻辑实现
- 新组件**自动进行去抖动处理**（默认150ms），这是一个重要改进
- 旧组件 `activeOpacity` 默认值为 0.8，新组件 `Press.Opacity` 默认值为 0.7，需要注意
- 热区处理方式改变：
  - 旧组件：默认使用 `variables.hitSlop` (8px)
  - 新组件：可通过 `enableHitSlop` 开启默认热区，或直接传 `hitSlop` prop
- **不要使用包装器/适配器**，直接根据需要选择合适的 Press 组件替代

## 迁移策略

1. **评估组件用途**：
   - 需要透明度反馈 → 使用 `Press.Opacity`
   - 需要高亮反馈 → 使用 `Press.Highlight`
   - 无需视觉反馈 → 使用 `Press`
   - 需要双击 → 使用 `Press.Double`

2. **处理热区**：
   - 若原代码未指定 `hitSlop`，建议添加 `enableHitSlop` 保持默认行为
   - 若原代码指定了自定义 `hitSlop`，直接传入新组件

3. **处理透明度**：
   - 若原代码使用了 `activeOpacity`，检查是否需要调整（0.8 → 0.7）
   - 若未指定，新的默认值 0.7 通常可接受

4. **测试去抖动**：
   - 新组件的自动去抖动可能改变交互行为
   - 如需禁用，传 `debounceTime={0}`
   - 如需自定义，根据业务需求调整 `debounceTime`
