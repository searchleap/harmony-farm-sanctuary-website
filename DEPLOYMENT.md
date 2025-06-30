# Deployment Guide - Harmony Farm Sanctuary Website

## Pre-Deployment Checklist

### 1. Build Verification
- [x] Production build successful (`npm run build`)
- [x] Zero TypeScript errors
- [x] All routes functional
- [x] Bundle size optimized (1.47MB)

### 2. Environment Configuration
- [ ] Environment variables configured
- [ ] Build settings verified
- [ ] Custom domain prepared (if applicable)

### 3. Content Review
- [x] All pages accessible
- [x] FAQ system functional
- [x] Educational resources working
- [x] Navigation complete

## Vercel Deployment Steps

### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration
1. Push code to GitHub repository
2. Connect Vercel to GitHub account
3. Import project from GitHub
4. Auto-deploy on push to main branch

## Vercel Configuration

### vercel.json (Optional)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Environment Variables (if needed)
- Add in Vercel dashboard under Project Settings > Environment Variables
- Available at build time and runtime

## Post-Deployment Verification

### Performance Checks
- [ ] Core Web Vitals (Lighthouse)
- [ ] Mobile responsiveness
- [ ] Load times < 3 seconds
- [ ] Image optimization working

### Functionality Tests
- [ ] All routes accessible
- [ ] FAQ search working
- [ ] Resource downloads functional
- [ ] Contact forms submitting
- [ ] Navigation smooth

### SEO Verification
- [ ] Meta tags rendering
- [ ] Sitemap accessible
- [ ] Structured data valid
- [ ] Social media previews

## Custom Domain Setup (Optional)

1. Add domain in Vercel dashboard
2. Configure DNS records:
   ```
   CNAME www [your-project].vercel.app
   A @ 76.76.19.19
   AAAA @ 2606:4700:90:0:f22e:fbec:5bed:a9b9
   ```
3. SSL certificate auto-provisioned

## Rollback Strategy

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url]
```

## Performance Optimizations

### Build Optimizations
- Code splitting enabled
- Tree shaking active
- Asset optimization
- Gzip compression

### Vercel Features
- Edge caching
- Image optimization
- Static asset CDN
- Automatic compression

## Monitoring & Analytics

### Available Metrics
- Core Web Vitals
- Page load times
- User interactions
- Geographic distribution

### Access Analytics
- Vercel dashboard > Analytics
- Real-time performance data
- User experience metrics

## Troubleshooting

### Common Issues
1. **Build fails**: Check TypeScript errors, missing dependencies
2. **Routes not working**: Verify SPA routing configuration
3. **Assets not loading**: Check build output directory
4. **Performance issues**: Review bundle size, image optimization

### Debug Commands
```bash
# Local production build
npm run build
npm run preview

# Vercel logs
vercel logs [deployment-url]
```

## Security Considerations

### Headers Configuration
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Form Security
- CSRF protection
- Rate limiting
- Input validation

## Maintenance

### Regular Tasks
- Monitor performance metrics
- Update dependencies
- Review security headers
- Check broken links

### Automated Deployments
- Trigger on main branch push
- Preview deployments for PRs
- Automatic rollback on failures