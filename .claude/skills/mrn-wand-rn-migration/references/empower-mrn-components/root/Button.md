# Button 按钮

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
// 来自 @ss/mtd-react-native 的 ButtonProps
export interface ButtonProps {
    /** 按钮类型 */
    type?: 'primary' | 'default' | 'warning' | 'danger' | 'success' | 'link'
    /** 按钮大小 */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    /** 按钮宽度 */
    width?: number | string  // 默认 'padded'
    /** 自定义样式 */
    style?: StyleProp<ViewStyle>
    /** 是否禁用 */
    disabled?: boolean
    /** 图标 */
    icon?: React.ReactNode
    /** 文本内容 */
    children?: string | React.ReactNode
    /** 点击事件回调 */
    onPress?: (event: GestureResponderEvent) => void
    /** 其他 TouchableOpacity 属性 */
    [key: string]: any
}

export class Button extends PureComponent<ButtonProps> {
    // 组件已废弃，建议使用 shuguopai/components/button 替代
}
```

## 新组件 API

```tsx
export type ButtonPropsType = 'default' | 'primary' | 'textPrimary' | 'danger' | 'other' | 'success' | 'warning' | 'text'

export type ButtonPropsSize = 'lg' | 'md' | 'sm' | 'xs' | '2xs'

export type EnableDebounceExtendType = {
    wait?: number  // 延迟毫秒数，默认 300
    leading?: boolean  // 延迟开始前调用，默认 false
    trailing?: boolean  // 延迟结束后调用，默认 true
    maxWait?: number  // 延迟最大值
}

export interface ButtonProps {
    /** 按钮类型 */
    type?: ButtonPropsType  // 默认 'default'
    /** 按钮大小 */
    size?: ButtonPropsSize  // 默认 'md'
    /** 按钮宽度 */
    width?: number | string
    /** 自定义图标 */
    icon?: JSX.Element
    /** 是否禁用 */
    disabled?: boolean  // 默认 false
    /** 设置按钮载入状态 */
    loading?: boolean  // 默认 false
    /** 点击事件回调 */
    onPress?: (event: GestureResponderEvent) => void
    /** 点击按住的回调 */
    onPressIn?: (event: GestureResponderEvent) => void
    /** 点击释放的回调 */
    onPressOut?: (event: GestureResponderEvent) => void
    /** 按钮内容 */
    children?: string | JSX.Element
    /** 是否点击防抖 */
    enableDebounce?: boolean | EnableDebounceExtendType  // 默认 false
    /** 禁用时的点击事件回调 */
    onPressWhenDisabled?: (event: GestureResponderEvent) => void
    /** 按钮热区 */
    hitSlop?: Insets  // { top, left, bottom, right }
    /** 向后兼容的样式属性 */
    style?: StyleProp<ViewStyle>
}

export const Button: React.FC<ButtonProps>
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| type | type | 按钮类型，值有变更 |
| size | size | 按钮大小，值范围有变更 |
| width | width | 按钮宽度 |
| style | style | 样式属性（仅向后兼容） |
| disabled | disabled | 禁用状态 |
| icon | icon | 图标 |
| children | children | 按钮文本 |
| onPress | onPress | 点击事件 |
| - | onPressIn | 按住事件（新增） |
| - | onPressOut | 释放事件（新增） |
| - | loading | 加载状态（新增） |
| - | enableDebounce | 防抖功能（新增） |
| - | onPressWhenDisabled | 禁用时点击回调（新增） |
| - | hitSlop | 按钮热区（新增） |

### 按钮类型映射

| 旧类型 | 新类型 | 说明 |
|--------|--------|------|
| 'primary' | 'primary' | 主要按钮 |
| 'default' | 'default' | 默认按钮 |
| 'warning' | 'warning' | 警告按钮 |
| 'danger' | 'danger' | 危险按钮 |
| 'success' | 'success' | 成功按钮 |
| 'link' | 'text' | 文本按钮（属性名变更） |
| - | 'textPrimary' | 次要按钮（新增） |
| - | 'other' | 其他按钮（新增） |

