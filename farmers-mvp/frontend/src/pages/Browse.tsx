import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProduceAPI } from '../api';

export default function Browse() {
	const [items, setItems] = useState<any[]>([]);
	const [q, setQ] = useState('');
	const [loc, setLoc] = useState('');
	useEffect(() => { load(); }, []);
	async function load() {
		const list = await ProduceAPI.list();
		setItems(list);
	}
	async function search() {
		const list = await ProduceAPI.list({ crop: q || undefined, location: loc || undefined });
		setItems(list);
	}
	return (
		<div style={{ padding: 16 }}>
			<h2>Browse Produce</h2>
			<div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
				<input placeholder="Crop" value={q} onChange={e => setQ(e.target.value)} />
				<input placeholder="Location" value={loc} onChange={e => setLoc(e.target.value)} />
				<button onClick={search}>Search</button>
			</div>
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
				{items.map(it => (
					<div key={it.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
						<div style={{ fontWeight: 600 }}>{it.crop}</div>
						<div>Farmer: {it.farmer_name || 'Unknown'}</div>
						<div>Location: {it.farmer_location || '-'}</div>
						<div>Price: ₹{it.price_per_unit}/{it.unit}</div>
						<div>Qty: {it.quantity_available} {it.unit}</div>
						<Link to={`/order/${it.id}`}>Order</Link>
					</div>
				))}
			</div>
		</div>
	);
}