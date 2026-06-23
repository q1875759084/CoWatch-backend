# Form 表单

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
// Form 主组件
interface FormProps<Values = any> extends Omit<RcFormProps<Values>, 'form'> {
    colon?: boolean  // 默认 true，是否显示 label 后面的冒号
    name?: string  // 表单名称
    labelAlign?: FormLabelAlign  // label 对齐方式，默认 'right'
    labelWidth?: number  // label 宽度，默认 100
    form?: FormInstance<Values>  // Form 实例
    layout?: FormLayout  // 表单布局，默认 'horizontal'
    disabled?: boolean  // 是否禁用
    showValidateMessage?: boolean  // 默认 true，是否显示验证信息
}

// Form.Item
interface FormItemProps {
    colon?: boolean  // 默认 false
    dependencies?: NamePath[]  // 依赖字段
    getValueProps?: (value) => any  // 获取值属性
    initialValue?: any
    label?: React.ReactNode
    labelAlign?: FormLabelAlign  // 默认 'left'
    labelWidth?: number  // 默认 100
    layout?: FormLayout  // 默认 'horizontal'
    indicator?: React.ReactNode
    hasLine?: boolean  // 默认 false
    messageVariables?: Record<string, string>
    name?: NamePath[]
    normalize?: (value, prevValue, prevValues) => any
    noStyle?: boolean  // 默认 false
    preserve?: boolean  // 默认 true
    required?: boolean
    rules?: Rule[]
    shouldUpdate?: boolean | ((prevValues, curValues) => boolean)
    trigger?: string
    showValidateMessage?: boolean  // 默认 true
    validateFirst?: boolean | 'parallel'  // 默认 false
    validateTrigger?: string | string[]  // 默认 'onChange'
    valuePropName?: string  // 默认 'value'
    renderErrorMessage?: (errorMessage?: string | null) => React.ReactNode
    style?: ViewStyle
}

// 复合组件API
interface Form {
    Item: FormItem
    List: FormList
    useForm: () => [FormInstance]
    useFormInstance: () => FormInstance
    useWatch: (namePath: NamePath) => Value
    Provider: FormProvider
}
```

## 新组件 API

```tsx
// Form 主组件
interface FormProps<Values = any> extends Omit<RcFormProps<Values>, 'form'> {
    colon?: boolean  // 默认 true，是否显示 label 后面的冒号
    name?: string  // 表单名称
    labelAlign?: FormLabelAlign  // label 对齐方式，默认 'left'（改变）
    labelWidth?: number  // label 宽度，默认 100
    form?: FormInstance<Values>  // Form 实例
    layout?: FormLayout  // 表单布局，默认 'horizontal'
    disabled?: boolean  // 是否禁用
    showValidateMessage?: boolean  // 默认 true，是否显示验证信息
}

// Form.Item
interface FormItemProps {
    colon?: boolean  // 默认 false
    dependencies?: NamePath[]  // 依赖字段
    getValueProps?: (value) => any  // 获取值属性
    initialValue?: any
    label?: React.ReactNode
    labelAlign?: FormLabelAlign  // 默认 'left'
    labelWidth?: number  // 默认 100
    layout?: FormLayout  // 默认 'horizontal'
    description?: React.ReactNode  // 新增
    indicator?: React.ReactNode
    hasLine?: boolean  // 默认 true（改变）
    hasSpace?: boolean  // 新增
    messageVariables?: Record<string, string>
    name?: NamePath[]
    normalize?: (value, prevValue, prevValues) => any
    noStyle?: boolean  // 默认 false
    preserve?: boolean  // 默认 true
    required?: boolean
    rules?: Rule[]
    shouldUpdate?: boolean | ((prevValues, curValues) => boolean)
    trigger?: string
    showValidateMessage?: boolean  // 默认 true
    validateFirst?: boolean | 'parallel'  // 默认 false
    validateTrigger?: string | string[]  // 默认 'onChange'
    valuePropName?: string  // 默认 'value'
    renderErrorMessage?: (errorMessage?: string | null) => React.ReactNode
    style?: ViewStyle
}

