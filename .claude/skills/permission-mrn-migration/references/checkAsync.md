# checkAsync 系列函数迁移

## 从何处迁移
- **源库**: `@mtfe/empower-trantor-mrn`
- **目标库**: `@sgfe/permission/mrn`

## 迁移对照表

| 原函数 | 新函数 | 使用场景 |
|--------|--------|----------|
| checkPermissionConfigAsync | hasPermission / usePermission | 检查单个权限配置 |
| checkAsync | hasPermission / usePermission | 检查单个权限 |
| checkListAsync | hasPermission / usePermission | 检查多个权限 |
| checkPermissionConfigListAsync | hasPermission / usePermission | 检查多个权限配置 |

## 迁移规则

根据使用场景选择迁移方式：

- **函数式组件**：使用 `usePermission` Hook（推荐）
- **类组件/普通函数/Saga**：使用 `hasPermission` 函数

## 迁移示例

### 案例 1：函数式组件中使用 usePermission（推荐）

```tsx
// 迁移前
import { checkAsync } from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const [hasPermission, setHasPermission] = useState(false)

    useEffect(() => {
        checkAsync('CODE_A').then(result => {
            setHasPermission(result)
        })
    }, [])

    if (!hasPermission) return null

    return <View>...</View>
}

// 迁移后
import { usePermission } from '@sgfe/permission/mrn'

function MyComponent() {
    const hasPermission = usePermission('CODE_A')

    if (!hasPermission) return null

    return <View>...</View>
}
```

### 案例 2：类组件中使用 hasPermission

```tsx
// 迁移前
import { checkAsync } from '@mtfe/empower-trantor-mrn'

class MyComponent extends React.Component {
    state = {
        hasPermission: false
    }

    async componentDidMount() {
        const result = await checkAsync('CODE_A')
        this.setState({ hasPermission: result })
    }

    render() {
        if (!this.state.hasPermission) return null
        return <View>...</View>
    }
}

// 迁移后
import { hasPermission } from '@sgfe/permission/mrn'

class MyComponent extends React.Component {
    state = {
        hasPermission: false
    }

    async componentDidMount() {
        const result = await hasPermission('CODE_A', axios)
        this.setState({ hasPermission: result })
    }

    render() {
        if (!this.state.hasPermission) return null
        return <View>...</View>
    }
}
```

### 案例 3：Saga 中使用 hasPermission

```tsx
// 迁移前
import { checkAsync } from '@mtfe/empower-trantor-mrn'

function* mySaga() {
    const hasPermission = yield checkAsync('CODE_B')
    if (hasPermission) {
        yield put({ type: 'ACTION' })
    }
}

// 迁移后
import { hasPermission } from '@sgfe/permission/mrn'

function* mySaga() {
    const hasPermission = yield hasPermission('CODE_B', axios)
    if (hasPermission) {
        yield put({ type: 'ACTION' })
    }
}
```

### 案例 4：检查多个权限（函数式组件）

```tsx
// 迁移前
import { checkListAsync } from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const [permissions, setPermissions] = useState([false, false])

    useEffect(() => {
        checkListAsync(['CODE_A', 'CODE_B']).then(result => {
            setPermissions(result)
        })
    }, [])

    if (!permissions[0] && !permissions[1]) return null

    return <View>...</View>
}

// 迁移后
import { usePermission } from '@sgfe/permission/mrn'

function MyComponent() {
    const [hasPermissionA, hasPermissionB] = usePermission(['CODE_A', 'CODE_B'])

    if (!hasPermissionA && !hasPermissionB) return null

    return <View>...</View>
}
```

### 案例 5：检查多个权限（非 Hook 环境）

```tsx
// 迁移前
import { checkListAsync } from '@mtfe/empower-trantor-mrn'

async function checkPermissions() {
    const permissions = await checkListAsync(['CODE_A', 'CODE_B'])
    if (permissions.every(Boolean)) {
        console.log('has all permissions')
    }
}

// 迁移后
import { hasPermission } from '@sgfe/permission/mrn'

async function checkPermissions() {
    const permissions = await hasPermission(['CODE_A', 'CODE_B'], axios)
    if (permissions.every(Boolean)) {
        console.log('has all permissions')
    }
}
```

### 案例 6：checkPermissionConfigAsync 迁移

