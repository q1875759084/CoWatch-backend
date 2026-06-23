# Tip 顶部提示

## 从何处迁移
- **源库**: `@roo/roo-rn1`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface TipProps extends WithThemeStyles<TipStyles> {
  /** 是否显示 */
  visible?: boolean  // 默认 true
  /** 提示文字 */
  body?: string
  /** 点击回调 */
  onPress?: () => void
  /** 首部图标 */
  frontIcon?: JSX.Element
  /** 尾部图标 */
  endIcon?: JSX.Element
  /** 图标对齐方式 */
  iconJustifyContent?: FlexStyle['justifyContent']  // 默认 'flex-start'
  /** 是否需要动画 */
  needAnimated?: boolean  // 默认 false
  /** 动画类型 */
  animatedType?: 'slide' | 'marquee'  // 默认 null
  /** 动画过渡时间 */
  animatedDuration?: number  // 默认 3000
  /** 动画方向 */
  animatedDirection?: 'left' | 'right'  // 默认 'left'
  /** 操作按钮配置 */
  buttonConfig?: {
    ele?: JSX.Element
    text?: string
    onPress?: () => void
  }
  /** 展示行数 */
  numberOfLines?: number  // 默认 2
}
```

## 新组件 API

```tsx
export interface TipProps extends WithThemeStyles<TipStyles> {
  /** 是否显示 */
  visible?: boolean  // 默认 true
  /** 提示文字 - 通过 children 传入 */
  children?: string | JSX.Element
  /** 点击回调 */
  onPress?: () => void
  /** 首部图标 */
  frontIcon?: JSX.Element
  /** 尾部图标 */
  endIcon?: JSX.Element
  /** 尾部图标点击回调 */
  onEndIconPress?: () => void
  /** 图标对齐方式 */
  iconJustifyContent?: FlexStyle['justifyContent']  // 默认 'flex-start'
  /** 背景颜色类型 */
  bgColorType?: 'info' | 'warn'  // 默认 'info'
  /** 文字颜色类型 */
  textColorType?: 'info' | 'warn' | 'danger'  // 默认 'info'
  /** 操作按钮配置 */
  buttonProps?: {
    text: string
    type?: 'primary' | 'text'  // 默认 'primary'
    onPress?: () => void
  }
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| body | children | 文字内容改为通过 children 传入 |
| - | bgColorType | 新增，支持 info/warn 两种背景色类型 |
| - | textColorType | 新增，支持 info/warn/danger 三种文字色类型 |
| - | onEndIconPress | 新增，尾部 icon 点击回调 |
| needAnimated | - | 已移除，不再支持动画 |
| animatedType | - | 已移除，不再支持动画 |
| animatedDuration | - | 已移除，不再支持动画 |
| animatedDirection | - | 已移除，不再支持动画 |
| numberOfLines | - | 已移除，固定为 2 行 |
| buttonConfig | buttonProps | 属性名变更，结构有所改变 |
| iconJustifyContent | iconJustifyContent | 保持一致 |
| frontIcon | frontIcon | 保持一致 |
| endIcon | endIcon | 保持一致 |
| visible | visible | 保持一致 |
| onPress | onPress | 保持一致 |

## 迁移示例

### 案例 1：基础提示

```tsx
// 迁移前
import { Tip } from '@roo/roo-rn1'

<Tip body="当前为忙碌状态，为保证顾客体验，请切为在线状态" />

// 迁移后
import { Tip } from '@sfe/wand-rn'

<Tip>当前为忙碌状态，为保证顾客体验，请切为在线状态</Tip>
```

### 案例 2：隐藏提示

```tsx
// 迁移前
import { Tip } from '@roo/roo-rn1'

<Tip visible={false} body="当前为忙碌状态" />

// 迁移后
import { Tip } from '@sfe/wand-rn'

<Tip visible={false}>当前为忙碌状态</Tip>
```

### 案例 3：带前置图标

```tsx
// 迁移前
import { Tip, Icon } from '@roo/roo-rn1'

<Tip
  frontIcon={<Icon type="announcement-o" size={16} tintColor="#FF6A00" />}
  body="全场5折嗨不停，满100减50"
/>

// 迁移后
import { Tip, Icon } from '@sfe/wand-rn'

<Tip
  frontIcon={<Icon type="announce" size={16} />}
>
  全场5折嗨不停，满100减50
</Tip>
```

### 案例 4：带前置和后置图标

```tsx
// 迁移前
import { Tip, Icon } from '@roo/roo-rn1'

<Tip
  frontIcon={<Icon type="announcement-o" size={16} tintColor="#222222" />}
  endIcon={<Icon type="more_right" tintColor="#222222" />}
  body="开启系统通知，订单聊天等信息不错过"
/>

// 迁移后
import { Tip, Icon } from '@sfe/wand-rn'

<Tip
  frontIcon={<Icon type="announce" size={16} />}
  endIcon={<Icon type="arrow-right" />}
>
  开启系统通知，订单聊天等信息不错过
</Tip>
```

### 案例 5：带后置图标点击回调（新增）

```tsx
// 迁移前 - 无此功能
import { Tip } from '@roo/roo-rn1'

// 只能通过全局 onPress 处理

// 迁移后 - 可单独处理尾部 icon 点击
import { Tip, Icon } from '@sfe/wand-rn'

<Tip
  endIcon={<Icon type="close" />}
  onEndIconPress={() => {
    console.log('关闭按钮被点击')
  }}
>
  当前为忙碌状态
</Tip>
```

### 案例 6：背景颜色类型 - info（默认）

```tsx
// 迁移前 - 通过 styles 自定义背景色
import { Tip } from '@roo/roo-rn1'

<Tip
  body="提示信息"
  styles={{
    container: {
      backgroundColor: '#FFF8E1'
    }
  }}
/>

// 迁移后 - 使用 bgColorType
import { Tip } from '@sfe/wand-rn'

<Tip bgColorType="info">提示信息</Tip>
```

### 案例 7：背景颜色类型 - warn

```tsx
// 迁移前 - 通过 styles 自定义背景色
import { Tip } from '@roo/roo-rn1'

<Tip
  body="警告信息"
  styles={{
    container: {
      backgroundColor: '#FFF1E7'
    }
  }}
/>

// 迁移后 - 使用 bgColorType
import { Tip } from '@sfe/wand-rn'

<Tip bgColorType="warn">警告信息</Tip>
```

### 案例 8：文字颜色类型 - info

```tsx
// 迁移前 - 通过 styles 自定义文字色
import { Tip } from '@roo/roo-rn1'

<Tip
  body="提示信息"
  styles={{
    text: {
      color: '#222222'
    }
  }}
/>

// 迁移后 - 使用 textColorType
import { Tip } from '@sfe/wand-rn'

<Tip textColorType="info">提示信息</Tip>
```

### 案例 9：文字颜色类型 - warn

```tsx
// 迁移前
import { Tip } from '@roo/roo-rn1'

<Tip
  body="警告信息"
  styles={{
    text: {
      color: '#FF6A00'
    }
  }}
/>

// 迁移后
import { Tip } from '@sfe/wand-rn'

<Tip textColorType="warn">警告信息</Tip>
```

### 案例 10：文字颜色类型 - danger

```tsx
// 迁移前 - 无此类型，需要自定义
import { Tip } from '@roo/roo-rn1'

<Tip
  body="错误信息"
  styles={{
    text: {
      color: '#FF192D'
    }
  }}
/>

// 迁移后 - 新增 danger 类型
import { Tip } from '@sfe/wand-rn'

<Tip textColorType="danger">错误信息</Tip>
```

### 案例 11：操作按钮 - 主按钮样式（新增）

```tsx
// 迁移前 - 通过 buttonConfig 配置
import { Tip } from '@roo/roo-rn1'

<Tip
  body="需要操作的提示"
  buttonConfig={{
    text: '操作',
    onPress: () => console.log('clicked')
  }}
/>

// 迁移后 - 使用 buttonProps（type 默认为 primary）
import { Tip } from '@sfe/wand-rn'

<Tip
  buttonProps={{
    text: '操作',
    type: 'primary',
    onPress: () => console.log('clicked')
  }}
>
  需要操作的提示
</Tip>
```

### 案例 12：操作按钮 - 文字按钮样式（新增）

```tsx
// 迁移前 - 无此功能
import { Tip } from '@roo/roo-rn1'

// 只能使用主按钮样式

// 迁移后 - 支持文字按钮
import { Tip } from '@sfe/wand-rn'

<Tip
  buttonProps={{
    text: '了解详情',
    type: 'text',
    onPress: () => console.log('clicked')
  }}
>
  新活动已上线
</Tip>
```

### 案例 13：自定义按钮（ele 方式）

```tsx
// 迁移前 - 通过 buttonConfig.ele 自定义
import { Tip } from '@roo/roo-rn1'

<Tip
  body="提示信息"
  buttonConfig={{
    ele: <TouchableOpacity><Text>自定义</Text></TouchableOpacity>
  }}
/>

// 迁移后 - 保持一致（但不建议，建议使用 buttonProps）
import { Tip } from '@sfe/wand-rn'

<Tip
  buttonProps={{
    text: '自定义',
    onPress: () => {}
  }}
>
  提示信息
</Tip>
```

### 案例 14：点击回调

```tsx
// 迁移前
import { Tip } from '@roo/roo-rn1'

<Tip
  body="可点击的提示"
  onPress={() => {
    console.log('Tip 被点击')
  }}
/>

// 迁移后
import { Tip } from '@sfe/wand-rn'

<Tip
  onPress={() => {
    console.log('Tip 被点击')
  }}
>
  可点击的提示
</Tip>
```

### 案例 15：图标对齐方式

```tsx
// 迁移前
import { Tip, Icon } from '@roo/roo-rn1'

<Tip
  frontIcon={<Icon type="announcement-o" size={16} />}
  iconJustifyContent="center"
  body="图标居中对齐"
/>

// 迁移后
import { Tip, Icon } from '@sfe/wand-rn'

<Tip
  frontIcon={<Icon type="announce" size={16} />}
  iconJustifyContent="center"
>
  图标居中对齐
</Tip>
```

### 案例 16：完整场景 - 商店离线通知

```tsx
// 迁移前
import { Tip, Icon } from '@roo/roo-rn1'

<Tip
  visible={isOffline}
  frontIcon={<Icon type="announcement-o" size={16} tintColor="#FF6A00" />}
  body="当前为忙碌状态，为保证顾客体验，店内空闲时请切为在线状态"
  styles={{
    text: {
      color: '#FF6A00'
    }
  }}
  buttonConfig={{
    text: '去设置',
    onPress: () => navigateToSettings()
  }}
  onPress={() => {
    console.log('提示被点击')
  }}
/>

// 迁移后
import { Tip, Icon } from '@sfe/wand-rn'

<Tip
  visible={isOffline}
  frontIcon={<Icon type="announce" size={16} />}
  bgColorType="warn"
  textColorType="warn"
  buttonProps={{
    text: '去设置',
    type: 'primary',
    onPress: () => navigateToSettings()
  }}
  onPress={() => {
    console.log('提示被点击')
  }}
>
  当前为忙碌状态，为保证顾客体验，店内空闲时请切为在线状态
</Tip>
```

### 案例 17：多行文字（固定 2 行）

```tsx
// 迁移前 - 可通过 numberOfLines 自定义
import { Tip } from '@roo/roo-rn1'

<Tip
  body="开启系统通知，订单聊天等信息不错过，开启系统通知，订单聊天等信息，开启系统通知，最多展示两行，超过就省略号"
  numberOfLines={3}
/>

// 迁移后 - 固定为 2 行，不支持自定义
import { Tip } from '@sfe/wand-rn'

<Tip>
  开启系统通知，订单聊天等信息不错过，开启系统通知，订单聊天等信息，开启系统通知，最多展示两行，超过就省略号
</Tip>
```

### 案例 18：清除通知（使用 onEndIconPress）

```tsx
// 迁移前 - 通过 endIcon 和 onPress 配合
import { Tip, Icon } from '@roo/roo-rn1'

const [visible, setVisible] = useState(true)

<Tip
  visible={visible}
  endIcon={<Icon type="close" />}
  body="通知信息"
  onPress={() => setVisible(false)}
/>

// 迁移后 - 使用 onEndIconPress
import { Tip, Icon } from '@sfe/wand-rn'

const [visible, setVisible] = useState(true)

<Tip
  visible={visible}
  endIcon={<Icon type="close" />}
  onEndIconPress={() => setVisible(false)}
>
  通知信息
</Tip>
```

### 案例 19：组合样式 - info 背景 + 自定义文字颜色

```tsx
// 迁移前 - 通过 styles 完全自定义
import { Tip } from '@roo/roo-rn1'

<Tip
  body="自定义样式"
  styles={{
    container: {
      backgroundColor: '#FFF8E1'
    },
    text: {
      color: '#222222'
    }
  }}
/>

// 迁移后 - 使用类型 props 配合自定义样式
import { Tip } from '@sfe/wand-rn'

<Tip
  bgColorType="info"
  textColorType="info"
  styles={{
    text: {
      color: '#222222'
    }
  }}
>
  自定义样式
</Tip>
```

### 案例 20：无动画 - 移除动画相关代码

```tsx
// 迁移前 - 有动画配置
import { Tip } from '@roo/roo-rn1'

<Tip
  body="跑马灯效果"
  needAnimated={true}
  animatedType="marquee"
  animatedDuration={5000}
  animatedDirection="left"
/>

// 迁移后 - 移除所有动画相关属性
import { Tip } from '@sfe/wand-rn'

<Tip>跑马灯效果</Tip>
// 注意：新版本不支持动画，需要在应用层实现动画效果
```

## 关键点

### 1. 文字内容传递方式改变
- **旧版本**：通过 `body` prop 传入
- **新版本**：通过 `children` 传入，更符合 React 组件规范

### 2. 颜色类型系统
- **旧版本**：需要手动通过 `styles` 自定义背景色和文字色
- **新版本**：新增 `bgColorType` 和 `textColorType` 两个 prop，支持预定义的颜色组合
  - `bgColorType`: 'info' (#FFF8E1)、'warn' (#FFF1E7)
  - `textColorType`: 'info' (#222222)、'warn' (#FF6A00)、'danger' (#FF192D)

### 3. 动画功能移除
- **旧版本**：支持 'slide' 和 'marquee' 两种动画类型
- **新版本**：完全移除动画功能，所有动画相关属性已删除
  - 如需动画效果，需在应用层自行实现

### 4. 按钮配置结构变更
- **旧版本**：`buttonConfig = { text, onPress, ele }`
- **新版本**：`buttonProps = { text, type, onPress }`
  - 新增 `type` 属性，支持 'primary' (默认) 和 'text' 两种样式
  - 移除了 `ele` 属性（如需自定义，可使用传统方式自定义按钮）

### 5. 新增尾部图标点击回调
- **旧版本**：没有单独的尾部 icon 点击回调
- **新版本**：新增 `onEndIconPress` prop，允许单独处理尾部 icon 的点击事件

### 6. 行数限制
- **旧版本**：通过 `numberOfLines` prop 自定义行数
- **新版本**：固定为 2 行，不支持自定义

### 7. 主题变量变更
- 旧版本使用 `tipVSpacing`、`mtdHSpacingM` 等主题变量
- 新版本使用 `spaceBase`、`spaceSm`、`spaceLg` 等统一的间距变量
- 旧版本使用 `mtdFontSizeS` 等字体大小变量
- 新版本使用 `fontSizeSm` 等统一的字体大小变量

## 迁移检查清单

- [ ] 确认所有 `body` 属性改为 `children`
- [ ] 检查是否有动画相关代码（needAnimated、animatedType、animatedDuration、animatedDirection），需移除
- [ ] 检查是否有 numberOfLines 属性，需移除（新版本固定为 2 行）
- [ ] 验证 `buttonConfig` 改为 `buttonProps` 后功能正常
- [ ] 检查是否有自定义按钮（buttonConfig.ele），考虑是否需要迁移
- [ ] 确认背景颜色通过 `bgColorType` 设置（info/warn）
- [ ] 确认文字颜色通过 `textColorType` 设置（info/warn/danger）
- [ ] 验证 `onPress` 和 `onEndIconPress` 回调正常工作
- [ ] 检查是否有自定义样式通过 `styles` prop 传入，需验证是否还需要
- [ ] 确认 icon 类型名称正确（检查旧 icon type 是否在新库中存在）
- [ ] 测试在不同屏幕尺寸下的显示效果
- [ ] 验证可访问性（aria 属性等）
- [ ] 检查是否有通过 `visible` prop 动态控制显示隐藏

## 注意事项

1. **动画功能完全移除**：
   - 如果旧版本使用了跑马灯或滑动动画，需要在应用层重新实现
   - 考虑使用其他组件或自定义实现动画效果

2. **文字行数固定为 2**：
   - 新版本不支持自定义行数
   - 长文字会自动截断并显示省略号

3. **按钮样式限制**：
   - 新版本只支持 'primary' 和 'text' 两种按钮样式
   - 如需其他样式，需要自定义实现

4. **主题变量兼容**：
   - 如有全局修改过主题变量，需要检查新的变量名是否对应正确

5. **Icon 类型变更**：
   - 旧库的 icon type 可能在新库中不存在或名称不同
   - 需要逐个检查并更新 icon type

6. **颜色预定义组合**：
   - 使用 `bgColorType` 和 `textColorType` 可以直接应用预定义的颜色组合
   - 不需要手动通过 `styles` 定义颜色，代码更清晰

7. **子组件 children**：
   - 支持字符串和 JSX.Element 两种类型
   - 可以传入复杂的 JSX 结构作为提示内容
