# Datepicker 时间选择

## 从何处迁移
- **源库**: `@roo/roo-rn`
- **目标库**: `@sfe/wand-rn`

## 重要说明：UI 模式差异

Datepicker（`@roo/roo-rn`）和 Calendar（`@sfe/wand-rn`）是**完全不同的 UI 模式**：

| 特征 | Datepicker（旧） | Calendar（新） |
|------|-----------------|---------------|
| 交互方式 | 滚轮滑动选择（Scroll Wheel） | 日历网格点击选择（Calendar Grid） |
| 底层组件 | 基于 `Scrollpicker` 滚动列 | 基于 `FlatList` / 日历面板 |
| 时间精度 | 支持年/月/日/时/分/秒 | 仅支持日期（年/月/日） |
| 选择模式 | 单一时间点选择 | 单日选择（single）或日期范围选择（range） |
| 数据类型 | 原生 `Date` 对象 | `Dayjs` 对象 |
| 12小时制 | 支持（use12Hours） | 不支持 |
| 全天选项 | 支持（hasFullDay） | 不支持 |

**迁移核心结论**：Calendar 无法完全替代 Datepicker 的所有场景。以下情况需要特别处理：

1. **仅选择日期（年/月/日）**：可直接迁移到 Calendar
2. **需要时间选择（时/分/秒）**：Calendar 不支持，需自行组合 Calendar + 时间选择逻辑
3. **仅选择年份或年月**：Calendar 不直接支持 `mode='year'` 或 `mode='month'`，需自行实现
4. **选择时间（不含日期）**：Calendar 不支持 `mode='time'`，需自行实现

## 旧组件 API

```tsx
export interface DatepickerProps {
  /** 选中的时间 */
  date?: Date
  /** 最小可选时间 */
  minDate?: Date
  /** 最大可选时间 */
  maxDate?: Date
  /** 列布局的分区比例，注意最好和数据源长度保持一致 */
  proportion?: number[]
  /** 选中项的偏移量 */
  offsetCount?: number  // 默认 3
  /** 内容区水平内边距 */
  contentPaddingHorizontal?: number  // 默认 0
  /** 每一项的渲染回调，提供三个参数，第一个是选项的值，第二个是选项的索引，第三个是选项选中的状态，可以任意定制选项 UI */
  renderItem?: (
    item: ScrollpickerListItem,
    index: number,
    selected: boolean
  ) => JSX.Element
  /**
   * Datepicker 组件的展示样式。各模式代表的样式如下:
   * datetime: 'YYYY-MM-DD HH:mm' | date: 'YYYY-MM-DD' | year: 'YYYY' | month: 'YYYY-MM' | time: 'HH:mm:ss' | daytime: 'DD HH:mm'
   */
  mode?: 'datetime' | 'date' | 'year' | 'month' | 'time' | 'daytime'  // 默认 'date'
  /** 国际化配置 */
  locale?: any  // 默认 { year: '年', month: '月', day: '日', hour: '时', minute: '分', second: '秒', am: '上午', pm: '下午' }
  /** 分钟数递增步长设置 */
  minuteStep?: number  // 默认 1
  /** 小时数递增步长设置 */
  hourStep?: number  // 默认 1
  /** 格式化月份的展示 */
  formatMonth?: (month: number, date?: any) => any
  /** 格式化天数的展示，例如: 天这一列展示 日期 + 星期 等等 */
  formatDay?: (day: number, date?: any) => any
  /** 日期值改变的回调 */
  onChange?: (
    date: Date,
    info: ScrollpickerChangeInfo,
    isFullDay: boolean
  ) => void
  /** 自定义依赖的 ScrollPicker 组件样式 */
  scrollpickerStyles?: ScrollpickerStyles
  /** 自定义传给 ScrollPicker 组件的其他属性 */
  scrollpickerProps?: ScrollpickerProps
  /** 12小时制 */
  use12Hours?: boolean  // 默认 false
  /** 新增获取默认选中时间的事件 */
  onInit?: (date: Date) => void
  /** 是否增加秒，在 mode 为非 date 上的可增加秒列 */
  hasSeconds?: boolean  // 默认 false
  /** 是否显示分钟列，只针对支持秒列类型，无分钟列时秒列不显示 */
  hasMinutes?: boolean  // 默认 true
  /** 秒步进值 */
  secondStep?: number  // 默认 1
  /** 是否具有全天选择项 */
  hasFullDay?: boolean  // 默认 false
  /** 全天文案自定义 */
  fullDayText?: string  // 默认 '全天'
  /** 支持自动化测试 */
  testID?: string
}
```

