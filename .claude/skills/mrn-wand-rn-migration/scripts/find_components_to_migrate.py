#!/usr/bin/env python3
"""
检测和分析 MRN 组件库中需要迁移的组件。

使用方式：
    python3 find_components_to_migrate.py --path /path/to/project [--component Component] [--library @mtfe/empower-trantor-mrn]
"""

import os
import re
import sys
import argparse
import json
from pathlib import Path
from typing import Dict, List, Set, Tuple

# references 子目录相对路径 → npm 包名的映射
# 目录名与包名不直接对应，因此保留此映射表
_REFERENCES_DIR_MAP = {
    'empower-trantor-mrn':              '@mtfe/empower-trantor-mrn',
    'empower-mrn-components/root':      '@mtfe/empower-mrn-components',
    'empower-mrn-components/shuguopai': '@mtfe/empower-mrn-components/shuguopai',
    'flower-rn':                        '@sgfe/flower-rn',
    'roo-rn':                           '@roo/roo-rn',
    'roo-rn1':                          '@roo/roo-rn1',
    'empower-mrn-bizcomponents':        '@mtfe/empower-mrn-bizcomponents',
    'roo-rn-plus':                      '@roo/roo-rn-plus',
    'mtd-react-native':                 '@ss/mtd-react-native',
}


def _load_migration_sources(references_dir: Path) -> Dict[str, List[str]]:
    """从 references 目录动态读取各库可迁移的组件列表（以 .md 文件名为准）"""
    sources: Dict[str, List[str]] = {}
    for rel_dir, package_name in _REFERENCES_DIR_MAP.items():
        target_dir = references_dir / rel_dir
        if target_dir.is_dir():
            components = sorted(
                f.stem for f in target_dir.iterdir()
                if f.is_file() and f.suffix == '.md'
            )
        else:
            components = []
        sources[package_name] = components
    return sources


# 需要迁移的库和组件映射（从 references 目录动态加载）
_REFERENCES_DIR = Path(__file__).parent.parent / 'references'
MIGRATION_SOURCES = _load_migration_sources(_REFERENCES_DIR)

