# Rating App Dashboard

A modern, responsive admin dashboard for managing the Rating App system.

## Features

- 🔐 Secure authentication and role-based access
- 📊 Comprehensive analytics dashboard
- 🌍 Internationalization (English and French)
- 🔄 Real-time data updates
- 📱 Fully responsive design
- 🎨 Dark/light theme support
- 📋 Item, category, and tag management
- 👥 User management
- ⭐ Rating management and analytics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **State Management**: React Query, React Context
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Data Visualization**: Recharts
- **API Client**: Axios
- **Authentication**: JWT
- **Internationalization**: i18next

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend API server running (see RatingApp project)

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/Alwil17/rating-app-dashboard.git
   cd rating-app-dashboard
   ```

2. Install dependencies
   ```sh
   npm install
   # or
   yarn
   ```

3. Create a `.env` based on `.env.example` file with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Start the development server
   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
rating-app-dashboard/
├── docs/               # Documentation files
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router
│   │   ├── admin/      # Admin pages
│   │   ├── auth/       # Authentication pages
│   │   └── ...         # Other pages
│   ├── components/     # Reusable components
│   │   ├── ui/         # UI components based on shadcn/ui
│   │   └── ...         # Other components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   │   ├── queries/    # React Query hooks
│   │   └── ...         # Other hooks
│   ├── i18n/           # Internationalization
│   │   └── locales/    # Translation files
│   ├── lib/            # Utility functions
│   ├── providers/      # React providers
│   ├── schema/         # Zod schemas
│   └── utils/          # Utility functions
└── ...
```

## Documentation

- [API Reference](./docs/API-REFERENCE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Security](./docs/SECURITY.md)

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [React Query](https://react-query.tanstack.com/)