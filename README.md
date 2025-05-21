# Rating App Dashboard

A modern dashboard for managing and administering your Rating API.

## Overview

**Rating App Dashboard** is a web-based admin panel designed to help you efficiently manage and monitor your rating system. It consumes your custom Rating API, providing a user-friendly interface for administrative tasks such as viewing, editing, and managing ratings and users.

## Features

- **Dashboard Overview:** Visualize key metrics and recent activity.
- **User Management:** View and manage users with ease.
- **Ratings Management:** Approve, edit, or delete ratings.
- **Search & Filter:** Quickly find users or ratings.
- **Responsive Design:** Works seamlessly on desktop and mobile devices.
- **Authentication:** Secure admin access (if enabled).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- Your Rating API running and accessible

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Alwil17/rating-app-dashboard.git
   cd rating-app-dashboard
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory and add your API endpoint:
   ```
   REACT_APP_API_URL=https://rating-api-fvz9.onrender.com
   ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```

5. **Open your browser:**
   ```
   http://localhost:3000
   ```

## Usage

- Log in as an admin (if authentication is enabled).
- Use the sidebar to navigate between dashboard sections.
- Manage users and ratings as needed.

## Project Structure

```
src/
├── app/                    # Next.js App Router routes and pages
│   ├── auth/               # Authentication routes
│   ├── board/              # Main application routes (formerly dashboard)
│   └── ...
├── components/             # Reusable UI components
│   ├── ui/                 # Base components (shadcn/ui only)
│   ├── enhanced/           # Enhanced shadcn components with logic
│   ├── shared/             # Custom shared components
│   │   ├── navigation/     # Navigation-related components (app.sidebar, search.form, team.switcher)
│   │   ├── theme/          # Theme-related components (mode-toggle)
│   │   └── others/         # Other shared components (feedback.dialog)
│   └── ...
├── config/                 # Global configuration
│   ├── constants.ts        # Application constants
│   ├── messages.ts         # Error and success messages
│   ├── routes.ts           # Centralized route definitions
│   └── navigation-items.tsx # Navigation configuration
├── hooks/                  # Custom React hooks
│   ├── queries/            # TanStack Query hooks
│   └── ...
├── lib/                    # Utilities and functions
│   └── utils.ts            # Utility functions
├── schema/                 # Validation schemas (Zod)
├── server/                 # Server-side logic
│   ├── services/           # Business services
│   ├── middleware/         # Server middleware
│   └── ...
├── types/                  # TypeScript type definitions
│   ├── auth.types.ts       # Authentication related types
│   ├── rate-limiter.types.ts # Rate limiter related types
│   └── ...
└── utils/                  # Specific utilities
    ├── providers/          # React providers
    └── ...
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License.

## Acknowledgements

Inspired by [univ-check-ui](https://github.com/tiger-githubb/univ-check-ui).

---

**Made with ❤️ for admin productivity.**