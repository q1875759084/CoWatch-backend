# GridView 网格视图

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface GridViewProps extends ScrollViewProps {
    data?: any[]
    fillMissingItems?: boolean  // 默认 true，是否填充缺失的项以完成行
    itemsPerRow: number  // 每行的项目数（必填）
    itemsPerRowLandscape?: number  // 横屏时每行项目数
    itemsPerRowPortrait?: number  // 竖屏时每行项目数
    renderItem: (item: any, index: number) => ReactNode  // 渲染单个项目
    style?: StyleProp<ViewStyle>
    itemStyle?: StyleProp<ViewStyle>  // 每个项目的样式
    rowStyle?: StyleProp<ViewStyle>  // 行的样式
    contentContainerStyle?: StyleProp<ViewStyle>
    listKey?: string
}
```

## 新组件 API

新的网格系统采用 **Row（行）和 Col（列）** 的 12 栅格设计模式：

```tsx
// Row 组件
interface RowProps {
    gutter?: Gutter | Gutter[]  // 栅格间隔，或 [水平间距, 垂直间距]
    align?: 'top' | 'middle' | 'bottom' | 'stretch'  // 默认 'top'，垂直对齐方式
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'  // 默认 'start'，水平排列
    wrap?: boolean  // 默认 true，是否自动换行
    style?: ViewStyle
    children?: React.ReactNode
}

// Col 组件
interface ColProps {
    span?: number  // 占用的栅格数（1-12，总和最多 12）
    offset?: number  // 左侧间隔格数
    push?: number  // 向右移动格数
    pull?: number  // 向左移动格数
    flex?: number  // flex 布局属性
    style?: ViewStyle
    children?: React.ReactNode
}

// Gutter 类型（单位：px）
type Gutter = '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl' | number
// Gutter 大小对应：
// '2xs': 4,  'xs': 8,  's': 16,  'm': 24,
// 'l': 28,   'xl': 32, '2xl': 40, '3xl': 48
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| GridView（组件） | Row + Col（组件组合） | 从单一组件改为组合模式 |
| data | 无 | 数据管理转移到上层，不再由组件处理 |
| itemsPerRow | span 属性 | 12 栅格中 Col 的 span = 12 / itemsPerRow |
| itemsPerRowLandscape | 业务层处理 | 使用响应式 span 计算或条件渲染 |
| itemsPerRowPortrait | 业务层处理 | 使用响应式 span 计算或条件渲染 |
| renderItem | children | 内容直接放在 Col 的 children 中 |
| itemStyle | 无 | 样式直接写在 children 中的 View |
| rowStyle | 无 | 样式通过 Row 的 style 属性设置 |
| fillMissingItems | 无 | 新系统自动处理，不需要填充 |
| gutter（间隔控制） | gutter 属性 | Row 的 gutter 自动处理间隔分配 |

## 迁移示例

### 案例 1：基础网格 - 一行三列

```tsx
// 迁移前
<GridView
    data={data}
    itemsPerRow={3}
    renderItem={(item, itemID) => (
        <View key={itemID} style={styles.gridWrap}>
            <Text>{item.name}</Text>
        </View>
    )}
    contentContainerStyle={styles.tagsWrap}
/>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row style={styles.tagsWrap}>
    {data.map((item, index) => (
        <Col key={index} span={4}>
            <View style={styles.gridWrap}>
                <Text>{item.name}</Text>
            </View>
        </Col>
    ))}
</Row>
```

**说明**: 
- `itemsPerRow={3}` 转换为 `span={4}`（12 ÷ 3 = 4）
- 数据遍历由组件内部改为外部 map
- `contentContainerStyle` 改为 `Row` 的 `style`

### 案例 2：带间隔的网格布局

```tsx
// 迁移前
<GridView
    data={data}
    itemsPerRow={4}
    renderItem={(item, itemID) => (
        <View key={itemID} style={styles.gridItem}>
            <Text>{item.name}</Text>
        </View>
    )}
    contentContainerStyle={styles.container}
    itemStyle={{ margin: 4 }}
/>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row gutter={8} style={styles.container}>
    {data.map((item, index) => (
        <Col key={index} span={3}>
            <View style={styles.gridItem}>
                <Text>{item.name}</Text>
            </View>
        </Col>
    ))}
</Row>
```

**说明**:
- `itemsPerRow={4}` 转换为 `span={3}`（12 ÷ 4 = 3）
- `itemStyle={{ margin: 4 }}` 中的间隔改为 Row 的 `gutter={8}`（左右各 4）
- Row 自动处理 gutter 的分配和计算

### 案例 3：响应式网格 - 横竖屏适配

```tsx
// 迁移前
<GridView
    data={data}
    itemsPerRow={3}
    itemsPerRowPortrait={3}
    itemsPerRowLandscape={4}
    renderItem={(item, itemID) => (
        <View key={itemID} style={styles.gridItem}>
            <Text>{item.name}</Text>
        </View>
    )}
/>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'
import { Dimensions, useWindowDimensions } from '@mrn/react-native'

const YourComponent = ({ data }) => {
    const { width, height } = useWindowDimensions()
    const isLandscape = width > height
    const colSpan = isLandscape ? 3 : 4  // 横屏 4 列，竖屏 3 列

    return (
        <Row gutter={8}>
            {data.map((item, index) => (
                <Col key={index} span={colSpan}>
                    <View style={styles.gridItem}>
                        <Text>{item.name}</Text>
                    </View>
                </Col>
            ))}
        </Row>
    )
}
```

