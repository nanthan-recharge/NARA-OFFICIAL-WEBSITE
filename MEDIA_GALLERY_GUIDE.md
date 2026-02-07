# 📸 NARA Media Gallery - Complete Guide

## 🎯 Overview

The NARA Media Gallery is a comprehensive media management system that allows NARA to showcase images and videos from multiple sources, including:
- **Manual uploads** by NARA staff
- **Automatic scraping** from Sri Lankan news websites
- **Social media integration** (Facebook, Instagram, YouTube, Twitter)
- **Partner organization content**

---

## 🌟 Features

### **Public Gallery Features**
✅ **Dual Sections**: Separate image and video galleries
✅ **Powerful Search**: Search by title, description, tags, and locations
✅ **Advanced Filtering**: Category, source, and date filters
✅ **Multiple Views**: Grid and list view modes
✅ **Interactive Cards**: Expandable cards with full details
✅ **Favorites System**: Save favorite media items
✅ **Media Modals**: Full-screen lightbox for viewing
✅ **Social Sharing**: Download and share capabilities
✅ **Responsive Design**: Mobile-optimized interface

### **Admin Panel Features**
✅ **Manual Upload**: Direct image/video upload with metadata
✅ **Auto-Scraping**: One-click scraping from all sources
✅ **Approval Workflow**: Review and approve scraped content
✅ **Bulk Management**: Edit, delete, approve multiple items
✅ **Source Tracking**: Track where each media item came from
✅ **Tag Management**: Add searchable tags
✅ **Analytics**: View counts and engagement metrics

---

## 🚀 Quick Start

### **For Public Users**

1. **Access the Gallery**
   - Go to: `https://nara-web-73384.web.app/media-gallery`
   - Or click: **About → Media Gallery** in the navigation menu

2. **Browse Media**
   - Switch between **Images** and **Videos** tabs
   - Use the search bar to find specific content
   - Apply filters by category, source, or date

3. **View Details**
   - Click any media card to open full-screen view
   - View metadata, tags, location
   - Download or share media

### **For Admin Users**

1. **Access Admin Panel**
   - Login at: `/admin/research-login`
   - Navigate to: `https://nara-web-73384.web.app/admin/media`

2. **Add Media Manually**
   - Click "Add Image" or "Add Video"
   - Fill in the form with details
   - Upload files or provide URLs
   - Approve immediately or save as pending

3. **Auto-Scrape Content**
   - Click "Auto-Scrape" button
   - Wait for the system to fetch from all sources
   - Review and approve new items

---

## 📂 Media Categories

The system supports 8 predefined categories:

1. **Research Activities** - Lab work, field studies, experiments
2. **Marine Life** - Underwater photos, wildlife, species
3. **Events & Conferences** - Seminars, meetings, workshops
4. **Facilities & Equipment** - Labs, vessels, instruments
5. **Field Work** - Ocean expeditions, data collection
6. **Conservation Efforts** - Restoration, protection projects
7. **Education & Training** - Classes, workshops, outreach
8. **Partnerships** - Collaborations, partner visits

---

## 🔗 Data Sources

### **1. Manual Uploads** (NARA Official)
- Direct uploads by NARA staff
- Full control over content
- Highest quality assurance

### **2. Social Media Integration**

#### **Facebook**
- **What it scrapes**: Photos from NARA Facebook page
- **How to configure**: Add Facebook Page ID and Access Token
- **Frequency**: Daily automatic scraping

#### **Instagram**
- **What it scrapes**: Images and videos from NARA Instagram
- **How to configure**: Add Instagram Access Token
- **Frequency**: Daily automatic scraping

#### **YouTube**
- **What it scrapes**: Videos from NARA YouTube channel
- **How to configure**: Add YouTube Channel ID and API Key
- **Frequency**: Daily automatic scraping

#### **Twitter**
- **What it scrapes**: Images from NARA Twitter posts
- **How to configure**: Add Twitter API credentials
- **Frequency**: Daily automatic scraping

