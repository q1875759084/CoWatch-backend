# EmptyPlaceHolder 空数据占位图

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export class EmptyPlaceHolder extends PureComponent<Props> {
    static defaultProps = {
        imgSource: placeholderEmptyIcon,  // 空数据图标
        hintTxt: '暂无可用数据',
        btnTxt: '刷新试试'
    }
}

interface Props {
    rootStyle?: StyleProp<ViewStyle>
    imgSource?: ImageSourcePropType
    imgStyle?: StyleProp<ImageStyle>
    hintTxt?: string
    hintStyle?: StyleProp<TextStyle>
    subHintTxt?: string
    subHintStyle?: StyleProp<TextStyle>
    btnTxt?: string
    btnStyle?: StyleProp<ViewStyle>
    btnTxtStyle?: StyleProp<TextStyle>
    onBtnClick?: () => void
}
```

## 新组件 API

```tsx
export type PlaceHolderType = 'Load' | 'Content' | 'Permission' | 'Reward'

export interface PlaceHolderProps {
    type?: PlaceHolderType  // 默认 'Content'
    description?: string | JSX.Element
    showButton?: boolean  // 默认 true
    buttonText?: string  // 默认 '点击重试'
    handleButton?: () => void  // 废弃，用onPress替代
    onPress?: () => void
    renderButton?: () => JSX.Element  // 废弃，用buttonRender替代
    buttonRender?: () => JSX.Element
    style?: ViewStyle
}

export const PlaceHolder = ({
    type = 'Content',
    description,
    buttonText = '点击重试',
    showButton = true,
    onPress,
    buttonRender,
    style
}: PlaceHolderProps) => ...
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| hintTxt | description | 主要描述文本，新组件支持字符串或JSX.Element |
| subHintTxt | - | 次要提示文本，新组件无此属性，建议在description中组合 |
| hintStyle | - | 文本样式，新组件通过description的JSX元素控制 |
| subHintStyle | - | 次要文本样式，新组件无此属性 |
| btnTxt | buttonText | 按钮文案 |
| btnStyle | - | 按钮样式，新组件使用内置Button组件，样式固定 |
| btnTxtStyle | - | 按钮文本样式，新组件无此属性 |
| onBtnClick | onPress | 按钮点击事件 |
| imgSource | type | 空数据占位图对应 type='Content' |
| imgStyle | - | 图片样式，新组件的图片样式固定 |
| rootStyle | style | 容器样式 |
| - | type | 占位图类型，空数据对应 'Content' |
| - | showButton | 是否显示按钮（新增） |
| - | buttonRender | 自定义按钮内容（新增） |

## 迁移示例

### 案例 1：基础空数据占位图

```tsx
// 迁移前
<EmptyPlaceHolder onBtnClick={() => handleRefresh()} />

// 迁移后
<PlaceHolder 
    type="Content" 
    onPress={() => handleRefresh()} 
/>
```

### 案例 2：自定义空数据描述

```tsx
// 迁移前
<EmptyPlaceHolder 
    hintTxt="暂无订单"
    subHintTxt="创建新订单可开始配送"
    btnTxt="创建订单"
    onBtnClick={() => handleCreateOrder()}
/>

// 迁移后
<PlaceHolder 
    type="Content"
    description="暂无订单，创建新订单可开始配送"
    buttonText="创建订单"
    onPress={() => handleCreateOrder()}
/>

// 或者使用JSX.Element实现更复杂的样式
<PlaceHolder 
    type="Content"
    description={
        <View>
            <Text style={{ fontSize: 15, color: '#999999' }}>暂无订单</Text>
            <Text style={{ fontSize: 14, color: '#333333' }}>创建新订单可开始配送</Text>
        </View>
    }
    buttonText="创建订单"
    onPress={() => handleCreateOrder()}
/>
```

### 案例 3：自定义容器样式

```tsx
// 迁移前
<EmptyPlaceHolder 
    rootStyle={{ backgroundColor: '#f5f5f5' }}
    onBtnClick={() => handleRefresh()}
/>

// 迁移后
<PlaceHolder 
    type="Content"
    style={{ backgroundColor: '#f5f5f5' }}
    onPress={() => handleRefresh()}
/>
```

### 案例 4：隐藏按钮

```tsx
// 迁移前 - 通过不传onBtnClick来实现隐藏
<EmptyPlaceHolder hintTxt="暂无数据" />

// 迁移后
<PlaceHolder 
    type="Content"
    showButton={false}
/>
```

### 案例 5：自定义按钮

