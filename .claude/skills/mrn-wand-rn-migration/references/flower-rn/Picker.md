# Picker 下拉弹框

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
// Picker Props
export interface PickerProps {
  // 按钮文字
  label?: string  // 默认 '请选择'
  // 自定义icon
  iconType?: AllIcons
  // 激活状态icon
  activeIconTyple?: AllIcons
  // 点击回调
  toggle?: ({ active, isSelected, offsetY }: {
    active: boolean
    isSelected: boolean
    offsetY: number
  }) => void
  // 是否可关闭蒙层，默认true
  maskClosable?: boolean
  // 子元素
  children?: JSX.Element | JSX.Element[]
  // 激活后的label文案显示，该字段有值时，则常亮
  selectedLabel?: string
  // 元素索引
  dataKey?: string
}

// Picker Ref
export interface PickerRefProps {
  close: () => void
  open: () => void
  active: boolean
  offsetY: number
}

// PickerGroup Props
export interface PickerGroupProps {
  style?: ViewStyle
  maskClosable?: boolean
  children?: JSX.Element | JSX.Element[]
  toggle?: ({ active, dataKey }: {
    active: boolean
    dataKey: string
  }) => void
}

// PickerGroup Ref
export interface PickerGroupRefProps {
  close: (dataKey?: string) => void
  open: (dataKey: string) => void
  activeKey: string
}
```

## 新组件 API

```tsx
// Picker Props
export interface PickerProps {
  // 按钮文字
  label?: string  // 默认 '请选择'
  // 自定义 icon
  icon?: JSX.Element
  // 激活状态 icon
  activeIcon?: JSX.Element
  // 点击回调
  toggle?: ({ active, isSelected, offsetY }: {
    active: boolean
    isSelected: boolean
    offsetY: number
  }) => void
  // 是否可关闭蒙层，默认 true
  maskClosable?: boolean
  // 子元素
  children?: JSX.Element | JSX.Element[]
  // 激活后的 label 文案显示，该字段有值时，则常亮
  selectedLabel?: string
  // 元素索引
  dataKey?: string
  // 动画类型（新增）
  animationType?: 'slide-down' | 'slide-left'  // 默认 'slide-down'
  // 文本显示模式（新增）
  textMode?: 'text' | 'button'  // 默认 'text'
  // 模态框内容样式（新增）
  modalBodyStyle?: StyleProp<ViewStyle>
}

// Picker Ref
export interface PickerRefProps {
  close: () => void
  open: () => void
  active: boolean
  offsetY: number
}

// PickerGroup Props
export interface PickerGroupProps {
  style?: ViewStyle
  maskClosable?: boolean
  children?: JSX.Element | JSX.Element[]
  toggle?: ({ active, dataKey }: {
    active: boolean
    dataKey: string
  }) => void
}

