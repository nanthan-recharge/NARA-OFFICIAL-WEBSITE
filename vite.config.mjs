import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom')
    },
    dedupe: ['react', 'react-dom']
  },
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
    sourcemap: false,
    minify: 'terser',
    target: 'es2020',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React — cached long-term
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Firebase — only loaded when auth/firestore needed
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/functions'],
          // 3D — only loaded on pages that need it
          '3d-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Charts — only loaded on data pages
          'charts-vendor': ['recharts', 'd3'],
          // Maps — only loaded on map pages
          'maps-vendor': ['leaflet', 'react-leaflet'],
          // Animation lib — separate from icons
          'motion-vendor': ['framer-motion'],
          // Icons — tree-shaken, separate chunk
          'icons-vendor': ['lucide-react'],
          // i18n — needed on every page but cacheable
          'i18n-vendor': ['i18next', 'react-i18next'],
        },
        // Optimize asset naming for long-term caching
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    },
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  plugins: [
    tsconfigPaths(),
    react()
  ],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'framer-motion',
      'i18next',
      'react-i18next'
    ],
    exclude: ['three', '@react-three/fiber', '@react-three/drei']
  }
});
