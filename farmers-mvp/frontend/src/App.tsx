import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import PlaceOrder from './pages/PlaceOrder';
import FarmerAdd from './pages/FarmerAdd';
import FarmerOrders from './pages/FarmerOrders';
import FarmerDashboard from './pages/FarmerDashboard';
import { useAuth } from './store';

function Nav() {
	const { user, logout } = useAuth();
	return (
		<nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
			<Link to="/">Home</Link>
			<Link to="/browse">Browse</Link>
			{user?.role === 'buyer' && <Link to="/orders">My Orders</Link>}
			{user?.role === 'farmer' && <>
				<Link to="/farmer/add">Add Produce</Link>
				<Link to="/farmer/orders">Incoming Orders</Link>
				<Link to="/farmer/dashboard">Dashboard</Link>
			</>}
			<div style={{ marginLeft: 'auto' }}>
				{user ? (
					<button onClick={logout}>Logout ({user.name})</button>
				) : (
					<>
						<Link to="/login">Login</Link>
						<Link to="/register" style={{ marginLeft: 8 }}>Register</Link>
					</>
				)}
			</div>
		</nav>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<Nav />
			<Routes>
				<Route path="/" element={<Navigate to="/browse" />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/browse" element={<Browse />} />
				<Route path="/order/:id" element={<PlaceOrder />} />
				<Route path="/farmer/add" element={<FarmerAdd />} />
				<Route path="/farmer/orders" element={<FarmerOrders />} />
				<Route path="/farmer/dashboard" element={<FarmerDashboard />} />
				<Route path="*" element={<div style={{ padding: 24 }}>Not found</div>} />
			</Routes>
		</BrowserRouter>
	);
}