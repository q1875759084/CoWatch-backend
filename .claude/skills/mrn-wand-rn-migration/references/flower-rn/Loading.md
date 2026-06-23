# Loading 加载

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface LoadingProps {
    /** loading 图标颜色 */
    color?: string  // 默认 '#CCCCCC'
    /** loading 图标大小 */
    size?: number  // 默认 20
    /** 文字内容 */
    text?: string | React.ReactElement
    /** 文字大小 */
    textSize?: number  // 默认 14
    /** Loading 的样式，spinner 为默认样式，circle 为圆形 */
    type?: 'spinner' | 'circle'  // 默认 'spinner'
    /** 文字与 loading 图标默认横向排列，此参数为 true 则纵向排列 */
    vertical?: boolean  // 默认 false
}

export const Loading: React.FunctionComponent<LoadingProps>
```

## 新组件 API

```tsx
interface LoadingProps {
    /** loading 图标颜色 */
    color?: string  // 默认 '#CCCCCC'
    /** loading 图标大小 */
    size?: number  // 默认 20
    /** 文字内容 */
    text?: string | React.ReactElement
    /** 文字大小 */
    textSize?: number  // 默认 14
    /** Loading 的样式，spinner 为默认样式，circle 为旋转圆环 */
    type?: 'spinner' | 'circle'  // 默认 'spinner'
    /** 文字与 loading 图标默认横向排列，此参数为 true 则纵向排列 */
    vertical?: boolean  // 默认 false
}

export const Loading: React.FunctionComponent<LoadingProps>
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| color | color | 完全相同 |
| size | size | 完全相同 |
| text | text | 完全相同 |
| textSize | textSize | 完全相同 |
| type | type | 完全相同 |
| vertical | vertical | 完全相同 |

## 关键变更

### 1. 完全向后兼容

**新版本**与**旧版本**的 API 完全相同，包括：
- 所有属性名称相同
- 所有属性类型相同
- 所有默认值相同
- 功能实现完全相同

这是一个直接的组件下沉，无需任何 API 改动。

```tsx
// 迁移前
import { Loading } from '@sgfe/flower-rn'

<Loading 
  type="spinner"
  color="#CCCCCC"
  size={20}
  text="加载中..."
/>

// 迁移后（完全相同）
import { Loading } from '@sfe/wand-rn'

<Loading 
  type="spinner"
  color="#CCCCCC"
  size={20}
  text="加载中..."
/>
```

### 2. 内部实现优化

新版本对内部实现进行了优化，但对外部 API 没有任何影响：
- 更好的图标处理逻辑
- 更清晰的代码结构

## 迁移示例

### 案例 1：基础使用（无需改动）

```tsx
// 迁移前
import { Loading } from '@sgfe/flower-rn'

<Loading />

// 迁移后（完全相同）
import { Loading } from '@sfe/wand-rn'

<Loading />
```

### 案例 2：带文字的加载提示

```tsx
// 迁移前
import { Loading } from '@sgfe/flower-rn'

<Loading 
  text="加载中..."
  vertical={true}
/>

// 迁移后（完全相同）
import { Loading } from '@sfe/wand-rn'

<Loading 
  text="加载中..."
  vertical={true}
/>
```

### 案例 3：自定义颜色和大小

```tsx
// 迁移前
import { Loading } from '@sgfe/flower-rn'

<Loading 
  color="#007AFF"
  size={30}
  text="请耐心等待"
/>

// 迁移后（完全相同）
import { Loading } from '@sfe/wand-rn'

<Loading 
  color="#007AFF"
  size={30}
  text="请耐心等待"
/>
```

### 案例 4：Circle 类型加载

```tsx
// 迁移前
import { Loading } from '@sgfe/flower-rn'

<Loading 
  type="circle"
  color="#FF6B6B"
  text="正在加载页面"
/>

// 迁移后（完全相同）
import { Loading } from '@sfe/wand-rn'

<Loading 
  type="circle"
  color="#FF6B6B"
  text="正在加载页面"
/>
```

