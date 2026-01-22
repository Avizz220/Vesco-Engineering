# Quick Start - Frontend Authentication

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Create Environment File
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=any_value_for_testing
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> **Note**: The API will be implemented in the backend. For now, these are placeholders.

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✨ What's Ready to Use

### 1. **Sign Up Modal**
- Click "Sign Up" in navbar
- Fill in: Name, Email, Password, Confirm Password
- Password validation (minimum 6 characters)
- Submit button with loading state

### 2. **Sign In Modal**
- Click "Sign In" in navbar
- Fill in: Email, Password
- Submit button with loading state

### 3. **Modal Switching**
- In Sign In modal: "Don't have an account? Sign Up"
- In Sign Up modal: "Already have an account? Sign In"
- Seamless switching between modals

### 4. **User Profile (After Login)**
- Navbar shows user avatar (first letter of name)
- Shows user name
- Logout button available

### 5. **Google Sign-In Buttons**
- "Sign in with Google" button in both modals
- Ready to integrate with Google OAuth (backend needed)

### 6. **Protected Pages**
Try accessing these URLs without signing in:
- `/team` - Blocked with access restriction overlay
- `/projects` - Blocked with access restriction overlay
- `/achievements` - Blocked with access restriction overlay
- `/` - Accessible (public)
- `/contact` - Accessible (public)

---

## 🧪 Test Scenarios

### Test Sign Up
1. Click "Sign Up" button
2. Fill form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `Password123`
   - Confirm: `Password123`
3. Click "Sign Up"
4. See loading state
5. Form validation prevents submission if:
   - Password is less than 6 characters
   - Passwords don't match
   - Required fields are empty

### Test Sign In
1. Click "Sign In" button
2. Fill form:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Sign In"
4. See loading state

### Test Protected Pages
1. Logout (click "Logout" in navbar)
2. Go to `/team`
3. Should see overlay: "Access Restricted - Please sign in to view the team members"
4. Click "Sign In Now"
5. Sign In modal appears

### Test Modal Features
1. Open Sign In modal
2. Click X button to close
3. Click outside modal to close (on gray background)
4. Click "Sign Up" link at bottom
5. Should switch to Sign Up modal

---

## 🎨 Visual Tour

### Navbar States

**Before Login:**
- "Sign In" button (text style)
- "Sign Up" button (black background, white text)

**After Login:**
- User avatar with initial
- User name display
- "Logout" button (black background, white text)

### Modals

**Sign Up Modal:**
- Title: "Create Account"
- Subtitle: "Join VESCO and start collaborating"
- 4 input fields (Name, Email, Password, Confirm Password)
- Sign Up button
- "Or" divider
- Google Sign Up button
- "Already have an account? Sign In" link

**Sign In Modal:**
- Title: "Welcome Back"
- Subtitle: "Sign in to your VESCO account"
- 2 input fields (Email, Password)
- Sign In button
- "Or" divider
- Google Sign In button
- "Don't have an account? Sign Up" link

---

## 🔍 Files to Review

### Core Files
1. `src/context/AuthContext.tsx` - Auth state management
2. `src/components/auth/SignInModal.tsx` - Sign in form
3. `src/components/auth/SignUpModal.tsx` - Sign up form
4. `src/components/layout/Navbar.tsx` - Navigation with auth

### Protected Pages
1. `src/app/team/page.tsx` - Protected team page
2. `src/app/projects/page.tsx` - Protected projects page
3. `src/app/achievements/page.tsx` - Protected achievements page

---

## 📝 Notes

- **Local Storage**: Auth tokens are stored in HTTP-only cookies (secure)
- **No Backend Yet**: Forms will validate but can't submit to real backend until backend is ready
- **Google OAuth**: Button is prepared but needs backend implementation
- **Database**: Not yet connected (backend implementation phase)

---

## ⚠️ Known Limitations (To Be Fixed in Backend)

1. Form submissions won't work - backend endpoints needed
2. Google OAuth not functional - backend integration required
3. No persistent auth after page reload - needs JWT backend setup
4. User data not saved - needs database setup

---

## 🎯 Next Phase

Once backend is ready with:
- `/api/auth/signup` endpoint
- `/api/auth/signin` endpoint
- `/api/auth/me` endpoint
- `/api/auth/logout` endpoint
- `/api/auth/google` endpoint
- Database setup with User model
- JWT token generation

Then all features will be fully functional!

---

## 💡 Tips

- Check browser console (F12) for any error messages
- Network tab shows API calls (will be empty until backend is ready)
- Application tab shows cookies once authenticated
- Try different input combinations to test validation

---

**Frontend Implementation Status: ✅ COMPLETE**

Ready for backend integration!
