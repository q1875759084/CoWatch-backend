---
description: JavaScript 通用代码生成指南
globs: **/*.{js,ts,jsx,tsx}
ruleType: Auto Attached
---
# JavaScript 通用代码生成指南

JavaScript（泛指 JS、TS、JSX、TSX 等都应遵循的）代码生成应遵循以下规范。

## 组件、模块、函数设计原则

- 组件不超过 400 行代码
- 函数入参数量不要超过 4 个,可通过 "key-value 对象字面量" 方式传参减少入参
- 偏好使用函数式编程,而不是类型编程,框架约定的除外

## TS 开发规范

- 避免使用 @ts-ignore,所有 TypeScript 类型错误必须通过正确定义类型或修正代码逻辑解决
- TypeScript 的公共类型定义需要放到 types 目录以避免重复定义
- 避免使用 any，使用 any 时需要添加注释说明使用的原因

## 编码规范

- 避免嵌套三元，提升代码可读性

## 代码健壮性要求

- 类型转换时必须设置默认值,如 `Number(a) || 0` 或 `String(a ?? '')` 以防出现不符合预期的结果
- 网络请求和接口异常处理函数封装在 api 目录下,优先使用已经封装好的请求函数调用业务接口

## 样式管理

- 颜色、字体等通用样式应使用变量定义在全局样式文件中

## 常量管理

- 常量在 constants 目录下统一维护
- 需要抽取常量的：需要在项目中保持一致、具有特殊业务语义的字符串枚举值和数字，避免魔法数字（magic number，意义不明的数字）
- 不需要抽取成常量的：UI 上的文本，用户提示文案

<example>

```ts
// constants/index.ts
// 用户角色常量
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
}
// 订单状态常量
export const ORDER_STATUS = { PROCESSING: '1', SUCCESS: '2', FAILURE: '3' }
// user-components.ts
import { USER_ROLES, ORDER_STATUS } from '../constants'
// 使用角色常量
const admins = data.filter(user => user.role === USER_ROLES.ADMIN)
// 使用订单状态常量
const successOrders = data.filter(order => order.status === ORDER_STATUS.SUCCESS)
```

</example>

## 优先使用真实数据源

- **严禁**在代码中直接写入任何模拟数据（mock data），包括但不限于：示例用户信息、测试数据数组、假的API响应数据、占位符数据，优先使用真实的数据源，只有当用户明确要求添加 mock 数据用于演示或测试时，才可以添加。
