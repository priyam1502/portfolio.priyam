import { useEffect, useState } from 'react';
import { AnalyticsAPI } from '../api';

export default function FarmerDashboard() {
	const [data, setData] = useState<any | null>(null);
	useEffect(() => { (async () => { setData(await AnalyticsAPI.farmer()); })(); }, []);
	if (!data) return <div style={{ padding: 16 }}>Loading...</div>;
	return (
		<div style={{ padding: 16 }}>
			<h2>Dashboard</h2>
			<div style={{ display: 'flex', gap: 16 }}>
				<div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>Total Sales: ₹{data.total_sales}</div>
				<div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>Total Orders: {data.total_orders}</div>
				<div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>Pending Orders: {data.pending_orders}</div>
			</div>
		</div>
	);
}