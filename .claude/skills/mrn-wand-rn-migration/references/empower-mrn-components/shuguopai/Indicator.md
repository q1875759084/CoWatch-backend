# Indicator 加载指示器

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`
- **目标组件**: `Loading`

## 旧组件 API

```tsx
interface IndicatorProps {
    text?: string  // 默认 "请稍后"
    icon?: 'ios' | 'android' | ImageSourcePropType  // 默认 'ios'
    show?: boolean  // 默认 false，控制是否展示
    iconSize?: number | 'small' | 'middle' | 'large'  // 默认 'middle' (small=30, middle=40, large=50)
    preventClick?: boolean  // 默认 true，是否阻止点击事件向下传递
    style?: StyleProp<ViewStyle>  // container 样式，默认占满
    wrapperStyle?: StyleProp<ViewStyle>  // wrapper 样式，默认圆角半透明矩形
    textStyle?: StyleProp<TextStyle>  // 文本样式，默认白色，大小14
    iconStyle?: StyleProp<ImageStyle>  // 图标样式
}

// 函数式调用
showLoading(props?: Omit<IndicatorProps, 'show'>)
hideLoading()
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
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| icon | type | 图标类型，'ios' → 'spinner'，'android' → 'circle' |
| iconSize | size | 图标大小，预设值转为数字（small=30 → 30, middle=40 → 40, large=50 → 50） |
| text | text | 文本内容，保持一致 |
| textStyle | textSize | 文本样式简化为 textSize，其他样式需通过自定义实现 |
| - | color | 新增图标颜色属性（旧组件通过 iconStyle.tintColor 实现） |
| - | vertical | 新增布局方向属性 |
| show | - | 新组件无 show 属性，通过条件渲染控制显示/隐藏 |
| preventClick | - | 新组件无事件拦截功能，需自行实现 |
| style | - | 新组件无全屏容器样式，仅作为内联组件使用 |
| wrapperStyle | - | 新组件无 wrapper 包装，需自行实现 |
| iconStyle | - | 新组件通过 color 和 size 控制图标样式 |

## 核心差异

### 1. 使用场景不同
- **旧组件 (Indicator)**: 全屏遮罩式加载指示器，带半透明背景容器，可阻止用户交互
- **新组件 (Loading)**: 轻量级内联加载图标，无遮罩和容器，用于局部区域加载状态展示

### 2. 功能差异
| 功能 | Indicator | Loading |
|------|-----------|---------|
| 全屏遮罩 | ✅ | ❌ |
| 事件拦截 | ✅ | ❌ |
| 背景容器 | ✅ (半透明圆角矩形) | ❌ |
| 函数式调用 | ✅ (showLoading/hideLoading) | ❌ |
| 内联使用 | ❌ | ✅ |
| 自定义图标 | ✅ (支持自定义图片) | ❌ |

## 迁移示例

### 案例 1：基础加载指示器

```tsx
// 迁移前
import { Indicator } from '@mtfe/empower-mrn-components/shuguopai'

<Indicator show={loading} />

// 迁移后
import { Loading } from '@sfe/wand-rn'

{loading && <Loading />}
```

### 案例 2：自定义文本和图标样式

```tsx
// 迁移前
import { Indicator } from '@mtfe/empower-mrn-components/shuguopai'

<Indicator 
  show={loading}
  text="加载中..."
  icon="android"
  iconSize="large"
/>

// 迁移后
import { Loading } from '@sfe/wand-rn'

{loading && (
  <Loading 
    text="加载中..."
    type="circle"
    size={50}
  />
)}
```

### 案例 3：自定义颜色和大小

```tsx
// 迁移前
import { Indicator } from '@mtfe/empower-mrn-components/shuguopai'

<Indicator 
  show={loading}
  iconSize={45}
  iconStyle={{ tintColor: '#ffc34d' }}
  textStyle={{ color: '#fff', fontSize: 16 }}
/>

// 迁移后
import { Loading } from '@sfe/wand-rn'

{loading && (
  <Loading 
    size={45}
    color="#ffc34d"
    textSize={16}
  />
)}
```

### 案例 4：纵向排列

```tsx
// 迁移前
import { Indicator } from '@mtfe/empower-mrn-components/shuguopai'

<Indicator 
  show={loading}
  text="正在处理..."
  wrapperStyle={{ flexDirection: 'column' }}
/>

// 迁移后
import { Loading } from '@sfe/wand-rn'

{loading && (
  <Loading 
    text="正在处理..."
    vertical
  />
)}
```

### 案例 5：函数式调用（需自行实现）

