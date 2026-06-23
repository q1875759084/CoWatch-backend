# Badge 角标

## 从何处迁移
- **源库**: `@roo/roo-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface BadgeProps extends WithThemeStyles<BadgeStyles> {
  /** 角标中展示的文案 */
  title?: string | number
  /** 角标类型 */
  type?: 'text' | 'dot' | 'pointing' | 'triangle'
  /** 包裹容器样式 */
  textWrapperStyle?: ViewStyle
  /** 文案内容样式 */
  textContentStyle?: TextStyle
  /** 三角角标容器样式 */
  triangleStyle?: ViewStyle
  /** 三角角标文案样式 */
  textTriangleStyle?: TextStyle
  /** 点角标样式 */
  dotStyle?: ViewStyle
  /** type 为 triangle 时，Text 组件自定义多行行数 */
  numberOfLines?: number
}
```

## 新组件 API

```tsx
export interface BadgeProps extends WithThemeStyles<BadgeStyles> {
  /** 角标中展示的文案 */
  title?: string | number
  /** 角标类型 */
  type?: 'text' | 'dot' | 'pointing' | 'triangle'
  /** type 为 triangle 时，Text 组件自定义多行行数 */
  numberOfLines?: number
  /** 角标距离顶部的距离，设置后组件使用绝对定位 */
  top?: number
  /** 角标距离右侧的距离，设置后组件使用绝对定位 */
  right?: number
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| textWrapperStyle | - | 已移除，样式通过 styles 统一管理 |
| textContentStyle | - | 已移除，样式通过 styles 统一管理 |
| triangleStyle | - | 已移除，样式通过 styles 统一管理 |
| textTriangleStyle | - | 已移除，样式通过 styles 统一管理 |
| dotStyle | - | 已移除，样式通过 styles 统一管理 |
| numberOfLines | numberOfLines | 保持一致 |
| type | type | 保持一致 |
| title | title | 保持一致 |
| - | top | 新增，用于绝对定位 |
| - | right | 新增，用于绝对定位 |

## 迁移示例

### 案例 1：数字角标

```tsx
// 迁移前
import { Badge } from '@roo/roo-rn'

<Badge title={1} />

// 迁移后
import { Badge } from '@sfe/wand-rn'

<Badge title={1} />
```

### 案例 2：文字角标

```tsx
// 迁移前
import { Badge } from '@roo/roo-rn'

<Badge title="新" />

// 迁移后
import { Badge } from '@sfe/wand-rn'

<Badge title="新" />
```

### 案例 3：点角标

```tsx
// 迁移前
import { Badge } from '@roo/roo-rn'

<Badge type="dot" />

// 迁移后
import { Badge } from '@sfe/wand-rn'

<Badge type="dot" />
```

### 案例 4：指向型角标 - 数字

```tsx
// 迁移前
import { Badge } from '@roo/roo-rn'

<Badge title={1} type="pointing" />

// 迁移后
import { Badge } from '@sfe/wand-rn'

<Badge title={1} type="pointing" />
```

### 案例 5：指向型角标 - 文字

```tsx
// 迁移前
import { Badge } from '@roo/roo-rn'

<Badge title="热" type="pointing" />

// 迁移后
import { Badge } from '@sfe/wand-rn'

<Badge title="热" type="pointing" />
```

### 案例 6：三角角标 - 单行

```tsx
// 迁移前
import { Badge } from '@roo/roo-rn'

<Badge title="优惠" type="triangle" />

// 迁移后
import { Badge } from '@sfe/wand-rn'

<Badge title="优惠" type="triangle" />
```

### 案例 7：三角角标 - 多行

```tsx
// 迁移前
import { Badge } from '@roo/roo-rn'

<Badge 
  title="优惠活动" 
  type="triangle" 
  numberOfLines={2}
/>

// 迁移后
import { Badge } from '@sfe/wand-rn'

<Badge 
  title="优惠活动" 
  type="triangle" 
  numberOfLines={2}
/>
```

### 案例 8：角标列表 - 移除原有样式属性

```tsx
// 迁移前 - 通过 textWrapperStyle 自定义容器样式
import { Badge } from '@roo/roo-rn'

