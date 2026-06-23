# ErrorPlaceHolder 错误占位图

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export class ErrorPlaceHolder extends PureComponent<Props> {
    static defaultProps = {
        imgSource: placeholderErrorIcon,  // 错误图标
        hintTxt: '加载错误，请重试',
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
| imgSource | type | 错误占位图对应 type='Load' |
| imgStyle | - | 图片样式，新组件的图片样式固定 |
| rootStyle | style | 容器样式 |
| - | type | 占位图类型，错误对应 'Load' |
| - | showButton | 是否显示按钮（新增） |
| - | buttonRender | 自定义按钮内容（新增） |

## 迁移示例

### 案例 1：基础错误占位图

```tsx
// 迁移前
<ErrorPlaceHolder onBtnClick={() => handleRefresh()} />

// 迁移后
<PlaceHolder 
    type="Load" 
    onPress={() => handleRefresh()} 
/>
```

### 案例 2：自定义错误描述

```tsx
// 迁移前
<ErrorPlaceHolder 
    hintTxt="加载失败"
    subHintTxt="请检查网络连接"
    btnTxt="重新加载"
    onBtnClick={() => handleRefresh()}
/>

// 迁移后
<PlaceHolder 
    type="Load"
    description="加载失败，请检查网络连接"
    buttonText="重新加载"
    onPress={() => handleRefresh()}
/>

// 或者使用JSX.Element实现更复杂的样式
<PlaceHolder 
    type="Load"
    description={
        <View>
            <Text style={{ fontSize: 15, color: '#999999' }}>加载失败</Text>
            <Text style={{ fontSize: 14, color: '#333333' }}>请检查网络连接</Text>
        </View>
    }
    buttonText="重新加载"
    onPress={() => handleRefresh()}
/>
```

### 案例 3：自定义容器样式

```tsx
// 迁移前
<ErrorPlaceHolder 
    rootStyle={{ backgroundColor: '#f5f5f5' }}
    onBtnClick={() => handleRefresh()}
/>

// 迁移后
<PlaceHolder 
    type="Load"
    style={{ backgroundColor: '#f5f5f5' }}
    onPress={() => handleRefresh()}
/>
```

### 案例 4：隐藏按钮

```tsx
// 迁移前 - 通过不传onBtnClick来实现隐藏
<ErrorPlaceHolder hintTxt="加载错误" />

// 迁移后
<PlaceHolder 
    type="Load"
    showButton={false}
/>
```

### 案例 5：自定义按钮

```tsx
// 迁移前 - 通过样式自定义按钮
<ErrorPlaceHolder 
    btnStyle={{ backgroundColor: 'blue' }}
    btnTxtStyle={{ color: 'white' }}
    onBtnClick={() => handleRefresh()}
/>

// 迁移后 - 使用buttonRender完全自定义按钮
<PlaceHolder 
    type="Load"
    buttonRender={() => (
        <Touchable onPress={() => handleRefresh()}>
            <View style={{ backgroundColor: 'blue', padding: 10 }}>
                <Text style={{ color: 'white' }}>自定义按钮</Text>
            </View>
        </Touchable>
    )}
/>
```

### 案例 6：图片和文字自定义

```tsx
// 迁移前
<ErrorPlaceHolder 
    imgSource={require('./custom-error.png')}
    imgStyle={{ width: 200, height: 200 }}
    hintTxt="发生错误"
    hintStyle={{ color: 'red', fontSize: 18 }}
    onBtnClick={() => handleRefresh()}
/>

// 迁移后 - 使用 description 为 JSX.Element 实现自定义
<PlaceHolder 
    type="Load"
    description={
        <View style={{ alignItems: 'center' }}>
            <Image 
                source={require('./custom-error.png')}
                style={{ width: 200, height: 200 }}
            />
            <Text style={{ color: 'red', fontSize: 18, marginTop: 10 }}>
                发生错误
            </Text>
        </View>
    }
    onPress={() => handleRefresh()}
/>

// 注意：新组件的图片样式固定为 120x120，无法直接修改
// 如果需要不同的图片尺寸，建议使用 description JSX.Element 完全自定义
```

## 关键点

- **占位图类型映射**：
  - 旧的 `ErrorPlaceHolder` → 新的 `PlaceHolder` 配合 `type="Load"`
  - 旧的 `EmptyPlaceHolder` → 新的 `PlaceHolder` 配合 `type="Content"` 或 `type="Permission"` 或 `type="Reward"`

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
  - 旧组件错误占位图：`btnTxt: '刷新试试'`
  - 新组件 Load 类型：`buttonText: '点击重试'`
  - 需要注意文案变化可能带来的用户体验差异

- **不支持的功能**：
  - 新组件不支持自定义图片源（图片预定义）
  - 新组件不支持独立定制图片和按钮样式
  - 新组件的图片尺寸固定为 120x120

## 迁移策略

### 第一步：简单场景 - 仅修改组件名称和属性名

如果原代码只关心错误提示，使用以下最简方式：

```tsx
// 如果原代码
<ErrorPlaceHolder onBtnClick={handleRefresh} />

// 直接改为
<PlaceHolder type="Load" onPress={handleRefresh} />
```

### 第二步：文本定制 - 保留自定义描述

如果需要自定义文本内容：

```tsx
// 如果原代码有多行文本
<ErrorPlaceHolder 
    hintTxt="错误标题"
    subHintTxt="错误说明"
    onBtnClick={handleRefresh}
/>

// 改为
<PlaceHolder 
    type="Load"
    description="错误标题，错误说明"  // 合并为单行
    onPress={handleRefresh}
/>

// 或者如果需要保留多行样式差异
<PlaceHolder 
    type="Load"
    description={
        <View>
            <Text>错误标题</Text>
            <Text>错误说明</Text>
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
    type="Load"
    description={<CustomErrorView />}
    buttonRender={() => <CustomButton />}
/>
```

### 第四步：逐步迁移 - 阶段性替换

- 第一步：替换 `ErrorPlaceHolder` 为 `PlaceHolder type="Load"`
- 第二步：如果样式不符合需求，改为使用 `description` JSX.Element
- 第三步：如果按钮也需要定制，使用 `buttonRender`

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
    type="Load"
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
    type="Load"
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
    type="Load"
    showButton={false}
/>
```

## 注意事项

1. **设计规范变化**：新组件采用了更严格的设计规范，限制了样式的灵活性，但提高了产品一致性。

2. **图片资源**：新组件内置了四种占位图类型的图片资源，无需额外引入。

3. **JSX.Element 支持**：充分利用 `description` 和 `buttonRender` 的 JSX.Element 支持，可以实现高度自定义的效果。

4. **向后兼容**：新组件的 `handleButton` 和 `renderButton` 属性已废弃，建议使用 `onPress` 和 `buttonRender`。

5. **样式系统**：新组件使用 `style` 属性替代 `rootStyle`，更加简洁。
