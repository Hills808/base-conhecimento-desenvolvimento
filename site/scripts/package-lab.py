"""Produce a reproducible download from the kit's source files only."""
from pathlib import Path
from io import BytesIO
import sys
import zipfile

site = Path(__file__).resolve().parent.parent
root = site / 'public/lab/kit-local'
archive = site / 'public/lab/kit-local.zip'
buffer = BytesIO()
with zipfile.ZipFile(buffer, 'w', compression=zipfile.ZIP_DEFLATED) as output:
    for file in sorted(root.rglob('*')):
        if not file.is_file() or any(part in ('bin', 'obj') for part in file.relative_to(root).parts):
            continue
        info = zipfile.ZipInfo('curva-aberta-kit-local/' + file.relative_to(root).as_posix(), (1980, 1, 1, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        output.writestr(info, file.read_bytes())
data = buffer.getvalue()
if '--check' in sys.argv:
    if not archive.exists() or archive.read_bytes() != data:
        raise SystemExit('Kit ZIP desatualizado. Execute python scripts/package-lab.py.')
else:
    archive.write_bytes(data)
print(f'Kit reproduzível: {len(data)} bytes, sem bin/obj.')
