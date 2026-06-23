# ActionSheet 行动面板

## 从何处迁移
- **源库**: `@mtfe/empower-fulfillment-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface ActionItem {
    action: string        // 选项的唯一标识
    title: string         // 选项文案
}

interface ActionSheetProps {
    show: boolean                              // 是否展示
    cancelable?: boolean                       // 是否允许通过点击蒙层或返回键进行取消，默认 true
    title?: string                             // 是否展示标题，默认不展示
    actions: ActionItem[]                      // 选项数组
    showCancel?: boolean                       // 是否展示底部取消按钮，默认 true
    showSelection?: boolean                    // 是否展示选中状态，会导致选项向左对齐，默认 false
    selected?: string                          // 当前选中的action
    showSearch?: boolean                       // 展示搜索框，默认 false
    onRequestClose: () => void                 // 取消或点击蒙层时的回调
    onActionClick: (action: string) => void    // 点击选项时的回调
}
```

## 新组件 API

```tsx
interface ActionSheetOptionItem {
    title: string              // 选项文案
    value: any                 // 选项值（任意类型）
    description?: string       // 选项副标题/描述
    color?: string             // 选项文字颜色
    disabled?: boolean         // 是否为禁用状态
    [propName: string]: unknown // 可以扩展其他属性
}

interface ActionSheetProps {
    visible?: boolean                          // 控制行动面板显示/隐藏，默认 false
    options?: ActionSheetOptionItem[]          // 数据源数组，默认 []
    title?: string                             // 头部区域的标题，默认为空
    header?: JSX.Element                       // 自定义头部区域，若设置将覆盖 title
    cancelText?: string                        // 底部区域文案，默认 '取消'
    footer?: JSX.Element                       // 自定义底部区域，若设置将覆盖 cancelText
    maskClosable?: boolean                     // 是否可关闭蒙层，默认 true
    maxCount?: number                          // 最大显示项数，超出部分可滚动，默认 null
    onChange?: (
        value: ActionSheetOptionItem['value'], 
        index: number, 
        item: ActionSheetOptionItem
    ) => void                                  // 选中选择项的回调
    onCancel?: () => void                      // 点击取消的回调
    onClose?: () => void                       // maskClosable 为 true，点击遮罩时的回调
    styles?: WithThemeStyles<ActionSheetStyles> // 自定义样式
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 | 迁移说明 |
|--------|--------|------|---------|
| show | visible | 控制显示/隐藏 | 直接替换，属性名修改 |
| actions | options | 数据源数组 | 需要转换数据结构，详见数据结构转换 |
| action (item) | value (item) | 选项标识值 | 改为选项值，类型可以是任意类型 |
| title (item) | title (item) | 选项文案 | 保持不变 |
| cancelable | maskClosable | 是否允许通过蒙层关闭 | 功能基本相同，但名称及含义略有调整 |
| showCancel | cancelText | 显示取消按钮 | 新组件通过 cancelText 字段控制，为空字符串时不显示 |
| selected | （无对应属性） | 当前选中项 | 新组件无需指定选中状态，通过 onChange 回调处理 |
| showSelection | （无对应属性） | 显示选中状态 | 新组件不支持此功能，若需要可在 header 中自定义实现 |
| showSearch | （无对应属性） | 显示搜索框 | 新组件不内置搜索，需要通过 header 自定义搜索功能 |
| onRequestClose | onClose / onCancel | 关闭时的回调 | onClose 是点击蒙层时的回调，onCancel 是点击取消按钮时的回调 |
| onActionClick | onChange | 点击选项时的回调 | 回调函数签名不同，提供更多信息 |

## 数据结构转换

### 旧组件数据结构
```tsx
const actions = [
    { action: '1', title: '选项一' },
    { action: '2', title: '选项二' },
    { action: '3', title: '删除', special: true }  // 可以有其他自定义字段
]
```

### 新组件数据结构
```tsx
const options = [
    { value: '1', title: '选项一' },
    { value: '2', title: '选项二' },
    { value: '3', title: '删除', color: '#FF192D', description: '删除数据' }  // 支持颜色和描述
]
```

### 转换函数
```tsx
// 如果需要将旧数据结构转换为新的
const convertActions = (actions) => {
    return actions.map(item => ({
        value: item.action,
        title: item.title,
        // 其他字段保持不变
    }))
}
```

## 迁移示例

### 案例 1：基础使用

```tsx
// 迁移前 - 使用状态管理和 show/onRequestClose
export class MyComponent extends PureComponent {
    state = { show: false }
    