<Badge 
  title="1" 
  textWrapperStyle={{ marginRight: 10 }}
/>
<Badge 
  title="13" 
  textWrapperStyle={{ marginRight: 10 }}
/>

// 迁移后 - 通过外层 View 样式包裹
import { Badge } from '@sfe/wand-rn'

<View style={{ marginRight: 10 }}>
  <Badge title="1" />
</View>
<View style={{ marginRight: 10 }}>
  <Badge title="13" />
</View>
```

### 案例 9：绝对定位角标 - 顶部（新增）

```tsx
// 迁移前 - 无内置支持，需要使用 View 包装
import { Badge } from '@roo/roo-rn'

<View style={{ position: 'relative' }}>
  <Image source={{ uri: 'https://...' }} />
  <View style={{ position: 'absolute', top: 0, right: 0 }}>
    <Badge title={1} />
  </View>
</View>

// 迁移后 - 使用 top 和 right props
import { Badge } from '@sfe/wand-rn'

<View>
  <Image source={{ uri: 'https://...' }} />
  <Badge title={1} top={0} right={0} />
</View>
```

### 案例 10：头像上的未读提示

```tsx
// 迁移前
import { Badge } from '@roo/roo-rn'

<View style={{ position: 'relative', width: 50, height: 50 }}>
  <Avatar name="User" size={50} />
  <View style={{ position: 'absolute', top: -5, right: -5 }}>
    <Badge type="dot" />
  </View>
</View>

// 迁移后 - 使用新增的绝对定位属性
import { Badge } from '@sfe/wand-rn'

<View style={{ position: 'relative', width: 50, height: 50 }}>
  <Avatar name="User" size={50} />
  <Badge type="dot" top={-5} right={-5} />
</View>
```

### 案例 11：自定义样式 - 文本颜色（通过 styles prop）

```tsx
// 迁移前 - 通过 textContentStyle 自定义
import { Badge } from '@roo/roo-rn'

<Badge 
  title="新" 
  textContentStyle={{ fontSize: 14, color: '#fff' }}
/>

// 迁移后 - 通过 styles prop 自定义
import { Badge } from '@sfe/wand-rn'

<Badge 
  title="新"
  styles={{
    textContent: { fontSize: 14, color: '#fff' }
  }}
/>
```

### 案例 12：自定义样式 - 容器背景（通过 styles prop）

```tsx
// 迁移前 - 通过 textWrapperStyle 自定义
import { Badge } from '@roo/roo-rn'

<Badge 
  title="新"
  textWrapperStyle={{ backgroundColor: '#FF9800', borderRadius: 10 }}
/>

// 迁移后 - 通过 styles prop 自定义
import { Badge } from '@sfe/wand-rn'

<Badge 
  title="新"
  styles={{
    textWrapper: { backgroundColor: '#FF9800', borderRadius: 10 }
  }}
/>
```

### 案例 13：自定义样式 - 点角标（通过 styles prop）

```tsx
// 迁移前 - 通过 dotStyle 自定义
import { Badge } from '@roo/roo-rn'

<Badge 
  type="dot"
  dotStyle={{ width: 12, height: 12, backgroundColor: '#00BCD4' }}
/>

// 迁移后 - 通过 styles prop 自定义
import { Badge } from '@sfe/wand-rn'

<Badge 
  type="dot"
  styles={{
    dot: { width: 12, height: 12, backgroundColor: '#00BCD4' }
  }}
/>
```

### 案例 14：自定义样式 - 三角角标（通过 styles prop）

```tsx
// 迁移前 - 通过 triangleStyle 和 textTriangleStyle 自定义
import { Badge } from '@roo/roo-rn'

<Badge 
  title="优" 
  type="triangle"
  triangleStyle={{ width: 60, height: 30 }}
  textTriangleStyle={{ fontSize: 12 }}
/>

// 迁移后 - 通过 styles prop 自定义
import { Badge } from '@sfe/wand-rn'

<Badge 
  title="优" 
  type="triangle"
  styles={{
    triangle: { width: 60, height: 30 },
    textTriangle: { fontSize: 12 }
  }}
