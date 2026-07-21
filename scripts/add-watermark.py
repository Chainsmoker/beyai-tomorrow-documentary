#!/usr/bin/env python3
"""Add Watermark component to every scene Visual.tsx."""
import re
from pathlib import Path

SCENES_DIR = Path(__file__).parent.parent / "src" / "remotion" / "scenes"

# Watermark import line (relative path is same for all scene-0X/Visual.tsx)
IMPORT_LINE = 'import { Watermark } from "../../components/Watermark";\n'

# scene-03 uses GoldmanVisual.tsx but same import path
TARGETS = sorted(SCENES_DIR.glob("scene-*/Visual.tsx")) + sorted(SCENES_DIR.glob("scene-*/GoldmanVisual.tsx"))

for path in TARGETS:
    text = path.read_text()
    if "Watermark" in text:
        print(f"  skip {path.name} (already has Watermark)")
        continue

    # 1) Add import after the existing PostFX/PostFX import line (or last remotion import)
    postfx_import_re = re.compile(r'(import \{ PostFX[^}]*\} from [\"\'][^\"\']*PostFX[\"\'];?\n)', re.MULTILINE)
    m = postfx_import_re.search(text)
    if not m:
        # fallback: insert after last `import { ... } from 'remotion';`
        m = re.search(r'(import [^;]+ from [\"\']remotion[\"\'];\n)', text, re.MULTILINE)
    if not m:
        print(f"  ! could not find import anchor in {path.name}")
        continue
    insert_at = m.end()
    text = text[:insert_at] + IMPORT_LINE + text[insert_at:]

    # 2) Insert <Watermark /> just before the first <PostFX ... /> element
    postfx_open_re = re.compile(r'(\s*)(<PostFX\b)', re.MULTILINE)
    m2 = postfx_open_re.search(text)
    if not m2:
        # no PostFX (scene-15): insert before </AbsoluteFill>
        m2 = re.search(r'(\s*)(</AbsoluteFill>)', text)
        if not m2:
            print(f"  ! could not find anchor in {path.name}")
            continue
        indent = m2.group(1) or "      "
        text = text[:m2.start()] + f"\n{indent}<Watermark />" + text[m2.start():]
    else:
        indent = m2.group(1) or "      "
        text = text[:m2.start()] + f"\n{indent}<Watermark />" + text[m2.start():]

    path.write_text(text)
    print(f"  + {path.name}")

print("Done.")