// PickerGroup Ref
export interface PickerGroupRefProps {
  close: (dataKey?: string) => void
  open: (dataKey: string) => void
  activeKey: string
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| iconType | icon | icon 属性值从 AllIcons 字符串改为 JSX.Element |
| activeIconTyple | activeIcon | activeIcon 属性值从 AllIcons 字符串改为 JSX.Element |
| label | label | 按钮文案，保持一致 |
| maskClosable | maskClosable | 是否关闭蒙层，保持一致 |
| selectedLabel | selectedLabel | 选中状态的按钮文案，保持一致 |
| dataKey | dataKey | 元素索引，保持一致 |
| toggle | toggle | 状态切换回调，保持一致 |
| children | children | 弹框内容，保持一致 |
| - | animationType | 新增，支持多种滑出动画（slide-down / slide-left） |
| - | textMode | 新增，支持 text 和 button 两种文本显示模式 |
| - | modalBodyStyle | 新增，弹框内容样式配置 |

## 迁移示例

### 案例 1：基础 Picker - 简单内容

```tsx
// 迁移前
import { Picker } from '@sgfe/flower-rn'

const pickerRef = useRef<PickerRefProps>()

<Picker 
  ref={pickerRef}
  label="筛选"
>
  <View><Text>内容区</Text></View>
</Picker>

// 迁移后
import { Picker } from '@sfe/wand-rn'

const pickerRef = useRef<PickerRefProps>()

<Picker 
  ref={pickerRef}
  label="筛选"
>
  <View><Text>内容区</Text></View>
</Picker>
```

### 案例 2：Picker 带默认 Icon

```tsx
// 迁移前 - 使用 iconType 字符串
import { Picker } from '@sgfe/flower-rn'

<Picker 
  label="筛选"
  iconType="direction-top-m-o"
  activeIconTyple="direction-bottom-m-o"
>
  <View><Text>内容</Text></View>
</Picker>

// 迁移后 - 使用 JSX.Element
import { Picker, Icon } from '@sfe/wand-rn'

<Picker 
  label="筛选"
  icon={<Icon type="direction-top-m-o" size={12} />}
  activeIcon={<Icon type="direction-bottom-m-o" size={12} />}
>
  <View><Text>内容</Text></View>
</Picker>
```

### 案例 3：自定义 Icon 颜色

```tsx
// 迁移前 - 默认颜色处理
import { Picker } from '@sgfe/flower-rn'

<Picker 
  label="筛选"
  iconType="search-o"
  activeIconTyple="search-o"
>
  <View><Text>搜索内容</Text></View>
</Picker>

// 迁移后 - 通过 Icon 组件控制颜色
import { Picker, Icon } from '@sfe/wand-rn'

<Picker 
  label="筛选"
  icon={<Icon type="search-o" size={12} color="#666" />}
  activeIcon={<Icon type="search-o" size={12} color="#FF6A00" />}
>
  <View><Text>搜索内容</Text></View>
</Picker>
```

### 案例 4：选中状态显示和回调

```tsx
// 迁移前
import { Picker } from '@sgfe/flower-rn'

const [selectedValue, setSelectedValue] = useState<string>('')
const pickerRef = useRef<PickerRefProps>()

<Picker
  ref={pickerRef}
  label='筛选条件'
  selectedLabel={selectedValue}
  toggle={({ active, isSelected, offsetY }) => {
    console.log('选中状态:', isSelected, '激活:', active)
  }}>
  <Select
    options={options}
    onPress={(item) => {
      setSelectedValue(item.label)
      pickerRef.current.close()
    }} />
</Picker>

// 迁移后 - 基本保持一致
import { Picker } from '@sfe/wand-rn'

const [selectedValue, setSelectedValue] = useState<string>('')
const pickerRef = useRef<PickerRefProps>()

<Picker
  ref={pickerRef}
  label='筛选条件'
  selectedLabel={selectedValue}
  toggle={({ active, isSelected, offsetY }) => {
    console.log('选中状态:', isSelected, '激活:', active)
  }}>
  <Select
    options={options}
    onPress={(item) => {
      setSelectedValue(item.label)
      pickerRef.current.close()
    }} />
</Picker>
```

### 案例 5：多个 Picker 左右排布（手动管理状态）

```tsx
// 迁移前
import { Picker } from '@sgfe/flower-rn'

const pickRef1 = useRef<PickerRefProps>()
const pickRef2 = useRef<PickerRefProps>()
const pickRef3 = useRef<PickerRefProps>()

<View style={{ flexDirection: 'row' }}>
  <Picker 
    ref={pickRef1} 
    label="Picker1" 
    toggle={({ active }) => {
      if (!active) return
      pickRef2.current.close()
      pickRef3.current.close()
    }}>
    <View><Text>内容1</Text></View>
  </Picker>
  <Picker 
    ref={pickRef2} 
    label="Picker2" 
    toggle={({ active }) => {
      if (!active) return
      pickRef1.current.close()
      pickRef3.current.close()
    }}>
    <View><Text>内容2</Text></View>
  </Picker>
  <Picker 
    ref={pickRef3} 
    label="Picker3" 
    toggle={({ active }) => {
      if (!active) return
      pickRef1.current.close()
      pickRef2.current.close()
    }}>
    <View><Text>内容3</Text></View>
  </Picker>
</View>

// 迁移后 - 推荐使用 PickerGroup 自动管理
import { Picker, PickerGroup } from '@sfe/wand-rn'

const groupRef = useRef<PickerGroupRefProps>()

<PickerGroup ref={groupRef} style={{ flexDirection: 'row' }}>
  <Picker dataKey='1' label='Picker1'>
    <View><Text>内容1</Text></View>
  </Picker>
  <Picker dataKey='2' label='Picker2'>
    <View><Text>内容2</Text></View>
  </Picker>
  <Picker dataKey='3' label='Picker3'>
    <View><Text>内容3</Text></View>
  </Picker>
</PickerGroup>
```

### 案例 6：使用 PickerGroup 控制多个 Picker

```tsx
// 迁移前 - 需要手动控制多个 picker 的状态
import { Picker } from '@sgfe/flower-rn'

const pickRef1 = useRef<PickerRefProps>()
const pickRef2 = useRef<PickerRefProps>()

<View>
  <Picker ref={pickRef1} label="库区1">
    <CascaderMultiple />
  </Picker>
  <Picker ref={pickRef2} label="库区2">
    <CascaderMultiple />
  </Picker>
</View>

// 迁移后 - 使用 PickerGroup 自动管理
import { Picker, PickerGroup } from '@sfe/wand-rn'

const groupRef = useRef<PickerGroupRefProps>()

<PickerGroup 
  ref={groupRef} 
  toggle={({ active, dataKey }) => {
    console.log(`Picker ${dataKey} 状态: ${active}`)
  }}>
  <Picker dataKey='1' label='库区1'>
    <CascaderMultiple />
  </Picker>
  <Picker dataKey='2' label='库区2'>
    <CascaderMultiple />
  </Picker>
</PickerGroup>

// 通过 ref 控制
groupRef.current.open('1')     // 打开 dataKey 为 1 的 Picker
groupRef.current.close('1')    // 关闭特定 Picker
groupRef.current.close()       // 关闭当前激活的 Picker
```

### 案例 7：动画类型 - 向下滑出（默认）

```tsx
// 迁移前 - 默认只支持向下滑出
import { Picker } from '@sgfe/flower-rn'

<Picker label="筛选">
  <View><Text>内容</Text></View>
</Picker>

// 迁移后 - 明确指定向下滑出
import { Picker } from '@sfe/wand-rn'

<Picker 
  label="筛选"
  animationType="slide-down"
>
  <View><Text>内容</Text></View>
</Picker>
```

### 案例 8：动画类型 - 向左滑出（新增）

```tsx
// 迁移前 - 无此功能
import { Picker } from '@sgfe/flower-rn'

<Picker label="筛选">
  <View><Text>内容</Text></View>
</Picker>

// 迁移后 - 支持向左滑出
import { Picker } from '@sfe/wand-rn'

<Picker 
  label="筛选"
  animationType="slide-left"
>
  <View><Text>内容</Text></View>
</Picker>
```

### 案例 9：文本模式 - 文本模式（默认）

```tsx
// 迁移前
import { Picker } from '@sgfe/flower-rn'

<Picker label="确认">
  <View><Text>内容</Text></View>
</Picker>

// 迁移后 - 文本模式（默认）
import { Picker } from '@sfe/wand-rn'

<Picker 
  label="确认"
  textMode="text"
>
  <View><Text>内容</Text></View>
</Picker>
```

### 案例 10：文本模式 - 按钮模式（新增）

```tsx
// 迁移前 - 无此功能
import { Picker } from '@sgfe/flower-rn'

<Picker label="确认">
  <View><Text>内容</Text></View>
</Picker>

// 迁移后 - 按钮模式
import { Picker } from '@sfe/wand-rn'

<Picker 
  label="确认"
  textMode="button"
>
  <View><Text>内容</Text></View>
</Picker>
```

### 案例 11：自定义模态框内容样式

```tsx
// 迁移前 - 通过 children 手动包裹
import { Picker } from '@sgfe/flower-rn'

<Picker label="筛选">
  <View style={{ padding: 16, backgroundColor: '#fff' }}>
    <View><Text>选项1</Text></View>
    <View><Text>选项2</Text></View>
  </View>
</Picker>

// 迁移后 - 使用 modalBodyStyle 属性
import { Picker } from '@sfe/wand-rn'

<Picker 
  label="筛选"
  modalBodyStyle={{ padding: 16, backgroundColor: '#fff' }}
>
  <View><Text>选项1</Text></View>
  <View><Text>选项2</Text></View>
</Picker>
```

### 案例 12：关闭蒙层控制

```tsx
// 迁移前
import { Picker } from '@sgfe/flower-rn'

<Picker 
  label="筛选"
  maskClosable={false}  // 点击蒙层不关闭
>
  <View><Text>内容</Text></View>
</Picker>

// 迁移后 - 保持一致
import { Picker } from '@sfe/wand-rn'

<Picker 
  label="筛选"
  maskClosable={false}
>
  <View><Text>内容</Text></View>
</Picker>
```

### 案例 13：通过 ref 控制 Picker 打开关闭

```tsx
// 迁移前
import { Picker } from '@sgfe/flower-rn'
import { Button } from '@sgfe/flower-rn'

const pickerRef = useRef<PickerRefProps>()

<View>
  <Picker ref={pickerRef} label="筛选">
    <View><Text>内容</Text></View>
  </Picker>
  <Button 
    onPress={() => {
      if (pickerRef.current.active) {
        pickerRef.current.close()
      } else {
        pickerRef.current.open()
      }
    }}
  >
    控制 Picker
  </Button>
</View>

// 迁移后 - 保持一致
import { Picker } from '@sfe/wand-rn'
import { Button } from '@sfe/wand-rn'

const pickerRef = useRef<PickerRefProps>()

<View>
  <Picker ref={pickerRef} label="筛选">
    <View><Text>内容</Text></View>
  </Picker>
  <Button 
    onPress={() => {
      if (pickerRef.current.active) {
        pickerRef.current.close()
      } else {
        pickerRef.current.open()
      }
    }}
  >
    控制 Picker
  </Button>
</View>
```

### 案例 14：Picker 组合使用

```tsx
// 迁移前 - 手动管理
import { Picker } from '@sgfe/flower-rn'

const pickRef1 = useRef<PickerRefProps>()
const pickRef2 = useRef<PickerRefProps>()

<View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
  <View style={{ flex: 1 }}>
    <Picker 
      ref={pickRef1} 
      label="类型" 
      toggle={({ active }) => {
        if (active) pickRef2.current.close()
      }}>
      <Select options={typeOptions} />
    </Picker>
  </View>
  <View style={{ flex: 1, marginLeft: 10 }}>
    <Picker 
      ref={pickRef2} 
      label="状态"
      toggle={({ active }) => {
        if (active) pickRef1.current.close()
      }}>
      <Select options={statusOptions} />
    </Picker>
  </View>
</View>

// 迁移后 - 推荐使用 PickerGroup
import { Picker, PickerGroup } from '@sfe/wand-rn'

<PickerGroup 
  style={{ 
    flexDirection: 'row', 
    paddingHorizontal: 16 
  }}
>
  <View style={{ flex: 1 }}>
    <Picker dataKey="1" label="类型">
      <Select options={typeOptions} />
    </Picker>
  </View>
  <View style={{ flex: 1, marginLeft: 10 }}>
    <Picker dataKey="2" label="状态">
      <Select options={statusOptions} />
    </Picker>
  </View>
</PickerGroup>
```

## 关键迁移要点

### 1. 架构基本保持一致
- **旧版和新版都是**: 组件嵌套模式，使用 children 传递内容
- 不需要改变组件架构

### 2. Icon 属性类型变更
- **旧版**: `iconType` 和 `activeIconTyple` 支持 `AllIcons` 字符串
- **新版**: `icon` 和 `activeIcon` 只支持 `JSX.Element`
- **迁移**: 需要将字符串 icon 改为 `<Icon type="..." />` 组件

### 3. 状态管理基本保持一致
- 都支持 `open()` 和 `close()` 方法
- 都支持 `active` 状态和 `offsetY` 属性
- 都支持 `toggle` 回调

### 4. 多项管理 - 推荐迁移到 PickerGroup
- **旧版**: 手动在 toggle 回调中控制多个 Picker 的状态
- **新版**: 使用 `PickerGroup` 组件自动管理多个 Picker 的互斥状态
- **好处**: 代码更简洁，逻辑更清晰

### 5. 新增功能
- **animationType**: 支持 `slide-down`（默认）和 `slide-left` 两种动画
- **textMode**: 支持 `text`（默认）和 `button` 两种文本模式
- **modalBodyStyle**: 新增属性用于自定义弹框内容样式

### 6. 保持不变的功能
- `label`、`selectedLabel`、`dataKey` 保持一致
- `maskClosable` 保持一致
- `children` 传递弹框内容方式保持一致
- `toggle` 回调参数保持一致

## 迁移检查清单

- [ ] 将所有 `import { Picker } from '@sgfe/flower-rn'` 改为 `import { Picker } from '@sfe/wand-rn'`
- [ ] 检查是否有使用 `iconType` 属性，改为 `icon={<Icon type="..." />}`
- [ ] 检查是否有使用 `activeIconTyple` 属性，改为 `activeIcon={<Icon type="..." />}`
- [ ] 如果有多个 Picker 需要相互控制，考虑使用 `PickerGroup` 而非手动管理
- [ ] 在使用 `PickerGroup` 时，确保每个 `Picker` 的 `dataKey` 属性必填且唯一
- [ ] 根据需要配置 `animationType` 选择合适的动画方向
- [ ] 根据设计稿选择合适的 `textMode` 文本显示模式
- [ ] 如果需要自定义弹框内容样式，使用 `modalBodyStyle` 而非手动包裹 View
- [ ] 验证 Picker 的打开/关闭功能是否正常
- [ ] 测试 Picker 中不同内容组件的显示和交互

## 注意事项

1. **Icon 属性必须改动**：
   - `iconType` 和 `activeIconTyple` 改为 `icon` 和 `activeIcon`
   - 属性值从字符串改为 JSX.Element
   - 需要导入并使用 Icon 组件

2. **PickerGroup 中的 dataKey 必填**：
   - 在 PickerGroup 中，每个 Picker 的 `dataKey` 属性是必填的
   - 同一个 PickerGroup 内的 dataKey 必须唯一

3. **新增属性是可选的**：
   - `animationType`、`textMode` 和 `modalBodyStyle` 都是可选属性
   - 有默认值，不需要配置也能正常工作

4. **PickerGroup 优化状态管理**：
   - 虽然手动管理状态也能工作，但使用 PickerGroup 能简化代码
   - 特别是在多个 Picker 需要互斥打开的场景

5. **Icon 组件导入**：
   - 使用新的 icon 属性时需要导入 Icon 组件
   - 来自 `@sfe/wand-rn` 包

6. **向后兼容性**：
   - 新版 wand-rn Picker 与旧版 flower-rn Picker 的 API 高度相似
   - 大多数现有代码只需改动 icon 相关属性即可

7. **动画类型选择**：
   - `slide-down` 适合顶部的 Picker
   - `slide-left` 适合右侧的 Picker

8. **文本模式选择**：
   - `text` 模式适合展示纯文本按钮
   - `button` 模式适合需要按钮样式的场景

## 类型导入

```tsx
import { 
  Picker, 
  PickerRefProps, 
  PickerGroup, 
  PickerGroupRefProps,
  Icon 
} from '@sfe/wand-rn'
```

## 完整迁移示例

以下是一个完整的迁移例子，从 flower-rn 迁移到 wand-rn：

```tsx
// 迁移前 - flower-rn
import { Picker, PickerGroup, PickerRefProps, PickerGroupRefProps } from '@sgfe/flower-rn'
import { View, Text } from '@mrn/react-native'
import { useState, useRef } from 'react'

export function OldFilterScreen() {
  const pickRef1 = useRef<PickerRefProps>()
  const pickRef2 = useRef<PickerRefProps>()
  const pickRef3 = useRef<PickerRefProps>()
  const [selectedFilter, setSelectedFilter] = useState('')

  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
      <Picker
        ref={pickRef1}
        label="分类"
        toggle={({ active }) => {
          if (active) {
            pickRef2.current?.close()
            pickRef3.current?.close()
          }
        }}
      >
        <View><Text>分类选项</Text></View>
      </Picker>
      
      <Picker
        ref={pickRef2}
        label="筛选"
        selectedLabel={selectedFilter}
        toggle={({ active }) => {
          if (active) {
            pickRef1.current?.close()
            pickRef3.current?.close()
          }
        }}
      >
        <View><Text>筛选选项</Text></View>
      </Picker>
      
      <Picker
        ref={pickRef3}
        label="排序"
        toggle={({ active }) => {
          if (active) {
            pickRef1.current?.close()
            pickRef2.current?.close()
          }
        }}
      >
        <View><Text>排序选项</Text></View>
      </Picker>
    </View>
  )
}

// 迁移后 - wand-rn
import { Picker, PickerGroup, Icon } from '@sfe/wand-rn'
import { View, Text } from '@mrn/react-native'
import { useState, useRef } from 'react'

export function NewFilterScreen() {
  const groupRef = useRef()
  const [selectedFilter, setSelectedFilter] = useState('')

  return (
    <PickerGroup 
      ref={groupRef}
      style={{ flexDirection: 'row', paddingHorizontal: 16 }}
    >
      <Picker
        dataKey="1"
        label="分类"
        icon={<Icon type="direction-top-m-o" size={12} />}
        activeIcon={<Icon type="direction-bottom-m-o" size={12} />}
      >
        <View><Text>分类选项</Text></View>
      </Picker>
      
      <Picker
        dataKey="2"
        label="筛选"
        selectedLabel={selectedFilter}
        icon={<Icon type="direction-top-m-o" size={12} />}
        activeIcon={<Icon type="direction-bottom-m-o" size={12} />}
      >
        <View><Text>筛选选项</Text></View>
      </Picker>
      
      <Picker
        dataKey="3"
        label="排序"
        icon={<Icon type="direction-top-m-o" size={12} />}
        activeIcon={<Icon type="direction-bottom-m-o" size={12} />}
      >
        <View><Text>排序选项</Text></View>
      </Picker>
    </PickerGroup>
  )
}
```
