import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          // Stable runtimes can stay cached when portfolio content changes.
          includeDependenciesRecursively: false,
          groups: [
            { name: 'react-runtime', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'motion-runtime', test: /node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/ },
            { name: 'gsap-runtime', test: /node_modules[\\/](gsap|@gsap)[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    // Saved worktrees contain older copies of tests, not this application's suite.
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
})
