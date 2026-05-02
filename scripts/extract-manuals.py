#!/usr/bin/env python3
from pypdf import PdfReader

manuals = [
    ('/Users/chris.litster/Downloads/x100vi_manual_en_s_f.pdf', 'manual'),
    ('/Users/chris.litster/Downloads/x100vi_nfg_en_s_f.pdf', 'newFeatures'),
]

output_lines = ['// Auto-generated from PDF manuals\n']

for path, key in manuals:
    print(f'Extracting {path}...')
    reader = PdfReader(path)
    pages = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            pages.append(text)
        if i % 10 == 0:
            print(f'  Page {i+1}/{len(reader.pages)}')
    cleaned = '\n'.join(pages)
    cleaned = cleaned.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    output_lines.append(f'export const {key} = `{cleaned}`;\n')
    print(f'  Done — {len(cleaned):,} chars')

out_path = '/Users/chris.litster/Library/CloudStorage/OneDrive-SumeruEquityPartners/Desktop/AskFuji/lib/manuals.ts'
with open(out_path, 'w') as f:
    f.writelines(output_lines)

print(f'\nWritten to {out_path}')
