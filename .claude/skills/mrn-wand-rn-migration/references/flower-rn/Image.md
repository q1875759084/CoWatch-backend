# Image 图片

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface ImageProps {
    /** 图片的圆角尺寸，可以是预设的值（'XS', 'S', 'M', 'L', 'XL'）或自定义的数字 */
    radiusSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | number  // 默认 'XS'
    /** 加载失败可重试 */
    retriable?: boolean  // 默认 false
    /** 展示loading状态*/
    showLoading?: boolean  // 默认 false
    /** 展示Error状态*/
    showError?: boolean  // 默认 true
    /** 图片样式 */
    imageStyle?: StyleProp<ImageStyle>
    /** 点击事件 */
    onPress?: () => void
    /** 图片来源 */
    source: ImageURISource | ImageRequireSource
    /** 图片裁剪 */
    croppable?: boolean  // 默认 false
    /** 提供回调给外部 */
    onLoad?: OriginImageProps['onLoad']
    onLoadStart?: OriginImageProps['onLoadStart']
    onError?: OriginImageProps['onError']
    /** 是否预览/预览设置 */
    preview?: boolean | PreviewConfig
    /** 自定义图片加载错误时展示内容 */
    error?: React.ReactNode
    /** 自定义图片加载中展示内容 */
    loading?: React.ReactNode
}

type PreviewConfig = {
    zoomable?: boolean  // 默认 false
    onClose?: () => void
}
```

## 新组件 API

```tsx
interface ImageProps {
    /** 图片来源 */
    source: ImageURISource | ImageRequireSource
    /** 自定义图片加载中展示内容 */
    loading?: React.ReactNode
    /** 自定义图片加载错误时展示内容 */
    error?: React.ReactNode
    /** 图片的圆角尺寸，可以是预设的值（'xs', 's', 'm', 'l', 'xl'）或自定义的数字 */
    radius?: 'xs' | 's' | 'm' | 'l' | 'xl' | number  // 默认 'xs'
    /**
     * @deprecated 即将废弃
     * 图片的圆角尺寸，可以是预设的值（'XS', 'S', 'M', 'L', 'XL'）或自定义的数字
     */
    radiusSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | number
    /** 加载失败可重试 */
    retriable?: boolean  // 默认 false
    /** 图片裁剪 */
    croppable?: boolean  // 默认 false
    /** 展示loading状态*/
    showLoading?: boolean  // 默认 false
    /** 展示 Error 状态*/
    showError?: boolean  // 默认 true
    /** 是否预览/预览设置 */
    preview?: boolean | PreviewConfig
    /** 图片样式 */
    imageStyle?: StyleProp<ImageStyle>
    /** 点击事件的回调函数 */
    onPress?: () => void
    /** 加载成功时的回调函数 */
    onLoad?: OriginImageProps['onLoad']
    /** 加载开始时的回调函数 */
    onLoadStart?: OriginImageProps['onLoadStart']
    /** 加载失败回调 */
    onError?: OriginImageProps['onError']
}