# wand-rn 中已有的对应组件
WAND_RN_MAPPING = {
    '@mtfe/empower-trantor-mrn': {
        'Button': 'Button',
        'Divider': 'Divider',
        'GeneralDialog': 'Dialog',
        'Indicator': 'Toast',          # 需要自定义 Loading 包装组件
        'LoadingFooter': 'Loading',    # 列表底部加载更多
        'MapView': 'MapView',
        'Message': 'Toast',            # 消息提示
        'NavigationBar': 'NavigationBar',
        'PeriodCalendarButton': 'Calendar',  # 日期范围选择
        'SlideSheet': 'BottomModal',
    },
    '@mtfe/empower-mrn-components': {
        'ActionSheet': 'ActionSheet',  # 行动面板
        'Avatar': 'Avatar',
        'Badge': 'Badge',
        'Button': 'Button',
        'Calendar': 'Calendar',        # 支持 Calendar.Day / Calendar.Range / Calendar.Multi
        'CalendarDialog': 'Calendar',  # 日历对话框
        'CapsuleTabs': 'CapsuleTabs',  # 胶囊标签页，子项用 CapsuleTabs.Tab
        'Cascader': 'Cascader',
        'Checkbox': 'Checkbox',
        'Collapsing': 'Collapsing',    # 折叠面板
        'Dialog': 'Dialog',
        'Divider': 'Divider',          # direction→type, dividerStyle→dashed
        'Empty': 'Placeholder',        # 空状态组件
        'EmptyPlaceHolder': 'Placeholder',  # 或自定义空状态组件
        'ErrorPlaceHolder': 'Placeholder',  # 需要自定义错误占位符
        'Form': 'Form',                # 表单，子项用 Form.Item
        'GridView': 'Row',            # 网格布局，需用 Row + Col 组合
        'Icon': 'Icon',
        'Image': 'Image',
        'ImageViewer': 'ImagePreview', # 图片预览
        'Indicator': 'Loading',        # 加载指示器
        'Input': 'Input',
        'LoadingIndicator': 'Loading', # 组件名变更，size 从字符串改为数值
        'Modal': 'Modal',
        'NavBar': 'NavigationBar',     # 导航栏
        'NavigationBar': 'NavigationBar',
        'OptionItem': 'SlideSheet',    # SlideSheet 选项项
        'Picker': 'Picker',
        'PlaceholderImage': 'Image',   # 需要包装处理占位符逻辑
        'PopoverMenuWhite': 'Popover', # menuItems→options, anchor→children
        'PopupDatePicker': 'PopupDatePicker',
        'Progress': 'Progress',
        'Refresh': 'Refresh',          # 下拉刷新
        'RefreshList': 'List',         # 需要自定义刷新逻辑
        'SearchBar': 'SearchBar',
        'SearchBox': 'SearchBar',
        'Slider': 'Slider',
        'SlideSelect': 'SlideSheet',   # 滑动选择
        'SlideSheet': 'BottomModal',   # 通用底部滑出容器用 BottomModal
        'SlideView': 'SlideView',
        'Stepper': 'Stepper',
        'SwipeAction': 'SwipeAction',  # 滑动操作
        'Switch': 'Switch',
        'Tab': 'Tag',                  # 标签
        'Tabs': 'Tabs',                # 标签页，子项用 Tabs.TabPane
        'Tag': 'Tag',
        'Tags': 'Tags',
        'Toast': 'Toast',
        'Touchable': 'Press',
        'WaterMark': 'WaterMark',
    },
    '@mtfe/empower-mrn-components/shuguopai': {
        'ActionSheet': 'ActionSheet',  # 行动面板
        'Badge': 'Badge',
        'BottomModal': 'BottomModal',
        'Button': 'Button',
        'Checkbox': 'Checkbox',        # 复选框
        'Dialog': 'Dialog',
        # 'DialogProvider': 'WandRnProvider',  # 全局 Dialog 上下文
        'Icon': 'Icon',
        'Indicator': 'Toast',          # 需要自定义 Loading 包装组件
        'NavigationBar': 'NavigationBar',
        'Picker': 'Picker',
        'PrimaryStepper': 'Stepper',   # 步进器
        'Radio': 'Radio',
        'SlidePicker': 'Picker',       # 滑动选择器
        'Switch': 'Switch',            # 开关
        'TabView': 'SwitchTab',        # 标签页切换
        'TopDialog': 'Dialog',         # 或自定义顶部对话框
        'TopIndicator': 'Toast',       # 需要自定义 Loading 包装组件
    },
    '@sgfe/flower-rn': {
        'Badge': 'Badge',
        'BottomModal': 'BottomModal',
        'Button': 'Button',
        'Card': 'Card',
        'CascaderMultiple': 'CascaderMultiple',
        'Checkbox': 'Checkbox',
        'Col': 'Col',
        'Dialog': 'Dialog',
        'Divider': 'Divider',
        'Flex': 'Flex',
        # 'FlowerProvider': 'WandRnProvider',
        'Form': 'Form',
        'Icon': 'Icon',
        'Image': 'Image',
        'ImagePreview': 'ImagePreview',
        'Input': 'Input',
        'List': 'List',
        'Loading': 'Loading',
        'NavigationBar': 'NavigationBar',
        'Picker': 'Picker',
        'PickerGroup': 'PickerGroup',
        'PlaceHolder': 'PlaceHolder',
        'Popover': 'Popover',
        'Press': 'Press',
        'PressOpacity': 'Press',
        'Radio': 'Radio',
        'Row': 'Row',
        'SafeAreaView': 'SafeAreaView',
        'ScannerView': 'ScannerView',
        'SearchBar': 'SearchBar',
        'Select': 'Selector',          # Select 对应 Selector
        'SlideSheet': 'SlideSheet',    # 底部滑出面板
        'Space': 'Space',
        'Stepper': 'Stepper',          # 步进器
        'Switch': 'Switch',
        'Tags': 'Tag',
        'Tip': 'Tip',
        'Typography': 'Typography',    # 排版
    },
    '@roo/roo-rn': {
        'ActionSheet': 'ActionSheet',
        'Badge': 'Badge',
        'Button': 'Button',
        'Datepicker': 'Calendar',      # 滚轮日期选择→日历网格，仅支持日期
        'Dialog': 'Dialog',
        'Form': 'Form',               # 架构差异大：class+async-validator→rc-field-form
        'Icon': 'Icon',               # icon 类型集缩减
        'Input': 'Input',
        'List': 'List',               # 架构不同：静态布局→FlatList 分页列表
        'Loading': 'Loading',
        'Modal': 'RCModal',           # 组件名变更
        'NavigationBar': 'NavigationBar',
        'Radio': 'Radio',
        'Scrollpicker': 'Picker',     # 滚轮选择器，wand-rn 无等价滚轮组件
        'Select': 'Select',
        'SlideModal': 'SlideModal',
        'Tab': 'SwitchTab',           # 仅适用简单 2-3 项切换场景
        'Tags': 'Tags',
        'Tip': 'Tip',
    },
    '@roo/roo-rn1': {
        'ActionSheet': 'ActionSheet',
        'Badge': 'Badge',
        'Button': 'Button',
        'Datepicker': 'Calendar',      # 滚轮日期选择→日历网格，仅支持日期
        'Dialog': 'Dialog',
        'Form': 'Form',               # 架构差异大：class+async-validator→rc-field-form
        'Icon': 'Icon',               # icon 类型集缩减
        'Input': 'Input',
        'List': 'List',               # 架构不同：静态布局→FlatList 分页列表
        'Loading': 'Loading',
        'Modal': 'RCModal',           # 组件名变更
        'NavigationBar': 'NavigationBar',
        'Radio': 'Radio',
        'Scrollpicker': 'Picker',     # 滚轮选择器
        'Select': 'Select',
        'SlideModal': 'SlideModal',
        'Tab': 'SwitchTab',           # 仅适用简单 2-3 项切换场景
        'Tags': 'Tags',
        'Tip': 'Tip',
    },
    '@mtfe/empower-mrn-bizcomponents': {
        'List': 'List',               # 业务列表容器，需手动处理空/错误/加载状态
    },
    '@ss/mtd-react-native': {
        'Button': 'Button',            # prop 名/枚举值有变化
        'Checkbox': 'Checkbox',        # 架构变更：Checkbox+Item→Checkbox+Group
        # 'MTDProvider': 'WandRnProvider',  # 全局配置 Provider
        'Radio': 'Radio',             # 架构变更：Radio+Item→Radio+Group
    },
}


# ─────────────────────────────────────────────────────────────────────────────
# 第一类组件：只需替换 import 路径，无需修改任何业务代码即可正常运行。
# 格式：{ 源库 → { 旧组件名 → 新组件名（wand-rn 中的名称） } }
#
# 判断标准：
#   1. 所有 Props 名称、类型、默认值完全兼容（无破坏性变更）
#   2. 组件名称本身不变
#   3. 新增属性全部为可选，且不影响现有代码行为
# ─────────────────────────────────────────────────────────────────────────────
AUTO_MIGRATABLE: Dict[str, Dict[str, str]] = {
    '@sgfe/flower-rn': {
        # 组件名不变，API 完全向后兼容
        'Flex':             'Flex',
        'Loading':          'Loading',
        'SafeAreaView':     'SafeAreaView',
        'PickerGroup':      'PickerGroup',
        'Checkbox':         'Checkbox',
        'CascaderMultiple': 'CascaderMultiple',
        'Input':            'Input',
        'NavigationBar':    'NavigationBar',
        'Radio':            'Radio',
        # List：onFooterLoad 移除了 RefreshStatus 参数；
        #        若业务代码未使用该参数（绝大多数情况），可直接迁移。
        #        如确实用到了该参数，脚本替换后需手动删除参数声明。
        'List':             'List',
        # useList：Options 完全兼容（getList 返回类型从 [] 改为 TData[]，
        #           不影响运行时行为）；与 List 配套使用时可一并平迁。
        'useList':          'useList',
        'Space':            'Space',
        'Col':              'Col',
        'Row':              'Row',
        'Stepper':          'Stepper',
        'Switch':           'Switch',
        'Popover':          'Popover',
        'ScannerView':      'ScannerView',
        'PlaceHolder':      'PlaceHolder',
        'Tip':              'Tip',
        'Badge':            'Badge',
        'Toast':            'Toast',
    },
}


