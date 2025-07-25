/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    // Asegúrate de que esta línea sea exactamente así:
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};