# Tags 标签

## 从何处迁移
- **源库**: `@roo/roo-rn1`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface TagsProps extends WithThemeStyles<TagsStyles> {
  /** 标签数据（对象数组） */
  tags?: Omit<TagItemProps, 'index'>[]
  /** 标签数据（字符串数组） */
  tagsText?: string[]
  /** 容器样式 */
  style?: StyleProp<ViewStyle>
  /** 是否自动换行 */
  isBroken?: boolean  // 默认 false
  /** 是否连接样式 */
  connect?: boolean  // 默认 false
  /** 点击透明度 */
  activeOpacity?: number  // 默认 0.2
  /** 点击事件 */
  onPress?: (event: GestureResponderEvent, index: number) => void
}

interface TagItemProps extends WithThemeStyles<TagsStyles> {
  /** 标签标题（优先于 text） */
  title?: string
  /** 标签文本 */
  text?: string
  /** 文字颜色 */
  color?: string
  /** 背景颜色 */
  backgroundColor?: string
  /** 边框颜色 */
  borderColor?: string
  /** 连接线颜色 */
  splitLineColor?: string
  /** 背景图片 URL */
  imgUrl?: string
  /** 是否有边框 */
  hasBorder?: boolean  // 默认 false
  /** 标签项样式 */
  style?: StyleProp<ViewStyle>
  /** 索引 */
  index: number
  /** 标签项点击透明度 */
  itemActiveOpacity?: number  // 默认 0.2
  /** 自定义图标 */
  renderIcon?: (props: TagItemProps, theme: Theme) => JSX.Element
  /** 自定义内容 */
  renderContent?: (props: TagItemProps, theme: Theme) => JSX.Element
  /** 是否连接样式 */
  connect?: boolean
  /** 点击事件 */
  onPress?: (event: GestureResponderEvent, index: number) => void
}
```

## 新组件 API

```tsx
type TagSize = 'xl' | 'lg' | 'sm'
type TagFontSize = 'lg' | 'sm'

interface TagsProps {
  /** 标签数据（对象数组，text 字段必填） */
  dataSource?: TagItemProps[]  // 默认 []
  /** 标签尺寸 */
  size?: TagSize  // 默认 'sm'
  /** 字体大小 */
  fontSize?: TagFontSize
  /** 是否自动换行 */
  wrapable?: boolean  // 默认 false
  /** 是否连接样式 */
  connectable?: boolean  // 默认 false
  /** 连接模式下的边框颜色 */
  borderColor?: string
  /** 点击透明度 */
  activeOpacity?: number  // 默认 0.2
  /** 容器样式 */
  style?: ViewStyle
  /** 所有标签项的通用样式 */
  itemStyle?: ViewStyle
  /** 点击事件 */
  onPress?: (event: GestureResponderEvent, index: number) => void
}

