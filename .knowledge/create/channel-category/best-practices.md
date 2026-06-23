# 渠道类目模块最佳实践

> 模块的最佳实践，帮助 AI 设计时参考"渠道类目模块技术实现的最佳实践"。
> 由团队成员填写并维护，随业务演进持续更新。
>
> **重要**：此文件直接影响 AI 理解业务逻辑的准确性，请确保内容准确完整。

## 渠道类目属性表单字段值传入和更新规范

### 核心设计模式

渠道类目属性表单字段（renderer 组件）遵循**回调通知**的统一模式，所有组件的值传入和更新遵循以下共性：

### 1. 值传入方式（Input）

#### 统一特征

- **统一的 value prop**：所有 renderer 组件接收的值都是 `ChannelDynamicInfoVOList` 对象或其衍生结构
- **嵌套路径访问**：从对象的特定字段中提取具体值
  - `customValue`：用户填写的当前值（数组结构）
  - `customValue[0]`：获取数组中第一个元素
  - 对于数字+单位类型：`value?.inputValue` 和 `value?.optionValue` 分别获取数字和单位

#### 示例

**Input 类型：**
```typescript
// 来自 get-dynamic-info-renderer.tsx
<Input
    maxLength={item.maxTextLength}
    onBlur={(e) => {
        requestCustomValueChange?.(e.target.value, item.attrId, true);
    }}
/>
```
值来源：通过 onBlur 事件从 Input 组件捕获

**NumberWithUnit 组件：**
```typescript
// 来自 number-with-unit/index.tsx
const { value = {}, maxTextLength, optionList = [], onChange } = props;
const defaultNumber = isEmpty(value?.inputValue) ? '' : value?.inputValue;
const defaultUnit = value?.optionValue || '';
```
值来源：解构 `value` 对象获取 `inputValue` 和 `optionValue`

**MeasureInput 组件：**
```typescript
// 来自 measure-input/index.tsx
export interface Value {
    inputValue?: string;
    optionValue?: string;
}
const { value = {}, onChange } = props;
```
值结构：使用对象包裹多个相关字段

### 2. 值更新方式（Output）

#### 统一特征

- **requestCustomValueChange 触发值更新**：所有字段组件最终通过 `requestCustomValueChange` 回调触发值更新
- **回调参数结构**：
  - 单一值类型：直接传递值
  - 复合值类型：传递对象结构 `{ label, value }` 或 `{ inputValue, optionValue }`
  - 结构化类型：传递完整的结构体对象
- **两层回调模式**：
  1. 组件内部回调：`onChange(value)` 或 `requestCustomValueChange(customValue, attrId)`
  2. 顶层集中处理：在 `get-dynamic-info-renderer.tsx` 中统一封装

#### 示例

**简单类型（Input）：**
```typescript
// 直接传递字符串值
requestCustomValueChange?.(e.target.value, item.attrId, true);
```

**复合值类型（NumberWithUnit）：**
```typescript
// 传递对象结构
// 这是一个错误的组件实现，不应该使用 onChange，而应该和其他组件保持统一使用 requestCustomValueChange 进行值更新
onChange?.({
    inputValue: number,
    optionValue: unitValue,
});
```

**日期类型（TIME_RANGE）：**
```typescript
// 传递数组结构
requestCustomValueChange?.(
    timeList.map((time) => ({
        value: 0,
        label: time as string,
    })),
    item.attrId,
);
```

**结构化类型：**
```typescript
// 传递完整结构体
requestCustomValueChange?.(
    customValue as unknown as StructAttrCustomValue,
    item?.attrId
);
```

### 3. 核心规范和模式

#### 规范 1：值的状态管理位置

**通知型（推荐）✅**
- 组件自己维护内部 DOM 状态（Input 的输入值、Select 的选中项等）
- 通过事件回调（`onBlur`、`onChange`）调用 `requestCustomValueChange`

**代表组件：Input、Select、DatePicker**

```typescript
// 推荐模式：直接在事件中调用 requestCustomValueChange
<Input
    maxLength={item.maxTextLength}
    onBlur={(e) => {
        requestCustomValueChange?.(e.target.value, item.attrId, true);
    }}
    placeholder="请输入"
/>
```

