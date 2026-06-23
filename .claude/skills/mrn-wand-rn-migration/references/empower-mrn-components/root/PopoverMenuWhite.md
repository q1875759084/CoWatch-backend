# PopoverMenuWhite 白色气泡菜单

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
import { PopoverMenuWhite } from '@mtfe/empower-mrn-components'

// PopoverMenuWhite 是 PopoverMenu 的白色主题变体
// 继承 PopoverMenuProps，并预设白色背景样式

interface PopoverMenuProps {
    style?: StyleProp<ViewStyle>
    anchor: ReactElement                          // 必填，锚点元素（触发弹出的组件）
    xPos?: PopoverPosition | number               // X 轴定位
    yPos?: PopoverPosition | number               // Y 轴定位
    overlay?: string                              // 遮罩颜色
    visible?: boolean                             // 控制显隐
    menuItems: IconTextProps[]                     // 必填，菜单项数组（支持图标+文字）
    hideArrow?: boolean                           // 是否隐藏箭头，默认 false
    arrowAlign?: 'top' | 'bottom' | 'left' | 'right'  // 箭头方向，默认 'top'
    arrowStyle?: StyleProp<ViewStyle>             // 箭头样式
    anchorStyle?: StyleProp<ViewStyle>            // 锚点样式
    itemStyle?: StyleProp<ViewStyle>              // 菜单项样式
    itemDividerBorder?: StyleProp<ViewStyle>      // 菜单项分割线样式
    menuStyle?: StyleProp<ViewStyle>              // 菜单容器样式
    onDismiss?: () => void                        // 关闭回调
    onShow?: () => void                           // 显示回调
    onItemPress?: (index: number) => void         // 菜单项点击回调
}

// IconTextProps（菜单项数据结构）
interface IconTextProps {
    text: string                                  // 菜单文字
    type?: string                                 // 图标类型
    icon?: ImageSourcePropType                    // 自定义图标
    // ...其他 IconText 组件属性
}

// PopoverMenuWhite 内部预设样式：
// - 白色背景 + 浅色边框
// - 阴影效果（shadowColor: #000, shadowOpacity: 0.4）
// - 固定宽度 122
// - hideArrow 默认为 true

// 使用示例
<PopoverMenuWhite
  anchor={<Icon type="ellipsis" />}
  visible={showMenu}
  menuItems={[
    { text: '编辑', type: 'edit-o' },
    { text: '删除', type: 'delete-o' },
    { text: '分享', type: 'share-o' },
  ]}
  onItemPress={(index) => handleAction(index)}
  onDismiss={() => setShowMenu(false)}
/>
```

## 新组件 API

```tsx
import { Popover } from '@sfe/wand-rn'

interface PopoverProps {
    onSelect?: (value: any, index?: number) => void  // 选项选中回调
    options: Array<{ label: string; value: number | string }>  // 必填，选项列表
    calculateStatusBar?: boolean            // 是否计算状态栏高度（Android 子容器场景）
    renderOverlayComponent?: (             // 自定义遮罩层渲染
        node: React.ReactNode,
        closePopover: () => void
    ) => React.ReactNode
    placement?: 'top' | 'bottom'           // 弹出方向，默认 'bottom'
    onClose?: () => void                   // 关闭回调
    children: React.ReactNode              // 触发元素（锚点）
    styles?: Partial<PopoverStyle>         // 主题样式覆盖
}

// PopoverStyle（可覆盖的样式）
interface PopoverStyle {
    container: ViewStyle
    item: ViewStyle
    itemText: TextStyle
    separator: ViewStyle
    // ...
}

// 使用示例
<Popover
  options={[
    { label: '编辑', value: 'edit' },
    { label: '删除', value: 'delete' },
    { label: '分享', value: 'share' },
  ]}
  onSelect={(value, index) => handleAction(value)}
  onClose={() => {}}
  placement="bottom"
>
  <Icon type="ellipsis" />
