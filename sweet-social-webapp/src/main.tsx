import ReactDOM from 'react-dom/client'
import './index.scss'
import { RouterProvider } from 'react-router-dom'
import router from './routers.tsx'
import AuthProvider from './features/Auth/contexts/AuthContext.tsx'
import MobileDetector from './components/MobileDetector/MobileDetector.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <MobileDetector>
    <AuthProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>;
    </AuthProvider>
  </MobileDetector>
)
