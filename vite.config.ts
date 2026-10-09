import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { createEmailOtpPlugin } from './emailOtpPlugin.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      createEmailOtpPlugin({
        apiKey: env.RESEND_API_KEY || '',
        from: env.EMAIL_FROM || '',
        adminEmail: env.ADMIN_EMAIL || '',
        adminPassword: env.ADMIN_PASSWORD || '',
      }),
    ],
  }
})
