# LoadingIndicator 加载指示器

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
import { LoadingIndicator } from '@mtfe/empower-mrn-components'

export interface IndicatorProps {
    text?: string                    // 文案，默认为"请稍候"
    icon?: ImageSourcePropType       // loading icon，默认橙色圆环
    show?: boolean                   // 控制 Indicator 是否展示，默认 false
    iconSize?: number | 'small' | 'middle' | 'large'  // icon 大小，small=20, middle=29, large=36，默认 'middle'
    preventClick?: boolean           // 是否阻止点击事件向下传递，默认 true
    style?: StyleProp<ViewStyle>     // container style，默认占满全屏
    wrapperStyle?: StyleProp<ViewStyle>  // wrapper style，默认圆角半透明矩形
    textStyle?: StyleProp<TextStyle>     // 文本样式，默认白色 16px
}

// 使用示例
<LoadingIndicator show={loading} text="加载中" />
```

## 新组件 API

```tsx
import { Loading } from '@sfe/wand-rn'

export interface LoadingProps {
    color?: string                   // loading 图标颜色，默认 '#CCCCCC'
    size?: number                    // loading 图标大小，默认 20
    text?: string | React.ReactElement  // 文字内容
    textSize?: number                // 文字大小，默认 14
    type?: 'spinner' | 'circle'      // Loading 样式，spinner 为射线图标，circle 为圆形，默认 'spinner'
    vertical?: boolean               // 文字与 loading 图标纵向排列，默认 false（横向）
}

// 使用示例
<Loading text="加载中" type="circle" />
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| show | - | 移除，改为条件渲染控制显隐 |
| text | text | 保持一致，新组件额外支持 ReactElement |
| icon | - | 移除，新组件通过 type 选择预设样式 |
| iconSize | size | 属性名变更，旧组件支持预设字符串，新组件仅 number |
| preventClick | - | 移除，新组件无遮罩层 |
| style | - | 移除，新组件无全屏容器 |
| wrapperStyle | - | 移除，新组件无包裹容器 |
| textStyle | textSize | 新组件仅支持设置文字大小，不支持完整 TextStyle |
| - | color | 新增，控制图标颜色 |
| - | type | 新增，选择 spinner 或 circle 样式 |
| - | vertical | 新增，控制文字与图标的排列方向 |

## iconSize 映射

| 旧值 | 对应像素 | 新属性写法 |
|------|---------|-----------|
| 'small' | 20 | `size={20}` |
| 'middle' | 29 | `size={29}` |
| 'large' | 36 | `size={36}` |
| 数字 | 同数字 | `size={数字}` |

## 关键变更

### 1. 组件定位差异

LoadingIndicator 是一个**全屏遮罩型**加载组件（position: absolute, 100% 宽高），带半透明黑色背景（rgba(0,0,0,0.7)）和点击拦截。Loading 是一个**内联型**加载指示器，无遮罩、无定位，仅展示旋转图标和文字。

如果迁移场景需要全屏遮罩效果，需要自行包裹遮罩容器：

```tsx
// 迁移后实现全屏遮罩效果
{loading && (
  <View style={{
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  }}>
    <Loading text="加载中" type="circle" size={29} vertical />
  </View>
)}
```

### 2. 显隐控制方式变化

旧组件通过 `show` 属性控制显隐，新组件始终渲染，需要在父组件中使用条件渲染。

### 3. 动画机制变化

旧组件使用 Animated.timing（800ms, linear）自定义旋转动画，新组件使用内部 RotateView 组件处理动画。

## 迁移示例

### 案例 1：基础用法

```tsx
// 迁移前
<LoadingIndicator show={loading} />

// 迁移后
{loading && <Loading type="circle" size={29} />}
```

### 案例 2：带文案

```tsx
// 迁移前
<LoadingIndicator show={loading} text="加载中" />

// 迁移后
{loading && <Loading text="加载中" type="circle" size={29} vertical />}
```

### 案例 3：小尺寸 loading

```tsx
// 迁移前
<LoadingIndicator show={true} iconSize="small" />

// 迁移后
<Loading size={20} type="circle" />
```

### 案例 4：大尺寸 loading

```tsx
// 迁移前
<LoadingIndicator show={true} iconSize="large" text="正在提交" />

// 迁移后
<Loading size={36} text="正在提交" type="circle" vertical />
```

### 案例 5：自定义数字尺寸

```tsx
// 迁移前
<LoadingIndicator show={isLoading} iconSize={40} text="请稍候" />

// 迁移后
{isLoading && <Loading size={40} text="请稍候" type="circle" vertical />}
```

### 案例 6：全屏遮罩场景（完整迁移）

```tsx
// 迁移前
<View style={{ flex: 1 }}>
  <Content />
  <LoadingIndicator show={loading} text="正在加载" preventClick={true} />
</View>

// 迁移后
<View style={{ flex: 1 }}>
  <Content />
  {loading && (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
      }}
      pointerEvents="auto"
    >
      <Loading text="正在加载" type="circle" size={29} vertical color="#FFFFFF" />
    </View>
  )}
</View>
```

### 案例 7：不阻止点击（preventClick=false）

