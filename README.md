# Employee Management System — React + Vite

## Run locally
1. Install Node.js (LTS).
2. Open this folder in VS Code.
3. Open Terminal and run `npm install`.
4. Run `npm run dev`.
5. Open the local URL printed by Vite.

## Build
Run `npm run build`. Vite creates the production site in `dist/`.

## Current migration status
This is a React + Vite host around the Review-1 application. Existing Admin and Employee screens, their CSS/JavaScript, Local Storage data keys, login, and signup are preserved under `public/legacy/` so that the current working project is not lost. The React entry point is `src/main.jsx` and the root application is `src/App.jsx`.

**Important:** the existing feature screens are still legacy HTML/CSS/JavaScript loaded inside a React iframe; they have not yet been rewritten as native React components. If the evaluator requires every module itself to be implemented in React, complete that component-by-component migration before presenting this as a fully React implementation.

## Existing demo login
- Admin email: `admin@gmail.com`
- Admin password: `admin123`

Employee accounts can be created from the Employee login screen. Data is stored in browser Local Storage.

## Deploy to Vercel
Import the GitHub repository in Vercel. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
