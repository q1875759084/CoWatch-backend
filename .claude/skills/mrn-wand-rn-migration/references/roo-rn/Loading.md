# Loading 加载

## 从何处迁移
- **源库**: `@roo/roo-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
// LoadingContainerProps
interface LoadingContainerProps extends WithThemeStyles<LoadingStyles> {
  /** 加载文本或自定义元素 */
  content?: JSX.Element | string
  /** 外层容器样式 */
  wrapperStyles?: StyleProp<ViewStyle>
  /** 文本样式 */
  contentStyles?: StyleProp<TextStyle>
}

// LoadingProps 继承 LoadingContainerProps
interface LoadingProps extends LoadingContainerProps {
  /** 是否显示 */
  visible?: boolean  // 默认 false
  /** Modal 配置 */
  modalProps?: ModalProps  // 默认 { mask: false, maskClosable: false }
}

// LoadingOptions 继承 LoadingProps（命令式 API 使用）
interface LoadingOptions extends LoadingProps {
  /** 加载类型 */
  type?: 'icon' | 'text' | 'iconText' | 'custom' | 'mt' | 'dp'  // 默认 'icon'
  /** 图标大小 */
  size?: number  // 默认 30
  /** 图标颜色 */
  tintColor?: string
}

// 静态方法
Loading.open(options: LoadingOptions) => TopViewManager
Loading.close = null
Loading.container = LoadingContainer
Loading.view = LoadingView
```

## 新组件 API

```tsx
enum LoadType {
  Spinner = 'spinner',
  Circle = 'circle'
}

interface LoadingProps {
  /** 加载指示器颜色 */
  color?: string  // 默认 '#CCCCCC'
  /** 加载指示器大小 */
  size?: number  // 默认 20
  /** 加载文本 */
  text?: string | React.ReactElement
  /** 文本字号 */
  textSize?: number  // 默认 14
  /** 加载类型 */
  type?: 'spinner' | 'circle'  // 默认 'spinner'
  /** 是否纵向排列（图标在上，文字在下） */
  vertical?: boolean  // 默认 false
}

// 无静态方法，无 Modal/遮罩层功能
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| content | text | 属性重命名，类型兼容（string \| ReactElement） |
| tintColor | color | 属性重命名，默认值变化 |
| size | size | 保持一致，但默认值从 30 变为 20 |
| type | type | 值完全不同：旧 'icon'\|'text'\|'iconText'\|'custom'\|'mt'\|'dp' -> 新 'spinner'\|'circle' |
| visible | - | 移除，新组件无 Modal 模式，通过条件渲染控制显隐 |
| modalProps | - | 移除，新组件无遮罩层/弹窗功能 |
| wrapperStyles | - | 移除，可通过外层 View 的 style 替代 |
| contentStyles | - | 移除，新组件使用 textSize 控制文本大小 |
| Loading.open() | - | 移除，无命令式 API，需使用 Toast 或自定义 Modal 替代 |
| Loading.close | - | 移除，无命令式 API |
| - | textSize | 新增，控制文本字号，默认 14 |
| - | vertical | 新增，控制图标与文字的排列方向 |

## 迁移示例

### 案例 1：基础内联加载指示器

```tsx
// 迁移前
import { Loading } from '@roo/roo-rn'

<Loading visible={true} />

// 迁移后 - 通过条件渲染控制显隐
import { Loading } from '@sfe/wand-rn'

{visible && <Loading />}
```

### 案例 2：带文本的加载

```tsx
// 迁移前
import { Loading } from '@roo/roo-rn'

<Loading visible={true} content="加载中..." />

// 迁移后 - content 改为 text
import { Loading } from '@sfe/wand-rn'

{visible && <Loading text="加载中..." />}
```

### 案例 3：自定义颜色和大小

```tsx
// 迁移前
import { Loading } from '@roo/roo-rn'

<Loading visible={true} tintColor="#FF6600" size={40} />

// 迁移后 - tintColor 改为 color，注意 size 默认值已从 30 变为 20
import { Loading } from '@sfe/wand-rn'

{visible && <Loading color="#FF6600" size={40} />}
```

### 案例 4：type 属性迁移

```tsx
// 迁移前 - 支持多种 type
import { Loading } from '@roo/roo-rn'

<Loading visible={true} type="icon" />
<Loading visible={true} type="iconText" content="加载中" />
<Loading visible={true} type="text" content="请稍候..." />

// 迁移后 - type 仅支持 'spinner' 和 'circle'
import { Loading } from '@sfe/wand-rn'

// type="icon" -> type="spinner"（默认值，可省略）
{visible && <Loading type="spinner" />}

// type="iconText" -> 使用 spinner + text
{visible && <Loading type="spinner" text="加载中" />}