    render() {
        return (
            <>
                <Button onPress={() => this.setState({ show: true })}>
                    打开
                </Button>
                <ActionSheet
                    show={this.state.show}
                    actions={[
                        { action: '1', title: '选项一' },
                        { action: '2', title: '选项二' },
                    ]}
                    onActionClick={(action) => {
                        console.log('选择了', action)
                        this.setState({ show: false })
                    }}
                    onRequestClose={() => this.setState({ show: false })}
                />
            </>
        )
    }
}

// 迁移后 - 使用 useState 和 visible/onClose
export function MyComponent() {
    const [visible, setVisible] = useState(false)
    
    return (
        <>
            <Button onPress={() => setVisible(true)}>
                打开
            </Button>
            <ActionSheet
                visible={visible}
                options={[
                    { value: '1', title: '选项一' },
                    { value: '2', title: '选项二' },
                ]}
                onChange={(value) => {
                    console.log('选择了', value)
                    setVisible(false)
                }}
                onClose={() => setVisible(false)}
            />
        </>
    )
}
```

### 案例 2：带标题和取消按钮

```tsx
// 迁移前
<ActionSheet
    show={true}
    title="选择操作"
    showCancel={true}
    actions={[
        { action: 'edit', title: '编辑' },
        { action: 'delete', title: '删除' },
    ]}
    onActionClick={handleAction}
    onRequestClose={handleClose}
/>

// 迁移后
<ActionSheet
    visible={true}
    title="选择操作"
    cancelText="取消"  // 设置 cancelText 就会显示取消按钮
    options={[
        { value: 'edit', title: '编辑' },
        { value: 'delete', title: '删除', color: '#FF192D' },  // 可以为删除按钮设置红色
    ]}
    onChange={handleAction}
    onClose={handleClose}
/>
```

### 案例 3：带搜索和选中状态

```tsx
// 迁移前 - 内置搜索和选中状态
const [show, setShow] = useState(false)
const [selected, setSelected] = useState('1')

<ActionSheet
    show={show}
    title="选择选项"
    showSearch={true}
    showSelection={true}
    selected={selected}
    actions={actions}
    onActionClick={(action) => {
        setSelected(action)
        setShow(false)
    }}
    onRequestClose={() => setShow(false)}
/>

// 迁移后 - 需要自定义搜索和选中状态显示
const [visible, setVisible] = useState(false)
const [selected, setSelected] = useState('1')
const [searchText, setSearchText] = useState('')

// 可以通过 header 自定义搜索框
const filteredOptions = options.filter(item => 
    item.title.includes(searchText)
)

<ActionSheet
    visible={visible}
    title="选择选项"
    header={
        <View>
            <SearchInput 
                value={searchText}
                onChangeText={setSearchText}
            />
            {selected && <Text>当前选中: {selected}</Text>}
        </View>
    }
    options={filteredOptions}
    onChange={(value) => {
        setSelected(value)
        setVisible(false)
    }}
    onClose={() => setVisible(false)}
/>
```

### 案例 4：带描述的选项

```tsx
// 迁移前 - 无原生支持，需要自定义
const actions = [
    { action: '1', title: '选项一' },
    { action: '2', title: '选项二' },
]

// 迁移后 - 原生支持描述字段
const options = [
    { value: '1', title: '编辑', description: '修改当前信息' },
    { value: '2', title: '分享', description: '分享给其他用户' },
    { value: '3', title: '删除', description: '永久删除数据', color: '#FF192D' },
]

