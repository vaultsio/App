# VaultSio Website

A modern, responsive website for VaultSio - Smart Expense Tracking App

## 🌐 Live Website
Visit: [https://vaultsio.com](https://vaultsio.com)

## 📁 Project Structure

```
website/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # All styles and responsive design
├── js/
│   └── main.js        # JavaScript functionality
├── assets/
│   ├── images/        # Images and graphics
│   └── fonts/         # Custom fonts (if any)
└── README.md          # This file
```

## ✨ Features

- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Modern Design**: Clean, professional UI with smooth animations
- **Fast Loading**: Optimized for performance
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Accessible**: WCAG compliant with proper ARIA labels
- **Interactive**: Smooth scrolling, parallax effects, and engaging animations

## 🎨 Sections

1. **Hero Section**: Eye-catching landing area with CTA buttons
2. **Features**: Showcase of app capabilities
3. **How It Works**: Step-by-step guide
4. **Pricing**: Transparent pricing plans
5. **Download**: App store links
6. **About**: Company information
7. **Contact**: Contact form and information
8. **Footer**: Links and social media

## 🚀 Quick Start

### Local Development

1. Clone or download the website folder
2. Open `index.html` in your browser
3. That's it! No build process required.

### Using a Local Server (Recommended)

```bash
# Navigate to the website folder
cd website

# Using Python 3
python3 -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 🎯 Customization Guide

### Colors
Edit the CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #6366f1;
    --primary-dark: #4f46e5;
    --secondary-color: #ec4899;
    /* ... more colors */
}
```

### Content
- Edit text content directly in `index.html`
- Update meta tags in the `<head>` section for SEO
- Replace placeholder images in the `assets/images/` folder

### Fonts
The website uses Google Fonts (Inter). To change:
1. Update the font link in `index.html`
2. Update `--font-family` in `css/style.css`

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## 🔧 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks, pure JS
- **Font Awesome**: Icon library
- **Google Fonts**: Inter font family

## 📊 Performance

- Optimized images (use WebP format)
- Minified CSS and JS for production
- Lazy loading for images
- Efficient animations using CSS transforms

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in settings
3. Select main branch and root folder

### Netlify
1. Drag and drop the `website` folder
2. Or connect to Git repository
3. Deploy automatically

### Vercel
```bash
cd website
vercel
```

### Traditional Hosting
1. Upload all files via FTP
2. Ensure index.html is in the root directory
3. Set proper file permissions

## 📝 To-Do / Enhancements

- [ ] Add blog section
- [ ] Implement newsletter signup
- [ ] Add testimonials/reviews section
- [ ] Create FAQ section
- [ ] Add multilingual support
- [ ] Integrate analytics (Google Analytics/Plausible)
- [ ] Add cookie consent banner
- [ ] Create custom 404 page

## 🔐 Security

- No user data is stored
- Contact form should be connected to a secure backend
- Use HTTPS in production
- Implement CSP headers
- Regular security updates

## 📧 Support

For questions or support:
- Email: support@vaultsio.com
- Website: https://vaultsio.com/contact

## 📄 License

Copyright © 2025 VaultSio. All rights reserved.

---

**Built with ❤️ for VaultSio**
