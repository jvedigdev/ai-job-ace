# AI Rules for Lovable Project

This document outlines the technical stack and guidelines for AI agents contributing to this project.

## Tech Stack Overview

*   **Frontend Framework**: React
*   **Language**: TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **UI Component Library**: shadcn/ui (built on Radix UI)
*   **Routing**: React Router DOM
*   **State Management/Data Fetching**: React Query
*   **Authentication**: Clerk
*   **Database/Backend**: Supabase
*   **Icons**: Lucide React

## Library Usage Guidelines

To maintain consistency and efficiency, please adhere to the following guidelines when choosing libraries and components:

*   **UI Components**: Always prioritize `shadcn/ui` components. These are pre-installed and styled with Tailwind CSS. If a specific component is not available in `shadcn/ui`, consider building a custom component using basic HTML elements and Tailwind CSS, or discuss with the team before introducing new UI libraries.
*   **Icons**: Use `lucide-react` for all icons.
*   **Routing**: `react-router-dom` is the designated library for all client-side routing.
*   **State Management & Data Fetching**: `react-query` should be used for managing server state and asynchronous data fetching. For simple local component state, `useState` and `useReducer` are appropriate.
*   **Authentication**: `Clerk` is the primary authentication solution. All authentication-related functionalities should leverage Clerk's hooks and components.
*   **Database Interaction**: Use the `@supabase/supabase-js` client for all interactions with the Supabase backend.
*   **Utility Functions**: For common utility functions (e.g., class name concatenation), use `clsx` and `tailwind-merge` via the `cn` helper in `src/lib/utils.ts`.
*   **Date Manipulation**: `date-fns` is available for date formatting and manipulation.
*   **Form Handling**: `react-hook-form` with `zod` for schema validation should be used for all form management.