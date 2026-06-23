# Switch 开关

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface SwitchProps extends WithThemeStyles<SwitchStyles> {
    // 基础属性（简化 API）
    value?: boolean  // 默认 false
    disabled?: boolean  // 默认 false
    onChange?: (value: boolean) => void
    
    // 高级属性（来自内部实现）
    width?: number  // 默认 48，开关宽度
    height?: number  // 默认 28，开关高度
    elevation?: number  // 默认 5，Android elevation
    disabledElevation?: number  // 默认 1，禁用时 elevation
    rockerSize?: number  // 默认 24，滑块大小
    rockerColor?: string  // 滑块颜色（关闭状态）
    rockerActiveColor?: string  // 滑块颜色（打开状态）
    backgroundColor?: string  // 背景颜色（关闭状态），默认 #EEEEEE
    backgroundActiveColor?: string  // 背景颜色（打开状态），默认 #FFD100
    backgroundDisabledColor?: string  // 禁用时背景颜色
    renderRockerContent?: (state: boolean) => JSX.Element  // 自定义滑块内容
    styles?: object  // 自定义样式
}

export class Switch extends Component<SwitchProps> {
    // 类组件实现
}
```

## 新组件 API

```tsx
interface SwitchProps extends WithThemeStyles<SwitchStyles> {
    // 基础属性（简化 API）
    value?: boolean  // 默认 false
    disabled?: boolean  // 默认 false
    onChange?: (value?: boolean) => void  // 返回值类型可选
    
    // 高级属性（与旧版本相同）
    width?: number  // 默认 48，开关宽度
    height?: number  // 默认 28，开关高度
    elevation?: number  // 默认 5，Android elevation
    disabledElevation?: number  // 默认 1，禁用时 elevation
    rockerSize?: number  // 默认 24，滑块大小
    rockerColor?: string  // 滑块颜色（关闭状态）
    rockerActiveColor?: string  // 滑块颜色（打开状态）
    backgroundColor?: string  // 背景颜色（关闭状态），默认 #EEEEEE
    backgroundActiveColor?: string  // 背景颜色（打开状态），默认主题色
    backgroundDisabledColor?: string  // 禁用时背景颜色
    renderRockerContent?: (state: boolean) => JSX.Element  // 自定义滑块内容
    styles?: Partial<SwitchStyles>  // 自定义样式
}

