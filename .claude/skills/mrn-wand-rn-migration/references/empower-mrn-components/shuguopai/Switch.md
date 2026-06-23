# Switch 开关

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components/shuguopai`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface SwitchProps {
    /**
     * true打开、 false关闭
     */
    value?: boolean
    disable?: boolean
    onChange?: (value: any) => void
    height?: number
    width?: number
    rockerSize?: number
}
```

## 新组件 API

```tsx
interface SwitchProps extends WithThemeStyles<SwitchStyles> {
    width?: number
    height?: number
    elevation?: number
    disabledElevation?: number
    value?: boolean
    disabled?: boolean
    rockerSize?: number
    rockerColor?: string
    rockerActiveColor?: string
    backgroundColor?: string  // 关闭状态
    backgroundActiveColor?: string  // 开启状态
    backgroundDisabledColor?: string  // 禁用开启状态
    renderRockerContent?: (state: boolean) => JSX.Element  // 自定义滑块内容方法
    onChange?: (value?: boolean) => void
    styles?: Partial<SwitchStyles>
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| disable | disabled | 禁用状态属性名变更 |
| onChange | onChange | 回调函数签名保持一致，新组件参数可以为 undefined |
| value | value | 开关状态值，保持一致 |
| width | width | 开关宽度，保持一致 |
| height | height | 开关高度，保持一致 |
| rockerSize | rockerSize | 滑块大小，保持一致 |
| （无） | elevation | 新增：Android 开关按压时的阴影（默认 5） |
| （无） | disabledElevation | 新增：禁用状态下的阴影（默认 1） |
| （无） | rockerColor | 新增：滑块颜色（关闭状态） |
| （无） | rockerActiveColor | 新增：滑块颜色（开启状态） |
| （无） | backgroundColor | 新增：开关背景色（关闭状态） |
| （无） | backgroundActiveColor | 新增：开关背景色（开启状态） |
| （无） | backgroundDisabledColor | 新增：开关背景色（禁用状态） |
| （无） | renderRockerContent | 新增：自定义滑块内容的渲染方法 |
| （无） | styles | 新增：主题样式对象 |

## 迁移示例

### 案例 1：基础开关

```tsx
// 迁移前
<Switch value={true} onChange={(val) => console.log(val)} />

// 迁移后
<Switch value={true} onChange={(val) => console.log(val)} />
```

### 案例 2：禁用开关

```tsx
// 迁移前
<Switch disable={true} value={false} />

// 迁移后
<Switch disabled={true} value={false} />
```

### 案例 3：自定义尺寸和滑块

```tsx
// 迁移前
<Switch
    height={15}
    width={30}
    rockerSize={12}
    value={true}
    onChange={(val) => console.log(val)}
/>

// 迁移后
<Switch
    height={15}
    width={30}
    rockerSize={12}
    value={true}
    onChange={(val) => console.log(val)}
/>
```

### 案例 4：自定义颜色

```tsx
// 迁移前
// 旧组件使用 backgroundActiveColor，直接作为 props 传给内部的 MTDSwitch
// 无法自定义滑块颜色和关闭状态颜色

// 迁移后
<Switch
    value={true}
    backgroundColor="#EEEEEE"  // 关闭状态背景色
    backgroundActiveColor="#FF0000"  // 开启状态背景色
    rockerColor="#FFFFFF"  // 滑块颜色（关闭状态）
    rockerActiveColor="#FFFFFF"  // 滑块颜色（开启状态）
    onChange={(val) => console.log(val)}
/>
```

### 案例 5：自定义滑块内容

```tsx
// 迁移前
// 旧组件不支持自定义滑块内容

// 迁移后
<Switch
    value={true}
    renderRockerContent={(state) => (
        <Text>{state ? '✓' : ''}</Text>
    )}
    onChange={(val) => console.log(val)}
/>
```

## 关键点

### 必需改动
1. **disable → disabled**: 属性名必须改为 `disabled`，这是新组件要求的标准属性名
2. **回调函数参数**: 新组件的 `onChange` 回调参数类型为 `(value?: boolean) => void`，可能为 undefined，需要进行类型兼容

### 功能改进
1. **颜色定制**: 新组件支持分别定制关闭状态和开启状态的背景色、滑块颜色，提供更大的样式灵活性
2. **自定义内容**: 通过 `renderRockerContent` 方法支持自定义滑块内容（如显示图标、文字）
3. **阴影控制**: 新增 `elevation` 和 `disabledElevation` 属性，支持精细化控制 Android 上的阴影效果
4. **主题支持**: 通过 `styles` 属性支持主题定制

### 默认值对比
| 属性 | 旧默认值 | 新默认值 |
|-----|--------|--------|
| width | 50 | 48 |
| height | 30 | 28 |
| rockerSize | 无明确定义 | 24 |
| disabled/disable | false | false |
| value | false（隐式） | false |
| elevation | 无 | 5 |
| disabledElevation | 无 | 1 |

### 行为改变
1. 旧组件使用包装器 View 加上 opacity 处理禁用状态，新组件通过主题色的内插和 elevation 改变来实现禁用效果
2. 新组件使用动画系统处理状态切换，相比旧组件有更流畅的交互效果
3. 新组件基于主题系统，禁用状态的颜色自动适应主题设置（`backgroundDisabledColor` 默认为 `#CBCCD1`）

### 推荐迁移步骤
1. 替换属性 `disable` 为 `disabled`
2. 保持其他基础属性（`value`、`width`、`height`、`rockerSize`）不变
3. 如果有自定义颜色需求，添加 `backgroundColor`、`backgroundActiveColor`、`rockerColor`、`rockerActiveColor` 属性
4. 如果需要自定义滑块内容，使用 `renderRockerContent` 方法
5. 测试禁用状态和动画效果，确保用户体验一致
