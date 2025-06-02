import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({

server: {
     host: '0.0.0.0', // Escucha en todas las interfaces de red
     port: 5173, // Puerto (puedes cambiarlo si es necesario)
    open: true, // Abre automáticamente en el navegador en la máquina local
     proxy: {
       '/api': {
         target: 'http://192.168.1.26:5173',
         changeOrigin: true,
         rewrite: (path) => path.replace(/^\/api/, '')
       }
     },
 
   },
  plugins: [react()],
})


