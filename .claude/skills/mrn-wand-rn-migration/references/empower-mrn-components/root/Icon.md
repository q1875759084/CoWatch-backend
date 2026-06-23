# Icon 图标

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
export interface IconProps {
    type?: AllIcons  // 图标类型
    size?: number  // 默认 22
    tintColor?: string  // 图标染色
    style?: StyleProp<ImageStyle>
    source?: ImageSourcePropType  // 自定义图标源
}

export type AllIcons = 
    | 'add-square-o'
    | 'add'
    | 'arrow-left'
    | 'arrow-right'
    | 'arrow-up'
    | ... // 共 89 种图标
    | 'wifi-o'

export class Icon extends PureComponent<IconProps> {
    static defaultProps = {
        size: 22,
        tintColor: null,
        style: null,
        source: null
    }
}
```

## 新组件 API

```tsx
export interface IconProps {
    type: AllIcons  // 图标类型（必填）
    size?: number  // 默认 22
    color?: string  // 图标颜色
    source?: ImageSourcePropType  // 自定义图标源
    opacity?: number  // 默认 1，图标透明度
    style?: StyleProp<ImageStyle> | ViewStyle
}

export type AllIcons = 
    | 'navigation-back'
    | 'left-arrow'
    | 'right-arrow'
    | 'double-left-arrow'
    | 'double-right-arrow'
    | 'mini-top-arrow'
    | 'mini-right-arrow'
    | 'mini-down-arrow'
    | 'edit-lg'
    | 'edit-md'
    | 'print'
    | 'phone'
    | ... // 共 52 种图标
    | 'customer-service'