## 新组件 API

```tsx
export type CalendarType = 'single' | 'range'
export type DateRange = Dayjs | Dayjs[] | Date[]

export type CalendarRenderProps = {
  date: Dayjs
  day: number
  mode: CalendarType
  isActive?: boolean
  inRange?: boolean
  disabled?: boolean
  isToday?: boolean
}

export type CalendarProps = {
  /** 选中项的值 */
  value?: DateRange  // Dayjs | [Dayjs, Dayjs] | Date | [Date, Date]
  /** 日期格式化字符串 */
  format?: string  // 默认 'YYYY.MM.DD'
  /** 可选的最大日期 */
  maxDate?: Dayjs  // 默认: range 模式为当天，single 模式为未来 1000 年
  /** 可选的最小日期 */
  minDate?: Dayjs  // 默认: range 模式为过去 5 年，single 模式为过去 1000 年
  /** 日期选中形式，单日选中、范围选中 */
  mode?: CalendarType  // 默认 'range'
  /** 日历高度（范围选择时可用） */
  height?: number  // 默认 428
  /** 容器自定义样式 */
  containerStyle?: StyleProp<ViewStyle>
  /** 自定义渲染日期 */
  renderItem?: (item: CalendarRenderProps) => JSX.Element
  /** 点击日期时回调 */
  onChange?: (value: DateRange) => void
  /** 点击日期的钩子，返回 Promise.reject() 会禁止点击 */
  beforeDayPress?: (date: Dayjs) => void | Promise<void>
}

// Calendar.BottomPicker 额外属性（继承 CalendarProps 所有属性）
export type CalendarPickProps = {
  /** 是否展示 */
  visible: boolean
  /** 标题 */
  title?: string  // 默认 '选择日期'
  /** 自定义的提示信息，展示在最下方 */
  renderTips?: (date: DateRange, rangeDays: number) => JSX.Element
  /** 取消操作 */
  onClose?: () => void
  /** 确认操作 */
  onConfirm?: (date: DateRange) => void
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| date | value | 数据类型从 `Date` 变为 `Dayjs \| Dayjs[] \| Date[]`，支持范围选择 |
| mode | mode | **根本性变化**：旧值 'datetime'/'date'/'year'/'month'/'time'/'daytime'；新值仅 'single'/'range'。仅 mode='date' 可直接迁移 |
| minDate | minDate | 类型从 `Date` 变为 `Dayjs` |
| maxDate | maxDate | 类型从 `Date` 变为 `Dayjs` |
| onChange | onChange | 回调签名变化：旧 `(date, info, isFullDay)` => 新 `(value)` |
| renderItem | renderItem | 参数结构完全不同：旧 `(item, index, selected)` => 新 `(CalendarRenderProps)` |
| - | value | 新增，替代旧的 `date` 属性 |
| - | format | 新增，日期格式化字符串 |
| - | containerStyle | 新增，容器自定义样式 |
| - | beforeDayPress | 新增，点击日期前的钩子，支持异步拦截 |
| - | mode='range' | 新增，日期范围选择能力 |
| proportion | - | 移除，Calendar 无滚轮列概念 |
| offsetCount | - | 移除，Calendar 无滚轮列概念 |
| contentPaddingHorizontal | - | 移除，使用 containerStyle 替代 |
| locale | - | 移除，Calendar 内置中文星期标签 |
| minuteStep | - | 移除，Calendar 不支持时间选择 |
| hourStep | - | 移除，Calendar 不支持时间选择 |
| secondStep | - | 移除，Calendar 不支持时间选择 |
| formatMonth | - | 移除，Calendar 使用内置月份导航格式 |
| formatDay | renderItem | 自定义日期展示通过 renderItem 实现 |
| scrollpickerStyles | - | 移除，Calendar 无滚轮组件 |
| scrollpickerProps | - | 移除，Calendar 无滚轮组件 |
| use12Hours | - | 移除，Calendar 不支持时间选择 |
| onInit | - | 移除，Calendar 无初始化回调，通过 useEffect 监听 value 实现 |
| hasSeconds | - | 移除，Calendar 不支持时间选择 |
| hasMinutes | - | 移除，Calendar 不支持时间选择 |
| hasFullDay | - | 移除，Calendar 不支持全天概念 |
| fullDayText | - | 移除，Calendar 不支持全天概念 |
| testID | - | 移除，Calendar 未提供 testID 属性 |

## 迁移示例

### 案例 1：基础日期选择（mode='date'）

```tsx
// 迁移前
import { Datepicker } from '@roo/roo-rn'