def auto_migrate_file(filepath: str, library: str, dry_run: bool = False) -> Tuple[bool, List[str]]:
    """
    对单个文件执行第一类组件的自动迁移（纯 import 路径替换）。

    返回 (changed: bool, messages: List[str])。
    当 dry_run=True 时，只预览变更，不写入文件。
    """
    auto_map = AUTO_MIGRATABLE.get(library, {})
    if not auto_map:
        return False, [f"库 {library} 暂无可自动迁移的组件"]

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original = f.read()
    except Exception as e:
        return False, [f"读取文件失败：{e}"]

    messages = []
    changed = False

    # 匹配形如（支持多行花括号）：
    #   import { A, B as C } from '@sgfe/flower-rn'
    #   import {
    #     A, B,
    #   } from '@sgfe/flower-rn'
    import_pattern = re.compile(
        rf"([ \t]*import\s*\{{)([^}}]+)(\}}\s*from\s*['\"])({re.escape(library)})(['\"][^\n]*)",
        re.DOTALL,
    )

    def _replace_match(m: re.Match) -> Tuple[str, List[str]]:
        """处理一个 import 匹配，返回 (替换后文本, 消息列表)"""
        prefix, items_str, mid, _lib, suffix = m.groups()
        # 计算起始行号（用于消息）
        lineno = original[:m.start()].count('\n') + 1

        # 解析花括号内各项（支持多行、行内注释、type 关键字）
        raw_items = []
        for token in re.split(r'[,\n]', items_str):
            token = re.sub(r'//.*$', '', token).strip()  # 去行内注释
            token = re.sub(r'^type\s+', '', token)       # 去 type 前缀
            if token:
                raw_items.append(token)

        auto_items: List[str] = []    # 可自动迁移的组件（含 as 别名）
        manual_items: List[str] = []  # 需手动迁移的组件（含 as 别名）

        for raw in raw_items:
            original_name = raw.split(' as ')[0].strip()
            if original_name in auto_map:
                new_name = auto_map[original_name]
                if new_name != original_name:
                    parts = raw.split(' as ')
                    if len(parts) == 2:
                        auto_items.append(f"{new_name} as {parts[1].strip()}")
                    else:
                        auto_items.append(new_name)
                else:
                    auto_items.append(raw)
            else:
                manual_items.append(raw)

        if not auto_items:
            return m.group(0), []  # 无可迁移组件，原样保留

        msgs = []
        result_parts = []

        # 生成新库 import（单行，保持简洁）
        new_import_items = ' ' + ', '.join(auto_items) + ' '
        result_parts.append(f"{prefix}{new_import_items}{mid}@sfe/wand-rn{suffix}")
        msgs.append(f"  行 {lineno}：{', '.join(auto_items)} ← {library} → @sfe/wand-rn")

        if manual_items:
            # 保留原库 import，单行展示
            kept_import_items = ' ' + ', '.join(manual_items) + ' '
            result_parts.append(f"{prefix}{kept_import_items}{mid}{library}{suffix}")
            msgs.append(f"  行 {lineno}：{', '.join(manual_items)} 需手动迁移，保留原 import")

        return '\n'.join(result_parts), msgs

    new_content = original
    # 从后往前替换，避免偏移量错位
    matches = list(import_pattern.finditer(new_content))
    for m in reversed(matches):
        replacement, msgs = _replace_match(m)
        if replacement != m.group(0):
            new_content = new_content[:m.start()] + replacement + new_content[m.end():]
            messages.extend(reversed(msgs))
            changed = True

    # 消息按文件顺序排列
    messages.reverse()

    if changed and not dry_run:
        # 若文件末尾原本有换行，确保保留
        if original.endswith('\n') and not new_content.endswith('\n'):
            new_content += '\n'
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

    return changed, messages


