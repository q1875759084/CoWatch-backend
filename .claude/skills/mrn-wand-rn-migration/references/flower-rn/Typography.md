# Typography 排版

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
// Typography 包含 Text 和 Title 两个子组件
const { Text, Title } = Typography;

interface TextProps {
    // 文本大小
    size?: 'xxxxl' | 'xxxl' | 'xxl' | 'xl' | 'large' | 'middle' | 'small' | 'mini'  // 默认 'large'
    
    // 文本类型/颜色
    type?: 'default' | 'secondary' | 'assist' | 'link' | 'danger' | 'success' | 'progress' | 'icon' | 'white'  // 默认 'default'
    
    // 样式修饰
    italic?: boolean  // 是否斜体
    deleteLine?: boolean  // 添加删除线样式
    ellipsis?: boolean  // 溢出省略
    underline?: boolean  // 添加下划线
    strong?: boolean  // 加粗，字体粗细600
    strongLevel?: '0' | '400' | '500' | '600'  // 字体粗细等级，默认 '0'
    disabled?: boolean  // 禁用
    
    // 事件
    onPress?: (event: GestureResponderEvent) => void
    
    // 自定义样式（仅支持以下属性）
    style?: {
        padding?: number
        paddingBottom?: number
        paddingEnd?: number
        paddingHorizontal?: number
        paddingLeft?: number
        paddingRight?: number
        paddingStart?: number
        paddingVertical?: number
        paddingTop?: number
        margin?: number
        marginBottom?: number
        marginEnd?: number
        marginHorizontal?: number
        marginLeft?: number
        marginRight?: number
        marginStart?: number
        marginTop?: number
        marginVertical?: number
        textAlign?: 'left' | 'center' | 'right'
        lineHeight?: number
        letterSpacing?: number
        flex?: number
        textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center'
    }
}

interface TitleProps extends TextProps {
    level?: '1' | '2' | '3'  // 标题级别，默认 '1'
}
```

## 新组件 API

```tsx
// Typography 包含 Text 和 Title 两个子组件
const { Text, Title } = Typography;

interface TextProps {
    // 文本大小（移除了 xxxxl 和 xxl）
    size?: 'xxxl' | 'xl' | 'large' | 'middle' | 'small' | 'mini'  // 默认 'large'
    
    // 文本类型/颜色（移除了 icon 类型）
    type?: 'default' | 'secondary' | 'assist' | 'link' | 'danger' | 'success' | 'progress' | 'white'  // 默认 'default'
    
    // 样式修饰
    italic?: boolean  // 是否斜体
    deleteLine?: boolean  // 添加删除线样式
    ellipsis?: boolean  // 溢出省略
    underline?: boolean  // 添加下划线
    strong?: boolean  // 加粗，字体粗细600
    strongLevel?: '0' | '400' | '500' | '600'  // 字体粗细等级，默认 '0'
    disabled?: boolean  // 禁用
    
    // 事件
    onPress?: (event: GestureResponderEvent) => void
    
    // 自定义样式（新增支持 width 和 height）
    style?: {
        padding?: number
        paddingBottom?: number
        paddingEnd?: number
        paddingHorizontal?: number
        paddingLeft?: number
        paddingRight?: number
        paddingStart?: number
        paddingVertical?: number
        paddingTop?: number
        margin?: number
        marginBottom?: number
        marginEnd?: number
        marginHorizontal?: number
        marginLeft?: number
        marginRight?: number
        marginStart?: number
        marginTop?: number
        marginVertical?: number
        textAlign?: 'left' | 'center' | 'right'
        lineHeight?: number
        letterSpacing?: number
        flex?: number
        textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center'
        width?: number  // 新增
        height?: number  // 新增
    }
}

