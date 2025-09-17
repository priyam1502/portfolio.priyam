import { useEffect, useState } from 'react';
import { OrdersAPI } from '../api';

export default function FarmerOrders() {
	const [orders, setOrders] = useState<any[]>([]);
	useEffect(() => { load(); }, []);
	async function load() {
		const list = await OrdersAPI.forFarmer();
		setOrders(list);
	}
	async function decide(id: number, decision: 'accept'|'reject') {
		await OrdersAPI.decide(id, decision);
		await load();
	}
	return (
		<div style={{ padding: 16 }}>
			<h2>Incoming Orders</h2>
			{orders.map(o => (
				<div key={o.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 8 }}>
					<div>Crop: {o.crop}</div>
					<div>Buyer: {o.buyer_name}</div>
					<div>Qty: {o.quantity} @ ₹{o.unit_price}</div>
					<div>Status: {o.status}</div>
					{o.status === 'pending' && (
						<div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
							<button onClick={() => decide(o.id, 'accept')}>Accept</button>
							<button onClick={() => decide(o.id, 'reject')}>Reject</button>
						</div>
					)}
				</div>
			))}
		</div>
	);
}