const [date, setDate] = useState(new Date())

<Datepicker
  mode="date"
  date={date}
  onChange={(newDate) => setDate(newDate)}
/>

// 迁移后
import { Calendar } from '@sfe/wand-rn'
import dayjs, { Dayjs } from 'dayjs'

const [date, setDate] = useState<Dayjs>(dayjs())

<Calendar
  mode="single"
  value={date}
  onChange={(value) => setDate(value as Dayjs)}
/>
```

### 案例 2：设置日期范围限制

```tsx
// 迁移前
import { Datepicker } from '@roo/roo-rn'

<Datepicker
  mode="date"
  date={new Date()}
  minDate={new Date(2023, 0, 1)}
  maxDate={new Date(2025, 11, 31)}
  onChange={(date) => console.log(date)}
/>

// 迁移后
import { Calendar } from '@sfe/wand-rn'
import dayjs from 'dayjs'

<Calendar
  mode="single"
  value={dayjs()}
  minDate={dayjs('2023-01-01')}
  maxDate={dayjs('2025-12-31')}
  onChange={(value) => console.log(value)}
/>
```

### 案例 3：日期范围选择（新增能力）

```tsx
// 迁移前 - Datepicker 不支持范围选择，需自行实现两个 Datepicker
import { Datepicker } from '@roo/roo-rn'

const [startDate, setStartDate] = useState(new Date())
const [endDate, setEndDate] = useState(new Date())

<>
  <Text>开始日期</Text>
  <Datepicker mode="date" date={startDate} onChange={setStartDate} />
  <Text>结束日期</Text>
  <Datepicker mode="date" date={endDate} onChange={setEndDate} />
</>

// 迁移后 - Calendar 内置范围选择
import { Calendar } from '@sfe/wand-rn'
import dayjs from 'dayjs'

const [dateRange, setDateRange] = useState([dayjs(), dayjs()])

<Calendar
  mode="range"
  value={dateRange}
  onChange={(value) => setDateRange(value as [Dayjs, Dayjs])}
/>
```

### 案例 4：使用 Calendar.BottomPicker 弹窗选择

```tsx
// 迁移前 - Datepicker 通常嵌套在自定义弹窗中
import { Datepicker } from '@roo/roo-rn'
import { SlideModal } from '@roo/roo-rn'

const [visible, setVisible] = useState(false)
const [date, setDate] = useState(new Date())

<SlideModal visible={visible} onClose={() => setVisible(false)}>
  <Datepicker mode="date" date={date} onChange={setDate} />
  <Button onPress={() => setVisible(false)}>确定</Button>