export class Icon extends Component<IconProps> {
    static defaultProps = {
        size: 22,
        color: null,
        source: null,
        type: 'navigation-back',
        opacity: 1,
        style: {},
    }
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| type | type | 保持一致，但取值范围改变，需要映射 |
| size | size | 保持一致 |
| tintColor | color | 属性名改变，功能一致 |
| style | style | 保持一致 |
| source | source | 保持一致 |
| - | opacity | 新增透明度属性 |

## 图标名称映射

新组件重新设计了图标命名体系，部分常用图标的映射如下：

| 旧图标名 | 新图标名 | 说明 |
|---------|---------|------|
| arrow-left | left-arrow | 左箭头 |
| arrow-right | right-arrow | 右箭头 |
| arrow-up | mini-top-arrow | 向上箭头 |
| down | mini-down-arrow | 向下箭头 |
| close | close-outlined | 关闭 |
| check | check-outlined | 勾选 |
| add | add-outlined-md | 添加 |
| remove | remove-outlined-md | 移除 |
| delete-o | delete | 删除 |
| edit-o | edit-md | 编辑 |
| search | search | 搜索（保持不变） |
| loading | loading | 加载（保持不变） |
| error-o | exclamation-circle-outlined | 错误 |
| warning-circle-o | warning-circle-filled | 警告 |
| info-circle-o | info-circle-outlined | 信息 |
| question-circle-o | question-circle-outlined | 问题 |
| setting | set-up | 设置 |
| refresh-o | - | 刷新（新组件不提供，需使用自定义源） |
| - | navigation-back | 返回（新增，默认） |

## 迁移示例

### 案例 1：基础图标

```tsx
// 迁移前
<Icon type="add" size={24} tintColor="#FF8D62" />

// 迁移后
<Icon type="add-outlined-md" size={24} color="#FF8D62" />
```

### 案例 2：使用默认大小和颜色

```tsx
// 迁移前
<Icon type="close" />

// 迁移后
<Icon type="close-outlined" />
```

### 案例 3：自定义样式

```tsx
// 迁移前
<Icon 
    type="edit-o"
    size={20}
    tintColor="#333"
    style={{ marginRight: 8 }}
/>

// 迁移后
<Icon 
    type="edit-md"
    size={20}
    color="#333"
    style={{ marginRight: 8 }}
/>
```

### 案例 4：添加透明度

```tsx
// 迁移前 - 旧组件无透明度属性

// 迁移后 - 新增透明度功能
<Icon 
    type="navigation-back"
    size={24}
    color="#666"
    opacity={0.7}  // 70% 透明度
/>
```

### 案例 5：自定义图标源

```tsx
// 迁移前
<Icon 
    type="add"
    size={24}
    source={require('./custom-icon.png')}
/>

// 迁移后 - 保持一致
<Icon 
    type="add-outlined-md"  // 仍需指定 type，但 source 会覆盖
    size={24}
    source={require('./custom-icon.png')}
/>
```

### 案例 6：返回按钮

```tsx
// 迁移前
<Icon type="arrow-left" size={20} tintColor="#222" />

// 迁移后
<Icon type="left-arrow" size={20} color="#222" />
```

### 案例 7：加载图标

```tsx
// 迁移前
<Icon type="loading" size={24} />

// 迁移后 - 保持一致
<Icon type="loading" size={24} />

// 或使用旋转加载
<Icon type="spinner-loading" size={24} />
```

### 案例 8：按钮内的图标

```tsx
// 迁移前
<Button icon={<Icon type="add" size={16} tintColor="white" />}>
    添加
</Button>

// 迁移后
<Button icon={<Icon type="add-outlined-md" size={16} color="white" />}>
    添加
</Button>
```

### 案例 9：禁用状态图标（灰化）

```tsx
// 迁移前
<Icon type="delete-o" size={20} tintColor="#ccc" />

// 迁移后 - 方案A：使用 color 属性
<Icon type="delete" size={20} color="#ccc" />

// 迁移后 - 方案B：使用 opacity 属性
<Icon type="delete" size={20} color="#666" opacity={0.5} />
```

### 案例 10：在列表项中使用

```tsx
// 迁移前
<View style={styles.item}>
    <Icon type="arrow-right" size={18} tintColor="#999" />
    <Text>列表项</Text>
</View>

// 迁移后
<View style={styles.item}>
    <Icon type="right-arrow" size={18} color="#999" />
    <Text>列表项</Text>
</View>
```

## 关键点

- **属性名变更**：
  - `tintColor` → `color`
  - 新增 `opacity` 属性用于控制透明度

- **图标名称变更**：
  - 新组件重新设计了图标命名体系
  - 旧组件有 89 种图标，新组件有 52 种图标
  - 常用图标基本都有对应的新名称
  - 不在新图标库中的图标需要使用 `source` 属性自定义

- **type 属性变化**：
  - 旧组件：`type` 是可选的（默认 undefined）
  - 新组件：`type` 是必填的（默认 'navigation-back'）
  - 需要确保每个 Icon 都指定有效的 type

- **新增功能**：
  - `opacity` 属性：支持设置图标透明度
  - 更细致的大小区分（edit-lg、edit-md）
  - 更规范的图标命名体系

- **源支持**：
  - 两个版本都支持通过 `source` 属性自定义图标
  - 当同时指定 type 和 source 时，source 优先级更高

- **默认值变化**：
  - 新组件 type 默认值：'navigation-back'（旧组件无默认值）
  - 新组件 color 默认值：null（旧组件 tintColor 默认值：null）
  - 新增 opacity 默认值：1

## 图标库迁移清单

需要检查以下常用图标的映射：

| 使用场景 | 旧图标 | 新图标 | 备注 |
|---------|--------|--------|------|
| 导航返回 | arrow-left | left-arrow | 或使用 navigation-back |
| 列表箭头 | arrow-right / right | right-arrow / mini-right-arrow | 根据大小选择 |
| 向上箭头 | arrow-up / up | mini-top-arrow | 新组件细分了大小 |
| 向下箭头 | down | mini-down-arrow | - |
| 关闭按钮 | close | close-outlined | - |
| 勾选标记 | check | check-outlined | - |
| 删除操作 | delete-o | delete | - |
| 编辑操作 | edit-o | edit-md / edit-lg | 分大小 |
| 搜索 | search | search | 保持不变 |
| 加载 | loading | loading 或 spinner-loading | 两种加载样式 |
| 错误提示 | error-o / error | exclamation-circle-outlined / warning-circle-filled | - |
| 信息提示 | info-circle-o | info-circle-outlined | - |
| 问题帮助 | question-circle-o | question-circle-outlined | - |
| 警告标记 | warning-circle-o | warning-circle-filled | - |
| 设置菜单 | setting | set-up | - |

## 迁移策略

### 第一步：审视现有代码中的 Icon 使用

列出项目中使用的所有图标类型，评估迁移工作量。

### 第二步：创建图标映射表

根据项目实际使用情况，创建旧图标到新图标的映射表。

### 第三步：批量替换属性名

使用全局搜索替换：
- 将所有 `tintColor=` 替换为 `color=`
- 检查是否需要添加 `opacity` 属性

### 第四步：更新图标名称

使用映射表逐一更新图标名称。

### 第五步：验证不存在的图标

对于新组件不支持的旧图标，考虑：
1. 使用最接近的新图标替代
2. 通过 `source` 属性使用自定义图标
3. 重新获取对应的图标资源

### 第六步：测试验证

- 验证所有图标正常显示
- 验证图标大小、颜色、透明度符合设计稿
- 验证自定义图标正确加载

## 常见问题

### Q: 旧图标在新组件中找不到对应版本怎么办？
A: 有以下几个解决方案：
1. 查看是否有类似功能的新图标可以替代
2. 使用 `source` 属性传入自定义图标
3. 向设计团队确认是否还需要该图标

### Q: 如何快速找到新图标的名称？
A: 
1. 查看本文档提供的映射表
2. 查看 types.ts 中的完整 AllIcons 类型定义
3. 查看新组件文档的"图标列表"部分
4. 在新组件 demos 中查看完整图标展示

### Q: opacity 属性可以实现什么效果？
A: opacity 用于控制图标的透明度，可以实现以下效果：
- 禁用状态显示（降低透明度）
- 聚焦效果
- 层级区分

### Q: tintColor 和 color 有什么区别？
A: 基本没有区别，只是属性名改变了，都是用于设置图标的染色。

### Q: 如何优化图标性能？
A: 
1. 建议使用预定义的图标名称而不是 require 动态加载
2. 如果项目中大量使用自定义图标，考虑集成到 icon-source 中
3. 参考新组件文档的 FAQ 部分了解图片资源优化方案

## 注意事项

1. **类型改为必填**：新组件的 `type` 属性变为必填，确保所有 Icon 使用都指定了有效的 type。

2. **图标数量减少**：新组件从 89 种图标减少到 52 种，需要审视是否有遗漏的关键图标。

3. **命名体系改变**：新组件采用了更规范的命名体系（带后缀区分大小），需要了解新的命名规则。

4. **性能考虑**：新组件同时支持预定义图标和自定义源，在选择方案时需要考虑性能影响。

5. **版本兼容性**：如果项目中有多处代码引用 Icon，建议逐个文件进行迁移，以便进行充分测试。

## 完整的 AllIcons 类型对比

### 旧组件（89 种）
add、add-square-o、arrow-left、arrow-right、arrow-up、avatar-add-o、avatar-group-o、avatar-o、bankcard-o、bell-o、calculator、calendar-o、camera-o、cart-o、check、checkbox-checked-o、checkbox-indetermina-o、checkbox-unchecked-o、chevron-left、chevron-right、close、cloud-o、comment-o、contacts-o、copy-o、database-o、delete-o、down、download-o、edit-o、ellipsis、error、error-o、expand-less、expand-more、export-o、fast-backward、fast-forward、file-group-o、file-send-o、filter-o、forward-o、hierarchy-o、home-o、import-export-o、info-circle-o、invoice-o、left、link-o、loading、lock-o、mail-o、meh-o、menus-o、mosaic、picture-o、position、praise-o、question-circle-o、refresh-o、remove、right、rotate、sad-o、save-o、search、setting、share-o、smile-o、sort-up-and-down-o、star、star-half、star-o、success-o、theme-o、time-o、undo-o、up、visibility-on-o、vote-o、warning-circle-o、wifi-o

### 新组件（52 种）
navigation-back、left-arrow、right-arrow、double-left-arrow、double-right-arrow、mini-top-arrow、mini-right-arrow、mini-down-arrow、edit-lg、edit-md、print、phone、amplify、communicate、scan-code、delete、set-up、data、search、replace、horn、notice、positioning、device、info-circle-outlined、exclamation-circle-outlined、question-circle-outlined、close-outlined、check-outlined、add-outlined-lg、add-outlined-md、remove-outlined-lg、remove-outlined-md、clean、back、play、loading、spinner-loading、download、filter-outlined、warning-circle-filled、go-up、go-down、open-fullscreen、close-fullscreen、customer-service

## 迁移工具提示

如果项目中存在大量 Icon 使用，可以考虑以下方法加快迁移：

1. **使用 IDE 的批量替换**：
   - 使用正则表达式替换 `tintColor` 为 `color`
   - 创建一个映射文件，用脚本辅助替换图标名称

2. **创建兼容层**（如需要）：
   - 虽然不推荐使用适配器，但可以创建一个映射对象用于代码查询
   - `const oldToNewIcon = { 'add': 'add-outlined-md', ... }`

3. **增量迁移**：
   - 按功能模块逐步迁移，避免一次性全量替换引入风险
