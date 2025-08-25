# Lab Demonstration - Responsive & Accessible Website

A simple one-page website demonstrating responsive design, navigation, and accessibility compliance.

## Features Demonstrated

### 🎨 Responsive Design
- **Mobile-first approach** with CSS Grid and Flexbox
- **Breakpoints** for mobile (768px), tablet, and desktop
- **Responsive navigation** with hamburger menu on mobile
- **Fluid typography** and scalable components

### 🧭 Navigation
- **Smooth scrolling** between sections
- **Active state indication** based on scroll position
- **Keyboard navigation** support
- **Mobile-friendly** hamburger menu with animations

### ♿ Accessibility Compliance
- **WCAG 2.1 AA compliant**
- **Semantic HTML5** structure with proper landmarks
- **ARIA labels and roles** throughout
- **Keyboard navigation** support (Tab, Arrow keys, Escape)
- **Screen reader** announcements
- **Skip to main content** link
- **High contrast mode** toggle
- **Focus management** and visual indicators
- **Alternative text** for images and icons

### ⚡ Performance Features
- **Lightweight** - No external dependencies
- **Optimized CSS** with efficient selectors
- **Intersection Observer** for scroll performance
- **Throttled scroll events**

## Quick Start

### Local Development
1. Clone this repository
2. Open `index.html` in any modern web browser
3. Or use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (if you have http-server installed)
   npx http-server
   
   # XAMPP
   # Place files in htdocs folder and access via localhost
   ```

### GitHub Pages Deployment
1. Fork or clone this repository
2. Enable GitHub Pages in repository settings
3. Select "GitHub Actions" as the source
4. The site will be automatically deployed on push to main/master

## File Structure
```
/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript for interactivity
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Pages deployment
└── README.md           # This file
```

## Accessibility Features

### Keyboard Navigation
- **Tab** - Navigate through interactive elements
- **Enter/Space** - Activate buttons and links
- **Escape** - Close mobile menu
- **Alt + M** - Skip to main content
- **Arrow keys** - Navigate within menu items

### Screen Reader Support
- Proper heading hierarchy (h1-h3)
- Descriptive link text
- Form labels and error messages
- Live regions for dynamic content
- Landmark roles (banner, main, navigation, contentinfo)

### Visual Accessibility
- High contrast mode toggle
- Focus indicators on all interactive elements
- Sufficient color contrast ratios
- Scalable text up to 200%
- No reliance on color alone for information

## Testing Checklist

### Responsiveness
- [x] Mobile (320px-768px)
- [x] Tablet (768px-1024px) 
- [x] Desktop (1024px+)
- [x] Navigation adapts to screen size
- [x] Content reflows appropriately

### Accessibility
- [x] Screen reader compatibility
- [x] Keyboard navigation
- [x] Color contrast compliance
- [x] Focus management
- [x] ARIA labels and roles
- [x] Semantic HTML structure

### Performance
- [x] Fast loading (no external dependencies)
- [x] Smooth animations
- [x] Optimized images and assets
- [x] Efficient JavaScript

## Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License
MIT License - Created for educational purposes.