// 复合组件API
interface Form {
    Item: FormItem
    Header: FormHeader  // 新增
    List: FormList
    useForm: () => [FormInstance]
    useFormInstance: () => FormInstance
    useWatch: (namePath: NamePath) => Value
    Provider: FormProvider
}

// 新增 Form.Header
interface FormHeaderProps {
    title?: string  // 分组标题
    children?: React.ReactNode  // 自定义标题内容
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| labelAlign 默认 'right' | labelAlign 默认 'left' | Form 默认 label 对齐方式改为左对齐 |
| 无 | description | Form.Item 新增描述字段属性 |
| hasLine 默认 false | hasLine 默认 true | Form.Item 默认显示底部线条 |
| 无 | hasSpace | Form.Item 新增 hasSpace 属性 |
| 无 | Form.Header | 新增 Form.Header 组件用于分组标题 |

## 关键变更

### 1. Form 的 labelAlign 默认值改变
**旧版本**：默认值为 `'right'`（右对齐）。

**新版本**：默认值改为 `'left'`（左对齐）。

```tsx
// 迁移前
<Form
  labelAlign="right"  // 默认就是 right
/>

// 迁移后，如需保持右对齐
<Form
  labelAlign="right"  // 需要显式设置
/>

// 或接受新的左对齐默认值
<Form />
```

### 2. Form.Item 的 hasLine 默认值改变
**旧版本**：默认值为 `false`（不显示底部线条）。

**新版本**：默认值改为 `true`（显示底部线条）。

```tsx
// 迁移前
<Form.Item
  name="username"
  label="用户名"
  // hasLine 默认为 false，无底部线条
/>

// 迁移后，如需隐藏底部线条
<Form.Item
  name="username"
  label="用户名"
  hasLine={false}  // 需要显式设置为 false
/>

// 或接受新的显示线条默认值
<Form.Item
  name="username"
  label="用户名"
  // hasLine 默认为 true，显示底部线条
/>
```

### 3. Form.Item 新增 description 属性
**新版本**增加了 `description` 属性，用于显示表单项的描述信息。

```tsx
// 新版本支持
<Form.Item
  name="email"
  label="邮箱"
  description="请输入有效的邮箱地址"
/>
```

### 4. Form.Item 新增 hasSpace 属性
**新版本**增加了 `hasSpace` 属性，用于控制表单项之间的间距。

### 5. 新增 Form.Header 组件
**新版本**新增 `Form.Header` 组件，用于为表单分组显示标题。

```tsx
// 新版本支持
<Form>
  <Form.Header title="基础信息" />
  <Form.Item name="username" label="用户名" />
  
  <Form.Header title="进阶信息" />
  <Form.Item name="email" label="邮箱" />
</Form>
```

## 迁移示例

### 案例 1：基础表单使用（需要调整 labelAlign）

```tsx
// 迁移前
import { Form } from '@sgfe/flower-rn'

const [form] = Form.useForm()

<Form
  form={form}
  labelAlign="right"  // 旧版本默认右对齐
  onFinish={(values) => console.log(values)}
>
  <Form.Item name="username" label="用户名" rules={[{ required: true }]} />
</Form>

// 迁移后（保持原样）
import { Form } from '@sfe/wand-rn'

const [form] = Form.useForm()

<Form
  form={form}
  labelAlign="right"  // 需要显式设置保持右对齐
  onFinish={(values) => console.log(values)}
>
  <Form.Item name="username" label="用户名" rules={[{ required: true }]} />
</Form>
```

### 案例 2：使用新的左对齐默认值

```tsx
// 迁移后，接受新的默认左对齐
import { Form } from '@sfe/wand-rn'

const [form] = Form.useForm()

<Form
  form={form}
  // labelAlign 默认为 'left'，无需设置
  onFinish={(values) => console.log(values)}
>
  <Form.Item name="username" label="用户名" rules={[{ required: true }]} />
</Form>
```

### 案例 3：Form.Item 底部线条改变

```tsx
// 迁移前
<Form.Item
  name="username"
  label="用户名"
  // hasLine 默认为 false，无底部线条
/>

// 迁移后，如需隐藏线条
<Form.Item
  name="username"
  label="用户名"
  hasLine={false}  // 需要显式设置
/>

// 或接受新的显示线条默认值
<Form.Item
  name="username"
  label="用户名"
  // hasLine 默认为 true，显示底部线条
/>
```

### 案例 4：使用新的 description 属性

```tsx
// 迁移后支持
import { Form } from '@sfe/wand-rn'

<Form>
  <Form.Item
    name="email"
    label="邮箱"
    description="请输入有效的邮箱地址，例如 user@example.com"
    rules={[
      { required: true, message: '邮箱为必填项' },
      { type: 'email', message: '邮箱格式不正确' }
    ]}
  />
</Form>
```

### 案例 5：使用新的 Form.Header 组件

```tsx
// 迁移后支持
import { Form } from '@sfe/wand-rn'

const [form] = Form.useForm()

<Form form={form} onFinish={handleFinish}>
  <Form.Header title="基础信息" />
  <Form.Item name="username" label="用户名" />
  <Form.Item name="email" label="邮箱" />
  
  <Form.Header title="联系信息" />
  <Form.Item name="phone" label="电话" />
  <Form.Item name="address" label="地址" />
</Form>
```

### 案例 6：完整表单示例

```tsx
// 迁移后完整使用
import { Form, Button } from '@sfe/wand-rn'

export function MyForm() {
  const [form] = Form.useForm()

  const onFinish = (values) => {
    console.log('表单提交:', values)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('表单提交失败:', errorInfo)
  }

  return (
    <Form
      form={form}
      layout="vertical"  // 纵向布局
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Header title="个人信息" />
      
      <Form.Item
        name="username"
        label="用户名"
        description="5-20个字符"
        rules={[
          { required: true, message: '用户名为必填项' },
          { min: 5, message: '用户名至少5个字符' }
        ]}
      />
      
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '邮箱为必填项' },
          { type: 'email', message: '邮箱格式不正确' }
        ]}
        hasLine={true}  // 显示底部线条
      />
      
      <Form.Item
        name="password"
        label="密码"
        description="至少8个字符，包含大小写字母和数字"
        rules={[
          { required: true, message: '密码为必填项' },
          { min: 8, message: '密码至少8个字符' }
        ]}
      />
      
      <Button onPress={() => form.submit()}>提交</Button>
      <Button onPress={() => form.resetFields()}>重置</Button>
    </Form>
  )
}
```

## 关键点

- **labelAlign 默认值改变**：Form 的 labelAlign 从 'right' 改为 'left'，需要保持右对齐时请显式设置
- **hasLine 默认值改变**：Form.Item 的 hasLine 从 false 改为 true，需要隐藏线条时请显式设置为 false
- **新增 description 属性**：Form.Item 新增 description 属性用于显示描述信息
- **新增 hasSpace 属性**：Form.Item 新增 hasSpace 属性用于控制间距
- **新增 Form.Header 组件**：可用于表单分组显示标题
- **其他属性保持兼容**：layout、colon、labelWidth、rules 等属性保持完全兼容
- **FormInstance 方法不变**：所有表单实例方法（getFieldValue、validateFields 等）保持不变
- **验证规则保持兼容**：rules 的定义和校验逻辑保持不变
- **静态方法保持兼容**：Form.useForm、Form.useFormInstance、Form.useWatch 等钩子保持兼容
- **Form.List 保持兼容**：动态表单列表相关功能保持不变
