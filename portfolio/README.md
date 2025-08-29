# 🚀 Priyam Jain - Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, Tailwind CSS, and Framer Motion.

## ✨ Features

- **Modern Design**: Clean, professional UI with gradient accents and smooth animations
- **Responsive**: Mobile-first design that looks great on all devices
- **Smooth Animations**: Powered by Framer Motion for engaging user experience
- **Performance Optimized**: Fast loading and optimized for SEO
- **Contact Form**: Functional contact form ready for integration
- **Dark/Light Theme**: Custom color scheme with premium look

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Build Tool**: Create React App

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📦 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Run `npm run build`
2. Upload the `build` folder to Netlify
3. Or connect your GitHub repository for automatic deployments

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/portfolio",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Run `npm run deploy`

## 🎨 Customization

### Personal Information
Update the following files with your information:
- `src/components/HeroSection.tsx` - Name and introduction
- `src/components/AboutSection.tsx` - About text and skills
- `src/components/ExperienceSection.tsx` - Work experience
- `src/components/EducationSection.tsx` - Education and certifications
- `src/components/ProjectsSection.tsx` - Your projects
- `src/components/ContactSection.tsx` - Contact information

### Colors
The color scheme is defined in `tailwind.config.js`. Modify the `primary` color palette to match your brand.

### Contact Form
The contact form is ready for integration with services like:
- [Formspree](https://formspree.io/)
- [EmailJS](https://www.emailjs.com/)
- [Netlify Forms](https://www.netlify.com/products/forms/)

## 📱 Sections

1. **Hero Section** - Name, title, and call-to-action
2. **About** - Personal story and skills with animated progress bars
3. **Projects** - Portfolio showcase with project cards
4. **Experience** - Professional experience with achievements
5. **Education** - Academic background and certifications
6. **Contact** - Contact form and social links
7. **Footer** - Additional links and copyright

## 🔧 Project Structure

```
src/
├── components/
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── ProjectsSection.tsx
│   ├── ExperienceSection.tsx
│   ├── EducationSection.tsx
│   ├── ContactSection.tsx
│   ├── Footer.tsx
│   └── SocialIcons.tsx
├── App.tsx
├── index.css
└── index.tsx
```

## 🌟 Performance

- Optimized images and animations
- Lazy loading for sections
- Minimal bundle size
- SEO-friendly structure

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by Priyam Jain**