# Project Memory - Shop Vibe

## Project Structure
- `src/components/`: Reusable UI components (buttons, inputs, layout components like Navbar, Footer).
- `src/contexts/`: React context providers (e.g., CartContext).
- `src/data/`: Mock data or static constants.
- `src/hooks/`: Custom React hooks (useAuth, useForm potentially go here).
- `src/lib/`: Utilities, helpers (like `utils.ts` for styling).
- `src/pages/`: Main route components (Storefront pages and Admin dashboard pages).
- `src/App.tsx`: Main application wrapper and router definition.
- `src/index.css`: Global tailwind styles.

## Existing Firebase Setup
- **Current State:** The project has zero actual Firebase config, initialization, or `firebase` npm package installed. There is only a mock UI in `src/pages/admin/SettingsPage.tsx` indicating UI for connecting Firebase.
- **Action Required:** We need to install `firebase` and create the foundational config in `services/firebase.js` and `services/authService.js`.

## Key Components and Pages
- **Storefront:** `HomePage`, `CategoryPage`, `ProductPage`, `CartPage`.
- **Admin:** `AdminLayout`, `OverviewPage`, `SettingsPage`, etc.
- **Missing Parts UI:** `LoginPage`, `RegisterPage` do not exist yet. Authentication flows are entirely absent.

## Action Plan (Current Objectives)
1. Build Modern Auth UI (`LoginPage`, `RegisterPage`) with Framer Motion, validation, and a SaaS feel.
2. Setup actual Firebase (install package, initialize in `services/firebase.js`, auth logic in `services/authService.js`).
3. Connect UI to auth logic, handle Firestore profile creation on register.
4. Update router in `App.tsx` and ensure responsive design.
