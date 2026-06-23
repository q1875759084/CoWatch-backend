---
name: mrn-wand-rn-migration
description: '支持从旧 MRN 库（@mtfe/empower-trantor-mrn、@mtfe/empower-mrn-components、@mtfe/empower-mrn-bizcomponents、@roo/roo-rn、@roo/roo-rn-plus、@sgfe/flower-rn、@ss/mtd-react-native）迁移 React Native 组件到 @sfe/wand-rn。包含自动检测、代码生成、API 映射指南和最佳实践。使用此 Skill 来: (1) 分析项目中需要迁移的组件, (2) 查询具体组件的迁移规则和示例, (3) 自动化导入语句替换, (4) 处理组件 API 的兼容性问题, (5) 创建适配器组件（如 Loading wrapper）, (6) 查询技能支持哪些组件的迁移'
---

# mrn-wand-rn-migration Skill

一个 MRN 组件库迁移工具，用于帮助团队从旧的 MRN 组件库迁移到统一的 `@sfe/wand-rn` 库。

## 查询支持迁移的组件

当用户询问「这个技能支持哪些组件的迁移？」或「XX 库支持迁移哪些组件？」时，按以下步骤获取组件列表：

1. 读取 [`scripts/find_components_to_migrate.py`](scripts/find_components_to_migrate.py) 文件
2. 从 `_REFERENCES_DIR_MAP` 变量获取各库名（package name）与 `references/` 子目录的对应关系
3. 对每个库，列出对应 `references/<dir>/` 目录下所有 `.md` 文件名（去掉 `.md` 后缀即为组件名）——这与脚本中 `_load_migration_sources` 函数的逻辑一致，也是 `MIGRATION_SOURCES` 变量的数据来源
4. 将结果按库分组展示给用户，支持按库名过滤（如用户只关心 `@sgfe/flower-rn`）

> 说明：`MIGRATION_SOURCES` 是从 `references/` 目录**动态加载**的，因此以 `.md` 文件是否存在作为「该组件是否支持迁移」的权威依据。

## 完整迁移工作流

### 步骤 1：初始化迁移进度文件（每个仓库只需做一次）

在业务仓库根目录执行，生成 `migration-status.json`：

```bash
python3 find_components_to_migrate.py init-status \
  --path /proj \
  --library @sgfe/flower-rn \
  --status-file migration-status.json
```

生成的进度文件记录每个待迁移文件的状态（`pending` / `done` / `skipped`），是后续分批迁移的"断点续传"依据。

> 进度文件建议提交到 git，这样多轮对话、多人协作都能共享进度。

### 步骤 2：预览自动迁移内容

对于 API 完全兼容的组件（`AUTO_MIGRATABLE` 中维护），**无需 AI 推理，直接运行脚本**。先用 `--dry-run` 预览将要变更的内容，确认无误：

```bash
python3 find_components_to_migrate.py auto-migrate \
  --path /proj \
  --library @sgfe/flower-rn \
  --dry-run
```

### 步骤 3：执行自动迁移，顺带更新进度文件

```bash
python3 find_components_to_migrate.py auto-migrate \
  --path /proj \
  --library @sgfe/flower-rn \
  --status-file migration-status.json
```

**脚本行为**：

- 同一行 import 中，可自动迁移的组件改写为 `@sfe/wand-rn`；其余组件保留原 import（拆分为两行）
- 若提供 `--status-file`，迁移后自动扫描剩余待迁移组件：全部完成的文件自动标记为 `done`，仍有手动迁移项的文件保持 `pending` 状态

### 步骤 4：剩余 pending 文件处理

#### 4a：生成批次文件

读取 `migration-status.json`，按分批策略计算任务批次，写入独立的 `migration-batches.json`：

```bash
python3 find_components_to_migrate.py init-batches \
  --status-file migration-status.json \
  --batches-file migration-batches.json
```

> `migration-batches.json` 记录批次规划，`migration-status.json` 仅记录迁移进度，两者职责分离。

#### 4b：查看批次详情

```bash
python3 find_components_to_migrate.py group-by-component \
  --batches-file migration-batches.json \
  --json
```