</Popover>
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| anchor | children | 锚点元素，从 prop 改为 children 传入 |
| visible | - | 移除，新组件内部管理显隐（点击 children 触发） |
| menuItems | options | 数据结构变更：IconTextProps[] → {label, value}[] |
| onItemPress(index) | onSelect(value, index) | 回调参数变更，新增 value 参数 |
| onDismiss | onClose | 属性名变更 |
| onShow | - | 移除 |
| xPos / yPos | - | 移除，新组件自动计算位置 |
| overlay | renderOverlayComponent | 从颜色字符串改为渲染函数 |
| hideArrow | - | 移除，箭头由主题控制 |
| arrowAlign | placement | 简化为 'top' \| 'bottom' |
| arrowStyle | styles | 改为主题样式系统 |
| menuStyle | styles | 改为主题样式系统 |
| itemStyle | styles | 改为主题样式系统 |
| itemDividerBorder | styles | 改为主题样式系统 |
| anchorStyle | - | 移除 |
| style | - | 移除 |

## 关键变更

### 1. 锚点元素传递方式

旧组件通过 `anchor` prop 传递，新组件通过 `children` 传递：

```tsx
// 旧
<PopoverMenuWhite anchor={<Button>菜单</Button>} ... />

// 新
<Popover ...>
  <Button>菜单</Button>
</Popover>
```

### 2. 显隐控制方式

旧组件需要外部管理 `visible` 状态，新组件内部自动管理（点击 children 打开，点击选项或遮罩关闭）。

### 3. 菜单项数据结构

旧组件使用 `IconTextProps[]`（支持图标+文字），新组件使用 `{label, value}[]`（仅文字）：

```tsx
// 旧 - 支持图标
menuItems={[
  { text: '编辑', type: 'edit-o' },
  { text: '删除', type: 'delete-o' },
]}

// 新 - 仅文字
options={[
  { label: '编辑', value: 'edit' },
  { label: '删除', value: 'delete' },
]}
```

### 4. 图标支持移除

新组件的菜单项仅支持纯文字，不支持图标。如需图标，可通过 `renderOverlayComponent` 自定义渲染。

### 5. 回调参数变更

旧组件 `onItemPress` 仅返回 index，新组件 `onSelect` 返回 value 和 index：

```tsx
// 旧
onItemPress={(index) => {
  if (index === 0) doEdit()
  if (index === 1) doDelete()
}}

// 新
onSelect={(value) => {
  if (value === 'edit') doEdit()
  if (value === 'delete') doDelete()
}}
```

### 6. 定位机制

旧组件支持精确的 xPos/yPos 定位，新组件使用 PopoverController 自动计算位置，仅支持 `placement: 'top' | 'bottom'`。

### 7. 样式系统

旧组件使用内联样式 props（menuStyle, itemStyle 等），新组件使用主题样式系统（WithThemeStyles）。

## 迁移示例

### 案例 1：基础菜单

```tsx
// 迁移前
<PopoverMenuWhite
  anchor={<Icon type="ellipsis" size={20} />}
  visible={showMenu}
  menuItems={[
    { text: '编辑' },
    { text: '删除' },
  ]}
  onItemPress={(index) => {
    if (index === 0) handleEdit()
    if (index === 1) handleDelete()
    setShowMenu(false)
  }}
  onDismiss={() => setShowMenu(false)}
/>

// 迁移后
<Popover
  options={[
    { label: '编辑', value: 'edit' },
    { label: '删除', value: 'delete' },
  ]}
  onSelect={(value) => {
    if (value === 'edit') handleEdit()
    if (value === 'delete') handleDelete()
  }}
>
  <Icon type="ellipsis" size={20} />
</Popover>
```

### 案例 2：带图标的菜单（需要适配）

```tsx
// 迁移前
<PopoverMenuWhite
  anchor={<Text>更多操作</Text>}
  visible={showMenu}
  menuItems={[
    { text: '编辑', type: 'edit-o' },
    { text: '删除', type: 'delete-o' },
    { text: '分享', type: 'share-o' },
  ]}
  onItemPress={handleAction}
  onDismiss={() => setShowMenu(false)}
/>

// 迁移后 - 无图标（直接迁移）
<Popover
  options={[
    { label: '编辑', value: 'edit' },
    { label: '删除', value: 'delete' },
    { label: '分享', value: 'share' },
  ]}
  onSelect={(value, index) => handleAction(value)}
>
  <Text>更多操作</Text>
</Popover>
```

### 案例 3：指定弹出方向

```tsx
// 迁移前
<PopoverMenuWhite
  anchor={<Button title="操作" />}
  visible={visible}
  arrowAlign="bottom"
  menuItems={items}
  onItemPress={handlePress}
  onDismiss={dismiss}
/>

// 迁移后
<Popover
  options={items.map(i => ({ label: i.text, value: i.text }))}
  onSelect={handlePress}
  placement="top"
>
  <Button title="操作" />
</Popover>
```

