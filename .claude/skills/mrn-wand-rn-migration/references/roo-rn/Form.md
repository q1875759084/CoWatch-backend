# Form 表单

## 从何处迁移
- **源库**: `@roo/roo-rn`
- **目标库**: `@sfe/wand-rn`

> **重要说明**：两个库的 Form 组件架构完全不同。roo-rn 的 Form 是基于 class 组件 + `async-validator` 的简单表单，通过 `model` + `rules` 外部管理数据。wand-rn 的 Form 是基于 `rc-field-form` 的完整表单解决方案，通过 `Form.useForm()` 创建表单实例，内部管理表单状态。

## 旧组件 API

```tsx
// Form 主组件
export interface FormProps extends WithThemeStyles<FormStyles> {
  /** 表单标题 */
  title?: string | JSX.Element
  /** 自定义样式 */
  style?: StyleProp<ViewStyle>
  /** 表单数据模型，配合 Form.Item 的 prop 使用 */
  model?: any
  /** 校验规则，参考 async-validator */
  rules?: any
}

// Form 实例方法（通过 ref 调用）
validate(callback: (valid: boolean, errors?: any) => void): void
validateField(prop: string, callback: (errors?: any) => void, triggers?: string): void

// Form.Item 子组件
export interface FormItemProps extends WithThemeStyles<FormStyles> {
  /** 表单数据模型 key */
  prop?: string
  /** 标签 */
  label?: string | JSX.Element
  /** 标签宽度 */
  labelWidth?: number  // 默认 60
  /** 是否双行布局 */
  vertical?: boolean
  /** 是否显示右侧箭头 */
  indicator?: boolean
  /** 是否显示校验错误 */
  showValidation?: boolean  // 默认 true
  /** 是否有下分割线 */
  hasLine?: boolean
  /** 加载时校验 */
  validateOnMount?: boolean
  /** 禁用控件 */
  disabled?: boolean
  /** 控件可编辑 */
  editable?: boolean
  /** label 附属文本 */
  attachedText?: string | JSX.Element
  /** 禁用时点击回调 */
  disabledCallback?: () => void
  /** 自定义渲染子元素 */
  renderChildren?: (valid: boolean, state: FormItemState, props: FormItemProps) => JSX.Element
}
```

## 新组件 API

