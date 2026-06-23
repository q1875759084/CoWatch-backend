# ImagePreview 图片预览

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

### ImagePreview Props
```tsx
interface ImagePreviewProps {
    source: ImageURISource | ImageRequireSource | (ImageURISource | ImageRequireSource)[]
    index: number  // 预览图片在图片组的索引
    zoomable?: boolean  // 默认 false，预览状态是否可缩放
    onClose: () => void  // 关闭预览时的回调函数
    onChange?: (pageIndex: number) => void  // 图片切换时的回调函数
    footers?: React.ReactElement[] | React.ReactElement  // 自定义渲染底部区域内容
}
```

### PreviewGroup Props
```tsx
interface PreviewGroupProps {
    sources: (ImageURISource | ImageRequireSource)[]
    imageRender: (item: ImageURISource | ImageRequireSource, index: number) => React.ReactNode
    footers?: React.ReactElement[] | React.ReactElement
    style?: StyleProp<ViewStyle>
    zoomable?: boolean  // 默认 false
    onPress?: (item?: ImageURISource | ImageRequireSource, index?: number, sources?: (ImageURISource | ImageRequireSource)[]) => void
}
```

## 新组件 API

### Preview Props
```tsx
interface PreviewSource {
    uri: string
    isImage: boolean
    isVideo: boolean
    thumbUrl?: string
    localUri?: string
}

interface PreviewProps {
    visible: boolean  // 是否显示预览
    source: PreviewSource | PreviewSource[]  // 预览源
    index: number  // 初始预览索引
    renderItem?: (item: PreviewSource | PreviewSource[], index: number) => React.ReactNode  // 自定义渲染项
    footers?: React.ReactElement[] | React.ReactElement  // 自定义渲染底部区域内容
    onClose: () => void  // 关闭预览时的回调函数
    onChange?: (pageIndex: number) => void  // 图片切换时的回调函数
    onVideoLoadSuccess?: (url: string, loadedTimeMs: number) => void  // 视频加载成功回调
    onVideoLoadError?: (url: string) => void  // 视频加载失败回调
}
```

## 迁移对照表

| 旧组件/属性 | 新组件/属性 | 说明 |
|-----------|----------|------|
| ImagePreview | Preview | 组件名称变更 |
| source (ImageURISource\|ImageRequireSource) | source (PreviewSource) | 源格式变更，需要转换为 PreviewSource 类型 |
| index | index | 属性保持一致 |
| zoomable | renderItem + 自定义逻辑 | 缩放功能通过 renderItem 自定义实现 |
| onClose | onClose | 属性保持一致 |
| onChange | onChange | 属性保持一致 |
| footers | footers | 属性保持一致 |
| - | visible | 新增属性，控制预览是否显示 |
| - | onVideoLoadSuccess | 新增属性，支持视频预览 |
| - | onVideoLoadError | 新增属性，支持视频预览 |
| PreviewGroup | 无直接对应 | 需要单独处理图片列表的展示和预览 |

## 迁移示例

### 案例 1：简单图片预览（单张）

```tsx
// 迁移前 - flower-rn
import { ImagePreview } from '@sgfe/flower-rn'

const [previewIndex, setPreviewIndex] = useState(-1)

const handleOpen = () => {
    setPreviewIndex(0)
}

const handleClose = () => {
    setPreviewIndex(-1)
}

<View>
    <Press onPress={handleOpen}>
        <Image source={{ uri: 'https://example.com/image.jpg' }} />
    </Press>
    {previewIndex !== -1 && (
        <ImagePreview
            source={{ uri: 'https://example.com/image.jpg' }}
            index={previewIndex}
            onClose={handleClose}
        />
    )}
</View>

// 迁移后 - wand-rn
import { Preview } from '@sfe/wand-rn'

const [visible, setVisible] = useState(false)

const handleOpen = () => {
    setVisible(true)
}

const handleClose = () => {
    setVisible(false)
}

<View>
    <Press onPress={handleOpen}>
        <Image source={{ uri: 'https://example.com/image.jpg' }} />
    </Press>
    <Preview
        visible={visible}
        source={{
            uri: 'https://example.com/image.jpg',
            isImage: true,
            isVideo: false
        }}
        index={0}
        onClose={handleClose}
    />
</View>
```

### 案例 2：多张图片预览（原 PreviewGroup 功能）

```tsx
// 迁移前 - flower-rn
import { PreviewGroup } from '@sgfe/flower-rn'

const urls = [
    { uri: 'https://example.com/image1.jpg' },
    { uri: 'https://example.com/image2.jpg' },
    { uri: 'https://example.com/image3.jpg' },
]

<PreviewGroup
    sources={urls}
    imageRender={(item, index) => (
        <Image
            source={item}
            imageStyle={{ width: 100, height: 100, margin: 2 }}
        />
    )}
/>

// 迁移后 - wand-rn
import { Preview } from '@sfe/wand-rn'

const urls = [
    { uri: 'https://example.com/image1.jpg' },
    { uri: 'https://example.com/image2.jpg' },
    { uri: 'https://example.com/image3.jpg' },
]

const [visible, setVisible] = useState(false)
const [currentIndex, setCurrentIndex] = useState(0)

const previewSources = urls.map(url => ({
    uri: url.uri,
    isImage: true,
    isVideo: false
}))

const handlePress = (index: number) => {
    setCurrentIndex(index)
    setVisible(true)
}

<View>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {urls.map((item, index) => (
            <Press key={index} onPress={() => handlePress(index)}>
                <Image
                    source={item}
                    imageStyle={{ width: 100, height: 100, margin: 2 }}
                />
            </Press>
        ))}
    </View>
    <Preview
        visible={visible}
        source={previewSources}
        index={currentIndex}
        onClose={() => setVisible(false)}
        onChange={setCurrentIndex}
    />
</View>
```