def _auto_migrate(
    project_path: str,
    library: str,
    status_file: str = None,
    dry_run: bool = False,
    target_files: List[str] = None,
) -> None:
    """
    批量对项目中所有文件执行第一类组件的自动 import 替换。

    - 只处理 AUTO_MIGRATABLE 中的组件，其余组件保留原 import 不动。
    - 支持 dry_run 模式（预览，不写入）。
    - 若提供 status_file，自动将已迁移完成（无剩余手动组件）的文件标记为 done。
    - 若提供 target_files，只处理这些文件（相对于 project_path）。
    """
    auto_map = AUTO_MIGRATABLE.get(library, {})
    if not auto_map:
        print(f"❌ 库 {library} 暂无可自动迁移的组件，请检查 AUTO_MIGRATABLE 配置")
        return

    mode_label = "（预览模式，不写入文件）" if dry_run else ""
    print(f"\n🚀 自动迁移 {library} → @sfe/wand-rn {mode_label}")
    print(f"   可自动迁移的组件：{', '.join(sorted(auto_map.keys()))}\n")

    project = Path(project_path)

    # 收集待处理文件
    if target_files:
        files_to_process = [project / f for f in target_files]
    else:
        files_to_process = []
        for root, dirs, files in os.walk(project):
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', 'build']]
            for fname in files:
                if fname.endswith(('.tsx', '.ts', '.jsx', '.js')):
                    files_to_process.append(Path(root) / fname)

    changed_files = []
    skipped_files = []

    for fpath in sorted(files_to_process):
        if not fpath.exists():
            print(f"  ⚠️  文件不存在，跳过：{fpath}")
            continue

        changed, msgs = auto_migrate_file(str(fpath), library, dry_run=dry_run)
        if changed:
            rel = fpath.relative_to(project)
            changed_files.append(str(rel))
            status = "（预览）" if dry_run else "✅"
            print(f"  {status} {rel}")
            for msg in msgs:
                print(msg)
        else:
            skipped_files.append(str(fpath.relative_to(project)))

    print(f"\n📊 结果：共处理 {len(changed_files)} 个文件")
    if dry_run:
        print("   以上为预览，未写入任何文件。去掉 --dry-run 后执行实际替换。")
    else:
        print(f"   已修改：{len(changed_files)} 个文件")

    # 更新进度文件：将已自动迁移的组件在进度文件中标记为 done
    if status_file and not dry_run and os.path.exists(status_file):
        # 重新扫描，找出还有哪些组件仍在使用旧库
        analyzer = ComponentMigrationAnalyzer(project_path)
        remaining_imports = analyzer.find_imports()
        remaining_imports = {k: v for k, v in remaining_imports.items() if k == library}

        # 构建"还在使用旧库"的 (file, component) 集合
        remaining_pairs: Set[Tuple[str, str]] = set()
        for lib_imports in remaining_imports.values():
            for item in lib_imports:
                remaining_pairs.add((item['file'], item['component']))

        # 读取进度文件，逐组件判断是否可自动标记
        with open(status_file, 'r', encoding='utf-8') as sf:
            status_data = json.load(sf)

        auto_map = AUTO_MIGRATABLE.get(library, {})
        marked_count = 0
        partial_files: Set[str] = set()

        for file_item in status_data['files']:
            if file_item['file'] not in changed_files:
                continue
            for comp in file_item['components']:
                if comp.get('status') != 'pending':
                    continue
                if comp['library'] != library:
                    continue
                comp_name = comp['component']
                if comp_name in auto_map and (file_item['file'], comp_name) not in remaining_pairs:
                    # 该组件已被自动迁移完成
                    comp['status'] = 'done'
                    marked_count += 1
                else:
                    partial_files.add(file_item['file'])

        if marked_count:
            status_data['completed_components'] = sum(
                1 for item in status_data['files']
                for c in item['components']
                if c.get('status') == 'done'
            )
            with open(status_file, 'w', encoding='utf-8') as sf:
                json.dump(status_data, sf, indent=2, ensure_ascii=False)
            print(f"\n✅ 已自动将 {marked_count} 个组件标记为 done（进度文件已更新）")

        if partial_files:
            print(f"\n⚠️  以下 {len(partial_files)} 个文件仍有需手动迁移的组件，请手动完成后再标记：")
            for f in sorted(partial_files):
                print(f"   - {f}")


class ComponentMigrationAnalyzer:
    """分析和检测需要迁移的组件"""

    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.findings: Dict[str, List[Dict]] = {}

    def find_imports(self) -> Dict[str, List[Dict]]:
        """查找所有需要迁移的组件导入（支持多行 import 语句）"""
        results = {}

        for library, components in MIGRATION_SOURCES.items():
            results[library] = []

            # 使用 re.DOTALL 匹配跨行的 import / require 语句
            # group(1): 花括号内的导入内容，group(2): 库名
            patterns = [
                # import { Component } from 'library'  （支持多行）
                rf"import\s*\{{([^}}]*)\}}\s*from\s*['\"]({re.escape(library)})['\"]",
                # const { Component } = require('library')  （支持多行）
                rf"const\s*\{{([^}}]*)\}}\s*=\s*require\(['\"]({re.escape(library)})['\"]",
            ]

            for root, dirs, files in os.walk(self.project_path):
                # 跳过 node_modules 等目录
                dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', 'build']]

                for file in files:
                    if file.endswith(('.tsx', '.ts', '.jsx', '.js')):
                        filepath = Path(root) / file
                        try:
                            with open(filepath, 'r', encoding='utf-8') as f:
                                content = f.read()

                            # 预计算每个字符偏移量对应的行号（用于定位 match 起始行）
                            line_starts = [0]
                            for i, ch in enumerate(content):
                                if ch == '\n':
                                    line_starts.append(i + 1)

                            def offset_to_lineno(offset: int) -> int:
                                lo, hi = 0, len(line_starts) - 1
                                while lo < hi:
                                    mid = (lo + hi + 1) // 2
                                    if line_starts[mid] <= offset:
                                        lo = mid
                                    else:
                                        hi = mid - 1
                                return lo + 1  # 1-based

                            for pattern in patterns:
                                for match in re.finditer(pattern, content, re.DOTALL):
                                    imported_items = match.group(1)
                                    lineno = offset_to_lineno(match.start())
                                    # 取 import 语句第一行作为展示用的 import_statement
                                    first_line = content[match.start():].split('\n')[0].strip()

                                    # 提取单个组件名（过滤注释、type 关键字、空串）
                                    item_names = []
                                    for s in re.split(r'[,\n]', imported_items):
                                        s = s.strip()
                                        # 去掉行内注释
                                        s = re.sub(r'//.*$', '', s).strip()
                                        # 处理 `type Foo` / `Foo as Bar`
                                        s = re.sub(r'^type\s+', '', s)
                                        s = s.split(' as ')[0].strip()
                                        if s:
                                            item_names.append(s)

                                    relative_path = filepath.relative_to(self.project_path)
                                    for item in item_names:
                                        if item in components:
                                            results[library].append({
                                                'file': str(relative_path),
                                                'line': lineno,
                                                'component': item,
                                                'import_statement': first_line,
                                                'wand_rn_target': WAND_RN_MAPPING.get(library, {}).get(item, 'Unknown'),
                                            })

                        except Exception as e:
                            print(f"Error reading {filepath}: {e}", file=sys.stderr)

        return results

    def analyze_component_usage(self, filepath: str, component: str) -> List[Dict]:
        """分析特定文件中组件的使用情况"""
        usages = []
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                lineno = 1

                # 匹配 JSX 标签: <Component ... />
                pattern = rf"<\s*{re.escape(component)}\s*[^>]*/?>"

                for line in content.split('\n'):
                    matches = re.finditer(pattern, line)
                    for match in matches:
                        usages.append({
                            'line': lineno,
                            'code': line.strip(),
                            'position': match.start(),
                        })
                    lineno += 1

        except Exception as e:
            print(f"Error analyzing {filepath}: {e}", file=sys.stderr)

        return usages

    def generate_report(self, imports: Dict) -> str:
        """生成迁移报告"""
        report_lines = [
            "# MRN 组件迁移检测报告\n",
            f"分析项目：{self.project_path}\n",
        ]

        total_components = 0
        for library, found_imports in imports.items():
            if found_imports:
                report_lines.append(f"\n## {library} ({len(found_imports)} 处)\n")
                report_lines.append(
                    "| 文件 | 行号 | 组件名 | 目标组件 | 导入语句 |\n"
                )
                report_lines.append("|------|------|--------|---------|----------|\n")

                for import_info in found_imports:
                    report_lines.append(
                        f"| {import_info['file']} | {import_info['line']} | "
                        f"{import_info['component']} | {import_info['wand_rn_target']} | "
                        f"`{import_info['import_statement'][:50]}...` |\n"
                    )
                    total_components += 1

        report_lines.insert(2, f"检测到需要迁移的组件导入：**{total_components}** 处\n")

        if total_components == 0:
            report_lines.append("\n✓ 没有检测到需要迁移的组件\n")

        return "".join(report_lines)


