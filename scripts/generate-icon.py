#!/usr/bin/env python3
# Generates AskFuji app icon: Mt. Fuji silhouette with aperture-inspired design
# Requires: pip3 install cairosvg pillow

SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <!-- Background - deep forest green -->
  <rect width="1024" height="1024" rx="200" fill="#1a3a2a"/>

  <!-- Camera body - medium green -->
  <rect x="160" y="320" width="704" height="480" rx="60" fill="#2d5a3d"/>

  <!-- Viewfinder hump -->
  <rect x="340" y="240" width="180" height="100" rx="30" fill="#2d5a3d"/>

  <!-- Shutter button -->
  <circle cx="680" cy="268" r="36" fill="#3d7a52"/>
  <circle cx="680" cy="268" r="22" fill="#ffffff" opacity="0.95"/>

  <!-- Lens outer ring - dark green -->
  <circle cx="512" cy="560" r="190" fill="#122a1e"/>
  <circle cx="512" cy="560" r="172" fill="#1a3a2a"/>

  <!-- Lens ring marks -->
  <circle cx="512" cy="560" r="160" fill="none" stroke="#3d7a52" stroke-width="8"/>

  <!-- Lens glass layers -->
  <circle cx="512" cy="560" r="138" fill="#0d1f16"/>
  <circle cx="512" cy="560" r="110" fill="#0f2a1c"/>
  <circle cx="512" cy="560" r="80" fill="#0a1a10"/>

  <!-- Aperture center -->
  <circle cx="512" cy="560" r="62" fill="#081410"/>

  <!-- Lens reflection -->
  <ellipse cx="480" cy="530" rx="28" ry="18" fill="#ffffff" opacity="0.1" transform="rotate(-30 480 530)"/>
  <ellipse cx="496" cy="516" rx="10" ry="6" fill="#ffffff" opacity="0.18" transform="rotate(-30 496 516)"/>

  <!-- Top detail bar -->
  <rect x="200" y="358" width="100" height="16" rx="8" fill="#3d7a52"/>

  <!-- Indicator light - bright green -->
  <circle cx="240" cy="400" r="14" fill="#4ade80" opacity="0.9"/>
</svg>'''

import os

out_dir = '/Users/chris.litster/Library/CloudStorage/OneDrive-SumeruEquityPartners/Desktop/AskFuji/assets'
svg_path = os.path.join(out_dir, 'icon.svg')

with open(svg_path, 'w') as f:
    f.write(SVG)

print(f'SVG written to {svg_path}')
print('Open it in a browser to preview, then tell me if you want adjustments.')
print('Once approved, run: pip3 install cairosvg pillow  →  to export PNGs')