**说明**:
- 使用 `useWindowDimensions` 获取屏幕方向
- 动态计算 `span` 值
- 业务层负责响应式逻辑

### 案例 4：不等宽网格（使用 flex）

```tsx
// 迁移前
<GridView
    data={data}
    itemsPerRow={2}
    renderItem={(item, itemID) => (
        <View key={itemID} style={styles.gridItem}>
            <Text>{item.name}</Text>
        </View>
    )}
/>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

// 方式一：使用 flex 平均分配
<Row gutter={12}>
    {data.map((item, index) => (
        <Col key={index} flex={1}>
            <View style={styles.gridItem}>
                <Text>{item.name}</Text>
            </View>
        </Col>
    ))}
</Row>

// 方式二：使用不同的 span 组合
<Row gutter={12}>
    <Col span={6}><View style={styles.gridItem}><Text>Item 1</Text></View></Col>
    <Col span={4}><View style={styles.gridItem}><Text>Item 2</Text></View></Col>
    <Col span={2}><View style={styles.gridItem}><Text>Item 3</Text></View></Col>
</Row>
```

**说明**:
- 使用 `flex` 属性可实现等宽灵活布局
- 使用不同的 `span` 可以实现不等宽布局

### 案例 5：多行多列网格

```tsx
// 迁移前
const renderGridItem = (item: Item, itemID: number) => {
    return (
        <View key={itemID} style={[styles.gridWrap, { aspectRatio: 1 }]}>
            <Text style={styles.tagText}>{item.name}</Text>
        </View>
    )
}

<GridView
    data={data}
    itemsPerRow={4}
    renderItem={renderGridItem}
    contentContainerStyle={styles.tagsWrap}
/>

// 迁移后
import { Row, Col } from '@sfe/wand-rn'

<Row gutter={12} style={styles.tagsWrap}>
    {data.map((item, index) => (
        <Col key={index} span={3}>
            <View style={[styles.gridWrap, { aspectRatio: 1 }]}>
                <Text style={styles.tagText}>{item.name}</Text>
            </View>
        </Col>
    ))}
</Row>
```

## 关键迁移点

1. **架构转变**
   - 从 `GridView` 单一组件转换为 `Row + Col` 组合模式
   - 数据驱动逻辑从组件内部移到上层业务代码

2. **栅格计算**
   - 新系统使用 12 栅格，`span` 值 = 12 ÷ 每行项目数
   - 例如：3 列 = span={4}，4 列 = span={3}，6 列 = span={2}

3. **间隔处理**
   - `Row` 的 `gutter` 属性自动处理左右和上下间隔
   - 传单个值表示水平间隔，传数组 `[h, v]` 表示水平和垂直间隔
   - 间隔可用 px 数值或预设字符串如 `'xs'` `'m'` `'xl'` 等

4. **响应式适配**
   - 旧系统通过 `itemsPerRowLandscape/Portrait` 实现
   - 新系统需在业务层使用 `useWindowDimensions` 动态计算 `span`

5. **样式管理**
   - 项目样式直接写在 children View 中
   - Row 和 Col 通过各自的 `style` 属性设置
   - 不再需要 `itemStyle` 和 `rowStyle` 分别配置

6. **自动填充**
   - 旧系统的 `fillMissingItems` 不再需要
   - 新系统自动处理行尾空白，无需手动填充

## 常见问题

### Q: 如何实现旧的 `itemsPerRow={3}` 效果？
A: 使用 `<Col span={4}>`，因为 12 ÷ 3 = 4

### Q: 旧系统中的 `fillMissingItems` 如何处理？
A: 新系统会自动处理，无需手动填充空项

### Q: 如何处理不同屏幕尺寸的响应式布局？
A: 在上层组件中使用 `useWindowDimensions()` 或屏幕方向监听，动态计算 `span` 值

### Q: 旧系统中的 `renderItem` 的第二个参数 itemID 如何获取？
A: 在 map 函数中直接使用 `index` 参数

## 迁移检查清单

- [ ] 将 `GridView` 导入改为 `import { Row, Col } from '@sfe/wand-rn'`
- [ ] 将 `<GridView data={...}>` 改为 `<Row><Col>...` 结构
- [ ] 计算每个 Col 的 `span` 值（12 ÷ itemsPerRow）
- [ ] 将 `renderItem` 回调改为 `map` 遍历
- [ ] 移除 `fillMissingItems` 属性
- [ ] 将 `itemStyle` 移到 children View 的 style
- [ ] 将 `rowStyle` 改为 Row 的 style
- [ ] 使用 Row 的 `gutter` 替代 itemStyle 中的 margin
- [ ] 如果有横竖屏适配，添加 `useWindowDimensions` 响应式逻辑
- [ ] 测试网格布局是否正确
- [ ] 测试各种屏幕尺寸和方向

