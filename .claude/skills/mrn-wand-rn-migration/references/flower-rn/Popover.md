# Popover 气泡菜单

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface PopoverProps extends WithThemeStyles<PopoverStyle> {
  // 选项点击回调函数
  onSelect?: (node: any, index?: number) => void

  // 气泡选项
  options: Array<{ label: string; value: number | string }>

  // 自定义弹出层的外围组件
  renderOverlayComponent?: (
    node: React.ReactNode,
    closePopover: () => void,
  ) => React.ReactNode

  // 弹出方向
  placement?: 'top' | 'bottom'  // 默认 'bottom'

  // 弹出层关闭后的回调
  onClose?: () => void

  // 组件子元素
  children: React.ReactNode

  // 自定义样式
  styles?: WithThemeStyles<PopoverStyle>
}

interface PopoverItemProps {
  value: any
  [key: string]: any
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}
```

## 新组件 API

```tsx
export interface PopoverProps extends WithThemeStyles<PopoverStyle> {
  // 选项点击回调函数
  onSelect?: (node: any, index?: number) => void

  // 气泡选项
  options: Array<{ label: string; value: number | string }>

  // 是否计算 StatusBar 高度（新增）
  calculateStatusBar?: boolean  // 默认 false

  // 自定义弹出层的外围组件
  renderOverlayComponent?: (
    node: React.ReactNode,
    closePopover: () => void,
  ) => React.ReactNode

  // 弹出方向
  placement?: 'top' | 'bottom'  // 默认 'bottom'

  // 弹出层关闭后的回调
  onClose?: () => void

  // 组件子元素
  children: React.ReactNode

  // 自定义样式
  styles?: WithThemeStyles<PopoverStyle>
}