/>
```

### 案例 15：带提示角标的列表项

```tsx
// 迁移前
import { Badge } from '@roo/roo-rn'
import { List } from '@roo/roo-rn'

const Item = List.Item

<List>
  <Item>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text>消息</Text>
      <Badge title={5} />
    </View>
  </Item>
  <Item>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text>通知</Text>
      <Badge type="dot" />
    </View>
  </Item>
</List>

// 迁移后 - 使用 wand-rn 的相应组件
import { Badge } from '@sfe/wand-rn'

<View>
  <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
    <Text>消息</Text>
    <Badge title={5} />
  </TouchableOpacity>
  <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16 }}>
    <Text>通知</Text>
    <Badge type="dot" />
  </TouchableOpacity>
</View>
```

## 关键点

### 1. 样式属性的变更
- **旧版本**：通过 `textWrapperStyle`、`textContentStyle`、`triangleStyle`、`textTriangleStyle`、`dotStyle` 等多个 props 自定义样式
- **新版本**：统一通过 `styles` prop 传递样式对象，对应的 key 值为 `textWrapper`、`textContent`、`triangle`、`textTriangle`、`dot`

### 2. 新增绝对定位支持
- 新版本新增 `top` 和 `right` props，可以直接设置角标的绝对定位
- 自动添加 `position: 'absolute'` 样式，简化了使用
- 不需要再使用 `View` 包装组件来实现绝对定位

### 3. 样式系统的改进
- 新版本使用主题系统中的变量（如 `badgeBorderRadius`、`fontSizeXs` 等）
- 默认样式更一致，与设计系统对齐
- 可通过 `styles` prop 覆盖默认样式

### 4. 默认类型
- 两个版本的默认类型都是 `'text'`
- 如果不指定 `type` 属性，将使用文本类型的角标

### 5. 不支持 `pointing` 类型的其他展示模式
- 旧版本的 `pointing` 类型在页面中展示为指向型角标
- 新版本保持一致
- 指向型角标会自动根据 `title` 是否为数字调整内边距

### 6. 移除的 children 用法
- 注意：新版本已经移除了直接通过 `children` 传入内容的方式
- 所有内容必须通过 `title` prop 传入

## 迁移检查清单

- [ ] 确认所有角标的 `type` 属性正确（text/dot/pointing/triangle）
- [ ] 检查是否有使用 `textWrapperStyle` 等样式属性的代码，需要改用 `styles` prop
- [ ] 验证 `numberOfLines` 属性在三角角标中是否生效
- [ ] 检查是否需要使用新的 `top` 和 `right` 属性来简化绝对定位逻辑
- [ ] 测试自定义样式是否通过 `styles` prop 正确应用
- [ ] 确认角标的显示位置和样式与设计稿一致
- [ ] 验证文本内容的显示（数字、文字、单行、多行）
- [ ] 检查是否有直接使用 `children` 传入内容的代码（需要改用 title）
- [ ] 测试不同类型角标的外观（text、dot、pointing、triangle）
- [ ] 确认在不同屏幕尺寸下角标的显示是否正确
- [ ] 验证主题变量是否正确应用
- [ ] 检查是否有使用主题自定义的 Badge 样式

## 注意事项

1. **样式迁移的重点**：
   - 旧版本的分散样式属性需要统一收集到 `styles` 对象中
   - `styles` 的 key 值必须与新版本的样式定义相匹配

2. **绝对定位的优化**：
   - 如果之前使用 View 包装来实现绝对定位，现在可以直接使用 `top` 和 `right` 属性
   - 这样可以减少不必要的 View 嵌套，提高性能

3. **主题变量的使用**：
   - 新版本使用了主题系统中的变量
   - 如果需要全局改变角标样式，可以修改主题配置

4. **类型安全**：
   - type 属性只支持 4 种类型：'text'、'dot'、'pointing'、'triangle'
   - 确保传入的 type 值是有效的

5. **三角角标的行数控制**：
   - `numberOfLines` 属性只在 `type='triangle'` 时有效
   - 在其他类型下设置该属性不会产生任何效果
