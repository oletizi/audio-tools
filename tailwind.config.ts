import type { Config } from 'tailwindcss'
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  fontFamily: {
    sans: ['Inter', 'sans-serif']
  },
  plugins: [],
} satisfies Config