### **3. News Websites**
Automatically scrapes images from:
- **Daily News Sri Lanka** - https://www.dailynews.lk
- **News First** - https://www.newsfirst.lk
- **Daily Mirror** - https://www.dailymirror.lk
- **Ada Derana** - https://www.adaderana.lk

Search terms: NARA, marine research, ocean, fisheries, aquatic resources

---

## 🔧 Technical Setup

### **1. Firebase Collections**

Two main collections store media data:

#### **media_images** Collection
```javascript
{
  id: string,
  title: string,
  description: string,
  url: string,              // Full image URL
  thumbnail: string,        // Thumbnail URL
  category: string,         // One of 8 categories
  source: string,           // 'manual', 'social', 'news', 'partners'
  sourceName: string,       // 'NARA Official', 'Facebook', etc.
  tags: string[],          // Searchable tags
  location: string,        // Geographic location
  date: string,            // ISO date
  photographer: string,    // Photo credit
  views: number,           // View count
  likes: number,           // Like count
  approved: boolean,       // Approval status
  autoScraped: boolean,    // Was it auto-scraped?
  externalId: string,      // ID from external source (prevents duplicates)
  createdAt: string,       // Timestamp
  updatedAt: string        // Timestamp
}
```

#### **media_videos** Collection
```javascript
{
  id: string,
  title: string,
  description: string,
  videoUrl: string,        // YouTube/Vimeo URL
  thumbnail: string,       // Video thumbnail
  duration: string,        // e.g., "5:30"
  category: string,
  source: string,
  sourceName: string,
  tags: string[],
  date: string,
  views: number,
  likes: number,
  approved: boolean,
  autoScraped: boolean,
  externalId: string,
  createdAt: string,
  updatedAt: string
}
```

### **2. Firestore Security Rules**

```javascript
// Public can read all media (filtering happens in frontend)
// Only admins can write
match /media_images/{imageId} {
  allow read: if true;
  allow write: if isAdmin();
}

match /media_videos/{videoId} {
  allow read: if true;
  allow write: if isAdmin();
}
```

### **3. Environment Variables**

Add to `.env` file:

```bash
# Social Media API Keys
VITE_FACEBOOK_ACCESS_TOKEN=your_facebook_token
VITE_INSTAGRAM_ACCESS_TOKEN=your_instagram_token
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_TWITTER_API_KEY=your_twitter_api_key

# Optional: Configure scraping frequency (in hours)
VITE_SCRAPING_INTERVAL=24
```

---

## 🤖 Automated Scraping

### **How It Works**

1. **Manual Trigger**: Admin clicks "Auto-Scrape" button
2. **Scheduled Trigger**: Firebase Cloud Function runs daily
3. **Scraping Process**:
   - Fetches from Facebook, Instagram, YouTube
   - Searches news websites for NARA mentions
   - Extracts media URLs and metadata
   - Checks for duplicates (using externalId)
   - Saves to Firebase with `approved: false`
4. **Admin Review**: Admin approves/rejects items
5. **Public Display**: Only approved items show in gallery

### **Setting Up Social Media APIs**

#### **Facebook Graph API**
1. Create Facebook App at https://developers.facebook.com
2. Get Page Access Token with `pages_read_engagement` permission
3. Add Page ID and Access Token to `.env`

#### **Instagram Graph API**
1. Convert Facebook App to use Instagram Graph API
2. Get Instagram Business Account Access Token
3. Add token to `.env`

#### **YouTube Data API**
1. Create project in Google Cloud Console
2. Enable YouTube Data API v3
3. Create API Key
4. Add Channel ID and API Key to `.env`

#### **Twitter API**
1. Apply for Twitter Developer Account
2. Create App and get API credentials
3. Add to `.env`

### **Backend Implementation (Firebase Cloud Function)**

Create a scheduled function to run scraping:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const { runAllScrapers } = require('./mediaScraperService');

// Run every day at 2 AM
exports.scheduledMediaScrape = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('Asia/Colombo')
  .onRun(async (context) => {
    console.log('Starting scheduled media scraping...');
    const result = await runAllScrapers();
    console.log('Scraping result:', result);
    return null;
  });