interface PopoverItemProps {
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  value: any
  [key: string]: any
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| onSelect | onSelect | 选项点击回调，保持一致 |
| options | options | 气泡选项列表，保持一致 |
| placement | placement | 弹出方向，保持一致 |
| onClose | onClose | 关闭回调，保持一致 |
| renderOverlayComponent | renderOverlayComponent | 自定义渲染，保持一致 |
| children | children | 触发元素内容，保持一致 |
| styles | styles | 自定义样式，保持一致 |
| - | calculateStatusBar | 新增，用于 Android StatusBar 高度计算 |

## 关键变更

### 1. 新增 calculateStatusBar 属性
- **旧版本**：自动判断是否计算 StatusBar，仅在 Android 的 subContainer 中自动启用
- **新版本**：新增显式的 `calculateStatusBar` 参数，允许手动控制
- 在 Android 下的 subContainer 中仍会自动启用，但可通过该参数显式设置

### 2. 其他保持兼容
- 所有其他属性和功能保持完全一致
- 组件行为和外观不会改变
- 可以直接替换库，无需修改代码

## 迁移示例

### 案例 1：基础气泡菜单

```tsx
// 迁移前
import { Popover } from '@sgfe/flower-rn'
import { Text } from '@mrn/react-native'

const options = [
  { label: '编辑', value: 'edit' },
  { label: '删除', value: 'delete' }
]

<Popover options={options} onSelect={(value) => console.log(value)}>
  <Text>点击打开菜单</Text>
</Popover>

// 迁移后 - 无需改动
import { Popover } from '@sfe/wand-rn'
import { Text } from '@mrn/react-native'

const options = [
  { label: '编辑', value: 'edit' },
  { label: '删除', value: 'delete' }
]

<Popover options={options} onSelect={(value) => console.log(value)}>
  <Text>点击打开菜单</Text>
</Popover>
```

### 案例 2：向上弹出

```tsx
// 迁移前
import { Popover } from '@sgfe/flower-rn'

<Popover 
  options={[
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' }
  ]}
  placement="top"
  onSelect={(value) => handleSelect(value)}
>
  <Button>打开菜单</Button>
</Popover>

// 迁移后 - 无需改动
import { Popover } from '@sfe/wand-rn'

<Popover 
  options={[
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' }
  ]}
  placement="top"
  onSelect={(value) => handleSelect(value)}
>
  <Button>打开菜单</Button>
</Popover>
```

### 案例 3：默认向下弹出

```tsx
// 迁移前
import { Popover } from '@sgfe/flower-rn'

<Popover 
  options={[
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' }
  ]}
  onSelect={(value) => console.log(value)}
>
  <Button>更多操作</Button>
</Popover>

// 迁移后 - 无需改动
import { Popover } from '@sfe/wand-rn'

<Popover 
  options={[
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' }
  ]}
  onSelect={(value) => console.log(value)}
>
  <Button>更多操作</Button>
</Popover>
```

### 案例 4：带关闭回调

```tsx
// 迁移前
import { Popover } from '@sgfe/flower-rn'

const [isOpen, setIsOpen] = useState(false)

<Popover 
  options={options}
  onSelect={(value) => handleSelect(value)}
  onClose={() => setIsOpen(false)}
>
  <Button>菜单</Button>
</Popover>

// 迁移后 - 无需改动
import { Popover } from '@sfe/wand-rn'

const [isOpen, setIsOpen] = useState(false)

<Popover 
  options={options}
  onSelect={(value) => handleSelect(value)}
  onClose={() => setIsOpen(false)}
>
  <Button>菜单</Button>
</Popover>
```

### 案例 5：自定义气泡内容渲染

```tsx
// 迁移前
import { Popover } from '@sgfe/flower-rn'

<Popover 
  options={options}
  renderOverlayComponent={(options, closePopover) => (
    <View>
      {options.map((opt) => (
        <TouchableOpacity 
          key={opt.value}
          onPress={() => {
            handleSelect(opt.value)
            closePopover()
          }}
        >
          <Text>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
>
  <Button>自定义菜单</Button>
</Popover>

// 迁移后 - 无需改动
import { Popover } from '@sfe/wand-rn'

<Popover 
  options={options}
  renderOverlayComponent={(options, closePopover) => (
    <View>
      {options.map((opt) => (
        <TouchableOpacity 
          key={opt.value}
          onPress={() => {
            handleSelect(opt.value)
            closePopover()
          }}
        >
          <Text>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
>
  <Button>自定义菜单</Button>
</Popover>
```

### 案例 6：多个选项菜单

```tsx
// 迁移前
import { Popover } from '@sgfe/flower-rn'

const menuOptions = [
  { label: '编辑', value: 'edit' },
  { label: '复制', value: 'copy' },
  { label: '分享', value: 'share' },
  { label: '删除', value: 'delete' }
]

<Popover 
  options={menuOptions}
  onSelect={(value) => handleMenuAction(value)}
>
  <Button>操作</Button>
</Popover>

// 迁移后 - 无需改动
import { Popover } from '@sfe/wand-rn'

const menuOptions = [
  { label: '编辑', value: 'edit' },
  { label: '复制', value: 'copy' },
  { label: '分享', value: 'share' },
  { label: '删除', value: 'delete' }
]

<Popover 
  options={menuOptions}
  onSelect={(value) => handleMenuAction(value)}
>
  <Button>操作</Button>
</Popover>
```

### 案例 7：在列表项中使用（常见场景）

```tsx
// 迁移前
import { Popover } from '@sgfe/flower-rn'
import { List, Icon } from '@sgfe/flower-rn'

<List>
  {items.map((item) => (
    <List.Item key={item.id}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>{item.name}</Text>
        <Popover
          options={[
            { label: '编辑', value: 'edit' },
            { label: '删除', value: 'delete' }
          ]}
          onSelect={(value) => handleAction(item.id, value)}
        >
          <Icon type="more" />
        </Popover>
      </View>
    </List.Item>
  ))}
</List>

// 迁移后 - 无需改动
import { Popover, Icon } from '@sfe/wand-rn'
import { List } from '@sfe/wand-rn'

<List>
  {items.map((item) => (
    <List.Item key={item.id}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>{item.name}</Text>
        <Popover
          options={[
            { label: '编辑', value: 'edit' },
            { label: '删除', value: 'delete' }
          ]}
          onSelect={(value) => handleAction(item.id, value)}
        >
          <Icon type="more" />
        </Popover>
      </View>
    </List.Item>
  ))}
</List>
```

### 案例 8：动态选项内容

```tsx
// 迁移前
import { Popover } from '@sgfe/flower-rn'

const [options, setOptions] = useState([
  { label: '选项1', value: '1' }
])

const handleFetch = async () => {
  const data = await fetchOptions()
  setOptions(data)
}

<Popover 
  options={options}
  onSelect={(value) => console.log(value)}
>
  <Button onPress={handleFetch}>动态菜单</Button>
</Popover>

// 迁移后 - 无需改动
import { Popover } from '@sfe/wand-rn'

const [options, setOptions] = useState([
  { label: '选项1', value: '1' }
])

const handleFetch = async () => {
  const data = await fetchOptions()
  setOptions(data)
}

<Popover 
  options={options}
  onSelect={(value) => console.log(value)}
>
  <Button onPress={handleFetch}>动态菜单</Button>
</Popover>
```

### 案例 9：Android StatusBar 计算（新增场景）

```tsx
// 迁移前 - 在 Android subContainer 中需要特殊处理
import { Popover } from '@sgfe/flower-rn'

// 自动判断，在 subContainer 中自动启用
<Popover options={options}>
  <Button>菜单</Button>
</Popover>

// 迁移后 - 可以显式控制
import { Popover } from '@sfe/wand-rn'

// 方式1：让组件自动判断（默认行为）
<Popover options={options}>
  <Button>菜单</Button>
</Popover>

// 方式2：显式启用 StatusBar 计算
<Popover 
  options={options}
  calculateStatusBar={true}
>
  <Button>菜单</Button>
</Popover>

// 方式3：显式禁用 StatusBar 计算
<Popover 
  options={options}
  calculateStatusBar={false}
>
  <Button>菜单</Button>
</Popover>
```

### 案例 10：完整复杂场景

```tsx
// 迁移前
import { Popover } from '@sgfe/flower-rn'
import { Button, Icon } from '@sgfe/flower-rn'
import { View, Text } from '@mrn/react-native'

const [selectedValue, setSelectedValue] = useState(null)

const handleSelect = (value) => {
  setSelectedValue(value)
  console.log(`选择了: ${value}`)
}

<View style={{ paddingHorizontal: 16 }}>
  <Popover
    options={[
      { label: '编辑项目', value: 'edit' },
      { label: '复制链接', value: 'copy' },
      { label: '分享', value: 'share' },
      { label: '删除项目', value: 'delete' }
    ]}
    placement="bottom"
    onSelect={handleSelect}
    onClose={() => console.log('菜单已关闭')}
  >
    <Button size="sm">
      操作
    </Button>
  </Popover>
</View>

// 迁移后 - 无需改动
import { Popover, Button, Icon } from '@sfe/wand-rn'
import { View, Text } from '@mrn/react-native'

const [selectedValue, setSelectedValue] = useState(null)

const handleSelect = (value) => {
  setSelectedValue(value)
  console.log(`选择了: ${value}`)
}

<View style={{ paddingHorizontal: 16 }}>
  <Popover
    options={[
      { label: '编辑项目', value: 'edit' },
      { label: '复制链接', value: 'copy' },
      { label: '分享', value: 'share' },
      { label: '删除项目', value: 'delete' }
    ]}
    placement="bottom"
    onSelect={handleSelect}
    onClose={() => console.log('菜单已关闭')}
  >
    <Button size="sm">
      操作
    </Button>
  </Popover>
</View>
```

### 案例 11：带图标的菜单选项

```tsx
// 迁移前 - 通过自定义渲染
import { Popover } from '@sgfe/flower-rn'
import { Icon } from '@sgfe/flower-rn'

<Popover
  options={[]}
  renderOverlayComponent={(options, closePopover) => (
    <View>
      <TouchableOpacity onPress={() => closePopover()}>
        <Icon type="edit" />
        <Text>编辑</Text>
      </TouchableOpacity>
    </View>
  )}
>
  <Button>菜单</Button>
</Popover>

// 迁移后 - 无需改动
import { Popover, Icon } from '@sfe/wand-rn'

<Popover
  options={[]}
  renderOverlayComponent={(options, closePopover) => (
    <View>
      <TouchableOpacity onPress={() => closePopover()}>
        <Icon type="edit" />
        <Text>编辑</Text>
      </TouchableOpacity>
    </View>
  )}
>
  <Button>菜单</Button>
</Popover>
```

### 案例 12：条件性菜单选项

```tsx
// 迁移前
import { Popover } from '@sgfe/flower-rn'

const getMenuOptions = () => {
  const base = [
    { label: '查看', value: 'view' }
  ]
  
  if (isOwner) {
    base.push({ label: '编辑', value: 'edit' })
  }
  
  if (isAdmin) {
    base.push({ label: '删除', value: 'delete' })
  }
  
  return base
}

<Popover
  options={getMenuOptions()}
  onSelect={handleMenuSelect}
>
  <Button>菜单</Button>
</Popover>

// 迁移后 - 无需改动
import { Popover } from '@sfe/wand-rn'

const getMenuOptions = () => {
  const base = [
    { label: '查看', value: 'view' }
  ]
  
  if (isOwner) {
    base.push({ label: '编辑', value: 'edit' })
  }
  
  if (isAdmin) {
    base.push({ label: '删除', value: 'delete' })
  }
  
  return base
}

<Popover
  options={getMenuOptions()}
  onSelect={handleMenuSelect}
>
  <Button>菜单</Button>
</Popover>
```

## 关键点

- **API 完全兼容**：所有现有属性保持不变，功能完全一致
- **新增 calculateStatusBar**：在 Android 中更好地处理 StatusBar 高度，但自动判断仍然有效
- **无需代码改动**：可直接替换库，无需修改任何使用代码
- **默认行为保持**：placement 默认仍为 'bottom'，onSelect 默认为空函数
- **样式风格一致**：气泡外观、动画、交互方式完全一致
- **iOS 延迟处理**：iOS 上的 500ms 延迟处理得到保留，确保路由切换时正确处理回调

## 迁移检查清单

- [ ] 将所有 `import { Popover } from '@sgfe/flower-rn'` 改为 `import { Popover } from '@sfe/wand-rn'`
- [ ] 验证所有 Popover 组件的 options 属性格式正确
- [ ] 检查 placement 属性是否只使用 'top' 或 'bottom'
- [ ] 验证 onSelect 回调函数能正确处理选中的值
- [ ] 检查 onClose 回调是否正确执行
- [ ] 如需控制 StatusBar 高度计算，可使用 calculateStatusBar 属性
- [ ] 测试气泡弹出和关闭动画是否流畅
- [ ] 验证自定义 renderOverlayComponent 的代码仍然正常工作
- [ ] 在 Android 设备上测试 StatusBar 显示是否正确
- [ ] 在 iOS 设备上测试选项点击后的路由跳转是否正常

## 注意事项

1. **无破坏性变更**：
   - 所有属性名称保持不变
   - 所有属性类型保持不变
   - 所有功能行为保持不变

2. **calculateStatusBar 使用场景**：
   - 默认值为 false
   - 在 Android 的 subContainer 中会自动启用
   - 通常无需手动设置，除非遇到 StatusBar 显示异常

3. **iOS 特殊处理**：
   - iOS 上选项点击后有 500ms 的延迟处理
   - 这是为了确保快速跳转其他 Bundle 时正确执行回调
   - 此行为在新旧版本中保持一致

4. **性能考虑**：
   - options 数组建议不超过 10 项
   - 对于大量菜单项，建议使用自定义 renderOverlayComponent 实现滚动
   - 动态生成 options 时注意使用稳定的数据引用

5. **样式定制**：
   - 可通过 styles 属性传入自定义样式
   - styles 属性接受 WithThemeStyles<PopoverStyle>
   - 自定义样式的属性名和结构应保持一致
