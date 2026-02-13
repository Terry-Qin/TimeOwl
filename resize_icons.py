from PIL import Image
import os

source_path = "C:/Users/terry/.gemini/antigravity/brain/c900e878-f6c6-4e6a-81b5-cb312708fbff/timeowl_icon_1770904928933.png"
target_dir = "c:/code/personal/FocusGuard AI/TimeOwl/public/icons"

sizes = [16, 48, 128]

if not os.path.exists(target_dir):
    os.makedirs(target_dir)

try:
    img = Image.open(source_path)
    for size in sizes:
        resized_img = img.resize((size, size), Image.LANCZOS)
        target_path = os.path.join(target_dir, f"icon{size}.png")
        resized_img.save(target_path)
        print(f"Resized {source_path} to {size}x{size} -> {target_path}")
except Exception as e:
    print(f"Error resizing icons: {e}")
