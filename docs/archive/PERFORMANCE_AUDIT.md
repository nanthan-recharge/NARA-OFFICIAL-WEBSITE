# Performance & Mobile Optimization Audit

## Current State Analysis

### Build Size Issues
- **Total Build Size**: 32MB (Large)
- **src/ Size**: 6.4MB
- **Asset Chunking**: Present but needs optimization
- **Sourcemaps**: Enabled (adds ~50% to bundle size in production)

### Critical Performance Issues

#### 1. Bundle Size Problems
- Large JavaScript chunks (111KB+ for BathymetryAdmin)
- No compression configuration visible
- Sourcemaps in production build
- Heavy dependencies: Three.js (3D), D3, Recharts, Leaflet all loaded

#### 2. Loading Strategy Issues
- All CSS imported at app level (styles/variables.css, theme-global.css, etc.)
- Google Fonts blocking render (no font-display)
- No lazy loading strategy visible
- Route-based splitting not optimized

#### 3. Mobile Performance Gaps
- No service worker/PWA optimization
- Font preconnect but no preload
- No responsive image strategy
- Heavy animations may impact mobile

### Dependencies Analysis
**Heavy Libraries** (Total: ~8MB uncompressed):
- firebase: 12.3.0 (1.2MB)
- three: 0.160.1 (600KB)
- @react-three/fiber + drei (800KB)
- d3: 7.9.0 (500KB)
- recharts: 2.15.2 (600KB)
- leaflet + react-leaflet (400KB)
- framer-motion: 12.23.16 (200KB)

## Optimization Strategy

### Phase 1: Vite Build Optimization (Immediate)
1. Code splitting & chunking strategy
2. Compression (Brotli + Gzip)
3. Remove production sourcemaps
4. Tree shaking optimization
5. CSS code splitting

### Phase 2: Asset Optimization
1. Image optimization & WebP conversion
2. Font subsetting & loading strategy
3. SVG optimization
4. Lazy loading for images

### Phase 3: Code Optimization
1. Dynamic imports for heavy features
2. Route-based lazy loading
3. Component lazy loading
4. Vendor chunk optimization

### Phase 4: Mobile Optimization
1. Responsive image loading
2. Touch event optimization
3. Mobile-first CSS approach
4. Reduced motion for mobile

### Phase 5: PWA & Caching
1. Service worker implementation
2. Offline support
3. App manifest optimization
4. Smart caching strategy

### Phase 6: Runtime Performance
1. React.memo for heavy components
2. useMemo/useCallback optimization
3. Virtual scrolling for lists
4. Intersection observer for lazy content

## Recommended Quick Wins

### 1. Vite Configuration Enhancement
- Enable compression plugins
- Optimize chunk splitting
- Remove production sourcemaps
- Configure proper caching headers

### 2. Font Optimization
- Add font-display: swap
- Subset fonts (only needed characters)
- Use system fonts as fallback
- Preload critical fonts

### 3. Lazy Loading Implementation
- React.lazy for route components
- Dynamic imports for admin panels
- Conditional loading for 3D/maps
- Defer non-critical scripts

### 4. Image Strategy
- Implement responsive images
- Add loading="lazy"
- Convert to WebP
- Use proper sizing

### 5. CSS Optimization
- Extract critical CSS
- Defer non-critical styles
- Remove unused Tailwind classes
- Optimize custom animations

## Target Metrics

### Current (Estimated)
- FCP: ~3.5s
- LCP: ~5s
- TTI: ~6s
- Bundle Size: 32MB
- Mobile Score: ~60

### Target After Optimization
- FCP: <1.5s
- LCP: <2.5s
- TTI: <3.5s
- Bundle Size: <5MB
- Mobile Score: >90

## Implementation Priority

### High Priority (Week 1)
1. Vite optimization (compression, chunking)
2. Remove production sourcemaps
3. Font optimization
4. Lazy load routes

### Medium Priority (Week 2)
1. Image optimization
2. Component lazy loading
3. CSS code splitting
4. Mobile touch optimization

### Low Priority (Week 3)
1. PWA implementation
2. Advanced caching
3. Virtual scrolling
4. Performance monitoring

