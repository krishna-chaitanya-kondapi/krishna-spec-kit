import { Navigate, Route, Routes } from 'react-router-dom'
import AdminSetupPage from '../pages/AdminSetupPage'
import AdminLoginPage from '../pages/AdminLoginPage'
import ResponseReviewPage from '../pages/ResponseReviewPage'

const AdminRoutes = () => (
  <Routes>
    <Route path="/setup" element={<AdminSetupPage />} />
    <Route path="/login" element={<AdminLoginPage />} />
    <Route path="/review" element={<ResponseReviewPage />} />
    <Route path="*" element={<Navigate to="/admin/login" replace />} />
  </Routes>
)

export default AdminRoutes
