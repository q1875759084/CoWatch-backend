# Indicator 加载指示器

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **源路径**: `empower-fulfillment-mrn-components/src/components/loading-indicator`
- **目标库**: `@sfe/wand-rn`
- **目标组件**: `Loading`

## 旧组件 API

```tsx
interface IndicatorProps {
    text?: string  // 默认 "请稍候"，文案
    icon?: ImageSourcePropType  // 默认为橙色圆环图标
    show?: boolean  // 默认 false，控制是否展示
    iconSize?: number | 'small' | 'middle' | 'large'  // 默认 'middle'，预设值: small=20, middle=29, large=36
    preventClick?: boolean  // 默认 true，是否阻止点击事件向下传递
    style?: StyleProp<ViewStyle>  // container 样式，默认占满全屏
    wrapperStyle?: StyleProp<ViewStyle>  // wrapper 样式，默认圆角半透明矩形，深灰色背景
    textStyle?: StyleProp<TextStyle>  // 文本样式，默认白色，大小16
}

// 类组件调用方式
<LoadingIndicator show={loading} text="加载中..." />
```

## 新组件 API

```tsx
interface LoadingProps {
    type?: 'spinner' | 'circle'  // 默认 'spinner'，Loading 样式
    color?: string  // 默认 '#CCCCCC'，图标颜色
    size?: number  // 默认 20，图标大小
    text?: string | React.ReactElement  // 文字内容
    textSize?: number  // 默认 14，文字大小
    vertical?: boolean  // 默认 false，文字与图标是否纵向排列
}

// 函数式组件调用方式
{loading && <Loading text="加载中..." />}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| icon | - | 旧组件支持自定义图标，新组件不支持，仅通过 type 选择预定义图标 |
| iconSize | size | 尺寸转换：small=20, middle=29→40, large=36→50（根据需要调整） |
| text | text | 文本内容，保持一致 |
| textStyle | textSize | 文本样式简化为 textSize，其他样式需通过包装实现 |
| show | - | 条件渲染 `{show && <Loading />}` 替代 |
| preventClick | - | 新组件无该属性，需通过外层容器实现 |
| style | - | 新组件无全屏容器样式，仅作为内联组件 |
| wrapperStyle | - | 新组件无 wrapper，需自行实现容器 |

## 核心差异

### 1. 使用场景不同
- **旧组件 (LoadingIndicator)**: 全屏遮罩式加载指示器，带半透明深灰色背景容器，可阻止用户交互，类组件方式
- **新组件 (Loading)**: 轻量级内联加载图标，无遮罩和容器，用于局部区域加载状态展示，函数式组件方式

### 2. 功能对比表

| 功能 | LoadingIndicator | Loading |
|------|------------------|---------|
| 全屏遮罩 | ✅ | ❌ |
| 事件拦截 | ✅ | ❌ |
| 背景容器 | ✅ (深灰色半透明矩形) | ❌ |
| 类组件 | ✅ (PureComponent) | ❌ |
| 内联使用 | ❌ | ✅ |
| 自定义图标 | ✅ (ImageSourcePropType) | ❌ (预定义类型) |
| 旋转动画 | ✅ (800ms 循环) | ✅ (同样的旋转动画) |

### 3. 尺寸预设对应关系
- `small=20` → `size={20}`
- `middle=29` → 根据设计需求调整，可用 `size={30}` 或 `size={40}`
- `large=36` → 根据设计需求调整，可用 `size={40}` 或 `size={50}`

## 迁移示例

### 案例 1：基础加载指示器（全屏）

```tsx
// 迁移前 - 类组件方式
import { LoadingIndicator } from '@mtfe/empower-mrn-components'

<LoadingIndicator show={loading} />

// 迁移后 - 函数式组件方式（需要包装成全屏容器）
import { Loading } from '@sfe/wand-rn'
import { View, StyleSheet } from '@mrn/react-native'

{loading && (
  <View style={styles.fullscreenContainer}>
    <View style={styles.wrapper}>
      <Loading />
    </View>
  </View>
)}

