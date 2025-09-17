import { useState } from 'react';
import { AuthAPI } from '../api';
import { useAuth } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Register() {
	const [role, setRole] = useState<'farmer'|'buyer'>('farmer');
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [location, setLocation] = useState('');
	const [error, setError] = useState<string | null>(null);
	const setAuth = useAuth(s => s.setAuth);
	const navigate = useNavigate();

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			const res = await AuthAPI.register({ role, name, phone: phone || undefined, email: email || undefined, password: password || undefined, location: location || undefined });
			setAuth(res.user, res.token);
			navigate('/browse');
		} catch (e: any) {
			setError(e?.response?.data?.error || 'Register failed');
		}
	}

	return (
		<div style={{ maxWidth: 480, margin: '24px auto' }}>
			<h2>Register</h2>
			<form onSubmit={onSubmit}>
				<div style={{ marginBottom: 8 }}>
					<label>
						Role:
						<select value={role} onChange={e => setRole(e.target.value as any)} style={{ marginLeft: 8 }}>
							<option value="farmer">Farmer</option>
							<option value="buyer">Buyer</option>
						</select>
					</label>
				</div>
				<input placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
				<input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
				<input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
				<input placeholder="Password (optional)" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
				<input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
				<button type="submit">Create account</button>
				{error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
			</form>
		</div>
	);
}