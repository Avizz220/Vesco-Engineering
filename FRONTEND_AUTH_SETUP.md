# Frontend Authentication Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Variables Setup

Create a `.env.local` file in the frontend directory with the following variables:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_API_URL=http://localhost:3001
```

To get the Google Client ID:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Identity Services API
4. Create OAuth 2.0 credentials (Web application)
5. Add `http://localhost:3000` to authorized JavaScript origins
6. Copy the Client ID

### 3. Install Additional Dependencies

```bash
npm install bcrypt jsonwebtoken cookie lucide-react
npm install -D @types/bcrypt @types/jsonwebtoken
```

### 4. Run Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Features Implemented

### Authentication
- ✅ Sign Up modal with form validation
- ✅ Sign In modal with form validation
- ✅ Google OAuth Sign-In button (ready for integration)
- ✅ Persistent authentication with JWT cookies
- ✅ User profile display in navbar
- ✅ Logout functionality

### Protected Routes
- ✅ Team page - requires authentication
- ✅ Projects page - requires authentication
- ✅ Achievements page - requires authentication
- ✅ Home page - public (no authentication required)
- ✅ Contact page - public (no authentication required)

### UI Components
- ✅ SignInModal - Professional sign-in form
- ✅ SignUpModal - Registration form with password confirmation
- ✅ Navbar - Shows auth buttons or user profile based on auth state
- ✅ ProtectedRoute - Component wrapper for protected pages
- ✅ AuthContext - Global auth state management

### User Experience
- ✅ Loading states during auth operations
- ✅ Error messages for failed operations
- ✅ Modal switching between sign in and sign up
- ✅ User profile avatar with initial letter
- ✅ Smooth transitions and animations
- ✅ Responsive design for mobile and desktop

## API Endpoints (Backend Required)

The frontend expects the following API endpoints:

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in existing user
- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/auth/me` - Get current authenticated user
- `POST /api/auth/logout` - Logout user

## Testing the Frontend

### 1. Test Sign Up
1. Click "Sign Up" button in navbar
2. Fill in name, email, password
3. Submit form
4. Should see loading state then success

### 2. Test Sign In
1. Click "Sign In" button in navbar
2. Enter email and password
3. Submit form
4. Should see user profile in navbar

### 3. Test Protected Pages
1. Logout from navbar
2. Try to access `/team`, `/projects`, or `/achievements`
3. Should see access restriction modal
4. Click "Sign In Now" to open sign in modal

### 4. Test Google Sign-In
1. Click Google button in modal
2. Should trigger Google OAuth flow
3. (Currently requires backend implementation)

## Next Steps

1. Complete backend authentication endpoints
2. Set up database migrations
3. Test end-to-end authentication flow
4. Implement Google OAuth backend integration
5. Add email verification (optional)
6. Add password reset functionality (optional)

## Troubleshooting

### Modals not appearing
- Check browser console for errors
- Verify AuthContext is wrapped in Providers component
- Clear browser cache and restart dev server

### Sign-in fails
- Verify backend server is running on port 3001
- Check NEXT_PUBLIC_API_URL environment variable
- Verify credentials in backend database

### Google Sign-In not working
- Check NEXT_PUBLIC_GOOGLE_CLIENT_ID is set correctly
- Verify Google script is loaded in head tag
- Check browser console for Google API errors

## File Structure

```
frontend/src/
├── components/
│   ├── auth/
│   │   ├── SignInModal.tsx
│   │   ├── SignUpModal.tsx
│   │   └── ProtectedRoute.tsx
│   ├── layout/
│   │   └── Navbar.tsx (updated with auth)
│   └── providers/
│       └── Providers.tsx (updated with AuthProvider)
├── context/
│   └── AuthContext.tsx (new - auth state management)
├── app/
│   ├── layout.tsx (added Google script)
│   ├── team/
│   │   └── page.tsx (protected)
│   ├── projects/
│   │   └── page.tsx (protected)
│   └── achievements/
│       └── page.tsx (protected)
└── types/
    └── index.ts (updated User interface)
```
