# LearnMate Frontend

A modern React/Next.js frontend for the LearnMate learning platform with authentication powered by a Fastify backend.

## Features

- 🔐 **Authentication System**: Login and registration with JWT tokens
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Friendly**: Optimized for all device sizes
- 🔄 **Real-time Updates**: Toast notifications for user feedback
- 🛡️ **Protected Routes**: Automatic redirection for authenticated users

## Prerequisites

- Node.js 18+
- npm or yarn
- LearnMate Fastify backend running on `http://localhost:3000`

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configure API URL** (Optional)

   Create a `.env.local` file in the frontend directory:

   ```bash
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

   If you don't create this file, it will default to `http://localhost:3000`.

3. **Start the Development Server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:3001` (or the port shown in your terminal)

## Backend Integration

This frontend is designed to work with the LearnMate Fastify backend. Make sure your backend is running and provides the following endpoints:

- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /profile` - Get user profile (protected)

## Authentication Flow

1. **Registration**: Users can create new accounts with email, name, and password
2. **Login**: Users authenticate with email and password
3. **Token Storage**: JWT tokens are stored in localStorage
4. **Protected Routes**: Authenticated users are redirected to `/dashboard`
5. **Logout**: Users can logout and are redirected to login page

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── dashboard/         # Dashboard page (protected)
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── hooks/                # Custom hooks
│   └── use-toast.ts      # Toast notification hook
└── lib/                  # Utility libraries
    └── api.ts            # API service
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable              | Description     | Default                 |
| --------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000` |

## Troubleshooting

### CORS Issues

If you encounter CORS errors, make sure your backend has CORS configured to allow requests from your frontend domain.

### Authentication Issues

- Check that your backend is running on the correct port
- Verify the API endpoints are working correctly
- Check browser console for error messages

### Build Issues

- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the LearnMate platform.