```tsx
// Form 主组件（基于 rc-field-form）
export interface FormProps<Values = any> extends Omit<RcFormProps<Values>, 'form'> {
  /** 是否显示 label 后的冒号 */
  colon?: boolean  // 默认 true
  /** 表单名称 */
  name?: string
  /** label 对齐方式 */
  labelAlign?: 'left' | 'center' | 'right'  // 默认 'left'
  /** label 宽度 */
  labelWidth?: number  // 默认 100
  /** 表单实例 */
  form?: FormInstance<Values>
  /** 布局方式 */
  layout?: 'horizontal' | 'vertical'
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示验证信息 */
  showValidateMessage?: boolean  // 默认 true
  /** 表单默认值 */
  initialValues?: object
  /** 是否保留被删除字段的值 */
  preserve?: boolean  // 默认 true
  /** 验证提示模板 */
  validateMessages?: ValidateMessages
  /** 统一设置触发验证时机 */
  validateTrigger?: string | string[]  // 默认 'onChange'
  /** 子元素 */
  children?: React.ReactNode
  /** 提交成功回调 */
  onFinish?: (values) => void
  /** 字段更新回调 */
  onFieldsChange?: (changedFields, allFields) => void
  /** 提交失败回调 */
  onFinishFailed?: ({ values, errorFields, outOfDate }) => void
  /** 值变更回调 */
  onValuesChange?: (changedValues, values) => void
}

// FormInstance（通过 Form.useForm() 创建）
interface FormInstance {
  getFieldValue(name: NamePath): any
  getFieldsValue(nameList?: NamePath[]): any
  getFieldError(name: NamePath): string[]
  getFieldsError(nameList?: NamePath[]): FieldError[]
  isFieldsTouched(nameList?: NamePath[], allTouched?: boolean): boolean
  isFieldTouched(name: NamePath): boolean
  isFieldValidating(name: NamePath): boolean
  resetFields(fields?: NamePath[]): void
  setFields(fields: FieldData[]): void
  setFieldValue(name: NamePath, value: any): void
  setFieldsValue(values): void
  validateFields(nameList?: NamePath[]): Promise
  submit(): void
}

// Form.Item 子组件
export interface FormItemProps<Values = any> {
  /** 字段名 */
  name?: NamePath
  /** 标签 */
  label?: React.ReactNode
  /** label 对齐方式 */
  labelAlign?: 'left' | 'center' | 'right'
  /** label 宽度 */
  labelWidth?: number
  /** label 描述 */
  description?: React.ReactNode
  /** 是否显示冒号 */
  colon?: boolean
  /** 布局方式 */
  layout?: 'horizontal' | 'vertical'
  /** 校验规则 */
  rules?: Rule[]
  /** 是否必填 */
  required?: boolean
  /** 默认值 */
  initialValue?: any
  /** 设置依赖项 */
  dependencies?: NamePath[]
  /** 右侧箭头区域 */
  indicator?: React.ReactNode
  /** 底部线条 */
  hasLine?: boolean  // 默认 true
  /** 是否显示验证信息 */
  showValidateMessage?: boolean  // 默认 true
  /** 不使用样式 */
  noStyle?: boolean
  /** 保留字段值 */
  preserve?: boolean  // 默认 true
  /** 自定义字段更新逻辑 */
  shouldUpdate?: boolean | ((prev, cur) => boolean)
  /** 触发验证时机 */
  validateTrigger?: string | string[]
  /** 值属性名 */
  valuePropName?: string  // 默认 'value'
  /** 点击箭头回调 */
  onIndicatorPress?: () => void
  /** 自定义错误信息渲染 */
  renderErrorMessage?: (errorMessage?: string | null) => React.ReactNode
  /** 自定义样式 */
  style?: ViewStyle
  /** 是否隐藏 */
  hidden?: boolean
}

// Form.List — 动态字段列表
// Form.Header — 分组标题
// Form.Provider — 多表单联动
// Form.useForm() — 创建表单实例
// Form.useFormInstance() — 获取当前表单实例
// Form.useWatch() — 监听字段变化
```

## 迁移对照表

### Form 主组件

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| title | - | 移除，需自行实现标题 UI |
| model | initialValues | 从外部数据模型改为表单内部管理，初始值通过 initialValues 设置 |
| rules | - | 移除全局 rules，改为在 Form.Item 上单独设置 rules |
| style | - | 移除，Form 基于 rc-field-form 无渲染 UI |
| - | form | 新增，Form.useForm() 创建的表单实例 |
| - | colon | 新增，控制冒号显示 |
| - | name | 新增，表单名称 |
| - | labelAlign | 新增，全局 label 对齐 |
| - | labelWidth | 新增，全局 label 宽度（默认 100） |
| - | layout | 新增，全局布局方式 |
| - | initialValues | 新增，表单默认值 |
| - | validateTrigger | 新增，全局验证触发时机 |
| - | onFinish | 新增，提交成功回调 |
| - | onFinishFailed | 新增，提交失败回调 |
| - | onValuesChange | 新增，值变更回调 |

### Form 方法

| 旧方法 | 新方法 | 说明 |
|--------|--------|------|
| ref.validate(callback) | form.validateFields() | 从 callback 改为 Promise |
| ref.validateField(prop, cb) | form.validateFields([name]) | 参数从 prop 字符串改为 NamePath |
| - | form.getFieldValue(name) | 新增 |
| - | form.setFieldsValue(values) | 新增 |
| - | form.resetFields() | 新增 |
| - | form.submit() | 新增 |

