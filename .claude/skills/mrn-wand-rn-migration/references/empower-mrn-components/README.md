# @mtfe/empower-mrn-components 迁移指南

本目录包含 `@mtfe/empower-mrn-components` 和 `@mtfe/empower-mrn-components/shuguopai` 两个不同组件库的迁移指南。

## 目录结构说明

### root/
存放 **@mtfe/empower-mrn-components** 根路径的迁移指南。

这是 empower-mrn-components 的基础组件库，包含通用的基础组件，直接从包的根路径导入。

**使用场景**：
- 项目中直接导入 `@mtfe/empower-mrn-components` 的组件
- 示例：`import { Button } from '@mtfe/empower-mrn-components'`

**包含的组件**：
- 将在该目录下的 `.md` 文件中定义

### shuguopai/
存放 **@mtfe/empower-mrn-components/shuguopai** 蔬果派专有组件库的迁移指南。

这是 empower-mrn-components 针对蔬果派业务团队定制的子库，包含蔬果派特有的业务组件，通过 `/shuguopai` 路径导入。

**使用场景**：
- 项目中直接导入 `@mtfe/empower-mrn-components/shuguopai` 的组件
- 示例：`import { Button } from '@mtfe/empower-mrn-components/shuguopai'`

**包含的组件**：
- 将在该目录下的 `.md` 文件中定义

## 迁移步骤

1. **识别组件来源**：确定项目中使用的组件来自根路径 (`root/`) 还是 `shuguopai` 子库
2. **查阅对应指南**：根据组件来源查阅相应目录下的迁移文档
3. **按指南迁移**：按照文档中的 API 映射和示例进行迁移
4. **更新导入语句**：将导入语句改为从 `@sfe/wand-rn` 引入

## 重要提示

- 即使两个库中有同名组件，其 API 和功能可能不同，请务必查阅对应目录下的指南
