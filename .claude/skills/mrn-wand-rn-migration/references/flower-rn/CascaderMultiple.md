# CascaderMultiple 级联多选

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export type CascaderItem = {
    label: string
    value: string | number
    children?: CascaderItem[]
}

export type Value = {
    [prop: (string | number)]: (string | number)[]
}

export type Props = {
    /** 选中内容 */
    value?: Value
    /** 数据源 */
    dataSource: CascaderItem[]
    /** 确认按钮文字，默认 '确定' */
    confirmText?: string
    /** 重置按钮文字，默认 '重置' */
    resetText?: string
    /** 确定按钮回调 */
    onConfirm?: (value: Value) => void
    /** 重置按钮回调 */
    onReset?: (value: Value) => void
}
```

## 新组件 API

```tsx
export type CascaderItem = {
    label: string
    value: string | number
    children?: CascaderItem[]
}

export type Value = {
    [prop: (string | number)]: (string | number)[]
}

export type Props = {
    /** 选中内容 */
    value?: Value
    /** 数据源 */
    dataSource: CascaderItem[]
    /** 确认按钮文字，默认 '确定' */
    confirmText?: string
    /** 重置按钮文字，默认 '重置' */
    resetText?: string
    /** 是否展示搜索栏，默认 false */
    showFilter?: boolean
    /** 确定按钮回调 */
    onConfirm?: (value: Value) => void
    /** 重置按钮回调 */
    onReset?: (value: Value) => void
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| `value` | `value` | 保持不变 |
| `dataSource` | `dataSource` | 保持不变 |
| `confirmText` | `confirmText` | 保持不变 |
| `resetText` | `resetText` | 保持不变 |
| `onConfirm` | `onConfirm` | 保持不变 |
| `onReset` | `onReset` | 保持不变 |
| N/A | `showFilter` | 新增属性，用于显示搜索栏 |

## 关键变更

### 1. 新增 showFilter 属性

新库新增了 `showFilter` 属性，支持在级联多选面板顶部显示搜索栏，用于快速过滤选项：

```tsx
// 迁移前：没有搜索功能
<CascaderMultiple dataSource={data} />

// 迁移后：支持搜索
<CascaderMultiple 
    dataSource={data}
    showFilter={true}  // 显示搜索栏
/>
```

搜索功能会：
- 实时过滤数据源
- 支持大小写不敏感搜索
- 保留匹配的叶节点及其父节点
- 默认不展示搜索栏

### 2. 按钮实现改进

新库内部使用 `ButtonBar` 替代两个独立的 `Button` 组件，改进了按钮布局和样式。这是内部实现改进，对外部 API 无影响。

### 3. Icon 和样式系统更新

新库集成了 `WithTheme` 样式系统，使用了更新的 Icon 类型和主题适配。这些改进对用户透明。

### 4. 数据过滤改进

新库在搜索时会：
- 深度克隆数据，避免修改原始数据
- 智能过滤中间节点，只显示包含匹配叶节点的父节点
- 支持递归过滤多层级级联

### 5. 默认选中改进

新库改进了第一项的默认选中逻辑，更加稳定可靠。

## 迁移示例

### 案例 1：基础使用

```tsx
// 迁移前
import { CascaderMultiple } from '@sgfe/flower-rn'

const data = [
    {
        label: '分类1',
        value: 'category1',
        children: [
            { label: '选项1-1', value: 'option1-1' },
            { label: '选项1-2', value: 'option1-2' },
        ]
    },
    {
        label: '分类2',
        value: 'category2',
        children: [
            { label: '选项2-1', value: 'option2-1' },
            { label: '选项2-2', value: 'option2-2' },
        ]
    }
]

<CascaderMultiple dataSource={data} />

// 迁移后
import { CascaderMultiple } from '@sfe/wand-rn'

const data = [
    {
        label: '分类1',
        value: 'category1',
        children: [
            { label: '选项1-1', value: 'option1-1' },
            { label: '选项1-2', value: 'option1-2' },
        ]
    },
    {
        label: '分类2',
        value: 'category2',
        children: [
            { label: '选项2-1', value: 'option2-1' },
            { label: '选项2-2', value: 'option2-2' },
        ]
    }
]

<CascaderMultiple dataSource={data} />
```

### 案例 2：受控组件

```tsx
// 迁移前
import { CascaderMultiple } from '@sgfe/flower-rn'
import { useState } from 'react'

export const ControlledCascader = () => {
    const [selected, setSelected] = useState({})

    return (
        <CascaderMultiple
            dataSource={data}
            value={selected}
            onConfirm={(value) => {
                setSelected(value)
                console.log('确定选择:', value)
            }}
            onReset={() => {
                setSelected({})
                console.log('重置选择')
            }}
        />
    )
}

// 迁移后
import { CascaderMultiple } from '@sfe/wand-rn'
import { useState } from 'react'

export const ControlledCascader = () => {
    const [selected, setSelected] = useState({})

    return (
        <CascaderMultiple
            dataSource={data}
            value={selected}
            onConfirm={(value) => {
                setSelected(value)
                console.log('确定选择:', value)
            }}
            onReset={() => {
                setSelected({})
                console.log('重置选择')
            }}
        />
    )
}
```

### 案例 3：自定义按钮文字

```tsx
// 迁移前
import { CascaderMultiple } from '@sgfe/flower-rn'

<CascaderMultiple
    dataSource={data}
    confirmText="完成"
    resetText="清空"
    onConfirm={(value) => console.log(value)}
    onReset={(value) => console.log(value)}
/>

// 迁移后
import { CascaderMultiple } from '@sfe/wand-rn'

<CascaderMultiple
    dataSource={data}
    confirmText="完成"
    resetText="清空"
    onConfirm={(value) => console.log(value)}
    onReset={(value) => console.log(value)}
/>
```

### 案例 4：启用搜索功能（新增）

```tsx
// 迁移前（无搜索功能）
import { CascaderMultiple } from '@sgfe/flower-rn'

<CascaderMultiple dataSource={data} />

// 迁移后（新增搜索功能）
import { CascaderMultiple } from '@sfe/wand-rn'

// 不使用搜索
<CascaderMultiple dataSource={data} />

// 或启用搜索
<CascaderMultiple 
    dataSource={data}
    showFilter={true}
/>
```

### 案例 5：多层级级联

```tsx
// 迁移前
import { CascaderMultiple } from '@sgfe/flower-rn'

const multiLevelData = [
    {
        label: '地区',
        value: 'region',
        children: [
            {
                label: '华东',
                value: 'east',
                children: [
                    { label: '上海', value: 'shanghai' },
                    { label: '浙江', value: 'zhejiang' },
                ]
            },
            {
                label: '华南',
                value: 'south',
                children: [
                    { label: '广东', value: 'guangdong' },
                    { label: '福建', value: 'fujian' },
                ]
            }
        ]
    }
]

<CascaderMultiple dataSource={multiLevelData} />

// 迁移后
import { CascaderMultiple } from '@sfe/wand-rn'

const multiLevelData = [
    {
        label: '地区',
        value: 'region',
        children: [
            {
                label: '华东',
                value: 'east',
                children: [
                    { label: '上海', value: 'shanghai' },
                    { label: '浙江', value: 'zhejiang' },
                ]
            },
            {
                label: '华南',
                value: 'south',
                children: [
                    { label: '广东', value: 'guangdong' },
                    { label: '福建', value: 'fujian' },
                ]
            }
        ]
    }
]

<CascaderMultiple dataSource={multiLevelData} />
```

### 案例 6：搜索与过滤

```tsx
// 迁移前（无搜索功能）
import { CascaderMultiple } from '@sgfe/flower-rn'

<CascaderMultiple dataSource={largeDataList} />

// 迁移后（支持搜索过滤）
import { CascaderMultiple } from '@sfe/wand-rn'

<CascaderMultiple 
    dataSource={largeDataList}
    showFilter={true}  // 显示搜索栏，用户可输入关键词快速找到选项
/>
```

### 案例 7：初始值设置

```tsx
// 迁移前
import { CascaderMultiple } from '@sgfe/flower-rn'

const initialValue = {
    'category1': ['option1-1', 'option1-2'],
    'category2': ['option2-1']
}

<CascaderMultiple
    dataSource={data}
    value={initialValue}
    onConfirm={(value) => console.log('最终选择:', value)}
/>

// 迁移后
import { CascaderMultiple } from '@sfe/wand-rn'

const initialValue = {
    'category1': ['option1-1', 'option1-2'],
    'category2': ['option2-1']
}

<CascaderMultiple
    dataSource={data}
    value={initialValue}
    onConfirm={(value) => console.log('最终选择:', value)}
/>
```

### 案例 8：完整示例

```tsx
// 迁移前
import { CascaderMultiple } from '@sgfe/flower-rn'
import { useState } from 'react'

export const CascaderExample = () => {
    const [selected, setSelected] = useState({})

    const data = [
        {
            label: '分类A',
            value: 'categoryA',
            children: [
                { label: 'A1', value: 'a1' },
                { label: 'A2', value: 'a2' },
                { label: 'A3', value: 'a3' },
            ]
        },
        {
            label: '分类B',
            value: 'categoryB',
            children: [
                { label: 'B1', value: 'b1' },
                { label: 'B2', value: 'b2' },
            ]
        }
    ]

    return (
        <CascaderMultiple
            dataSource={data}
            value={selected}
            confirmText="确认选择"
            resetText="清空选择"
            onConfirm={(value) => {
                setSelected(value)
                console.log('选择完成:', value)
            }}
            onReset={(value) => {
                setSelected(value)
                console.log('已清空')
            }}
        />
    )
}

// 迁移后
import { CascaderMultiple } from '@sfe/wand-rn'
import { useState } from 'react'

export const CascaderExample = () => {
    const [selected, setSelected] = useState({})

    const data = [
        {
            label: '分类A',
            value: 'categoryA',
            children: [
                { label: 'A1', value: 'a1' },
                { label: 'A2', value: 'a2' },
                { label: 'A3', value: 'a3' },
            ]
        },
        {
            label: '分类B',
            value: 'categoryB',
            children: [
                { label: 'B1', value: 'b1' },
                { label: 'B2', value: 'b2' },
            ]
        }
    ]

    return (
        <CascaderMultiple
            dataSource={data}
            value={selected}
            confirmText="确认选择"
            resetText="清空选择"
            showFilter={true}  // 新增：启用搜索功能
            onConfirm={(value) => {
                setSelected(value)
                console.log('选择完成:', value)
            }}
            onReset={(value) => {
                setSelected(value)
                console.log('已清空')
            }}
        />
    )
}
```

### 案例 9：通过搜索快速查找

```tsx
// 迁移后：用户可以在搜索栏输入关键词快速查找
import { CascaderMultiple } from '@sfe/wand-rn'

const largeDataSet = [
    {
        label: '产品分类',
        value: 'product',
        children: [
            {
                label: '电子产品',
                value: 'electronics',
                children: [
                    { label: '手机', value: 'phone' },
                    { label: '平板', value: 'tablet' },
                    { label: '笔记本', value: 'laptop' },
                ]
            },
            {
                label: '生活用品',
                value: 'daily',
                children: [
                    { label: '洗化', value: 'wash' },
                    { label: '食品', value: 'food' },
                ]
            }
        ]
    }
]

<CascaderMultiple
    dataSource={largeDataSet}
    showFilter={true}  // 启用搜索
    onConfirm={(value) => console.log('选择:', value)}
/>

// 用户可以：
// - 输入 '手机' 快速找到手机选项
// - 输入 '电子' 快速找到电子产品分类
// - 输入 '洗' 快速找到洗化选项
```

## 关键点

- ✅ **核心 API 保持兼容**：`value`、`dataSource`、`confirmText`、`resetText` 等基础 Props 完全不变
- ✅ **回调函数保持一致**：`onConfirm` 和 `onReset` 的签名和行为不变
- ✅ **新增搜索功能**：`showFilter` 属性提供强大的搜索/过滤能力（可选使用）
- ✅ **按钮布局改进**：内部使用 ButtonBar 优化布局
- ✅ **样式系统升级**：集成 WithTheme 系统提供更好的主题支持
- ✅ **数据处理改进**：更稳定的数据过滤和默认选中逻辑
- 🔄 **迁移难度**：**极低** - 直接修改导入路径即可，无需修改业务逻辑

## 迁移步骤

1. **更新导入路径**：`@sgfe/flower-rn` → `@sfe/wand-rn`
2. **可选启用搜索功能**：
   - 如果需要搜索功能，添加 `showFilter={true}`
   - 否则保持默认 `showFilter={false}` 或不设置
3. **测试验证**：确保级联选择功能正常
4. **享受新功能**：可以使用新的搜索/过滤功能提升用户体验

## 搜索功能详解

### 搜索工作原理

当 `showFilter={true}` 时：
1. 顶部显示搜索输入框
2. 用户输入关键词
3. 组件实时过滤数据源
4. 只显示包含匹配关键词的叶节点及其所有父节点
5. 支持大小写不敏感搜索

### 搜索示例

数据结构：
```
地区
├─ 华东
│  ├─ 上海
│  └─ 浙江
└─ 华南
   ├─ 广东
   └─ 福建
```

搜索结果：
- 搜索 "上"：显示 地区 → 华东 → 上海
- 搜索 "南"：显示 地区 → 华南 及其子项
- 搜索 "浙"：显示 地区 → 华东 → 浙江

### 什么时候使用搜索

- 数据项目很多（>50项）时推荐启用
- 用户需要快速查找特定项时
- 移动端用户体验要求高时

## Value 数据结构说明

```tsx
// Value 是一个对象，键是父级的 value，值是该父级下选中的子项 value 数组
type Value = {
    [parentValue: string | number]: (string | number)[]
}

// 示例
{
    'category1': ['option1-1', 'option1-2'],  // 在 category1 下选中了两项
    'category2': ['option2-1']                 // 在 category2 下选中了一项
}
```
