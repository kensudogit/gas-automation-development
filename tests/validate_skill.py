from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[1]
skill = (root / 'SKILL.md').read_text(encoding='utf-8')
assert skill.startswith('---\n'), 'YAML frontmatter must start on first line'
parts = skill.split('---\n', 2)
assert len(parts) == 3, 'YAML frontmatter closing delimiter missing'
header = parts[1]
name = re.search(r'^name:\s*(\S+)\s*$', header, re.M)
desc = re.search(r'^description:\s*(.+)$', header, re.M)
assert name and name.group(1) == root.name, 'Skill name must match directory'
assert re.fullmatch(r'[a-z0-9-]+', name.group(1))
assert len(name.group(1)) <= 64
assert desc and 0 < len(desc.group(1)) <= 1024
assert all(line.startswith(('name:', 'description:')) for line in header.strip().splitlines())
manifest = json.loads((root / 'examples/appsscript.json').read_text(encoding='utf-8'))
assert manifest['runtimeVersion'] == 'V8'
assert (root / 'README.md').is_file()
gas_manifest = root / 'gas' / 'appsscript.json'
assert gas_manifest.is_file(), 'gas/appsscript.json starter project missing'
gas = json.loads(gas_manifest.read_text(encoding='utf-8'))
assert gas['runtimeVersion'] == 'V8'
for name in ('SalesLogic.js', 'SheetsSales.gs', 'Triggers.gs', 'Config.gs'):
    assert (root / 'gas' / name).is_file(), f'missing gas/{name}'
gas_logic = (root / 'gas' / 'SalesLogic.js').read_text(encoding='utf-8')
example = (root / 'examples' / 'sales.js').read_text(encoding='utf-8')
assert 'function sumSales' in gas_logic and 'function sumSales' in example
assert 'Non-numeric' in gas_logic and 'Non-numeric' in example
print('Skill metadata, paths, and manifest: OK')
