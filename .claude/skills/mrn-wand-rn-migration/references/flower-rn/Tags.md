# Tags 标签

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
type TagSize = 'xl' | 'lg' | 'sm'
type TagFontSize = 'lg' | 'sm'

interface TagsProps {
  /** 数据源 */
  dataSource?: TagItemProps[]
  
  /** 标签大小 */
  size?: TagSize  // 默认 'sm'
  
  /** 标签文案大小 */
  fontSize?: TagFontSize
  
  /** 是否需要自动换行 */
  wrapable?: boolean  // 默认 false
  
  /** 使用 "整体连接" 样式 */
  connectable?: boolean  // 默认 false
  
  /** "整体连接" 样式时的边框色 */
  borderColor?: string
  
  /** 设置所有 item 的按压透明度 */
  activeOpacity?: number  // 默认值未指定
  
  /** 自定义 Tags 组件最外层的样式 */
  style?: ViewStyle
  
  /** 自定义 TagItem 的样式 */
  itemStyle?: ViewStyle
  
  /** tagItem 的点击回调 */
  onPress?: (event: GestureResponderEvent, index: number) => void
}

interface TagItemProps {
  /** TagItem 的文案 */
  text: string
  
  /** TagItem 的文案颜色 */
  color?: string
  
  /** TagItem 的背景色 */
  backgroundColor?: string
  
  /** 多条组合形式下的分割线颜色 */
  splitLineColor?: string
  
  /** 是否包含边框 */
  hasBorder?: boolean
  
  /** TagItem 的边框色 */
  borderColor?: string
  
  /** TagItem 的 index */
  index?: number
  
  /** 自定义 TagItem 的文案样式 */
  textStyle?: TextStyle
  
  /** 自定义 Icon */
  renderIcon?: () => JSX.Element
}
```

## 新组件 API

```tsx
type TagSize = 'xl' | 'lg' | 'sm'
type TagFontSize = 'lg' | 'sm'

interface TagsProps {
  /** 数据源 */
  dataSource?: TagItemProps[]
  
  /** 标签大小 */
  size?: TagSize  // 默认 'sm'
  
  /** 标签文案大小 */
  fontSize?: TagFontSize
  
  /** 是否需要自动换行 */
  wrapable?: boolean  // 默认 false
  
  /** 使用 "整体连接" 样式 */
  connectable?: boolean  // 默认 false
  
  /** "整体连接" 样式时的边框色 */
  borderColor?: string
  
  /** 设置所有 item 的按压透明度 */
  activeOpacity?: number  // 默认 0.2
  
  /** 自定义 Tags 组件最外层的样式 */
  style?: ViewStyle
  
  /** 自定义 TagItem 的样式 */
  itemStyle?: ViewStyle
  
  /** tagItem 的点击回调 */
  onPress?: (event: GestureResponderEvent, index: number) => void
}

interface TagItemProps {
  /** TagItem 的文案 */
  text: string
  
  /** TagItem 的文案颜色 */
  color?: string  // 默认 '#FFFFFF'
  
  /** TagItem 的背景色 */
  backgroundColor?: string
  
  /** 多条组合形式下的分割线颜色 */
  splitLineColor?: string
  
  /** 是否包含边框 */
  hasBorder?: boolean
  
  /** TagItem 的边框色 */
  borderColor?: string
  
  /** TagItem 的 index */
  index?: number
  
  /** 自定义 TagItem 的文案样式 */
  textStyle?: TextStyle
  
  /** 自定义左侧 Icon（新增） */
  renderIcon?: () => JSX.Element
  
