# SlideSheet 底部滑出面板

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 重要说明

**源组件和目标组件定位差异较大：**
- 旧组件 SlideSheet 是一个**通用的底部滑出容器**，渲染任意 children 内容
- 新组件 SlideSheet 是一个**带选项列表的底部选择器**，内置单选/多选、搜索、空态等功能

对于仅需要通用底部弹出容器的场景，应使用 wand-rn 的 `BottomModal` 组件代替，而非 `SlideSheet`。

## 旧组件 API

```tsx
import { SlideSheet } from '@mtfe/empower-mrn-components'

interface SlideSheetProps extends ViewProps {
    onBlankPressed: () => void         // 必填，点击空白区域的回调
    extraData?: any                     // 额外数据，变化时触发更新
    show: boolean                       // 必填，控制显隐
    noAnimationEndCallback?: boolean    // 是否阻止动画结束时触发 onBlankPressed
}

// 使用示例 - 通用容器
<SlideSheet show={visible} onBlankPressed={() => setVisible(false)}>
  <View>
    <Text>任意内容</Text>
  </View>
</SlideSheet>
```

## 新组件 API

### 方案 A：SlideSheet（选择器场景）

```tsx
import { SlideSheet } from '@sfe/wand-rn'

export interface SlideSelectProps<TValue> {
    visible?: boolean                   // 控制显隐，默认 false
    title: string                       // 必填，标题
    value?: TValue | TValue[]           // 选中值
    multiple?: boolean                  // 是否多选，默认 false
    loading?: boolean                   // 显示加载状态，默认 false
    options: SlideSelectOption<TValue>[] // 必填，选项列表
    searchable?: boolean                // 启用搜索，默认 false
    placeholder?: string                // 搜索框占位文字，默认 '请输入搜索信息'
    keywords?: string                   // 搜索关键词，默认 ''
    empty?: string | React.ReactNode    // 自定义空态组件
    testID?: string                     // 测试 ID
    onSelect?: (value: TValue, index: number) => void  // 单选回调
    onChange?: (values: TValue[]) => void               // 多选变更回调
    onConfirm?: (values: TValue[]) => void              // 确认按钮回调
    onReset?: (values: TValue[]) => void                // 重置按钮回调
    onClose?: () => void                                // 关闭回调
}

export type SlideSelectOption<TValue> = {
    label: string | React.ReactNode    // 选项标签
    subLabel?: string                   // 次级标签
    value: TValue                       // 选项值
    enabled?: boolean                   // 是否可用
}

// 使用示例 - 选择器
<SlideSheet
  visible={visible}
  title="选择类型"
  options={[
    { label: '选项一', value: 1 },
    { label: '选项二', value: 2 },
  ]}
  onSelect={(value) => handleSelect(value)}
  onClose={() => setVisible(false)}
/>
```

### 方案 B：BottomModal（通用容器场景）

```tsx
import { BottomModal } from '@sfe/wand-rn'

export interface BottomModalProps {
    visible?: boolean                   // 控制显隐
    title?: string                      // 标题
    onClose?: () => void                // 关闭回调
    children?: React.ReactNode          // 任意子内容
    // ...更多属性
}

// 使用示例 - 通用容器
<BottomModal visible={visible} onClose={() => setVisible(false)}>
  <View>
    <Text>任意内容</Text>
  </View>
</BottomModal>
```

## 迁移路线选择

| 旧组件用法 | 推荐迁移目标 | 说明 |
|-----------|------------|------|
| 渲染选项列表（单选/多选） | SlideSheet | 新组件内置选择功能 |
| 渲染任意自定义内容 | BottomModal | 通用容器，与旧组件定位一致 |

## 迁移对照表（通用容器场景 → BottomModal）

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| show | visible | 属性名变更 |
| onBlankPressed | onClose | 属性名变更，语义更明确 |
| children | children | 保持一致 |
| extraData | - | 移除，函数式组件自动响应 props 变化 |
| noAnimationEndCallback | - | 移除 |

## 迁移对照表（选择器场景 → SlideSheet）

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| show | visible | 属性名变更 |
| onBlankPressed | onClose | 属性名变更 |
| children | options | 不再渲染自定义 children，改为传入结构化数据 |
| - | title | 新增，标题（必填） |
| - | value | 新增，当前选中值 |
| - | multiple | 新增，多选模式 |
| - | searchable | 新增，搜索功能 |
| - | onSelect | 新增，单选回调 |
| - | onChange | 新增，多选变更回调 |
| - | onConfirm | 新增，确认回调 |
| - | onReset | 新增，重置回调 |
| - | loading | 新增，加载状态 |
| - | empty | 新增，空态组件 |

