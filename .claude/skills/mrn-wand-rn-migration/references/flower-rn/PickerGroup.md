# PickerGroup 选择器组合

## 从何处迁移
- **源库**: `@sgfe/flower-rn`
- **目标库**: `@sfe/wand-rn`

## 旧组件 API

### PickerGroup Props
```tsx
interface PickerGroupProps {
    style?: ViewStyle
    maskClosable?: boolean  // 默认 true，点击蒙层是否允许关闭
    children?: JSX.Element | JSX.Element[]
    toggle?: ({ active, dataKey }: {
        active: boolean
        dataKey: string
    }) => void  // 按钮组激活切换事件，通过dataKey获取切换状态的元素key
}
```

### PickerGroup Ref
```tsx
interface PickerGroupRefProps {
    close: (dataKey?: string) => void  // 关闭Picker，若不传递参数dataKey，则关闭当前激活状态的Picker
    open: (dataKey: string) => void  // 打开指定的Picker
    activeKey: string  // 当前被激活的dataKey
}
```

## 新组件 API

### PickerGroup Props
```tsx
interface PickerGroupProps {
    style?: ViewStyle
    maskClosable?: boolean  // 默认 true，点击蒙层是否允许关闭
    children?: JSX.Element | JSX.Element[]
    toggle?: ({ active, dataKey }: {
        active: boolean
        dataKey: string
    }) => void  // 按钮组激活切换事件，通过dataKey获取切换状态的元素key
}
```

### PickerGroup Ref
```tsx
interface PickerGroupRefProps {
    close: (dataKey?: string) => void  // 关闭Picker，若不传递参数dataKey，则关闭当前激活状态的Picker
    open: (dataKey: string) => void  // 打开指定的Picker
    activeKey: string  // 当前被激活的dataKey
}
```

## 迁移对照表

| 旧属性 | 新属性 | 说明 |
|--------|--------|------|
| style | style | 属性保持一致 |
| maskClosable | maskClosable | 属性保持一致 |
| children | children | 属性保持一致 |
| toggle | toggle | 属性保持一致 |
| Ref.close | Ref.close | 方法保持一致 |
| Ref.open | Ref.open | 方法保持一致 |
| Ref.activeKey | Ref.activeKey | 属性保持一致 |

## 迁移示例

### 案例 1：基础组合控制

```tsx
// 迁移前 - flower-rn
import { Picker, PickerGroup } from '@sgfe/flower-rn'
import { useRef } from 'react'

const MyComponent = () => {
  const pickerGroupRef = useRef();

  const contentNode = (text) => (
    <View style={{ backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', height: 100 }}>
      <Text>{text}</Text>
    </View>
  );

  return (
    <PickerGroup
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
      }}
      ref={pickerGroupRef}
    >
      <View>
        <Picker dataKey="1" label="picker1">
          {contentNode('1')}
        </Picker>
      </View>
      <View>
        <Picker dataKey="2" label="picker2">
          {contentNode('2')}
        </Picker>
      </View>
      <View>
        <Picker dataKey="3" label="picker3">
          {contentNode('3')}
        </Picker>
      </View>
    </PickerGroup>
  );
};

// 迁移后 - wand-rn
import { Picker, PickerGroup } from '@sfe/wand-rn'
import { useRef } from 'react'

const MyComponent = () => {
  const pickerGroupRef = useRef();

  const contentNode = (text) => (
    <View style={{ backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', height: 100 }}>
      <Text>{text}</Text>
    </View>
  );

  return (
    <PickerGroup
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
      }}
      ref={pickerGroupRef}
    >
      <View>
        <Picker dataKey="1" label="picker1">
          {contentNode('1')}
        </Picker>
      </View>
      <View>
        <Picker dataKey="2" label="picker2">
          {contentNode('2')}
        </Picker>
      </View>
      <View>
        <Picker dataKey="3" label="picker3">
          {contentNode('3')}
        </Picker>
      </View>
    </PickerGroup>
  );
};
```

### 案例 2：带 toggle 回调和 maskClosable 配置

