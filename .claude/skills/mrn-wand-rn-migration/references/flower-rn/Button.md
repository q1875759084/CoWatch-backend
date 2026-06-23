# Button 按钮

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export type ButtonPropsType =
    | 'default'
    | 'primary'
    | 'textPrimary'
    | 'warning'
    | 'other'
    | 'success'
    | 'danger'
    | 'text'

export type ButtonPropsSize = 'lg' | 'md' | 'sm' | 'xs' | 'xxs'

export interface ButtonProps {
  /** 按钮类型 */
  type?: ButtonPropsType  // 默认 'default'
  /** 按钮大小 */
  size?: ButtonPropsSize  // 默认 'md'
  /** 按钮宽度 */
  width?: number | string
  /** 自定义图标 */
  icon?: AllIcons | JSX.Element
  /** 是否禁用 */
  disabled?: boolean  // 默认 false
  /** 设置按钮载入状态 */
  loading?: boolean  // 默认 false
  /** 点击事件回调 */
  onPress?: (event: GestureResponderEvent) => void
  /** 按住按钮的回调函数 */
  onPressIn?: (event: GestureResponderEvent) => void
  /** 放开按钮的回调函数 */
  onPressOut?: (event: GestureResponderEvent) => void
  /** 按钮内容 */
  children?: string | JSX.Element
  /** 向后兼容（不建议使用） */
  style?: StyleProp<ViewStyle>
  /** 测试ID */
  testID?: string
}
```

## 新组件 API

```tsx
export type ButtonPropsType =
    | 'default'
    | 'primary'
    | 'textPrimary'
    | 'danger'
    | 'other'
    | 'success'
    | 'warning'
    | 'text'

export type ButtonPropsSize = 'lg' | 'md' | 'sm' | 'xs' | '2xs'

export type EnableDebounceExtendType = {
    wait?: number  // 延迟毫秒数，默认 300
    leading?: boolean  // 指定在延迟开始前调用，默认 false
    trailing?: boolean  // 指定在延迟结束后调用，默认 true
    maxWait?: number  // 设置延迟的最大值
}

export type EnableDebounce = boolean | EnableDebounceExtendType

