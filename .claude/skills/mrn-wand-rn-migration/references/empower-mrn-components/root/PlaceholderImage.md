# PlaceholderImage 占位图片

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface PlaceholderImageProps extends ImageProps {
    placeholderContent?: ReactNode  // 自定义加载中内容
    errorContent?: ReactNode  // 自定义错误内容
    disableLoading?: boolean  // 是否禁用加载中状态，默认 false
    disableError?: boolean  // 是否禁用错误状态，默认 false
    errorStyle?: StyleProp<ViewStyle>  // 错误状态容器样式
    loadingStyle?: StyleProp<ViewStyle>  // 加载中状态容器样式
    containerStyle?: StyleProp<ViewStyle>  // 容器样式
    onImagePress?: () => void  // 图片点击事件
}

export class PlaceholderImage extends PureComponent<PlaceholderImageProps, PlaceholderImageState> {
    // 继承 ImageProps 的所有属性
}
```

## 新组件 API

```tsx
export interface ImageProps {
    /** 图片来源 */
    source: ImageURISource | ImageRequireSource  // 必填
    /** 自定义图片加载中展示内容 */
    loading?: React.ReactNode
    /** 自定义图片加载错误时展示内容 */
    error?: React.ReactNode
    /** 图片的圆角尺寸，可以是预设的值（'xs', 's', 'm', 'l', 'xl'）或自定义的数字 */
    radius?: 'xs' | 's' | 'm' | 'l' | 'xl' | number  // 默认 'xs'
    /** @deprecated 即将废弃，使用 radius 替代 */
    radiusSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | number
    /** 加载失败可重试 */
    retriable?: boolean  // 默认 false
    /** 图片裁剪 */
    croppable?: boolean  // 默认 false
    /** 展示loading状态 */
    showLoading?: boolean  // 默认 false
    /** 展示 Error 状态 */
    showError?: boolean  // 默认 true
    /** 是否预览/预览设置 */
    preview?: boolean | PreviewConfig  // 默认 false
    /** 图片样式 */
    imageStyle?: StyleProp<ImageStyle>  // 默认 { width: 70, height: 70 }
    /** 点击事件的回调函数 */
    onPress?: () => void
    /** 加载成功时的回调函数 */
    onLoad?: (event: NativeSyntheticEvent<ImageLoadEventData>) => void
    /** 加载开始时的回调函数 */
    onLoadStart?: () => void
    /** 加载失败回调 */
    onError?: (event: NativeSyntheticEvent<ImageErrorEventData>) => void
}

export const Image: React.FC<ImageProps>
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| source | source | 图片源，用法一致 |
| onImagePress | onPress | 图片点击回调 |
| placeholderContent | loading | 自定义加载中内容，需要同时设置 showLoading=true |
| errorContent | error | 自定义错误内容，需要同时设置 showError=true 或 retriable=true |
| disableLoading | showLoading | 逻辑反转：disableLoading=true → showLoading=false |
| disableError | showError | 逻辑反转：disableError=true → showError=false（如果不需要重试） |
| loadingStyle | - | 加载中容器样式已固定，无法自定义 |
| errorStyle | - | 错误容器样式已固定，无法自定义 |
| containerStyle | imageStyle | 图片样式，控制宽高和其他样式 |
| - | radius / radiusSize | 圆角属性（新增） |
| - | retriable | 加载失败是否可重试（新增） |
| - | croppable | 图片裁剪功能（新增） |
| - | preview | 图片预览功能（新增） |
| - | onLoad | 加载成功回调（新增） |
| - | onLoadStart | 加载开始回调（新增） |
| - | onError | 加载失败回调（新增） |

## 迁移示例

### 案例 1：基础使用

```tsx
// 迁移前
import { PlaceholderImage } from '@mtfe/empower-mrn-components'

<PlaceholderImage 
    source={{ uri: 'https://example.com/image.jpg' }}
    containerStyle={{ width: 100, height: 100 }}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 100, height: 100 }}
/>
```

### 案例 2：自定义加载中内容

```tsx
// 迁移前
<PlaceholderImage 
    source={{ uri: 'https://example.com/image.jpg' }}
    containerStyle={{ width: 100, height: 100 }}
    placeholderContent={<Text>加载中...</Text>}
/>

// 迁移后
<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 100, height: 100 }}
    showLoading  // 需要显式设置为 true
    loading={<Text>加载中...</Text>}
/>
```

### 案例 3：自定义错误内容

```tsx
// 迁移前
<PlaceholderImage 
    source={{ uri: 'https://example.com/image.jpg' }}
    containerStyle={{ width: 100, height: 100 }}
    errorContent={<Text>加载失败，点击重试</Text>}
/>

// 迁移后
<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 100, height: 100 }}
    showError  // 展示错误状态
    error={<Text>加载失败，点击重试</Text>}
/>
```

