# Railway Deployment Guide

This project is configured for deployment on Railway.

## Quick Deploy

1. Click the button below to deploy to Railway:
   - Or manually: Create a new project on Railway and connect your GitHub repository

2. Railway will automatically:
   - Detect the configuration from `railway.toml` and `nixpacks.toml`
   - Install dependencies with `npm install`
   - Build the project with `npm run build`
   - Start the server with `npm start` (serves the `dist` folder on port 3000)

## Environment Variables

No environment variables are required for basic deployment.

## Build Configuration

- **Builder**: Nixpacks
- **Node Version**: 20.x
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Port**: 3000

## Local Testing

To test the production build locally:

```bash
npm run build
npm start
```

Then visit `http://localhost:3000`