```tsx
// 迁移前 - flower-rn
import { Picker, PickerGroup } from '@sgfe/flower-rn'

const MyComponent = () => {
  const pickerGroupRef = useRef();

  const onGroupToggle = (data) => {
    console.log('Toggle event:', data);
    // { active: true, dataKey: '1' }
  };

  const contentNode = (text) => (
    <View style={{ backgroundColor: '#fff', height: 100, alignItems: 'center' }}>
      <Text>{text}</Text>
    </View>
  );

  return (
    <PickerGroup
      ref={pickerGroupRef}
      maskClosable={false}
      toggle={onGroupToggle}
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
      }}
    >
      <Picker dataKey="1" label="Picker1">
        {contentNode('Picker1')}
      </Picker>
      <Picker dataKey="2" label="Picker2">
        {contentNode('Picker2')}
      </Picker>
    </PickerGroup>
  );
};

// 迁移后 - wand-rn
import { Picker, PickerGroup } from '@sfe/wand-rn'

const MyComponent = () => {
  const pickerGroupRef = useRef();

  const onGroupToggle = (data) => {
    console.log('Toggle event:', data);
    // { active: true, dataKey: '1' }
  };

  const contentNode = (text) => (
    <View style={{ backgroundColor: '#fff', height: 100, alignItems: 'center' }}>
      <Text>{text}</Text>
    </View>
  );

  return (
    <PickerGroup
      ref={pickerGroupRef}
      maskClosable={false}
      toggle={onGroupToggle}
      style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
      }}
    >
      <Picker dataKey="1" label="Picker1">
        {contentNode('Picker1')}
      </Picker>
      <Picker dataKey="2" label="Picker2">
        {contentNode('Picker2')}
      </Picker>
    </PickerGroup>
  );
};
```

### 案例 3：使用 Ref 控制 Picker 打开关闭

```tsx
// 迁移前 - flower-rn
import { Picker, PickerGroup, PickerGroupRefProps } from '@sgfe/flower-rn'
import { useRef } from 'react'

const MyComponent = () => {
  const pickerGroupRef = useRef<PickerGroupRefProps>();

  const handleOpenPicker1 = () => {
    pickerGroupRef.current?.open('1');
  };

  const handleClosePicker1 = () => {
    pickerGroupRef.current?.close('1');
  };

  const handleCloseAll = () => {
    pickerGroupRef.current?.close();
  };

  const checkActivePicker = () => {
    const activeKey = pickerGroupRef.current?.activeKey;
    console.log('Active picker:', activeKey);
  };

  const contentNode = (text) => (
    <View style={{ backgroundColor: '#fff', height: 100 }}>
      <Text>{text}</Text>
    </View>
  );

  return (
    <View>
      <PickerGroup
        ref={pickerGroupRef}
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Picker dataKey="1" label="Picker1">
          {contentNode('Picker1')}
        </Picker>
        <Picker dataKey="2" label="Picker2">
          {contentNode('Picker2')}
        </Picker>
      </PickerGroup>
      
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <Button onPress={handleOpenPicker1}>打开 Picker1</Button>
        <Button onPress={handleClosePicker1}>关闭 Picker1</Button>
        <Button onPress={handleCloseAll}>关闭所有</Button>
        <Button onPress={checkActivePicker}>查看激活状态</Button>
      </View>
    </View>
  );
};

// 迁移后 - wand-rn
import { Picker, PickerGroup, PickerGroupRefProps } from '@sfe/wand-rn'
import { useRef } from 'react'

const MyComponent = () => {
  const pickerGroupRef = useRef<PickerGroupRefProps>();

  const handleOpenPicker1 = () => {
    pickerGroupRef.current?.open('1');
  };

  const handleClosePicker1 = () => {
    pickerGroupRef.current?.close('1');
  };

  const handleCloseAll = () => {
    pickerGroupRef.current?.close();
  };

  const checkActivePicker = () => {
    const activeKey = pickerGroupRef.current?.activeKey;
    console.log('Active picker:', activeKey);
  };

  const contentNode = (text) => (
    <View style={{ backgroundColor: '#fff', height: 100 }}>
      <Text>{text}</Text>
    </View>
  );

  return (
    <View>
      <PickerGroup
        ref={pickerGroupRef}
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Picker dataKey="1" label="Picker1">
          {contentNode('Picker1')}
        </Picker>
        <Picker dataKey="2" label="Picker2">
          {contentNode('Picker2')}
        </Picker>
      </PickerGroup>
      
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <Button onPress={handleOpenPicker1}>打开 Picker1</Button>
        <Button onPress={handleClosePicker1}>关闭 Picker1</Button>
        <Button onPress={handleCloseAll}>关闭所有</Button>
        <Button onPress={checkActivePicker}>查看激活状态</Button>
      </View>
    </View>
  );
};
```

