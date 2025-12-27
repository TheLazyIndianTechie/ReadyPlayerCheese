# Quick Start Guide

## 🚀 Launch the Application

### Option 1: Direct Open (Fastest)
Simply open `index.html` in your web browser:
```bash
open index.html  # macOS
# or
start index.html  # Windows
# or
firefox index.html  # Linux
```

### Option 2: Local Server (Recommended)
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if installed)
npx http-server

# Then visit: http://localhost:8000
```

## 📋 First Steps

1. **Load an Avatar**
   - Avatar ID is pre-populated with an example: `64e3055495439dfcf3f0b665`
   - Click "Preview Avatar" to load it

2. **Customize**
   - Select a pose (Power Stance, Relaxed, Standing, Thumbs Up)
   - Choose an expression (Happy, LOL, Sad, Scared, Rage)
   - Adjust camera angle (Portrait, Full Body, Fit)
   - Change image size (64×64 to 1024×1024)
   - Switch format (PNG or JPG)
   - Adjust quality if JPG (0-100)
   - Pick a background color or make it transparent

3. **Download Single Avatar**
   - After preview loads, click "Download PNG" or "Download JPG"
   - Image saves to your downloads folder

4. **Download All Combinations**
   - Click "Get All Poses"
   - Confirm in the dialog
   - Wait for progress (usually ~2 minutes)
   - ZIP file downloads with all 30 combinations

## 🎨 Using Your Own Avatar

To use your own ReadyPlayerMe avatar:
1. Get your Avatar ID from ReadyPlayerMe (24-character hex string)
2. Replace the example ID in the input field
3. Or append it to the URL:
   ```
   file:///path/to/index.html?avatarId=YOUR_ID_HERE
   ```

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Preview Avatar | Click button or Tab + Enter |
| Download | Ctrl+S or Cmd+S |
| Copy URL | Click "Copy" button |
| Clear ID | Click X button |

## 🖥️ Responsive Behavior

The app automatically adapts to screen size:
- **Desktop** (1024px+): Two-column layout
- **Tablet** (768-1024px): Single-column
- **Mobile** (<768px): Single-column with horizontal buttons

Test on your device by opening in mobile browser or using device emulation (F12).

## 📊 Understanding the Bulk Download

**30 Images** = 5 Poses × 6 Expressions
- Pose options: Default, Power Stance, Relaxed, Standing, Thumbs Up
- Expression options: Neutral, Happy, LOL, Sad, Scared, Rage

**Example filenames in ZIP:**
```
pose-default_expression-neutral.png
pose-power-stance_expression-happy.png
pose-thumbs-up_expression-rage.png
...
```

**Size estimates:**
- 512×512 PNG: ~1MB per image = ~30MB total
- 512×512 JPG: ~0.2MB per image = ~6MB total
- 1024×1024 PNG: ~4MB per image = ~120MB total

## 🐛 Troubleshooting

### Avatar not loading?
- Check the Avatar ID (must be 24 hexadecimal characters)
- Verify internet connection
- Try refreshing the page

### Download not starting?
- Check browser download settings
- Try a different browser
- Disable pop-up blockers

### ZIP file incomplete?
- Some images may have failed (see error message)
- ZIP is still created with successful images
- Retry for individual images

### Mobile layout not working?
- Check viewport meta tag (should auto-resize)
- Try zooming out
- Rotate device for better view

### API URL not copying?
- Ensure clipboard permissions are enabled
- Try manually selecting and copying

## 📱 Mobile Tips

1. **Best Experience**: Landscape orientation for preview
2. **Touch**: All buttons are 44×44px or larger
3. **Slow Connection**: Start with smaller sizes (64×64, 256×256)
4. **Bulk Download**: Will take longer on slow connections

## 💡 Tips & Tricks

1. **Preview Grid**: Check different poses/expressions quickly
2. **Save Configurations**: Bookmark URLs with desired settings
3. **Bulk Download**: Start overnight for large image sizes
4. **Color Matching**: Use color picker to match your brand

## 🔗 Useful Links

- [ReadyPlayerMe Docs](https://docs.readyplayer.me)
- [Avatar Creator](https://readyplayer.me/create)
- [API Reference](https://docs.readyplayer.me/api-reference)

## ⚡ Performance Tips

- **Faster Previews**: Reduce image size to 256×256
- **Faster Downloads**: Use JPG format (smaller files)
- **Better Quality**: Use PNG for transparency, 512×512 minimum

## 📝 File Details

| File | Size | Purpose |
|------|------|---------|
| index.html | 16 KB | Main structure |
| css/styles.css | 20 KB | Styling & layout |
| js/app.js | 20 KB | Application logic |
| **Total** | **~56 KB** | (Gzip: ~16 KB) |

**External Libraries (CDN):**
- JSZip (3.10.1) - ZIP creation
- FileSaver.js (2.0.5) - Download handling

## 🎯 Common Use Cases

### Case 1: One Avatar, Many Poses
1. Load avatar
2. Select different poses
3. Download each preview

### Case 2: Marketing Materials
1. Use bulk download for all combinations
2. Extract ZIP
3. Pick best images for campaign

### Case 3: Game Development
1. Use as placeholder avatars
2. Download custom sizes
3. Test with your UI

### Case 4: Social Media
1. Download portrait mode
2. Adjust background color
3. Use in profile/posts

---

**Ready to go!** Open `index.html` and start creating. 🚀
