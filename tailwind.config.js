/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_layouts/**/*.html',
    './_includes/**/*.html',
    './*.html',
    './*.md',
    './_posts/**/*.md',
    './_projects/**/*.md',
    './_learnwithme/**/*.md',
    './_guides/**/*.md',
    './apps/**/*.html',
    './assets/js/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