### 案例 3：带底部自定义内容的预览

```tsx
// 迁移前 - flower-rn
import { ImagePreview, PreviewGroup } from '@sgfe/flower-rn'

const urls = [
    { uri: 'https://example.com/image1.jpg' },
    { uri: 'https://example.com/image2.jpg' },
]

const footers = [
    <View key={0}><Text>商品1描述信息</Text></View>,
    <View key={1}><Text>商品2描述信息</Text></View>,
]

<PreviewGroup
    sources={urls}
    footers={footers}
    imageRender={(item, index) => (
        <Image source={item} imageStyle={{ width: 100, height: 100 }} />
    )}
/>

// 迁移后 - wand-rn
import { Preview } from '@sfe/wand-rn'

const urls = [
    { uri: 'https://example.com/image1.jpg' },
    { uri: 'https://example.com/image2.jpg' },
]

const previewSources = urls.map(url => ({
    uri: url.uri,
    isImage: true,
    isVideo: false
}))

const footers = [
    <View key={0}><Text>商品1描述信息</Text></View>,
    <View key={1}><Text>商品2描述信息</Text></View>,
]

const [visible, setVisible] = useState(false)
const [currentIndex, setCurrentIndex] = useState(0)

const handlePress = (index: number) => {
    setCurrentIndex(index)
    setVisible(true)
}

<View>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {urls.map((item, index) => (
            <Press key={index} onPress={() => handlePress(index)}>
                <Image source={item} imageStyle={{ width: 100, height: 100 }} />
            </Press>
        ))}
    </View>
    <Preview
        visible={visible}
        source={previewSources}
        index={currentIndex}
        onClose={() => setVisible(false)}
        onChange={setCurrentIndex}
        footers={footers}
    />
</View>
```

### 案例 4：支持图片缩放功能

```tsx
// 迁移前 - flower-rn
import { ImagePreview } from '@sgfe/flower-rn'

<ImagePreview
    source={{ uri: 'https://example.com/image.jpg' }}
    index={0}
    zoomable={true}  // 启用缩放
    onClose={handleClose}
/>

// 迁移后 - wand-rn
import { Preview, ScreenImage } from '@sfe/wand-rn'
// 注：zoomable 功能在 ScreenImage 组件中通过 zoomable prop 实现
// 如果需要自定义渲染，可使用 renderItem

<Preview
    visible={visible}
    source={previewSource}
    index={0}
    onClose={handleClose}
    // 使用默认渲染，已支持缩放
/>
```

## 关键变更点

### 1. 组件名称变更
- `ImagePreview` 组件改名为 `Preview`
- 不再提供 `PreviewGroup` 组件，需要手动维护图片列表和预览状态

### 2. 源数据格式变更
- 旧格式：直接使用 `ImageURISource` 或 `ImageRequireSource`
- 新格式：需要转换为 `PreviewSource` 类型，包含 `uri`、`isImage`、`isVideo` 等字段
- 转换示例：
```tsx
// 旧格式
{ uri: 'https://example.com/image.jpg' }

// 新格式
{
    uri: 'https://example.com/image.jpg',
    isImage: true,
    isVideo: false
}
```

### 3. 可见性控制
- 旧组件：通过 `index` 属性为 `-1` 来隐藏
- 新组件：通过 `visible` 属性明确控制

### 4. PreviewGroup 功能
- 新版本中 `PreviewGroup` 已移除
- 需要手动维护：
  - 图片列表的展示
  - 点击图片时的状态管理（当前预览索引、是否显示预览）
  - 通过 `Preview` 组件的 `visible` 和 `index` 属性控制预览

### 5. 视频支持
- 新组件支持视频预览
- 需要通过 `isVideo` 字段标识
- 可设置 `onVideoLoadSuccess` 和 `onVideoLoadError` 回调

### 6. 底部内容
- `footers` 属性行为保持一致
- 当为数组时，按索引对应；当为单一元素时，所有预览共享

## 迁移注意事项

1. **状态管理变化**：需要额外维护 `visible` 状态来控制预览是否显示
2. **PreviewGroup 替换**：如果使用了 `PreviewGroup`，需要手动实现图片列表和预览的联动
3. **类型转换**：务必确保源数据正确转换为 `PreviewSource` 类型
4. **缩放功能**：新组件的缩放功能已默认开启，无需额外配置
5. **视频支持**：新组件同时支持图片和视频预览，合理利用新特性

