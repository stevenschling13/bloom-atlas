#!/bin/bash

# BloomBuddy ATLAS GitHub Pages SPA bootstrapper Bash script

# Set the environment variables
export NODE_ENV=production
export API_URL=https://api.bloombuddy.com

# Install dependencies
npm install --production

# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy