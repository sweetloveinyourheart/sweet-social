import ReactDOM from 'react-dom/client'
import './index.scss'
import { RouterProvider } from 'react-router-dom'
import router from './routers.tsx'
import AuthProvider from './features/Auth/contexts/AuthContext.tsx'
import MobileDetector from './components/MobileDetector/MobileDetector.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <MobileDetector>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </MobileDetector>
)
