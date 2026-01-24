import os
import re
import json
import shutil

SOURCE_FILE = os.path.join("playlist", "source.m3u")
OUTPUT_DIR = os.path.join("web", "data")

def clean_text(text):
    if not text: return ""
    return re.sub(r'[^\x20-\x7E]', '', text).strip()

def extract_id(url):
    clean = url.strip()
    if "/" in clean:
        seg = clean.rsplit("/", 1)[-1]
        if '.' in seg and len(seg.split('.')[-1]) <= 4:
             seg = seg.rsplit('.', 1)[0]
        return seg
    return clean

def build():
    if not os.path.exists(SOURCE_FILE):
        return

    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR)
    
    with open(SOURCE_FILE, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()

    categories = {}
    category_index = []

    current_group = "Uncategorized"
    current_name = None
    current_logo = ""

    for line in lines:
        line = line.strip()
        if not line: continue

        if line.startswith("#EXTINF"):
            grp_m = re.search(r'group-title="([^"]+)"', line)
            current_group = clean_text(grp_m.group(1)) if grp_m else "Uncategorized"
            
            logo_m = re.search(r'tvg-logo="([^"]+)"', line)
            current_logo = logo_m.group(1) if logo_m else ""
            
            name_parts = line.rsplit(',', 1)
            current_name = clean_text(name_parts[-1]) if len(name_parts) > 1 else "Unknown"

        elif not line.startswith("#"):
            if current_name:
                obj = {"n": current_name, "i": extract_id(line)}
                if current_logo: obj["l"] = current_logo
                
                if current_group not in categories:
                    categories[current_group] = []
                categories[current_group].append(obj)
                
                current_name = None
                current_logo = ""
    
    for cat, channels in categories.items():
        safe_name = re.sub(r'[<>:"/\\|?*]', '_', cat).strip() + ".json"
        
        category_index.append({
            "name": cat,
            "file": safe_name,
            "count": len(channels)
        })
        
        with open(os.path.join(OUTPUT_DIR, safe_name), "w", encoding="utf-8") as f:
            json.dump(channels, f, separators=(',', ':'))

    with open(os.path.join(OUTPUT_DIR, "index.json"), "w", encoding="utf-8") as f:
        json.dump(category_index, f)

if __name__ == "__main__":
    build()
