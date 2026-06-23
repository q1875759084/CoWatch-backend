# CalendarDialog 日期选择对话框

## 从何处迁移
- **源库**: `@mtfe/empower-mrn-components`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

```tsx
interface CalendarProps {
    // 可选的最小日期
    minDate?: string  // 格式: 'YYYY-MM-DD'
    // 可选的最大日期
    maxDate?: string  // 格式: 'YYYY-MM-DD'
    // 选中的开始日期
    startDate: string  // 格式: 'YYYY-MM-DD'
    // 选中的结束日期
    endDate: string  // 格式: 'YYYY-MM-DD'
    // 支持选中的最大日期范围（天数）
    maxPeriod?: number
    // 从当月起，向前能展示的最长月份，默认 120
    pastMonthRange?: number
    // 从当月起，向后能展示的最长月份，默认 0
    futureMonthRange?: number
    // 日期选中形式：单日选中 'single' 或范围选中 'period'，默认 'period'
    type?: 'single' | 'period'
    // 日历滑动的方向：'horizontal' 或 'vertical'，默认 'horizontal'
    orientation?: 'horizontal' | 'vertical'
    // 是否展示月份快速定位面板（仅在 orientation='horizontal' 时有效）
    showMonthSelector?: boolean
    // 设置月份是否吸顶（仅在 orientation='vertical' 时有效）
    stickMonthHeader?: boolean
    // 月份展示格式
    monthFormat?: string
    // 主题颜色
    themeColor?: string
    // 选中文字色
    selectedColor?: string
    // 内部日历宽度，默认为屏幕宽度
    calendarWidth?: number
    // 内部日历高度（月份显示部分），默认 230
    calendarHeight?: number
    // 日历容器样式
    calendarStyle?: StyleProp<ViewStyle>
    // 日历项样式
    calendarItemStyle?: StyleProp<ViewStyle>
    // 日期选中时触发，返回开始日期和结束日期
    onPeriodSelect?: (startDate: string, endDate?: string) => void
    // 选择超出范围时触发
    onOutOfPeriod?: (startDate: string, endDate: string) => void
}

interface CalendarDialogProps extends CalendarProps {
    // 展示在确认按钮旁的提示信息
    hint?: string
    // 是否展示确认按钮，默认 true
    showConfirmButton?: boolean
    // 是否显示对话框
    show?: boolean
    // 关闭对话框时的回调
    onRequestClose?: () => void
}

// 使用方式
<CalendarDialog
    show={true}
    startDate="2024-01-01"
    endDate="2024-01-31"
    type="period"
    minDate="2020-01-01"
    maxDate="2024-12-31"
    hint="请选择30天以内的日期"
    showConfirmButton={true}
    onPeriodSelect={(start, end) => {
        console.log(`选择期间: ${start} - ${end}`)
    }}
    onRequestClose={() => {
        // 关闭对话框
    }}
/>
```

## 新组件 API

