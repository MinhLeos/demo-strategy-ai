# 🔧 Clear Cache Guide

## Vấn đề
Service Worker đang cache phiên bản cũ của HTML/CSS files, dẫn đến thay đổi không hiển thị.

## Đã sửa
✅ **Service Worker (sw.js)**:
1. **Cache version**: `4mgi-v1` → `4mgi-v3`
2. **Fetch strategy**: Cache-first → **Network-first with cache fallback**

**Trước (Cache-First - BAD)**:
```javascript
// Return cached version OR fetch from network
return response || fetch(event.request);
```

**Sau (Network-First - GOOD)**:
```javascript
// Try network first, update cache, fallback to cache if offline
fetch(event.request)
  .then(response => {
    // Update cache with fresh response
    cache.put(event.request, response.clone());
    return response;
  })
  .catch(() => caches.match(event.request)) // Fallback to cache
```

## Cách Clear Cache

### Phương pháp 1: Hard Reload (KHUYẾN NGHỊ)
1. Mở trình duyệt
2. Bấm **Ctrl + Shift + R** (Windows) hoặc **Cmd + Shift + R** (Mac)
3. Hoặc **Ctrl + F5**

### Phương pháp 2: Clear Site Data (HOÀN TOÀN)
**Chrome/Edge:**
1. Mở DevTools: **F12**
2. Tab **Application**
3. Sidebar trái: **Storage** → **Clear site data**
4. Check tất cả boxes:
   - ✅ Unregister service workers
   - ✅ Local and session storage
   - ✅ IndexedDB
   - ✅ Web SQL
   - ✅ Cache storage
5. Click **Clear site data**
6. Reload: **Ctrl + Shift + R**

**Firefox:**
1. Mở DevTools: **F12**
2. Tab **Storage**
3. Right-click → **Delete All**
4. Tab **Service Workers** → Click **Unregister**
5. Reload: **Ctrl + Shift + R**

### Phương pháp 3: Unregister Service Worker
**Console JavaScript:**
```javascript
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
    console.log('Service Worker unregistered');
  }
});
```

Sau đó reload: **Ctrl + Shift + R**

### Phương pháp 4: Clear Browser Cache
**Chrome/Edge:**
1. **Ctrl + Shift + Delete**
2. Time range: **All time**
3. Check: **Cached images and files**
4. Click **Clear data**

## Kiểm tra Cache Đã Clear
**Chrome DevTools:**
1. **F12** → Tab **Application**
2. Sidebar: **Cache Storage**
3. Xem cache name: Phải là **`4mgi-v3`** (mới)
4. Nếu còn **`4mgi-v1`** hoặc **`4mgi-v2`** → Clear lại

**Network Tab:**
1. **F12** → Tab **Network**
2. Reload page
3. Xem column **Size**:
   - Nếu thấy **`(from ServiceWorker)`** hoặc **`(disk cache)`** → Vẫn cache cũ
   - Nếu thấy size thực (vd: `45.2 KB`) → Đã fetch mới ✅

## Prevent Cache Issues (Development)

### Option 1: Disable Cache in DevTools
1. **F12** → Tab **Network**
2. Check ✅ **Disable cache** (checkbox ở trên)
3. Keep DevTools open

### Option 2: Add Cache Busting Query Strings
Đã thêm `?v=2` vào tất cả CSS links:
```html
<link rel="stylesheet" href="./style.css?v=2">
```

Mỗi lần update CSS, tăng version:
- `?v=2` → `?v=3` → `?v=4`...

### Option 3: Incognito/Private Mode
- Chrome: **Ctrl + Shift + N**
- Firefox: **Ctrl + Shift + P**
- Edge: **Ctrl + Shift + N**

Service Worker sẽ install mới mỗi session.

## Production Strategy

### Network-First Strategy (Hiện tại)
✅ **Ưu điểm**:
- Luôn có phiên bản mới nhất
- Cache tự động update
- Offline fallback vẫn hoạt động

⚠️ **Nhược điểm**:
- Cần network cho mỗi request
- Chậm hơn cache-first

### Hybrid Strategy (Nâng cao)
```javascript
// Static assets (images, fonts): Cache-first
// HTML/CSS/JS: Network-first
if (event.request.destination === 'image' || 
    event.request.destination === 'font') {
  // Cache-first for static assets
  return caches.match(event.request) || fetch(event.request);
} else {
  // Network-first for HTML/CSS/JS
  return fetch(event.request).catch(() => caches.match(event.request));
}
```

## Test Steps
1. ✅ Unregister old Service Worker
2. ✅ Clear cache storage
3. ✅ Hard reload (Ctrl + Shift + R)
4. ✅ Check cache version = `4mgi-v3`
5. ✅ Check CSS changes visible
6. ✅ Check sidebar fixed position working

## Cache Version History
- `4mgi-v1`: Initial cache (cache-first) ❌
- `4mgi-v2`: (skipped)
- `4mgi-v3`: Network-first strategy ✅

## Notes
- Service Worker chỉ hoạt động trên **HTTPS** hoặc **localhost**
- Cache strategy phải balance giữa **freshness** và **performance**
- Development: Dùng "Disable cache" trong DevTools
- Production: Dùng versioning (`?v=3`) và network-first

---

**Last Updated**: 2025-10-07
**Cache Version**: v3
**Strategy**: Network-first with offline fallback