### 案例 4：禁用加载和错误状态

```tsx
// 迁移前
<PlaceholderImage 
    source={{ uri: 'https://example.com/image.jpg' }}
    containerStyle={{ width: 100, height: 100 }}
    disableLoading  // 禁用加载状态
    disableError  // 禁用错误状态
/>

// 迁移后
<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 100, height: 100 }}
    showLoading={false}  // 不显示加载状态
    showError={false}  // 不显示错误状态
/>
```

### 案例 5：可重试的图片加载

```tsx
// 迁移前
<PlaceholderImage 
    source={{ uri: 'https://example.com/image.jpg' }}
    containerStyle={{ width: 100, height: 100 }}
    errorContent={<Text>加载失败，点击重试</Text>}
    onImagePress={() => console.log('clicked')}
/>

// 迁移后
<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 100, height: 100 }}
    retriable  // 失败时可以点击重试
    error={<Text>加载失败，点击重试</Text>}
    onPress={() => console.log('clicked')}
/>
```

### 案例 6：带圆角的图片

```tsx
// 迁移前
<PlaceholderImage 
    source={{ uri: 'https://example.com/image.jpg' }}
    containerStyle={{ 
        width: 100, 
        height: 100, 
        borderRadius: 8  // 手动设置圆角
    }}
/>

// 迁移后
<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 100, height: 100 }}
    radius={8}  // 使用预设圆角或数字
/>

// 或使用预设值
<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 100, height: 100 }}
    radius="m"  // 预设中等大小圆角
/>
```

### 案例 7：图片预览功能

```tsx
// 迁移前 - 无预览功能，需要额外处理

// 迁移后 - 内置预览功能
<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 100, height: 100 }}
    preview  // 启用预览功能
    onPress={() => console.log('image clicked')}
/>

// 或配置预览选项
<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 100, height: 100 }}
    preview={{
        zoomable: true,  // 预览时可缩放
        onClose: () => console.log('preview closed')
    }}
/>
```

### 案例 8：图片裁剪功能

```tsx
// 迁移前 - 无自动裁剪功能

// 迁移后 - 启用自动裁剪（针对 Venus 图片）
<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 100, height: 100 }}
    croppable  // 启用图片裁剪，自动添加 URL 后缀
/>
```

### 案例 9：完整示例 - 包含加载、错误、重试和预览

```tsx
// 迁移前
import { PlaceholderImage } from '@mtfe/empower-mrn-components'

<PlaceholderImage 
    source={{ uri: 'https://example.com/image.jpg' }}
    containerStyle={{ width: 150, height: 150, borderRadius: 8 }}
    placeholderContent={<ActivityIndicator size="small" color="gray" />}
    errorContent={<Text style={{ color: 'red' }}>加载失败</Text>}
    onImagePress={() => navigation.navigate('ImagePreview')}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 150, height: 150 }}
    radius={8}
    showLoading
    loading={<ActivityIndicator size={22} color="gray" />}
    showError
    error={<Text style={{ color: 'red' }}>加载失败</Text>}
    preview={{
        zoomable: true,
        onClose: () => console.log('preview closed')
    }}
/>
```

### 案例 10：在列表中使用

```tsx
// 迁移前
import { PlaceholderImage } from '@mtfe/empower-mrn-components'

<FlatList
    data={items}
    renderItem={({ item }) => (
        <PlaceholderImage 
            source={{ uri: item.imageUrl }}
            containerStyle={{ width: 80, height: 80 }}
            placeholderContent={<ActivityIndicator size="small" />}
        />
    )}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<FlatList
    data={items}
    renderItem={({ item }) => (
        <Image 
            source={{ uri: item.imageUrl }}
            imageStyle={{ width: 80, height: 80 }}
            showLoading
        />
    )}
/>
```

### 案例 11：自定义加载动画

```tsx
// 迁移前
<PlaceholderImage 
    source={{ uri: 'https://example.com/image.jpg' }}
    containerStyle={{ width: 100, height: 100 }}
    placeholderContent={<LottieView source={require('./loading.json')} autoPlay loop />}
/>

// 迁移后
<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 100, height: 100 }}
    showLoading
    loading={<LottieView source={require('./loading.json')} autoPlay loop />}
/>
```

### 案例 12：监听加载事件

```tsx
// 迁移前
<PlaceholderImage 
    source={{ uri: 'https://example.com/image.jpg' }}
    containerStyle={{ width: 100, height: 100 }}
    onImagePress={() => console.log('image pressed')}
/>

// 迁移后
<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 100, height: 100 }}
    onPress={() => console.log('image pressed')}
    onLoadStart={() => console.log('load start')}
    onLoad={() => console.log('load success')}
    onError={(error) => console.log('load error', error)}
/>
```