<ActionSheet
    visible={visible}
    title="选择操作"
    options={options}
    onChange={handleChange}
    onClose={handleClose}
/>
```

### 案例 5：使用 static open 方法

```tsx
// 迁移前 - 主要通过受控组件方式

// 迁移后 - 新组件支持命令式调用（类似 Modal.open）
import { ActionSheet } from '@sfe/wand-rn'

// 命令式打开
const modalInstance = ActionSheet.open({
    title: '选择操作',
    options: [
        { value: '1', title: '选项一' },
        { value: '2', title: '选项二' },
    ],
    onChange: (value) => {
        console.log('选择了', value)
    },
    onClose: () => {
        console.log('关闭了')
    },
})

// 可以通过返回的实例关闭
modalInstance.close()
```

### 案例 6：自定义底部区域

```tsx
// 迁移前 - 仅支持默认的取消按钮

// 迁移后 - 支持自定义 footer
<ActionSheet
    visible={visible}
    options={options}
    footer={
        <View style={{padding: 10}}>
            <Button type="primary" onPress={handleConfirm}>
                确认
            </Button>
        </View>
    }
    onChange={handleChange}
    onClose={handleClose}
/>
```

### 案例 7：禁用状态

```tsx
// 迁移前 - 无原生支持

// 迁移后 - 原生支持禁用状态
const options = [
    { value: '1', title: '选项一' },
    { value: '2', title: '选项二', disabled: true },  // 禁用状态，显示灰色
    { value: '3', title: '选项三' },
]

<ActionSheet
    visible={visible}
    options={options}
    onChange={(value, index, item) => {
        // disabled 选项点击时不会触发 onChange
        console.log('选择了', value, item)
    }}
    onClose={handleClose}
/>
```

## 关键点

1. **属性名变更**：最重要的变更是 `show` → `visible`，`actions` → `options`，`onActionClick` → `onChange`

2. **数据结构变更**：
   - `action` 字段改名为 `value`，且类型更灵活（可以是任意类型）
   - 新增 `description`、`color`、`disabled` 等字段支持

3. **回调函数签名变更**：
   - 旧: `onActionClick(action: string)` 
   - 新: `onChange(value: any, index: number, item: ActionSheetOptionItem)`
   - 新增 `onCancel()` 和 `onClose()` 回调分离

4. **功能差异**：
   - 新组件移除了内置搜索功能 (`showSearch`)，需要通过 `header` 自定义实现
   - 新组件移除了选中状态显示功能 (`showSelection`)，可以通过 `header` 或 `description` 字段展示
   - 新组件新增了命令式调用方式 `ActionSheet.open()`

5. **样式系统**：
   - 新组件支持 Theme 系统和自定义样式
   - 支持通过 `styles` 属性传入自定义样式

6. **取消按钮**：
   - 旧: `showCancel={true}` 显示默认的取消按钮
   - 新: 通过 `cancelText` 字段控制，为空字符串时不显示；通过 `footer` 自定义

7. **遮罩关闭**：
   - 旧: `cancelable={true}` 允许点击蒙层关闭
   - 新: `maskClosable={true}` 允许点击蒙层关闭，通过 `onClose()` 回调处理

## 迁移检查清单

- [ ] 将 `show` 替换为 `visible`
- [ ] 将 `actions` 转换为 `options`，将 `action` 字段改为 `value`
- [ ] 替换 `onActionClick` 为 `onChange`，并调整回调函数签名
- [ ] 将 `onRequestClose` 分别映射到 `onClose` 和 `onCancel`
- [ ] 将 `cancelable` 改为 `maskClosable`
- [ ] 如果使用了 `showSearch`，需要在 `header` 中自定义搜索功能
- [ ] 如果使用了 `showSelection`，需要通过其他方式展示选中状态（如 `description` 字段）
- [ ] 测试所有的回调函数是否正确触发
- [ ] 验证样式是否符合预期（可能需要调整自定义样式）
