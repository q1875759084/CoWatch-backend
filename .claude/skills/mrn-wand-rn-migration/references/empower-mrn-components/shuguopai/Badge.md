# Badge 角标

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface BadgeProps {
    // 内容相关
    text?: string | number          // 角标内容，默认无
    max?: number                    // 角标最大值，默认 99，超过显示 "max+"

    // 文本相关
    color?: string                  // 角标文字颜色，默认 #FFF
    fontSize?: number               // 角标字体大小，默认 11

    // 尺寸相关
    size?: number                   // 角标大小（同时控制宽高），默认无
    width?: number                  // 角标宽度，默认无
    height?: number                 // 角标高度，默认无
    paddingHorizontal?: number      // 角标水平内边距，默认 0
    paddingVertical?: number        // 角标垂直内边距，默认 0
    backgroundColor?: string        // 角标背景颜色，默认 #FF4A4A

    // 定位相关
    position?: boolean              // 是否使用绝对定位，默认 true
    left?: number                   // 左边定位距离，默认无
    top?: number                    // 顶部定位距离，默认无
    right?: number                  // 右边定位距离，默认无
    bottom?: number                 // 底部定位距离，默认无

    // 样式相关
    textStyle?: StyleProp<TextStyle>
    style?: StyleProp<ViewStyle>
}
```

## 新组件 API

```tsx
interface BadgeProps extends WithThemeStyles<BadgeStyles> {
    // 内容相关
    title?: string | number         // 角标中展示的文案，默认 null
    type?: 'text' | 'dot' | 'pointing' | 'triangle'  // 角标类型，默认 'text'
    numberOfLines?: number          // type 为 'triangle' 时，Text 组件自定义多行行数，默认 0

    // 定位相关（仅适配器支持）
    top?: number                    // 顶部定位距离
    right?: number                  // 右边定位距离

    // 样式相关
    styles?: object                 // 自定义样式对象
}

// 支持的样式类型
export type BadgeStyles = ReturnType<typeof badgeStyles>
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 | 备注 |
|--------|--------|------|------|
| text | title | 角标内容文案 | 直接映射 |
| - | type | 角标类型 | 新增属性，shuguopai 版本默认仅支持文本类型 |
| max | - | 最大值处理 | 新组件不支持，需要业务层处理 |
| color | - | 文字颜色 | 新组件通过主题系统控制，默认白色 |
| fontSize | - | 字体大小 | 新组件通过主题系统控制，默认 11px |
| size | - | 大小 | 新组件固定样式，默认高度 14px |
| width | - | 宽度 | 新组件自动适应内容宽度 |
| height | - | 高度 | 新组件固定高度 14px（text 类型） |
| paddingHorizontal | - | 水平内边距 | 新组件默认 4px，由 badgeBorderRadius 主题控制 |
| paddingVertical | - | 垂直内边距 | 新组件固定内边距 |
| backgroundColor | - | 背景颜色 | 新组件默认 #FF192D，通过主题系统控制 |
| position | - | 定位属性 | 新组件通过适配器支持 top/right 定位 |
| left/top/right/bottom | top/right | 定位距离 | 新组件仅支持 top 和 right |
| textStyle | - | 文本样式 | 新组件通过 styles 属性覆盖 |
| style | - | 容器样式 | 新组件通过 styles 属性覆盖 |

## 迁移示例

### 案例 1：基础数字角标

```tsx
// 迁移前
<Badge text={99} />

// 迁移后
<Badge title={99} />
```

### 案例 2：带最大值的数字角标

```tsx
// 迁移前
<Badge text={120} max={99} />

// 迁移后
// 新组件不支持 max 属性，需要业务层处理
<Badge title={120 > 99 ? '99+' : 120} />
```

### 案例 3：文本角标

```tsx
// 迁移前
<Badge text="新" color="#FFF" fontSize={11} backgroundColor="#FF4A4A" />

// 迁移后（使用默认样式）
<Badge title="新" />
// 或自定义样式
<Badge 
    title="新"
    styles={{ 
        textContent: { color: '#FFF', fontSize: 11 }
    }}
/>
```

### 案例 4：绝对定位的角标

```tsx
// 迁移前
<Badge 
    text={99}
    position={true}
    right={10}
    top={-5}
/>

// 迁移后
<Badge 
    title={99}
    right={10}
    top={-5}
/>
```

### 案例 5：自定义大小的角标

```tsx
// 迁移前
<Badge 
    text={99}
    size={24}
    height={24}
    paddingHorizontal={4}
    fontSize={12}
    backgroundColor="#0A0"
/>

// 迁移后
<Badge 
    title={99}
    styles={{
        textWrapper: {
            width: 24,
            height: 24,
            paddingHorizontal: 4,
            backgroundColor: '#0A0'
        },
        textContent: {
            fontSize: 12
        }
    }}
/>
```

### 案例 6：红点类型

```tsx
// 迁移前
// shuguopai 版本不支持红点，需要自定义

// 迁移后
<Badge type='dot' />
```

### 案例 7：指向型角标

```tsx
// 迁移前
// shuguopai 版本不支持，需要自定义

// 迁移后
<Badge title={99} type='pointing' />
```

### 案例 8：三角形角标

```tsx
// 迁移前
// shuguopai 版本不支持

// 迁移后
<Badge title={99} type='triangle' numberOfLines={1} />
```

## 关键点

1. **类型系统变更**：
   - 旧组件仅支持文本/数字展示
   - 新组件支持 4 种类型：`text`、`dot`、`pointing`、`triangle`
   - 默认类型为 `text`

2. **属性映射**：
   - `text` → `title`
   - 大多数样式属性需要迁移到 `styles` 对象中
   - 定位属性仅支持 `top` 和 `right`

3. **样式系统**：
   - 旧组件通过 props 传递样式（fontSize、color、backgroundColor 等）
   - 新组件通过主题系统和 `styles` 属性控制样式
   - 新组件默认背景色为 `#FF192D`，旧组件为 `#FF4A4A`

4. **数值处理**：
   - 旧组件支持 `max` 属性自动处理超出最大值的情况
   - 新组件不支持，需要在业务层处理（e.g., `99 > max ? '99+' : 99`）

5. **定位方式**：
   - 旧组件支持 `left/top/right/bottom` 四个方向定位
   - 新组件仅支持 `top/right` 定位
   - 如需 `left/bottom` 定位，需用 View 包装或使用 `styles` 自定义

6. **内边距**：
   - 旧组件通过 `paddingHorizontal`、`paddingVertical` 控制
   - 新组件通过 `badgeBorderRadius` 主题和 `styles` 对象控制

## 迁移建议

1. **如果仅使用基础文本/数字功能**：
   - 直接将 `text` 改为 `title`
   - 删除所有样式相关属性，使用新组件的默认样式

2. **如果有自定义样式需求**：
   - 使用 `styles` 属性覆盖特定样式
   - 参考 `badgeStyles` 函数了解可覆盖的属性

3. **如果需要最大值处理**：
   - 在业务层实现逻辑：`title={value > max ? `${max}+` : value}`
   - 或创建包装组件处理这个逻辑

4. **如果需要不支持的定位方向**：
   - 使用 View 包装 Badge 组件
   - 或通过 `styles` 属性的 `wrapper` 对象自定义定位

5. **类型切换**：
   - 充分利用新组件的 `type` 属性
   - 根据业务需求选择 `text`、`dot`、`pointing` 或 `triangle`
