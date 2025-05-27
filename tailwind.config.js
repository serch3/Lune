module.exports = {
  darkMode: 'media',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'vs-light-hover': '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    },
  },
};