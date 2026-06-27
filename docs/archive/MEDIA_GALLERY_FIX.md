# Media Gallery - Complete Fix & Setup Guide

## 🎯 What Was Fixed

### 1. **Query Issue in mediaGalleryService.js**
- **Problem**: The Firebase query was failing when documents didn't have an `approved` field
- **Solution**: Implemented fallback query strategy that:
  1. First tries to query with `approved == true` filter
  2. If that fails, queries all documents and filters in memory
  3. Properly handles errors and provides fallback data

### 2. **Enhanced Error Handling & Status Display**
- **Problem**: Users couldn't see if data was loading from Firebase or using fallback
- **Solution**: Added:
  - Connection status indicators (green for Firebase, amber for fallback)
  - Detailed error messages
  - Link to admin panel when using fallback data
  - Data source tracking (`firebase` vs `fallback`)

### 3. **Firebase Security Rules**
- **Status**: ✅ Already correctly configured
- Media collections have public read access:
  ```
  match /media_images/{imageId} {
    allow read: if true;
    allow create, update, delete: if isAdmin();
  }
  
  match /media_videos/{videoId} {
    allow read: if true;
    allow create, update, delete: if isAdmin();
  }
  ```

## 🚀 Deployment Steps

### Step 1: Deploy Firestore Rules (if not already deployed)

```bash
cd nara_digital_ocean
npx firebase deploy --only firestore:rules
```

### Step 2: Build and Deploy the Application

```bash
# Install dependencies (if needed)
npm install

# Build the project
npm run build

# Deploy to Firebase Hosting
npx firebase deploy --only hosting
```

### Step 3: Test the Media Gallery

1. **Visit the media gallery**:
   - URL: https://nara-web-73384.web.app/media-gallery

2. **Check the status indicator**:
   - 🟢 Green banner = Connected to Firebase (live data)
   - 🟡 Amber banner = Using sample data (no Firebase data found)

## 📝 How to Add Media via Admin Panel

### Step 1: Login to Admin Panel

1. Go to: https://nara-web-73384.web.app/admin/research-login
2. Login with admin credentials

### Step 2: Navigate to Media Admin

1. Go to: https://nara-web-73384.web.app/admin/media
2. You'll see two tabs: **Images** and **Videos**

### Step 3: Add New Media

#### For Images:
1. Click "Add Image" button
2. Fill in the form:
   - **Title** (required): "Marine Research Expedition 2024"
   - **Description**: "Scientists studying coral reefs..."
   - **Image URL**: Upload file or paste URL
   - **Thumbnail URL**: (optional, auto-generated from main image)
   - **Category**: Select from dropdown (research, marine-life, events, etc.)
   - **Source**: Select "NARA Official" or other
   - **Tags**: Comma-separated (research, coral, marine biology)
   - **Location**: "Galle, Sri Lanka"
   - **Date**: Select date
   - **Photographer**: "NARA Media Team"
   - **Approve immediately**: ✅ Check this to show on public gallery

3. Click "Save"

#### For Videos:
1. Click "Add Video" button
2. Fill in the form:
   - **Title** (required): "NARA 2024 Year in Review"
   - **Description**: "Highlights from our research..."
   - **Video URL** (required): YouTube or Vimeo URL
   - **Duration**: "8:45"
   - **Thumbnail URL**: Video preview image
   - **Category**, **Tags**, **Location**, **Date**: Same as images
   - **Approve immediately**: ✅ Check this

3. Click "Save"

### Step 4: Verify on Public Gallery

1. Go to: https://nara-web-73384.web.app/media-gallery
2. You should see:
   - ✅ Green banner: "Connected to live database"
   - Your media items displayed
   - Correct counts in the stats section

## 🔧 Troubleshooting

### Issue: Still seeing "Using Sample Data"

**Possible causes:**
1. No media items in Firebase
2. All media items have `approved: false`
3. Firestore rules not deployed

**Solutions:**
1. Add at least one media item via admin panel
2. Make sure "Approve immediately" is checked when adding
3. Deploy firestore rules: `npx firebase deploy --only firestore:rules`

### Issue: Can't access admin panel

**Solution:**
1. Make sure you're logged in as admin
2. Check Firebase Authentication console
3. Verify admin claims are set

### Issue: Images not uploading

**Possible causes:**
1. Storage rules not configured
2. File size too large
3. Network issues

**Solutions:**
1. Deploy storage rules: `npx firebase deploy --only storage`
2. Compress images before upload
3. Use direct URL instead of upload

## 📊 Features Now Available

### Public Gallery (https://nara-web-73384.web.app/media-gallery)
- ✅ View all approved images and videos
- ✅ Search by title, description, tags, location
- ✅ Filter by category, source, date range
- ✅ Grid and list view modes
- ✅ Detailed media modal with stats
- ✅ Favorite/like functionality
- ✅ Share and download options
- ✅ Multi-language support (EN, SI, TA)
- ✅ Connection status indicators

### Admin Panel (https://nara-web-73384.web.app/admin/media)
- ✅ Add/edit/delete images and videos
- ✅ Upload images to Firebase Storage
- ✅ Approve/unapprove media items
- ✅ Auto-scrape from social media (optional)
- ✅ Search and filter
- ✅ View approval status
- ✅ Bulk operations

## 🎨 Data Structure

### Image Document (media_images collection)
```javascript
{
  id: "auto-generated",
  title: "Marine Research Expedition",
  description: "Scientists studying coral reefs...",
  url: "https://storage.firebase.com/...",
  thumbnail: "https://storage.firebase.com/...",
  category: "research", // or marine-life, events, etc.
  source: "manual", // or social, news, partners
  sourceName: "NARA Official",
  tags: ["research", "coral", "marine biology"],
  location: "Galle, Sri Lanka",
  date: "2024-10-24",
  photographer: "NARA Media Team",
  approved: true,
  views: 0,
  likes: 0,
  createdAt: "2024-10-24T10:00:00Z",
  updatedAt: "2024-10-24T10:00:00Z"
}
```

### Video Document (media_videos collection)
```javascript
{
  id: "auto-generated",
  title: "NARA 2024 Year in Review",
  description: "Highlights from our research...",
  videoUrl: "https://www.youtube.com/watch?v=...",
  thumbnail: "https://storage.firebase.com/...",
  duration: "8:45",
  category: "research",
  source: "manual",
  sourceName: "NARA Official",
  tags: ["annual review", "highlights"],
  date: "2024-10-24",
  approved: true,
  views: 0,
  likes: 0,
  createdAt: "2024-10-24T10:00:00Z",
  updatedAt: "2024-10-24T10:00:00Z"
}
```

## 📱 Mobile Responsive

The media gallery is fully responsive and works great on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🌍 Multi-language Support

All media metadata supports three languages:
- **English (EN)** - Default
- **Sinhala (SI)** - සිංහල
- **Tamil (TA)** - தமிழ்

Translations are automatically displayed based on user's language preference.

## ✅ Next Steps

1. **Deploy the fixes**: Run the deployment commands above
2. **Add real media**: Use the admin panel to add your media
3. **Test thoroughly**: Check all features work as expected
4. **Monitor usage**: Watch Firebase console for activity
5. **Optimize**: Add more media and optimize images

## 🆘 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify Firebase console for data
3. Check security rules are deployed
4. Ensure you're logged in as admin
5. Clear cache and hard refresh (Ctrl+Shift+R)

---

**Status**: ✅ Ready to deploy and use!
**Last Updated**: October 24, 2025
