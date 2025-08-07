# AI Rules for ai-job-ace

This document outlines the technical stack and guidelines for developing the `ai-job-ace` application.

## Tech Stack

*   **Frontend Framework**: React with TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **UI Components**: shadcn/ui (built on Radix UI)
*   **Routing**: React Router DOM
*   **State Management/Data Fetching**: React Query
*   **Authentication**: Clerk
*   **Database/Backend**: Supabase
*   **Icons**: Lucide React
*   **Form Management**: React Hook Form with Zod for validation
*   **Date Management**: date-fns

## Library Usage Guidelines

*   **UI Components**: Always prioritize using components from `shadcn/ui`. If a required component is not available, create a new component in `src/components` following the existing styling conventions. Do not modify `shadcn/ui` components directly.
*   **Styling**: Use Tailwind CSS classes for all styling. Avoid inline styles or separate CSS files unless absolutely necessary for global styles (e.g., `index.css`).
*   **Icons**: Use `lucide-react` for all icons.
*   **Forms**: For form handling, use `react-hook-form` for state management and `zod` for schema validation.
*   **Data Fetching**: Use `react-query` for managing server state and data fetching.
*   **Authentication**: Clerk is the primary authentication solution. Use its hooks and components for user management.
*   **Database Interactions**: All database operations should go through the Supabase client.
*   **Routing**: `react-router-dom` should be used for all client-side routing.
*   **Date Manipulation**: Use `date-fns` for any date formatting or manipulation.
*   **Utility Functions**: For general utility functions (e.g., `cn` for class merging), add them to `src/lib/utils.ts`.
*   **Hooks**: Custom hooks should be placed in `src/hooks`.
*   **Component Structure**: Create new files for every new component or hook. Components should be small and focused, ideally under 100 lines of code.