```

Deploy:
```bash
firebase deploy --only functions
```

---

## 📊 Admin Panel Usage

### **Dashboard Overview**
- **Total Images**: Count of all images
- **Total Videos**: Count of all videos
- **Approved**: Items visible to public
- **Pending**: Items awaiting approval

### **Managing Media**

#### **Add New Media**
1. Click "Add Image" or "Add Video"
2. Fill required fields:
   - **Title** (required)
   - **Description**
   - **URL** or upload file (for images)
   - **Video URL** (for videos, YouTube/Vimeo link)
   - **Category** (dropdown)
   - **Tags** (comma-separated)
   - **Location**
   - **Date**
3. Check "Approve immediately" to publish right away
4. Click "Save"

#### **Approve Scraped Content**
1. Filter by "Pending Only"
2. Review each item
3. Click eye icon (👁️) to approve
4. Click eye-off icon to unapprove

#### **Edit Media**
1. Click edit icon (✏️)
2. Modify any field
3. Click "Save"

#### **Delete Media**
1. Click trash icon (🗑️)
2. Confirm deletion
3. Item removed permanently

#### **Run Auto-Scrape**
1. Click "Auto-Scrape" button
2. Wait for progress indicator
3. Review results (shows count of new items found)
4. Approve items one by one

### **Search and Filter**
- **Search bar**: Find by title, description, or tags
- **Approval filter**: All / Approved / Pending
- **Tab switch**: Images / Videos

---

## 🎨 Public Gallery Features

### **Search Functionality**
The main search bar searches across:
- Title
- Description
- Tags
- Location
- Photographer/Source name

### **Filters**
- **Category**: Filter by 8 categories
- **Source**: NARA Official, Social Media, News, Partners
- **Date Range**: Today, Last Week, Last Month, Last Year, All Time

### **View Modes**
- **Grid View**: Cards in responsive grid layout
- **List View**: Horizontal list with more details

### **Media Cards** (Grid View)
- Thumbnail image/video preview
- Title and description
- Date and view count
- Location (if available)
- Tags (first 3 shown)
- Favorite button
- Click to open full modal

### **Media Modal** (Full View)
- Large image or embedded video
- Full description
- All metadata (date, views, likes, location)
- Photographer credit
- All tags
- Download button
- Share button
- Close button (X)

---

## 🔍 Search Algorithm

The search system uses multi-field matching:

```javascript
// Searches in these fields:
- item.title (case-insensitive)
- item.description (case-insensitive)
- item.tags (array search, case-insensitive)
- item.location (partial match)
```

**Example Searches:**
- "coral" → Finds all items with "coral" in title/description/tags
- "2024" → Finds items from 2024 or with "2024" in metadata
- "Galle" → Finds items from Galle location
- "research expedition" → Finds items matching both words

---

## 📱 Responsive Design

The gallery is fully responsive:

- **Desktop**: 3-column grid, full-width search, all filters visible
- **Tablet**: 2-column grid, collapsible filters
- **Mobile**: 1-column grid, stacked filters, optimized touch targets

---

## 🚦 Status Indicators

### **Approval Status**
- ✅ **Green checkmark**: Approved (visible to public)
- ⚠️ **Yellow warning**: Pending approval (hidden from public)

### **Source Indicators**
- 📸 **NARA Official**: Manually uploaded
- 🤖 **Auto**: Automatically scraped
- 📰 **News**: From news websites
- 📱 **Social**: From social media

---

## 🔐 Security & Privacy

### **Access Control**
- **Public Gallery**: No authentication required (approved items only)
- **Admin Panel**: Requires admin authentication
- **Firebase Rules**: Enforced at database level

### **Data Privacy**
- Only approved items are visible to public
- Scraped items require manual approval
- Source attribution is always maintained
- External links preserved for transparency

### **Content Moderation**
- All auto-scraped content starts as "pending"
- Admin must manually approve before public display
- Ability to unapprove and remove items

---

## 📈 Analytics & Metrics

### **Tracked Metrics**
- **Views**: Incremented each time media modal opens
- **Likes**: User favorites (stored in local storage)
- **Downloads**: Track download button clicks
- **Shares**: Track share button usage

### **Admin Dashboard Stats**
- Total images and videos
- Approved vs pending counts
- Source distribution
- Category distribution

---

## 🛠️ Maintenance & Updates

### **Regular Tasks**

**Daily:**
- Review newly scraped content
- Approve relevant items
- Remove inappropriate content

**Weekly:**
- Check scraping logs for errors
- Update tags for better searchability
- Add manual content from events

**Monthly:**
- Review analytics
- Update source configurations
- Check API quota usage

### **Troubleshooting**

#### **Auto-scrape not working?**
1. Check environment variables are set
2. Verify API tokens are valid
3. Check Firebase function logs
4. Ensure rate limits not exceeded

#### **Images not displaying?**
1. Verify URL is accessible
2. Check CORS settings
3. Ensure Firebase Storage rules allow read

#### **Search not finding items?**
1. Check items are approved
2. Verify tags are properly formatted
3. Ensure search query is correct

---

## 🎓 Best Practices

### **For Content Creators**

1. **Write descriptive titles** - Make them searchable
2. **Add detailed descriptions** - Include context
3. **Use relevant tags** - 5-10 tags per item
4. **Include locations** - Always add if applicable
5. **Give photo credits** - Acknowledge photographers
6. **Approve quality content** - Maintain high standards

### **For Administrators**

1. **Review daily** - Check new scraped content
2. **Maintain consistency** - Use standard tagging conventions
3. **Update regularly** - Keep gallery fresh with new content
4. **Monitor performance** - Check for slow loading
5. **Backup regularly** - Export Firebase data periodically

---

## 📞 Support & Resources

### **File Locations**
- **Public Gallery**: `/src/pages/media-gallery/index.jsx`
- **Admin Panel**: `/src/pages/admin/MediaAdmin.jsx`
- **Scraper Service**: `/src/services/mediaScraperService.js`
- **Routes**: `/src/Routes.jsx`
- **Navbar**: `/src/components/ui/ThemeNavbar.jsx`
- **Firestore Rules**: `/research-firestore.rules`

### **Key Dependencies**
- `framer-motion` - Animations
- `lucide-react` - Icons
- `firebase` - Backend and storage
- `axios` - HTTP requests for scraping

### **Useful Commands**
```bash
# Start dev server
npm start