### 案例 4：条件判断和打开关闭切换

```tsx
// 迁移前 - flower-rn
import { Picker, PickerGroup, PickerGroupRefProps } from '@sgfe/flower-rn'
import { useRef } from 'react'

const MyComponent = () => {
  const pickerGroupRef = useRef<PickerGroupRefProps>();

  const handleTogglePicker1 = () => {
    const activeKey = pickerGroupRef.current?.activeKey;
    if (activeKey === '1') {
      pickerGroupRef.current?.close('1');
    } else {
      pickerGroupRef.current?.open('1');
    }
  };

  return (
    <View>
      <PickerGroup
        ref={pickerGroupRef}
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Picker dataKey="1" label="Picker1">
          <View style={{ height: 100 }}><Text>Content 1</Text></View>
        </Picker>
        <Picker dataKey="2" label="Picker2">
          <View style={{ height: 100 }}><Text>Content 2</Text></View>
        </Picker>
      </PickerGroup>
      
      <Button onPress={handleTogglePicker1}>切换 Picker1</Button>
    </View>
  );
};

// 迁移后 - wand-rn
import { Picker, PickerGroup, PickerGroupRefProps } from '@sfe/wand-rn'
import { useRef } from 'react'

const MyComponent = () => {
  const pickerGroupRef = useRef<PickerGroupRefProps>();

  const handleTogglePicker1 = () => {
    const activeKey = pickerGroupRef.current?.activeKey;
    if (activeKey === '1') {
      pickerGroupRef.current?.close('1');
    } else {
      pickerGroupRef.current?.open('1');
    }
  };

  return (
    <View>
      <PickerGroup
        ref={pickerGroupRef}
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Picker dataKey="1" label="Picker1">
          <View style={{ height: 100 }}><Text>Content 1</Text></View>
        </Picker>
        <Picker dataKey="2" label="Picker2">
          <View style={{ height: 100 }}><Text>Content 2</Text></View>
        </Picker>
      </PickerGroup>
      
      <Button onPress={handleTogglePicker1}>切换 Picker1</Button>
    </View>
  );
};
```

## 关键变更点

### 1. 完全兼容迁移
- **PickerGroup** 组件在 flower-rn 和 wand-rn 中的 Props 和 Ref 接口**完全相同**
- **无需修改任何代码**，可以直接将导入包替换

### 2. Props 完全保持一致
- `style` - 外层 View 样式
- `maskClosable` - 点击蒙层关闭设置
- `children` - 内部 Picker 组件
- `toggle` - 切换事件回调

### 3. Ref Methods 完全保持一致
- `open(dataKey: string)` - 打开指定 dataKey 的 Picker
- `close(dataKey?: string)` - 关闭指定或当前激活的 Picker
- `activeKey` - 获取当前激活的 Picker dataKey

### 4. 内部 Picker 的 dataKey 需求
- 每个 Picker 必须有唯一的 `dataKey` 属性
- PickerGroup 范围内的 dataKey 必须唯一

## 迁移注意事项

1. **一键迁移**：由于接口完全相同，只需改变导入路径即可
   ```tsx
   // 从这里
   import { PickerGroup } from '@sgfe/flower-rn'
   
   // 改为这里
   import { PickerGroup } from '@sfe/wand-rn'
   ```

2. **Ref 类型更新**：如果使用了 TypeScript 类型定义，需要更新 import
   ```tsx
   // 从这里
   import { PickerGroupRefProps } from '@sgfe/flower-rn'
   
   // 改为这里
   import { PickerGroupRefProps } from '@sfe/wand-rn'
   ```

3. **内部 Picker 组件**：PickerGroup 内部的 Picker 组件也需要从 wand-rn 导入
   ```tsx
   // 从这里
   import { Picker, PickerGroup } from '@sgfe/flower-rn'
   
   // 改为这里
   import { Picker, PickerGroup } from '@sfe/wand-rn'
   ```

4. **无需处理兼容层**：不需要创建适配器或包装器，直接使用新组件

5. **功能完全对等**：所有功能、事件、ref 方法都完全保持一致

## 总结

**PickerGroup 是完全兼容的迁移**。flower-rn 中的 PickerGroup 已经作为原始实现被 wand-rn 继承，两个版本的 Props、Ref 接口和行为完全相同。

迁移步骤：
1. 替换 import 语句中的包名
2. 确保所有 dataKey 唯一
3. 无需修改任何业务代码