```tsx
import dayjs from 'dayjs'

type DateRange = Dayjs | Dayjs[] | Date[]
type CalendarType = 'single' | 'range'

interface CalendarProps {
    value?: DateRange  // 选择的日期值，Dayjs 对象或数组
    format?: string  // 日期格式，默认 'YYYY-MM-DD'
    maxDate?: Dayjs  // 最大日期，Dayjs 对象
    minDate?: Dayjs  // 最小日期，Dayjs 对象
    mode?: CalendarType  // 'single' 或 'range'，默认 'range'
    height?: number  // 日历高度
    containerStyle?: StyleProp<ViewStyle>  // 容器样式
    renderItem?: (item: CalendarRenderProps) => JSX.Element  // 自定义日期渲染
    onChange?: (value: DateRange) => void  // 点击日期时触发（实时反馈）
    beforeDayPress?: (date: Dayjs) => void | Promise<void>  // 日期点击前回调
}

interface CalendarPickProps {
    visible: boolean  // 是否显示选择器
    title?: string  // 标题，默认 '选择日期'
    renderTips?: (date: DateRange, rangeDays: number) => JSX.Element  // 自定义提示区域
    onClose?: () => void  // 关闭时回调
    onConfirm?: (date: DateRange) => void  // 确定时回调（最终确认）
}

// Calendar.BottomPicker 是组合了 Calendar 和 BottomModal 的组件
interface CalendarBottomPickerProps extends CalendarProps, CalendarPickProps {}

// 使用方式
import { Calendar } from '@sfe/wand-rn'
import dayjs from 'dayjs'

const [value, setValue] = useState<[Dayjs, Dayjs]>([
    dayjs('2024-01-01'),
    dayjs('2024-01-31')
])
const [visible, setVisible] = useState(false)

<Calendar.BottomPicker
    visible={visible}
    value={value}
    title="选择日期"
    mode="range"
    minDate={dayjs('2020-01-01')}
    maxDate={dayjs('2024-12-31')}
    onChange={(dates) => setValue(dates)}
    onConfirm={(dates) => {
        console.log(`确认选择: ${dates}`)
        setVisible(false)
    }}
    onClose={() => setVisible(false)}
    renderTips={(dates, rangeDays) => (
        <View style={{ padding: 10 }}>
            <Text>已选择 {rangeDays} 天</Text>
        </View>
    )}
/>
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| startDate / endDate | value | 日期值从字符串改为 Dayjs 对象或数组 |
| type | mode | 单选/范围选择，值改为 'single'/'range' |
| minDate / maxDate | minDate / maxDate | 从字符串改为 Dayjs 对象 |
| show | visible | 显示/隐藏对话框的控制属性 |
| onRequestClose | onClose | 关闭对话框时的回调 |
| onPeriodSelect | onChange / onConfirm | onChange 用于实时变化，onConfirm 用于最终确认 |
| hint | renderTips | 提示文本改为自定义渲染函数 |
| showConfirmButton | - | 移除，新版本默认显示确定按钮 |
| calendarHeight | height | 日历高度参数名称不变 |
| calendarStyle / calendarItemStyle | containerStyle | 样式合并为一个参数 |
| orientation | - | 移除，layout 改由主题控制 |
| showMonthSelector | - | 移除，改由主题控制 |
| stickMonthHeader | - | 移除，改由主题控制 |
| pastMonthRange / futureMonthRange | - | 改由 minDate / maxDate 控制 |
| maxPeriod | - | 需要自行添加验证逻辑 |
| monthFormat | - | 移除，使用 format 属性 |
| themeColor / selectedColor | - | 改由主题系统控制 |
| calendarWidth | - | 移除，宽度由容器决定 |

## 迁移示例

### 案例 1：简单范围选择

```tsx
// 迁移前
import { CalendarDialog } from '@mtfe/empower-mrn-components'
import React, { useState } from 'react'

const [show, setShow] = useState(false)
const [startDate, setStartDate] = useState('2024-01-01')
const [endDate, setEndDate] = useState('2024-01-31')

<CalendarDialog
    show={show}
    startDate={startDate}
    endDate={endDate}
    type="period"
    onPeriodSelect={(start, end) => {
        setStartDate(start)
        setEndDate(end)
        setShow(false)
        console.log(`选择期间: ${start} - ${end}`)
    }}
    onRequestClose={() => setShow(false)}
/>

// 迁移后
import { Calendar } from '@sfe/wand-rn'
import dayjs, { Dayjs } from 'dayjs'
import React, { useState } from 'react'

const [value, setValue] = useState<[Dayjs, Dayjs]>([
    dayjs('2024-01-01'),
    dayjs('2024-01-31')
])
const [visible, setVisible] = useState(false)

<Calendar.BottomPicker
    visible={visible}
    value={value}
    mode="range"
    onChange={(dates) => setValue(dates)}
    onConfirm={(dates) => {
        console.log(`确认选择: ${dates[0].format('YYYY-MM-DD')} - ${dates[1].format('YYYY-MM-DD')}`)
        setVisible(false)
    }}
    onClose={() => setVisible(false)}
/>
```

### 案例 2：单选模式

```tsx
// 迁移前
import { CalendarDialog } from '@mtfe/empower-mrn-components'

<CalendarDialog
    show={show}
    startDate="2024-01-01"
    endDate="2024-01-01"
    type="single"
    onPeriodSelect={(start) => {
        console.log(`选择日期: ${start}`)
        setShow(false)
    }}
    onRequestClose={() => setShow(false)}
/>

// 迁移后
import { Calendar } from '@sfe/wand-rn'
import dayjs, { Dayjs } from 'dayjs'

const [value, setValue] = useState<Dayjs>(dayjs('2024-01-01'))
const [visible, setVisible] = useState(false)