```tsx
// 迁移前
<LoadingIndicator show={loading} preventClick={false} />

// 迁移后 - 新组件本身不阻止点击，直接使用即可
{loading && <Loading type="circle" size={29} />}
```

### 案例 8：在列表场景中使用

```tsx
// 迁移前
<View>
  <FlatList data={data} renderItem={renderItem} />
  <LoadingIndicator show={loading} iconSize="small" text="加载中" />
</View>

// 迁移后 - 内联使用
<View>
  <FlatList data={data} renderItem={renderItem} />
  {loading && (
    <View style={{ padding: 16, alignItems: 'center' }}>
      <Loading size={20} text="加载中" type="spinner" />
    </View>
  )}
</View>
```

### 案例 9：使用 spinner 类型

```tsx
// 迁移前 - 无法选择样式
<LoadingIndicator show={true} text="请稍候" />

// 迁移后 - 使用射线样式
<Loading text="请稍候" type="spinner" />

// 迁移后 - 使用圆形样式（更接近旧组件视觉）
<Loading text="请稍候" type="circle" />
```

### 案例 10：横向排列

```tsx
// 迁移前 - 旧组件固定为纵向排列
<LoadingIndicator show={true} text="加载中" />

// 迁移后 - 横向排列（新组件默认）
<Loading text="加载中" type="circle" />

// 迁移后 - 纵向排列（与旧组件一致）
<Loading text="加载中" type="circle" vertical />
```

## 关键点

- **组件定位根本不同**：LoadingIndicator 是全屏遮罩组件，Loading 是内联指示器。全屏遮罩效果需自行实现。
- **show 属性移除**：改为父组件条件渲染 `{loading && <Loading />}`。
- **iconSize 字符串预设移除**：需转换为对应数字 `size={20|29|36}`。
- **preventClick 移除**：新组件无遮罩层。如需拦截点击，需在包裹容器上设置 `pointerEvents="auto"`。
- **icon 自定义移除**：新组件不支持传入自定义图标源，仅支持 spinner/circle 两种预设样式。
- **type 属性新增**：`'circle'` 更接近旧组件的圆环视觉效果，`'spinner'` 为射线样式。
- **文字样式简化**：旧组件支持完整 TextStyle，新组件仅支持 textSize。

## 迁移策略

### 第一步：确认使用场景

检查当前 LoadingIndicator 的使用是否依赖全屏遮罩和点击拦截。如果是，需准备遮罩容器代码。

### 第二步：替换导入

```tsx
// 替换前
import { LoadingIndicator } from '@mtfe/empower-mrn-components'

// 替换后
import { Loading } from '@sfe/wand-rn'
```

### 第三步：替换组件

1. 将 `<LoadingIndicator show={xxx} ... />` 替换为 `{xxx && <Loading ... />}`
2. 将 `iconSize` 字符串预设转为 `size` 数字值
3. 将 `text` 属性保持不变
4. 如需全屏遮罩，添加遮罩容器
5. 移除 `preventClick`、`icon`、`style`、`wrapperStyle`、`textStyle` 等不再支持的属性

### 第四步：验证

- 确认加载指示器正常显示和隐藏
- 确认动画效果正常
- 确认全屏遮罩场景下点击拦截有效（如适用）
- 确认文字、大小、颜色符合预期

## 常见问题

### Q: 旧组件的全屏遮罩效果在新组件中如何实现？
A: 新组件 Loading 是纯内联组件，需要手动包裹一个绝对定位的 View 容器来实现遮罩效果，参见案例 6。

### Q: 旧组件的 icon 属性（自定义图标）如何迁移？
A: 新组件不支持自定义图标源。可以选择 `type="spinner"` 或 `type="circle"` 两种预设样式。如果必须使用自定义图标，需要自行实现旋转动画。

### Q: iconSize 的 'small'/'middle'/'large' 如何转换？
A: 直接转为对应数字：small → `size={20}`，middle → `size={29}`，large → `size={36}`。

### Q: preventClick 移除后如何阻止用户操作？
A: 在遮罩容器的 View 上设置 `pointerEvents="auto"`，确保触摸事件被遮罩层拦截。

### Q: 文字样式（textStyle）如何迁移？
A: 新组件仅支持 `textSize` 设置文字大小。文字颜色跟随 `color` 属性。如果需要更复杂的文字样式，需使用 `text` 属性传入自定义 ReactElement。

## 注意事项

1. **组件类型变化**：旧组件是 Class 组件（PureComponent），新组件是函数式组件。
2. **默认尺寸差异**：旧组件默认 29px（middle），新组件默认 20px。如需保持一致，需显式设置 `size={29}`。
3. **默认文字差异**：旧组件默认显示"请稍候"，新组件无默认文字。需要文字时须显式传入 `text` 属性。
4. **布局方向**：旧组件固定纵向排列（图标在上文字在下），新组件默认横向排列，需设置 `vertical` 属性来匹配旧组件布局。
5. **颜色主题**：旧组件默认白色文字配深色遮罩背景，新组件默认 `#CCCCCC` 色。全屏遮罩场景建议设置 `color="#FFFFFF"`。