### 按钮大小映射

| 旧大小 | 新大小 | 高度 | 字号 |
|--------|--------|------|------|
| 'xl' | - | - | - |
| 'lg' | 'lg' | 52 | 16 |
| 'md' | 'md' | 40 | 14 |
| 'sm' | 'sm' | 32 | 12 |
| 'xs' | 'xs' | 24 | 12 |
| - | '2xs' | 20 | 10 |

## 迁移示例

### 案例 1：基础按钮

```tsx
// 迁移前
import { Button } from '@mtfe/empower-mrn-components'

<Button onPress={() => console.log('clicked')}>
    点击我
</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button onPress={() => console.log('clicked')}>
    点击我
</Button>
```

### 案例 2：不同类型的按钮

```tsx
// 迁移前
<View>
    <Button type='primary'>主要按钮</Button>
    <Button type='default'>默认按钮</Button>
    <Button type='warning'>警告按钮</Button>
    <Button type='danger'>危险按钮</Button>
    <Button type='success'>成功按钮</Button>
    <Button type='link'>链接按钮</Button>
</View>

// 迁移后
<View>
    <Button type='primary'>主要按钮</Button>
    <Button type='default'>默认按钮</Button>
    <Button type='warning'>警告按钮</Button>
    <Button type='danger'>危险按钮</Button>
    <Button type='success'>成功按钮</Button>
    <Button type='text'>文本按钮</Button>
    <Button type='textPrimary'>次要按钮</Button>
    <Button type='other'>其他按钮</Button>
</View>
```

### 案例 3：不同大小的按钮

```tsx
// 迁移前
<View>
    <Button size='xl'>xl 按钮</Button>
    <Button size='lg'>lg 按钮</Button>
    <Button size='md'>md 按钮</Button>
    <Button size='sm'>sm 按钮</Button>
    <Button size='xs'>xs 按钮</Button>
</View>

// 迁移后
<View>
    {/* 'xl' 已移除，使用 'lg' 替代 */}
    <Button type='primary' size='lg'>lg 按钮</Button>
    <Button type='primary' size='md'>md 按钮</Button>
    <Button type='primary' size='sm'>sm 按钮</Button>
    <Button type='primary' size='xs'>xs 按钮</Button>
    <Button type='primary' size='2xs'>2xs 按钮</Button>
</View>
```

### 案例 4：自定义宽度

```tsx
// 迁移前
<View>
    <Button width='padded'>默认宽度</Button>
    <Button width={100}>100</Button>
    <Button width='100%'>全宽</Button>
</View>

// 迁移后
<View>
    <Button>默认宽度</Button>
    <Button width={100}>固定宽度</Button>
    <Button width={160}>固定宽度</Button>
    <Button width='100%'>全宽</Button>
</View>
```

### 案例 5：图标按钮

```tsx
// 迁移前
import { Icon } from '@mtfe/empower-mrn-components'

<Button icon={<Icon type='search' />}>
    搜索
</Button>

// 迁移后
import { Button, Icon } from '@sfe/wand-rn'

<Button icon={<Icon type='search' />}>
    搜索
</Button>

// 仅图标按钮
<Button type='primary' icon={<Icon type='search' />} />
```

### 案例 6：禁用状态

```tsx
// 迁移前
<Button disabled onPress={() => console.log('clicked')}>
    禁用按钮
</Button>

// 迁移后
<Button disabled onPress={() => console.log('clicked')}>
    禁用按钮
</Button>

// 新增：禁用时的点击回调
<Button 
    disabled 
    onPressWhenDisabled={() => Toast.show('按钮已禁用')}
>
    禁用按钮
</Button>
```

### 案例 7：加载状态

```tsx
// 迁移前 - 无内置加载状态支持
<Button>提交</Button>

// 迁移后 - 内置加载状态
const [loading, setLoading] = useState(false)

<Button 
    loading={loading} 
    onPress={async () => {
        setLoading(true)
        await submitForm()
        setLoading(false)
    }}
>
    提交
</Button>
```

