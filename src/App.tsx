import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useSyncStore } from '@/store/sync.store'
import FieldLayout from '@/layouts/FieldLayout'
import AuthLayout from '@/layouts/AuthLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import ProjectList from '@/pages/Projects/ProjectList'
import ProjectDetail from '@/pages/Projects/ProjectDetail'
import EstimationView from '@/pages/Projects/EstimationView'
import MaterialList from '@/pages/Materials/MaterialList'
import RequestForm from '@/pages/Materials/RequestForm'
import LogList from '@/pages/LaborLog/LogList'
import LogForm from '@/pages/LaborLog/LogForm'
import RoleGuard from '@/components/RoleGuard'
import MarketingLanding from '@/pages/MarketingLanding'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  const setOnline = useSyncStore(s => s.setOnline)

  useEffect(() => {
    const on  = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [setOnline])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketing Landing Page */}
        <Route path="/" element={<MarketingLanding />} />

        {/* Public Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Field Worker PWA App */}
        <Route element={<RequireAuth><FieldLayout /></RequireAuth>}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/projects">
            <Route index element={<ProjectList />} />
            <Route path=":id" element={<ProjectDetail />} />
            <Route path=":projectId/estimations/:id" element={<EstimationView />} />
          </Route>

          <Route path="/materials">
            <Route index element={<MaterialList />} />
            <Route path="request/:projectId" element={
              <RoleGuard roles={['admin', 'foreman']}><RequestForm /></RoleGuard>
            } />
          </Route>

          <Route path="/logs">
            <Route index element={<LogList />} />
            <Route path="new" element={
              <RoleGuard roles={['admin', 'foreman']}><LogForm /></RoleGuard>
            } />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
