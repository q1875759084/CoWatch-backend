# appear 页面曝光相关

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@mtfe/empower-atom-interface`

## 破坏性变更：使用曝光功能时必须包裹 RootTagContextProvider

**以下情况需要在 bundle 入口手动包裹 `RootTagContextProvider`：**

| 功能 | 说明 |
|------|------|
| `pvHoc` | 页面曝光埋点高阶组件 |
| `mvHoc` | 模块曝光埋点高阶组件 |
| `mcHoc` | 模块点击埋点高阶组件 |
| `useAppear` | 页面曝光 Hook |
| `useRootTag` | 获取 rootTag Hook |

不包裹会报错：

```
TypeError: undefined is not an object (evaluating 'appearContext.rootTag')
```

## 迁移对照表

| 原函数/类型 | atom-interface 对应 | 使用方式 |
|-------------|---------------------|----------|
| useAppear | appear.useAppear | 命名空间导入 |
| useRootTag | appear.useRootTag | 命名空间导入 |
| useNavigation | appear.useNavigation | 命名空间导入 |
| usePv | uat.usePv | 命名空间导入 |
| pvHoc | pvHoc | **直接导入** |
| mvHoc | mvHoc | **直接导入** |
| mcHoc | mcHoc | **直接导入** |
| appearHoc | appearHoc | **直接导入** |
| RootTagContextProvider | appear.RootTagContextProvider | 命名空间导入 |
| RootTagProvider | appear.RootTagContextProvider | 命名空间导入 |
| AppearConditionProvider | appear.AppearConditionProvider | 命名空间导入 |
| AppearConditionContext | appear.AppearConditionContext | 命名空间导入 |
| NavigationContextProvider | navigator.NavigationContextProvider | 命名空间导入 |
| AppearContext | appear.AppearContext | 命名空间导入 |
| AppearContextProvider | appear.AppearContextProvider | 命名空间导入 |
| AppearContextConsumer | appear.AppearContextConsumer | 命名空间导入 |
| RootTagContext | appear.RootTagContext | 命名空间导入 |
| RootTagContextConsumer | appear.RootTagContextConsumer | 命名空间导入 |
| AppearParam | appearTypes.AppearParam | 命名空间导入 |
| AppearType | appearTypes.AppearType | 命名空间导入 |
| NavigationProp | appearTypes.NavigationProp | 命名空间导入 |

## 迁移示例

### 案例 1：Bundle 入口添加 RootTagContextProvider

```tsx
// 迁移前（旧库）
import { Provider } from 'react-redux';
import store from './stores';

export function App(props) {
    return (
        <Provider store={store}>
            <ListPage />
        </Provider>
    );
}

// 迁移后（新库）
import { RootTagContextProvider } from '@mtfe/empower-atom-interface';
import { Provider } from 'react-redux';
import store from './stores';

export function App(props) {
    const { rootTag } = props;  // 从 props 解构获取

    return (
        <RootTagContextProvider value={{ rootTag, screenProps: props }}>
            <Provider store={store}>
                <ListPage />
            </Provider>
        </RootTagContextProvider>
    );
}
```

**关键步骤**：
1. 从 props 解构 `rootTag`（React Native 自动传入）
2. `RootTagContextProvider` 放在最外层
3. `value` 必须包含 `{ rootTag, screenProps: props }`

### 案例 2：使用 pvHoc

```tsx
// 迁移前
import { pvHoc } from '@mtfe/empower-trantor-mrn';
export default pvHoc(MyComponent, { cid: 'xxx' });

// 迁移后
import { pvHoc } from '@mtfe/empower-atom-interface';
export default pvHoc(MyComponent, { cid: 'xxx' });
```

### 案例 3：使用 useAppear

```tsx
// 迁移前
import { useAppear } from '@mtfe/empower-trantor-mrn';

// 迁移后
import { appear } from '@mtfe/empower-atom-interface';

function MyComponent() {
    appear.useAppear({ cid: 'xxx' });
    return <View>...</View>;
}
```

## 关键点

- **RootTagContextProvider** 必须在所有使用曝光功能的组件外层
- **rootTag** 从 React Native 传入的 props 中解构获取
- **HOC（pvHoc、mvHoc、mcHoc、appearHoc）** 直接导入，不加命名空间前缀
- **Hook（useAppear、useRootTag）** 通过 `appear.xxx` 使用

## 常见陷阱

### 1. HOC 直接导入

```tsx
// ❌ 错误
import { appear } from '@mtfe/empower-atom-interface';
appear.pvHoc(...)

// ✅ 正确
import { pvHoc } from '@mtfe/empower-atom-interface';
pvHoc(...)
```

### 2. 忘记 RootTagContextProvider

```tsx
// ❌ 错误：缺少 RootTagContextProvider
return <Provider store={store}><MyComponent /></Provider>;

// ✅ 正确
return (
    <RootTagContextProvider value={{ rootTag, screenProps: props }}>
        <Provider store={store}><MyComponent /></Provider>
    </RootTagContextProvider>
);
```

## 迁移检查清单

- [ ] Bundle 入口添加 `RootTagContextProvider`
- [ ] 从 props 解构 `rootTag` 传入 value
- [ ] HOC 直接导入（不加 `appear.` 前缀）
- [ ] Hook 通过 `appear.xxx` 使用
- [ ] 验证曝光埋点是否正常上报
