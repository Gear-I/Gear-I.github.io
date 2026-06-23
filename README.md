# Dielle De Noon — Portfolio

Personal cybersecurity portfolio site built with [Astro](https://astro.build/), hosted on GitHub Pages.

## 🚀 Setup

### 1. Clone and install

```bash
git clone https://github.com/Gear-I/<repo-name>.git
cd <repo-name>
npm install
```

### 2. Local development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321)

### 3. Deploy to GitHub Pages

**Option A — User site (recommended)**
Create a repo named `Gear-I.github.io`. Push to `main`. The GitHub Actions workflow deploys automatically.

**Option B — Project site**
Create any repo (e.g. `portfolio`). In `astro.config.mjs`, set:
```js
base: '/portfolio',
```
Then push to `main`.

### 4. Enable GitHub Pages in repo settings

1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the workflow will handle the rest

## ✏️ Customization

- Edit **`src/pages/index.astro`** to update content, projects, certifications
- Add a profile photo to `public/imgs/` and reference it in the hero section
- Update `astro.config.mjs` with your actual GitHub Pages URL

## 📁 Structure

```
dielle-portfolio/
├── .github/workflows/deploy.yml   # GitHub Actions CI/CD
├── astro.config.mjs               # Astro config with site URL
├── public/
│   ├── favicon.svg
│   └── imgs/                      # Place your images here
└── src/
    ├── layouts/Layout.astro       # HTML shell, global CSS
    └── pages/index.astro          # Main portfolio page
```
