# Tags 标签

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface TagModel {
    title: string  // 标签文案（必填）
    color?: string  // 文字颜色
    borderColor?: string  // 边框颜色
    backgroundColor?: string  // 背景颜色
    style?: StyleProp<ViewStyle>  // 标签样式
    txtStyle?: StyleProp<TextStyle>  // 文字样式
}

export interface TagsProps {
    tags?: TagModel[]  // 标签数据（使用对象数组）
    tagsText?: string[]  // 标签文本（使用字符串数组，简化版）
    rootStyle?: StyleProp<ViewStyle>  // 容器样式
    isBroken?: boolean  // 是否截断（不换行），默认 false
    onTagClick?: (title: string) => void  // 标签点击回调
    prefixReactNode?: ReactElement  // 前缀内容
}

export class Tags extends PureComponent<TagsProps> {
    // 类组件实现
}
```

## 新组件 API

```tsx
export type TagSize = 'xl' | 'lg' | 'sm'  // 标签大小
export type TagFontSize = 'lg' | 'sm'  // 文字大小

export interface TagItemProps {
    /** TagItem 的文案 */
    text: string  // 标签文案（必填）
    /** TagItem 的文案的颜色 */
    color?: string  // 文字颜色
    /** TagItem 的背景色 */
    backgroundColor?: string  // 背景颜色
    /** 是否包含边框 */
    hasBorder?: boolean  // 默认 false
    /** TagItem 的边框色 */
    borderColor?: string  // 边框颜色
    /** 多条组合形式下，分割线的颜色 */
    splitLineColor?: string  // 分割线颜色
    /** 自定义左侧 Icon */
    renderIcon?: () => JSX.Element  // 左侧 Icon
    /** 自定义右侧 Icon */
    rightIconRender?: () => JSX.Element  // 右侧 Icon
    /** 自定义 TagItem 的文案样式 */
    textStyle?: TextStyle  // 文字样式
    /** TagItem 的 index */
    index?: number  // 索引
}

export interface TagsProps {
    /** 数据源 */
    dataSource?: TagItemProps[]  // 标签数据数组
    /** 标签大小 */
    size?: TagSize  // 默认 'sm'
    /** 标签文字大小 */
    fontSize?: TagFontSize  // 可选 'lg' 或 'sm'
    /** 是否需要自动换行 */
    wrapable?: boolean  // 默认 false
    /** 使用 "多条组合" 形式 */
    connectable?: boolean  // 默认 false
    /** 多条组合形式下的边框色 */
    borderColor?: string  // 边框颜色
    /** 设置所有 item 的按压透明度 */
    activeOpacity?: number  // 默认 0.2
    /** 自定义组件最外层的样式 */
    style?: ViewStyle  // 容器样式
    /** 自定义 Tag 的样式 */
    itemStyle?: ViewStyle  // 标签样式
    /** Tag 的点击回调 */
    onPress?: (event: GestureResponderEvent, index: number) => void  // 点击回调
}

