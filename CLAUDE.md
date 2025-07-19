# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-page application (SPA) for "Crosswind Coaching" - an aviation career coaching service that helps pilots get hired. The website offers resume review and rewrite services for airline, corporate, and military-transitioning pilots.

## Architecture & Structure

**Core Components:**
- `index.html` - Single HTML file containing all page content with show/hide navigation
- `app.js` - Main JavaScript application using a class-based architecture (`AviationWebsite` class)
- `style.css` - Primary stylesheet 
- `style_1.css` - Additional stylesheet (likely unused/legacy)

**Navigation System:**
- Client-side routing using `data-page` attributes and browser history API
- Pages: home, services, booking, testimonials, resources, contact
- Mobile-responsive hamburger menu

**Key Features:**
- Multi-step booking form with validation
- Package selection (Basic Resume Review $99, Premium Resume Rewrite $299, LinkedIn Profile Tune-Up $99)
- Testimonial carousel with auto-rotation
- Contact forms with mock submission handling
- Form validation and formatting (email, phone, credit card)
- Scroll-based animations and hover effects

## Development Workflow

**No Build Process:** This is a static site with no build tools, bundlers, or package managers. Files are served directly.

**Testing:** No automated testing framework is configured. Manual testing in browser is required.

**Deployment:** Static files can be deployed to any web server or CDN. Currently appears to be set up for Netlify based on git history.

## Code Patterns

**Event Handling:**
- Uses event delegation on document for `data-page` and `data-package` attributes
- Form validation on blur/input events
- Global functions `nextStep()` and `prevStep()` for booking form navigation

**State Management:**
- All state managed in the `AviationWebsite` class instance
- Current page, form step, selected package tracked as instance properties
- Browser history integration for back/forward navigation

**Styling:**
- CSS custom properties (variables) for theming
- Responsive design with mobile-first approach
- Intersection Observer API for scroll animations

## Form Handling

The booking form is a 4-step process:
1. Package selection
2. Personal information
3. Payment information  
4. Confirmation

Form validation includes email regex, phone formatting, credit card formatting, and required field checking. All form submissions are currently mocked with setTimeout delays.