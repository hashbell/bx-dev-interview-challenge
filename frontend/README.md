# Frontend Solution

## Overview
A modern React file upload and management application built with TypeScript, Material-UI, and Tailwind CSS. Features include drag-and-drop file uploads, presigned URL support, dark/light theme switching, and responsive design.

## Features
- **File Upload**: Drag-and-drop or click-to-browse file uploads
- **Dual Upload Modes**: Direct upload and presigned URL upload for enhanced performance
- **File Management**: View, download, and manage uploaded files
- **Dual Download Modes**: Direct download and presigned URL download
- **Authentication**: User registration and login with JWT
- **Theme Support**: Dark and light mode with smooth transitions
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Progress**: Upload progress indicators and status messages
- **Error Handling**: Comprehensive error messages from backend validation

## Tech Stack
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management
- **Fetch API** for HTTP requests

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Yarn package manager
- Backend server running (see backend solution.md)

## Environment Variables

The application supports environment variables for configuration. Create a `.env` file in the frontend directory to override default settings:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
```

**Note**: All environment variables must be prefixed with `VITE_` to be accessible in the browser.

### Installation

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Start the development server:**
   ```bash
   yarn start:dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3001`

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn test` - Run tests

## Project Structure

## Key Features Explained

### Upload Modes
- **Direct Upload**: Files uploaded through the backend server
- **Presigned URL**: Files uploaded directly to cloud storage for better performance

### Download Modes
- **Direct Download**: Files downloaded through the backend server
- **Presigned URL**: Files downloaded directly from cloud storage

### Theme System
- Automatic theme detection based on system preferences
- Manual theme toggle with persistent storage
- Smooth transitions between themes

## Backend Integration
The frontend connects to a NestJS backend running on `http://localhost:3000`. Ensure the backend is running before using the application.

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**Yarn issues:**
```bash
# Clear yarn cache
yarn cache clean
# Reinstall dependencies
rm -rf node_modules && yarn install
``` 
