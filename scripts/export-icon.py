#!/usr/bin/env python3
import cairosvg
from PIL import Image
import io
import os

ASSETS = '/Users/chris.litster/Library/CloudStorage/OneDrive-SumeruEquityPartners/Desktop/AskFuji/assets'
SVG_PATH = os.path.join(ASSETS, 'icon.svg')

def svg_to_png(size, out_path):
    png = cairosvg.svg2png(url=SVG_PATH, output_width=size, output_height=size)
    img = Image.open(io.BytesIO(png))
    img.save(out_path)
    print(f'✓ {out_path} ({size}x{size})')

# Main icon (1024x1024)
svg_to_png(1024, os.path.join(ASSETS, 'icon.png'))

# Splash icon (centered on white, 288x288 icon on 1284x2778 canvas)
splash_bg = Image.new('RGBA', (1284, 2778), (26, 58, 42, 255))
icon_png = cairosvg.svg2png(url=SVG_PATH, output_width=288, output_height=288)
icon_img = Image.open(io.BytesIO(icon_png))
x = (1284 - 288) // 2
y = (2778 - 288) // 2
splash_bg.paste(icon_img, (x, y), icon_img)
splash_bg.save(os.path.join(ASSETS, 'splash-icon.png'))
print(f'✓ splash-icon.png')

# Adaptive icon foreground (108dp = 432px with safe zone)
svg_to_png(432, os.path.join(ASSETS, 'adaptive-icon.png'))

print('\nAll icons exported.')
