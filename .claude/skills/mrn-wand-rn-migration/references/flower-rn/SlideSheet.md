# SlideSheet 选择弹窗

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export type SlideSelectOption<TValue> = {
  label: React.ReactNode;
  value: TValue;
  enabled?: boolean;
}

interface SlideSelectProps<TValue> {
  title?: string;
  visible?: boolean;
  loading?: boolean;
  contentTestId?: string;
  options: SlideSelectOption<TValue>[];
  value?: TValue;
  searchable?: boolean;
  placeholder?: string;
  keywords?: string;
  onSelect?: (value: TValue, index: number) => void;
  onClose: () => void;
  empty?: React.ReactNode;
}
```

## 新组件 API

```tsx
export type SlideSelectOption<TValue> = {
  label: string | React.ReactNode;
  subLabel?: string;
  value: TValue;
  enabled?: boolean;
}

interface SlideSelectProps<TValue> {
  visible?: boolean;
  title: string;
  value?: TValue | TValue[];
  multiple?: boolean;
  loading?: boolean;
  options: SlideSelectOption<TValue>[];
  searchable?: boolean;
  placeholder?: string;
  keywords?: string;
  empty?: string | React.ReactNode;
  testID?: string;
  onSelect?: (value: TValue, index: number) => void;
  onChange?: (values: TValue[]) => void;
  onConfirm?: (values: TValue[]) => void;
  onReset?: (values: TValue[]) => void;
  onClose?: () => void;
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| contentTestId | testID | 测试 ID 属性名变更 |
| onSelect | onSelect | 单选时保持不变，但多选模式会配合 onChange 使用 |
| onClose | onClose | 关闭回调，但在多选模式下变为可选 |
| - | multiple | 新增：支持多选模式，默认为 false |
| - | onChange | 新增：多选模式下的值变化回调 |
| - | onConfirm | 新增：多选模式下点击确定按钮的回调 |
| - | onReset | 新增：多选模式下点击重置按钮的回调 |
| value | value | 多选时可以传递数组，单选时传递单个值 |
| - | subLabel | 新增：选项副标题，支持在列表项中显示次要信息 |
| title | title | 从可选变为必需属性 |

## 功能差异对比

### 1. 选择模式

| 特性 | 旧组件 | 新组件 |
|------|--------|--------|
| 单选模式 | 固定支持 | 默认支持（multiple = false） |
| 多选模式 | 计划功能（注释中提到二期） | 原生支持（multiple = true） |
| 多选确认 | 无（自动关闭） | 通过 onConfirm 回调，需手动关闭 |
| 多选重置 | 无 | 通过 onReset 回调支持 |

### 2. 搜索功能

| 特性 | 旧组件 | 新组件 |
|------|--------|--------|
| 搜索框组件 | TextInput | SearchBar（更完善的搜索组件） |
| 全选功能 | 无 | 多选模式下支持全选搜索结果 |
| 输入清除 | 无专门方法 | onClear 回调 |

### 3. 选项列表

| 特性 | 旧组件 | 新组件 |
|------|--------|--------|
| 副标题显示 | 不支持 | 支持 subLabel |
| 选项禁用状态 | enabled: false | enabled: false（兼容） |
| 选项高亮显示 | 自动高亮搜索关键词 | 自动高亮搜索关键词 |

## 迁移示例

### 案例 1：基础单选

```tsx
// 迁移前
<SlideSheet
  visible={visible}
  title="请选择"
  value={selectedValue}
  options={[
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
  ]}
  onSelect={(value, index) => {
    console.log('selected', value, index)
  }}
  onClose={() => {
    setVisible(false)
  }}
/>

// 迁移后（保持不变）
<SlideSheet
  visible={visible}
  title="请选择"
  value={selectedValue}
  options={[
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
  ]}
  onSelect={(value, index) => {
    console.log('selected', value, index)
  }}
  onClose={() => {
    setVisible(false)
  }}
/>
```

### 案例 2：带搜索的单选

```tsx
// 迁移前
<SlideSheet
  visible={visible}
  title="搜索选择"
  searchable={true}
  placeholder="输入搜索"
  keywords={searchKeywords}
  options={options}
  onSelect={(value) => {
    handleSelect(value)
    setVisible(false)
  }}
  onClose={() => {
    setVisible(false)
  }}
/>

// 迁移后
<SlideSheet
  visible={visible}
  title="搜索选择"
  searchable={true}
  placeholder="输入搜索"
  keywords={searchKeywords}
  options={options}
  onSelect={(value) => {
    handleSelect(value)
    onClose()
  }}
  onClose={() => {
    setVisible(false)
  }}
/>
```

### 案例 3：多选模式（新增功能）

```tsx
// 迁移前（不支持，使用计划中的功能）
// 不能直接使用，需要自行处理多选逻辑

// 迁移后（原生支持）
<SlideSheet
  visible={visible}
  title="多选"
  multiple={true}
  value={selectedValues}  // 传递数组
  options={options}
  onChange={(values) => {
    setSelectedValues(values)
  }}
  onConfirm={(values) => {
    console.log('确认选择', values)
    handleConfirm(values)
  }}
  onReset={(values) => {
    console.log('重置到初始值', values)
  }}
  onClose={() => {
    setVisible(false)
  }}
/>
```

### 案例 4：带加载状态和自定义空状态

```tsx
// 迁移前
<SlideSheet
  visible={visible}
  title="加载中"
  loading={loading}
  options={options}
  empty={<CustomEmptyView />}
  onClose={() => {
    setVisible(false)
  }}
/>

// 迁移后（API 保持一致）
<SlideSheet
  visible={visible}
  title="加载中"
  loading={loading}
  options={options}
  empty={<CustomEmptyView />}
  testID="slide-sheet-loading"
  onClose={() => {
    setVisible(false)
  }}
/>
```

### 案例 5：选项禁用和副标题

```tsx
// 迁移前
<SlideSheet
  visible={visible}
  title="选项管理"
  options={[
    { label: '启用选项', value: 1 },
    { label: '禁用选项', value: 2, enabled: false },
  ]}
  onClose={() => {
    setVisible(false)
  }}
/>

// 迁移后（新增副标题功能）
<SlideSheet
  visible={visible}
  title="选项管理"
  options={[
    { label: '启用选项', value: 1, subLabel: '这是主要选项' },
    { label: '禁用选项', value: 2, enabled: false, subLabel: '此选项已禁用' },
  ]}
  onClose={() => {
    setVisible(false)
  }}
/>
```

## 关键迁移点

1. **属性重命名**：`contentTestId` → `testID`
2. **必需属性变更**：`title` 从可选变为必需
3. **多选支持**：新组件原生支持多选，旧组件需要自行实现
4. **回调函数变更**：
   - 单选时 `onSelect` 保持不变
   - 多选时需要使用 `onChange` 跟踪值变化
   - 多选确认使用 `onConfirm`，多选重置使用 `onReset`
5. **搜索框升级**：从 `TextInput` 升级为 `SearchBar` 组件，功能更完善
6. **新增功能**：
   - `multiple` 属性支持多选模式
   - `subLabel` 支持选项副标题
   - `onChange` 回调用于多选值追踪
   - `onConfirm`/`onReset` 用于多选操作
7. **值类型变更**：`value` 可以接收 `TValue | TValue[]`，根据 `multiple` 模式自动处理
8. **搜索功能增强**：新组件在多选模式下支持"全选搜索结果"功能

## 迁移建议

### 如果只使用单选模式
迁移成本最低，只需要改动以下几点：
- 将 `contentTestId` 改为 `testID`
- 确保 `title` 属性存在（从可选变为必需）

### 如果需要使用多选模式
- 添加 `multiple={true}`
- 将 `value` 改为接收数组
- 移除 `onSelect`，使用 `onChange` 跟踪值变化
- 添加 `onConfirm` 处理确认逻辑

### 搜索功能
新组件的搜索框自动处理，更加友好。在多选模式下，还会显示"全选搜索结果"的 checkbox，可以快速全选当前搜索结果。
