import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MarketsPage from './pages/MarketsPage'
import ProductsPage from './pages/ProductsPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import DeleteAccountPage from './pages/DeleteAccountPage'

function Spinner() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

const ALLOWED_EMAIL = 'jorgerodrigotorrez@gmail.com'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <Spinner />
  if (!session || session.user.email !== ALLOWED_EMAIL) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { session, loading } = useAuth()
  if (loading) return <Spinner />

  return (
    <Routes>
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/delete-account" element={<DeleteAccountPage />} />
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/markets" element={<MarketsPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
