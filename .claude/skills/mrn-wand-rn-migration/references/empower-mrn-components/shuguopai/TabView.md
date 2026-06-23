# TabView 标签页

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`
- **目标组件**: `SwitchTab`

## 组件用途对比

**旧组件 TabView**: 完整的标签页组件，包含标签栏（TabBar）和可滑动的内容面板（ViewPager），支持手势滑动切换页面，适用于多页面内容展示场景。

**新组件 SwitchTab**: 纯粹的标签切换器组件，只提供标签按钮的切换功能，不包含内容面板，适用于同一行为多种状态之间的快速切换，如筛选条件切换。

## 重要说明

⚠️ **TabView 和 SwitchTab 并非直接替代关系**，两者设计用途不同：

- **TabView** = TabBar（标签栏）+ ViewPager（内容面板），是完整的标签页解决方案
- **SwitchTab** = 纯标签按钮，仅提供切换功能，需自行管理内容显示

### 迁移策略建议

根据业务场景选择不同的迁移方案：

1. **场景 1：仅需要标签切换功能**（如筛选器、状态切换）
   - 直接使用 `SwitchTab`
   
2. **场景 2：需要标签页 + 内容面板**（如多页面展示）
   - 使用 `SwitchTab` + 条件渲染内容
   - 或使用 `SwitchTab` + 第三方 ViewPager 库

## 旧组件 API

```tsx
// TabView 组件
interface TabViewProps {
    locked?: boolean  // 是否锁定滚动
    initialPage?: number  // 初始选中页
    page?: number  // 受控选中页
    contentProps?: object  // ViewPager 属性
    prerenderingSiblingsNumber?: number  // 预渲染相邻页数
    scrollWithoutAnimation?: boolean  // 滚动时无动画
    maxShowTabCount?: number  // 最多显示 Tab 数
    tabWidth?: number  // Tab 宽度
    underlineHeight?: number  // 下划线高度
    
    // TabBar 样式相关
    tabBarSize?: 'lg' | 'md' | 'sm' | number
    tabBarBackgroundColor?: string
    tabBarActiveTextColor?: string
    tabBarInactiveTextColor?: string
    tabBarUnderlineGradientColors?: string[]
    tabBarTextStyle?: StyleProp<TextStyle>
    tabBarStyle?: StyleProp<ViewStyle>
    tabBarUnderlineStyle?: StyleProp<ViewStyle>
    tabBarMaskStyle?: StyleProp<ImageStyle>
    
    children: ReactNode  // TabPane 子元素
    style?: StyleProp<ViewStyle>
    renderTabBar?: false | ((props: TabBarProps) => ReactElement)
    onScroll?: (page: number) => void  // 滚动回调
    onChangeTab?: (event: { i: number, from: number }) => void
}

// TabPane 组件
interface TabPaneProps {
    tab: string | ReactElement  // Tab 标签内容
    badge?: string | number | ReactElement  // 角标
    children: ReactNode  // 面板内容
}

// 使用方式
<TabView page={currentPage} onChangeTab={(e) => setPage(e.i)}>
    <TabPane tab="标签1" badge={10}>
        <View>内容1</View>
    </TabPane>
    <TabPane tab="标签2">
        <View>内容2</View>
    </TabPane>
</TabView>
```

## 新组件 API

```tsx
interface SwitchTabItemType {
    value: number | string  // 标签值
    label: string  // 标签文本
}

interface SwitchTabProps {
    items: SwitchTabItemType[]  // 标签项数组
    size?: 'L' | 'S'  // 大小：L=大, S=小，默认 'L'
    value?: number | string  // 当前选中值
    disabled?: boolean  // 是否禁用
    style?: StyleProp<ViewStyle>  // 外层容器样式
    itemStyle?: StyleProp<ViewStyle>  // 标签项样式
    onChange?: (value: number | string, index: number) => void
}

// 使用方式
<SwitchTab
    items={[
        { label: '标签1', value: 1 },
        { label: '标签2', value: 2 }
    ]}
    value={currentValue}
    onChange={(value, index) => setCurrentValue(value)}
/>
```

## 迁移对照表

| 旧属性/功能 | 新属性 | 说明 |
|------------|--------|------|
| TabPane.tab | items[].label | Tab 标签文本，需转换为 items 数组 |
| TabPane.badge | （无） | 新组件不支持角标，需自行实现 |
| page | value | 选中项标识，旧组件用索引，新组件用 value |
| initialPage | value（初始值） | 初始选中项 |
| onChangeTab | onChange | 回调函数，参数格式不同 |
| tabBarSize | size | 尺寸属性，值格式变更：lg/md/sm → L/S |
| tabBarStyle | style | 样式属性 |
| （无对应） | itemStyle | 新增：单个标签项样式 |
| locked | （无） | 新组件无内容面板，无需此属性 |
| renderTabBar | （无） | 新组件无法自定义渲染 |
| tabBarActiveTextColor | （通过主题定制） | 新组件通过主题系统控制 |
| tabBarInactiveTextColor | （通过主题定制） | 新组件通过主题系统控制 |
| tabBarUnderlineStyle | （无） | 新组件无下划线，改为背景色切换 |
| maxShowTabCount | （无） | 新组件不支持滚动，建议 2-3 个标签 |
| onScroll | （无） | 新组件无滚动功能 |
| TabPane children | （需自行实现） | 新组件不包含内容面板 |

## 迁移示例

### 案例 1：简单标签切换（仅 TabBar 功能）

```tsx
// 迁移前
const [page, setPage] = useState(0)