<Calendar.BottomPicker
    visible={visible}
    value={value}
    mode="single"
    format="YYYY-MM-DD"
    onChange={(date) => setValue(date)}
    onConfirm={(date) => {
        console.log(`选择日期: ${date.format('YYYY-MM-DD')}`)
        setVisible(false)
    }}
    onClose={() => setVisible(false)}
/>
```

### 案例 3：带日期范围限制

```tsx
// 迁移前
import { CalendarDialog } from '@mtfe/empower-mrn-components'

<CalendarDialog
    show={show}
    startDate="2024-01-01"
    endDate="2024-01-31"
    type="period"
    minDate="2020-01-01"
    maxDate="2024-12-31"
    pastMonthRange={60}
    futureMonthRange={12}
    onPeriodSelect={(start, end) => {
        console.log(`选择: ${start} - ${end}`)
        setShow(false)
    }}
    onRequestClose={() => setShow(false)}
/>

// 迁移后
import { Calendar } from '@sfe/wand-rn'
import dayjs from 'dayjs'

const [value, setValue] = useState<[Dayjs, Dayjs]>([
    dayjs('2024-01-01'),
    dayjs('2024-01-31')
])
const [visible, setVisible] = useState(false)

<Calendar.BottomPicker
    visible={visible}
    value={value}
    mode="range"
    minDate={dayjs('2020-01-01')}
    maxDate={dayjs('2024-12-31')}
    onChange={(dates) => setValue(dates)}
    onConfirm={(dates) => {
        console.log(`选择: ${dates[0].format('YYYY-MM-DD')} - ${dates[1].format('YYYY-MM-DD')}`)
        setVisible(false)
    }}
    onClose={() => setVisible(false)}
/>
```

### 案例 4：带提示信息

```tsx
// 迁移前
import { CalendarDialog } from '@mtfe/empower-mrn-components'

<CalendarDialog
    show={show}
    startDate="2024-01-01"
    endDate="2024-01-31"
    type="period"
    hint="请选择30天以内的日期"
    maxPeriod={30}
    showConfirmButton={true}
    onPeriodSelect={(start, end) => {
        // 需要手动检查日期差
        const diff = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
        if (diff > 30) {
            console.warn('超过最大选择天数')
        }
        setShow(false)
    }}
    onRequestClose={() => setShow(false)}
/>

// 迁移后
import { Calendar } from '@sfe/wand-rn'
import dayjs from 'dayjs'
import { View, Text } from '@mrn/react-native'

const [value, setValue] = useState<[Dayjs, Dayjs]>([
    dayjs('2024-01-01'),
    dayjs('2024-01-31')
])
const [visible, setVisible] = useState(false)
const MAX_DAYS = 30

const validateDays = (dates: [Dayjs, Dayjs]) => {
    const diffDays = dates[1].diff(dates[0], 'day') + 1
    return diffDays
}

<Calendar.BottomPicker
    visible={visible}
    value={value}
    mode="range"
    onChange={(dates) => setValue(dates)}
    onConfirm={(dates) => {
        const days = validateDays(dates)
        if (days <= MAX_DAYS) {
            setValue(dates)
            setVisible(false)
        } else {
            console.warn(`超过最大选择天数: ${days}/${MAX_DAYS}`)
        }
    }}
    onClose={() => setVisible(false)}
    renderTips={(dates, rangeDays) => (
        <View style={{ padding: 10, alignItems: 'center' }}>
            <Text style={{ color: rangeDays > MAX_DAYS ? 'red' : 'green', fontSize: 12 }}>
                请选择30天以内的日期，已选择 {rangeDays} 天
                {rangeDays > MAX_DAYS && ` (超过最大 ${MAX_DAYS} 天)`}
            </Text>
        </View>
    )}
/>
```

### 案例 5：完整实用示例

```tsx
// 迁移前
import { CalendarDialog } from '@mtfe/empower-mrn-components'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from '@mrn/react-native'

export const DateRangeSelector = () => {
    const [show, setShow] = useState(false)
    const [startDate, setStartDate] = useState('2024-01-01')
    const [endDate, setEndDate] = useState('2024-01-31')

    return (
        <View>
            <TouchableOpacity onPress={() => setShow(true)}>
                <Text>{`${startDate} - ${endDate}`}</Text>
            </TouchableOpacity>
            <CalendarDialog
                show={show}
                startDate={startDate}
                endDate={endDate}
                type="period"
                minDate="2020-01-01"
                maxDate="2024-12-31"
                hint="请选择有效的日期范围"
                onPeriodSelect={(start, end) => {
                    setStartDate(start)
                    setEndDate(end)
                    setShow(false)
                    // 发送请求
                    fetchData(start, end)
                }}
                onRequestClose={() => setShow(false)}
            />
        </View>
    )
}