# Build for production
npm run build

# Deploy to Firebase
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only hosting
firebase deploy --only hosting

# Deploy only firestore rules
firebase deploy --only firestore:rules
```

---

## 🎉 Success Metrics

The Media Gallery is successful when:

✅ Users can easily find relevant media
✅ Gallery is updated regularly (daily/weekly)
✅ Auto-scraping reduces manual work
✅ Content is well-organized and tagged
✅ Public engagement is high (views, downloads)
✅ Admin workflow is efficient

---

## 🚀 Future Enhancements

Potential improvements:

1. **AI-Powered Tagging**: Auto-generate tags from images
2. **Video Upload**: Direct video file uploads (not just URLs)
3. **Advanced Analytics**: Detailed engagement metrics
4. **Batch Operations**: Approve/edit multiple items at once
5. **Public Contributions**: Allow users to submit media
6. **Collections**: Create curated media collections
7. **Export Features**: Download filtered sets as zip
8. **Integration**: Connect with other NARA systems

---

## 📝 Quick Reference

### **URLs**
- Public Gallery: `/media-gallery`
- Admin Panel: `/admin/media`
- Admin Login: `/admin/research-login`

### **Collections**
- Images: `media_images`
- Videos: `media_videos`

### **Key Functions**
- `runAllScrapers()` - Run all scrapers
- `saveScrapedMedia()` - Save to Firebase
- `loadMedia()` - Load from Firebase

---

**Built with ❤️ by NARA Digital Team**
**Last Updated**: October 2024
**Version**: 1.0.0