### 案例 4：自定义遮罩

```tsx
// 迁移前
<PopoverMenuWhite
  anchor={<Icon type="ellipsis" />}
  visible={visible}
  overlay="rgba(0,0,0,0.3)"
  menuItems={items}
  onItemPress={handlePress}
  onDismiss={dismiss}
/>

// 迁移后
<Popover
  options={items.map(i => ({ label: i.text, value: i.text }))}
  onSelect={handlePress}
  renderOverlayComponent={(node, close) => (
    <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', flex: 1 }}>
      {node}
    </View>
  )}
>
  <Icon type="ellipsis" />
</Popover>
```

### 案例 5：列表行末尾操作菜单

```tsx
// 迁移前
const renderActions = (item) => (
  <PopoverMenuWhite
    anchor={<Icon type="ellipsis" size={16} tintColor="#666" />}
    visible={activeId === item.id}
    menuItems={[
      { text: '查看详情' },
      { text: '编辑' },
      { text: '删除' },
    ]}
    onItemPress={(index) => {
      handleAction(item.id, index)
      setActiveId(null)
    }}
    onDismiss={() => setActiveId(null)}
  />
)

// 迁移后
const renderActions = (item) => (
  <Popover
    options={[
      { label: '查看详情', value: 'detail' },
      { label: '编辑', value: 'edit' },
      { label: '删除', value: 'delete' },
    ]}
    onSelect={(value) => handleAction(item.id, value)}
  >
    <Icon type="ellipsis" size={16} color="#666" />
  </Popover>
)
```

### 案例 6：单个操作项

```tsx
// 迁移前
<PopoverMenuWhite
  anchor={<Icon type="setting" />}
  visible={showSetting}
  menuItems={[{ text: '设置' }]}
  onItemPress={() => {
    openSettings()
    setShowSetting(false)
  }}
  onDismiss={() => setShowSetting(false)}
/>

// 迁移后
<Popover
  options={[{ label: '设置', value: 'settings' }]}
  onSelect={() => openSettings()}
>
  <Icon type="set-up" />
</Popover>
```

### 案例 7：受控显隐迁移

```tsx
// 迁移前 - 外部控制 visible
const [showMenu, setShowMenu] = useState(false)

<TouchableOpacity onPress={() => setShowMenu(true)}>
  <Text>打开菜单</Text>
</TouchableOpacity>

<PopoverMenuWhite
  anchor={<View />}
  visible={showMenu}
  menuItems={menuData}
  onItemPress={handlePress}
  onDismiss={() => setShowMenu(false)}
/>

// 迁移后 - 新组件自动管理显隐，点击 children 即可打开
<Popover
  options={menuData.map(m => ({ label: m.text, value: m.text }))}
  onSelect={handlePress}
>
  <Text>打开菜单</Text>
</Popover>
```

### 案例 8：menuItems 转换工具函数

```tsx
// 如果项目中有大量 menuItems 数据需要转换，可以使用工具函数：

// 转换函数
const convertMenuItems = (menuItems: IconTextProps[]) =>
  menuItems.map((item, index) => ({
    label: item.text,
    value: item.type || String(index),
  }))

// 使用
<Popover
  options={convertMenuItems(oldMenuItems)}
  onSelect={(value) => handleSelect(value)}
>
  {anchorElement}
</Popover>
```

### 案例 9：自定义样式迁移

```tsx
// 迁移前
<PopoverMenuWhite
  anchor={<Text>菜单</Text>}
  visible={visible}
  menuStyle={{ width: 150 }}
  itemStyle={{ paddingHorizontal: 16 }}
  menuItems={items}
  onItemPress={handlePress}
  onDismiss={dismiss}
/>

// 迁移后 - 使用 styles 主题覆盖
<Popover
  options={items.map(i => ({ label: i.text, value: i.text }))}
  onSelect={handlePress}
  styles={{
    container: { width: 150 },
    item: { paddingHorizontal: 16 },
  }}
>
  <Text>菜单</Text>
</Popover>
```

### 案例 10：onItemPress index 到 value 的迁移