interface TagItemProps {
  /** 标签文本（必填） */
  text: string
  /** 文字颜色 */
  color?: string
  /** 背景颜色 */
  backgroundColor?: string
  /** 连接线颜色 */
  splitLineColor?: string
  /** 是否有边框 */
  hasBorder?: boolean
  /** 边框颜色 */
  borderColor?: string
  /** 索引 */
  index?: number
  /** 文字样式 */
  textStyle?: TextStyle
  /** 自定义左侧图标 */
  renderIcon?: () => JSX.Element
  /** 自定义右侧图标 */
  rightIconRender?: () => JSX.Element
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| tags | dataSource | 属性名变更，且 item 的 `title` 字段改为 `text`（必填） |
| tagsText | dataSource | 移除，需转换为 `[{text: 'a'}, {text: 'b'}]` 格式 |
| isBroken | wrapable | 属性名变更 |
| connect | connectable | 属性名变更 |
| activeOpacity | activeOpacity | 保持一致 |
| style | style | 类型从 `StyleProp<ViewStyle>` 变为 `ViewStyle` |
| onPress | onPress | 保持一致 |
| - | size | 新增，控制标签尺寸 |
| - | fontSize | 新增，控制字体大小 |
| - | itemStyle | 新增，统一设置所有标签项样式 |
| - | borderColor (TagsProps) | 新增，连接模式下的容器边框颜色 |

### TagItemProps 变更

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| title | text | 使用 `text` 替代（必填） |
| text | text | 保持 |
| color | color | 保持一致 |
| backgroundColor | backgroundColor | 保持一致 |
| borderColor | borderColor | 保持一致 |
| splitLineColor | splitLineColor | 保持一致 |
| imgUrl | - | 移除，wand-rn 不支持背景图片 |
| hasBorder | hasBorder | 保持一致 |
| style | - | 移除，使用容器级 `itemStyle` 或 `textStyle` |
| itemActiveOpacity | - | 移除，由容器的 `activeOpacity` 控制 |
| renderIcon | renderIcon | 签名变更：从 `(props, theme) => Element` 改为 `() => Element` |
| renderContent | - | 移除，无对应替代 |
| - | textStyle | 新增，自定义文字样式 |
| - | rightIconRender | 新增，自定义右侧图标 |

## 迁移示例

### 案例 1：基础标签（对象数组）

```tsx
// 迁移前
import { Tags } from '@roo/roo-rn1'

<Tags
  tags={[
    { title: '标签1', color: '#fff', backgroundColor: '#FF6633' },
    { title: '标签2', color: '#fff', backgroundColor: '#1890FF' },
  ]}
  onPress={(e, index) => console.log(index)}
/>

// 迁移后
import { Tags } from '@sfe/wand-rn'

<Tags
  dataSource={[
    { text: '标签1', color: '#fff', backgroundColor: '#FF6633' },
    { text: '标签2', color: '#fff', backgroundColor: '#1890FF' },
  ]}
  onPress={(e, index) => console.log(index)}
/>
```

### 案例 2：字符串数组标签

```tsx
// 迁移前
import { Tags } from '@roo/roo-rn1'

<Tags tagsText={['标签A', '标签B', '标签C']} />

// 迁移后
import { Tags } from '@sfe/wand-rn'

<Tags dataSource={[{ text: '标签A' }, { text: '标签B' }, { text: '标签C' }]} />
```

### 案例 3：自动换行

```tsx
// 迁移前
import { Tags } from '@roo/roo-rn1'

<Tags tags={[{ title: '标签1' }, { title: '标签2' }]} isBroken={true} />

// 迁移后
import { Tags } from '@sfe/wand-rn'

<Tags dataSource={[{ text: '标签1' }, { text: '标签2' }]} wrapable={true} />
```

### 案例 4：连接样式

```tsx
// 迁移前
import { Tags } from '@roo/roo-rn1'

<Tags tags={[{ title: '已支付' }, { title: '待发货' }]} connect={true} />

// 迁移后
import { Tags } from '@sfe/wand-rn'

<Tags dataSource={[{ text: '已支付' }, { text: '待发货' }]} connectable={true} />
```

### 案例 5：自定义图标

```tsx
// 迁移前
import { Tags } from '@roo/roo-rn1'

<Tags
  tags={[
    {
      title: '标签',
      renderIcon: (props, theme) => (
        <Image source={{ uri: 'icon.png' }} style={{ width: 12, height: 12 }} />
      ),
    },
  ]}
/>

// 迁移后 - renderIcon 签名变更，不再接收参数
import { Tags } from '@sfe/wand-rn'

<Tags
  dataSource={[
    {
      text: '标签',
      renderIcon: () => (
        <Image source={{ uri: 'icon.png' }} style={{ width: 12, height: 12 }} />
      ),
    },
  ]}
/>
```

### 案例 6：自定义内容（renderContent 迁移）

```tsx
// 迁移前 - 使用 renderContent 完全自定义内容
import { Tags } from '@roo/roo-rn1'

<Tags
  tags={[
    {
      title: '',
      renderContent: (props, theme) => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="star" size={10} color={theme.mtdBrandPrimary} />
          <Text style={{ marginLeft: 2 }}>自定义</Text>
        </View>
      ),
    },
  ]}
/>

// 迁移后 - renderContent 不再支持，使用 renderIcon + text + rightIconRender 组合
import { Tags } from '@sfe/wand-rn'

<Tags
  dataSource={[
    {
      text: '自定义',
      renderIcon: () => <Icon name="star" size={10} />,
    },
  ]}
/>
```

### 案例 7：背景图片标签（imgUrl 迁移）

```tsx
// 迁移前 - 支持背景图片
import { Tags } from '@roo/roo-rn1'

<Tags
  tags={[
    { title: '热门', imgUrl: 'https://example.com/tag-bg.png' },
  ]}
/>

// 迁移后 - imgUrl 不再支持，需用 backgroundColor 替代或自行包装
import { Tags } from '@sfe/wand-rn'

// 方案：使用纯色背景替代
<Tags
  dataSource={[
    { text: '热门', backgroundColor: '#FF6633' },
  ]}
/>
```

### 案例 8：使用尺寸系统

```tsx
// 迁移前 - 无尺寸系统，固定大小
import { Tags } from '@roo/roo-rn1'

<Tags tags={[{ title: '标签' }]} />

// 迁移后 - 支持 size 和 fontSize
import { Tags } from '@sfe/wand-rn'

<Tags dataSource={[{ text: '标签' }]} size="lg" fontSize="lg" />
```

## 关键点

### 1. 数据属性统一
- 旧版本支持两种输入：`tags`（对象数组）和 `tagsText`（字符串数组）
- 新版本统一为 `dataSource`（对象数组），`text` 字段必填
- `tagsText` 需要转换为 `dataSource` 格式：`['a', 'b']` -> `[{text: 'a'}, {text: 'b'}]`

### 2. 标签文本字段
- 旧版本优先使用 `title`，其次 `text`
- 新版本仅使用 `text`（必填）
- 迁移时所有 `title` 需重命名为 `text`

### 3. 属性重命名
- `isBroken` -> `wrapable`
- `connect` -> `connectable`
- 语义不变，仅名称变更

### 4. renderIcon 签名变化
- 旧版本：`(props: TagItemProps, theme: Theme) => JSX.Element`
- 新版本：`() => JSX.Element`
- 如果旧代码中使用了 props 或 theme 参数，需要通过闭包或外部变量获取

### 5. 移除的功能
- `renderContent`：完全自定义内容渲染，无直接替代。可用 `renderIcon` + `text` + `rightIconRender` 组合部分替代
- `imgUrl`：背景图片，无替代。改用 `backgroundColor` 或自行包装
- `styles`（主题覆盖）：wand-rn 的 Tags 不继承 `WithThemeStyles`

### 6. 新增功能
- `size`：标签尺寸（xl/lg/sm）
- `fontSize`：字体大小（lg/sm）
- `itemStyle`：统一设置所有标签项样式
- `rightIconRender`：自定义右侧图标
- `textStyle`：自定义文字样式

## 注意事项

1. **tagsText 必须转换**：`tagsText={['a','b']}` 需改为 `dataSource={[{text:'a'},{text:'b'}]}`
2. **title 重命名为 text**：所有 `tags` 数组中的 `title` 字段需改为 `text`
3. **renderIcon 参数移除**：如果回调中使用了 `props` 或 `theme`，需要改为通过闭包获取
4. **renderContent 无替代**：复杂自定义内容需要重新设计实现方式
5. **imgUrl 无替代**：使用背景图片的标签需改用纯色或其他方案
6. **style 类型变化**：从 `StyleProp<ViewStyle>` 变为 `ViewStyle`，去掉数组样式写法

## 迁移检查清单

- [ ] 将 `tags` 属性替换为 `dataSource`，item 中 `title` 改为 `text`
- [ ] 将 `tagsText` 转换为 `dataSource` 格式
- [ ] 将 `isBroken` 替换为 `wrapable`
- [ ] 将 `connect` 替换为 `connectable`
- [ ] 更新 `renderIcon` 回调签名，移除参数
- [ ] 移除 `renderContent`，使用 `renderIcon` + `rightIconRender` 替代
- [ ] 移除 `imgUrl`，使用 `backgroundColor` 替代
- [ ] 移除 `styles` 主题覆盖属性
- [ ] 根据需要添加 `size` 和 `fontSize` 控制标签大小
- [ ] 验证标签在连接模式下的显示效果