// type="text" -> 无纯文本模式，需自行用 Text 组件替代
{visible && <Text>请稍候...</Text>}
```

### 案例 5：命令式 Loading.open() 迁移（全屏遮罩场景）

```tsx
// 迁移前 - 命令式调用，全屏遮罩加载
import { Loading } from '@roo/roo-rn'

const handleSubmit = async () => {
  Loading.open({ type: 'iconText', content: '提交中...' })
  try {
    await submitForm()
  } finally {
    Loading.close()
  }
}

// 迁移后 - 无命令式 API，需使用 Toast 替代全屏加载
import { Toast } from '@sfe/wand-rn'

const handleSubmit = async () => {
  Toast.loading('提交中...')
  try {
    await submitForm()
  } finally {
    Toast.close()
  }
}
```

### 案例 6：命令式 Loading.open() 迁移（自定义 Modal 方案）

```tsx
// 迁移前
import { Loading } from '@roo/roo-rn'

Loading.open({ type: 'icon', size: 40, tintColor: '#FFFFFF' })
// ... 异步操作
Loading.close()

// 迁移后 - 使用状态控制 + 自定义 Modal 组件
import { Loading, Modal } from '@sfe/wand-rn'
import { useState } from 'react'

const [loading, setLoading] = useState(false)

const handleAction = async () => {
  setLoading(true)
  try {
    await asyncOperation()
  } finally {
    setLoading(false)
  }
}

// 在 JSX 中声明式使用
<Modal visible={loading} transparent>
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Loading color="#FFFFFF" size={40} />
  </View>
</Modal>
```

### 案例 7：visible + modalProps 模式迁移

```tsx
// 迁移前 - 组件模式，带遮罩配置
import { Loading } from '@roo/roo-rn'

<Loading 
  visible={isLoading}
  modalProps={{ mask: true, maskClosable: false }}
  content="数据加载中..."
  type="iconText"
/>

// 迁移后 - 新组件无 Modal 能力，需自行组合
import { Loading } from '@sfe/wand-rn'
import { Modal, View, StyleSheet } from 'react-native'

<Modal visible={isLoading} transparent animationType="fade">
  <View style={styles.overlay}>
    <View style={styles.loadingBox}>
      <Loading text="数据加载中..." vertical />
    </View>
  </View>
</Modal>

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingBox: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
})
```

### 案例 8：自定义样式迁移

```tsx
// 迁移前 - 使用 wrapperStyles 和 contentStyles
import { Loading } from '@roo/roo-rn'

<Loading 
  visible={true}
  content="加载中"
  wrapperStyles={{ padding: 20, backgroundColor: '#F5F5F5' }}
  contentStyles={{ fontSize: 16, color: '#333333' }}
/>

// 迁移后 - 使用外层 View 和 textSize 属性
import { Loading } from '@sfe/wand-rn'

{visible && (
  <View style={{ padding: 20, backgroundColor: '#F5F5F5' }}>
    <Loading text="加载中" textSize={16} color="#333333" />
  </View>
)}
```

### 案例 9：纵向排列

```tsx
// 迁移前 - 无纵向排列选项，type="iconText" 默认横向
import { Loading } from '@roo/roo-rn'

<Loading visible={true} type="iconText" content="加载中..." />

// 迁移后 - 使用 vertical 属性实现纵向排列
import { Loading } from '@sfe/wand-rn'

// 横向排列（默认）
{visible && <Loading text="加载中..." />}

// 纵向排列（图标在上，文字在下）
{visible && <Loading text="加载中..." vertical />}
```

### 案例 10：圆环类型加载

```tsx
// 迁移前 - 无对应类型
import { Loading } from '@roo/roo-rn'

<Loading visible={true} type="icon" />

// 迁移后 - 新增 circle 类型
import { Loading } from '@sfe/wand-rn'

// spinner 类型（默认，菊花转动效果）
{visible && <Loading type="spinner" />}

// circle 类型（圆环旋转效果）
{visible && <Loading type="circle" />}
```

### 案例 11：主题样式迁移

```tsx
// 迁移前 - 通过 WithThemeStyles 自定义主题样式
import { Loading } from '@roo/roo-rn'

<Loading 
  visible={true}
  styles={{
    wrapper: { backgroundColor: '#000000', borderRadius: 10 },
    content: { color: '#FFFFFF', fontSize: 14 },
  }}
  content="加载中"
/>

// 迁移后 - 不支持 WithThemeStyles，使用外层 View + props 替代
import { Loading } from '@sfe/wand-rn'

{visible && (
  <View style={{ backgroundColor: '#000000', borderRadius: 10, padding: 16 }}>
    <Loading text="加载中" color="#FFFFFF" textSize={14} />
  </View>
)}
```

### 案例 12：完整复杂场景

```tsx
// 迁移前 - 页面级加载遮罩
import { Loading } from '@roo/roo-rn'
import { useEffect, useState } from 'react'

