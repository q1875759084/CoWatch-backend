# Flex 弹性布局

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface FlexPropsType {
  /** 项目定位方向 */
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'  // 默认 'row'
  /** 子元素的换行方式 */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'  // 默认 'nowrap'
  /** 子元素在主轴上的对齐方式 */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'  // 默认 'start'
  /** 子元素在交叉轴上的对齐方式 */
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'  // 默认 'stretch'
  /** flex CSS 简写属性 */
  flex?: number
  /** 子元素 */
  children?: ReactNode
}

export interface FlexProps extends FlexPropsType {
  /** View 的 style 属性 */
  style?: StyleProp<ViewStyle>
  /** 同 View 的 onLayout 回调 */
  onLayout?: (e: LayoutChangeEvent) => void
}

/**
 * @deprecated 本组件已下沉至WandRN，新特性会在Wand更新，请优先使用Wand
 */
export class Flex extends React.Component<FlexProps>
```

## 新组件 API

```tsx
export interface FlexPropsType {
  /** 项目定位方向 */
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'  // 默认 'row'
  /** 子元素的换行方式 */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'  // 默认 'nowrap'
  /** 子元素在主轴上的对齐方式 */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'  // 默认 'start'
  /** 子元素在交叉轴上的对齐方式 */
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'  // 默认 'stretch'
  /** flex CSS 简写属性 */
  flex?: number
  /** 子元素 */
  children?: ReactNode
}

export interface FlexProps extends FlexPropsType {
  /** View 的 style 属性 */
  style?: StyleProp<ViewStyle>
  /** 同 View 的 onLayout 回调 */
  onLayout?: (e: LayoutChangeEvent) => void
}

export class Flex extends React.Component<FlexProps>
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| direction | direction | 项目定位方向，保持一致 |
| wrap | wrap | 子元素换行方式，保持一致 |
| justify | justify | 主轴对齐方式，保持一致 |
| align | align | 交叉轴对齐方式，保持一致 |
| flex | flex | flex 简写属性，保持一致 |
| style | style | View 样式属性，保持一致 |
| onLayout | onLayout | 布局回调，保持一致 |
| children | children | 子元素，保持一致 |

## 关键发现

**本组件两个版本的 API 完全一致！** 唯一的区别是：
- 旧版本标记为 `@deprecated`，提示已下沉至 WandRN
- 新版本移除了 `@deprecated` 注解

这意味着迁移非常简单，仅需要改变导入源。

## 迁移示例

### 案例 1：基础水平布局

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>
```

### 案例 2：垂直布局

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex direction="column">
  <View style={{ height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ height: 50, backgroundColor: '#00BCD4' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex direction="column">
  <View style={{ height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ height: 50, backgroundColor: '#00BCD4' }} />
</Flex>
```

### 案例 3：反向布局

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex direction="row-reverse">
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex direction="row-reverse">
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>
```

### 案例 4：主轴对齐 - 左对齐（默认）

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex justify="start">
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex justify="start">
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>
```

### 案例 5：主轴对齐 - 右对齐

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex justify="end">
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex justify="end">
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>
```

### 案例 6：主轴对齐 - 居中

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex justify="center">
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex justify="center">
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>
```