## 关键变更

### 1. 组件拆分

旧组件是一个简单的底部滑出容器（渲染 children），新版按职责拆分：
- **BottomModal**：通用底部弹出容器
- **SlideSheet**：带选择功能的底部选择器

### 2. 显隐属性名变更

`show` → `visible`

### 3. 关闭回调变更

`onBlankPressed` → `onClose`

### 4. 动画机制

旧组件使用 Animated.timing（400ms）自行管理动画，新组件委托 BottomModal 内部处理动画。

### 5. 最大高度

旧组件：80% 屏幕高度。新组件：由 BottomModal 控制，内容区最大 330px。

## 迁移示例

### 案例 1：通用容器（迁移到 BottomModal）

```tsx
// 迁移前
<SlideSheet show={visible} onBlankPressed={() => setVisible(false)}>
  <View style={{ padding: 16 }}>
    <Text>自定义内容</Text>
    <Button title="确定" onPress={handleConfirm} />
  </View>
</SlideSheet>

// 迁移后
<BottomModal visible={visible} onClose={() => setVisible(false)}>
  <View style={{ padding: 16 }}>
    <Text>自定义内容</Text>
    <Button title="确定" onPress={handleConfirm} />
  </View>
</BottomModal>
```

### 案例 2：简单单选列表（迁移到 SlideSheet）

```tsx
// 迁移前
<SlideSheet show={visible} onBlankPressed={() => setVisible(false)}>
  <View>
    <Text style={styles.title}>选择类型</Text>
    {options.map(item => (
      <TouchableOpacity key={item.id} onPress={() => onSelect(item)}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    ))}
  </View>
</SlideSheet>

// 迁移后
<SlideSheet
  visible={visible}
  title="选择类型"
  options={options.map(item => ({ label: item.name, value: item.id }))}
  onSelect={(value) => onSelect(value)}
  onClose={() => setVisible(false)}
/>
```

### 案例 3：多选列表（迁移到 SlideSheet）

```tsx
// 迁移前
<SlideSheet show={visible} onBlankPressed={() => setVisible(false)}>
  <View>
    <Text>多选标签</Text>
    {tags.map(tag => (
      <Checkbox key={tag.id} checked={selected.includes(tag.id)} onChange={() => toggle(tag.id)}>
        {tag.name}
      </Checkbox>
    ))}
    <Button title="确定" onPress={handleConfirm} />
  </View>
</SlideSheet>

// 迁移后
<SlideSheet
  visible={visible}
  title="多选标签"
  multiple
  value={selected}
  options={tags.map(tag => ({ label: tag.name, value: tag.id }))}
  onChange={(values) => setSelected(values)}
  onConfirm={(values) => handleConfirm(values)}
  onClose={() => setVisible(false)}
/>
```

### 案例 4：带搜索的选择器

```tsx
// 迁移前
<SlideSheet show={visible} onBlankPressed={() => setVisible(false)}>
  <View>
    <TextInput placeholder="搜索" onChangeText={setKeyword} />
    {filteredList.map(item => (
      <TouchableOpacity key={item.id} onPress={() => handleSelect(item)}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    ))}
  </View>
</SlideSheet>

// 迁移后
<SlideSheet
  visible={visible}
  title="搜索选择"
  searchable
  options={list.map(item => ({ label: item.name, value: item.id }))}
  onSelect={(value) => handleSelect(value)}
  onClose={() => setVisible(false)}
/>
```

### 案例 5：extraData 依赖

```tsx
// 迁移前 - extraData 用于触发内容更新
<SlideSheet
  show={visible}
  onBlankPressed={() => setVisible(false)}
  extraData={dataVersion}
>
  <MyContent data={data} />
</SlideSheet>

// 迁移后 - 函数式组件自动响应 props 变化，无需 extraData
<BottomModal visible={visible} onClose={() => setVisible(false)}>
  <MyContent data={data} />
</BottomModal>
```

### 案例 6：noAnimationEndCallback

```tsx
// 迁移前
<SlideSheet
  show={visible}
  onBlankPressed={() => setVisible(false)}
  noAnimationEndCallback={true}
>
  <Content />
</SlideSheet>

// 迁移后 - 新组件无此概念，直接使用 onClose
<BottomModal visible={visible} onClose={() => setVisible(false)}>
  <Content />
</BottomModal>
```

