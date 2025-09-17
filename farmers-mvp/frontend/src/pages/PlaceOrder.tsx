import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrdersAPI, ProduceAPI } from '../api';

export default function PlaceOrder() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [item, setItem] = useState<any | null>(null);
	const [qty, setQty] = useState<number>(1);
	const [status, setStatus] = useState<string>('');
	useEffect(() => { (async () => {
		const list = await ProduceAPI.list();
		const found = list.find((x: any) => String(x.id) === String(id));
		setItem(found || null);
	})(); }, [id]);

	async function place() {
		if (!id) return;
		setStatus('Placing order...');
		const order = await OrdersAPI.create({ produce_id: Number(id), quantity: qty });
		setStatus('Order placed. Simulating payment...');
		await OrdersAPI.pay(order.id);
		setStatus('Payment successful. Redirecting...');
		setTimeout(() => navigate('/browse'), 1000);
	}

	if (!item) return <div style={{ padding: 16 }}>Loading...</div>;
	return (
		<div style={{ padding: 16 }}>
			<h2>Order {item.crop}</h2>
			<div>Price: ₹{item.price_per_unit}/{item.unit}</div>
			<div>Available: {item.quantity_available} {item.unit}</div>
			<input type="number" min={1} max={item.quantity_available} value={qty} onChange={e => setQty(Number(e.target.value))} />
			<button onClick={place} style={{ marginLeft: 8 }}>Place Order</button>
			<div>{status}</div>
		</div>
	);
}