  /** 自定义右侧 Icon（新增） */
  rightIconRender?: () => JSX.Element
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| dataSource | dataSource | 保持一致 |
| size | size | 保持一致 |
| fontSize | fontSize | 保持一致 |
| wrapable | wrapable | 保持一致 |
| connectable | connectable | 保持一致 |
| borderColor | borderColor | 保持一致 |
| activeOpacity | activeOpacity | 新增默认值 0.2 |
| style | style | 保持一致 |
| itemStyle | itemStyle | 保持一致 |
| onPress | onPress | 保持一致 |
| - | rightIconRender | 新增（TagItemProps） |

### TagItemProps 变更

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| text | text | 保持一致 |
| color | color | 新增默认值 '#FFFFFF' |
| backgroundColor | backgroundColor | 保持一致 |
| splitLineColor | splitLineColor | 保持一致 |
| hasBorder | hasBorder | 保持一致 |
| borderColor | borderColor | 保持一致 |
| index | index | 保持一致 |
| textStyle | textStyle | 保持一致 |
| renderIcon | renderIcon | 保持一致（左侧 Icon） |
| - | rightIconRender | 新增（右侧 Icon） |

## 关键变更

### 1. activeOpacity 默认值改变
- **旧版本**：无默认值
- **新版本**：默认值为 0.2
- 这是使 Tags 组件更易用的改进

### 2. color 默认值添加
- **旧版本**：无默认值
- **新版本**：TagItemProps 中 color 默认为 '#FFFFFF'
- 避免文本颜色为 undefined 的问题

### 3. 新增 rightIconRender 属性
- **新版本**：支持在 Tag 右侧添加自定义 Icon
- **旧版本**：仅支持 renderIcon（左侧 Icon）
- 此属性为可选，不使用不会影响现有功能

### 4. 完全 API 兼容
- 所有原有属性都保持兼容
- 新属性为可选添加项
- 无需改动现有代码

## 迁移示例

### 案例 1：基础 Tags

```tsx
// 迁移前
import { Tags } from '@sgfe/flower-rn'

const data = [
  { text: '标签1' },
  { text: '标签2' },
  { text: '标签3' }
]

<Tags dataSource={data} />

// 迁移后 - 无需改动
import { Tags } from '@sfe/wand-rn'

const data = [
  { text: '标签1' },
  { text: '标签2' },
  { text: '标签3' }
]

<Tags dataSource={data} />
```

### 案例 2：自定义大小

```tsx
// 迁移前
import { Tags } from '@sgfe/flower-rn'

const data = [
  { text: '大标签' },
  { text: '中等标签' }
]

<Tags dataSource={data} size="lg" />

// 迁移后 - 无需改动
import { Tags } from '@sfe/wand-rn'

const data = [
  { text: '大标签' },
  { text: '中等标签' }
]

<Tags dataSource={data} size="lg" />
```

### 案例 3：自定义文字大小

```tsx
// 迁移前
import { Tags } from '@sgfe/flower-rn'

<Tags
  dataSource={[
    { text: '大文字' },
    { text: '小文字' }
  ]}
  fontSize="lg"
/>

// 迁移后 - 无需改动
import { Tags } from '@sfe/wand-rn'

<Tags
  dataSource={[
    { text: '大文字' },
    { text: '小文字' }
  ]}
  fontSize="lg"
/>
```

### 案例 4：自动换行

```tsx
// 迁移前
import { Tags } from '@sgfe/flower-rn'

<Tags
  dataSource={[
    { text: '标签1' },
    { text: '标签2' },
    { text: '标签3' },
    { text: '标签4' },
    { text: '标签5' }
  ]}
  wrapable
/>

// 迁移后 - 无需改动
import { Tags } from '@sfe/wand-rn'

<Tags
  dataSource={[
    { text: '标签1' },
    { text: '标签2' },
    { text: '标签3' },
    { text: '标签4' },
    { text: '标签5' }
  ]}
  wrapable
/>
```

### 案例 5：多条组合形式

```tsx
// 迁移前
import { Tags } from '@sgfe/flower-rn'

<Tags
  dataSource={[
    { text: '类目1', backgroundColor: '#FF6B6B' },
    { text: '类目2', backgroundColor: '#4ECDC4' },
    { text: '类目3', backgroundColor: '#95E1D3' }
  ]}
  connectable
  borderColor="#DDD"
/>

// 迁移后 - 无需改动
import { Tags } from '@sfe/wand-rn'

<Tags
  dataSource={[
    { text: '类目1', backgroundColor: '#FF6B6B' },
    { text: '类目2', backgroundColor: '#4ECDC4' },
    { text: '类目3', backgroundColor: '#95E1D3' }
  ]}
  connectable
  borderColor="#DDD"
/>
```

### 案例 6：点击回调

```tsx
// 迁移前
import { Tags } from '@sgfe/flower-rn'

const handlePress = (event, index) => {
  console.log('点击了标签', index)
}

<Tags
  dataSource={[
    { text: '可点击标签1' },
    { text: '可点击标签2' }
  ]}
  onPress={handlePress}
/>

// 迁移后 - 无需改动
import { Tags } from '@sfe/wand-rn'

const handlePress = (event, index) => {
  console.log('点击了标签', index)
}

<Tags
  dataSource={[
    { text: '可点击标签1' },
    { text: '可点击标签2' }
  ]}
  onPress={handlePress}
/>
```

### 案例 7：带边框和自定义颜色

```tsx
// 迁移前
import { Tags } from '@sgfe/flower-rn'

<Tags
  dataSource={[
    {
      text: '带边框标签',
      hasBorder: true,
      borderColor: '#FF6B6B',
      color: '#FF6B6B',
      backgroundColor: '#FFF'
    }
  ]}
/>

// 迁移后 - 无需改动
import { Tags } from '@sfe/wand-rn'

<Tags
  dataSource={[
    {
      text: '带边框标签',
      hasBorder: true,
      borderColor: '#FF6B6B',
      color: '#FF6B6B',
      backgroundColor: '#FFF'
    }
  ]}
/>
```

### 案例 8：带左侧 Icon

```tsx
// 迁移前
import { Tags } from '@sgfe/flower-rn'
import { Icon } from '@sgfe/flower-rn'

<Tags
  dataSource={[
    {
      text: '标签',
      renderIcon: () => <Icon name="check" size={12} />
    }
  ]}
/>

// 迁移后 - 无需改动
import { Tags } from '@sfe/wand-rn'
import { Icon } from '@sfe/wand-rn'

<Tags
  dataSource={[
    {
      text: '标签',
      renderIcon: () => <Icon name="check" size={12} />
    }
  ]}
/>
```

### 案例 9：带右侧 Icon（新功能）

```tsx
// 迁移后 - 使用新增功能
import { Tags } from '@sfe/wand-rn'
import { Icon } from '@sfe/wand-rn'

<Tags
  dataSource={[
    {
      text: '可删除标签',
      renderIcon: () => <Icon name="tag" size={12} />,
      rightIconRender: () => <Icon name="close" size={12} />
    }
  ]}
  onPress={(event, index) => {
    console.log('删除标签', index)
  }}
/>
```

### 案例 10：完整使用示例

```tsx
// 迁移前
import { Tags } from '@sgfe/flower-rn'

const TagsDemo = () => {
  const [selected, setSelected] = useState([])
  
  const tagData = [
    { text: '热门', backgroundColor: '#FF6B6B' },
    { text: '新品', backgroundColor: '#4ECDC4' },
    { text: '推荐', backgroundColor: '#95E1D3' },
    { text: '折扣', backgroundColor: '#FFE66D' }
  ]
  
  const handlePress = (event, index) => {
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index))
    } else {
      setSelected([...selected, index])
    }
  }
  
  return (
    <Tags
      dataSource={tagData}
      size="lg"
      wrapable
      onPress={handlePress}
      style={{ padding: 10 }}
    />
  )
}

// 迁移后 - 无需改动
import { Tags } from '@sfe/wand-rn'

const TagsDemo = () => {
  const [selected, setSelected] = useState([])
  
  const tagData = [
    { text: '热门', backgroundColor: '#FF6B6B' },
    { text: '新品', backgroundColor: '#4ECDC4' },
    { text: '推荐', backgroundColor: '#95E1D3' },
    { text: '折扣', backgroundColor: '#FFE66D' }
  ]
  
  const handlePress = (event, index) => {
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index))
    } else {
      setSelected([...selected, index])
    }
  }
  
  return (
    <Tags
      dataSource={tagData}
      size="lg"
      wrapable
      onPress={handlePress}
      style={{ padding: 10 }}
    />
  )
}
```

## 关键点

- **完全 API 兼容**：所有原有属性都保持一致，无需改动代码
- **新增默认值**：`activeOpacity` 默认 0.2，`color` 默认 '#FFFFFF'，使用更便利
- **新增 rightIconRender**：支持在 Tag 右侧添加 Icon，可用于删除、编辑等操作
- **推荐迁移步骤**：
  1. 将导入改为 `import { Tags } from '@sfe/wand-rn'`
  2. 如需在 Tag 右侧添加 Icon，使用新的 `rightIconRender` 属性
  3. 其他代码无需改动
- **新增功能优势**：
  - `rightIconRender` 支持更丰富的 Tag 交互方式
  - 默认值优化使组件更易用
- **TypeScript 类型**：新版本在 `types.ts` 中定义，类型定义更清晰
