import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SurveyPage from './pages/SurveyPage'
import AdminRoutes from './routes/adminRoutes'

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<SurveyPage />} />
			<Route path="/admin/*" element={<AdminRoutes />} />
		</Routes>
	</BrowserRouter>
)

export default App
