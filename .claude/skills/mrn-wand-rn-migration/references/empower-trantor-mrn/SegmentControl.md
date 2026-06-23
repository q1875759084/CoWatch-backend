# SegmentControl 分段控制器

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sfe/biz-wand-rn`

## 旧组件 API

```tsx
export interface SegmentControlProps {
    /** 选项列表 */
    options: Array<{ label: string; value: string | number }>
    /** 当前选中值 */
    value?: string | number
    /** 选中变化回调 */
    onChange?: (value: string | number) => void
    /** 自定义样式 */
    style?: StyleProp<ViewStyle>
}
```

## 新组件 API

```tsx
export interface SegmentControlProps {
    /** 选项列表 */
    options: Array<{ label: string; value: string | number }>
    /** 当前选中值 */
    value?: string | number
    /** 选中变化回调 */
    onChange?: (value: string | number) => void
    /** 自定义样式 */
    style?: StyleProp<ViewStyle>
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| options | options | 选项列表，保持一致 |
| value | value | 当前选中值，保持一致 |
| onChange | onChange | 选中变化回调，保持一致 |
| style | style | 自定义样式，保持一致 |

## 迁移示例

### 案例 1：基础使用

```tsx
// 迁移前
import { SegmentControl } from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const [value, setValue] = useState('option1')

    return (
        <SegmentControl
            options={[
                { label: '选项1', value: 'option1' },
                { label: '选项2', value: 'option2' },
                { label: '选项3', value: 'option3' },
            ]}
            value={value}
            onChange={setValue}
        />
    )
}

// 迁移后
import { SegmentControl } from '@sfe/biz-wand-rn'

function MyComponent() {
    const [value, setValue] = useState('option1')

    return (
        <SegmentControl
            options={[
                { label: '选项1', value: 'option1' },
                { label: '选项2', value: 'option2' },
                { label: '选项3', value: 'option3' },
            ]}
            value={value}
            onChange={setValue}
        />
    )
}
```

### 案例 2：带自定义样式

```tsx
// 迁移前
import { SegmentControl } from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const [value, setValue] = useState('option1')

    return (
        <SegmentControl
            options={[
                { label: '全部', value: 'all' },
                { label: '进行中', value: 'ongoing' },
                { label: '已完成', value: 'completed' },
            ]}
            value={value}
            onChange={setValue}
            style={styles.segment}
        />
    )
}

// 迁移后
import { SegmentControl } from '@sfe/biz-wand-rn'

function MyComponent() {
    const [value, setValue] = useState('option1')

    return (
        <SegmentControl
            options={[
                { label: '全部', value: 'all' },
                { label: '进行中', value: 'ongoing' },
                { label: '已完成', value: 'completed' },
            ]}
            value={value}
            onChange={setValue}
            style={styles.segment}
        />
    )
}
```

### 案例 3：动态选项

```tsx
// 迁移前
import { SegmentControl } from '@mtfe/empower-trantor-mrn'

function MyComponent({ tabs }: { tabs: Array<{ label: string; value: string }> }) {
    const [activeTab, setActiveTab] = useState(tabs[0]?.value)

    return (
        <SegmentControl
            options={tabs}
            value={activeTab}
            onChange={setActiveTab}
        />
    )
}

// 迁移后
import { SegmentControl } from '@sfe/biz-wand-rn'

function MyComponent({ tabs }: { tabs: Array<{ label: string; value: string }> }) {
    const [activeTab, setActiveTab] = useState(tabs[0]?.value)

    return (
        <SegmentControl
            options={tabs}
            value={activeTab}
            onChange={setActiveTab}
        />
    )
}
```

## 关键点

- **API 完全兼容**：SegmentControl 的 API 在新旧库中完全一致
- **直接替换**：只需修改 import 路径即可
- **功能保持一致**：选项切换、回调等功能保持不变

## 迁移检查清单

- [ ] 将所有 `import { SegmentControl } from '@mtfe/empower-trantor-mrn'` 改为 `import { SegmentControl } from '@sfe/biz-wand-rn'`
- [ ] 验证分段控制器是否正常显示
- [ ] 验证选项切换是否正常工作
- [ ] 验证 onChange 回调是否正常触发
- [ ] 测试自定义样式是否正确应用

## 注意事项

1. **直接替换即可**：SegmentControl 是完全兼容的组件，只需修改 import 路径
2. **注意目标库**：迁移到的是 `@sfe/biz-wand-rn` 而不是 `@sfe/wand-rn`
3. **业务组件库**：biz-wand-rn 是业务组件库，包含特定业务场景的组件