// 迁移后
import { Calendar } from '@sfe/wand-rn'
import dayjs, { Dayjs } from 'dayjs'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from '@mrn/react-native'

export const DateRangeSelector = () => {
    const [value, setValue] = useState<[Dayjs, Dayjs]>([
        dayjs('2024-01-01'),
        dayjs('2024-01-31')
    ])
    const [visible, setVisible] = useState(false)

    const handleConfirm = (dates: [Dayjs, Dayjs]) => {
        setValue(dates)
        setVisible(false)
        // 发送请求
        fetchData(
            dates[0].format('YYYY-MM-DD'),
            dates[1].format('YYYY-MM-DD')
        )
    }

    const formatDisplayDate = () => {
        const start = value[0]
        const end = value[1]
        return `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}`
    }

    return (
        <View>
            <TouchableOpacity onPress={() => setVisible(true)}>
                <Text>{formatDisplayDate()}</Text>
            </TouchableOpacity>
            <Calendar.BottomPicker
                visible={visible}
                value={value}
                mode="range"
                title="选择日期"
                minDate={dayjs('2020-01-01')}
                maxDate={dayjs('2024-12-31')}
                onChange={(dates) => setValue(dates)}
                onConfirm={handleConfirm}
                onClose={() => setVisible(false)}
                renderTips={(dates, rangeDays) => (
                    <View style={{ padding: 10, alignItems: 'center' }}>
                        <Text style={{ color: '#999', fontSize: 12 }}>
                            请选择有效的日期范围，已选择 {rangeDays} 天
                        </Text>
                    </View>
                )}
            />
        </View>
    )
}
```

## 关键点

- **日期对象变化**: 旧版本使用字符串格式 `'YYYY-MM-DD'`，新版本使用 Dayjs 对象，需要使用 `dayjs()` 构造
- **日期格式化**: 使用 Dayjs 的 `format()` 方法进行格式化，格式字符串为 `'YYYY-MM-DD'`
- **值的结构**: 范围选择从两个独立的 `startDate`/`endDate` 变为一个数组 `[startDate, endDate]`
- **日期范围**: 从 `pastMonthRange`/`futureMonthRange` 改为直接指定 `minDate`/`maxDate`
- **触发时机**: 
  - `onChange` 在每次日期选择时触发（实时反馈）
  - `onConfirm` 仅在点击"确定"按钮时触发（最终确认）
- **对话框显示**: 从 `show` prop 改为 `visible` prop 来控制显示/隐藏
- **提示信息**: 从 `hint` 字符串改为 `renderTips` 函数，可以返回 JSX 元素进行自定义渲染
- **最大天数限制**: `maxPeriod` 功能需要在应用层自行添加验证逻辑
- **样式配置**: 新版本不支持主题颜色、选中色等细粒度样式配置，这些改由主题系统控制
- **layout 配置**: 移除了 `orientation`、`showMonthSelector`、`stickMonthHeader` 等布局相关配置
- **导入方式**: 需要额外导入 `dayjs` 库来创建和操作日期对象
- **hooks vs class**: 新版本使用 hooks 实现，需要用 `useState` 管理状态

## 迁移检查清单

- [ ] 导入 `dayjs` 库和 `Calendar` 组件
- [ ] 将字符串日期转换为 Dayjs 对象：`dayjs('2024-01-01')`
- [ ] 将 `startDate` 和 `endDate` 合并为 `value` 属性（范围选择时为数组）
- [ ] 更新日期格式字符串为 dayjs 格式
- [ ] 修改日期范围控制：使用 `minDate`/`maxDate` 替代月份范围参数
- [ ] 添加 `visible` 状态管理日历显示/隐藏
- [ ] 更新回调处理：分离 `onChange`（实时）和 `onConfirm`（确认）
- [ ] 将 `show` 改为 `visible`，`onRequestClose` 改为 `onClose`
- [ ] 如果使用了 `hint`，改为使用 `renderTips` 函数
- [ ] 如果使用了 `maxPeriod`，需要自行在回调中验证
- [ ] 如果有自定义主题色，需要检查主题系统的配置
- [ ] 测试单选和范围选择两种模式
- [ ] 确保日期值的格式化显示正确

## 常见问题

### Q: 如何格式化显示日期？
A: 使用 Dayjs 的 `format()` 方法：
```tsx
dayjs('2024-01-01').format('YYYY-MM-DD')  // '2024-01-01'
dayjs('2024-01-01').format('YYYY.MM.DD')  // '2024.01.01'
dayjs('2024-01-01').format('MM/DD')       // '01/01'
```

### Q: 如何实现日期范围的验证？
A: 在 `onConfirm` 回调中进行验证：
```tsx
const handleConfirm = (dates: [Dayjs, Dayjs]) => {
    const days = dates[1].diff(dates[0], 'day') + 1
    if (days > MAX_DAYS) {
        Toast.fail(`最多选择 ${MAX_DAYS} 天`)
        return
    }
    setValue(dates)
    setVisible(false)
}
```

### Q: 如何计算选择的天数？
A: 使用 `diff()` 方法：
```tsx
const days = endDate.diff(startDate, 'day') + 1  // +1 因为包含开始和结束日期
```

### Q: 如何自定义提示显示？
A: 使用 `renderTips` 参数返回 JSX 元素：
```tsx
<Calendar.BottomPicker
    renderTips={(dates, rangeDays) => (
        <View style={{ padding: 10 }}>
            <Text>已选择 {rangeDays} 天</Text>
        </View>
    )}
