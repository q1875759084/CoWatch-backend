# SlideSelect 选择器弹窗

## 从何处迁移
- **源库**: `@mtfe/empower-fulfillment-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface OptionItem {
    label: string
    value: any
}

interface SlideSelectProps {
    title?: string  // 默认 '请选择'
    isVisible: boolean
    multiple?: boolean  // 默认 false，多选模式
    options: OptionItem[]
    selectedValues?: any[]  // 默认 []，选中的值
    allowNoneSelection?: boolean  // 默认 false，是否允许不选择
    onSelect?: (selectedValues: any[]) => void
    onClose?: () => void
}
```

## 新组件 API

```tsx
type SlideSelectOption<TValue> = {
    label: string | React.ReactNode
    subLabel?: string  // 子标签
    value: TValue
    enabled?: boolean  // 默认 true，是否可用
}

interface SlideSelectProps<TValue> {
    visible?: boolean  // 默认 false，是否显示
    title: string
    value?: TValue | TValue[]  // 选中值，多选时为数组
    multiple?: boolean  // 默认 false，多选模式
    loading?: boolean  // 默认 false，是否加载中
    options: SlideSelectOption<TValue>[]
    searchable?: boolean  // 默认 false，是否展示搜索框
    placeholder?: string  // 搜索框的 placeholder
    keywords?: string  // 搜索框输入的内容
    empty?: string | React.ReactNode  // 列表为空时的显示
    testID?: string
    onSelect?: (value: TValue, index: number) => void
    onChange?: (values: TValue[]) => void
    onConfirm?: (values: TValue[]) => void
    onReset?: (values: TValue[]) => void
    onClose?: () => void
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| isVisible | visible | 控制显隐的属性名更改 |
| selectedValues | value | 选中值属性名更改，单选或多选时可以是单值或数组 |
| multiple | multiple | 保持不变 |
| title | title | 保持不变 |
| options | options | 基本结构相同，但选项支持更多功能（如 subLabel、enabled） |
| onSelect | onSelect/onChange/onConfirm | 回调函数分离：单选时 onSelect 直接触发并关闭，多选时 onChange 处理变化，onConfirm 处理确认 |
| onClose | onClose | 保持不变 |
| allowNoneSelection | 无 | 新组件不再需要此属性，多选模式下默认支持不选 |
| N/A | searchable | 新增搜索功能 |
| N/A | loading | 新增加载状态 |
| N/A | enabled | 选项层级新增，可控制单个选项的启用/禁用状态 |

## 组件依赖变更

### 旧组件依赖
- `@ss/mtd-react-native` 中的 Radio、Checkbox、Icon
- `SlideSheet` 组件作为容器

### 新组件依赖
- `@sfe/wand-rn` 中的 BottomModal、Checkbox、Icon、Loading、SearchBar 等

## 迁移示例

### 案例 1：简单单选

```tsx
// 迁移前
import { SlideSelect } from '@mtfe/empower-fulfillment-mrn-components'

<SlideSelect
    title="选择城市"
    isVisible={isVisible}
    multiple={false}
    options={[
        { label: '北京', value: 'BJ' },
        { label: '上海', value: 'SH' },
        { label: '深圳', value: 'SZ' }
    ]}
    selectedValues={['BJ']}
    onSelect={(values) => {
        console.log('Selected:', values)
    }}
    onClose={() => setIsVisible(false)}
/>

// 迁移后
import { SlideSheet } from '@sfe/wand-rn'

<SlideSheet
    title="选择城市"
    visible={isVisible}
    multiple={false}
    options={[
        { label: '北京', value: 'BJ' },
        { label: '上海', value: 'SH' },
        { label: '深圳', value: 'SZ' }
    ]}
    value="BJ"
    onSelect={(value) => {
        console.log('Selected:', value)
    }}
    onClose={() => setIsVisible(false)}
/>
```

### 案例 2：多选模式

```tsx
// 迁移前
<SlideSelect
    title="选择标签"
    isVisible={isVisible}
    multiple={true}
    options={[
        { label: '热门', value: 'hot' },
        { label: '推荐', value: 'recommend' },
        { label: '最新', value: 'newest' }
    ]}
    selectedValues={['hot', 'recommend']}
    allowNoneSelection={true}
    onSelect={(values) => {
        console.log('Selected:', values)
    }}
    onClose={() => setIsVisible(false)}
