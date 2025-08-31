# RT Dynamic Business Consulting Website

A modern, responsive business consulting website built with Next.js 15, TypeScript, and GSAP animations.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Advanced Animations**: GSAP-powered scroll animations and interactions
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Performance Optimized**: Static generation, image optimization, and code splitting
- **Accessibility**: WCAG compliant with reduced motion support
- **SEO Optimized**: Meta tags, structured data, and semantic HTML

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP (GreenSock)
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Email**: Nodemailer integration
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rtdynamicbizconsulting
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required environment variables:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `CONTACT_EMAIL`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Build & Deploy

### Local Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Type Checking
```bash
# Run TypeScript compiler
npx tsc --noEmit
```

### Linting
```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix
```

### CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. **Tests**: Runs TypeScript checks, linting, and builds
2. **Deploys**: Automatically deploys to Vercel on main branch pushes

#### Required Secrets
Add these secrets to your GitHub repository:
- `VERCEL_TOKEN`: Your Vercel deployment token
- `ORG_ID`: Your Vercel organization ID
- `PROJECT_ID`: Your Vercel project ID

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── [routes]/         # Page routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── [features]/       # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── animations.ts     # GSAP animation configurations
│   └── utils.ts         # General utilities
├── public/               # Static assets
├── types/                # TypeScript type definitions
└── styles/              # Additional stylesheets
```

## 🎨 Animation System

The website features a centralized GSAP animation system:

- **Centralized Configuration**: All animations defined in `lib/animations.ts`
- **Responsive**: Different animations for mobile, tablet, and desktop
- **Accessible**: Respects `prefers-reduced-motion` settings
- **Performance**: Optimized scroll triggers and timeline management

### Key Animation Features
- Hero section zoom-out effect
- Scroll-triggered service card reveals
- Smooth hover interactions
- Logo pulse and rotation effects

## 🔧 Development Guidelines

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting (configure in your editor)

### Performance
- **Image Optimization**: Use Next.js Image component
- **Code Splitting**: Dynamic imports for large components
- **Bundle Analysis**: Run `npm run analyze` to check bundle size

### Accessibility
- **Semantic HTML**: Use proper heading hierarchy
- **ARIA Labels**: Add where necessary
- **Keyboard Navigation**: Ensure all interactive elements are accessible
- **Color Contrast**: Maintain WCAG AA standards

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build the application
npm run build

# Deploy the .next folder to your hosting provider
```

## 📧 Contact Form Setup

The contact form requires SMTP configuration:

1. **Email Provider**: Configure with your email service
2. **Environment Variables**: Set SMTP credentials
3. **Security**: Use app passwords for Gmail/Outlook

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check TypeScript errors: `npx tsc --noEmit`
   - Verify all imports and exports

2. **Animation Issues**
   - Ensure GSAP is loaded before components
   - Check for CSS conflicts with animations

3. **Performance Issues**
   - Analyze bundle size: `npm run analyze`
   - Optimize images and lazy load components

## 📄 License

This project is proprietary software for RT Dynamic Business Consulting.

## 🤝 Contributing

For internal development:
1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📞 Support

For technical support, contact the development team or refer to the documentation in the `/docs` folder.