### 案例 7：带加载状态的选择器

```tsx
// 迁移前
<SlideSheet show={visible} onBlankPressed={() => setVisible(false)}>
  {loading ? (
    <LoadingIndicator show={true} />
  ) : (
    <OptionList options={options} onSelect={handleSelect} />
  )}
</SlideSheet>

// 迁移后 - loading 内置支持
<SlideSheet
  visible={visible}
  title="选择"
  loading={loading}
  options={options.map(o => ({ label: o.name, value: o.id }))}
  onSelect={handleSelect}
  onClose={() => setVisible(false)}
/>
```

### 案例 8：空态处理

```tsx
// 迁移前
<SlideSheet show={visible} onBlankPressed={() => setVisible(false)}>
  {list.length === 0 ? (
    <Text>暂无数据</Text>
  ) : (
    list.map(item => <Item key={item.id} {...item} />)
  )}
</SlideSheet>

// 迁移后 - empty 属性内置支持
<SlideSheet
  visible={visible}
  title="选择项目"
  options={list.map(item => ({ label: item.name, value: item.id }))}
  empty="暂无数据"
  onSelect={handleSelect}
  onClose={() => setVisible(false)}
/>
```

## 关键点

- **根据使用场景选择迁移目标**：通用容器 → BottomModal，选择列表 → SlideSheet。
- **show → visible**：属性名变更。
- **onBlankPressed → onClose**：属性名变更。
- **extraData 移除**：新组件为函数式组件，自动响应 props 变化。
- **noAnimationEndCallback 移除**：新组件无此概念。
- **新增选择功能**：新 SlideSheet 内置单选/多选、搜索、加载态、空态等，无需手动实现。
- **最大高度差异**：旧组件 80% 屏幕高度 vs 新组件 BottomModal 控制。

## 迁移策略

### 第一步：分析使用场景

检查每处 SlideSheet 的使用，判断属于哪种场景：
- **通用容器**（children 是自定义 UI）→ 迁移到 BottomModal
- **选择列表**（children 是选项列表 + 选择逻辑）→ 迁移到 SlideSheet

### 第二步：替换导入

```tsx
// 通用容器场景
// 替换前
import { SlideSheet } from '@mtfe/empower-mrn-components'
// 替换后
import { BottomModal } from '@sfe/wand-rn'

// 选择器场景
// 替换前
import { SlideSheet } from '@mtfe/empower-mrn-components'
// 替换后
import { SlideSheet } from '@sfe/wand-rn'
```

### 第三步：替换属性

1. `show` → `visible`
2. `onBlankPressed` → `onClose`
3. 移除 `extraData`、`noAnimationEndCallback`

### 第四步：重构内容（选择器场景）

如果迁移到新 SlideSheet，需要将手动实现的选择逻辑转换为 options 数据驱动。

### 第五步：验证

- 确认弹出/关闭动画正常
- 确认内容正确渲染
- 确认选择功能正常（如适用）
- 确认空态和加载态正常（如适用）

## 常见问题

### Q: 旧组件的 children 渲染方式在新 SlideSheet 中如何实现？
A: 新 SlideSheet 不支持自定义 children。如果需要渲染自定义内容，应使用 BottomModal 组件。

### Q: 旧组件的 onBlankPressed 和新组件的 onClose 有区别吗？
A: 语义上一致，都是关闭弹层的回调。新组件的 onClose 在点击遮罩、点击关闭按钮等场景都会触发。

### Q: extraData 移除后如何触发内容更新？
A: 新组件为函数式组件，任何 props 或 state 变化都会自动触发重新渲染，无需手动传入 extraData。

### Q: 如何同时使用通用容器和选择器？
A: 导入两个不同的组件即可：`import { BottomModal, SlideSheet } from '@sfe/wand-rn'`。

## 注意事项

1. **组件类型变化**：旧组件是 Class 组件，新组件是函数式组件。
2. **遮罩颜色差异**：旧组件遮罩为 rgba(0,0,0,0.60)，新组件由 BottomModal 控制。
3. **内容区背景**：旧组件固定白色背景 + 圆角，新组件由 BottomModal 提供。
4. **动画时长**：旧组件 400ms，新组件由 BottomModal 内部控制。
5. **ViewProps 继承**：旧组件继承 ViewProps，支持原生 View 属性。新组件不继承 ViewProps。