### 案例 8：防抖功能

```tsx
// 迁移前 - 需要手动处理防抖
const debouncedSubmit = debounce(() => submitForm(), 300)

<Button onPress={debouncedSubmit}>
    提交
</Button>

// 迁移后 - 使用内置防抖
<Button 
    enableDebounce  // 默认延迟 300ms
    onPress={() => submitForm()}
>
    提交
</Button>

// 或自定义防抖参数
<Button 
    enableDebounce={{
        wait: 500,
        leading: false,
        trailing: true,
        maxWait: 1000
    }}
    onPress={() => submitForm()}
>
    提交
</Button>
```

### 案例 9：点击事件回调

```tsx
// 迁移前
<Button 
    onPress={() => console.log('pressed')}
>
    点击
</Button>

// 迁移后
<Button 
    onPress={() => console.log('pressed')}
    onPressIn={() => console.log('press in')}
    onPressOut={() => console.log('press out')}
>
    点击
</Button>
```

### 案例 10：热区设置

```tsx
// 迁移前 - 无热区配置

// 迁移后 - 配置热区
<Button 
    hitSlop={{
        top: 10,
        left: 10,
        bottom: 10,
        right: 10
    }}
    onPress={() => console.log('clicked')}
>
    扩大触发区域
</Button>
```

### 案例 11：组合使用多个属性

```tsx
// 迁移前
<Button 
    type='primary'
    size='lg'
    width={160}
    disabled={isSubmitting}
    icon={<Icon type='check' />}
    onPress={handleSubmit}
>
    提交
</Button>

// 迁移后
<Button 
    type='primary'
    size='lg'
    width={160}
    disabled={isSubmitting}
    loading={isSubmitting}
    icon={<Icon type='check' />}
    enableDebounce={{
        wait: 300
    }}
    onPress={handleSubmit}
    onPressWhenDisabled={() => Toast.show('正在提交')}
    hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
>
    提交
</Button>
```

### 案例 12：按钮组

```tsx
// 迁移前
<View style={{ flexDirection: 'row' }}>
    <View style={{ marginRight: 10 }}>
        <Button type='default' onPress={handleCancel}>
            取消
        </Button>
    </View>
    <Button type='primary' onPress={handleSubmit}>
        确定
    </Button>
</View>

// 迁移后
<View style={{ flexDirection: 'row', gap: 10 }}>
    <Button type='default' onPress={handleCancel}>
        取消
    </Button>
    <Button type='primary' onPress={handleSubmit}>
        确定
    </Button>
</View>
```

### 案例 13：样式定制（不推荐）

```tsx
// 迁移前 - 支持自定义样式
<Button 
    style={{ 
        marginHorizontal: 10, 
        marginVertical: 5,
        borderRadius: 20
    }}
>
    自定义样式
</Button>

// 迁移后 - 不支持自定义样式，使用 View 包装
<View style={{ marginHorizontal: 10, marginVertical: 5 }}>
    <Button>
        自定义外边距
    </Button>
</View>
```

### 案例 14：表单提交场景

```tsx
// 迁移前
const [loading, setLoading] = useState(false)

<Button 
    disabled={loading}
    type='primary'
    width='100%'
    onPress={async () => {
        setLoading(true)
        try {
            await submitForm()
            Toast.show('提交成功')
        } catch (error) {
            Toast.show('提交失败')
        } finally {
            setLoading(false)
        }
    }}
>
    提交
</Button>

// 迁移后 - 利用新增的 loading 属性
const [loading, setLoading] = useState(false)

<Button 
    type='primary'
    width='100%'
    loading={loading}
    enableDebounce={{
        wait: 500
    }}
    onPress={async () => {
        setLoading(true)
        try {
            await submitForm()
            Toast.show('提交成功')
        } catch (error) {
            Toast.show('提交失败')
        } finally {
            setLoading(false)
        }
    }}
    onPressWhenDisabled={() => Toast.show('请勿重复提交')}
>
    提交
</Button>
```