### Form.Item

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| prop | name | 重命名，从字符串改为 NamePath（支持嵌套路径） |
| label | label | 保持一致，类型扩展为 React.ReactNode |
| labelWidth | labelWidth | 保持一致，默认值从 60 改为 100 |
| vertical | layout='vertical' | 从布尔值改为布局枚举 |
| indicator (boolean) | indicator (React.ReactNode) | 从布尔值改为自定义 ReactNode |
| showValidation | showValidateMessage | 重命名 |
| hasLine | hasLine | 保持一致，默认值从 false 改为 true |
| validateOnMount | - | 移除，使用 initialValue + rules 自动处理 |
| disabled | - | 移除单项禁用，在 Form 级别统一设置 |
| editable | - | 移除 |
| attachedText | description | 重命名 |
| disabledCallback | onIndicatorPress | 类似功能，但语义不同 |
| renderChildren | children (render props) | 改为标准 render props 模式 |
| - | name | 新增，取代 prop |
| - | rules | 新增，在 Item 上定义校验规则 |
| - | required | 新增，控制必填标识 |
| - | initialValue | 新增 |
| - | dependencies | 新增，依赖联动 |
| - | colon | 新增 |
| - | noStyle | 新增 |
| - | shouldUpdate | 新增 |
| - | validateTrigger | 新增 |
| - | renderErrorMessage | 新增 |

## 迁移示例

### 案例 1：基础表单

```tsx
// 迁移前
import { Form } from '@roo/roo-rn'
import { Input } from '@roo/roo-rn'

class MyForm extends React.Component {
  formRef = React.createRef()
  state = {
    model: { name: '', phone: '' },
    rules: {
      name: [{ required: true, message: '请输入姓名' }],
      phone: [{ required: true, message: '请输入手机号' }],
    }
  }

  handleSubmit = () => {
    this.formRef.current.validate((valid, errors) => {
      if (valid) {
        submit(this.state.model)
      }
    })
  }

  render() {
    return (
      <Form ref={this.formRef} model={this.state.model} rules={this.state.rules}>
        <Form.Item prop="name" label="姓名">
          <Input
            value={this.state.model.name}
            onChange={(val) => this.setState({ model: { ...this.state.model, name: val } })}
          />
        </Form.Item>
        <Form.Item prop="phone" label="手机号">
          <Input
            value={this.state.model.phone}
            onChange={(val) => this.setState({ model: { ...this.state.model, phone: val } })}
          />
        </Form.Item>
      </Form>
    )
  }
}

// 迁移后
import { Form, Input } from '@sfe/wand-rn'

const MyForm = () => {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      submit(values)
    } catch (errorInfo) {
      console.log('校验失败:', errorInfo)
    }
  }

  return (
    <Form form={form} initialValues={{ name: '', phone: '' }}>
      <Form.Item
        name="name"
        label="姓名"
        rules={[{ required: true, message: '请输入姓名' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="手机号"
        rules={[{ required: true, message: '请输入手机号' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  )
}
```

### 案例 2：校验规则迁移

```tsx
// 迁移前 — 全局定义 rules
const rules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入有效的邮箱地址' },
  ],
  age: [
    { required: true, message: '请输入年龄' },
    { type: 'number', min: 0, max: 150, message: '请输入有效年龄' },
  ],
}

<Form model={formData} rules={rules}>
  <Form.Item prop="email" label="邮箱">
    <Input />
  </Form.Item>
  <Form.Item prop="age" label="年龄">
    <Input />
  </Form.Item>
</Form>

// 迁移后 — 在 Form.Item 上定义 rules
<Form form={form}>
  <Form.Item
    name="email"
    label="邮箱"
    rules={[
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '请输入有效的邮箱地址' },
    ]}
  >
    <Input />
  </Form.Item>
  <Form.Item
    name="age"
    label="年龄"
    rules={[
      { required: true, message: '请输入年龄' },
      { type: 'number', min: 0, max: 150, message: '请输入有效年龄' },
    ]}
  >
    <Input />
  </Form.Item>
</Form>
```

### 案例 3：表单提交

