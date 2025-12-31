# TripX API Documentation

Modern API documentation site built with Docusaurus and OpenAPI integration.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

This starts a local development server at `http://localhost:3000`. Most changes are reflected live without restarting the server.

### Build

```bash
npm run build
```

This generates static content into the `build` directory that can be served using any static hosting service.

## Features

- 📚 **Beautiful Documentation** - Clean, modern UI similar to Stripe/Twilio
- 🔌 **OpenAPI Integration** - Interactive API reference with try-it-out functionality
- 🌙 **Dark Mode** - Built-in dark theme support
- 🔍 **Search** - Full-text search across documentation
- 📱 **Responsive** - Works perfectly on all devices
- ⚡ **Fast** - Static site generation for optimal performance

## Project Structure

```
api-docs-poc/
├── docs/              # Documentation markdown files
├── openapi/           # OpenAPI specification files
├── src/
│   ├── components/    # Custom React components
│   ├── css/          # Custom CSS styles
│   └── pages/        # Custom pages
├── static/           # Static assets
└── docusaurus.config.ts
```

## Customization

Edit `docusaurus.config.ts` to customize site metadata, navigation, footer, and more.

Edit `src/css/custom.css` to customize colors and styles.