## 关键点

### 按钮类型变化

- **'link' → 'text'**：链接按钮改名为文本按钮
- **新增 'textPrimary'**：次要按钮（介于主要和默认之间）
- **新增 'other'**：其他按钮类型
- 类型名都改为小驼峰命名

### 按钮大小变化

- **'xl' 已移除**：不再支持特大尺寸，使用 'lg' 替代
- **新增 '2xs'**：超小尺寸（高度 20，字号 10）
- 尺寸与高度对应关系需要记住

### 新增功能

1. **Loading 状态**：按钮支持加载状态，自动显示 Loading 动画
2. **防抖功能**：内置防抖支持，避免重复点击
3. **点击回调扩展**：新增 onPressIn、onPressOut、onPressWhenDisabled
4. **热区配置**：支持扩大按钮的触发区域

### 样式限制

- 新组件**不支持自定义样式**（style 属性仅用于向后兼容）
- 如需外边距，必须使用 View 包装
- 所有样式都是预设的，无法修改按钮内部样式

### 防抖配置

```tsx
// 默认防抖（延迟 300ms，仅 trailing 执行）
enableDebounce={true}

// 自定义防抖
enableDebounce={{
    wait: 500,        // 延迟时间
    leading: true,    // 是否在前缘执行
    trailing: true,   // 是否在后缘执行
    maxWait: 2000     // 最大延迟时间
}}
```

## 迁移策略

### 第一步：更新导入和组件名

```tsx
// 旧
import { Button } from '@mtfe/empower-mrn-components'

// 新
import { Button } from '@sfe/wand-rn'
```

### 第二步：检查按钮类型

```tsx
// 'link' → 'text'
<Button type='link'>  // ❌
<Button type='text'>  // ✓

// 'primary' 等其他类型保持不变
```

### 第三步：检查按钮大小

```tsx
// 'xl' 不再支持，改用 'lg'
<Button size='xl'>   // ❌
<Button size='lg'>   // ✓

// 其他大小保持不变，但新增了 '2xs'
```

### 第四步：移除自定义样式

```tsx
// 如果有 style 属性，需要改为 View 包装
// 旧
<Button style={{ marginVertical: 10 }}>按钮</Button>

// 新
<View style={{ marginVertical: 10 }}>
    <Button>按钮</Button>
</View>
```

### 第五步：添加新功能

```tsx
// 可选：添加加载状态
<Button loading={isLoading}>提交</Button>

// 可选：添加防抖
<Button enableDebounce>提交</Button>

// 可选：禁用时回调
<Button 
    disabled={isLoading}
    onPressWhenDisabled={() => Toast.show('加载中')}
>
    提交
</Button>
```

## 常见迁移问题

### Q: 'xl' 大小在新组件中去哪了？

A: 'xl' 已移除，需要使用 'lg' 替代。如果需要更大的按钮，可以通过 `width` 属性增加宽度。

### Q: 如何自定义按钮样式？

A: 新组件**不支持自定义样式**。所有样式都是预设的。如需调整外边距或其他样式，使用 View 包装：

```tsx
<View style={{ marginVertical: 10, marginHorizontal: 20 }}>
    <Button>按钮</Button>
</View>
```

### Q: 如何实现防止重复提交？

A: 使用新增的 `enableDebounce` 属性：

```tsx
<Button 
    enableDebounce={{
        wait: 500
    }}
    onPress={submitForm}
>
    提交
</Button>
```

或使用 `loading` 状态：

```tsx
<Button 
    loading={isSubmitting}
    onPress={async () => {
        setIsSubmitting(true)
        await submitForm()
        setIsSubmitting(false)
    }}
>
    提交
</Button>
```

### Q: 禁用时如何提示用户？

A: 使用新增的 `onPressWhenDisabled` 回调：

```tsx
<Button 
    disabled={isLoading}
    onPressWhenDisabled={() => Toast.show('正在加载')}
>
    提交
</Button>
```

### Q: 如何处理按钮的加载状态？

A: 使用新增的 `loading` 属性，自动显示加载动画：