### 案例 7：主轴对齐 - 两端对齐

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex justify="between" style={{ width: '100%' }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#FFC107' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex justify="between" style={{ width: '100%' }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#FFC107' }} />
</Flex>
```

### 案例 8：主轴对齐 - 平均分布

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex justify="around" style={{ width: '100%' }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#FFC107' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex justify="around" style={{ width: '100%' }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#FFC107' }} />
</Flex>
```

### 案例 9：主轴对齐 - 等间距分布

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex justify="evenly" style={{ width: '100%' }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#FFC107' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex justify="evenly" style={{ width: '100%' }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#FFC107' }} />
</Flex>
```

### 案例 10：交叉轴对齐 - 拉伸（默认）

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex align="stretch" style={{ height: 100 }}>
  <View style={{ width: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, backgroundColor: '#00BCD4' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex align="stretch" style={{ height: 100 }}>
  <View style={{ width: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, backgroundColor: '#00BCD4' }} />
</Flex>
```

### 案例 11：交叉轴对齐 - 顶部对齐

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex align="start" style={{ height: 100 }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, backgroundColor: '#00BCD4' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex align="start" style={{ height: 100 }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, backgroundColor: '#00BCD4' }} />
</Flex>
```

### 案例 12：交叉轴对齐 - 居中

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex align="center" style={{ height: 100 }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex align="center" style={{ height: 100 }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>
```

### 案例 13：交叉轴对齐 - 底部对齐

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex align="end" style={{ height: 100 }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex align="end" style={{ height: 100 }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>
```

### 案例 14：子元素换行

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex wrap="wrap" style={{ width: 150 }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#FFC107' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex wrap="wrap" style={{ width: 150 }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#FFC107' }} />
</Flex>
```

### 案例 15：flex 属性 - 弹性伸缩

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex style={{ width: '100%' }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ flex: 1, height: 50, backgroundColor: '#00BCD4' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#FFC107' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex style={{ width: '100%' }}>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ flex: 1, height: 50, backgroundColor: '#00BCD4' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#FFC107' }} />
</Flex>
```

### 案例 16：自定义样式

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex 
  direction="column" 
  justify="center"
  align="center"
  style={{ 
    padding: 16, 
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  }}
>
  <Text>居中内容</Text>
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex 
  direction="column" 
  justify="center"
  align="center"
  style={{ 
    padding: 16, 
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  }}
>
  <Text>居中内容</Text>
</Flex>
```

### 案例 17：布局回调

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex 
  direction="row"
  onLayout={(e) => {
    console.log('Flex 布局信息:', e.nativeEvent.layout)
  }}
>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex 
  direction="row"
  onLayout={(e) => {
    console.log('Flex 布局信息:', e.nativeEvent.layout)
  }}
>
  <View style={{ width: 50, height: 50, backgroundColor: '#FF6A00' }} />
  <View style={{ width: 50, height: 50, backgroundColor: '#00BCD4' }} />
</Flex>
```

### 案例 18：复杂布局场景

```tsx
// 迁移前
import { Flex } from '@sgfe/flower-rn'

<Flex direction="column" style={{ height: '100%' }}>
  {/* 头部 */}
  <Flex justify="between" align="center" style={{ padding: 16, backgroundColor: '#fff' }}>
    <Text>标题</Text>
    <View>关闭</View>
  </Flex>
  
  {/* 内容区域 */}
  <Flex flex={1} direction="column" style={{ padding: 16 }}>
    <View style={{ height: 50, backgroundColor: '#f5f5f5', marginBottom: 16 }} />
    <View style={{ height: 50, backgroundColor: '#f5f5f5' }} />
  </Flex>
  
  {/* 底部按钮 */}
  <Flex justify="between" style={{ padding: 16, backgroundColor: '#fff' }}>
    <View style={{ flex: 1, height: 40, backgroundColor: '#00BCD4' }} />
    <View style={{ width: 16 }} />
    <View style={{ flex: 1, height: 40, backgroundColor: '#FF6A00' }} />
  </Flex>
</Flex>

// 迁移后
import { Flex } from '@sfe/wand-rn'

<Flex direction="column" style={{ height: '100%' }}>
  {/* 头部 */}
  <Flex justify="between" align="center" style={{ padding: 16, backgroundColor: '#fff' }}>
    <Text>标题</Text>
    <View>关闭</View>
  </Flex>
  
  {/* 内容区域 */}
  <Flex flex={1} direction="column" style={{ padding: 16 }}>
    <View style={{ height: 50, backgroundColor: '#f5f5f5', marginBottom: 16 }} />
    <View style={{ height: 50, backgroundColor: '#f5f5f5' }} />
  </Flex>
  
  {/* 底部按钮 */}
  <Flex justify="between" style={{ padding: 16, backgroundColor: '#fff' }}>
    <View style={{ flex: 1, height: 40, backgroundColor: '#00BCD4' }} />
    <View style={{ width: 16 }} />
    <View style={{ flex: 1, height: 40, backgroundColor: '#FF6A00' }} />
  </Flex>
</Flex>
```

## 关键点

### 1. 组件 API 完全一致
- 所有属性、默认值、类型定义都完全相同
- 迁移只需要改变导入源，代码无需改动

### 2. 内部实现基本一致
- 都是通过转换属性值来生成 flexStyle
- 使用相同的属性映射规则（如 'between' → 'space-between'）
- 都支持自定义 style 和 onLayout 回调

### 3. 属性值映射规则
- 'start' → 'flex-start'
- 'end' → 'flex-end'
- 'between' → 'space-between'
- 'around' → 'space-around'
- 'evenly' → 'space-evenly'
- 其他值（如 'center', 'baseline', 'stretch'）保持不变

### 4. 功能完整性
- 支持 CSS Flex 的所有主要布局属性
- 包括 direction、wrap、justify、align、flex 等
- 支持自定义样式和布局回调

### 5. 向后兼容性
- 新版本保持了旧版本的所有功能
- 无需进行任何代码逻辑改动

## 迁移检查清单

- [ ] 将所有 `import { Flex } from '@sgfe/flower-rn'` 改为 `import { Flex } from '@sfe/wand-rn'`
- [ ] 验证代码中 Flex 组件的使用方式（应该无需改动）
- [ ] 确保所有的属性值（direction、justify、align、wrap）都是支持的值
- [ ] 检查是否有使用 flex 属性进行弹性伸缩
- [ ] 验证 onLayout 回调是否正常工作
- [ ] 测试 Flex 组件的布局效果是否和原来一致
- [ ] 检查是否有在 Flex 中嵌套其他 Flex 的场景
- [ ] 验证 flex 属性与 style 中的 flex 属性的交互

## 注意事项

1. **API 完全兼容**：
   - 这是一个最简单的迁移场景
   - 仅需改变导入源，无需改动代码逻辑

2. **属性值保持一致**：
   - 新版本保持了所有属性值的兼容性
   - 无需进行属性值转换

3. **默认值保持一致**：
   - direction: 'row'
   - wrap: 'nowrap'
   - justify: 'start'
   - align: 'stretch'
   - 无需显式指定默认值

4. **嵌套 Flex 完全支持**：
   - 可以在 Flex 中嵌套其他 Flex
   - 支持复杂的多层级布局

5. **与 View 属性的兼容**：
   - Flex 最终会渲染为 View
   - 支持 View 的所有属性（通过 ...rest）
   - style 和 onLayout 也是 View 的标准属性

6. **flex 属性的使用**：
   - 可以在 Flex 组件上设置 flex 属性实现弹性伸缩
   - 也可以在子 View 的 style 中设置 flex 属性
   - 两者都支持，优先级与 React Native 一致

7. **旧库的弃用警告**：
   - 旧版本标记为 `@deprecated`
   - 建议尽快迁移，避免使用已弃用的库