const DataPage = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    Loading.open({ 
      type: 'iconText', 
      content: '正在加载...', 
      size: 36, 
      tintColor: '#FFFFFF',
      modalProps: { mask: true, maskClosable: false },
    })
    fetchData().then(res => {
      setData(res)
      Loading.close()
    })
  }, [])

  return <View>{data && <DataList data={data} />}</View>
}

// 迁移后 - 使用状态驱动 + Toast 或自定义 Modal
import { Loading, Toast } from '@sfe/wand-rn'
import { useEffect, useState } from 'react'
import { View, Modal, StyleSheet } from 'react-native'

// 方案 1：使用 Toast（简单场景）
const DataPage = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    Toast.loading('正在加载...')
    fetchData().then(res => {
      setData(res)
      Toast.close()
    })
  }, [])

  return <View>{data && <DataList data={data} />}</View>
}

// 方案 2：使用自定义 Modal + Loading（需要精细控制样式）
const DataPage = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData().then(res => {
      setData(res)
      setLoading(false)
    })
  }, [])

  return (
    <View>
      {data && <DataList data={data} />}
      <Modal visible={loading} transparent>
        <View style={styles.overlay}>
          <View style={styles.loadingBox}>
            <Loading color="#FFFFFF" size={36} text="正在加载..." vertical />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 20,
  },
})
```

## 关键点

### 1. 组件定位根本不同
- 旧版本：全屏遮罩加载组件（Modal 模式），支持命令式 API（Loading.open/close）
- 新版本：纯内联加载指示器，无遮罩/弹窗功能
- **迁移核心挑战**：全屏加载场景需要使用 Toast 或自定义 Modal 组件替代

### 2. 命令式 API 无等效替代
- 旧版本：`Loading.open(options)` / `Loading.close()` 命令式调用
- 新版本：无静态方法，仅支持声明式用法
- **迁移建议**：简单全屏加载使用 `Toast.loading()` / `Toast.close()`；复杂场景使用状态驱动 + Modal + Loading 组合

### 3. 属性重命名
- `content` -> `text`（加载文本）
- `tintColor` -> `color`（指示器颜色）

### 4. type 值完全变更
- 旧版本：'icon'、'text'、'iconText'、'custom'、'mt'、'dp'（6 种）
- 新版本：'spinner'、'circle'（2 种）
- 'icon' 对应 'spinner'，'iconText' 对应 'spinner' + text 属性，其余无直接对应

### 5. 默认值变化
- size 默认值：30 -> 20
- color 默认值：新组件默认 '#CCCCCC'

### 6. 样式定制方式变更
- 旧版本：WithThemeStyles、wrapperStyles、contentStyles
- 新版本：不支持主题样式注入，使用外层 View + color/textSize 属性替代

### 7. 新增功能
- **vertical**：支持图标与文字纵向排列（图标在上，文字在下）
- **textSize**：独立控制文本字号
- **circle 类型**：新增圆环旋转加载动画

## 注意事项

1. **Loading.open() / Loading.close() 迁移是最大破坏性变更**：这是最常见的用法，必须逐一排查替换
2. **全屏加载遮罩不再内置**：需自行组合 Modal + Loading，或使用 Toast.loading() 快捷方案
3. **type 属性值不兼容**：旧值在新组件中无效，需逐一映射替换
4. **size 默认值变小**：从 30 降为 20，若依赖默认大小需显式指定
5. **visible 属性移除**：新组件无内置显隐控制，需在外层用条件渲染（`{visible && <Loading />}`）
6. **主题样式不再支持**：WithThemeStyles 机制在新组件中不可用，样式需通过 props 和外层容器实现
7. **content 属性重命名为 text**：类型兼容但名称变更，需全量替换
8. **tintColor 属性重命名为 color**：需全量替换

## 迁移检查清单

- [ ] 排查所有 `Loading.open()` / `Loading.close()` 调用，替换为 Toast.loading() 或状态驱动的 Modal + Loading
- [ ] 将 `content` 属性替换为 `text`
- [ ] 将 `tintColor` 属性替换为 `color`
- [ ] 更新 `type` 属性值：'icon' -> 'spinner'，'iconText' -> 'spinner' + text，移除 'text'/'custom'/'mt'/'dp'
- [ ] 移除 `visible` 属性，改用条件渲染控制显隐
- [ ] 移除 `modalProps` 属性，全屏场景需自行实现 Modal
- [ ] 移除 `wrapperStyles` 和 `contentStyles`，使用外层 View + textSize 替代
- [ ] 移除 WithThemeStyles 相关的 `styles` 属性
- [ ] 检查 `size` 默认值变化（30 -> 20），必要时显式指定
- [ ] 验证全屏加载遮罩场景的替代方案是否正常工作
- [ ] 测试内联加载指示器的显示效果（颜色、大小、文本）
- [ ] 确认 vertical 布局方向是否符合 UI 设计要求
