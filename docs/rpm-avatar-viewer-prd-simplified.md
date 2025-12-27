# ReadyPlayerMe 2D Avatar Viewer - Simplified PRD

**Version:** 1.0  
**Date:** December 27, 2025

## Overview
A lightweight web application for downloading 2D rendered images of ReadyPlayerMe avatars with customizable parameters. Tech stack: Vanilla HTML/CSS/JavaScript, JSZip for bulk downloads, FileSaver.js for enhanced download handling.

## Core Features

### 1. Avatar Preview
- Text input for 24-character Avatar ID (required)
- Dropdown for image format (PNG/JPG)
- Dropdown for pose (default, power-stance, relaxed, standing, thumbs-up)
- Dropdown for expression (default, happy, lol, sad, scared, rage)
- Dropdown for camera preset (portrait, fullbody, fit)
- Number input for image size (64-1024px, default 512)
- Slider for JPG quality (0-100, default 80, visible only when JPG selected)
- Color picker for background (default: transparent for PNG, white for JPG)
- "Preview Avatar" button to display rendered image
- Error handling and loading states

### 2. Single Download
- "Download" button (enabled after successful preview)
- Downloads individual avatar image with filename: `avatar-{avatarId}-{timestamp}.{format}`
- Supports both PNG and JPG formats

### 3. Bulk Download (Get All)
- "Get All Poses" button (enabled when valid Avatar ID is present)
- Generates all 30 combinations (5 poses × 6 expressions)
- Confirmation dialog showing total images, estimated size, and "Proceed"/"Cancel" options
- Batch fetching with 100-200ms delays between requests
- Retry logic: up to 3 retries per failed image
- ZIP file creation using JSZip
- ZIP filename: `avatar-{avatarId}-all-combinations-{timestamp}.zip`
- File naming inside ZIP: `pose-{poseName}_expression-{expressionName}.{format}`
- Progress tracking: visual bar + counter (e.g., "Downloading 12/30 images...")
- Cancel button available during download
- Error handling: continue with successful downloads even if some fail
- Optional folder organization by pose inside ZIP

### 4. API Integration
- Base URL: `https://models.readyplayer.me`
- No authentication required
- API URL construction: `https://models.readyplayer.me/{avatarId}.{format}?pose={pose}&expression={expression}&camera={camera}&size={size}&background={r,g,b}&quality={quality}`
- 10-second timeout per image request

### 5. UI/UX Requirements
- Single-page application
- Two-column layout (desktop): controls left, preview right
- Single-column layout (mobile): controls top, preview bottom
- Responsive design (320px+ width)
- Checkered background pattern in preview to show transparency
- Loading spinner/"Loading avatar..." text during fetch
- Clear error messages with retry option
- Display generated API URL (read-only, copyable)
- Clean, minimal design with 8px grid spacing
- Accessible (WCAG 2.1 Level AA, keyboard navigation, screen reader friendly)

## Performance Targets
- Initial page load: < 2 seconds
- Avatar preview: < 5 seconds (first), < 1 second (cached)
- Bulk download of 30 images: ~2 minutes with progress tracking

## Browser Support
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies
- JSZip (for ZIP file creation in-browser)
- Optional: FileSaver.js (for improved download handling)
- Browser APIs: Fetch API, Blob API, Canvas API (optional)

## Out of Scope (V1)
- User authentication
- Multiple avatar IDs in one session
- Saving favorite configurations
- Blend shape customization
- Server-side caching
- Avatar editing
- Social sharing

## Success Criteria
- All core features implemented and tested
- Single and bulk download functionality works
- Works on desktop and mobile browsers
- Error handling for network issues
- 95%+ successful avatar renders
- Load time meets performance targets
