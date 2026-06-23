# PeriodCalendarButton 期间日期选择按钮

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
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
    maxPeriod?: number  // 最大允许的选择天数
    // 横向滑动日历，同时支持快速定位月份
    horizontal?: boolean
    pastMonthRange?: number  // 向前可选月份数，默认 120
    futureMonthRange?: number  // 向后可选月份数，默认 0
    hint?: string  // 提示文本
    stickMonthHeader?: boolean  // 是否固定月份头
    hideConfirmButton?: boolean  // 是否隐藏确定按钮
    type?: 'single' | 'period'  // 单选或范围选择，默认 'period'
    
    calendarHeight?: number  // 日历高度
    calendarStyle?: StyleProp<ViewStyle>
    calendarListStyle?: StyleProp<ViewStyle>
    current?: Date  // 当前显示日期
    
    onPeriodSelect?: (startDate: string, endDate: string, formattedPeriod: string) => void
}

// PeriodCalendarButton 特有属性
interface PeriodCalendarButtonProps extends CalendarProps {
    singleDateFormatter?: string  // 单选时日期格式，XDate 格式字符串
    buttonStyle?: StyleProp<ViewStyle>  // 按钮外部容器样式
    buttonTextStyle?: StyleProp<TextStyle>  // 按钮文本样式
    children?: ReactElement  // 自定义按钮内容
}

// 使用方式
<PeriodCalendarButton
    startDate="2024-01-01"
    endDate="2024-01-31"
    type="period"
    minDate="2020-01-01"
    maxDate="2024-12-31"
    onPeriodSelect={(start, end, formatted) => {
        console.log(`选择期间: ${start} - ${end}`)
    }}
/>
```

## 新组件 API

```tsx
import dayjs from 'dayjs'

type DateRange = Dayjs | Dayjs[] | Date[]
type CalendarType = 'single' | 'range'

interface CalendarProps {
    value?: DateRange  // 选择的日期值
    format?: string  // 日期格式，默认 'YYYY-MM-DD'
    maxDate?: Dayjs  // 最大日期
    minDate?: Dayjs  // 最小日期
    mode?: CalendarType  // 'single' 或 'range'，默认 'range'
    height?: number  // 日历高度
    containerStyle?: StyleProp<ViewStyle>
    renderItem?: (item: CalendarRenderProps) => JSX.Element  // 自定义日期渲染
    onChange?: (value: DateRange) => void  // 点击日期时触发
    beforeDayPress?: (date: Dayjs) => void | Promise<void>  // 日期点击前回调
}

