# Deployment Troubleshooting Guide

## Current Status

✅ **Local Development**: Server working perfectly on `http://localhost:3001`  
✅ **Email Functionality**: Both contact and business health check forms working  
✅ **Dependencies**: All npm packages installed correctly  
⚠️ **Production Deployment**: Missing dependencies error

## Error Analysis

The error you're seeing:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express' imported from /workspace/server/index.js
```

This indicates:
- The error is from a **containerized/cloud environment** (notice `/workspace` path)
- The production environment is missing npm dependencies
- Your **local development environment is working correctly**

## Solutions for Production Deployment

### Option 1: Install Dependencies in Production

If deploying to a cloud service (Digital Ocean, Heroku, etc.):

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the server
npm start
```

### Option 2: Docker Deployment

If using Docker, ensure your Dockerfile includes:

```dockerfile
# Copy package files
COPY server/package*.json ./server/

# Install dependencies
RUN cd server && npm install

# Copy server code
COPY server/ ./server/

# Start server
CMD ["npm", "start"]
```

### Option 3: Digital Ocean App Platform

For Digital Ocean App Platform, ensure your `app.yaml` or deployment config includes:

```yaml
services:
- name: server
  source_dir: /server
  build_command: npm install
  run_command: npm start
  environment_slug: node-js
```

### Option 4: Vercel/Netlify Functions

If deploying as serverless functions, you may need to:
1. Move dependencies to the root `package.json`
2. Use serverless-compatible email services
3. Configure API routes differently

## Verification Steps

### 1. Check Local Server (✅ Working)
```bash
# Health check
curl http://localhost:3001/api/health

# Test contact form
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","message":"Test"}'
```

### 2. Check Production Dependencies
```bash
# In production environment
cd server
ls -la node_modules/  # Should show installed packages
npm list express     # Should show express version
```

### 3. Environment Variables
Ensure production environment has:
```bash
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@rtdynamicbc.co.za
SMTP_PASS=RabeTshepi@1
MAIL_FROM=contact@rtdynamicbc.co.za
MAIL_TO=contact@rtdynamicbc.co.za
```

## Common Deployment Issues

### Issue 1: Missing package.json
**Solution**: Ensure `server/package.json` is included in deployment

### Issue 2: Wrong Node.js Version
**Solution**: Use Node.js v18+ (your local uses v22.16.0)

### Issue 3: Build Process Not Running
**Solution**: Configure deployment to run `npm install` in server directory

### Issue 4: File Path Issues
**Solution**: Use relative paths, ensure server files are in correct directory structure

## Recommended Deployment Structure

```
project-root/
├── server/
│   ├── package.json     # Server dependencies
│   ├── index.js         # Server code
│   └── env.local        # Environment variables
├── package.json         # Frontend dependencies
└── ... (frontend files)
```

## Digital Ocean Specific Setup

### ✅ Solution Files Created

I've created the following files to fix your Digital Ocean deployment:

1. **App Platform Configuration**: `.do/app.yaml`
2. **Docker Configuration**: `server/Dockerfile`
3. **Docker Ignore**: `server/.dockerignore`

### Quick Fix for Current Error

**The issue**: Your Digital Ocean deployment is missing npm dependencies in the server directory.

**Immediate solution**:
1. Ensure your `server/package.json` is committed to your repository
2. Update your Digital Ocean app configuration to run `npm install` in the server directory
3. Use the provided `.do/app.yaml` configuration

### Option 1: Using App Platform (Recommended)

1. **Use the created configuration** (`.do/app.yaml`):
   - Automatically installs dependencies with `build_command: npm install`
   - Sets correct environment variables
   - Configures health checks

2. **Deploy steps**:
   ```bash
   # Commit the new configuration files
   git add .do/app.yaml server/Dockerfile server/.dockerignore
   git commit -m "Add Digital Ocean deployment configuration"
   git push origin main
   ```

3. **In Digital Ocean Dashboard**:
   - Go to Apps → Your App → Settings
   - Update app spec with the content from `.do/app.yaml`
   - Replace `your-github-username` with your actual GitHub username
   - Redeploy the app

### Option 2: Manual Configuration

If you prefer manual setup:

```yaml
name: rtdynamicbc
services:
- name: server
  source_dir: /server
  github:
    repo: your-github-username/rtdynamicbizconsulting
    branch: main
  run_command: npm start
  build_command: npm install  # This is crucial!
  environment_slug: node-js
  http_port: 3001
  envs:
  - key: SMTP_HOST
    value: mail.privateemail.com
  - key: SMTP_PORT
    value: "587"
  - key: SMTP_SECURE
    value: "false"
  - key: SMTP_USER
    value: contact@rtdynamicbc.co.za
  - key: SMTP_PASS
    value: RabeTshepi@1
  - key: MAIL_FROM
    value: contact@rtdynamicbc.co.za
  - key: MAIL_TO
    value: contact@rtdynamicbc.co.za
```

2. **Deploy Commands**:
```bash
# Push to repository
git add .
git commit -m "Add server configuration"
git push origin main

# Deploy will automatically trigger
```

## Testing Production Deployment

Once deployed, test with:
```bash
# Replace YOUR_DOMAIN with actual domain
curl https://YOUR_DOMAIN/api/health

# Test contact form
curl -X POST https://YOUR_DOMAIN/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","message":"Production test"}'
```

## Next Steps

1. **Identify Deployment Platform**: Determine where the error is occurring
2. **Install Dependencies**: Run `npm install` in the server directory on production
3. **Configure Environment**: Set up environment variables
4. **Test Deployment**: Verify all endpoints work
5. **Monitor Logs**: Check for any additional errors

## Support

- **Local Development**: ✅ Working perfectly
- **Email System**: ✅ Configured and tested
- **Production Issue**: Missing dependencies in deployment environment

**Immediate Action**: Run `npm install` in the server directory of your production environment.

---

**Status**: Local server working, production needs dependency installation