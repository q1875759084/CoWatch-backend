# OptionItem 选项数据类型

## 从何处迁移
- **源库**: `@mtfe/empower-fulfillment-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧数据类型 API

```tsx
interface OptionItem {
    label: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
}
```

**说明**:
- `label`: 选项显示的文本标签
- `value`: 选项对应的值，可以是任意类型

## 新数据类型 API

```tsx
type SlideSelectOption<TValue> = {
    label: string | React.ReactNode
    subLabel?: string
    // type?: 'radio' | 'checkbox'
    value: TValue
    enabled?: boolean
}
```

**说明**:
- `label`: 选项显示的文本或 React 组件，支持更丰富的展示方式
- `subLabel`: 可选的副标签，用于显示额外信息（如价格、描述等）
- `value`: 选项对应的值，支持泛型约束
- `enabled`: 可选，控制单个选项是否可用（默认为 `true`）

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| label | label | 保持属性名不变，但支持 React.ReactNode 类型 |
| value | value | 保持属性名不变，但支持泛型约束，更强的类型安全 |
| N/A | subLabel | 新增，用于显示副标签信息 |
| N/A | enabled | 新增，控制选项是否可用，不可用选项禁止交互和选择 |

## 迁移示例

### 案例 1：基础选项迁移

```tsx
// 迁移前
const options: OptionItem[] = [
    { label: '北京', value: 'BJ' },
    { label: '上海', value: 'SH' },
    { label: '深圳', value: 'SZ' }
]

// 迁移后
const options: SlideSelectOption<string>[] = [
    { label: '北京', value: 'BJ' },
    { label: '上海', value: 'SH' },
    { label: '深圳', value: 'SZ' }
]
```

### 案例 2：带子标签的选项

```tsx
// 迁移前（不支持）
const options: OptionItem[] = [
    { label: '商品A', value: 'A' },
    { label: '商品B', value: 'B' }
]

// 迁移后（支持子标签）
const options: SlideSelectOption<string>[] = [
    { 
        label: '商品A', 
        subLabel: '¥99.99',
        value: 'A' 
    },
    { 
        label: '商品B', 
        subLabel: '¥199.99',
        value: 'B' 
    }
]
```

### 案例 3：带禁用状态的选项

```tsx
// 迁移前（不支持禁用状态）
const options: OptionItem[] = [
    { label: '商品A', value: 'A' },
    { label: '商品B（缺货）', value: 'B' }
]

// 迁移后（支持禁用状态）
const options: SlideSelectOption<string>[] = [
    { 
        label: '商品A',
        value: 'A',
        enabled: true  // 可用
    },
    { 
        label: '商品B（缺货）',
        value: 'B',
        enabled: false  // 禁用，不可选
    }
]
```

### 案例 4：复杂对象值的选项

```tsx
// 迁移前
interface Product {
    id: number
    name: string
    price: number
}

const options: OptionItem[] = [
    { label: '商品A', value: { id: 1, name: 'A', price: 99 } },
    { label: '商品B', value: { id: 2, name: 'B', price: 199 } }
]

// 迁移后（使用泛型约束）
const options: SlideSelectOption<Product>[] = [
    { 
        label: '商品A', 
        subLabel: '¥99',
        value: { id: 1, name: 'A', price: 99 } 
    },
    { 
        label: '商品B', 
        subLabel: '¥199',
        value: { id: 2, name: 'B', price: 199 } 
    }
]
```

### 案例 5：React 组件作为 label

```tsx
// 迁移前（不支持）
const options: OptionItem[] = [
    { label: '选项A', value: 'A' },
    { label: '选项B', value: 'B' }
]

// 迁移后（支持 React.ReactNode）
const options: SlideSelectOption<string>[] = [
    { 
        label: (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon type="star" />
                <Text>选项A</Text>
            </View>
        ),
        value: 'A'
    },
    { 
        label: (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon type="star" />
                <Text>选项B</Text>
            </View>
        ),
        value: 'B'
    }
]
```

## 关键变更点

1. **类型安全性提升**:
   - 旧版: `value: any`，没有类型约束
   - 新版: `value: TValue`，支持泛型，提供完整的类型安全性

2. **标签灵活性增强**:
   - 旧版: `label: string`，只支持纯文本
   - 新版: `label: string | React.ReactNode`，支持 React 组件

3. **新增属性**:
   - `subLabel`: 副标签，用于补充信息
   - `enabled`: 单个选项的启用/禁用状态控制

4. **搜索功能限制**:
   - 当 `label` 为 `React.ReactNode` 类型时，搜索功能会失效，仅支持字符串类型的 `label` 搜索

## 使用建议

1. **保持类型一致性**:
   - 在同一个 `options` 数组中，建议所有选项的 `value` 类型保持一致
   - 使用泛型参数明确指定 `SlideSelectOption<T>` 的类型

2. **合理利用子标签**:
   - 当选项需要展示额外信息时，使用 `subLabel` 而不是修改 `label`
   - 保持 `label` 简洁，`subLabel` 放置辅助信息

3. **禁用状态的使用**:
   - 当选项不可选时（如缺货、已过期等），将 `enabled` 设为 `false`
   - 新组件会自动处理禁用状态的样式和交互

4. **搜索和 ReactNode**:
   - 如果需要搜索功能，`label` 必须为字符串类型
   - 如果 `label` 为 ReactNode，可以配合 `subLabel` 提供搜索信息

## 兼容性说明

- 目标库 `@sfe/wand-rn` 的 `SlideSelectOption` 基于 TypeScript 泛型实现
- 由于新增了 `enabled` 属性和 `React.ReactNode` 支持，旧的纯数据对象可以直接迁移
- 搜索功能仅支持 `string` 类型的 `label`，`React.ReactNode` 类型会跳过搜索过滤
- 新组件会自动处理禁用状态的样式和交互（变灰、无法点击等）