interface CalendarPickProps {
    visible: boolean  // 是否显示选择器
    title?: string  // 标题，默认 '选择日期'
    renderTips?: (date: DateRange, rangeDays: number) => JSX.Element  // 自定义提示区域
    onClose?: () => void  // 关闭时回调
    onConfirm?: (date: DateRange) => void  // 确定时回调
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
/>
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| startDate / endDate | value | 日期值从字符串改为 Dayjs 对象或数组 |
| type | mode | 单选/范围选择，值保持不变 |
| minDate / maxDate | minDate / maxDate | 从字符串改为 Dayjs 对象 |
| format (隐含) | format | 新增显式格式参数，默认 'YYYY-MM-DD' |
| onPeriodSelect | onChange / onConfirm | onChange 用于实时变化，onConfirm 用于最终确认 |
| singleDateFormatter | format | 日期格式统一处理 |
| buttonStyle | - | 移除，改用外部包装 |
| buttonTextStyle | - | 移除，改用外部包装 |
| children | renderTips | 自定义内容改为提示区域 |
| horizontal | - | 移除，layout 改由主题控制 |
| pastMonthRange / futureMonthRange | - | 改由 minDate / maxDate 控制 |
| maxPeriod | - | 需要自行添加验证逻辑 |
| hint | renderTips | 提示转移到 renderTips 回调 |
| stickMonthHeader | - | 改由主题控制 |
| hideConfirmButton | - | 新组件默认显示确定按钮 |
| calendarHeight | height | 日历高度参数名称不变 |
| calendarStyle / calendarListStyle | containerStyle | 样式合并为一个参数 |

## 迁移示例

### 案例 1：简单范围选择

```tsx
// 迁移前
import { PeriodCalendarButton } from '@mtfe/empower-trantor-mrn'
import React, { useState } from 'react'

const [startDate, setStartDate] = useState('2024-01-01')
const [endDate, setEndDate] = useState('2024-01-31')

<PeriodCalendarButton
    startDate={startDate}
    endDate={endDate}
    type="period"
    onPeriodSelect={(start, end, formatted) => {
        setStartDate(start)
        setEndDate(end)
        console.log(`选择期间: ${formatted}`)
    }}
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

<>
    <TouchableOpacity onPress={() => setVisible(true)}>
        <Text>{`${value[0].format('YYYY.MM.DD')} - ${value[1].format('MM.DD')}`}</Text>
    </TouchableOpacity>
    <Calendar.BottomPicker
        visible={visible}
        value={value}
        mode="range"
        onChange={(dates) => setValue(dates)}
        onConfirm={(dates) => {
            setValue(dates)
            setVisible(false)
        }}
        onClose={() => setVisible(false)}
    />
</>
```

### 案例 2：单选模式

```tsx
// 迁移前
import { PeriodCalendarButton } from '@mtfe/empower-trantor-mrn'

<PeriodCalendarButton
    type="single"
    startDate="2024-01-01"
    endDate="2024-01-01"
    singleDateFormatter="yyyy-MM-dd"
    onPeriodSelect={(start, end, formatted) => {
        console.log(`选择日期: ${formatted}`)
    }}
/>

// 迁移后
import { Calendar } from '@sfe/wand-rn'
import dayjs, { Dayjs } from 'dayjs'

const [value, setValue] = useState<Dayjs>(dayjs('2024-01-01'))
const [visible, setVisible] = useState(false)

<>
    <TouchableOpacity onPress={() => setVisible(true)}>
        <Text>{value.format('YYYY-MM-DD')}</Text>
    </TouchableOpacity>
    <Calendar.BottomPicker
        visible={visible}
        value={value}
        mode="single"
        format="YYYY-MM-DD"
        onChange={(date) => setValue(date)}
        onConfirm={(date) => {
            setValue(date)
            setVisible(false)
        }}
        onClose={() => setVisible(false)}
    />
</>
```

### 案例 3：带日期范围限制

```tsx
// 迁移前
import { PeriodCalendarButton } from '@mtfe/empower-trantor-mrn'

<PeriodCalendarButton
    startDate="2024-01-01"
    endDate="2024-01-31"
    type="period"
    minDate="2020-01-01"
    maxDate="2024-12-31"
    pastMonthRange={60}
    futureMonthRange={12}
    onPeriodSelect={(start, end) => {
        console.log(`选择: ${start} - ${end}`)
    }}
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
        setValue(dates)
        setVisible(false)
    }}
    onClose={() => setVisible(false)}
/>
```

### 案例 4：带自定义提示

```tsx
// 迁移前
import { PeriodCalendarButton } from '@mtfe/empower-trantor-mrn'

<PeriodCalendarButton
    startDate="2024-01-01"
    endDate="2024-01-31"
    type="period"
    hint="请选择30天以内的日期"
    maxPeriod={30}
    onPeriodSelect={(start, end) => {
        // 需要手动检查日期差
        const diff = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
        if (diff > 30) {
            console.warn('超过最大选择天数')
        }
    }}
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

const validateAndSetValue = (dates: [Dayjs, Dayjs]) => {
    const diffDays = dates[1].diff(dates[0], 'day') + 1
    if (diffDays <= MAX_DAYS) {
        setValue(dates)
    } else {
        // 超过限制，可以显示提示或不更新
        console.warn(`超过最大选择天数: ${diffDays}/${MAX_DAYS}`)
    }
}

<Calendar.BottomPicker
    visible={visible}
    value={value}
    mode="range"
    onChange={validateAndSetValue}
    onConfirm={(dates) => {
        validateAndSetValue(dates)
        setVisible(false)
    }}
    onClose={() => setVisible(false)}
    renderTips={(dates, rangeDays) => (
        <View style={{ padding: 10 }}>
            <Text style={{ color: rangeDays > MAX_DAYS ? 'red' : 'green' }}>
                已选择 {rangeDays} 天 {rangeDays > MAX_DAYS && `(超过最大 ${MAX_DAYS} 天)`}
            </Text>
        </View>
    )}
/>
```

### 案例 5：完整实用示例（带状态管理）

```tsx
// 迁移前
import { PeriodCalendarButton } from '@mtfe/empower-trantor-mrn'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from '@mrn/react-native'

export const DateRangeSelector = () => {
    const [startDate, setStartDate] = useState('2024-01-01')
    const [endDate, setEndDate] = useState('2024-01-31')
    const [formatted, setFormatted] = useState('2024.01.01 - 01.31')

    return (
        <View>
            <TouchableOpacity>
                <Text>{formatted}</Text>
            </TouchableOpacity>
            <PeriodCalendarButton
                startDate={startDate}
                endDate={endDate}
                type="period"
                buttonStyle={{ padding: 10 }}
                buttonTextStyle={{ fontSize: 14, color: '#333' }}
                onPeriodSelect={(start, end, fmt) => {
                    setStartDate(start)
                    setEndDate(end)
                    setFormatted(fmt)
                    // 发送请求
                    fetchData(start, end)
                }}
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
        fetchData(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'))
    }

    const formatDisplayDate = () => {
        const start = value[0]
        const end = value[1]
        // 仿照旧版本的格式化逻辑
        if (start.isSame(end, 'day')) {
            return start.format('YYYY.MM.DD')
        }
        if (start.year() !== end.year()) {
            return `${start.format('YYYY.MM.DD')} - ${end.format('YYYY.MM.DD')}`
        }
        if (start.month() !== end.month()) {
            return `${start.format('YYYY.MM.DD')} - ${end.format('MM.DD')}`
        }
        return `${start.format('YYYY.MM.DD')} - ${end.format('DD')}`
    }

    return (
        <View>
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => setVisible(true)}>
                <Text style={{ fontSize: 14, color: '#333' }}>
                    {formatDisplayDate()}
                </Text>
            </TouchableOpacity>
            <Calendar.BottomPicker
                visible={visible}
                value={value}
                mode="range"
                title="选择日期"
                onChange={(dates) => {
                    // 实时更新显示
                }}
                onConfirm={handleConfirm}
                onClose={() => setVisible(false)}
                renderTips={(dates, rangeDays) => (
                    <View style={{ padding: 10, alignItems: 'center' }}>
                        <Text style={{ color: '#999', fontSize: 12 }}>
                            已选择 {rangeDays} 天
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
- **日期格式化**: 旧版本使用 XDate 格式字符串（如 `'yyyy-MM-dd'`），新版本使用 dayjs 格式字符串（如 `'YYYY-MM-DD'`）
- **值的结构**: 范围选择从两个独立的 `startDate`/`endDate` 变为一个数组 `[startDate, endDate]`
- **日期范围**: 从 `pastMonthRange`/`futureMonthRange` 改为直接指定 `minDate`/`maxDate`
- **触发时机**: 
  - `onChange` 在每次日期选择时触发（实时反馈）
  - `onConfirm` 仅在点击"确定"按钮时触发（最终确认）
- **按钮样式**: 新版本不支持自定义按钮样式，需要在外部自己实现按钮和日期显示
- **最大天数限制**: `maxPeriod` 功能需要在应用层自行添加验证逻辑
- **导入方式**: 需要额外导入 `dayjs` 库来创建和操作日期对象
- **hooks vs class**: 新版本使用 hooks 实现，需要用 `useState` 管理状态
- **modal 显示**: 新版本内置 BottomModal，不需要额外控制 modal 显示逻辑

## 迁移检查清单

- [ ] 导入 `dayjs` 库和 `Calendar` 组件
- [ ] 将字符串日期转换为 Dayjs 对象：`dayjs('2024-01-01')`
- [ ] 更新日期格式字符串：`'yyyy-MM-dd'` → `'YYYY-MM-DD'`
- [ ] 修改日期范围控制：使用 `minDate`/`maxDate` 替代月份范围参数
- [ ] 添加 `visible` 状态管理日历显示/隐藏
- [ ] 实现按钮和日期显示（迁移前是内置的）
- [ ] 验证日期计算逻辑（如 `maxPeriod` 需要自行验证）
- [ ] 更新回调处理：分离 `onChange`（实时）和 `onConfirm`（确认）
- [ ] 如果使用了 `horizontal` 布局，需要检查主题配置
- [ ] 测试单选和范围选择两种模式

## 常见问题

### Q: 如何格式化显示日期？
A: 使用 Dayjs 的 `format()` 方法：
```tsx
dayjs('2024-01-01').format('YYYY-MM-DD')  // '2024-01-01'
dayjs('2024-01-01').format('YYYY.MM.DD')  // '2024.01.01'
```

### Q: 如何实现旧版本的"今天"、"昨天"特殊显示？
A: 使用 `isSame()` 和 `isYesterday()` 方法判断：
```tsx
const formatDate = (date: Dayjs) => {
    if (date.isSame(dayjs(), 'day')) return '今天'
    if (date.isSame(dayjs().subtract(1, 'day'), 'day')) return '昨天'
    return date.format('YYYY.MM.DD')
}
```

### Q: 如何计算选择的天数？
A: 使用 `diff()` 方法：
```tsx
const days = endDate.diff(startDate, 'day') + 1  // +1 因为包含开始和结束日期
```

### Q: 为什么新版本没有自定义按钮？
A: 新版本 `Calendar.BottomPicker` 只提供日历选择功能，按钮样式由使用者自己实现，这样更灵活可定制。

### Q: 如何实现之前的 `maxPeriod` 限制？
A: 需要在 `onChange` 或 `onConfirm` 回调中手动验证：
```tsx
const handleChange = (dates: [Dayjs, Dayjs]) => {
    const diff = dates[1].diff(dates[0], 'day') + 1
    if (diff > maxPeriod) {
        Toast.fail(`最多选择 ${maxPeriod} 天`)
        return
    }
    setValue(dates)
}
```

### Q: 如何迁移带有自定义提示的版本？
A: 使用 `renderTips` 参数：
```tsx
<Calendar.BottomPicker
    renderTips={(dates, rangeDays) => (
        <View>
            <Text>已选择 {rangeDays} 天</Text>
        </View>
    )}
/>
```
