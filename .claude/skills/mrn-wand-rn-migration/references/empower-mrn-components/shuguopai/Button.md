# Button 按钮

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface ButtonProps extends TouchableHighlightProps {
    type?: 'default' | 'primary' | 'reverse' | 'text' | 'text-primary'  // 默认 'default'
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs'  // 默认 'md'
    disabled?: boolean  // 默认 false
    value?: string  // 按钮文案
    textStyle?: StyleProp<TextStyle>  // 文案样式
    indicator?: boolean  // 默认 false，设置显示加载中
    indicatorColor?: string  // 加载中颜色，默认同文字颜色
    indicatorSize?: 'small' | 'large' | number  // 默认 'small'
    icon?: 'link-solid' | 'link' | ImageSourcePropType  // 显示的图标
    iconSize?: number  // 默认 12，图标大小
    iconColor?: string  // 图标颜色，默认同文字颜色
    iconStyle?: StyleProp<ImageStyle>  // 图标样式
    style?: StyleProp<ViewStyle>  // 容器样式
    // 继承 TouchableHighlightProps 的其他属性
}
```

## 新组件 API

```tsx
interface ButtonProps {
    type?: 'default' | 'primary' | 'textPrimary' | 'danger' | 'other' | 'success' | 'warning' | 'text'  // 默认 'default'
    size?: 'lg' | 'md' | 'sm' | 'xs' | '2xs'  // 默认 'md'
    width?: string | number  // 按钮宽度
    style?: StyleProp<ViewStyle>  // 自定义包裹组件最外层样式
    icon?: JSX.Element  // 自定义图标
    disabled?: boolean  // 默认 false，是否禁用
    loading?: boolean  // 默认 false，设置按钮载入状态
    onPress?: (event: GestureResponderEvent) => void  // 点击事件回调
    onPressIn?: (event: GestureResponderEvent) => void  // 按住按钮的回调
    onPressOut?: (event: GestureResponderEvent) => void  // 放开按钮的回调
    reverse?: boolean  // 默认 false，是否反转色
    enableDebounce?: boolean | EnableDebounceExtendType  // 默认 false，是否点击防抖
    onPressWhenDisabled?: (event: GestureResponderEvent) => void  // 禁用时的点击事件回调
    hitSlop?: Insets  // 热区
    children?: string | JSX.Element  // 内容
}