/>

// 迁移后
<SlideSheet
    title="选择标签"
    visible={isVisible}
    multiple={true}
    options={[
        { label: '热门', value: 'hot' },
        { label: '推荐', value: 'recommend' },
        { label: '最新', value: 'newest' }
    ]}
    value={['hot', 'recommend']}
    onConfirm={(values) => {
        console.log('Selected:', values)
    }}
    onClose={() => setIsVisible(false)}
/>
```

### 案例 3：带搜索功能和加载状态

```tsx
// 迁移前（不支持搜索和加载状态）
<SlideSelect
    title="选择商品"
    isVisible={isVisible}
    multiple={true}
    options={productList}
    selectedValues={selectedProducts}
    onSelect={(values) => setSelectedProducts(values)}
    onClose={() => setIsVisible(false)}
/>

// 迁移后（支持搜索和加载状态）
<SlideSheet
    title="选择商品"
    visible={isVisible}
    multiple={true}
    options={productList}
    value={selectedProducts}
    searchable={true}
    placeholder="搜索商品名称"
    keywords={searchKeywords}
    loading={isLoading}
    onConfirm={(values) => setSelectedProducts(values)}
    onChange={(values) => console.log('临时选择:', values)}
    onClose={() => setIsVisible(false)}
/>
```

### 案例 4：选项中带子标签和禁用状态

```tsx
// 迁移后（新特性）
<SlideSheet
    title="选择商品"
    visible={isVisible}
    multiple={true}
    options={[
        { 
            label: '商品A', 
            subLabel: '¥99.99',
            value: 'A',
            enabled: true 
        },
        { 
            label: '商品B（缺货）', 
            subLabel: '¥199.99',
            value: 'B',
            enabled: false  // 禁用不可选
        }
    ]}
    value={selectedProducts}
    onConfirm={(values) => setSelectedProducts(values)}
    onClose={() => setIsVisible(false)}
/>
```

## 关键变更点

1. **组件名称**: `SlideSelect` → `SlideSheet`
   - 源库中的 SlideSelect 实际是对 SlideSheet 的包装

2. **属性名变更**:
   - `isVisible` → `visible`
   - `selectedValues` → `value`

3. **回调函数分离**（多选模式）:
   - 旧版: 所有变化都走 `onSelect`
   - 新版: 
     - `onChange`: 处理选项变化（在多选时实时触发）
     - `onConfirm`: 处理确认操作（点击确定按钮时触发）
     - `onReset`: 处理重置操作（点击重置按钮时触发）

4. **新增功能**:
   - `searchable`: 支持搜索过滤
   - `loading`: 加载状态
   - `enabled`: 单个选项的启用/禁用状态
   - `subLabel`: 选项副标题

5. **单选模式行为**:
   - 旧版: 点击选项后调用 `onSelect`，需要手动关闭
   - 新版: 点击选项后调用 `onSelect`，自动关闭弹窗（无重置和确定按钮）

6. **多选模式行为**:
   - 旧版: 需要点击确定按钮才能确认，使用 `onSelect` 回调
   - 新版: 有重置和确定按钮，使用 `onConfirm` 确认

7. **值类型处理**:
   - 旧版: `selectedValues` 始终为数组
   - 新版: `value` 可以是单值（单选时）或数组（多选时）

## 迁移步骤

1. 将导入改为: `import { SlideSheet } from '@sfe/wand-rn'`
2. 将 `<SlideSelect>` 改为 `<SlideSheet>`
3. 替换属性名: `isVisible` → `visible`, `selectedValues` → `value`
4. 根据多选/单选模式调整回调函数：
   - 单选: 使用 `onSelect`
   - 多选: 使用 `onConfirm` 处理最终选择结果
5. 如需搜索功能，添加 `searchable={true}` 和相关回调
6. 更新选项类型，确保与新的 `SlideSelectOption<T>` 兼容

## 兼容性说明

- 目标库 `@sfe/wand-rn` 的 SlideSheet 使用了函数式组件，而旧版 SlideSelect 使用了类组件
- 目标库基于 TypeScript 泛型实现，提供了更好的类型安全性
- 新组件支持 React.ReactNode 作为 label，但带有 ReactNode label 的选项不支持搜索过滤