def _init_status_file(
    project_path: str,
    status_file: str,
    library_filter: str = None,
) -> None:
    """
    扫描项目，生成迁移进度文件（migration-status.json）。

    当 library_filter 不为 None 时，只收录该库相关的文件和组件。

    进度文件格式：
    {
      "project": "/path/to/project",
      "generated_at": "2026-03-02",
      "library_filter": "@sgfe/flower-rn",   // 仅按库过滤时存在
      "total_components": 15,
      "completed_components": 0,
      "files": [
        {
          "file": "src/pages/Order/index.tsx",
          "components": [
            {"library": "@sgfe/flower-rn", "component": "Button", "line": 3, "wand_rn_target": "Button", "status": "pending"}
          ]
        }
      ]
    }

    注意：批次信息不保存在本文件中，请用 init-batches 命令单独生成批次文件。
    """
    import datetime

    analyzer = ComponentMigrationAnalyzer(project_path)
    imports = analyzer.find_imports()

    # 按库过滤
    if library_filter:
        imports = {k: v for k, v in imports.items() if k == library_filter}

    # 按文件聚合结果
    files_map: Dict[str, List[Dict]] = {}
    for library, found_imports in imports.items():
        for item in found_imports:
            f = item['file']
            if f not in files_map:
                files_map[f] = []
            files_map[f].append({
                'library': library,
                'component': item['component'],
                'line': item['line'],
                'wand_rn_target': item['wand_rn_target'],
            })

    files_list = [
        {
            'file': f,
            'components': [
                {**comp, 'status': 'pending'}
                for comp in comps
            ],
        }
        for f, comps in sorted(files_map.items())
    ]

    total_components = sum(len(item['components']) for item in files_list)

    status_data: Dict = {
        'project': str(Path(project_path).resolve()),
        'generated_at': datetime.date.today().isoformat(),
        'total_components': total_components,
        'completed_components': 0,
        'files': files_list,
    }
    if library_filter:
        status_data['library_filter'] = library_filter

    with open(status_file, 'w', encoding='utf-8') as f:
        json.dump(status_data, f, indent=2, ensure_ascii=False)

    print(f"✓ 进度文件已生成：{status_file}")
    if library_filter:
        print(f"  仅包含库：{library_filter}")
    print(f"  共检测到 {len(files_list)} 个文件，{total_components} 个待迁移组件")