```tsx
// 迁移前 — callback 模式
handleSubmit = () => {
  this.formRef.current.validate((valid, errors) => {
    if (valid) {
      console.log('提交数据:', this.state.model)
    } else {
      console.log('校验错误:', errors)
    }
  })
}

// 迁移后 — Promise 模式 + onFinish
const handleSubmit = async () => {
  try {
    const values = await form.validateFields()
    console.log('提交数据:', values)
  } catch ({ errorFields }) {
    console.log('校验错误:', errorFields)
  }
}

// 或使用 onFinish/onFinishFailed
<Form
  form={form}
  onFinish={(values) => console.log('提交数据:', values)}
  onFinishFailed={({ errorFields }) => console.log('校验错误:', errorFields)}
>
  ...
</Form>
```

### 案例 4：单字段校验

```tsx
// 迁移前
this.formRef.current.validateField('name', (errors) => {
  if (!errors) {
    console.log('name 校验通过')
  }
}, 'blur')

// 迁移后
try {
  await form.validateFields(['name'])
  console.log('name 校验通过')
} catch (errorInfo) {
  console.log('校验失败')
}
// 注意：trigger 参数不再支持，通过 Form.Item 的 validateTrigger 配置
```

### 案例 5：vertical 布局

```tsx
// 迁移前
<Form.Item prop="description" label="描述" vertical={true}>
  <TextArea />
</Form.Item>

// 迁移后
<Form.Item name="description" label="描述" layout="vertical">
  <TextArea />
</Form.Item>
```

### 案例 6：indicator 箭头

```tsx
// 迁移前
<Form.Item prop="city" label="城市" indicator={true}>
  <Text>{selectedCity}</Text>
</Form.Item>

// 迁移后
<Form.Item
  name="city"
  label="城市"
  indicator={<Icon type="right" />}
  onIndicatorPress={() => openCityPicker()}
>
  <Text>{selectedCity}</Text>
</Form.Item>
```

### 案例 7：禁用和附属文本

```tsx
// 迁移前
<Form.Item
  prop="idcard"
  label="身份证号"
  disabled={true}
  disabledCallback={() => Toast.show('该字段不可编辑')}
  attachedText="仅管理员可修改"
>
  <Input value={idcard} />
</Form.Item>

// 迁移后
<Form.Item
  name="idcard"
  label="身份证号"
  description="仅管理员可修改"
>
  <Input disabled />
</Form.Item>
// 注意：disabled 从 Form.Item 级别移至具体表单控件上
```

### 案例 8：动态表单（Form.List）

```tsx
// 迁移前 — roo-rn 不支持动态表单，需手动管理
const [items, setItems] = useState([{ name: '' }])

{items.map((item, index) => (
  <Form.Item key={index} prop={`item_${index}`} label={`项目 ${index + 1}`}>
    <Input value={item.name} onChange={(val) => updateItem(index, val)} />
  </Form.Item>
))}

// 迁移后 — 使用 Form.List
<Form.List name="items">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ name }) => (
        <Form.Item key={name} name={[name, 'itemName']} label={`项目 ${name + 1}`}>
          <Input />
        </Form.Item>
      ))}
      <Button onPress={() => add()}>添加项目</Button>
    </>
  )}
</Form.List>
```

### 案例 9：useWatch 监听字段

```tsx
// 迁移前 — 手动监听 model 变化
componentDidUpdate(prevProps, prevState) {
  if (prevState.model.type !== this.state.model.type) {
    // 根据 type 变化做联动
  }
}

// 迁移后 — 使用 Form.useWatch
const type = Form.useWatch('type', form)

useEffect(() => {
  if (type === 'other') {
    // 根据 type 变化做联动
  }
}, [type])
```

## 关键点

### 1. 表单状态管理模式完全不同
- **roo-rn**：外部管理数据（`model` 对象 + `setState`），Form 仅负责校验
- **wand-rn**：内部管理数据（`rc-field-form` 管理 store），通过 `Form.useForm()` 实例获取/设置值
- 不再需要手动 `setState` 更新表单值，子控件的值自动收集