### 案例 5：水平布局加载

```tsx
// 迁移前
import { Loading } from '@sgfe/flower-rn'

<Loading 
  type="spinner"
  color="#CCCCCC"
  size={20}
  text="加载中..."
  vertical={false}  // 水平布局
/>

// 迁移后（完全相同）
import { Loading } from '@sfe/wand-rn'

<Loading 
  type="spinner"
  color="#CCCCCC"
  size={20}
  text="加载中..."
  vertical={false}  // 水平布局
/>
```

### 案例 6：纵向布局加载

```tsx
// 迁移前
import { Loading } from '@sgfe/flower-rn'

<Loading 
  type="spinner"
  color="#4CAF50"
  size={24}
  text="数据加载中\n请勿关闭"
  vertical={true}  // 纵向布局
  textSize={12}
/>

// 迁移后（完全相同）
import { Loading } from '@sfe/wand-rn'

<Loading 
  type="spinner"
  color="#4CAF50"
  size={24}
  text="数据加载中\n请勿关闭"
  vertical={true}  // 纵向布局
  textSize={12}
/>
```

### 案例 7：自定义文字元素

```tsx
// 迁移前
import { Loading } from '@sgfe/flower-rn'

<Loading 
  type="circle"
  text={<View style={{ alignItems: 'center' }}>
    <Text>加载中</Text>
    <Text style={{ fontSize: 12, color: '#999' }}>请等待...</Text>
  </View>}
/>

// 迁移后（完全相同）
import { Loading } from '@sfe/wand-rn'

<Loading 
  type="circle"
  text={<View style={{ alignItems: 'center' }}>
    <Text>加载中</Text>
    <Text style={{ fontSize: 12, color: '#999' }}>请等待...</Text>
  </View>}
/>
```

### 案例 8：页面全屏加载

```tsx
// 迁移前
import { Loading } from '@sgfe/flower-rn'
import { View } from '@mrn/react-native'

<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <Loading 
    type="spinner"
    size={40}
    color="#1890FF"
    text="页面加载中..."
    vertical={true}
  />
</View>

// 迁移后（完全相同）
import { Loading } from '@sfe/wand-rn'
import { View } from '@mrn/react-native'

<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <Loading 
    type="spinner"
    size={40}
    color="#1890FF"
    text="页面加载中..."
    vertical={true}
  />
</View>
```

### 案例 9：列表加载更多

```tsx
// 迁移前
import { Loading } from '@sgfe/flower-rn'
import { View } from '@mrn/react-native'

<View style={{ paddingVertical: 20, alignItems: 'center' }}>
  <Loading 
    type="circle"
    size={16}
    color="#CCCCCC"
    text="加载更多..."
    vertical={false}
    textSize={12}
  />
</View>

// 迁移后（完全相同）
import { Loading } from '@sfe/wand-rn'
import { View } from '@mrn/react-native'

<View style={{ paddingVertical: 20, alignItems: 'center' }}>
  <Loading 
    type="circle"
    size={16}
    color="#CCCCCC"
    text="加载更多..."
    vertical={false}
    textSize={12}
  />
</View>
```

## 关键点

- **完全向后兼容**：Loading 在 flower-rn 和 wand-rn 中的 API 完全相同
- **无需代码改动**：仅需改变导入语句，其他代码保持不变
- **默认值保持一致**：color 默认 '#CCCCCC'、size 默认 20、textSize 默认 14
- **属性保持一致**：所有属性名称、类型、默认值都完全相同
- **type 类型完全兼容**：支持 'spinner' 和 'circle' 两种类型
- **layout 灵活**：支持水平（vertical=false）和纵向（vertical=true）布局
- **文字支持丰富**：text 既可以是字符串，也可以是自定义的 JSX 元素
- **内部实现优化**：新版本有更清晰的内部实现，但对外部 API 无影响
- **旋转效果保留**：使用 RotateView 实现图标的旋转动画
- **多种场景适用**：适用于全屏加载、列表加载更多等各种场景