export const Switch = (props: SwitchProps) => {
    // 函数组件实现（使用 Hooks）
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| 类组件 | 函数组件 | 从 Class Component 改为 Function Component（Hooks） |
| onChange: (value: boolean) => void | onChange: (value?: boolean) => void | 回调函数返回值改为可选 |
| backgroundActiveColor 默认 #FFD100 | backgroundActiveColor 默认主题色 | 打开状态背景颜色使用主题色，支持 noLinearGradient 主题配置 |
| 无 | noSwitchBorderRadius 主题属性 | 新增支持通过主题控制边框圆角 |
| 无 | noShadow 主题属性 | 新增支持通过主题控制阴影显示 |
| 无 | colorFillWhite 主题属性 | 新增支持通过主题控制滑块颜色 |

## 关键变更

### 1. 从类组件改为函数组件
**旧版本**：使用 Class Component 实现。

**新版本**：使用 Function Component + Hooks 实现。

使用方式无需改变，两者都接受相同的 props，但内部实现从类组件改为函数组件。

```tsx
// 迁移前后使用方式相同
import { Switch } from '@sgfe/flower-rn'

const [isOn, setIsOn] = useState(false)
<Switch 
  value={isOn}
  onChange={setIsOn}
/>

// 迁移后
import { Switch } from '@sfe/wand-rn'

const [isOn, setIsOn] = useState(false)
<Switch 
  value={isOn}
  onChange={setIsOn}
/>
```

### 2. onChange 回调函数返回值改为可选
**旧版本**：`onChange?: (value: boolean) => void`，必须返回 boolean。

**新版本**：`onChange?: (value?: boolean) => void`，返回值改为可选。

这是向后兼容的改变，现有代码无需调整。

### 3. backgroundActiveColor 默认值改变
**旧版本**：默认使用固定的黄色 `#FFD100`。

**新版本**：默认使用主题色（`theme.colorBrand`），可通过主题配置调整。

```tsx
// 迁移前（固定黄色）
<Switch value={true} />  // 背景为 #FFD100

// 迁移后（使用主题色）
<Switch value={true} />  // 背景为主题色，如需保持黄色可显式设置
<Switch 
  value={true} 
  backgroundActiveColor="#FFD100"  // 显式设置为黄色
/>
```

### 4. 新增主题配置支持
**新版本**增加了三个新的主题属性支持：

- `noSwitchBorderRadius`：设置为 true 时，开关不显示圆角（方形样式）
- `noShadow`：设置为 true 时，不显示阴影效果
- `colorFillWhite`：控制滑块颜色

### 5. backgroundDisabledColor 默认值改变
**旧版本**：通过 `theme.switchDisabledBackground` 获取。

**新版本**：默认值为 `#CBCCD1`（灰色），更易视别禁用状态。

## 迁移示例

### 案例 1：基础使用（无需改动）

```tsx
// 迁移前
import { Switch } from '@sgfe/flower-rn'

const [isOn, setIsOn] = useState(false)

<Switch 
  value={isOn}
  onChange={setIsOn}
/>

// 迁移后（完全兼容，无需改动）
import { Switch } from '@sfe/wand-rn'

const [isOn, setIsOn] = useState(false)

<Switch 
  value={isOn}
  onChange={setIsOn}
/>
```

### 案例 2：禁用开关

```tsx
// 迁移前
<Switch 
  value={isOn}
  disabled={true}
  onChange={setIsOn}
/>

// 迁移后（完全兼容，无需改动）
<Switch 
  value={isOn}
  disabled={true}
  onChange={setIsOn}
/>
```

### 案例 3：自定义尺寸

```tsx
// 迁移前
<Switch 
  value={isOn}
  width={56}  // 更宽的开关
  height={32}
  rockerSize={28}
  onChange={setIsOn}
/>

// 迁移后（完全兼容，无需改动）
<Switch 
  value={isOn}
  width={56}
  height={32}
  rockerSize={28}
  onChange={setIsOn}
/>
```

### 案例 4：自定义颜色（注意默认值改变）

```tsx
// 迁移前
<Switch 
  value={isOn}
  backgroundColor="#E0E0E0"
  backgroundActiveColor="#FFD100"  // 默认就是黄色
  rockerColor="#FFFFFF"
  onChange={setIsOn}
/>

// 迁移后
<Switch 
  value={isOn}
  backgroundColor="#E0E0E0"
  backgroundActiveColor="#FFD100"  // 新版本默认为主题色，需显式设置保持黄色
  rockerColor="#FFFFFF"
  onChange={setIsOn}
/>
```

### 案例 5：自定义滑块内容

```tsx
// 迁移前
<Switch 
  value={isOn}
  renderRockerContent={(isActive) => 
    <Text>{isActive ? '开' : '关'}</Text>
  }
  onChange={setIsOn}
/>

// 迁移后（完全兼容，无需改动）
<Switch 
  value={isOn}
  renderRockerContent={(isActive) => 
    <Text>{isActive ? '开' : '关'}</Text>
  }
  onChange={setIsOn}
/>
```

### 案例 6：使用 onChange 回调

```tsx
// 迁移前
const handleChange = (value: boolean) => {
  console.log('开关状态:', value)
  setIsOn(value)
}

<Switch 
  value={isOn}
  onChange={handleChange}
/>

// 迁移后（返回值改为可选，但现有代码兼容）
const handleChange = (value?: boolean) => {
  console.log('开关状态:', value)
  if (value !== undefined) {
    setIsOn(value)
  }
}

<Switch 
  value={isOn}
  onChange={handleChange}
/>
```

### 案例 7：方形样式开关（新特性）

```tsx
// 新版本支持通过自定义样式实现方形开关
// 方式 1：通过 theme 配置（全局）
// 在应用的主题配置中设置 noSwitchBorderRadius: true

// 方式 2：通过 styles prop（局部）
<Switch 
  value={isOn}
  onChange={setIsOn}
  styles={{
    // 自定义样式
  }}
/>
```

## 关键点

- **完全向后兼容**：基础使用方式无需任何改动
- **类组件改为函数组件**：内部实现改为函数组件 + Hooks，但使用方式不变
- **backgroundActiveColor 默认值改变**：从固定黄色 `#FFD100` 改为主题色，需要保持黄色时请显式设置
- **backgroundDisabledColor 默认值改变**：从主题配置的值改为 `#CBCCD1`（灰色），更好地表达禁用状态
- **onChange 回调返回值改为可选**：现有代码可能需要处理 undefined 值
- **新增主题属性**：支持 `noSwitchBorderRadius`、`noShadow`、`colorFillWhite` 等主题配置
- **高级属性保持兼容**：width、height、elevation、rockerSize、renderRockerContent 等所有高级属性保持兼容
- **所有尺寸和颜色配置保持一致**：所有关于尺寸、颜色的属性及其默认值逻辑保持不变