</SlideModal>

// 迁移后 - Calendar.BottomPicker 内置弹窗
import { Calendar } from '@sfe/wand-rn'
import dayjs, { Dayjs } from 'dayjs'

const [visible, setVisible] = useState(false)
const [date, setDate] = useState<Dayjs>(dayjs())

<Calendar.BottomPicker
  visible={visible}
  mode="single"
  value={date}
  title="选择日期"
  onChange={(value) => setDate(value as Dayjs)}
  onClose={() => setVisible(false)}
  onConfirm={(value) => {
    setDate(value as Dayjs)
    setVisible(false)
  }}
/>
```

### 案例 5：自定义日期渲染

```tsx
// 迁移前
import { Datepicker } from '@roo/roo-rn'

<Datepicker
  mode="date"
  date={new Date()}
  formatDay={(day, date) => {
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
    return `${day}日 周${weekDay}`
  }}
  onChange={(date) => console.log(date)}
/>

// 迁移后 - 使用 renderItem 自定义日期单元格
import { Calendar } from '@sfe/wand-rn'
import { View, Text } from 'react-native'
import dayjs from 'dayjs'

<Calendar
  mode="single"
  value={dayjs()}
  renderItem={(item) => (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: item.isActive ? '#fff' : '#333' }}>
        {item.day}
      </Text>
      {item.isToday && <Text style={{ fontSize: 10, color: '#FF6600' }}>今天</Text>}
    </View>
  )}
  onChange={(value) => console.log(value)}
/>
```

### 案例 6：onChange 回调签名变更

```tsx
// 迁移前 - onChange 有三个参数
import { Datepicker } from '@roo/roo-rn'

<Datepicker
  mode="date"
  date={new Date()}
  onChange={(date, info, isFullDay) => {
    console.log('选中日期:', date)
    console.log('滚动信息:', info.scrollIndex)
    console.log('是否全天:', isFullDay)
  }}
/>

// 迁移后 - onChange 只有一个参数
import { Calendar } from '@sfe/wand-rn'
import dayjs from 'dayjs'

<Calendar
  mode="single"
  value={dayjs()}
  onChange={(value) => {
    // single 模式下 value 是 Dayjs
    // range 模式下 value 是 [Dayjs, Dayjs]
    console.log('选中日期:', value)
    // info 和 isFullDay 不再提供
  }}
/>
```

### 案例 7：Date 与 Dayjs 类型转换

```tsx
// 迁移后 - 如果业务逻辑依赖原生 Date 对象，需要做转换
import { Calendar } from '@sfe/wand-rn'
import dayjs, { Dayjs } from 'dayjs'

// Date -> Dayjs（传入 Calendar）
const nativeDate = new Date(2024, 5, 15)
const dayjsDate = dayjs(nativeDate)

// Dayjs -> Date（从 Calendar 回调中获取后转换）
<Calendar
  mode="single"
  value={dayjsDate}
  onChange={(value) => {
    const selectedDayjs = value as Dayjs
    const selectedDate: Date = selectedDayjs.toDate()  // 转回原生 Date
    // 继续使用 selectedDate 进行业务逻辑
  }}
/>
```

### 案例 8：beforeDayPress 拦截点击（新增能力）

```tsx
// 迁移前 - 无法拦截日期点击
import { Datepicker } from '@roo/roo-rn'

<Datepicker
  mode="date"
  date={new Date()}
  onChange={(date) => {
    // 只能在 onChange 中做后处理
    if (isHoliday(date)) {
      alert('该日期为节假日')
    }
  }}
/>

// 迁移后 - 使用 beforeDayPress 拦截
import { Calendar } from '@sfe/wand-rn'
import dayjs from 'dayjs'

