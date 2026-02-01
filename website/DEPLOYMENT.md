# VaultSio Website Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Netlify (Recommended - Easiest)

1. **Via Netlify Drop**
   - Go to [Netlify Drop](https://app.netlify.com/drop)
   - Drag and drop the entire `website` folder
   - Your site will be live instantly!
   - Custom domain: Site settings → Domain management → Add custom domain → `vaultsio.com`

2. **Via Netlify CLI**
   ```bash
   cd website
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### Option 2: Vercel

1. **Via Vercel CLI**
   ```bash
   cd website
   npm install -g vercel
   vercel --prod
   ```

2. **Via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Import your project
   - Deploy

### Option 3: GitHub Pages

1. **Setup**
   ```bash
   # Create a new repository on GitHub
   cd website
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/vaultsio-website.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: / (root)
   - Save

3. **Custom Domain**
   - Add a `CNAME` file with content: `vaultsio.com`
   - In repository settings, add custom domain: `vaultsio.com`

### Option 4: Traditional Hosting (cPanel, etc.)

1. **Connect via FTP**
   - Host: Your hosting provider's FTP address
   - Username: Your FTP username
   - Password: Your FTP password

2. **Upload Files**
   - Upload all files from the `website` folder to `public_html` or `www`
   - Ensure `index.html` is in the root directory

3. **File Permissions**
   ```bash
   # HTML files: 644
   # Folders: 755
   ```

## 🌐 Domain Configuration

### DNS Settings for vaultsio.com

#### For Netlify:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: [your-site].netlify.app
```

#### For Vercel:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### For GitHub Pages:
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153

Type: CNAME
Name: www
Value: yourusername.github.io
```

## 🔒 SSL Certificate

Most platforms provide free SSL automatically:
- **Netlify**: Automatic Let's Encrypt SSL
- **Vercel**: Automatic SSL
- **GitHub Pages**: Automatic SSL (check "Enforce HTTPS")
- **cPanel**: Use Let's Encrypt from SSL/TLS section

## ⚡ Performance Optimization

### Before Deployment

1. **Optimize Images**
   ```bash
   # Install imageoptim-cli
   npm install -g imageoptim-cli
   
   # Optimize images
   cd website/assets/images
   imageoptim *.png *.jpg
   ```

2. **Minify CSS & JS** (Optional for production)
   ```bash
   # Install minifiers
   npm install -g clean-css-cli uglify-js
   
   # Minify CSS
   cd website/css
   cleancss style.css -o style.min.css
   
   # Minify JS
   cd ../js
   uglifyjs main.js -o main.min.js -c -m
   ```
   
   Then update `index.html` to reference `.min.css` and `.min.js`

3. **Enable Compression**
   - Most platforms enable gzip automatically
   - For traditional hosting, add to `.htaccess`:
   ```apache
   <IfModule mod_deflate.c>
     AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
   </IfModule>
   ```

## 📊 Analytics Setup

### Google Analytics
1. Get your tracking ID from [Google Analytics](https://analytics.google.com)
2. Add before `</head>` in `index.html`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

## 🔍 SEO Checklist

- [x] Meta tags configured
- [x] robots.txt present
- [ ] sitemap.xml (create if needed)
- [ ] Google Search Console verification
- [ ] Social media meta tags (Open Graph)
- [ ] Schema.org markup (optional)

### Submit to Search Engines
1. **Google**: [Google Search Console](https://search.google.com/search-console)
2. **Bing**: [Bing Webmaster Tools](https://www.bing.com/webmasters)

## 🔧 Post-Deployment Checklist

- [ ] Test on multiple devices (mobile, tablet, desktop)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Check all links work
- [ ] Test contact form
- [ ] Verify SSL certificate
- [ ] Test page load speed ([PageSpeed Insights](https://pagespeed.web.dev/))
- [ ] Check mobile responsiveness
- [ ] Verify meta tags ([metatags.io](https://metatags.io/))
- [ ] Test accessibility ([WAVE](https://wave.webaim.org/))

## 🛠️ Troubleshooting

### Site Not Loading
- Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net/)
- Clear browser cache
- Try incognito mode

### CSS/JS Not Loading
- Check file paths are correct (use relative paths)
- Verify files uploaded correctly
- Check browser console for errors

### Contact Form Not Working
- Implement backend (see backend options below)
- Or use form services: Formspree, Netlify Forms, etc.

## 📧 Contact Form Backend Options

### Netlify Forms (Easiest for Netlify hosting)
Add to form tag:
```html
<form name="contact" method="POST" data-netlify="true">
```

### Formspree
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Custom Backend
- Create serverless function
- Use services like SendGrid, Mailgun for email

## 📱 Progressive Web App (PWA) - Optional

Create `manifest.json`:
```json
{
  "name": "VaultSio",
  "short_name": "VaultSio",
  "description": "Smart Expense Tracking",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#6366f1",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/assets/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/images/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Add to `<head>`:
```html
<link rel="manifest" href="/manifest.json">
```

## 🔄 Continuous Deployment

### Netlify/Vercel with Git
Once connected to GitHub:
- Every push to main branch auto-deploys
- Preview deployments for pull requests
- Rollback to previous versions easily

## 📞 Support

Need help with deployment?
- Email: support@vaultsio.com
- Documentation: Check README.md

---

**Good luck with your deployment! 🚀**