export type HitSlop = {
    top?: number
    left?: number
    bottom?: number
    right?: number
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
  /** 按住按钮的回调函数 */
  onPressIn?: (event: GestureResponderEvent) => void
  /** 放开按钮的回调函数 */
  onPressOut?: (event: GestureResponderEvent) => void
  /** 按钮内容 */
  children?: string | JSX.Element
  /** 是否开启点击防抖（新增） */
  enableDebounce?: EnableDebounce
  /** 向后兼容（不建议使用） */
  style?: StyleProp<ViewStyle>
  /** 禁用时的点击回调（新增） */
  onPressWhenDisabled?: (event: GestureResponderEvent) => void
  /** 热区（新增） */
  hitSlop?: HitSlop
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| type | type | 按钮类型，保持一致 |
| size | size | 按钮大小，xxs → 2xs |
| width | width | 按钮宽度，保持一致 |
| icon | icon | 自定义图标，但不支持 AllIcons（只支持 JSX.Element） |
| disabled | disabled | 是否禁用，保持一致 |
| loading | loading | 加载状态，保持一致 |
| onPress | onPress | 点击回调，保持一致 |
| onPressIn | onPressIn | 按住回调，保持一致 |
| onPressOut | onPressOut | 放开回调，保持一致 |
| children | children | 按钮内容，保持一致 |
| - | enableDebounce | 新增，点击防抖功能 |
| style | style | 样式属性，仍不建议使用 |
| - | onPressWhenDisabled | 新增，禁用时点击回调 |
| - | hitSlop | 新增，热区扩大 |

## 关键变更

### 1. size 属性值变更
- **旧版本**：`'lg' | 'md' | 'sm' | 'xs' | 'xxs'`
- **新版本**：`'lg' | 'md' | 'sm' | 'xs' | '2xs'`
- 需要将 `'xxs'` 改为 `'2xs'`
- xs 的高度从 28px 改为 24px

### 2. icon 属性类型变更
- **旧版本**：支持 `AllIcons | JSX.Element`
- **新版本**：仅支持 `JSX.Element`
- 如需使用 Icon 组件，需要明确传入 JSX.Element

### 3. 新增防抖功能
- **enableDebounce**：用于防止按钮快速连续点击
- 支持简单模式（布尔值）和详细配置模式

### 4. 新增禁用时回调
- **onPressWhenDisabled**：用于按钮禁用时的点击反馈（如 toast 提示）

### 5. 新增热区扩大
- **hitSlop**：扩大按钮的可点击范围

## 迁移示例

### 案例 1：基础主按钮

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button type="primary" onPress={() => console.log('clicked')}>
  确定
</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="primary" onPress={() => console.log('clicked')}>
  确定
</Button>
```

### 案例 2：次要按钮

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button type="textPrimary">取消</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="textPrimary">取消</Button>
```

### 案例 3：危险按钮

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button type="danger" onPress={() => handleDelete()}>
  删除
</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="danger" onPress={() => handleDelete()}>
  删除
</Button>
```

### 案例 4：按钮大小 - lg

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button size="lg">大按钮</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button size="lg">大按钮</Button>
```

### 案例 5：按钮大小 - md（默认）

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button>中等按钮</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button>中等按钮</Button>
```

### 案例 6：按钮大小 - sm

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button size="sm">小按钮</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button size="sm">小按钮</Button>
```

### 案例 7：按钮大小 - xs

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button size="xs">特小按钮</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button size="xs">特小按钮</Button>
```

### 案例 8：按钮大小 - 2xs（新增 xxs → 2xs）

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button size="xxs">超小按钮</Button>

// 迁移后 - 需要改为 2xs
import { Button } from '@sfe/wand-rn'

<Button size="2xs">超小按钮</Button>
```

### 案例 9：禁用按钮

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button disabled>禁用状态</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button disabled>禁用状态</Button>
```

### 案例 10：加载状态

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

const [loading, setLoading] = useState(false)

<Button loading={loading} onPress={async () => {
  setLoading(true)
  await submitForm()
  setLoading(false)
}}>
  提交
</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

const [loading, setLoading] = useState(false)

<Button loading={loading} onPress={async () => {
  setLoading(true)
  await submitForm()
  setLoading(false)
}}>
  提交
</Button>
```

### 案例 11：自定义宽度

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button width={200}>宽度 200</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button width={200}>宽度 200</Button>
```

### 案例 12：自定义宽度百分比

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button width="100%">全宽按钮</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button width="100%">全宽按钮</Button>
```

### 案例 13：带图标的按钮

```tsx
// 迁移前 - 使用 AllIcons 类型
import { Button } from '@sgfe/flower-rn'

<Button icon="search-o">搜索</Button>

// 迁移后 - 需要传入 JSX.Element
import { Button, Icon } from '@sfe/wand-rn'

<Button icon={<Icon type="search" />}>搜索</Button>
```

### 案例 14：带图标和文本

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button icon="delete-o">删除项目</Button>

// 迁移后
import { Button, Icon } from '@sfe/wand-rn'

<Button icon={<Icon type="delete" />}>删除项目</Button>
```

### 案例 15：纯文本按钮

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button type="text">了解详情</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="text">了解详情</Button>
```

### 案例 16：成功按钮

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button type="success">成功</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="success">成功</Button>
```

### 案例 17：警告按钮

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button type="warning">警告</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="warning">警告</Button>
```

### 案例 18：其他类型按钮

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button type="other">其他</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="other">其他</Button>
```

### 案例 19：防抖 - 简单模式（新增）

```tsx
// 迁移前 - 无此功能
import { Button } from '@sgfe/flower-rn'

// 可能导致频繁点击问题
<Button onPress={handleSubmit}>提交</Button>

// 迁移后 - 支持防抖
import { Button } from '@sfe/wand-rn'

<Button 
  enableDebounce 
  onPress={handleSubmit}
>
  提交
</Button>
```

### 案例 20：防抖 - 详细配置（新增）

```tsx
// 迁移前 - 无此功能

// 迁移后 - 自定义防抖参数
import { Button } from '@sfe/wand-rn'

<Button 
  enableDebounce={{
    wait: 500,  // 延迟 500ms
    leading: false,  // 不在延迟开始时调用
    trailing: true,  // 在延迟结束后调用
    maxWait: 2000  // 最多延迟 2 秒
  }}
  onPress={handleSubmit}
>
  提交
</Button>
```

### 案例 21：禁用时的点击反馈（新增）

```tsx
// 迁移前 - 需要手动处理
import { Button } from '@sgfe/flower-rn'

<Button 
  disabled={!canSubmit}
  onPress={handleSubmit}
/>

// 迁移后 - 禁用时可以显示 toast
import { Button, Toast } from '@sfe/wand-rn'

<Button 
  disabled={!canSubmit}
  onPress={handleSubmit}
  onPressWhenDisabled={() => {
    Toast.show('请先填写表单')
  }}
>
  提交
</Button>
```

### 案例 22：热区扩大（新增）

```tsx
// 迁移前 - 按钮太小难以点击，需要包裹 View

// 迁移后 - 直接使用 hitSlop
import { Button } from '@sfe/wand-rn'

<Button 
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
>
  小按钮
</Button>
```

### 案例 23：多个按钮并排

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'
import { View } from '@mrn/react-native'

<View style={{ flexDirection: 'row' }}>
  <View style={{ flex: 1, marginRight: 8 }}>
    <Button type="textPrimary">取消</Button>
  </View>
  <View style={{ flex: 1 }}>
    <Button type="primary">确定</Button>
  </View>
</View>

// 迁移后
import { Button } from '@sfe/wand-rn'
import { View } from '@mrn/react-native'

<View style={{ flexDirection: 'row' }}>
  <View style={{ flex: 1, marginRight: 8 }}>
    <Button type="textPrimary">取消</Button>
  </View>
  <View style={{ flex: 1 }}>
    <Button type="primary">确定</Button>
  </View>
</View>
```

### 案例 24：按钮事件处理

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'

<Button 
  onPress={() => console.log('pressed')}
  onPressIn={() => console.log('press in')}
  onPressOut={() => console.log('press out')}
>
  按钮
</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button 
  onPress={() => console.log('pressed')}
  onPressIn={() => console.log('press in')}
  onPressOut={() => console.log('press out')}
>
  按钮
</Button>
```

### 案例 25：完整复杂场景

```tsx
// 迁移前
import { Button } from '@sgfe/flower-rn'
import { View } from '@mrn/react-native'
import { Icon } from '@sgfe/flower-rn'

const [loading, setLoading] = useState(false)

<View>
  <View style={{ marginBottom: 16 }}>
    <Button 
      type="primary"
      size="lg"
      width="100%"
      loading={loading}
      onPress={async () => {
        setLoading(true)
        await submitForm()
        setLoading(false)
      }}
    >
      提交表单
    </Button>
  </View>
  
  <View style={{ flexDirection: 'row' }}>
    <View style={{ flex: 1, marginRight: 8 }}>
      <Button type="textPrimary">取消</Button>
    </View>
    <View style={{ flex: 1 }}>
      <Button type="danger" disabled>删除</Button>
    </View>
  </View>
</View>

// 迁移后
import { Button, Icon } from '@sfe/wand-rn'
import { View } from '@mrn/react-native'

const [loading, setLoading] = useState(false)
const [canDelete, setCanDelete] = useState(false)

<View>
  <View style={{ marginBottom: 16 }}>
    <Button 
      type="primary"
      size="lg"
      width="100%"
      loading={loading}
      enableDebounce
      onPress={async () => {
        setLoading(true)
        await submitForm()
        setLoading(false)
      }}
    >
      提交表单
    </Button>
  </View>
  
  <View style={{ flexDirection: 'row' }}>
    <View style={{ flex: 1, marginRight: 8 }}>
      <Button type="textPrimary">取消</Button>
    </View>
    <View style={{ flex: 1 }}>
      <Button 
        type="danger" 
        disabled={!canDelete}
        onPressWhenDisabled={() => {
          Toast.show('请先选择要删除的项目')
        }}
      >
        删除
      </Button>
    </View>
  </View>
</View>
```

## 关键点

### 1. size 属性值变更（重要）
- 旧版本的 `'xxs'` 需要改为 `'2xs'`
- xs 尺寸的高度从 28px 改为 24px

### 2. icon 属性类型变更
- 旧版本支持 AllIcons 字符串 type
- 新版本只支持 JSX.Element
- 需要使用 `<Icon type="..." />` 的方式

### 3. 新增防抖功能
- 防止快速连续点击触发多次回调
- 默认延迟 300ms
- 支持自定义延迟时间和模式

### 4. 新增禁用时回调
- 可以在按钮禁用时提供用户反馈
- 常用于显示 toast 提示用户原因

### 5. 新增热区扩大
- 解决小按钮难以点击的问题
- 不影响布局和其他组件的触摸优先级

### 6. 样式属性仍不建议使用
- Button 组件仍不开放 style 属性的完整自定义
- 需要调整外边距请用 View 包裹

## 迁移检查清单

- [ ] 将所有 `import { Button } from '@sgfe/flower-rn'` 改为 `import { Button } from '@sfe/wand-rn'`
- [ ] 将所有 `size="xxs"` 改为 `size="2xs"`
- [ ] 检查是否有使用 icon 属性为字符串的代码，需要改为 `<Icon type="..." />`
- [ ] 考虑为频繁点击的按钮添加 `enableDebounce` 属性
- [ ] 检查禁用状态的按钮是否需要添加 `onPressWhenDisabled` 反馈
- [ ] 评估是否需要使用 `hitSlop` 扩大按钮热区
- [ ] 验证按钮的点击事件处理是否正常
- [ ] 测试不同尺寸和类型的按钮显示是否正确
- [ ] 检查按钮的加载状态是否正常显示
- [ ] 验证按钮禁用状态的样式是否符合设计

## 注意事项

1. **xxs → 2xs 必须改动**：
   - 这是 API 的重要变更
   - 使用旧的 'xxs' 会导致类型错误

2. **icon 属性必须传 JSX.Element**：
   - 不能再传 AllIcons 类型的字符串
   - 需要使用 Icon 组件包裹

3. **防抖功能的合理使用**：
   - 并非所有按钮都需要防抖
   - 仅在容易被多次快速点击的场景使用

4. **禁用状态的用户反馈**：
   - onPressWhenDisabled 可以改善用户体验
   - 建议在表单等关键场景使用

5. **向后兼容的 style 属性**：
   - 虽然 style 属性仍存在，但不建议使用
   - 建议使用 View 包裹来控制外边距

6. **主题变量的使用**：
   - 按钮颜色由主题变量控制
   - 全局修改主题时会自动更新按钮颜色