#### 4c：按批次执行迁移

**你（主 Agent）是协调者，不要自己动手改代码。** 你的职责是：读取批次列表 → 逐批调用 `task` 工具启动 SubAgent → 等待完成 → 启动下一批。

为什么用 SubAgent？每批迁移涉及多个文件，累积在主对话中会导致上下文爆炸。让每个 SubAgent 处理一批、完成即销毁，可以保持上下文干净。

**操作步骤：**

1. 读取 `migration-batches.json`，获取所有批次
2. 对每个批次，调用 `task` 工具（`subagent_type: "general-agent"`），传入下方的 prompt 模板（填入实际值）
3. **串行执行**：等待当前批次 SubAgent 完成后，再启动下一批
4. 所有批次完成后，进入步骤 5

##### SubAgent prompt 模板

将以下内容作为 `task` 工具的 `prompt` 参数，把 `{...}` 占位符替换为实际值：

```
使用 mrn-wand-rn-migration skill 进行 MRN React 组件迁移

## 任务参数
- **待迁移库**: {lib}
- **待处理组件名称**: {component}
- **Skill 路径**: {skill_dir}（即 .claude/skills/mrn-wand-rn-migration）
- **进度文件路径**: {status_file}
- **待处理文件列表**:
{files_list}

## 任务步骤

1. **查询迁移指南**
   - 读取 `{skill_dir}/references/{lib_dir}/{component}.md` 获取迁移说明
   - 其中 lib_dir 是库名对应的目录（如 @mtfe/empower-trantor-mrn → empower-trantor-mrn）

2. **逐文件迁移**
   - 读取每个文件，根据迁移指南修改代码
   - 更新 import 语句：迁移后的组件从 `@sfe/wand-rn` 引入
   - 处理 API 变更（如 props 重命名、移除不支持的 props）
   - 若同文件已有 `@sfe/wand-rn` import，合并为一行

3. **每完成一个文件后立即更新进度**（使用 `--component` 参数，只标记本组件）：
   ```bash
   python3 {skill_dir}/scripts/find_components_to_migrate.py mark-done \
     --status-file {status_file} \
     --files src/pages/Order/index.tsx \
     --component {component}
   ```

   若某文件暂时无法迁移（如依赖复杂），可标记为跳过：

   ```bash
   python3 {skill_dir}/scripts/find_components_to_migrate.py mark-done \
     --status-file {status_file} \
     --files src/pages/Difficult/index.tsx \
     --component {component} \
     --skip
   ```

1. **完成所有文件后汇报结果**：说明成功迁移了哪些文件、跳过了哪些以及原因

```

### 步骤 5：查看整体进度

随时可以查看当前进度：

```bash
python3 /path/to/skill/scripts/find_components_to_migrate.py status \
  --status-file migration-status.json
```

### 步骤 6：删除迁移进度文件

当 `migration-status.json` 中所有文件均已完成（`status=done` 或 `status=skipped`），删除该文件：

```bash
# 迁移完成后删除两个文件
rm migration-status.json migration-batches.json
```

### 步骤 7：修复 Lint 问题

迁移完成后修复 ESLint 和 TypeScript 错误：

```bash
npx eslint . --fix --ext .js,.jsx,.ts,.tsx
```

注意：只修复迁移后引入的，存量的 Lint 问题不修复（比如存量 design token 的 lint 问题）

## 单个组件迁移工作流

当用户只想迁移**某一个特定组件**（如「把项目里所有 `Button` 从 `@sgfe/flower-rn` 迁移到 `@sfe/wand-rn`」）时，使用本工作流。它是完整迁移工作流的子集，无需进度文件，步骤更精简。

### 步骤 1：扫描目标组件涉及的文件

```bash
python3 find_components_to_migrate.py scan \
  --path /proj \
  --library @sgfe/flower-rn \
  --json
```

从输出中找到目标组件（如 `Button`）对应的文件列表，记录下来供后续步骤使用。

### 步骤 2：判断是否可自动迁移

查看脚本中 `AUTO_MIGRATABLE` 字典，确认该组件是否在其中：