## 关键点

### 属性逻辑变化

- **disableLoading → showLoading**：逻辑反转
  - 旧：`disableLoading={true}` 表示不显示加载
  - 新：`showLoading={false}` 表示不显示加载
  - 新：`showLoading={true}` 表示显示加载

- **disableError → showError**：逻辑反转
  - 旧：`disableError={true}` 表示不显示错误
  - 新：`showError={false}` 表示不显示错误

### 必需的显式配置

新组件需要显式设置 `showLoading` 和 `showError` 才能显示相应的状态：

```tsx
// 迁移前 - 只要传 placeholderContent 就会显示
<PlaceholderImage 
    source={{ uri: 'xxx' }}
    placeholderContent={<Text>加载中</Text>}
/>

// 迁移后 - 必须同时设置 showLoading
<Image 
    source={{ uri: 'xxx' }}
    showLoading
    loading={<Text>加载中</Text>}
/>
```

### 样式处理

- 旧组件：使用 `containerStyle` 控制容器尺寸
- 新组件：使用 `imageStyle` 控制图片尺寸
- 旧组件：支持自定义 `loadingStyle` 和 `errorStyle`
- 新组件：样式已固定，无法自定义（样式由组件内置）

### 新增功能

1. **圆角支持**：`radius` 属性支持预设值和自定义数字
2. **图片预览**：`preview` 属性支持图片查看和缩放
3. **自动重试**：`retriable` 属性支持加载失败后点击重试
4. **图片裁剪**：`croppable` 属性支持自动添加 URL 后缀
5. **更多回调**：`onLoadStart`、`onLoad`、`onError` 回调函数

### 默认行为变化

| 功能 | 旧组件默认 | 新组件默认 |
|------|---------|---------|
| 显示加载状态 | 是 | 否（需要 showLoading=true） |
| 显示错误状态 | 是 | 是（showError=true） |
| 支持重试 | 否 | 否（需要 retriable=true） |
| 图片尺寸 | 继承 containerStyle | 默认 70x70 |
| 圆角 | 通过 borderRadius | 通过 radius 属性 |

## 迁移策略

### 第一步：替换导入和组件名

```tsx
// 旧
import { PlaceholderImage } from '@mtfe/empower-mrn-components'

// 新
import { Image } from '@sfe/wand-rn'
```

### 第二步：更新基本属性

1. 将 `containerStyle` 改为 `imageStyle`
2. 将 `onImagePress` 改为 `onPress`

```tsx
// 旧
<PlaceholderImage 
    source={source}
    containerStyle={{ width: 100, height: 100 }}
    onImagePress={handlePress}
/>

// 新
<Image 
    source={source}
    imageStyle={{ width: 100, height: 100 }}
    onPress={handlePress}
/>
```

### 第三步：处理加载状态

如果需要显示加载状态：

```tsx
<Image 
    source={source}
    imageStyle={{ width: 100, height: 100 }}
    showLoading  // 显式设置为 true
    loading={placeholderContent}
/>
```

### 第四步：处理错误状态

如果需要自定义错误内容或支持重试：

```tsx
// 简单错误显示
<Image 
    source={source}
    imageStyle={{ width: 100, height: 100 }}
    showError
    error={errorContent}
/>

// 支持重试
<Image 
    source={source}
    imageStyle={{ width: 100, height: 100 }}
    retriable
    error={errorContent}
/>
```

### 第五步：添加新功能（可选）

```tsx
<Image 
    source={source}
    imageStyle={{ width: 100, height: 100 }}
    radius="m"  // 添加圆角
    preview={{  // 添加预览
        zoomable: true,
        onClose: () => {}
    }}
    showLoading
    loading={<CustomLoading />}
    retriable
    croppable  // 如果是 Venus 图片
/>
```

## 常见迁移问题

### Q: 如何迁移 disableLoading 属性？

A: 逻辑反转：

```tsx
// 旧组件
<PlaceholderImage disableLoading />  // 禁用加载状态

// 新组件
<Image showLoading={false} />  // 不显示加载状态
```

### Q: 为什么设置了 placeholderContent 但没有显示？

A: 新组件需要显式设置 `showLoading=true`：

```tsx
<Image 
    source={source}
    showLoading  // 必须设置
    loading={<Text>加载中</Text>}
/>
```

### Q: 如何处理圆角？

A: 使用 `radius` 属性替代 `borderRadius` 样式：

```tsx
// 旧
<PlaceholderImage 
    containerStyle={{ borderRadius: 8 }}
/>

// 新
<Image 
    radius={8}  // 直接指定数字
    // 或使用预设值
    // radius="m"
/>
```