```tsx
const [loading, setLoading] = useState(false)

<Button 
    loading={loading}
    onPress={async () => {
        setLoading(true)
        await submitForm()
        setLoading(false)
    }}
>
    提交
</Button>
```

### Q: 如何扩大按钮的可点击区域？

A: 使用新增的 `hitSlop` 属性：

```tsx
<Button 
    hitSlop={{
        top: 10,
        left: 10,
        bottom: 10,
        right: 10
    }}
    onPress={handlePress}
>
    按钮
</Button>
```

### Q: 防抖和 loading 可以一起使用吗？

A: 可以，建议结合使用：

```tsx
<Button 
    loading={isLoading}
    enableDebounce={{ wait: 300 }}
    onPress={handleSubmit}
>
    提交
</Button>
```

### Q: 新组件的按钮宽度如何设置？

A: 使用 `width` 属性，支持数字和字符串：

```tsx
<Button width={100}>固定 100</Button>
<Button width={160}>固定 160</Button>
<Button width='100%'>全宽</Button>
<Button width='50%'>半宽</Button>
```

### Q: 如何隐藏按钮文本只显示图标？

A: 不传 children，只传 icon：

```tsx
<Button 
    type='primary' 
    icon={<Icon type='search' />}
/>
```

## 注意事项

1. **按钮类型更新**：确保检查所有使用 'link' 类型的地方，改为 'text'

2. **按钮大小更新**：检查是否使用了 'xl' 大小，改为 'lg'

3. **样式不可定制**：新组件的样式完全预设，无法自定义，需要使用 View 包装来调整外边距或其他样式

4. **防抖默认行为**：`enableDebounce={true}` 默认延迟 300ms，且仅在后缘执行，可通过传入对象自定义

5. **Loading 状态**：loading 状态优先级高于 disabled，当 loading=true 时，按钮会显示加载动画并禁用点击

6. **内存泄漏防护**：使用防抖时要注意组件卸载时的清理，但组件已内置处理

7. **回调函数**：所有回调都会接收 `GestureResponderEvent` 对象作为参数

8. **向后兼容**：虽然新组件支持 style 属性用于向后兼容，但**强烈不建议使用**，会导致样式混乱

## 迁移检查清单

- [ ] 更新导入语句（Button）
- [ ] 检查并修改 type='link' 为 type='text'
- [ ] 检查并修改 size='xl' 为 size='lg'
- [ ] 移除 style 属性，改为 View 包装
- [ ] 检查是否需要添加 loading 状态
- [ ] 检查是否需要添加 enableDebounce 防抖
- [ ] 检查是否需要添加 onPressWhenDisabled 禁用回调
- [ ] 检查是否需要配置 hitSlop 热区
- [ ] 验证按钮的显示和功能正常
- [ ] 验证加载、禁用等状态显示正常
- [ ] 验证点击事件回调正常
- [ ] 验证防抖功能正常（如果启用）
- [ ] 测试不同类型和大小的按钮
- [ ] 测试按钮组合场景

## 与 wand-rn Button 的功能对比

| 功能 | 旧 Button | 新 Button | 说明 |
|------|----------|----------|------|
| 基础按钮 | ✓ | ✓ | 都支持 |
| 按钮类型 | ✓ | ✓ | 类型值有变更 |
| 按钮大小 | ✓ | ✓ | 不支持 'xl' |
| 自定义宽度 | ✓ | ✓ | 都支持 |
| 图标支持 | ✓ | ✓ | 都支持 |
| 禁用状态 | ✓ | ✓ | 都支持 |
| 自定义样式 | ✓ | ✗ | 旧支持，新不支持 |
| Loading 状态 | ✗ | ✓ | 新组件新增 |
| 防抖功能 | ✗ | ✓ | 新组件新增 |
| 禁用回调 | ✗ | ✓ | 新组件新增 |
| 按钮热区 | ✗ | ✓ | 新组件新增 |
| PressIn/Out | ✗ | ✓ | 新组件新增 |
