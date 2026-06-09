// @ts-check
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  output: 'static',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['100 900'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Noto Sans HK',
      cssVariable: '--font-noto-sans-hk',
      weights: ['100 900'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Noto Sans SC',
      cssVariable: '--font-noto-sans-sc',
      weights: ['100 900'],
    },
  ],
})