```tsx
// 迁移前 - 通过样式自定义按钮
<EmptyPlaceHolder 
    btnStyle={{ backgroundColor: '#007AFF' }}
    btnTxtStyle={{ color: 'white' }}
    onBtnClick={() => handleRefresh()}
/>

// 迁移后 - 使用buttonRender完全自定义按钮
<PlaceHolder 
    type="Content"
    buttonRender={() => (
        <Touchable onPress={() => handleRefresh()}>
            <View style={{ backgroundColor: '#007AFF', padding: 10 }}>
                <Text style={{ color: 'white' }}>自定义按钮</Text>
            </View>
        </Touchable>
    )}
/>
```

### 案例 6：不同类型的占位图

```tsx
// 迁移前 - 如果需要不同类型，需要创建不同的组件
<EmptyPlaceHolder hintTxt="暂无权限" />

// 迁移后 - 使用不同的 type 属性
// Content: 暂无内容
<PlaceHolder type="Content" description="暂无订单" onPress={handleRefresh} />

// Permission: 暂无权限
<PlaceHolder type="Permission" description="您暂无权限访问此内容" />

// Reward: 暂无奖励
<PlaceHolder type="Reward" description="暂无奖励信息" />

// Load: 加载失败（对应旧的 ErrorPlaceHolder）
<PlaceHolder type="Load" description="加载失败，请重试" onPress={handleRefresh} />
```

### 案例 7：列表为空时显示占位图

```tsx
// 迁移前
<View style={{ flex: 1 }}>
    {items.length === 0 ? (
        <EmptyPlaceHolder 
            hintTxt="暂无商品"
            btnTxt="返回首页"
            onBtnClick={() => navigation.navigate('Home')}
        />
    ) : (
        <List data={items} />
    )}
</View>

// 迁移后
<View style={{ flex: 1 }}>
    {items.length === 0 ? (
        <PlaceHolder 
            type="Content"
            description="暂无商品"
            buttonText="返回首页"
            onPress={() => navigation.navigate('Home')}
        />
    ) : (
        <List data={items} />
    )}
</View>
```

### 案例 8：多行文本显示

```tsx
// 迁移前
<EmptyPlaceHolder 
    hintTxt="搜索无结果"
    subHintTxt="请检查关键词或尝试其他搜索词"
    onBtnClick={() => handleRetry()}
/>

// 迁移后 - 使用 JSX.Element 保持多行样式
<PlaceHolder 
    type="Content"
    description={
        <>
            <Text style={styles.title}>搜索无结果</Text>
            <Text style={styles.subtitle}>请检查关键词或尝试其他搜索词</Text>
        </>
    }
    onPress={() => handleRetry()}
/>
```

## 关键点

- **占位图类型映射**：
  - 旧的 `EmptyPlaceHolder` → 新的 `PlaceHolder` 配合 `type="Content"`
  - 也可以使用 `type="Permission"`（暂无权限）或 `type="Reward"`（暂无奖励）
  - 旧的 `ErrorPlaceHolder` → 新的 `PlaceHolder` 配合 `type="Load"`

- **文本处理**：
  - 旧组件有 `hintTxt` 和 `subHintTxt` 两个独立属性
  - 新组件只有 `description` 一个属性，但支持 JSX.Element
  - 如果需要显示多行文本且有不同样式，需要在 `description` 中使用 JSX 组合

- **样式限制**：
  - 旧组件允许独立定义 `imgStyle`、`hintStyle`、`subHintStyle`、`btnStyle`、`btnTxtStyle`
  - 新组件的样式大部分固定，仅支持 `style` 定义容器样式
  - 如果需要高度定制的样式，应使用 `description` 和 `buttonRender` 两个 JSX.Element 属性重新组织结构

- **按钮点击事件**：
  - 旧组件：`onBtnClick?: () => void`
  - 新组件：`onPress?: () => void`
  - 两者签名一致，只是属性名变了

- **按钮显示控制**：
  - 旧组件：通过 `onBtnClick` 是否存在来控制按钮显示（无onBtnClick时不显示）
  - 新组件：显式使用 `showButton` 属性控制

- **默认文案变化**：
  - 旧组件空数据占位图：`hintTxt: '暂无可用数据'`、`btnTxt: '刷新试试'`
  - 新组件 Content 类型：内置默认描述、`buttonText: '点击重试'`
  - 需要注意文案变化可能带来的用户体验差异

- **不支持的功能**：
  - 新组件不支持自定义图片源（图片预定义）
  - 新组件不支持独立定制图片和按钮样式
  - 新组件的图片尺寸固定为 120x120

## 迁移策略

### 第一步：简单场景 - 仅修改组件名称和属性名

如果原代码只关心空数据提示，使用以下最简方式：

```tsx
// 如果原代码
<EmptyPlaceHolder onBtnClick={handleRefresh} />

// 直接改为
<PlaceHolder type="Content" onPress={handleRefresh} />
```

### 第二步：文本定制 - 保留自定义描述

如果需要自定义文本内容：