const styles = StyleSheet.create({
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 9999,
  },
  wrapper: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
```

### 案例 2：自定义文本和大小

```tsx
// 迁移前
import { LoadingIndicator } from '@mtfe/empower-mrn-components'

<LoadingIndicator 
  show={loading}
  text="加载中..."
  iconSize="large"
/>

// 迁移后
import { Loading } from '@sfe/wand-rn'

{loading && (
  <View style={styles.fullscreenContainer}>
    <View style={styles.wrapper}>
      <Loading 
        text="加载中..."
        size={36}
        textSize={16}
      />
    </View>
  </View>
)}
```

### 案例 3：自定义颜色（新组件特性）

```tsx
// 迁移前
import { LoadingIndicator } from '@mtfe/empower-mrn-components'

<LoadingIndicator 
  show={loading}
  text="加载中..."
  textStyle={{ color: '#fff', fontSize: 16 }}
  // 旧组件不支持直接改变图标颜色，需要通过自定义图标
/>

// 迁移后
import { Loading } from '@sfe/wand-rn'

{loading && (
  <View style={styles.fullscreenContainer}>
    <View style={styles.wrapper}>
      <Loading 
        text="加载中..."
        color="#ffc34d"  // 自定义图标颜色
        textSize={16}
        vertical  // 纵向排列
      />
    </View>
  </View>
)}
```

### 案例 4：纵向排列

```tsx
// 迁移前
import { LoadingIndicator } from '@mtfe/empower-mrn-components'

<LoadingIndicator 
  show={loading}
  text="正在处理..."
  wrapperStyle={{ flexDirection: 'column' }}
/>

// 迁移后
import { Loading } from '@sfe/wand-rn'

{loading && (
  <View style={styles.fullscreenContainer}>
    <View style={styles.wrapper}>
      <Loading 
        text="正在处理..."
        vertical
        textSize={16}
      />
    </View>
  </View>
)}
```

### 案例 5：不同图标类型

```tsx
// 迁移前 - 通过 icon 属性自定义图标
import { LoadingIndicator } from '@mtfe/empower-mrn-components'

<LoadingIndicator 
  show={loading}
  icon={require('./spinner-icon.png')}  // 自定义圆形图标
/>

// 迁移后 - 选择预定义类型
import { Loading } from '@sfe/wand-rn'

// iOS 风格 (射线旋转图标)
{loading && (
  <View style={styles.fullscreenContainer}>
    <View style={styles.wrapper}>
      <Loading type="spinner" />
    </View>
  </View>
)}

// Android 风格 (圆形图标)
{loading && (
  <View style={styles.fullscreenContainer}>
    <View style={styles.wrapper}>
      <Loading type="circle" />
    </View>
  </View>
)}
```

### 案例 6：完整全屏 Loading 组件封装

```tsx
// 创建可复用的全屏 Loading 组件
import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from '@mrn/react-native'
import { Loading } from '@sfe/wand-rn'

interface FullScreenLoadingProps {
  visible: boolean
  text?: string
  size?: number
  color?: string
  textSize?: number
  vertical?: boolean
  preventClick?: boolean
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
}

export const FullScreenLoadingIndicator: React.FC<FullScreenLoadingProps> = ({
  visible,
  text = '请稍候',
  size = 29,
  color = '#CCCCCC',
  textSize = 16,
  vertical = false,
  preventClick = true,
  containerStyle,
  wrapperStyle,
}) => {
  if (!visible) return null

  return (
    <View 
      style={[styles.container, containerStyle]}
      pointerEvents={preventClick ? 'auto' : 'none'}
      onStartShouldSetResponder={() => preventClick}
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Loading 
          text={text}
          size={size}
          color={color}
          textSize={textSize}
          vertical={vertical}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 9999,
  },
  wrapper: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

// 使用示例
import { FullScreenLoadingIndicator } from './components/FullScreenLoadingIndicator'

const [loading, setLoading] = useState(false)

<FullScreenLoadingIndicator 
  visible={loading}
  text="加载中..."
  size={36}
/>
```

### 案例 7：内联使用（局部加载状态）

```tsx
// 旧组件只支持全屏遮罩，不支持内联使用
// 新组件可以直接内联使用

import { Loading } from '@sfe/wand-rn'

// 列表项加载中
<View>
  {items.map(item => (
    <View key={item.id}>
      {item.loading && <Loading size={16} textSize={12} />}
      <Text>{item.name}</Text>
    </View>
  ))}
</View>

// 按钮中显示加载状态
<View style={styles.loadingButton}>
  {buttonLoading && <Loading size={16} />}
  <Text>{buttonLoading ? '加载中' : '确认'}</Text>
</View>
```

## 关键迁移点

1. **组件定位变化**: 
   - 旧组件是全屏遮罩式，新组件是轻量级内联组件
   - 根据使用场景选择：
     - 全屏加载遮罩 → 需自行封装全屏容器（参考案例 6）
     - 局部加载状态 → 直接使用 `Loading`（参考案例 7）

2. **显示控制方式**: 
   - 旧: `<LoadingIndicator show={loading} />`
   - 新: `{loading && <Loading />}`

3. **尺寸预设转换**:
   - `iconSize="small"` → `size={20}`
   - `iconSize="middle"` → `size={29}` 或根据需要调整为 `40`
   - `iconSize="large"` → `size={36}` 或根据需要调整为 `50`

4. **颜色属性**:
   - 旧组件需要通过自定义 icon 改变图标颜色
   - 新组件可直接使用 `color` 属性，更灵活

5. **文本样式简化**: 
   - 旧组件支持完整的 `textStyle`
   - 新组件仅支持 `textSize`，需要更复杂样式需自定义包装

6. **组件方式变更**:
   - 旧: PureComponent（类组件）
   - 新: FunctionComponent（函数式组件）

7. **旋转动画**: 两个组件都支持持续旋转的加载动画

8. **事件拦截**: 新组件无 `preventClick` 功能，需通过外层容器的 `pointerEvents` 和 `onStartShouldSetResponder` 实现

9. **自定义图标**: 旧组件支持通过 `icon` 属性传入自定义图片，新组件通过 `type` 属性选择预定义类型

## 注意事项

1. **使用场景评估**: 迁移前需确认是否真的需要全屏遮罩效果
   - 如果只是局部加载状态，直接使用 `Loading` 即可
   - 如果需要全屏遮罩，参考案例 6 的完整封装

2. **封装复用**: 如果项目中大量使用全屏 LoadingIndicator，强烈建议封装一个 `FullScreenLoadingIndicator` 组件复用

3. **样式一致性**: 
   - 新组件的默认样式与旧组件略有不同
   - 需根据设计规范调整：
     - 旧组件文字大小默认 16，新组件默认 14
     - 旧组件 wrapper 背景色 `rgba(0, 0, 0, 0.7)`，新组件无自带容器

4. **动画效果**: 两个组件的旋转动画实现方式相同，旧组件 800ms 循环，新组件由 RotateView 处理旋转

5. **性能考虑**: 
   - 如需频繁显示/隐藏全屏 Loading，建议使用 `opacity` 或 `display` 控制可见性
   - 而非完全卸载和重新挂载组件

6. **无障碍支持**: 迁移后需补充 `accessibilityLabel` 等无障碍属性以满足可访问性要求

7. **TypeScript**: 新组件有完整的 TypeScript 类型定义，建议使用 TypeScript 获得更好的开发体验

## 迁移检查清单

- [ ] 确认使用场景是全屏遮罩还是局部加载状态
- [ ] 如果是全屏遮罩，参考案例 6 进行封装
- [ ] 更新 import 语句从 `@mtfe/empower-mrn-components` 到 `@sfe/wand-rn`
- [ ] 将 `<LoadingIndicator show={...} />` 改为条件渲染 `{... && <Loading />}`
- [ ] 检查 `iconSize` 属性值，转换为对应的 `size` 数值
- [ ] 如果有自定义 textStyle，提取 `fontSize` 并传给 `textSize`
- [ ] 如果有自定义图标，需重新评估是否可以使用预定义的 `type`
- [ ] 测试旋转动画和加载状态切换
- [ ] 验证样式、颜色、尺寸在各个屏幕尺寸上的表现
