# linkShrink Frontend

React TypeScript frontend for the linkShrink URL shortener application. Built with Vite, DaisyUI, and modern web APIs.

## Technologies

### Core Stack
- **[React 18](https://react.dev/)** with TypeScript
- **[Vite](https://vitejs.dev/)** for fast development and building
- **[React Router](https://reactrouter.com/)** for client-side routing
- **[Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha)** for styling
- **[DaisyUI](https://daisyui.com/)** component library

### Key Features & APIs
- **[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)** with credentials for authenticated requests
- **[Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)** for copy-to-clipboard functionality
- **[HTML5 download attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download)** for QR code downloads
- **[CSS :hover pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover)** with smooth transitions
- **[Map data structure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)** for efficient URL management

## Project Structure

```
src/
├── components/
│   ├── AlertDialog.tsx
│   ├── AuthPage.tsx
│   ├── Body.tsx
│   ├── EditUrl.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── Table.tsx
│   └── UrlPage.tsx
├── services/
│   ├── authServices.ts
│   └── urlServices.ts
├── utils/
│   ├── constants.ts
│   └── types.ts
├── App.tsx
├── index.css
└── main.tsx
```

- **[`src/components/`](src/components/)** - React components with TypeScript interfaces
- **[`src/services/`](src/services/)** - API service layer with error handling
- **[`src/utils/`](src/utils/)** - TypeScript types and application constants

## Notable Implementation Details

### Type-Safe Data Management
- Uses TypeScript utility types (`Omit<T, K>`) to derive interfaces
- Custom `IUrlMap` type using `Map<number, IUrlEntry>` for efficient lookups
- Strict type checking with `noUnusedLocals` and `noUnusedParameters`

### Modern React Patterns
- **[React.useState](https://react.dev/reference/react/useState)** with TypeScript generics
- **[React.useEffect](https://react.dev/reference/react/useEffect)** for data fetching
- **[Controlled components](https://react.dev/learn/sharing-state-between-components)** for form management
- **[Event handling](https://react.dev/learn/responding-to-events)** with proper TypeScript event types

### CSS & Styling Techniques
- **[CSS Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)** for component layouts
- **[CSS transition property](https://developer.mozilla.org/en-US/docs/Web/CSS/transition)** for hover effects
- **[CSS word-break](https://developer.mozilla.org/en-US/docs/Web/CSS/word-break)** for URL wrapping
- DaisyUI modal system with **[HTML dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)**

## Build Configuration

### TypeScript Project References
Uses **[TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)** with separate configs:
- [`tsconfig.app.json`](tsconfig.app.json) - Main application code
- [`tsconfig.node.json`](tsconfig.node.json) - Build tools (Vite config)

### Vite Configuration
- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)** for React Fast Refresh
- **[@tailwindcss/vite](https://github.com/tailwindlabs/tailwindcss-vite)** plugin for CSS processing
- Development server with proxy configuration for backend API