```tsx
// 迁移前
import { checkPermissionConfigAsync } from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const [hasPermission, setHasPermission] = useState(false)

    useEffect(() => {
        checkPermissionConfigAsync({
            permissionId: 'SOME_PERMISSION_ID'
        }).then(result => {
            setHasPermission(result)
        })
    }, [])

    if (!hasPermission) return null

    return <View>...</View>
}

// 迁移后
import { usePermission } from '@sgfe/permission/mrn'

function MyComponent() {
    const hasPermission = usePermission('SOME_PERMISSION_ID')

    if (!hasPermission) return null

    return <View>...</View>
}
```

### 案例 7：完整示例 - 函数式组件

```tsx
// 迁移前
import { checkAsync, checkListAsync } from '@mtfe/empower-trantor-mrn'

function MyComponent() {
    const [hasSinglePermission, setHasSinglePermission] = useState(false)
    const [hasMultiPermissions, setHasMultiPermissions] = useState([false, false])

    useEffect(() => {
        checkAsync('CODE_A').then(setHasSinglePermission)
        checkListAsync(['CODE_B', 'CODE_C']).then(setHasMultiPermissions)
    }, [])

    if (!hasSinglePermission) return null

    return (
        <View>
            {hasMultiPermissions[0] && <Button>Button B</Button>}
            {hasMultiPermissions[1] && <Button>Button C</Button>}
        </View>
    )
}

// 迁移后
import { usePermission } from '@sgfe/permission/mrn'

function MyComponent() {
    const hasSinglePermission = usePermission('CODE_A')
    const [hasPermissionB, hasPermissionC] = usePermission(['CODE_B', 'CODE_C'])

    if (!hasSinglePermission) return null

    return (
        <View>
            {hasPermissionB && <Button>Button B</Button>}
            {hasPermissionC && <Button>Button C</Button>}
        </View>
    )
}
```

### 案例 8：完整示例 - 类组件

```tsx
// 迁移前
import { checkAsync, checkListAsync } from '@mtfe/empower-trantor-mrn'

class MyComponent extends React.Component {
    state = {
        hasSinglePermission: false,
        hasMultiPermissions: [false, false]
    }

    async componentDidMount() {
        const [single, multi] = await Promise.all([
            checkAsync('CODE_A'),
            checkListAsync(['CODE_B', 'CODE_C'])
        ])
        this.setState({
            hasSinglePermission: single,
            hasMultiPermissions: multi
        })
    }

    render() {
        const { hasSinglePermission, hasMultiPermissions } = this.state

        if (!hasSinglePermission) return null

        return (
            <View>
                {hasMultiPermissions[0] && <Button>Button B</Button>}
                {hasMultiPermissions[1] && <Button>Button C</Button>}
            </View>
        )
    }
}

// 迁移后
import { hasPermission } from '@sgfe/permission/mrn'

class MyComponent extends React.Component {
    state = {
        hasSinglePermission: false,
        hasMultiPermissions: [false, false]
    }

    async componentDidMount() {
        const [single, multi] = await Promise.all([
            hasPermission('CODE_A', axios),
            hasPermission(['CODE_B', 'CODE_C'], axios)
        ])
        this.setState({
            hasSinglePermission: single,
            hasMultiPermissions: multi
        })
    }

    render() {
        const { hasSinglePermission, hasMultiPermissions } = this.state

        if (!hasSinglePermission) return null

        return (
            <View>
                {hasMultiPermissions[0] && <Button>Button B</Button>}
                {hasMultiPermissions[1] && <Button>Button C</Button>}
            </View>
        )
    }
}
```

## 关键点

- **函数式组件优先使用 usePermission**：更简洁，无需 useEffect 和 state 管理
- **类组件/普通函数使用 hasPermission**：需要传入 axios 实例
- **Saga 中使用 hasPermission**：需要使用 yield 调用
- **批量权限检查**：usePermission 支持数组参数，返回数组；hasPermission 也支持数组参数
- **权限配置检查**：checkPermissionConfigAsync 和 checkPermissionConfigListAsync 直接使用权限 code 即可

## 迁移检查清单

- [ ] 将函数式组件中的 checkAsync/checkListAsync 改为 usePermission
- [ ] 将类组件中的 checkAsync/checkListAsync 改为 hasPermission（传入 axios）
- [ ] 将 Saga 中的 checkAsync/checkListAsync 改为 hasPermission（使用 yield）
- [ ] 更新 import 语句
- [ ] 验证权限检查功能是否正常
- [ ] 测试多权限检查是否正常

## 注意事项

1. **usePermission 不需要 axios 参数**：Hook 内部会自动处理
2. **hasPermission 需要传入 axios**：用于发起权限检查请求
3. **Saga 中必须使用 yield**：否则无法正确等待异步结果
4. **数组参数返回值**：usePermission 和 hasPermission 都返回数组，顺序与输入一致
