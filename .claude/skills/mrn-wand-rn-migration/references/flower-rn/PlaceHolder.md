# PlaceHolder 无数据占位图

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export type PlaceHolderType = 'Load' | 'Content' | 'Permission' | 'Reward'

export interface PlaceHolderProps {
  /** 占位图类型 */
  type?: PlaceHolderType  // 默认 'Content'
  /** 自定义描述内容 */
  description?: string | JSX.Element
  /** 按钮文案 */
  buttonText?: string  // 默认 '点击重试'
  /** 是否显示按钮 */
  showButton?: boolean  // 默认 true
  /** 按钮点击事件 */
  handleButton?: () => void
  /** 自定义底部按钮内容 */
  renderButton?: () => JSX.Element
  /** 容器样式 */
  style?: ViewStyle
}
```

## 新组件 API

```tsx
export type PlaceHolderType = 'Load' | 'Content' | 'Permission' | 'Reward'

export interface PlaceHolderProps {
  /** 占位图类型 */
  type?: PlaceHolderType  // 默认 'Content'
  /** 自定义描述内容 */
  description?: string | JSX.Element
  /** 按钮文案 */
  buttonText?: string  // 默认 '点击重试'
  /** 是否显示按钮 */
  showButton?: boolean  // 默认 true
  /** 按钮点击事件（废弃 handleButton） */
  handleButton?: () => void  // 废弃，用 onPress 替代
  /** 按钮点击事件（新增） */
  onPress?: () => void
  /** 自定义底部按钮内容（废弃 renderButton） */
  renderButton?: () => JSX.Element  // 废弃，用 buttonRender 替代
  /** 自定义底部按钮内容（新增） */
  buttonRender?: () => JSX.Element
  /** 容器样式 */
  style?: ViewStyle
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| type | type | 占位图类型，保持一致 |
| description | description | 自定义描述，保持一致 |
| buttonText | buttonText | 按钮文案，保持一致 |
| showButton | showButton | 是否显示按钮，保持一致 |
| handleButton | onPress | 按钮点击事件，属性名变更（handleButton 已废弃但仍支持） |
| renderButton | buttonRender | 自定义按钮，属性名变更（renderButton 已废弃但仍支持） |
| style | style | 容器样式，保持一致 |

## 关键变更

### 1. 按钮点击回调属性名变更
- **旧版本**：`handleButton`
- **新版本**：`onPress`（推荐使用），`handleButton`（废弃但仍支持）
- 新版本同时支持两个属性，优先使用 `onPress`

### 2. 自定义按钮属性名变更
- **旧版本**：`renderButton`
- **新版本**：`buttonRender`（推荐使用），`renderButton`（废弃但仍支持）
- 新版本同时支持两个属性，优先使用 `buttonRender`

### 3. 向后兼容性
- 新版本完全向后兼容
- 旧属性仍可使用，会自动转换到新属性
- 建议逐步迁移到新属性名

## 迁移示例

### 案例 1：默认暂无内容占位图

```tsx
// 迁移前
import { PlaceHolder } from '@sgfe/flower-rn'

<PlaceHolder />

// 迁移后
import { PlaceHolder } from '@sfe/wand-rn'

<PlaceHolder />
```

### 案例 2：加载失败占位图

```tsx
// 迁移前
import { PlaceHolder } from '@sgfe/flower-rn'

<PlaceHolder type="Load" />

// 迁移后
import { PlaceHolder } from '@sfe/wand-rn'

<PlaceHolder type="Load" />
```

### 案例 3：暂无权限占位图

```tsx
// 迁移前
import { PlaceHolder } from '@sgfe/flower-rn'

<PlaceHolder type="Permission" />

// 迁移后
import { PlaceHolder } from '@sfe/wand-rn'

<PlaceHolder type="Permission" />
```

### 案例 4：暂无奖励占位图

```tsx
// 迁移前
import { PlaceHolder } from '@sgfe/flower-rn'

<PlaceHolder type="Reward" />

// 迁移后
import { PlaceHolder } from '@sfe/wand-rn'

<PlaceHolder type="Reward" />
```

### 案例 5：隐藏按钮

```tsx
// 迁移前
import { PlaceHolder } from '@sgfe/flower-rn'

<PlaceHolder type="Permission" showButton={false} />

// 迁移后
import { PlaceHolder } from '@sfe/wand-rn'

<PlaceHolder type="Permission" showButton={false} />
```

### 案例 6：自定义描述文案

```tsx
// 迁移前
import { PlaceHolder } from '@sgfe/flower-rn'

<PlaceHolder 
  type="Content" 
  description="您还没有任何订单"
/>

// 迁移后
import { PlaceHolder } from '@sfe/wand-rn'

<PlaceHolder 
  type="Content" 
  description="您还没有任何订单"
/>
```

### 案例 7：自定义按钮文案

```tsx
// 迁移前
import { PlaceHolder } from '@sgfe/flower-rn'

<PlaceHolder 
  type="Load"
  buttonText="重新加载"
  handleButton={() => handleRetry()}
/>

// 迁移后 - 推荐使用 onPress
import { PlaceHolder } from '@sfe/wand-rn'

<PlaceHolder 
  type="Load"
  buttonText="重新加载"
  onPress={() => handleRetry()}
/>
```

### 案例 8：按钮点击事件 - 使用新属性名

```tsx
// 迁移前 - 使用旧属性名
import { PlaceHolder } from '@sgfe/flower-rn'

<PlaceHolder 
  type="Load"
  handleButton={() => {
    console.log('重试中...')
    fetchData()
  }}
/>

// 迁移后 - 改用新属性名
import { PlaceHolder } from '@sfe/wand-rn'

<PlaceHolder 
  type="Load"
  onPress={() => {
    console.log('重试中...')
    fetchData()
  }}
/>
```

### 案例 9：自定义按钮 - 使用新属性名

```tsx
// 迁移前 - 使用旧属性名
import { PlaceHolder } from '@sgfe/flower-rn'

<PlaceHolder
  type="Permission"
  renderButton={() => (
    <Button type="primary">申请权限</Button>
  )}
/>

// 迁移后 - 改用新属性名
import { PlaceHolder } from '@sfe/wand-rn'

<PlaceHolder
  type="Permission"
  buttonRender={() => (
    <Button type="primary">申请权限</Button>
  )}
/>
```

### 案例 10：完全自定义按钮

```tsx
// 迁移前
import { PlaceHolder } from '@sgfe/flower-rn'
import { Button } from '@sgfe/flower-rn'
import { View, Text } from '@mrn/react-native'

<PlaceHolder
  type="Content"
  renderButton={() => (
    <View style={{ flexDirection: 'row' }}>
      <Button type="textPrimary" onPress={() => goBack()}>
        返回
      </Button>
      <View style={{ width: 8 }} />
      <Button type="primary" onPress={() => reload()}>
        重新加载
      </Button>
    </View>
  )}
/>

// 迁移后
import { PlaceHolder, Button } from '@sfe/wand-rn'
import { View, Text } from '@mrn/react-native'

<PlaceHolder
  type="Content"
  buttonRender={() => (
    <View style={{ flexDirection: 'row' }}>
      <Button type="textPrimary" onPress={() => goBack()}>
        返回
      </Button>
      <View style={{ width: 8 }} />
      <Button type="primary" onPress={() => reload()}>
        重新加载
      </Button>
    </View>
  )}
/>
```

### 案例 11：使用自定义描述（JSX.Element）

```tsx
// 迁移前
import { PlaceHolder } from '@sgfe/flower-rn'
import { Text, View } from '@mrn/react-native'

<PlaceHolder
  type="Content"
  description={
    <View>
      <Text>您还没有任何订单</Text>
      <Text style={{ fontSize: 12, color: '#999' }}>
        现在去购物吧
      </Text>
    </View>
  }
/>

// 迁移后
import { PlaceHolder } from '@sfe/wand-rn'
import { Text, View } from '@mrn/react-native'

<PlaceHolder
  type="Content"
  description={
    <View>
      <Text>您还没有任何订单</Text>
      <Text style={{ fontSize: 12, color: '#999' }}>
        现在去购物吧
      </Text>
    </View>
  }
/>
```

### 案例 12：自定义容器样式

```tsx
// 迁移前
import { PlaceHolder } from '@sgfe/flower-rn'

<PlaceHolder
  type="Content"
  style={{
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8
  }}
/>

// 迁移后
import { PlaceHolder } from '@sfe/wand-rn'

<PlaceHolder
  type="Content"
  style={{
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8
  }}
/>
```

### 案例 13：完整复杂场景

```tsx
// 迁移前
import { PlaceHolder } from '@sgfe/flower-rn'
import { Button } from '@sgfe/flower-rn'
import { View, Text } from '@mrn/react-native'

const [loading, setLoading] = useState(false)

<PlaceHolder
  type="Load"
  description="网络连接失败，请检查网络后重试"
  buttonText="重新加载"
  handleButton={async () => {
    setLoading(true)
    try {
      await fetchData()
    } finally {
      setLoading(false)
    }
  }}
  style={{ padding: 20 }}
/>

// 迁移后
import { PlaceHolder, Button } from '@sfe/wand-rn'
import { View, Text } from '@mrn/react-native'

const [loading, setLoading] = useState(false)

<PlaceHolder
  type="Load"
  description="网络连接失败，请检查网络后重试"
  buttonText="重新加载"
  onPress={async () => {
    setLoading(true)
    try {
      await fetchData()
    } finally {
      setLoading(false)
    }
  }}
  style={{ padding: 20 }}
/>
```

### 案例 14：根据数据状态显示不同占位图

```tsx
// 迁移前
import { PlaceHolder } from '@sgfe/flower-rn'

const [dataState, setDataState] = useState('loading') // 'loading' | 'empty' | 'error' | 'permitted'

const renderPlaceholder = () => {
  switch(dataState) {
    case 'loading':
      return <PlaceHolder type="Load" />
    case 'empty':
      return <PlaceHolder type="Content" />
    case 'error':
      return <PlaceHolder type="Load" handleButton={retry} />
    case 'permitted':
      return <PlaceHolder type="Permission" showButton={false} />
    default:
      return null
  }
}

// 迁移后
import { PlaceHolder } from '@sfe/wand-rn'

const [dataState, setDataState] = useState('loading') // 'loading' | 'empty' | 'error' | 'permitted'

const renderPlaceholder = () => {
  switch(dataState) {
    case 'loading':
      return <PlaceHolder type="Load" />
    case 'empty':
      return <PlaceHolder type="Content" />
    case 'error':
      return <PlaceHolder type="Load" onPress={retry} />
    case 'permitted':
      return <PlaceHolder type="Permission" showButton={false} />
    default:
      return null
  }
}
```

### 案例 15：列表为空时显示占位图

```tsx
// 迁移前
import { PlaceHolder } from '@sgfe/flower-rn'
import { FlatList, View } from '@mrn/react-native'

<View style={{ flex: 1 }}>
  {items.length === 0 ? (
    <PlaceHolder
      type="Content"
      description="暂无数据"
      handleButton={() => {
        fetchItems()
      }}
    />
  ) : (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  )}
</View>

// 迁移后
import { PlaceHolder } from '@sfe/wand-rn'
import { FlatList, View } from '@mrn/react-native'

<View style={{ flex: 1 }}>
  {items.length === 0 ? (
    <PlaceHolder
      type="Content"
      description="暂无数据"
      onPress={() => {
        fetchItems()
      }}
    />
  ) : (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  )}
</View>
```

## 关键点

### 1. 属性名称变更（推荐但非强制）
- `handleButton` → `onPress`（新属性更符合 React Native 命名规范）
- `renderButton` → `buttonRender`（新属性名更清晰）
- 新版本同时支持两种属性，优先级：新属性 > 旧属性

### 2. 完全向后兼容
- 旧属性仍可继续使用，不会报错
- 建议逐步迁移到新属性名
- 无需一次性全量改动

### 3. 占位图类型不变
- 四种类型保持一致：'Load'、'Content'、'Permission'、'Reward'
- 默认描述文案保持一致

### 4. 其他属性保持一致
- type、description、buttonText、showButton、style 等属性完全相同
- 使用方式无需改变

### 5. 组件导出别名
- 新版本导出 `Placeholder` 和 `PlaceHolder` 两个名称
- 两个名称完全相同，可任选一个

## 迁移检查清单

- [ ] 将所有 `import { PlaceHolder } from '@sgfe/flower-rn'` 改为 `import { PlaceHolder } from '@sfe/wand-rn'`
- [ ] 检查是否有使用 `handleButton` 属性，建议改为 `onPress`
- [ ] 检查是否有使用 `renderButton` 属性，建议改为 `buttonRender`
- [ ] 验证所有占位图类型（'Load'、'Content'、'Permission'、'Reward'）
- [ ] 确保自定义描述内容显示正确
- [ ] 验证按钮点击事件是否正常工作
- [ ] 测试自定义按钮功能
- [ ] 检查样式应用是否正确
- [ ] 确认在不同数据状态下占位图显示正确
- [ ] 验证按钮隐藏功能（showButton={false}）

## 注意事项

1. **属性名变更是可选的**：
   - 虽然新版本推荐使用新属性名
   - 但旧属性仍可继续使用
   - 可以根据项目情况逐步迁移

2. **优先级规则**：
   - 如果同时指定了 `onPress` 和 `handleButton`，优先使用 `onPress`
   - 如果同时指定了 `buttonRender` 和 `renderButton`，优先使用 `buttonRender`

3. **按钮样式**：
   - 内置按钮使用 `type="primary"` 的默认样式
   - 自定义按钮可以使用任何想要的 Button 类型

4. **占位图图片**：
   - 四种占位图预置了不同的图片
   - 无法自定义占位图的图片（如需自定义，可使用自定义描述）

5. **容器宽高**：
   - 组件会占满父容器
   - 建议在父容器中设置合适的宽高或 flex

6. **文本溢出**：
   - 如果自定义描述文本过长，会自动换行
   - 可通过容器样式调整文本显示

7. **按钮位置**：
   - 按钮始终显示在描述文案下方
   - 位置固定，无法调整

8. **性能考虑**：
   - PlaceHolder 本身很轻量
   - 自定义按钮内容时避免过于复杂的 JSX