### 2. 校验规则位置变更
- **roo-rn**：全局 `rules` 对象挂在 `<Form>` 上，以 `prop` 为 key
- **wand-rn**：每个 `<Form.Item>` 单独定义 `rules`
- 两者都基于 async-validator，规则语法兼容

### 3. 校验 API 从 callback 改为 Promise
- 旧：`form.validate((valid, errors) => {})`
- 新：`await form.validateFields()` 返回 Promise
- 新增 `onFinish`/`onFinishFailed` 回调

### 4. Class 组件 → Hooks
- roo-rn Form 是 class 组件，通过 `ref` 访问实例方法
- wand-rn Form 是函数组件，通过 `Form.useForm()` Hook 创建实例
- 新增 `Form.useFormInstance()`、`Form.useWatch()` 等 Hooks

### 5. Form.Item 字段标识变更
- `prop` → `name`，从字符串变为 `NamePath`（支持数组路径如 `['user', 'name']`）

### 6. 新增高级功能
- `Form.List`：动态增删字段列表
- `Form.Header`：分组标题
- `Form.Provider`：多表单联动
- `Form.useWatch`：响应式字段监听
- `dependencies`：字段依赖联动
- `shouldUpdate`：自定义更新逻辑

### 7. UI 层面差异
- roo-rn Form 渲染了标题、容器等 UI，有 `title`、`style` 属性
- wand-rn Form 使用 `rc-field-form`（`component={false}`），不渲染外层容器
- UI 布局通过 Form.Item 的 `layout`、`colon`、`labelWidth` 等属性控制

## 注意事项

1. **model 数据管理方式变更**：不再需要外部 state 管理表单值，`initialValues` 设置初始值，之后由 form 实例内部管理
2. **validateFields 使用 try-catch**：`form.validateFields()` 校验失败时会 reject，必须用 try-catch 捕获，否则 MRN 开发环境会红屏
3. **Form 不渲染容器**：wand-rn Form 设置了 `component={false}`，不会渲染 `<form>` 或 `<View>` 标签，如需容器样式需自行包裹 View
4. **trigger 机制变更**：旧版通过 `validateField(prop, cb, 'blur')` 指定 trigger，新版在 Form.Item 上配置 `validateTrigger`
5. **disabled 层级变更**：旧版在 Form.Item 上设置 `disabled`，新版需在具体表单控件上设置，或在 Form 级别统一禁用
6. **labelWidth 默认值变更**：从 60 改为 100
7. **hasLine 默认值变更**：从 false 改为 true

## 迁移检查清单

- [ ] 将 class 组件改为函数组件，引入 `Form.useForm()`
- [ ] 移除外部 `model` state 管理，改用 `initialValues` + form 实例
- [ ] 将全局 `rules` 拆分到各 `Form.Item` 的 `rules` 属性上
- [ ] 将 `Form.Item` 的 `prop` 替换为 `name`
- [ ] 将 `validate(callback)` 替换为 `await validateFields()` + try-catch
- [ ] 将 `validateField(prop, cb, trigger)` 替换为 `validateFields([name])`
- [ ] 移除 Form 的 `title` 属性，自行实现标题 UI
- [ ] 将 `vertical` 替换为 `layout="vertical"`
- [ ] 将 `indicator={true}` 替换为 `indicator={<Icon type="right" />}`
- [ ] 将 `attachedText` 替换为 `description`
- [ ] 将 `showValidation` 替换为 `showValidateMessage`
- [ ] 移除 `editable` 和 `disabledCallback`，在具体控件上设置 disabled
- [ ] 移除 `validateOnMount`，使用 initialValue + rules 处理
- [ ] 检查是否需要使用 Form.List 替代手动动态字段管理
- [ ] 检查是否需要 Form.useWatch 替代手动监听值变化
- [ ] 确认 `labelWidth` 默认值变更（60 → 100）对布局的影响
- [ ] 确认 `hasLine` 默认值变更（false → true）对样式的影响
- [ ] 测试表单提交、校验、重置等完整流程