```tsx
// 迁移前 - 基于 index 判断
const actions = ['edit', 'delete', 'share']

<PopoverMenuWhite
  anchor={<Icon type="ellipsis" />}
  visible={visible}
  menuItems={actions.map(a => ({ text: a }))}
  onItemPress={(index) => dispatch({ type: actions[index] })}
  onDismiss={() => setVisible(false)}
/>

// 迁移后 - 基于 value 判断，更清晰
<Popover
  options={actions.map(a => ({ label: a, value: a }))}
  onSelect={(value) => dispatch({ type: value })}
>
  <Icon type="ellipsis" />
</Popover>
```

## 关键点

- **锚点传递方式变更**：`anchor` prop → `children`。
- **显隐自动管理**：新组件内部管理显隐状态，移除外部 `visible` 控制。
- **menuItems → options**：数据结构从 `IconTextProps[]` 变为 `{label, value}[]`。
- **图标支持移除**：新组件菜单项仅支持纯文字。
- **回调语义变更**：`onItemPress(index)` → `onSelect(value, index)`，推荐用 value 做判断。
- **定位简化**：xPos/yPos 精确定位 → placement 方向控制。
- **样式系统变更**：内联样式 props → WithThemeStyles 主题系统。

## 迁移策略

### 第一步：转换数据结构

将 `menuItems` 的 `IconTextProps[]` 转换为 `options` 的 `{label, value}[]`：
- `text` → `label`
- 添加 `value`（可使用 type 或其他唯一标识）

### 第二步：替换组件和锚点

1. 将 `<PopoverMenuWhite anchor={<X />} ...>` 改为 `<Popover ...><X /></Popover>`
2. 移除 `visible` 状态管理代码
3. 移除 `onDismiss` → 如需关闭回调使用 `onClose`

### 第三步：替换回调

将 `onItemPress(index)` 替换为 `onSelect(value, index)`。推荐使用 value 做逻辑判断。

### 第四步：处理图标

如果旧代码依赖菜单项图标，评估是否可以去掉图标。如必须保留，需使用 `renderOverlayComponent` 自定义渲染。

### 第五步：移除不支持的属性

删除 `xPos`、`yPos`、`hideArrow`、`arrowAlign`、`arrowStyle`、`anchorStyle`、`style`、`onShow` 等属性。

### 第六步：验证

- 确认菜单弹出位置正确
- 确认选项点击响应正确
- 确认关闭行为正常
- 确认样式符合预期

## 常见问题

### Q: 旧组件的图标菜单项在新组件中如何实现？
A: 新组件 Popover 的 options 仅支持纯文字。如需图标，可通过 `renderOverlayComponent` 自定义渲染菜单内容，或评估是否可以去掉图标。

### Q: visible 受控模式如何迁移？
A: 新组件内部管理显隐状态，点击 children 自动打开。如果需要编程式控制打开/关闭，需通过 ref 或其他方式实现。

### Q: PopoverMenuWhite 的固定宽度 122 和阴影效果如何保持？
A: 通过 `styles` 属性覆盖：`styles={{ container: { width: 122, elevation: 2, shadowColor: '#000', ... } }}`。

### Q: arrowAlign 的四个方向如何映射到 placement？
A: 新组件仅支持 `placement: 'top' | 'bottom'`。旧组件的 `arrowAlign="top"` 对应 `placement="bottom"`（箭头在上方意味着菜单在锚点下方），`arrowAlign="bottom"` 对应 `placement="top"`。左右方向新组件不支持。

### Q: onItemPress 返回 index，如何优雅地迁移到 onSelect 的 value？
A: 在定义 options 时给每项一个有意义的 value（如 'edit'、'delete'），然后在 onSelect 中基于 value 做逻辑判断。这比基于 index 判断更清晰可维护。

## 注意事项

1. **显隐状态管理变化**：旧组件需外部管理 visible，新组件自动管理。迁移时可删除相关的 useState/setState 代码。
2. **图标丢失**：PopoverMenuWhite 支持图标+文字菜单项，新组件仅支持文字。需与设计确认是否可去掉图标。
3. **定位精度降低**：旧组件支持精确的 x/y 定位，新组件仅支持上/下方向。
4. **主题依赖**：新组件使用 WithThemeStyles，需确保应用已配置 WandRnProvider。
5. **PopoverPosition 类型移除**：旧组件导出的 PopoverPosition 类型在新组件中不再需要。
