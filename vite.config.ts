import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins:[react()],
  base:'/new-prakash-radio-service-galaxy/',
  build:{rollupOptions:{output:{manualChunks(id){
    if(id.includes('/node_modules/three/'))return 'three-vendor';
    if(id.includes('/node_modules/@react-three/')||id.includes('/node_modules/three-stdlib/'))return 'r3f-vendor';
    if(id.includes('/node_modules/react/')||id.includes('/node_modules/react-dom/'))return 'react-vendor';
  }}}}
});
