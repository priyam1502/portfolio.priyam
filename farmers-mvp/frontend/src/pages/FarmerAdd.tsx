import { useState } from 'react';
import { ProduceAPI } from '../api';

export default function FarmerAdd() {
	const [crop, setCrop] = useState('Onion');
	const [price, setPrice] = useState<number>(20);
	const [qty, setQty] = useState<number>(50);
	const [unit, setUnit] = useState('kg');
	const [imageUrl, setImageUrl] = useState('');
	const [status, setStatus] = useState('');

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setStatus('Creating...');
		await ProduceAPI.create({ crop, price_per_unit: price, quantity_available: qty, unit, image_url: imageUrl || undefined });
		setStatus('Created!');
	}

	return (
		<div style={{ maxWidth: 520, margin: '24px auto' }}>
			<h2>Add Produce</h2>
			<form onSubmit={submit}>
				<input value={crop} onChange={e => setCrop(e.target.value)} placeholder="Crop" style={{ width: '100%', padding: 8, marginBottom: 8 }} />
				<input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Price per unit" style={{ width: '100%', padding: 8, marginBottom: 8 }} />
				<input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} placeholder="Quantity" style={{ width: '100%', padding: 8, marginBottom: 8 }} />
				<input value={unit} onChange={e => setUnit(e.target.value)} placeholder="Unit" style={{ width: '100%', padding: 8, marginBottom: 8 }} />
				<input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL (optional)" style={{ width: '100%', padding: 8, marginBottom: 8 }} />
				<button type="submit">Add</button>
			</form>
			<div>{status}</div>
		</div>
	);
}