def _show_status(status_file: str) -> None:
    """显示当前迁移进度概览"""
    with open(status_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    total = data['total_components']
    completed = data['completed_components']

    # 收集有待迁移组件的文件
    pending_files = []
    for item in data['files']:
        pending_comps = [c for c in item['components'] if c.get('status') == 'pending']
        skipped_comps = [c for c in item['components'] if c.get('status') == 'skipped']
        if pending_comps:
            pending_files.append((item['file'], pending_comps, skipped_comps))

    skipped_total = sum(
        1 for item in data['files']
        for c in item['components']
        if c.get('status') == 'skipped'
    )
    pending_total = total - completed - skipped_total

    print(f"\n📊 迁移进度：{completed}/{total} 组件已完成")
    if skipped_total:
        print(f"   跳过：{skipped_total} 个组件")
    print(f"   剩余：{pending_total} 个组件（{len(pending_files)} 个文件）\n")

    if pending_files:
        print("待迁移组件（前 10 个文件）：")
        for filepath, pending_comps, _ in pending_files[:10]:
            components_str = ', '.join(
                f"{c['component']}({c['library']})" for c in pending_comps
            )
            print(f"  - {filepath}  [{components_str}]")
        if len(pending_files) > 10:
            print(f"  ... 还有 {len(pending_files) - 10} 个文件")


def _init_batches_file(
    status_file: str,
    batches_file: str,
) -> None:
    """
    读取迁移进度文件，按分批策略计算任务批次，并写入独立的批次文件。

    批次文件格式：
    {
      "generated_at": "2026-03-02",
      "status_file": "migration-status.json",
      "total_batches": 5,
      "batches": [
        {
          "batch_index": 1,
          "components": ["Typography"],
          "library": "@sgfe/flower-rn",
          "files": ["src/a.tsx", "src/b.tsx"],
          "file_count": 2
        },
        ...
      ]
    }
    """
    import datetime

    batches = _build_batches(status_file)

    data = {
        'generated_at': datetime.date.today().isoformat(),
        'status_file': status_file,
        'total_batches': len(batches),
        'batches': batches,
    }

    with open(batches_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    total_files = sum(b['file_count'] for b in batches)
    print(f'✓ 批次文件已生成：{batches_file}')
    print(f'  共 {len(batches)} 个批次，涉及 {total_files} 个文件')
    for b in batches:
        comp_str = ', '.join(b['components'])
        lib_str = f'  [{b["library"]}]' if b['library'] else ''
        print(f'  批次 {b["batch_index"]:>2}  组件：{comp_str}{lib_str}  ({b["file_count"]} 个文件)')


def _build_batches(status_file: str) -> List[Dict]:
    """
    按分批策略将 pending 文件划分为 SubAgent 任务批次。

    分批规则（批次内不同组件种数 → 每批文件数上限）：
      1 种  → 30 个文件
      2-3 种 → 15 个文件
      4 种+  → 8 个文件

    算法：
      1. 收集每个文件对应的 pending 组件集合
      2. 将「只含 1 种 pending 组件」的文件与「含多种 pending 组件」的文件分开处理
      3. 单组件文件：按文件数量降序（文件多的组件先处理），按上限（30）切片
      4. 多组件文件：按文件的组件种数升序排列，再按对应上限切片
         - 每个文件整体进入同一批次（不拆分到多个批次）

    返回批次列表，每批：
    {
      "batch_index": 1,
      "components": ["Typography"],          // 批次内涉及的所有组件
      "library": "@sgfe/flower-rn",          // 仅单库时有值，否则为 null
      "files": ["src/a.tsx", ...],
      "file_count": N
    }
    """
    with open(status_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 批次大小上限
    BATCH_LIMITS = {1: 30, 2: 15, 3: 15, 4: 8}
    def _batch_limit(n_components: int) -> int:
        return BATCH_LIMITS.get(n_components, 8)

    # 收集每个 pending 文件 → {(library, component), ...}
    file_to_comp_keys: Dict[str, Set[Tuple[str, str]]] = {}
    for item in data['files']:
        pending = [
            (c['library'], c['component'])
            for c in item['components']
            if c.get('status') == 'pending'
        ]
        if pending:
            file_to_comp_keys[item['file']] = set(pending)

    if not file_to_comp_keys:
        return []

    # 分成「单组件文件」和「多组件文件」
    single_comp_files: Dict[Tuple[str, str], List[str]] = {}  # key → files
    multi_comp_files: List[Tuple[str, Set[Tuple[str, str]]]] = []  # (file, keys)

    for filepath, keys in file_to_comp_keys.items():
        if len(keys) == 1:
            key = next(iter(keys))
            single_comp_files.setdefault(key, []).append(filepath)
        else:
            multi_comp_files.append((filepath, keys))

    batches: List[Dict] = []

    # ── 单组件文件：按组件的文件数量降序，按上限（30）切片 ──────────────────
    sorted_single = sorted(single_comp_files.items(), key=lambda x: len(x[1]), reverse=True)
    for (library, component), files in sorted_single:
        limit = _batch_limit(1)
        for i in range(0, len(files), limit):
            chunk = files[i: i + limit]
            batches.append({
                'components': [component],
                'library': library,
                'files': chunk,
                'file_count': len(chunk),
            })

    # ── 多组件文件：按每个文件的组件种数升序，再按上限切片 ──────────────────
    # 同一批次内，文件的组件种数可能不同，以批次内实际最大种数决定上限
    # 简化策略：按「文件的组件种数」升序排列后，贪心地将文件加入当前批次
    multi_comp_files.sort(key=lambda x: len(x[1]))

    current_batch_files: List[str] = []
    current_batch_keys: Set[Tuple[str, str]] = set()

    def _flush_multi_batch():
        if not current_batch_files:
            return
        all_comps = sorted(set(c for _, c in current_batch_keys))
        libs = sorted(set(l for l, _ in current_batch_keys))
        batches.append({
            'components': all_comps,
            'library': libs[0] if len(libs) == 1 else None,
            'files': list(current_batch_files),
            'file_count': len(current_batch_files),
        })

    for filepath, keys in multi_comp_files:
        merged_keys = current_batch_keys | keys
        n_comps = len(set(c for _, c in merged_keys))
        limit = _batch_limit(n_comps)
        if current_batch_files and len(current_batch_files) >= limit:
            _flush_multi_batch()
            current_batch_files = []
            current_batch_keys = set()
        current_batch_files.append(filepath)
        current_batch_keys |= keys

    _flush_multi_batch()

    # 添加批次序号
    for idx, batch in enumerate(batches, start=1):
        batch['batch_index'] = idx

    return batches


def _group_by_component(batches_file: str, output_json: bool = False) -> None:
    """
    从批次文件中读取并展示 SubAgent 任务批次列表。

    请先使用 init-batches 命令生成批次文件，再用本命令查看批次详情。

    输出格式（JSON）：批次文件中 batches 字段的内容
    [
      {
        "batch_index": 1,
        "components": ["Typography"],
        "library": "@sgfe/flower-rn",
        "files": ["src/a.tsx", "src/b.tsx"],
        "file_count": 2
      },
      ...
    ]
    """
    if not os.path.exists(batches_file):
        print(f'❌ 批次文件不存在：{batches_file}')
        print('   请先运行 init-batches 命令生成批次文件：')
        print('   python3 find_components_to_migrate.py init-batches \\')
        print('     --status-file migration-status.json \\')
        print('     --batches-file migration-batches.json')
        return

    with open(batches_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    batches = data.get('batches', [])

    if output_json:
        print(json.dumps(batches, indent=2, ensure_ascii=False))
        return

    if not batches:
        print('✅ 批次文件中没有待执行的批次！')
        return

    total_files_in_batches = sum(b['file_count'] for b in batches)
    generated_at = data.get('generated_at', '未知')
    print(f'\n📦 SubAgent 批次计划（共 {len(batches)} 批，涉及 {total_files_in_batches} 个文件，生成于 {generated_at}）：\n')
    for b in batches:
        comp_str = ', '.join(b['components'])
        lib_str = f'  [{b["library"]}]' if b['library'] else ''
        print(f'  批次 {b["batch_index"]:>2}  组件：{comp_str}{lib_str}  ({b["file_count"]} 个文件)')
        for f in b['files']:
            print(f'      - {f}')


def _mark_done(
    status_file: str,
    files_to_mark: List[str],
    skip: bool = False,
    component_filter: str = None,
) -> None:
    """
    将指定文件中的组件标记为完成（done）或跳过（skipped）。

    - files_to_mark: 要标记的文件路径列表（相对路径，与进度文件中一致）
    - component_filter: 若指定组件名，只标记该组件；不指定则标记文件中全部待迁移组件
    - skip: True 时标记为 skipped，否则标记为 done
    """
    with open(status_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    new_status = 'skipped' if skip else 'done'
    marked = 0
    for item in data['files']:
        if item['file'] not in files_to_mark:
            continue
        for comp in item['components']:
            if comp.get('status') != 'pending':
                continue
            if component_filter and comp['component'] != component_filter:
                continue
            comp['status'] = new_status
            marked += 1

    data['completed_components'] = sum(
        1 for item in data['files']
        for c in item['components']
        if c.get('status') == 'done'
    )

    with open(status_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✓ 已将 {marked} 个组件标记为 {new_status}")
    _show_status(status_file)


def _update_status(
    project_path: str,
    status_file: str,
    library_filter: str = None,
    dry_run: bool = False,
) -> None:
    """
    重新扫描项目，将 migration-status.json 中仍处于 pending 状态、
    但代码中已不再使用旧库 import 的组件自动标记为 done。

    使用场景：手动完成一批文件的迁移后，一次性同步进度文件，
    无需逐一调用 mark-done。

    - project_path   : 项目根目录
    - status_file    : 进度文件路径
    - library_filter : 只处理指定库（如 @sgfe/flower-rn）；不传则处理所有库
    - dry_run        : True 时只打印将要变更的内容，不写入文件
    """
    if not os.path.exists(status_file):
        print(f"❌ 进度文件不存在：{status_file}")
        print("   请先运行 init-status 命令生成进度文件")
        return

    with open(status_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 重新扫描项目，获取当前仍存在的旧库 import
    analyzer = ComponentMigrationAnalyzer(project_path)
    current_imports = analyzer.find_imports()

    if library_filter:
        current_imports = {k: v for k, v in current_imports.items() if k == library_filter}

    # 构建「仍在使用旧库」的 (file, library, component) 集合
    still_pending: Set[Tuple[str, str, str]] = set()
    for lib, items in current_imports.items():
        for item in items:
            still_pending.add((item['file'], lib, item['component']))

    mode_label = "（预览模式，不写入文件）" if dry_run else ""
    print(f"\n🔄 同步迁移进度 {mode_label}")
    if library_filter:
        print(f"   只处理库：{library_filter}")

    newly_done: List[Tuple[str, str, str]] = []   # (file, library, component)
    for file_item in data['files']:
        for comp in file_item['components']:
            if comp.get('status') != 'pending':
                continue
            lib = comp['library']
            if library_filter and lib != library_filter:
                continue
            key = (file_item['file'], lib, comp['component'])
            if key not in still_pending:
                # 代码中已不再引用旧库，自动标记为 done
                newly_done.append(key)
                if not dry_run:
                    comp['status'] = 'done'

    if not newly_done:
        print("✅ 没有检测到新增完成的组件，进度文件已是最新状态。")
        return

    print(f"\n✅ 检测到 {len(newly_done)} 个组件已完成迁移：")
    for fpath, lib, comp in sorted(newly_done):
        print(f"   {fpath}  {comp} ({lib})")

    if dry_run:
        print("\n   以上为预览，未写入任何文件。去掉 --dry-run 后执行实际更新。")
        return

    # 重新统计完成数
    data['completed_components'] = sum(
        1 for item in data['files']
        for c in item['components']
        if c.get('status') == 'done'
    )

    with open(status_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n✓ 进度文件已更新：{status_file}")
    _show_status(status_file)


def main():
    parser = argparse.ArgumentParser(
        description='检测和分析 MRN 组件库中需要迁移的组件'
    )
    subparsers = parser.add_subparsers(dest='command')

    # ── 子命令：scan（默认，扫描并输出报告） ──────────────────────────────
    scan_parser = subparsers.add_parser('scan', help='扫描项目并输出迁移报告（默认）')
    scan_parser.add_argument('--path', '-p', required=True, help='项目路径')
    scan_parser.add_argument('--component', '-c', help='检查特定组件')
    scan_parser.add_argument('--library', '-l', help='检查特定库')
    scan_parser.add_argument('--output', '-o', help='输出报告文件路径')
    scan_parser.add_argument('--json', action='store_true', help='以 JSON 格式输出结果')

    # ── 子命令：init-status（生成进度文件） ───────────────────────────────
    init_parser = subparsers.add_parser(
        'init-status',
        help='扫描项目并生成迁移进度文件（migration-status.json）'
    )
    init_parser.add_argument('--path', '-p', required=True, help='项目路径')
    init_parser.add_argument(
        '--status-file', '-s',
        default='migration-status.json',
        help='进度文件路径（默认：migration-status.json）'
    )
    init_parser.add_argument(
        '--library', '-l',
        help='只收录指定库的文件（如 @sgfe/flower-rn），不传则包含所有库'
    )

    # ── 子命令：status（查看进度） ────────────────────────────────────────
    status_parser = subparsers.add_parser('status', help='查看当前迁移进度')
    status_parser.add_argument(
        '--status-file', '-s',
        default='migration-status.json',
        help='进度文件路径（默认：migration-status.json）'
    )

    # ── 子命令：mark-done（标记完成） ─────────────────────────────────────
    mark_parser = subparsers.add_parser('mark-done', help='将组件或文件标记为已完成')
    mark_parser.add_argument(
        '--status-file', '-s',
        default='migration-status.json',
        help='进度文件路径（默认：migration-status.json）'
    )
    mark_parser.add_argument(
        '--files', '-f',
        nargs='+',
        required=True,
        help='要标记的文件路径（相对路径，与进度文件中一致）'
    )
    mark_parser.add_argument(
        '--component', '-c',
        default=None,
        help='只标记指定组件名；不传则标记该文件中所有待迁移组件'
    )
    mark_parser.add_argument(
        '--skip',
        action='store_true',
        help='标记为跳过（skipped）而非完成（done）'
    )

    # ── 子命令：init-batches（生成批次文件） ──────────────────────────────
    batches_parser = subparsers.add_parser(
        'init-batches',
        help='读取进度文件，按分批策略计算批次并写入批次文件（migration-batches.json）'
    )
    batches_parser.add_argument(
        '--status-file', '-s',
        default='migration-status.json',
        help='进度文件路径（默认：migration-status.json）'
    )
    batches_parser.add_argument(
        '--batches-file', '-b',
        default='migration-batches.json',
        help='批次文件路径（默认：migration-batches.json）'
    )

    # ── 子命令：group-by-component（展示批次文件内容） ─────────────────────
    group_parser = subparsers.add_parser(
        'group-by-component',
        help='展示批次文件中的 SubAgent 任务批次列表（需先运行 init-batches）'
    )
    group_parser.add_argument(
        '--batches-file', '-b',
        default='migration-batches.json',
        help='批次文件路径（默认：migration-batches.json）'
    )
    group_parser.add_argument(
        '--json',
        action='store_true',
        help='以 JSON 格式输出，便于程序读取'
    )

    # ── 子命令：auto-migrate（自动替换第一类组件的 import） ───────────────
    auto_parser = subparsers.add_parser(
        'auto-migrate',
        help='自动替换第一类（无破坏性变更）组件的 import 路径，无需手动修改业务代码'
    )
    auto_parser.add_argument('--path', '-p', required=True, help='项目路径')
    auto_parser.add_argument(
        '--library', '-l',
        required=True,
        help='源库名称，如 @sgfe/flower-rn'
    )
    auto_parser.add_argument(
        '--status-file', '-s',
        default=None,
        help='进度文件路径（可选）；提供后自动标记已完成文件'
    )
    auto_parser.add_argument(
        '--dry-run',
        action='store_true',
        help='预览模式，只打印将要变更的内容，不写入文件'
    )
    auto_parser.add_argument(
        '--files', '-f',
        nargs='+',
        default=None,
        help='只处理指定文件（相对路径），不传则处理整个项目'
    )

    # ── 子命令：update-status（重新扫描并同步进度文件） ───────────────────
    update_parser = subparsers.add_parser(
        'update-status',
        help='重新扫描项目，将代码中已不再引用旧库的组件自动标记为 done'
    )
    update_parser.add_argument('--path', '-p', required=True, help='项目路径')
    update_parser.add_argument(
        '--status-file', '-s',
        default='migration-status.json',
        help='进度文件路径（默认：migration-status.json）'
    )
    update_parser.add_argument(
        '--library', '-l',
        default=None,
        help='只同步指定库的状态（如 @sgfe/flower-rn）；不传则处理所有库'
    )
    update_parser.add_argument(
        '--dry-run',
        action='store_true',
        help='预览模式，只打印将要变更的内容，不写入文件'
    )

    # ── 兼容旧用法：直接传 --path 不带子命令，等同于 scan ─────────────────
    parser.add_argument('--path', '-p', help='项目路径（兼容旧用法）')
    parser.add_argument('--component', '-c', help='检查特定组件（兼容旧用法）')
    parser.add_argument('--library', '-l', help='检查特定库（兼容旧用法）')
    parser.add_argument('--output', '-o', help='输出报告文件路径（兼容旧用法）')
    parser.add_argument('--json', action='store_true', help='以 JSON 格式输出（兼容旧用法）')

    args = parser.parse_args()

    # 路由到对应命令
    if args.command == 'init-status':
        _init_status_file(args.path, args.status_file, library_filter=getattr(args, 'library', None))

    elif args.command == 'status':
        _show_status(args.status_file)

    elif args.command == 'init-batches':
        _init_batches_file(args.status_file, args.batches_file)

    elif args.command == 'group-by-component':
        _group_by_component(args.batches_file, output_json=getattr(args, 'json', False))

    elif args.command == 'mark-done':
        _mark_done(args.status_file, args.files, skip=args.skip, component_filter=getattr(args, 'component', None))

    elif args.command == 'auto-migrate':
        _auto_migrate(
            project_path=args.path,
            library=args.library,
            status_file=getattr(args, 'status_file', None),
            dry_run=getattr(args, 'dry_run', False),
            target_files=getattr(args, 'files', None),
        )

    elif args.command == 'update-status':
        _update_status(
            project_path=args.path,
            status_file=args.status_file,
            library_filter=getattr(args, 'library', None),
            dry_run=getattr(args, 'dry_run', False),
        )

    else:
        # scan 或兼容旧用法
        path = getattr(args, 'path', None)
        if not path:
            parser.print_help()
            sys.exit(1)

        analyzer = ComponentMigrationAnalyzer(path)
        imports = analyzer.find_imports()

        if getattr(args, 'library', None):
            imports = {k: v for k, v in imports.items() if k == args.library}
        if getattr(args, 'component', None):
            imports = {
                k: [imp for imp in v if imp['component'] == args.component]
                for k, v in imports.items()
            }

        if getattr(args, 'json', False):
            output = json.dumps(imports, indent=2, ensure_ascii=False)
        else:
            output = analyzer.generate_report(imports)

        if getattr(args, 'output', None):
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(output)
            print(f"✓ 报告已保存到：{args.output}")
        else:
            print(output)


if __name__ == '__main__':
    main()
