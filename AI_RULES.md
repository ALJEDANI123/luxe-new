# AI Rules for BagiLand Application

This document outlines the core technologies used in the BagiLand application and provides clear guidelines on which libraries to use for specific functionalities.

## Tech Stack Overview

*   **React**: The primary JavaScript library for building the user interface.
*   **TypeScript**: Used for type safety and improved developer experience, although some files may still be in JavaScript (`.jsx`). New components should ideally be in TypeScript (`.tsx`).
*   **Tailwind CSS**: A utility-first CSS framework used for all styling, ensuring a consistent and responsive design.
*   **shadcn/ui**: A collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **React Router DOM**: Used for declarative routing within the application.
*   **Framer Motion**: A production-ready motion library for React, used for animations and interactive components.
*   **Lucide React**: A library providing a set of consistent and customizable SVG icons.
*   **Tanstack React Query**: Used for efficient data fetching, caching, and synchronization with the server.
*   **Base44 SDK**: The official SDK for interacting with the Base44 backend, handling authentication, data entities, and application logs.
*   **Vite**: The build tool used for a fast development experience.

## Library Usage Rules

To maintain consistency and efficiency, please adhere to the following rules when developing:

*   **UI Components**:
    *   **Always** use components from `shadcn/ui` (imported from `@/components/ui`) for standard UI elements (buttons, inputs, cards, dialogs, etc.).
    *   **Do not** modify `shadcn/ui` component files directly. If a component needs significant customization or a new component is required, create it in `src/components/` and style it with Tailwind CSS.
*   **Styling**:
    *   **Exclusively** use Tailwind CSS classes for all styling. Avoid inline styles or custom CSS files unless absolutely necessary for very specific, isolated cases (e.g., global font imports).
*   **Routing**:
    *   **Always** use `react-router-dom` for all client-side navigation.
    *   **Keep** the main routing configuration in `src/App.jsx`.
*   **Data Fetching & State Management**:
    *   **Use** `Tanstack React Query` for fetching, caching, and managing server-side data.
    *   For local component state, use React's `useState` and `useReducer` hooks.
*   **Authentication & Backend Interaction**:
    *   **Always** use the `base44` client (from `src/api/base44Client.js`) for all authentication flows, user management, and interactions with Base44 entities (e.g., `Product`, `Order`, `Favorite`).
*   **Icons**:
    *   **Always** use icons from `lucide-react`.
*   **Animations**:
    *   **Prefer** `framer-motion` for all animations and transitions to ensure a smooth and consistent user experience.
*   **Forms**:
    *   **Use** `react-hook-form` for managing form state and validation.
    *   **Use** `zod` for schema-based form validation.
*   **Date & Time Utilities**:
    *   **Use** `date-fns` for any date and time formatting or manipulation.
*   **Toast Notifications**:
    *   **Use** `sonner` for displaying toast notifications to the user.
*   **Utility Functions**:
    *   Create small, reusable utility functions in `src/utils/` or `src/components/utils/` for common tasks (e.g., `formatPrice`, `createPageUrl`).