/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary':'#1976d2',
        'secondary':'#253761',
        'tertiary':'#DEEDFE',
        // 'quaternary':'#A3B3C2',
        'error':'#d32f2f',
        'success':'#4caf50',
        'warning':'#ed6c02',
        'grey':'#bdbdbd',
        'grey-50':'#f2f2f2',
        'back':'#344054',
      },
      fontFamily: {
        'kanit': ['Kanit', 'sans-serif']
      }
    },
  },
  plugins: [],
};