<Calendar
  mode="single"
  value={dayjs()}
  beforeDayPress={async (date) => {
    if (isHoliday(date)) {
      alert('该日期为节假日，不可选择')
      return Promise.reject()  // 返回 reject 阻止选中
    }
  }}
  onChange={(value) => console.log('选中:', value)}
/>
```

### 案例 9：onInit 替代方案

```tsx
// 迁移前
import { Datepicker } from '@roo/roo-rn'

<Datepicker
  mode="date"
  date={new Date()}
  onInit={(date) => {
    console.log('初始化选中时间:', date)
  }}
  onChange={(date) => setDate(date)}
/>

// 迁移后 - 使用 useEffect 替代 onInit
import { Calendar } from '@sfe/wand-rn'
import dayjs, { Dayjs } from 'dayjs'

const [date, setDate] = useState<Dayjs>(dayjs())

useEffect(() => {
  console.log('初始化选中时间:', date.toDate())
}, [])

<Calendar
  mode="single"
  value={date}
  onChange={(value) => setDate(value as Dayjs)}
/>
```

### 案例 10：范围选择弹窗 + 提示信息

```tsx
// 迁移前 - 不支持范围选择，无内置弹窗
// 无等价实现

// 迁移后
import { Calendar } from '@sfe/wand-rn'
import { Text } from 'react-native'
import dayjs from 'dayjs'

const [visible, setVisible] = useState(false)
const [dateRange, setDateRange] = useState([dayjs(), dayjs().add(3, 'day')])

<Calendar.BottomPicker
  visible={visible}
  mode="range"
  value={dateRange}
  title="选择入住日期"
  renderTips={(date, rangeDays) => (
    <Text style={{ textAlign: 'center', padding: 10, color: '#666' }}>
      已选择 {rangeDays} 天
    </Text>
  )}
  onClose={() => setVisible(false)}
  onConfirm={(value) => {
    setDateRange(value as [Dayjs, Dayjs])
    setVisible(false)
  }}
