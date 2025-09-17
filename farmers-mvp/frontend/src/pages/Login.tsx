import { useState } from 'react';
import { AuthAPI } from '../api';
import { useAuth } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const setAuth = useAuth(s => s.setAuth);
	const navigate = useNavigate();

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			const res = await AuthAPI.login({ phone: phone || undefined, email: email || undefined, password: password || undefined });
			setAuth(res.user, res.token);
			navigate('/browse');
		} catch (e: any) {
			setError(e?.response?.data?.error || 'Login failed');
		}
	}

	return (
		<div style={{ maxWidth: 420, margin: '24px auto' }}>
			<h2>Login</h2>
			<form onSubmit={onSubmit}>
				<input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
				<div style={{ textAlign: 'center', margin: 8 }}>or</div>
				<input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
				<input placeholder="Password (if set)" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
				<button type="submit">Login</button>
				{error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
			</form>
		</div>
	);
}