# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SolidJS Window Manager is a component library that creates a desktop-like window management system with persistent state in localStorage. It provides drag-and-drop windows, a taskbar, minimize/maximize functionality, and automatic state restoration.

## Build Commands

- `npm run build` - Build the library using tsup (outputs to `dist/`)

The library uses **tsup-preset-solid** for building, which generates:
- CommonJS and ES module outputs
- TypeScript declaration files
- Development builds with hot-reloading support

## Running the Example/Playground

```bash
cd example
yarn install
yarn start
```

The example project demonstrates the full functionality including window persistence, taskbar, and window controls.

## Architecture

### State Management

The system uses **solidjs-storex** for state management with two stores:

1. **Window Store** (`src/stores/windowStore.ts`) - Manages all open windows (position, size, state, zIndex) with 250ms throttled localStorage persistence
2. **Window Preferences Store** (`src/stores/windowPreferencesStore.ts`) - Stores per-component positions/sizes for restoration

### Core Components

- **`WindowManager.tsx`** - Main container handling drag/drop, resize, and window interactions
- **`WindowControls.tsx`** - Individual window wrapper with minimize/maximize/close controls
- **`Taskbar.tsx`** - Bottom taskbar showing all open windows with focus/close functionality
- **`WindowIcon.tsx`** - Icon component for taskbar and window headers

### Key Patterns

**Window Factory Pattern:**
- `loadWindow` prop receives `{ component, ...props }` and returns a lazy-loaded component
- Use `@vite-ignore` comment for dynamic imports in Vite

**Z-Index Management:**
- Lower zIndex = higher in stack
- Minimized windows get zIndex = 0
- Focus management automatically increments zIndex

**Window Component Interface:**
```tsx
props.windowUpdateProps({
  title: string,
  loading?: boolean,
  customState?: any
});
props.closeWindow();
props.maximizeWindow();
props.minimizeWindow();
```

**Drag and Resize:**
- Custom implementation without external libraries
- 8-directional resize support (corners + edges)
- Uses `eventPathPolyfill` for browser compatibility

### Styling

- All styles are embedded as template literals in component files
- BEM-like CSS class naming
- Glass morphism effects using backdrop-filter
- No external CSS framework

## Dependencies

- **solid-js** (peer dependency v1.*) - Core framework
- **solidjs-storex** - State management with localStorage persistence
- **tsup-preset-solid** - Build tooling

## Development Notes

- TypeScript strict mode is disabled in tsup config
- No formal testing framework is currently implemented
- The library migrated from Rollup to tsup in v1.1.3
- Event path polyfill was added in v1.1.0 for browser compatibility
