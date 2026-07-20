import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const adsDir = join(root, "public/ads");
mkdirSync(adsDir, { recursive: true });

const python = spawnSync("python3", ["-"], {
  cwd: root,
  input: `
from PIL import Image, ImageDraw, ImageFont
import os

OUT = ${JSON.stringify(adsDir)}
os.makedirs(OUT, exist_ok=True)

try:
    font_b = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
    font_m = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
    font_s = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    font_xs = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 11)
except Exception:
    font_b = font_m = font_s = font_xs = ImageFont.load_default()

def draw_yfc(w, h, cta="Visit YFC Solution"):
    img = Image.new("RGB", (w, h), "#0b2430")
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(h - 1, 1)
        draw.line([(0, y), (w, y)], fill=(int(11 + t * 8), int(36 + t * 18), int(48 + t * 22)))
    for x in range(0, w, 24):
        draw.line([(x, 0), (x, h)], fill=(20, 58, 70), width=1)
    for y in range(0, h, 24):
        draw.line([(0, y), (w, y)], fill=(20, 58, 70), width=1)
    draw.rounded_rectangle((12, 12, w - 12, h - 12), radius=10, outline=(45, 130, 120), width=2)
    title_font = font_b if h >= 120 else font_m
    draw.text((22, 18 if h >= 120 else 12), "YFC Solution", fill="#e8fffb", font=title_font)
    if h >= 120:
        draw.text((22, 56), "Professional Websites and Digital Solutions", fill="#ffffff", font=font_s)
        draw.text((22, 78), "Web development, software, branding and digital products", fill="#b8d9d3", font=font_xs)
        draw.rounded_rectangle((22, h - 38, min(w - 22, 220), h - 14), radius=8, fill=(15, 92, 86))
        draw.text((34, h - 33), cta, fill="#ffffff", font=font_xs)
    elif h >= 90:
        draw.text((22, 42), "Professional Websites and Digital Solutions"[:42], fill="#ffffff", font=font_xs)
        draw.rounded_rectangle((22, h - 30, min(w - 22, 180), h - 10), radius=8, fill=(15, 92, 86))
        draw.text((32, h - 25), cta, fill="#ffffff", font=font_xs)
    else:
        draw.text((14, 34), "Websites & digital products", fill="#ffffff", font=font_xs)
        draw.rounded_rectangle((14, h - 28, w - 14, h - 8), radius=6, fill=(15, 92, 86))
        draw.text((24, h - 23), cta, fill="#ffffff", font=font_xs)
    return img

for name, size in [
    ("yfc-solution-sidebar.webp", (300, 250)),
    ("yfc-solution-leaderboard.webp", (728, 90)),
    ("yfc-solution-mobile.webp", (320, 120)),
    ("yfc-solution-sidebar-secondary.webp", (300, 250)),
    ("yfc-solution-inline.webp", (640, 120)),
]:
    draw_yfc(*size).save(os.path.join(OUT, name), "WEBP", quality=90)

src = os.path.join(OUT, "slice-n-story-source.jpg")
if os.path.exists(src):
    base = Image.open(src).convert("RGB")
    bw, bh = base.size
    for fname, (tw, th) in {
        "slice-n-story-sidebar.webp": (300, 250),
        "slice-n-story-leaderboard.webp": (728, 90),
        "slice-n-story-mobile.webp": (320, 120),
    }.items():
        scale = max(tw / bw, th / bh)
        resized = base.resize((int(bw * scale), int(bh * scale)), Image.Resampling.LANCZOS)
        rw, rh = resized.size
        left = max(0, (rw - tw) // 2)
        top = max(0, (rh - th) // 2)
        resized.crop((left, top, left + tw, top + th)).save(os.path.join(OUT, fname), "WEBP", quality=88)
    print("Processed Slice n Story creatives from source photo")
else:
    print("Slice n Story source missing:", src)
`,
  encoding: "utf-8",
});

if (python.status !== 0) {
  console.error(python.stderr || python.stdout);
  process.exit(python.status ?? 1);
}

console.log(python.stdout.trim());
