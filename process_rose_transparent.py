import os
from PIL import Image, ImageFilter, ImageDraw

def main():
    img_path = r"c:\Users\Owner\Desktop\HP制作関連\raffinee\images\イメージ1.png"
    out_path = r"c:\Users\Owner\Desktop\HP制作関連\raffinee\images\isolated_pink_rose.png"

    if not os.path.exists(img_path):
        print(f"Error: Input file {img_path} not found.")
        return

    # Open image
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    print(f"Image size: {width}x{height}")

    # Center and radius for the rose
    cx = width * 0.49
    cy = height * 0.50
    r = min(width, height) * 0.38  # Sized to capture the main pink rose and exclude outer elements

    # Step 1: Create a binary mask of the pink rose
    # Start with 0 (transparent)
    mask = Image.new("L", (width, height), 0)
    pixels_mask = mask.load()
    pixels_img = img.load()

    for y in range(height):
        for x in range(width):
            dx = x - cx
            dy = y - cy
            dist = (dx*dx + dy*dy) ** 0.5
            
            if dist <= r:
                r_val, g_val, b_val, a_val = pixels_img[x, y]
                # Pink color heuristic:
                # - Red must be dominant: R > G and R > B
                # - R - G must be substantial (green leaves and white background have small difference)
                # - R - B must be substantial or at least positive
                # - R must be bright enough
                is_pink = (r_val > 110) and (r_val - g_val > 28) and (r_val - b_val > 20)
                
                # Also include very dark shadowed pink areas in the deep center
                is_dark_pink = (r_val > 70) and (r_val - g_val > 25) and (r_val - b_val > 15)
                
                if is_pink or is_dark_pink:
                    pixels_mask[x, y] = 255

    # Step 2: Fill internal holes in the mask
    # We do a flood fill from the borders of the mask (which are 0) to find all connected background pixels
    # Copy mask for flood fill
    flood_mask = mask.copy()
    # Flood fill from the 4 corners to find external background
    ImageDraw.floodfill(flood_mask, (0, 0), 127)
    ImageDraw.floodfill(flood_mask, (width - 1, 0), 127)
    ImageDraw.floodfill(flood_mask, (0, height - 1), 127)
    ImageDraw.floodfill(flood_mask, (width - 1, height - 1), 127)
    
    # Any pixel in the original mask area that was NOT reached by the flood fill (i.e. remains 0)
    # is an internal hole, so we fill it.
    pixels_flood = flood_mask.load()
    for y in range(height):
        for x in range(width):
            if pixels_flood[x, y] == 0:
                pixels_mask[x, y] = 255

    # Step 3: Smooth the mask using Gaussian Blur to get a beautiful feathered edge
    # This removes any pixelated or jagged boundaries
    smooth_mask = mask.filter(ImageFilter.GaussianBlur(radius=4))

    # Step 4: Apply the smooth mask as the alpha channel
    img_transparent = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    img_transparent.paste(img, (0, 0), mask=smooth_mask)

    # Step 5: Crop to the bounding box of the rose (centered around cx, cy with radius r + feather padding)
    pad = 20
    left = max(0, int(cx - r - pad))
    top = max(0, int(cy - r - pad))
    right = min(width, int(cx + r + pad))
    bottom = min(height, int(cy + r + pad))
    
    img_cropped = img_transparent.crop((left, top, right, bottom))

    # Save as high-quality transparent PNG
    img_cropped.save(out_path, "PNG")
    print(f"Successfully processed and saved isolated transparent rose to {out_path}!")

if __name__ == "__main__":
    main()