```tsx
// 如果原代码有多行文本
<EmptyPlaceHolder 
    hintTxt="暂无订单"
    subHintTxt="请创建新订单"
    onBtnClick={handleRefresh}
/>

// 改为
<PlaceHolder 
    type="Content"
    description="暂无订单，请创建新订单"  // 合并为单行
    onPress={handleRefresh}
/>

// 或者如果需要保留多行样式差异
<PlaceHolder 
    type="Content"
    description={
        <View>
            <Text>暂无订单</Text>
            <Text>请创建新订单</Text>
        </View>
    }
    onPress={handleRefresh}
/>
```

### 第三步：复杂定制 - 使用 JSX.Element 重构

如果需要复杂的样式和结构：

```tsx
// 使用 description JSX 和 buttonRender 完全重构
<PlaceHolder 
    type="Content"
    description={<CustomEmptyView />}
    buttonRender={() => <CustomButton />}
/>
```

### 第四步：不同占位图类型处理

根据原来的不同使用场景，选择合适的 type：

```tsx
// 暂无数据
<PlaceHolder type="Content" description="暂无数据" />

// 暂无权限
<PlaceHolder type="Permission" description="暂无权限" />

// 暂无奖励
<PlaceHolder type="Reward" description="暂无奖励" />

// 加载失败（原 ErrorPlaceHolder）
<PlaceHolder type="Load" description="加载失败，请重试" />
```

### 第五步：验证和调整

- 验证占位图显示位置和尺寸
- 验证文本内容和样式
- 验证按钮显示和点击功能
- 验证整体页面布局

## 常见迁移问题

### Q: 如何迁移多行文本（hintTxt + subHintTxt）？
A: 使用 JSX.Element 组合：
```tsx
<PlaceHolder 
    type="Content"
    description={
        <>
            <Text style={styles.title}>{hintTxt}</Text>
            <Text style={styles.subtitle}>{subHintTxt}</Text>
        </>
    }
/>
```

### Q: 按钮文案从"刷新试试"变为"点击重试"，如何保持原有文案？
A: 明确设置 `buttonText` 属性：
```tsx
<PlaceHolder 
    type="Content"
    buttonText="刷新试试"  // 保持原文案
    onPress={handleRefresh}
/>
```

### Q: 新组件为什么不能自定义图片和按钮样式？
A: 新组件采用了预设的设计规范，旨在保证一致的用户体验。如有特殊需求，建议：
1. 使用 `description` JSX.Element 实现完全自定义
2. 或创建自定义占位图组件

### Q: 如何隐藏按钮？
A: 使用 `showButton={false}`：
```tsx
<PlaceHolder 
    type="Content"
    showButton={false}
/>
```

### Q: 如何在不同场景使用不同的占位图类型？
A: 根据场景选择合适的 type：
- `type="Content"`: 暂无内容（原 EmptyPlaceHolder）
- `type="Load"`: 加载失败（原 ErrorPlaceHolder）
- `type="Permission"`: 暂无权限
- `type="Reward"`: 暂无奖励

## 注意事项

1. **设计规范变化**：新组件采用了更严格的设计规范，限制了样式的灵活性，但提高了产品一致性。

2. **图片资源**：新组件内置了四种占位图类型的图片资源，无需额外引入。

3. **JSX.Element 支持**：充分利用 `description` 和 `buttonRender` 的 JSX.Element 支持，可以实现高度自定义的效果。

4. **向后兼容**：新组件的 `handleButton` 和 `renderButton` 属性已废弃，建议使用 `onPress` 和 `buttonRender`。

5. **样式系统**：新组件使用 `style` 属性替代 `rootStyle`，更加简洁。

## 与 ErrorPlaceHolder 的对比

| 方面 | EmptyPlaceHolder | ErrorPlaceHolder | 新组件类型对应 |
|------|------------------|------------------|----------------|
| 默认提示文字 | 暂无可用数据 | 加载错误，请重试 | Content / Load |
| 默认按钮文字 | 刷新试试 | 刷新试试 | 点击重试 |
| 新组件 type | 'Content' 或其他 | 'Load' | - |
| 图片 | 空数据图标 | 错误图标 | 内置对应图标 |
| 使用场景 | 列表为空、搜索无结果 | 网络请求失败、数据加载异常 | - |

## 迁移检查清单

- [ ] 检查是否需要保留原有的文案（特别是按钮文案）
- [ ] 检查是否有多行文本（hintTxt + subHintTxt）需要保留样式
- [ ] 检查是否有自定义样式（imgStyle、hintStyle 等）需要处理
- [ ] 检查是否需要隐藏按钮
- [ ] 检查是否需要自定义按钮（buttonRender）
- [ ] 检查是否是 Content 类型还是需要其他类型
- [ ] 验证占位图显示正常
- [ ] 验证按钮点击功能正常
- [ ] 测试页面的整体布局
- [ ] 验证文本显示正确，不存在溢出问题
