# Mahalaxmi Group Website

Official website for Mahalaxmi Group, a fourth-generation industrial conglomerate operating across Construction Chemicals, Mining, Logistics, and Manufacturing sectors since 1942.

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **Animations**: CSS Transitions & Keyframes
- **Forms**: React + PHP Backend (with Honeypot/Rate Limiting security)

## 🛠️ Project Setup

### Prerequisites
- Node.js (v18+)
- NPM or Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mahalaxmi-website.git
   cd mahalaxmi-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Access the site at `http://localhost:3000`.

## 📦 Build & Deployment

To build the project for production:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Deployment (Shared Hosting / cPanel)
1. Run `npm run build`.
2. Upload the contents of `dist/` to your `public_html/` directory.
3. Ensure `.htaccess` is included (it handles React routing and caching).

## 📱 Features

- **Mobile First**: Fully responsive design optimized for all screen sizes (375px+).
- **Performance Optimized**: 
  - WebP images (13MB+ savings)
  - Lazy loading
  - Non-blocking fonts
  - GZIP compression & Caching via `.htaccess`
- **SEO Ready**: 
  - Dynamic meta tags per page
  - Semantic HTML structure
  - JSON-LD structured data
- **Secure**:
  - PHP contact forms with CSRF protection, rate limiting, and honeypots.
  - CSP and Security Headers configured.

## 📁 Project Structure

```
├── public/              # Static assets (images, logos, favicon)
│   ├── images/          # Optimized WebP images
│   ├── .htaccess        # Server configuration
│   └── contact-form.php # Backend form handler
├── src/
│   ├── components/      # Reusable UI components (Navbar, Footer, SEO, etc.)
│   ├── views/           # Page views (Home, About, Divisions, Contact)
│   ├── App.jsx          # Main application logic & routing
│   └── index.css        # Global styles & Tailwind imports
├── config/              # PHP configuration (emails.php)
└── package.json         # Dependencies and scripts
```

## 📄 License
© 2024 Mahalaxmi Group. All Rights Reserved.