- **在 `AUTO_MIGRATABLE` 中** → 走步骤 3（自动迁移）
- **不在 `AUTO_MIGRATABLE` 中** → 跳过步骤 3，直接走步骤 4（手动迁移）

### 步骤 3（可选）：自动迁移

若该组件可自动迁移，先用 `--dry-run` 预览，确认无误后正式执行：

```bash
# 预览
python3 find_components_to_migrate.py auto-migrate \
  --path /proj \
  --library @sgfe/flower-rn \
  --dry-run

# 正式执行（如果只想处理特定文件，加 --files 参数）
python3 find_components_to_migrate.py auto-migrate \
  --path /proj \
  --library @sgfe/flower-rn \
  --files src/components/Foo.tsx src/pages/Bar.tsx
```

自动迁移完成后即可跳到步骤 5。

### 步骤 4（手动迁移）：读取迁移指南并逐文件处理

1. 使用 `mcp_tool_sgfe-mcp_queryWandRn` 查询目标组件在 `@sfe/wand-rn` 中的 API
2. 读取 `references/<library-dir>/<ComponentName>.md`（若存在）获取迁移映射规则
3. 逐一修改步骤 1 中找到的文件：替换 import 路径、更新 props 及用法

### 步骤 5：修复 Lint 问题

```bash
npx eslint . --fix --ext .js,.jsx,.ts,.tsx
```

注意：只修复迁移后引入的，存量的 Lint 问题不修复。

## 脚本命令速查

> 脚本路径：`.claude/skills/mrn-wand-rn-migration/scripts/find_components_to_migrate.py`

| 命令                 | 用途                                                          | 关键参数                                                       |
| -------------------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| `scan`               | 扫描项目，输出待迁移组件报告                                  | `--path`、`--library`、`--json`                                |
| `init-status`        | 初始化迁移进度文件（每仓库一次）                              | `--path`、`--library`、`--status-file`                         |
| `status`             | 查看当前迁移进度概览                                          | `--status-file`                                                |
| `auto-migrate`       | 自动替换 AUTO_MIGRATABLE 组件的 import 路径                   | `--path`、`--library`、`--status-file`、`--dry-run`、`--files` |
| `update-status`      | 重新扫描代码，将旧库 import 已消失的组件自动标记为 done       | `--path`、`--status-file`、`--library`、`--dry-run`            |
| `mark-done`          | 手动将指定文件/组件标记为 done 或 skipped（供 SubAgent 调用） | `--status-file`、`--files`、`--component`、`--skip`            |
| `init-batches`       | 读取进度文件，按分批策略生成批次文件                          | `--status-file`、`--batches-file`                              |
| `group-by-component` | 展示批次文件中的 SubAgent 任务批次列表                        | `--batches-file`、`--json`                                     |

### `update-status` vs `mark-done` 的区别

- **`update-status`**：代码驱动，重新扫描项目验证旧库 import 是否消失，消失则自动标记 `done`。适合手动改完一批文件后批量同步进度。
- **`mark-done`**：调用方驱动，无条件信任调用方，直接写入状态。适合 SubAgent 完成某批次后精确标记，也支持 `--skip` 跳过无需迁移的文件。

## 重要约束

1. **只迁移 React 组件，不迁移函数 API**

    - 组件特征：PascalCase 命名，用作 JSX 标签（如 `<GeneralDialog />`）
    - 函数特征：camelCase 命名，作为函数调用（如 `showToast()`）
    - 只处理组件迁移，函数 API 由用户根据实际需求决定是否迁移

2. 除非迁移指南明确说明，否则不要创建包装器/适配器

3. **⚠️ 重要：没有完成迁移之前不要停下**

    - 在一次对话中启动了迁移任务后，必须坚持迁移到底，直到所有需要迁移的组件都已完成
    - 如果用户没有明确要求停止，不要在中途放弃任务
    - 即使过程中遇到困难或复杂情况，也要继续推进，寻求解决方案直到完成

4. **迁移指南中不存在的组件不迁移**

## 版本支持

- wand-rn 版本：查询最新支持的版本
- Node.js：12.0.0+
- Python：3.6+（用于检测脚本）
