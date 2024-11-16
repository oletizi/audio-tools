import type { Config } from 'tailwindcss'
export default {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
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