export class Tags extends PureComponent<TagsProps> {
    // 类组件实现
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| tags | dataSource | 标签数据来源，数据结构有变化 |
| tagsText | dataSource | 不再支持字符串数组，需要转换为对象数组 |
| rootStyle | style | 容器样式 |
| isBroken | wrapable | 逻辑反转：isBroken=true → wrapable=false |
| onTagClick | onPress | 点击回调，参数从标题改为事件对象和索引 |
| prefixReactNode | - | 前缀内容不再支持 |
| - | size | 标签大小（新增） |
| - | fontSize | 文字大小（新增） |
| - | connectable | 多条组合模式（新增） |
| - | borderColor | 组合模式下的边框色（新增） |
| - | activeOpacity | 按压透明度（新增） |
| - | itemStyle | 标签样式（新增） |

### 数据结构映射

**旧组件**：
```tsx
const tags = [
    { title: '标签1', color: '#FFF', backgroundColor: '#000' },
    { title: '标签2' }
]
```

**新组件**：
```tsx
const tags = [
    { text: '标签1', color: '#FFF', backgroundColor: '#000' },
    { text: '标签2' }
]
```

## 迁移示例

### 案例 1：基础标签

```tsx
// 迁移前
import { Tags } from '@mtfe/empower-mrn-components'

<Tags 
    tags={[
        { title: '标签1' },
        { title: '标签2' },
        { title: '标签3' }
    ]}
    onTagClick={(title) => console.log(title)}
/>

// 迁移后
import { Tags } from '@sfe/wand-rn'

<Tags 
    dataSource={[
        { text: '标签1' },
        { text: '标签2' },
        { text: '标签3' }
    ]}
    onPress={(event, index) => console.log(index)}
/>
```

### 案例 2：字符串数组转换

```tsx
// 迁移前
<Tags 
    tagsText={['标签1', '标签2', '标签3']}
    onTagClick={(title) => handleTagClick(title)}
/>

// 迁移后 - 需要转换为对象数组
const tagsText = ['标签1', '标签2', '标签3']
const dataSource = tagsText.map((text) => ({ text }))

<Tags 
    dataSource={dataSource}
    onPress={(event, index) => handleTagClick(dataSource[index].text)}
/>

// 或使用 helper 函数
const convertTags = (texts: string[]) => texts.map(text => ({ text }))

<Tags 
    dataSource={convertTags(['标签1', '标签2', '标签3'])}
/>
```

### 案例 3：自定义颜色

```tsx
// 迁移前
<Tags 
    tags={[
        {
            title: '标签1',
            color: '#FFFFFF',
            backgroundColor: '#222222',
            borderColor: '#CCCCCC'
        },
        {
            title: '标签2',
            color: '#FFC34D',
            backgroundColor: '#FFFFFF'
        }
    ]}
/>

// 迁移后
<Tags 
    dataSource={[
        {
            text: '标签1',
            color: '#FFFFFF',
            backgroundColor: '#222222',
            hasBorder: true,
            borderColor: '#CCCCCC'
        },
        {
            text: '标签2',
            color: '#FFC34D',
            backgroundColor: '#FFFFFF'
        }
    ]}
/>
```

### 案例 4：不换行模式

```tsx
// 迁移前
<Tags 
    tags={[
        { title: '标签1' },
        { title: '标签2' },
        { title: '标签3' }
    ]}
    isBroken  // 不换行，隐藏超出的
/>

// 迁移后 - 逻辑反转
<Tags 
    dataSource={[
        { text: '标签1' },
        { text: '标签2' },
        { text: '标签3' }
    ]}
    wrapable={false}  // 不换行
/>
```

### 案例 5：自动换行

```tsx
// 迁移前 - 默认换行

// 迁移后 - 显式启用换行
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

### 案例 6：自定义标签大小

```tsx
// 迁移前 - 无大小选择

// 迁移后 - 新增大小选择
<View>
    <Tags dataSource={tags} size='xl' />
    <Tags dataSource={tags} size='lg' />
    <Tags dataSource={tags} size='sm' />
</View>
```

### 案例 7：自定义文字大小

```tsx
// 迁移前 - 需要自定义 txtStyle

// 迁移后 - 新增文字大小属性
<Tags 
    dataSource={tags}
    fontSize='lg'  // 大文字
/>

// 或使用自定义样式
<Tags 
    dataSource={tags.map(tag => ({
        ...tag,
        textStyle: { fontSize: 16 }
    }))}
/>
```

### 案例 8：多条组合模式

```tsx
// 迁移前 - 无组合模式

// 迁移后 - 新增组合模式
<Tags 
    dataSource={[
        { text: '昨天', color: '#F89800', backgroundColor: '#FFFFFF' },
        { text: '今天', color: '#F89800', backgroundColor: '#FFFFFF' },
        { text: '明天', color: '#F89800', backgroundColor: '#FFFFFF' }
    ]}
    connectable  // 组合模式
/>
```

### 案例 9：组合模式 - 自定义分割线

```tsx
// 迁移前 - 无组合模式

// 迁移后 - 使用分割线颜色
<Tags 
    dataSource={[
        { 
            text: '选项1', 
            color: '#222', 
            backgroundColor: '#FFFFFF',
            splitLineColor: '#222'  // 分割线颜色
        },
        { 
            text: '选项2', 
            color: '#222', 
            backgroundColor: '#FFFFFF',
            splitLineColor: '#222'
        }
    ]}
    connectable
    borderColor='#222'  // 整体边框色
/>
```

### 案例 10：自定义点击回调

```tsx
// 迁移前
<Tags 
    tags={[
        { title: '标签1' },
        { title: '标签2' }
    ]}
    onTagClick={(title) => {
        console.log('点击:', title)
        handleTagClick(title)
    }}
/>

// 迁移后 - 回调参数变更
<Tags 
    dataSource={[
        { text: '标签1' },
        { text: '标签2' }
    ]}
    onPress={(event, index) => {
        const selectedText = dataSource[index].text
        console.log('点击:', selectedText, '索引:', index)
        handleTagClick(selectedText)
    }}
/>
```

### 案例 11：添加 Icon

```tsx
// 迁移前 - 不支持 Icon

// 迁移后 - 支持左右 Icon
import { Icon } from '@sfe/wand-rn'

<Tags 
    dataSource={[
        {
            text: '有 Icon',
            renderIcon: () => <Icon type='phone' size={10} />,
            rightIconRender: () => <Icon type='close' size={10} />
        }
    ]}
/>
```

### 案例 12：自定义容器样式

```tsx
// 迁移前
<Tags 
    tags={tags}
    rootStyle={{ paddingHorizontal: 10, backgroundColor: '#F5F5F5' }}
/>

// 迁移后
<Tags 
    dataSource={tags}
    style={{ paddingHorizontal: 10, backgroundColor: '#F5F5F5' }}
/>
```

### 案例 13：自定义单个标签样式

```tsx
// 迁移前
<Tags 
    tags={[
        {
            title: '标签1',
            style: { marginRight: 20 },
            txtStyle: { fontSize: 16 }
        }
    ]}
/>

// 迁移后
<Tags 
    dataSource={[
        {
            text: '标签1',
            textStyle: { fontSize: 16 }
        }
    ]}
    itemStyle={{ marginRight: 20 }}
/>
```

### 案例 14：按压透明度

```tsx
// 迁移前 - 无配置选项

// 迁移后 - 新增按压透明度
<Tags 
    dataSource={tags}
    activeOpacity={0.5}  // 按压时的透明度
/>
```

### 案例 15：完整高级示例

```tsx
// 迁移前
import { Tags, Icon } from '@mtfe/empower-mrn-components'

<Tags 
    tags={[
        {
            title: '自定义1',
            color: '#FF0000',
            backgroundColor: '#FFFFFF',
            borderColor: '#FF0000'
        },
        {
            title: '自定义2',
            color: '#FFFFFF',
            backgroundColor: '#FF0000'
        }
    ]}
    rootStyle={{ paddingHorizontal: 10 }}
    isBroken={false}
    onTagClick={(title) => handleTagClick(title)}
/>

// 迁移后
import { Tags, Icon } from '@sfe/wand-rn'

<Tags 
    dataSource={[
        {
            text: '自定义1',
            color: '#FF0000',
            backgroundColor: '#FFFFFF',
            hasBorder: true,
            borderColor: '#FF0000',
            renderIcon: () => <Icon type='star' size={12} />
        },
        {
            text: '自定义2',
            color: '#FFFFFF',
            backgroundColor: '#FF0000'
        }
    ]}
    style={{ paddingHorizontal: 10 }}
    wrapable
    size='lg'
    fontSize='sm'
    onPress={(event, index) => {
        const text = dataSource[index].text
        handleTagClick(text)
    }}
/>
```

## 关键点

### 数据属性变化

- **title → text**：标签文案属性重命名
- **tags → dataSource**：标签数组属性重命名
- **tagsText 不再支持**：需要转换为对象数组

### 回调函数变化

- **onTagClick → onPress**：回调重命名
- **参数变更**：
  - 旧：`(title: string) => void`
  - 新：`(event: GestureResponderEvent, index: number) => void`
- **需要处理**：从 dataSource 中获取标签文案

### 不再支持的功能

- **prefixReactNode**：前缀内容已移除
- **isBroken 逻辑反转**：改为 wrapable
- **tagsText**：字符串数组已移除

### 新增功能

1. **标签大小**：size 属性支持 'xl' | 'lg' | 'sm'
2. **文字大小**：fontSize 属性支持 'lg' | 'sm'
3. **多条组合**：connectable 属性启用组合模式
4. **分割线**：splitLineColor 属性自定义分割线颜色
5. **Icon 支持**：renderIcon 和 rightIconRender 支持自定义 Icon
6. **边框控制**：hasBorder 属性控制是否显示边框
7. **按压透明度**：activeOpacity 属性自定义按压效果

### 样式处理

- 旧组件：style 作用于标签容器
- 新组件：style 作用于最外层容器，itemStyle 作用于单个标签

## 迁移策略

### 第一步：更新导入

```tsx
// 旧
import { Tags } from '@mtfe/empower-mrn-components'

// 新
import { Tags } from '@sfe/wand-rn'
```

### 第二步：更新数据结构

```tsx
// 旧
const tags = [
    { title: '标签1' },
    { title: '标签2' }
]

// 新
const dataSource = [
    { text: '标签1' },
    { text: '标签2' }
]
```

### 第三步：转换字符串数组

如果使用 `tagsText`：

```tsx
// 旧
const tagsText = ['标签1', '标签2']
<Tags tagsText={tagsText} />

// 新
const dataSource = tagsText.map(text => ({ text }))
<Tags dataSource={dataSource} />
```

### 第四步：更新回调函数

```tsx
// 旧
onTagClick={(title) => handleClick(title)}

// 新
onPress={(event, index) => handleClick(dataSource[index].text)}
```

### 第五步：处理 isBroken 逻辑反转

```tsx
// 旧
isBroken={true}  // 不换行

// 新
wrapable={false}  // 不换行
```

### 第六步：移除不支持的属性

- 删除 `prefixReactNode`（前缀内容）
- 删除 `rootStyle`（改为 `style`）

### 第七步：添加新功能（可选）

```tsx
<Tags 
    dataSource={dataSource}
    size='lg'  // 标签大小
    fontSize='lg'  // 文字大小
    connectable  // 组合模式
    wrapable  // 自动换行
/>
```

## 常见迁移问题

### Q: 如何处理 tagsText 字符串数组？

A: 需要转换为对象数组：

```tsx
const tagsText = ['标签1', '标签2']
const dataSource = tagsText.map(text => ({ text }))

<Tags dataSource={dataSource} />
```

或使用 helper 函数：

```tsx
const convertTags = (texts: string[]) => texts.map(text => ({ text }))

<Tags dataSource={convertTags(tagsText)} />
```

### Q: 如何从 onPress 回调中获取标签文案？

A: 从 dataSource 中根据 index 获取：

```tsx
<Tags 
    dataSource={dataSource}
    onPress={(event, index) => {
        const selectedTag = dataSource[index]
        console.log('文案:', selectedTag.text)
    }}
/>
```

### Q: isBroken 如何改为 wrapable？

A: 逻辑相反：

```tsx
// 旧：isBroken=true 表示不换行
// 新：wrapable=false 表示不换行

// 旧
<Tags tags={tags} isBroken />

// 新
<Tags dataSource={dataSource} wrapable={false} />
```

### Q: 如何迁移前缀内容（prefixReactNode）？

A: 新组件不支持前缀内容。可以通过以下方式实现：

1. 在 Tags 外部使用 View 包装
2. 或将前缀作为第一个标签项

```tsx
// 方案1：外部包装
<View style={{ flexDirection: 'row' }}>
    <Text>前缀:</Text>
    <Tags dataSource={dataSource} />
</View>

// 方案2：第一个标签作为前缀
<Tags dataSource={[
    { text: '前缀:', backgroundColor: 'transparent' },
    ...tags
]} />
```

### Q: 如何自定义单个标签的样式？

A: 使用 itemStyle 和 textStyle：

```tsx
<Tags 
    dataSource={[
        {
            text: '标签',
            textStyle: { fontSize: 16, color: '#FFF' }
        }
    ]}
    itemStyle={{ marginRight: 20 }}
/>
```

### Q: connectable 组合模式如何使用？

A: 启用组合模式后，多个标签会连接在一起：

```tsx
<Tags 
    dataSource={[
        { text: '选项1' },
        { text: '选项2' },
        { text: '选项3' }
    ]}
    connectable
/>
```

### Q: 如何实现类似旧组件的 isBroken 截断效果？

A: 将 wrapable 设置为 false：

```tsx
<Tags 
    dataSource={dataSource}
    wrapable={false}  // 超出部分被截断
/>
```

## 注意事项

1. **数据属性重命名**：title → text，tags → dataSource

2. **回调参数变更**：onTagClick → onPress，参数由标题改为事件和索引

3. **字符串数组移除**：tagsText 不再支持，需要手动转换

4. **isBroken 逻辑反转**：isBroken=true → wrapable=false

5. **prefixReactNode 移除**：需要用其他方式实现前缀内容

6. **类组件保留**：新组件仍是类组件，不是函数组件

7. **新增功能丰富**：标签大小、Icon、组合模式等

8. **性能优化**：新组件使用主题系统，提升了性能

## 迁移检查清单

- [ ] 更新导入语句（Tags）
- [ ] 将 `tags` 属性改为 `dataSource`
- [ ] 将 `title` 改为 `text`
- [ ] 转换 `tagsText` 字符串数组为对象数组
- [ ] 将 `rootStyle` 改为 `style`
- [ ] 更新 `isBroken` 为 `wrapable`（逻辑反转）
- [ ] 更新 `onTagClick` 为 `onPress`
- [ ] 处理点击回调参数变更
- [ ] 移除 `prefixReactNode` 属性
- [ ] 为标签添加 `hasBorder` 属性（如需要边框）
- [ ] 考虑添加标签大小配置
- [ ] 考虑使用组合模式（connectable）
- [ ] 验证标签显示正常
- [ ] 验证点击事件正常
- [ ] 验证样式和颜色正确
- [ ] 测试不同大小和模式的标签
- [ ] 测试自定义 Icon（如使用）

## 与 wand-rn Tags 的功能对比

| 功能 | 旧 Tags | 新 Tags | 说明 |
|------|---------|---------|------|
| 基础标签 | ✓ | ✓ | 都支持 |
| 字符串数组 | ✓ | ✗ | 旧支持，新需手动转换 |
| 自定义颜色 | ✓ | ✓ | 都支持 |
| 自定义样式 | ✓ | ✓ | 都支持 |
| 边框显示 | ✓ | ✓ | 新增 hasBorder 控制 |
| 标签大小 | ✗ | ✓ | 新增 size 属性 |
| 文字大小 | ✗ | ✓ | 新增 fontSize 属性 |
| 不换行截断 | ✓ | ✓ | 逻辑反转 |
| 自动换行 | ✓ | ✓ | 都支持 |
| 组合模式 | ✗ | ✓ | 新增 connectable 属性 |
| 分割线 | ✗ | ✓ | 新增 splitLineColor |
| 前缀内容 | ✓ | ✗ | 旧支持，新不支持 |
| Icon 支持 | ✗ | ✓ | 新增 renderIcon 和 rightIconRender |
| 按压透明度 | ✗ | ✓ | 新增 activeOpacity 属性 |