<TabView 
    page={page} 
    onChangeTab={(e) => setPage(e.i)}
    renderTabBar={(props) => <TabBar {...props} />}  // 仅使用 TabBar
>
    <TabPane tab="全部" />
    <TabPane tab="待处理" />
    <TabPane tab="已完成" />
</TabView>

// 手动渲染内容
{page === 0 && <AllContent />}
{page === 1 && <PendingContent />}
{page === 2 && <CompletedContent />}

// 迁移后
const [value, setValue] = useState('all')

<SwitchTab
    items={[
        { label: '全部', value: 'all' },
        { label: '待处理', value: 'pending' },
        { label: '已完成', value: 'completed' }
    ]}
    value={value}
    onChange={(val) => setValue(val)}
/>

{value === 'all' && <AllContent />}
{value === 'pending' && <PendingContent />}
{value === 'completed' && <CompletedContent />}
```

### 案例 2：完整标签页（TabBar + 内容面板）

```tsx
// 迁移前
<TabView 
    initialPage={0}
    tabBarSize="lg"
    onChangeTab={(e) => console.log('切换到', e.i)}
>
    <TabPane tab="待拣货" badge={5}>
        <View><Text>待拣货内容</Text></View>
    </TabPane>
    <TabPane tab="待配送" badge={10}>
        <View><Text>待配送内容</Text></View>
    </TabPane>
    <TabPane tab="已完成">
        <View><Text>已完成内容</Text></View>
    </TabPane>
</TabView>

// 迁移后（方案 1：条件渲染）
const [activeTab, setActiveTab] = useState('pick')

<View>
    <SwitchTab
        size="L"
        items={[
            { label: '待拣货', value: 'pick' },
            { label: '待配送', value: 'deliver' },
            { label: '已完成', value: 'done' }
        ]}
        value={activeTab}
        onChange={(value) => {
            setActiveTab(value)
            console.log('切换到', value)
        }}
    />
    
    {/* 自行管理内容显示 */}
    <View style={{ flex: 1 }}>
        {activeTab === 'pick' && <View><Text>待拣货内容</Text></View>}
        {activeTab === 'deliver' && <View><Text>待配送内容</Text></View>}
        {activeTab === 'done' && <View><Text>已完成内容</Text></View>}
    </View>
</View>

// 注意：角标需要自行实现
// 可以通过在 label 中添加角标数字，或使用 Badge 组件叠加
```

### 案例 3：自定义样式和尺寸

```tsx
// 迁移前
<TabView
    tabBarSize="sm"
    tabBarBackgroundColor="#F5F6FA"
    tabBarActiveTextColor="#FF6600"
    tabBarInactiveTextColor="#999999"
    tabBarStyle={{ marginHorizontal: 16 }}
>
    <TabPane tab="选项1"><View /></TabPane>
    <TabPane tab="选项2"><View /></TabPane>
</TabView>

// 迁移后
<SwitchTab
    size="S"
    items={[
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 }
    ]}
    style={{ marginHorizontal: 16 }}
    // 注意：文字颜色通过主题系统定制，无法直接设置
/>
```

### 案例 4：带角标的标签

```tsx
// 迁移前
<TabView>
    <TabPane tab="待处理" badge={99}>
        <View />
    </TabPane>
    <TabPane tab="已完成" badge={<CustomBadge />}>
        <View />
    </TabPane>
</TabView>

// 迁移后（需自行实现角标）
// 方案 1：在 label 中包含角标数字
<SwitchTab
    items={[
        { label: '待处理(99)', value: 'pending' },
        { label: '已完成', value: 'done' }
    ]}
/>

// 方案 2：使用绝对定位叠加 Badge 组件
<View style={{ position: 'relative' }}>
    <SwitchTab
        items={[
            { label: '待处理', value: 'pending' },
            { label: '已完成', value: 'done' }
        ]}
    />
    {/* 使用绝对定位添加角标 */}
    <Badge 
        text={99} 
        style={{ position: 'absolute', top: 2, left: 60 }} 
    />
</View>
```

### 案例 5：禁用状态

```tsx
// 迁移前
<TabView locked={true}>  {/* locked 锁定滚动，但标签仍可点击 */}
    <TabPane tab="标签1"><View /></TabPane>
    <TabPane tab="标签2"><View /></TabPane>
