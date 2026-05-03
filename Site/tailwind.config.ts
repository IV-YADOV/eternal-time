import type { Config } from "tailwindcss";


export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Добавил на случай, если есть папка src
  ],
  theme: {
    extend: {
      // Настройка темы для Typography (Markdown контент)
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch', // Чуть шире стандартного для удобства чтения
            'h1, h2, h3, h4': {
              fontWeight: '900',
              letterSpacing: '-0.02em',
            },
            a: {
              color: '#f59e0b', // amber-500
              textDecoration: 'none',
              fontWeight: '700',
              '&:hover': {
                color: '#d97706', // amber-600
                textDecoration: 'underline',
              },
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: '#3f3f46', // zinc-700
              borderLeftColor: '#f59e0b', // amber-500
              backgroundColor: '#fafafa', // zinc-50
              padding: '0.5rem 1.5rem',
              borderRadius: '0 1rem 1rem 0',
            },
            code: {
              color: '#ec4899', // pink-500 для кода
              backgroundColor: '#f4f4f5', // zinc-100
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
      },
    },
  },
  plugins: [
    // Самый важный плагин для отображения Markdown
    require("@tailwindcss/typography"),
    // Дополнительный плагин для красивых форм (опционально, полезно для админки)
    require("@tailwindcss/forms"),
  ],
} satisfies Config;