import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Expose on the LAN so a real TV / set-top browser can open the dev server.
    host: true,
    open: true,
  },
});