### Q: 如何实现加载失败后的重试功能？

A: 使用 `retriable` 属性：

```tsx
<Image 
    source={source}
    retriable  // 启用重试功能
    error={<Text>点击重试</Text>}
/>
```

### Q: 新组件如何自定义加载中和错误的容器样式？

A: 新组件的容器样式已固定，无法自定义。如有特殊需求，建议：

1. 使用 `loading` 和 `error` 的 JSX.Element 完全自定义内容
2. 通过 `imageStyle` 控制图片的宽高和外部样式

```tsx
<Image 
    source={source}
    imageStyle={{ width: 100, height: 100 }}
    loading={
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <CustomLoadingComponent />
        </View>
    }
/>
```

### Q: 如何监听图片加载过程？

A: 使用新增的回调函数：

```tsx
<Image 
    source={source}
    onLoadStart={() => console.log('start')}
    onLoad={() => console.log('success')}
    onError={(error) => console.log('error', error)}
/>
```

### Q: 什么是 croppable 属性？

A: `croppable` 用于自动处理 Venus 图片 URL，在 URL 后添加尺寸和质量参数：

```tsx
<Image 
    source={{ uri: 'https://example.com/image.jpg' }}
    imageStyle={{ width: 100, height: 100 }}
    croppable  // 自动在 URL 后添加 @200w_200h_90Q
/>
```

### Q: 如何使用图片预览功能？

A: 设置 `preview` 属性：

```tsx
<Image 
    source={source}
    preview  // 简单预览
    // 或
    preview={{
        zoomable: true,  // 支持缩放
        onClose: () => console.log('closed')  // 预览关闭回调
    }}
/>
```

## 注意事项

1. **默认尺寸**：新组件的默认图片尺寸为 70x70，旧组件没有默认值，需要显式指定 `imageStyle`

2. **样式限制**：新组件的加载和错误状态的容器样式已固定，如需高度定制，建议使用 JSX.Element 的 `loading` 和 `error` 属性完全重构

3. **显式配置**：需要显式设置 `showLoading` 和 `showError` 来控制状态显示，不是通过是否传入内容来隐式控制

4. **圆角属性**：
   - 新组件使用 `radius` 属性替代样式中的 `borderRadius`
   - 支持预设值：'xs'(1)、's'(1.5)、'm'(2.5)、'l'(4)、'xl'(6.5)
   - 也支持自定义数字

5. **图片源处理**：
   - 新组件当 source 为空或无效时，会显示占位图（内置占位图）
   - 旧组件需要手动处理空值

6. **性能考虑**：新组件使用函数组件和 hooks，性能更优；旧组件是类组件

7. **回调函数**：新组件的回调函数签名与 React Native Image 一致，提供 event 参数

## 迁移检查清单

- [ ] 更新导入语句（PlaceholderImage → Image）
- [ ] 将 `containerStyle` 改为 `imageStyle`
- [ ] 将 `onImagePress` 改为 `onPress`
- [ ] 检查是否需要显示加载状态，添加 `showLoading` 属性
- [ ] 检查是否需要自定义错误内容，添加 `showError` 和 `error` 属性
- [ ] 检查是否需要重试功能，添加 `retriable` 属性
- [ ] 检查是否需要圆角，使用 `radius` 替代 `borderRadius`
- [ ] 检查是否需要预览功能，添加 `preview` 属性
- [ ] 检查是否需要监听加载事件，添加 `onLoadStart`、`onLoad`、`onError`
- [ ] 验证图片显示正常
- [ ] 验证加载和错误状态正确显示
- [ ] 验证点击事件和重试功能正常
- [ ] 测试网络图片和本地图片的加载

## 与 wand-rn Image 的对比

| 特性 | PlaceholderImage | Image | 说明 |
|------|------------------|-------|------|
| 基础显示 | ✓ | ✓ | 都支持 |
| 加载状态 | ✓ | ✓ | 都支持，但新组件需显式配置 |
| 错误状态 | ✓ | ✓ | 都支持 |
| 自定义加载内容 | ✓ | ✓ | 都支持 |
| 自定义错误内容 | ✓ | ✓ | 都支持 |
| 自定义样式 | ✓ | ✗ | 旧组件支持，新组件不支持 |
| 圆角支持 | ✗ | ✓ | 新组件新增 |
| 图片预览 | ✗ | ✓ | 新组件新增 |
| 自动重试 | ✗ | ✓ | 新组件新增 |
| 图片裁剪 | ✗ | ✓ | 新组件新增 |
| 默认占位图 | ✗ | ✓ | 新组件新增 |
| 回调函数 | 基础 | 丰富 | 新组件提供更多回调 |