</TabView>

// 迁移后
<SwitchTab
    disabled={true}  // 禁用所有标签点击
    items={[
        { label: '标签1', value: 1 },
        { label: '标签2', value: 2 }
    ]}
/>
```

## 关键点

### 必需改动

1. **数据结构转换**: 从 `TabPane` 子组件模式转换为 `items` 数组配置
   ```tsx
   // 旧：子组件模式
   <TabView>
       <TabPane tab="标签1" />
       <TabPane tab="标签2" />
   </TabView>
   
   // 新：数组配置
   <SwitchTab items={[
       { label: '标签1', value: 1 },
       { label: '标签2', value: 2 }
   ]} />
   ```

2. **状态管理变更**: 从索引（index）切换到值（value）
   ```tsx
   // 旧：使用索引
   page={0}  // 第一个标签
   
   // 新：使用 value
   value={1}  // value 为 1 的标签
   ```

3. **回调函数签名变更**:
   ```tsx
   // 旧：onChangeTab 返回对象
   onChangeTab={(e) => {
       console.log(e.i, e.from)  // 当前索引, 来源索引
   }}
   
   // 新：onChange 返回值和索引
   onChange={(value, index) => {
       console.log(value, index)  // 当前值, 当前索引
   }}
   ```

4. **内容面板需自行实现**: 新组件不包含 ViewPager，需手动管理内容显示

### 功能差异

| 功能 | TabView | SwitchTab |
|------|---------|-----------|
| 标签栏 | ✅ | ✅ |
| 内容面板 | ✅ ViewPager | ❌ 需自行实现 |
| 手势滑动切换 | ✅ | ❌ |
| 标签滚动 | ✅ maxShowTabCount | ❌ 固定宽度 |
| 角标 | ✅ | ❌ 需自行实现 |
| 下划线 | ✅ | ❌ 改为背景色 |
| 自定义渲染 | ✅ renderTabBar | ❌ |
| 主题支持 | ❌ | ✅ |
| 适用场景 | 多页面内容展示 | 状态/筛选切换 |

### 样式变化

```tsx
// 旧组件：卡片式标签 + 下划线
// 外观：┌─标签1─┐ ┌─标签2─┐
//       ￣￣￣￣

// 新组件：胶囊式切换器
// 外观：┌────────────┐
//      │ [标签1] 标签2 │  // 选中项有白色背景
//      └────────────┘
```

### 尺寸对照

| 旧组件 size | 新组件 size | 说明 |
|------------|------------|------|
| lg | L | 大尺寸 |
| md | L | 中等尺寸（新组件无中间档） |
| sm | S | 小尺寸 |
| number | （无） | 新组件不支持数字尺寸 |

**新组件尺寸规格**:
- `size="L"`: 高度 28，字号 14，宽度 90（2个）/ 78（3个）
- `size="S"`: 高度 25，字号 12，宽度 84（2个）/ 72（3个）

### 推荐迁移步骤

1. **评估业务场景**
   - 如仅需标签切换 → 直接使用 SwitchTab
   - 如需内容面板 → 准备内容管理方案

2. **转换数据结构**
   - 提取 TabPane 的 tab 属性到 items 数组
   - 为每个标签分配唯一 value

3. **改造状态管理**
   - 将 page（索引）改为 value（值）
   - 更新 onChange 回调逻辑

4. **处理内容面板**（如需要）
   - 使用条件渲染：`{value === 'x' && <Content />}`
   - 或使用第三方库：如 `react-native-pager-view`

5. **处理角标**（如需要）
   - 在 label 中包含角标文本
   - 或使用绝对定位叠加 Badge 组件

6. **调整样式**
   - 适配新组件的胶囊式设计
   - 通过主题系统定制颜色

7. **测试交互**
   - 验证切换逻辑
   - 确认样式表现

### 不支持的功能及替代方案

| 旧功能 | 替代方案 |
|--------|---------|
| 手势滑动切换页面 | 使用第三方 ViewPager 库 + SwitchTab |
| 标签滚动（多于3个标签） | 建议重新设计 UI，或使用下拉选择 |
| 自定义 TabBar 渲染 | 直接自行实现标签切换组件 |
| 角标 | 在 label 中包含数字或叠加 Badge |
| 渐变色下划线 | 新组件采用胶囊式设计，无下划线 |
| 滚动监听 | 无需此功能（无滚动内容） |

### 注意事项

1. **设计风格变化**: 从卡片式标签页变为胶囊式切换器，需与设计师确认
2. **标签数量限制**: SwitchTab 适合 2-3 个标签，更多标签建议使用其他组件
3. **颜色定制**: 新组件依赖主题系统，无法像旧组件那样直接传入颜色属性
4. **性能考虑**: 使用条件渲染时，建议配合 `React.memo` 优化性能
5. **无滑动手势**: 如用户习惯滑动切换，需额外添加手势支持或引导用户点击标签