interface TitleProps extends TextProps {
    level?: '1' | '2' | '3'  // 标题级别，默认 '1'
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| size='xxxxl' | size='xxxl' | 不支持 xxxxl，需降级为 xxxl |
| size='xxl' | size='xl' | 不支持 xxl，需降级为 xl |
| type='icon' | type='link' 或自定义颜色 | 不支持 icon 类型，需替换为 link 或使用 style 自定义颜色 |
| style | style | 新版本额外支持 width 和 height 属性 |
| 其他属性 | 其他属性 | 完全兼容 |

## 迁移示例

### 案例 1：基础文本和标题

```tsx
// 迁移前
import { Typography } from '@sgfe/flower-rn'
const { Text, Title } = Typography

<View>
  <Title level="1">一级标题</Title>
  <Title level="2">二级标题</Title>
  <Title level="3">三级标题</Title>
  <Text size="large">普通文本</Text>
  <Text type="secondary">次要文字</Text>
</View>

// 迁移后
import { Typography } from '@sfe/wand-rn'
const { Text, Title } = Typography

<View>
  <Title level="1">一级标题</Title>
  <Title level="2">二级标题</Title>
  <Title level="3">三级标题</Title>
  <Text size="large">普通文本</Text>
  <Text type="secondary">次要文字</Text>
</View>
```

### 案例 2：尺寸迁移（需要调整）

```tsx
// 迁移前
<View>
  <Text size="xxxxl">超大文本</Text>
  <Text size="xxxl">特大文本</Text>
  <Text size="xxl">很大文本</Text>
  <Text size="xl">大文本</Text>
</View>

// 迁移后
<View>
  <Text size="xxxl">超大文本（降级为 xxxl）</Text>
  <Text size="xxxl">特大文本</Text>
  <Text size="xl">很大文本（降级为 xl）</Text>
  <Text size="xl">大文本</Text>
</View>
```

### 案例 3：文本类型和样式

```tsx
// 迁移前
<View>
  <Text type="icon">图标用色</Text>
  <Text type="link">文字链接</Text>
  <Text type="danger">警示文字</Text>
  <Text type="success">成功文字</Text>
</View>

// 迁移后
<View>
  <Text type="link">图标用色（改用 link 类型）</Text>
  {/* 或者使用自定义颜色 */}
  <Text style={{ color: '#00A4C4' }}>图标用色（自定义颜色）</Text>
  <Text type="link">文字链接</Text>
  <Text type="danger">警示文字</Text>
  <Text type="success">成功文字</Text>
</View>
```

### 案例 4：样式修饰

```tsx
// 迁移前
<View>
  <Text italic>斜体文本</Text>
  <Text deleteLine type="assist">删除线</Text>
  <Text underline type="assist">下划线</Text>
  <Text underline deleteLine type="assist">删除线加下划线</Text>
  <Text strongLevel="600">字重600</Text>
  <Text strongLevel="500">字重500</Text>
  <Text ellipsis>溢出省略的长文本内容...</Text>
</View>

// 迁移后（完全兼容）
<View>
  <Text italic>斜体文本</Text>
  <Text deleteLine type="assist">删除线</Text>
  <Text underline type="assist">下划线</Text>
  <Text underline deleteLine type="assist">删除线加下划线</Text>
  <Text strongLevel="600">字重600</Text>
  <Text strongLevel="500">字重500</Text>
  <Text ellipsis>溢出省略的长文本内容...</Text>
</View>
```

### 案例 5：事件和交互

```tsx
// 迁移前
<View>
  <Text onPress={() => Alert.alert('点击')}>点击文本</Text>
  <Text disabled>禁用文本</Text>
</View>

// 迁移后（完全兼容）
<View>
  <Text onPress={() => Alert.alert('点击')}>点击文本</Text>
  <Text disabled>禁用文本</Text>
</View>
```

### 案例 6：自定义样式

```tsx
// 迁移前
<View>
  <Text style={{ marginVertical: 10, textAlign: 'center' }}>
    居中文本
  </Text>
  <Title level="3" style={{ paddingVertical: 10 }}>
    带间距的标题
  </Title>
</View>

// 迁移后（完全兼容，并可使用新增的 width/height）
<View>
  <Text style={{ marginVertical: 10, textAlign: 'center' }}>
    居中文本
  </Text>
  <Title level="3" style={{ paddingVertical: 10 }}>
    带间距的标题
  </Title>
  {/* 新增功能：可以设置宽高 */}
  <Text style={{ width: 200, height: 40 }}>
    固定宽高的文本
  </Text>
</View>
```

### 案例 7：复杂嵌套

```tsx
// 迁移前
<View>
  <Title level="3">
    标题嵌套<Text>普通文本</Text>
  </Title>
  <Text size="large">
    文本内嵌<Text type="danger">危险文本</Text>
  </Text>
</View>

// 迁移后（完全兼容）
<View>
  <Title level="3">
    标题嵌套<Text>普通文本</Text>
  </Title>
  <Text size="large">
    文本内嵌<Text type="danger">危险文本</Text>
  </Text>
</View>
```

## 关键点

### 必须调整的地方
1. **尺寸调整**：
   - `size="xxxxl"` → `size="xxxl"`（降级）
   - `size="xxl"` → `size="xl"`（降级）

2. **类型调整**：
   - `type="icon"` → `type="link"` 或使用 `style={{ color: '#00A4C4' }}` 自定义颜色

### 完全兼容的属性
以下属性可以直接迁移，无需修改：
- `size`: 'xxxl' | 'xl' | 'large' | 'middle' | 'small' | 'mini'
- `type`: 'default' | 'secondary' | 'assist' | 'link' | 'danger' | 'success' | 'progress' | 'white'
- `italic`, `deleteLine`, `underline`, `strong`, `strongLevel`, `disabled`, `ellipsis`
- `onPress` 事件
- `style` 中的所有原有属性
- `Title` 组件的 `level` 属性

### 新增功能
- `style` 属性新增支持 `width` 和 `height`，可以更灵活地控制文本容器尺寸

### 迁移步骤
1. 全局搜索 `@sgfe/flower-rn` 中的 `Typography` 使用
2. 替换导入语句：`import { Typography } from '@sfe/wand-rn'`
3. 搜索并替换 `size="xxxxl"` → `size="xxxl"`
4. 搜索并替换 `size="xxl"` → `size="xl"`
5. 搜索 `type="icon"` 并根据实际情况替换为 `type="link"` 或自定义颜色
6. 测试所有使用场景，确保样式符合预期
