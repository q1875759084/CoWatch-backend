# Divider 分割线

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface DividerProps {
    direction?: 'horizontal' | 'h' | 'vertical' | 'v'  // 默认 'h'
    size?: number  // 默认 6
    backgroundColor?: string
    style?: StyleProp<ViewStyle>
}
```

## 新组件 API

```tsx
interface DividerProps {
    thickness?: number  // 默认 0.5，线的粗细
    type?: 'horizontal' | 'vertical'  // 默认 'horizontal'
    length?: number  // 线的长度
    color?: string
    dashed?: boolean  // 默认 false
    dashedProps?: {
        length?: number  // 虚线长度
        gap?: number  // 虚线间隔
    }
    margin?: number | number[]  // [上下, 左右] 或单一值
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| size | thickness | 线的厚度，单位不同 |
| direction | type | 方向属性，值格式变更 |
| backgroundColor | color | 线条颜色 |
| style | margin / 包装 View | 外边距使用 margin prop |

## 迁移示例

### 案例 1：简单水平线

```tsx
// 迁移前
<Divider size={1} />

// 迁移后
<Divider thickness={1} />
```

### 案例 2：垂直线带颜色和样式

```tsx
// 迁移前
<Divider 
  size={1} 
  direction="vertical" 
  backgroundColor="#123" 
  style={{ marginTop: 10 }} 
/>

// 迁移后
<Divider 
  thickness={1} 
  type="vertical" 
  color="#123" 
  margin={[10, 0]}  // 上下 10，左右 0
/>
```

### 案例 3：虚线

```tsx
// 迁移前
<Divider size={2} style={{ marginVertical: 10 }} />

// 迁移后
<Divider 
  thickness={2} 
  dashed 
  dashedProps={{ length: 4, gap: 2 }}
  margin={[10, 0]}
/>
```

## 关键点

- `direction` 不支持简写 'h' 和 'v'，必须用 'horizontal' 或 'vertical'
- `size` → `thickness`，但新组件默认为 0.5，需要根据设计稿调整
- 样式类属性转换到 props 上
- `style` 中的 margin 相关属性建议迁移到 `margin` prop