type PreviewConfig = {
    zoomable?: boolean  // 默认 false
    onClose?: () => void
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| radiusSize | radius | 圆角尺寸，属性名称和值都改变（'XS' → 'xs'，大写转小写） |
| radiusSize | radiusSize | 仍然支持旧属性名（已标记废弃，不建议使用） |
| retriable | retriable | 加载失败重试，保持一致 |
| showLoading | showLoading | 显示加载状态，保持一致 |
| showError | showError | 显示错误状态，保持一致 |
| imageStyle | imageStyle | 图片样式，保持一致 |
| onPress | onPress | 点击回调，保持一致 |
| source | source | 图片来源，保持一致 |
| croppable | croppable | 图片裁剪，保持一致 |
| onLoad | onLoad | 加载成功回调，保持一致 |
| onLoadStart | onLoadStart | 加载开始回调，保持一致 |
| onError | onError | 加载失败回调，保持一致 |
| preview | preview | 预览配置，保持一致 |
| error | error | 自定义错误展示，保持一致 |
| loading | loading | 自定义加载展示，保持一致 |

## 关键变更

### 1. radiusSize → radius（推荐）
- **旧版本**：`radiusSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | number`
- **新版本**：`radius?: 'xs' | 's' | 'm' | 'l' | 'xl' | number`
- 属性名从 `radiusSize` 改为 `radius`
- 预设值从大写改为小写（'XS' → 'xs'）
- 新版本仍向后兼容 `radiusSize` 属性，但已标记废弃

### 2. 属性值转换
- `'XS'` → `'xs'`
- `'S'` → `'s'`
- `'M'` → `'m'`
- `'L'` → `'l'`
- `'XL'` → `'xl'`
- 数字类型保持不变

### 3. 圆角尺寸定义
- 新版本使用小写的 `Radius` 枚举：`xs(1) | s(1.5) | m(2.5) | l(4) | xl(6.5)`
- 旧版本使用大写的 `RadiusSize` 枚举：`XS(1) | S(1.5) | M(2.5) | L(4) | XL(6.5)`
- 数值保持一致

### 4. 图片裁剪优化
- 新版本中，`croppable` 开启时，双倍像素处理（width/height 会被乘以 2）
- 旧版本为 1 倍

### 5. 其他属性保持一致
- 所有其他 API 属性保持不变，包括事件、样式、状态显示等

## 迁移示例

### 案例 1：基础图片

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<Image source={{ uri: 'https://example.com/image.png' }} />

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image source={{ uri: 'https://example.com/image.png' }} />
```

### 案例 2：使用圆角尺寸 - 推荐方式

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  radiusSize="M"
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  radius="m"
/>
```

### 案例 3：使用圆角尺寸 - 向后兼容方式

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  radiusSize="L"
/>

// 迁移后（使用 radiusSize，向后兼容但不推荐）
import { Image } from '@sfe/wand-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  radiusSize="L"
/>
```

### 案例 4：自定义圆角半径

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  radiusSize={8}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  radius={8}
/>
```

### 案例 5：加载状态

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  showLoading={true}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  showLoading={true}
/>
```

### 案例 6：错误状态

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  showError={true}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  showError={true}
/>
```

### 案例 7：加载失败重试

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  retriable={true}
  showError={true}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  retriable={true}
  showError={true}
/>
```

### 案例 8：自定义加载内容

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'
import { ActivityIndicator } from '@mrn/react-native'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  loading={<ActivityIndicator size={30} color="#999" />}
  showLoading={true}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'
import { ActivityIndicator } from '@mrn/react-native'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  loading={<ActivityIndicator size={30} color="#999" />}
  showLoading={true}
/>
```

### 案例 9：自定义错误内容

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'
import { Text } from '@mrn/react-native'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  error={<Text>加载失败</Text>}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'
import { Text } from '@mrn/react-native'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  error={<Text>加载失败</Text>}
/>
```

### 案例 10：图片预览

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  preview={true}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  preview={true}
/>
```

### 案例 11：图片预览（带缩放）

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  preview={{ zoomable: true, onClose: () => console.log('closed') }}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  preview={{ zoomable: true, onClose: () => console.log('closed') }}
/>
```

### 案例 12：图片裁剪

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  croppable={true}
  imageStyle={{ width: 100, height: 100 }}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  croppable={true}
  imageStyle={{ width: 100, height: 100 }}
/>
```

### 案例 13：所有预设圆角尺寸

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<>
  <Image source={{ uri: 'https://example.com/1.png' }} radiusSize="XS" />
  <Image source={{ uri: 'https://example.com/2.png' }} radiusSize="S" />
  <Image source={{ uri: 'https://example.com/3.png' }} radiusSize="M" />
  <Image source={{ uri: 'https://example.com/4.png' }} radiusSize="L" />
  <Image source={{ uri: 'https://example.com/5.png' }} radiusSize="XL" />
</>

// 迁移后
import { Image } from '@sfe/wand-rn'

<>
  <Image source={{ uri: 'https://example.com/1.png' }} radius="xs" />
  <Image source={{ uri: 'https://example.com/2.png' }} radius="s" />
  <Image source={{ uri: 'https://example.com/3.png' }} radius="m" />
  <Image source={{ uri: 'https://example.com/4.png' }} radius="l" />
  <Image source={{ uri: 'https://example.com/5.png' }} radius="xl" />
</>
```

### 案例 14：加载回调

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  onLoadStart={() => console.log('开始加载')}
  onLoad={() => console.log('加载成功')}
  onError={(error) => console.log('加载失败', error)}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  onLoadStart={() => console.log('开始加载')}
  onLoad={() => console.log('加载成功')}
  onError={(error) => console.log('加载失败', error)}
/>
```

### 案例 15：点击事件

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  onPress={() => console.log('图片被点击')}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  onPress={() => console.log('图片被点击')}
/>
```

### 案例 16：完整复杂场景

```tsx
// 迁移前
import { Image } from '@sgfe/flower-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  radiusSize="M"
  retriable={true}
  showLoading={true}
  showError={true}
  croppable={true}
  preview={{ zoomable: true }}
  imageStyle={{ width: 120, height: 120 }}
  onLoadStart={() => console.log('开始加载')}
  onLoad={() => console.log('加载成功')}
  onError={(error) => console.log('加载失败', error)}
  onPress={() => console.log('被点击')}
/>

// 迁移后
import { Image } from '@sfe/wand-rn'

<Image 
  source={{ uri: 'https://example.com/image.png' }}
  radius="m"
  retriable={true}
  showLoading={true}
  showError={true}
  croppable={true}
  preview={{ zoomable: true }}
  imageStyle={{ width: 120, height: 120 }}
  onLoadStart={() => console.log('开始加载')}
  onLoad={() => console.log('加载成功')}
  onError={(error) => console.log('加载失败', error)}
  onPress={() => console.log('被点击')}
/>
```

## 关键点

### 1. 圆角属性迁移（重要）
- `radiusSize` 改为 `radius`（推荐方案）
- 属性值从大写改为小写：'XS' → 'xs'
- 新版本仍向后兼容 `radiusSize`（已标记废弃）

### 2. 属性值规范化
- 预设值统一使用小写：'xs' | 's' | 'm' | 'l' | 'xl'
- 数字类型保持不变

### 3. 图片裁剪优化
- 新版本双倍像素处理（如 width 为 100，实际处理宽度为 200）
- 旧版本为原尺寸处理

### 4. 所有其他 API 保持一致
- 事件回调、样式属性、状态显示等都保持一致
- 迁移成本低，主要是属性名和值的转换

### 5. 预览功能保持一致
- 预览、缩放、关闭回调等都保持不变

## 迁移检查清单

- [ ] 将所有 `import { Image } from '@sgfe/flower-rn'` 改为 `import { Image } from '@sfe/wand-rn'`
- [ ] 将所有 `radiusSize="XS"` 改为 `radius="xs"`（推荐）
- [ ] 将所有 `radiusSize="S"` 改为 `radius="s"`
- [ ] 将所有 `radiusSize="M"` 改为 `radius="m"`
- [ ] 将所有 `radiusSize="L"` 改为 `radius="l"`
- [ ] 将所有 `radiusSize="XL"` 改为 `radius="xl"`
- [ ] 检查是否有硬编码的圆角尺寸值，若有数字类型，保持不变
- [ ] 验证图片加载状态是否正常显示
- [ ] 验证图片错误状态是否正常显示
- [ ] 测试图片预览功能是否正常
- [ ] 测试图片裁剪功能是否正常（注意双倍像素处理）
- [ ] 验证所有加载回调是否正常触发
- [ ] 验证点击事件是否正常工作

## 注意事项

1. **属性名和值都要改变**：
   - 不仅要改属性名 `radiusSize` → `radius`
   - 还要改属性值 'XS' → 'xs'

2. **向后兼容支持**：
   - 新版本仍支持旧的 `radiusSize` 属性
   - 但已标记为废弃（deprecated），不建议使用
   - 推荐使用新的 `radius` 属性

3. **图片裁剪的双倍像素处理**：
   - 新版本 `croppable=true` 时会使用双倍像素
   - 这是图片质量优化的改进，设计上如果 width=100，实际请求宽度为 200
   - 需要测试确保图片加载正确

4. **其他 API 完全兼容**：
   - 大多数属性都保持一致
   - 迁移成本低，主要是属性转换

5. **预览需要 Provider 支持**：
   - 图片预览功能需要在 App 入口处加入 WandRnProvider
   - 确保使用了正确的 Provider 包裹

6. **全量扫描推荐**：
   - 使用 IDE 的全局搜索替换
   - 搜索 `radiusSize="XS"` 等，逐个替换为 `radius="xs"`

## 迁移命令参考

可以使用以下正则表达式进行批量搜索替换：

- `radiusSize="XS"` → `radius="xs"`
- `radiusSize="S"` → `radius="s"`
- `radiusSize="M"` → `radius="m"`
- `radiusSize="L"` → `radius="l"`
- `radiusSize="XL"` → `radius="xl"`
- `radiusSize={` → `radius={`（适用于变量）