/>
```

### Q: 如何检查日期是否在有效范围内？
A: 使用 Dayjs 的比较方法：
```tsx
const isInRange = (date: Dayjs, min: Dayjs, max: Dayjs) => {
    return date.isAfter(min) && date.isBefore(max)
}
const isValid = date.isBetween(minDate, maxDate, null, '[]')  // 包含边界
```

### Q: 如何处理时间值为 null 的情况？
A: 在状态初始化时提供默认值：
```tsx
const [value, setValue] = useState<Dayjs>(dayjs())
```

### Q: 新版本是否支持时间选择？
A: `Calendar.BottomPicker` 只支持日期选择，不支持时间选择。如需时间选择，需要使用其他时间选择组件。

### Q: 如何处理跨年的日期范围显示？
A: 使用条件格式化：
```tsx
const formatDate = (start: Dayjs, end: Dayjs) => {
    if (start.year() !== end.year()) {
        return `${start.format('YYYY.MM.DD')} - ${end.format('YYYY.MM.DD')}`
    }
    if (start.month() !== end.month()) {
        return `${start.format('YYYY.MM.DD')} - ${end.format('MM.DD')}`
    }
    return `${start.format('YYYY.MM.DD')} - ${end.format('DD')}`
}
```

## 迁移路径

1. **第一步**: 引入新的依赖
   ```tsx
   import { Calendar } from '@sfe/wand-rn'
   import dayjs from 'dayjs'
   ```

2. **第二步**: 更新状态管理
   ```tsx
   // 旧
   const [startDate, setStartDate] = useState('2024-01-01')
   const [endDate, setEndDate] = useState('2024-01-31')
   
   // 新
   const [value, setValue] = useState<[Dayjs, Dayjs]>([
       dayjs('2024-01-01'),
       dayjs('2024-01-31')
   ])
   const [visible, setVisible] = useState(false)
   ```

3. **第三步**: 替换组件使用
   ```tsx
   // 旧
   <CalendarDialog
       show={show}
       startDate={startDate}
       endDate={endDate}
       ...
   />
   
   // 新
   <Calendar.BottomPicker
       visible={visible}
       value={value}
       ...
   />
   ```

4. **第四步**: 更新回调函数
   ```tsx
   // 旧：单个回调处理所有逻辑
   onPeriodSelect={(start, end) => {
       setStartDate(start)
       setEndDate(end)
       setShow(false)
   }}
   
   // 新：分离实时反馈和最终确认
   onChange={(dates) => setValue(dates)}
   onConfirm={(dates) => {
       setValue(dates)
       setVisible(false)
   }}
   onClose={() => setVisible(false)}
   ```

5. **第五步**: 测试并验证
   - 验证日期选择功能
   - 验证日期显示格式
   - 验证日期范围限制
   - 验证提示信息显示
