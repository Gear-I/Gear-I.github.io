import { defineConfig } from 'astro/config';

// Update 'site' to your GitHub Pages URL: https://<your-username>.github.io
// If deploying to https://Gear-I.github.io/ (user site), keep base as '/'
// If deploying to a project site like https://Gear-I.github.io/portfolio, set base: '/portfolio'
export default defineConfig({
  site: 'https://Gear-I.github.io',
  base: '/',
  output: 'static',
});
