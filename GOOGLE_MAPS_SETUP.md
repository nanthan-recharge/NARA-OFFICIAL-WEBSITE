# Google Maps Integration Setup

The NARA Digital Ocean app now uses Google Maps JavaScript API to display Sri Lanka's 200 nautical mile Exclusive Economic Zone (EEZ) with bright cyan highlighting in the hero sections.

## API Key Setup

### Option 1: Using Environment Variable (Recommended for Production)
1. Create a `.env` file in `nara_digital_ocean/` root directory
2. Add your Google Maps API key:
   ```
   VITE_GOOGLE_MAPS_KEY=YOUR_API_KEY_HERE
   ```

### Option 2: Fallback API Key
The component uses a fallback API key if no environment variable is set. This is fine for development but should be replaced for production.

## Getting a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Maps JavaScript API** and **Geocoding API**
4. Create credentials (API Key)
5. Restrict the API key:
   - **Application restrictions**: HTTP referrers
   - **API restrictions**: Maps JavaScript API, Geocoding API
   - **Website restrictions**: Add your domains (e.g., `nara-web-73384.web.app/*`)

## Features Implemented

### Interactive Google Map
- **Dark ocean theme** matching NARA design system
- **200nm EEZ circle** around Sri Lanka with bright cyan glow
- **Animated pulsing effect** on the EEZ highlight
- **Research station markers** at key locations (Colombo, Jaffna, Trincomalee, Galle)
- **Gesture disabled** for static hero presentation
- **Lazy loading** for performance

### Components Updated
- `src/components/SriLankaEEZMap.jsx` - New map component
- `src/pages/ocean-intelligence-dashboard-homepage/components/HeroSection.jsx` - Integrated map
- `src/pages/ocean-intelligence-dashboard-homepage/NewHomePage.jsx` - Integrated map with NARA logo overlay

## Map Styling

The map uses custom dark ocean styling to match the NARA aesthetic:
- Deep blue ocean (#001e3c)
- Subtle land coloring (#132f4c)
- Cyan borders and EEZ highlights (#22d3ee, #06b6d4)
- Research stations with orange markers (#f97316)

## Performance Notes

- Map loads asynchronously to avoid blocking initial render
- Falls back to "Loading sovereign waters..." message during load
- Error handling displays fallback message if API fails
- No scroll/drag/zoom gestures in hero to maintain static presentation