#### 规范 2：值的构造和解构

- **对象类型值**：使用明确的接口定义，如 `Value { inputValue?, optionValue? }`
- **数组类型值**：统一使用 `customValue: Array<{ attrValueId, attrValue }>`
- **复杂结构**：使用完整的类型定义，避免 `any` 类型

**规范做法：**
```typescript
// measure-input 定义明确的 Value 接口
interface Value {
    inputValue?: string;
    optionValue?: string;
}

// MeasureInput 只需处理两个字段
const handleValueChange = (val: string, field: 'inputValue' | 'optionValue') => {
    onChange?.({
        ...value,
        [field]: val,
    });
};
```

#### 规范 3：特殊场景的值处理

**1. 清空/重置值：**
```typescript
// MeasureInput
if (isNil(val)) {
    onChange?.({});  // 传递空对象表示清空
} else {
    onChange?.({ ...value, [field]: val });
}
```

**2. 空值判断：**
```typescript
// NumberWithUnit
const defaultNumber = isEmpty(value?.inputValue) ? '' : value?.inputValue;
// 使用 lodash isEmpty 而不是 falsy 检查，避免 0 被认为是空
```

**3. 值同步和依赖：**
```typescript
// MeasureInput - 单位值改变时，输入值校验规则也改变
const { ruleMaxValue, ruleMinValue } = useMemo(() => {
    if(isNil(value?.optionValue)) return { ruleMaxValue: undefined, ruleMinValue: undefined };
    const matchedRule = unitRuleList?.find(rule => rule?.unitId === value?.optionValue);
    // 根据单位查找对应的最大/最小值
    const maxValue = matchedRule?.max ?? max;
}, [unitRuleList, value, max, min]);
```

#### 规范 4：回调的触发时机

| 组件类型 | 触发时机 | 说明 |
|---------|--------|------|
| Input | onBlur | 避免实时频繁触发，提升性能 |
| Select | onChange | 选择立即触发 |
| DatePicker | onChange | 选择立即触发 |
| 搜索型 | debounceWait:500ms | 使用防抖避免频繁请求 |
| 输入框 | onBlur | 聚焦失焦时同步 |
| 复合型 | onChange (子字段) | 任一字段改变时触发 |

### 4. 实现检查清单

**推荐方案（通知型模式）：**

- [ ] 组件外部调用 `requestCustomValueChange`
- [ ] 值来自 DOM 事件对象，通过 `onBlur`/`onChange` 等事件捕获
- [ ] 回调触发时机合理（onBlur vs onChange vs debounce）

**如果必须使用受控型模式（应尽量避免）：**

- [ ] **值接口定义**：明确定义 props 中 value 的结构
- [ ] **值的获取**：正确提取嵌套路径的值，使用 `isEmpty` 而非 falsy 检查
- [ ] **值的初始化**：提供合理的默认值
- [ ] **onChange 回调**：
  - [ ] 明确回调参数结构（对象/数组/原始值）
  - [ ] 在 renderer 层正确转换，调用 `requestCustomValueChange`
- [ ] **依赖同步**：使用 useUpdateEffect 处理外部 props 变化
- [ ] **特殊值处理**：null/undefined/空字符串/0 等边界情况

### 5. 反模式与陷阱

| 反模式 | 原因 | 正确做法 |
|-------|------|--------|
| renderer 层使用中间层 onChange | 添加不必要的复杂性，模式不统一 | 组件内部直接调用 `requestCustomValueChange`，无需中间转换 |
| 组件维护 value 状态再经 onChange 转换 | 状态同步困难，维护成本高 | 使用通知型模式，直接从事件捕获值 |
| 使用 `!!value` 判断空值 | 0 会被认为是空 | 使用 `isEmpty(value)` 或 `isNil(value)` |
| onChange 中频繁 setState | 导致多次重渲染 | 在 onBlur 或 useUpdateEffect 中同步 |
| value 对象直接作为依赖 | 对象引用变化导致不必要更新 | 使用具体字段作为依赖 `[value?.inputValue]` |
| 在 renderer 中使用受控组件再转换 | 增加 renderer 层复杂度 | 让组件自己决定是否需要受控，统一调用 `requestCustomValueChange` |

---