interface EnableDebounceExtendType {
    wait?: number  // 默认 300，需要延迟的毫秒数
    leading?: boolean  // 默认 false，指定在延迟开始前调用
    trailing?: boolean  // 默认 true，指定在延迟结束后调用
    maxWait?: number  // 设置延迟的最大值
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| type | type | 类型值有变化，见下方详细说明 |
| size | size | 尺寸值有变化，移除 'xl'，新增 '2xs' |
| value | children | 文本内容属性名变更 |
| textStyle | - | 新组件不支持自定义文本样式 |
| indicator | loading | 加载状态属性名变更 |
| indicatorColor | - | 新组件加载颜色根据按钮类型自动适配 |
| indicatorSize | - | 新组件加载大小根据按钮尺寸自动适配 |
| icon | icon | 类型变化，从字符串/图片源变为 JSX.Element |
| iconSize | - | 新组件图标大小根据按钮尺寸/宽度自动计算 |
| iconColor | - | 新组件图标颜色根据按钮类型自动适配 |
| iconStyle | - | 新组件不支持自定义图标样式 |
| - | width | 新增按钮宽度属性 |
| - | reverse | 新增反转色属性 |
| - | enableDebounce | 新增防抖功能 |
| - | onPressWhenDisabled | 新增禁用时点击回调 |
| underlayColor | - | 新组件使用 LinearGradient 实现按压效果 |
| 其他 TouchableHighlightProps | - | 新组件基于 TouchableWithoutFeedback，不继承 TouchableHighlightProps |

## 按钮类型映射

| 旧类型 | 新类型 | 说明 |
|--------|--------|------|
| default | default | 默认按钮 |
| primary | primary | 主要按钮 |
| reverse | textPrimary | 次要按钮（边框按钮） |
| text | text | 文本按钮 |
| text-primary | textPrimary 或 text | 根据实际效果选择 |
| - | danger | 新增危险按钮 |
| - | other | 新增其他按钮 |
| - | success | 新增成功按钮 |
| - | warning | 新增警告按钮 |

## 按钮尺寸映射

| 旧尺寸 | 新尺寸 | 高度 | 字号 |
|--------|--------|------|------|
| xl | lg | 52 | 16 |
| lg | lg | 52 | 16 |
| md | md | 40 | 14 |
| sm | sm | 32 | 12 |
| xs | xs | 24 | 12 |
| - | 2xs | 20 | 10 |

## 迁移示例

### 案例 1：基础按钮

```tsx
// 迁移前
import { Button } from '@mtfe/empower-mrn-components/shuguopai'

<Button type="primary" size="md">确认</Button>
<Button type="default" size="md">取消</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="primary" size="md">确认</Button>
<Button type="default" size="md">取消</Button>
```

### 案例 2：使用 value 属性

```tsx
// 迁移前
import { Button } from '@mtfe/empower-mrn-components/shuguopai'

<Button type="primary" value="提交订单" />

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="primary">提交订单</Button>
```

### 案例 3：反转色按钮（边框按钮）

```tsx
// 迁移前
import { Button } from '@mtfe/empower-mrn-components/shuguopai'

<Button type="reverse" size="md">取消</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="textPrimary" size="md">取消</Button>
```

### 案例 4：加载状态

```tsx
// 迁移前
import { Button } from '@mtfe/empower-mrn-components/shuguopai'

<Button 
  type="primary" 
  indicator={true}
  indicatorColor="#fff"
  indicatorSize="small"
>
  提交中
</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button 
  type="primary" 
  loading={true}
>
  提交中
</Button>
```

### 案例 5：带图标的按钮

```tsx
// 迁移前
import { Button } from '@mtfe/empower-mrn-components/shuguopai'

<Button 
  type="primary"
  icon="link"
  iconSize={14}
  iconColor="#fff"
  value="查看详情"
/>

// 迁移后
import { Button, Icon } from '@sfe/wand-rn'

<Button 
  type="primary"
  icon={<Icon type="right-arrow" size={14} />}
>
  查看详情
</Button>
```

### 案例 6：纯图标按钮

```tsx
// 迁移前
import { Button } from '@mtfe/empower-mrn-components/shuguopai'

<Button 
  type="primary"
  icon={require('./icon.png')}
  iconSize={20}
  style={{ width: 40, height: 40 }}
/>

// 迁移后
import { Button, Icon } from '@sfe/wand-rn'

<Button 
  type="primary"
  width={40}
  icon={<Icon source={require('./icon.png')} />}
/>
```

### 案例 7：禁用状态

```tsx
// 迁移前
import { Button } from '@mtfe/empower-mrn-components/shuguopai'

<Button type="primary" disabled={true}>
  提交
</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="primary" disabled={true}>
  提交
</Button>
```

### 案例 8：不同尺寸

```tsx
// 迁移前
import { Button } from '@mtfe/empower-mrn-components/shuguopai'

<Button type="primary" size="xl">超大按钮</Button>
<Button type="primary" size="lg">大按钮</Button>
<Button type="primary" size="md">中按钮</Button>
<Button type="primary" size="sm">小按钮</Button>
<Button type="primary" size="xs">超小按钮</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="primary" size="lg">大按钮</Button>  {/* xl 和 lg 都映射为 lg */}
<Button type="primary" size="md">中按钮</Button>
<Button type="primary" size="sm">小按钮</Button>
<Button type="primary" size="xs">超小按钮</Button>
<Button type="primary" size="2xs">极小按钮</Button>  {/* 新增尺寸 */}
```

### 案例 9：文本按钮

```tsx
// 迁移前
import { Button } from '@mtfe/empower-mrn-components/shuguopai'

<Button type="text">查看更多</Button>
<Button type="text-primary">编辑</Button>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button type="text">查看更多</Button>
<Button type="textPrimary">编辑</Button>  {/* text-primary → textPrimary */}
```

### 案例 10：自定义文本样式（需调整方案）

```tsx
// 迁移前
import { Button } from '@mtfe/empower-mrn-components/shuguopai'

<Button 
  type="primary"
  value="提交"
  textStyle={{ fontSize: 16, fontWeight: 'bold' }}
/>

// 迁移后 - 新组件不支持自定义文本样式，使用 children 传入自定义组件
import { Button } from '@sfe/wand-rn'
import { Text } from '@mrn/react-native'

<Button type="primary">
  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>提交</Text>
</Button>
```

### 案例 11：设置按钮宽度

```tsx
// 迁移前
import { Button } from '@mtfe/empower-mrn-components/shuguopai'

<Button 
  type="primary"
  value="提交"
  style={{ width: 200 }}
/>

// 迁移后
import { Button } from '@sfe/wand-rn'

<Button 
  type="primary"
  width={200}
>
  提交
</Button>
```

### 案例 12：点击事件

```tsx
// 迁移前
import { Button } from '@mtfe/empower-mrn-components/shuguopai'

<Button 
  type="primary"
  onPress={() => handleSubmit()}
  onPressIn={() => console.log('press in')}
  onPressOut={() => console.log('press out')}
>
  提交
</Button>

// 迁移后 - 保持不变
import { Button } from '@sfe/wand-rn'

<Button 
  type="primary"
  onPress={() => handleSubmit()}
  onPressIn={() => console.log('press in')}
  onPressOut={() => console.log('press out')}
>
  提交
</Button>
```

### 案例 13：防抖功能（新功能）

```tsx
// 迁移后 - 使用新增的防抖功能
import { Button } from '@sfe/wand-rn'

// 基础防抖（默认 300ms）
<Button 
  type="primary"
  enableDebounce={true}
  onPress={() => handleSubmit()}
>
  提交
</Button>

// 自定义防抖配置
<Button 
  type="primary"
  enableDebounce={{
    wait: 500,
    leading: false,
    trailing: true,
    maxWait: 1000
  }}
  onPress={() => handleSubmit()}
>
  提交
</Button>
```

### 案例 14：禁用时点击提示（新功能）

```tsx
// 迁移后 - 使用新增的禁用点击回调
import { Button, Toast } from '@sfe/wand-rn'

<Button 
  type="primary"
  disabled={true}
  onPress={() => handleSubmit()}
  onPressWhenDisabled={() => {
    Toast.info('请先完成必填项')
  }}
>
  提交
</Button>
```

### 案例 15：反转色（新功能）

```tsx
// 迁移后 - 使用新增的 reverse 属性
import { Button } from '@sfe/wand-rn'

<Button 
  type="primary"
  reverse={true}
>
  反转色按钮
</Button>
```

### 案例 16：新增的按钮类型

```tsx
// 迁移后 - 使用新增的按钮类型
import { Button } from '@sfe/wand-rn'

<Button type="danger">删除</Button>
<Button type="success">通过</Button>
<Button type="warning">警告</Button>
<Button type="other">其他</Button>
```

### 案例 17：热区设置（新功能）

```tsx
// 迁移后 - 使用新增的 hitSlop 属性
import { Button } from '@sfe/wand-rn'

<Button 
  type="text"
  size="xs"
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
>
  点击
</Button>
```

### 案例 18：样式定制受限的处理

```tsx
// 迁移前 - 自定义样式较多
import { Button } from '@mtfe/empower-mrn-components/shuguopai'

<Button 
  type="primary"
  style={{ 
    width: 200,
    height: 50,
    borderRadius: 25,
    marginTop: 20
  }}
  textStyle={{ 
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  }}
>
  提交
</Button>

// 迁移后 - 使用 View 包裹处理外边距，width 使用专属属性
import { Button } from '@sfe/wand-rn'
import { View } from '@mrn/react-native'

<View style={{ marginTop: 20 }}>
  <Button 
    type="primary"
    size="lg"
    width={200}
  >
    提交
  </Button>
</View>

// 注意：新组件的 height 和 borderRadius 由 size 决定，无法自定义
// 如需完全自定义样式，建议自行封装按钮组件
```

## 关键迁移点

1. **属性重命名**:
   - `value` → `children`
   - `indicator` → `loading`
   - `type="reverse"` → `type="textPrimary"`
   - `type="text-primary"` → `type="textPrimary"`

2. **尺寸变化**:
   - 移除 `'xl'`，`'xl'` 和 `'lg'` 都映射为新的 `'lg'`
   - 新增 `'2xs'` 极小尺寸

3. **图标使用变化**:
   - 旧: 字符串或图片源 `icon="link"`
   - 新: JSX 元素 `icon={<Icon type="right-arrow" />}`
   - 图标需要使用 `Icon` 组件包装

4. **加载状态简化**:
   - 移除 `indicatorColor` 和 `indicatorSize`，由组件根据 `type` 和 `size` 自动适配

5. **样式定制受限**:
   - 移除 `textStyle`, `iconStyle`, `iconSize`, `iconColor` 等样式属性
   - 新组件样式高度标准化，不支持细粒度自定义
   - 如需自定义文本样式，使用 `children` 传入自定义 `Text` 组件

6. **底层实现变化**:
   - 旧: 基于 `TouchableHighlight`
   - 新: 基于 `TouchableWithoutFeedback` + `LinearGradient`
   - 不再继承 `TouchableHighlightProps`

7. **新增功能**:
   - `width`: 设置按钮宽度
   - `reverse`: 反转色
   - `enableDebounce`: 防抖功能
   - `onPressWhenDisabled`: 禁用时点击回调
   - `hitSlop`: 热区设置
   - 新增按钮类型: `danger`, `other`, `success`, `warning`

8. **外边距处理**:
   - 新组件的 `style` 属性不支持设置 margin
   - 使用 `View` 包裹按钮来设置外边距

## 注意事项

1. **样式标准化**: 新组件追求样式一致性，大幅减少了自定义能力，迁移前需评估项目是否能接受标准化样式

2. **图标迁移**: 旧组件的预设图标（`link`, `link-solid`）在新组件中需要使用 `Icon` 组件替代，需要找到对应的图标类型

3. **尺寸映射**: `xl` 和 `lg` 都映射为新的 `lg`，视觉效果可能略有差异，需进行视觉验收

4. **类型映射**: `reverse` 和 `text-primary` 的语义不完全相同，需根据实际视觉效果选择合适的新类型

5. **TouchableHighlight 属性**: 新组件不继承 `TouchableHighlightProps`，如果使用了 `underlayColor`, `onShowUnderlay`, `onHideUnderlay` 等属性，需要调整实现方案

6. **加载状态**: 旧组件在 `indicator=true` 时仍可点击（需手动处理），新组件在 `loading=true` 时自动禁用点击

7. **防抖功能**: 新组件提供了内置防抖功能，可以简化业务代码中的防抖处理

8. **按钮宽度**: 新组件提供 `width` 属性，推荐使用该属性而不是 `style.width`

9. **外边距**: 新组件的 `style` 不支持 margin 相关属性，需使用 `View` 包裹

10. **完全自定义**: 如果项目中大量使用了自定义样式，建议评估以下方案：
    - 使用新组件的标准样式，统一视觉规范
    - 使用 `children` 传入自定义组件
    - 基于新组件封装一个支持更多自定义的版本
    - 自行实现完全自定义的按钮组件

## 迁移建议

1. **优先迁移标准按钮**: 先迁移使用默认样式、无自定义需求的按钮
2. **批量处理属性重命名**: 使用编辑器的查找替换功能批量处理 `value` → `children`、`indicator` → `loading` 等
3. **统一图标使用**: 建立图标映射表，统一旧图标到新 `Icon` 组件的映射关系
4. **视觉验收**: 迁移后进行完整的视觉验收，特别关注尺寸、颜色、间距等细节
5. **渐进式迁移**: 建议先在新页面使用新组件，旧页面逐步迁移，避免一次性大规模改动
