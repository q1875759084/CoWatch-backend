---
description: React 代码生成指南
globs: **/*.{jsx,tsx}
ruleType: Auto Attached
---
# React 代码生成指南

React 代码生成应遵循以下规范。

## 状态管理

- Context 避免用于频繁更新的数据以避免全局状态污染

## Hooks 使用规范

- `useEffect` 避免将导航对象直接放入依赖数组
- 不可以通过 `||` 或者 `??` 来设置非基本类型(对象、数组、函数)的默认值

## 性能优化

- 缓存优化：善用 `React.memo`、`useMemo` 和 `useCallback` 来避免不必要的重渲染和重复计算。

## 渲染规范

- 避免直接使用 `&&` 运算符进行组件条件渲染,优先使用三目运算符 `? :` 或 `!!` 进行条件判断