/>
```

## 关键点

### 1. UI 模式根本性差异
- Datepicker 是**滚轮选择器**（Scroll Wheel），通过上下滑动滚轮列选择年/月/日/时/分/秒
- Calendar 是**日历网格**（Calendar Grid），通过点击日历面板中的日期选择
- 这两者的交互体验完全不同，迁移时需要和产品/设计确认是否接受交互变更

### 2. mode 属性映射
- 旧 `mode='date'` => 新 `mode='single'`（可直接迁移）
- 旧 `mode='datetime'` => Calendar 不支持时间部分，需自行组合时间选择
- 旧 `mode='year'` => Calendar 不支持仅年份选择
- 旧 `mode='month'` => Calendar 不支持仅年月选择
- 旧 `mode='time'` => Calendar 不支持仅时间选择
- 旧 `mode='daytime'` => Calendar 不支持日+时间组合选择

### 3. 日期类型变更
- 旧组件使用原生 `Date` 对象
- 新组件使用 `Dayjs` 对象（需要安装 `dayjs` 依赖）
- 转换方式：`dayjs(nativeDate)` 将 Date 转为 Dayjs，`dayjsObj.toDate()` 将 Dayjs 转为 Date
- 如果业务逻辑中大量使用原生 Date，需在 onChange 回调中做转换

### 4. 范围选择能力（新增）
- Datepicker 仅支持单一时间点选择
- Calendar 支持 `mode='range'` 日期范围选择，value 类型为 `[Dayjs, Dayjs]`
- 如果旧代码用两个 Datepicker 实现范围选择，可合并为一个 Calendar

### 5. 弹窗集成
- Datepicker 需要自行包裹在弹窗组件（如 SlideModal）中
- Calendar 提供 `Calendar.BottomPicker` 复合组件，内置底部弹窗能力
- BottomPicker 额外支持 `title`、`renderTips`、`onClose`、`onConfirm` 属性

### 6. 滚轮相关属性全部移除
- `proportion`、`offsetCount`、`contentPaddingHorizontal`、`scrollpickerStyles`、`scrollpickerProps` 均不可用
- 这些属性控制的是滚轮列的布局和样式，Calendar 网格布局不需要

### 7. 时间相关属性全部移除
- `use12Hours`、`hasSeconds`、`hasMinutes`、`minuteStep`、`hourStep`、`secondStep` 均不可用
- `hasFullDay`、`fullDayText` 均不可用
- Calendar 仅处理日期（年月日），不涉及时间（时分秒）

### 8. 格式化方式变更
- 旧 `formatMonth`、`formatDay`、`locale` 用于自定义滚轮列中各项的显示文本
- 新 `renderItem` 用于自定义日历网格中每个日期单元格的 UI，接收 `CalendarRenderProps` 参数
- `format` 属性用于导航栏中的日期格式显示，非日期单元格

### 9. ref 实例方法
- 旧组件通过 `ref.getSelectedDate()` 获取当前选中时间
- 新组件为函数式组件，不提供 ref 实例方法，通过 `value` + `onChange` 的受控模式管理状态

## 注意事项

1. **交互确认**：迁移前必须和产品/设计确认从滚轮选择器到日历面板的交互变更是否可接受
2. **时间选择场景**：如果业务需要选择具体时间（时/分/秒），Calendar 无法满足，需寻找其他方案或自行实现
3. **年份/月份选择场景**：如果业务仅需选择年份或年月，Calendar 不支持，需自行实现
4. **dayjs 依赖**：确保项目中已安装 `dayjs` 及所需插件（如 `customParseFormat`、`isToday` 等）
5. **Date/Dayjs 转换**：在 onChange 回调中注意类型转换，避免类型不匹配导致运行时错误
6. **默认日期范围**：range 模式下 minDate 默认过去 5 年，maxDate 默认当天；single 模式下范围更大（前后 1000 年）
7. **Class 到 Function 组件**：旧 Datepicker 是 Class 组件，新 Calendar 是函数式组件，ref 使用方式不同
8. **ScrollpickerChangeInfo 移除**：onChange 不再提供 scrollIndex 等滚轮信息，如果业务逻辑依赖该信息需要重新设计
9. **isFullDay 移除**：onChange 不再提供 isFullDay 参数，如需全天概念需自行实现

## 迁移检查清单

- [ ] 确认业务场景是否仅需日期选择（非时间选择），若需时间选择则 Calendar 不适用
- [ ] 确认产品/设计接受从滚轮选择器到日历面板的交互变更
- [ ] 将 `mode` 属性值从 'date' 改为 'single'
- [ ] 将 `date` 属性改为 `value`
- [ ] 将原生 `Date` 对象转换为 `Dayjs` 对象
- [ ] 更新 `minDate`/`maxDate` 为 `Dayjs` 类型
- [ ] 更新 `onChange` 回调签名，移除 `info` 和 `isFullDay` 参数
- [ ] 移除所有滚轮相关属性：proportion、offsetCount、contentPaddingHorizontal、scrollpickerStyles、scrollpickerProps
- [ ] 移除所有时间相关属性：use12Hours、hasSeconds、hasMinutes、minuteStep、hourStep、secondStep
- [ ] 移除全天相关属性：hasFullDay、fullDayText
- [ ] 将 `formatDay`/`formatMonth` 替换为 `renderItem` 自定义渲染
- [ ] 将 `onInit` 替换为 `useEffect` 初始化逻辑
- [ ] 如使用 ref.getSelectedDate()，改为受控模式 value + onChange
- [ ] 安装并导入 `dayjs` 依赖
- [ ] 如果旧代码包裹在 SlideModal 中，考虑使用 Calendar.BottomPicker 简化
- [ ] 如果有两个 Datepicker 实现范围选择，考虑合并为 Calendar mode='range'
- [ ] 测试日期选择、范围选择、边界日期等场景
