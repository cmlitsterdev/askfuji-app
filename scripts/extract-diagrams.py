#!/usr/bin/env python3
import fitz
import os
import shutil

PDF_PATH = '/Users/chris.litster/Downloads/x100vi_manual_en_s_f.pdf'
OUT_DIR = '/Users/chris.litster/Library/CloudStorage/OneDrive-SumeruEquityPartners/Desktop/AskFuji/assets/diagrams'

os.makedirs(OUT_DIR, exist_ok=True)

# Clean up all the temp pages, keep only 30 and 31
for f in os.listdir(OUT_DIR):
    if f.endswith('.png') and f not in ('page_30.png', 'page_31.png'):
        os.remove(os.path.join(OUT_DIR, f))

doc = fitz.open(PDF_PATH)

for page_num in [29, 30]:  # 0-indexed
    page = doc[page_num]
    mat = fitz.Matrix(2.5, 2.5)  # Higher res for detail
    pix = page.get_pixmap(matrix=mat)
    out_path = os.path.join(OUT_DIR, f'page_{page_num + 1:02d}.png')
    pix.save(out_path)
    size_kb = os.path.getsize(out_path) // 1024
    print(f'Page {page_num + 1}: {size_kb}KB — saved')

doc.close()
print('Done.')