```tsx
// 迁移前
import { showLoading, hideLoading } from '@mtfe/empower-mrn-components/shuguopai'

// 显示加载
showLoading({ text: '请稍候...' })

// 隐藏加载
hideLoading()

// 迁移后 - 需要自行实现全屏遮罩逻辑
import { Loading } from '@sfe/wand-rn'
import { View, StyleSheet, Modal } from '@mrn/react-native'

// 方案 1: 使用 Modal 实现全屏遮罩
const [loading, setLoading] = useState(false)

<Modal 
  visible={loading} 
  transparent 
  animationType="fade"
>
  <View style={styles.modalContainer}>
    <View style={styles.loadingWrapper}>
      <Loading text="请稍候..." vertical />
    </View>
  </View>
</Modal>

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingWrapper: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }
})

// 方案 2: 使用条件渲染 + 绝对定位
{loading && (
  <View style={StyleSheet.absoluteFill}>
    <View style={styles.overlay}>
      <View style={styles.loadingBox}>
        <Loading text="请稍候..." vertical />
      </View>
    </View>
  </View>
)}
```

### 案例 6：预设尺寸迁移

```tsx
// 迁移前 - 使用预设尺寸
import { Indicator } from '@mtfe/empower-mrn-components/shuguopai'

<Indicator show={loading} iconSize="small" />   // 30
<Indicator show={loading} iconSize="middle" />  // 40
<Indicator show={loading} iconSize="large" />   // 50

// 迁移后 - 转为数值
import { Loading } from '@sfe/wand-rn'

{loading && <Loading size={30} />}
{loading && <Loading size={40} />}
{loading && <Loading size={50} />}
```

### 案例 7：图标类型映射

```tsx
// 迁移前
import { Indicator } from '@mtfe/empower-mrn-components/shuguopai'

<Indicator show={loading} icon="ios" />      // iOS 风格射线图标
<Indicator show={loading} icon="android" />  // Android 风格圆形图标

// 迁移后
import { Loading } from '@sfe/wand-rn'

{loading && <Loading type="spinner" />}  // 对应 iOS 风格
{loading && <Loading type="circle" />}   // 对应 Android 风格
```

### 案例 8：实现全屏加载遮罩（完整示例）

```tsx
// 创建可复用的全屏 Loading 组件
import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle } from '@mrn/react-native'
import { Loading } from '@sfe/wand-rn'

interface FullScreenLoadingProps {
  visible: boolean
  text?: string
  size?: number
  color?: string
  preventClick?: boolean
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
}

export const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  visible,
  text = '请稍候',
  size = 40,
  color = '#fff',
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
          type="spinner"
          size={size}
          color={color}
          text={text}
          textSize={14}
          vertical
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 9999,
  },
  wrapper: {
    minWidth: 100,
    minHeight: 100,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
})

// 使用示例
import { FullScreenLoading } from './components/FullScreenLoading'

const [loading, setLoading] = useState(false)

<FullScreenLoading 
  visible={loading}
  text="加载中..."
  size={45}
/>
```

## 关键迁移点

1. **组件定位变化**: Indicator 是全屏遮罩组件，Loading 是内联加载图标，迁移时需根据使用场景选择：
   - 局部加载状态 → 直接使用 `Loading`
   - 全屏加载遮罩 → 需自行封装全屏容器（参考案例 8）

2. **显示控制方式**: 
   - 旧: `show` 属性控制
   - 新: 条件渲染 `{loading && <Loading />}`

3. **图标类型映射**:
   - `icon="ios"` → `type="spinner"`
   - `icon="android"` → `type="circle"`

4. **尺寸预设转换**:
   - `iconSize="small"` → `size={30}`
   - `iconSize="middle"` → `size={40}`
   - `iconSize="large"` → `size={50}`

5. **颜色属性**:
   - `iconStyle={{ tintColor: color }}` → `color={color}`

6. **文本样式简化**: 
   - 旧组件支持完整的 `textStyle`
   - 新组件仅支持 `textSize`，需要更复杂样式需自定义包装

7. **函数式调用**: 新组件不提供 `showLoading/hideLoading`，需要：
   - 使用状态管理 + 条件渲染
   - 或封装自定义的全局 Loading 管理器

8. **事件拦截**: 新组件无 `preventClick` 功能，需通过外层容器的 `pointerEvents` 实现

9. **自定义图标**: 旧组件支持 `ImageSourcePropType`，新组件不支持，如需自定义图标需使用 `Icon` 组件配合 `source` 属性

10. **布局方向**: 新组件新增 `vertical` 属性，默认横向排列，设置为 `true` 时纵向排列

## 注意事项

1. **使用场景评估**: 迁移前需确认是否真的需要全屏遮罩效果，如果只是局部加载状态，直接使用 `Loading` 即可
2. **封装复用**: 如果项目中大量使用全屏 Indicator，建议封装一个 `FullScreenLoading` 组件复用
3. **样式一致性**: 新组件的默认样式与旧组件不同（文字颜色、间距等），需根据设计规范调整
4. **动画效果**: 两个组件的旋转动画实现方式相同，视觉效果一致
5. **性能考虑**: 如需频繁显示/隐藏全屏 Loading，建议使用 `opacity` 或 `display` 控制可见性，而非完全卸载组件
6. **无障碍支持**: 迁移后需补充 `accessibilityLabel` 等无障碍属性
