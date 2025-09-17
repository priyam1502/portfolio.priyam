import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:4000/api',
});

api.interceptors.request.use(config => {
	const token = localStorage.getItem('token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export const AuthAPI = {
	register: (data: any) => api.post('/auth/register', data).then(r => r.data),
	login: (data: any) => api.post('/auth/login', data).then(r => r.data),
};

export const ProduceAPI = {
	list: (params?: any) => api.get('/produce', { params }).then(r => r.data),
	create: (data: any) => api.post('/produce', data).then(r => r.data),
	update: (id: number, data: any) => api.put(`/produce/${id}`, data).then(r => r.data),
	remove: (id: number) => api.delete(`/produce/${id}`).then(r => r.data),
};

export const OrdersAPI = {
	create: (data: any) => api.post('/orders', data).then(r => r.data),
	forFarmer: () => api.get('/orders/farmer').then(r => r.data),
	forBuyer: () => api.get('/orders/buyer').then(r => r.data),
	decide: (id: number, decision: 'accept'|'reject') => api.post(`/orders/${id}/decision`, { decision }).then(r => r.data),
	pay: (id: number) => api.post(`/orders/${id}/pay`).then(r => r.data),
};

export const AnalyticsAPI = {
	farmer: () => api.get('/analytics/farmer').then(r => r.data),
};

export const NotificationsAPI = {
	list: () => api.get('/notifications').then(r => r.data),
	readAll: () => api.post('/notifications/read-all').then(r => r.data),
};

export default api;