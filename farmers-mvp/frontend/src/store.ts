import { create } from 'zustand';

export type Role = 'farmer' | 'buyer' | null;

interface AuthState {
	user: { id: number; role: 'farmer'|'buyer'; name: string } | null;
	token: string | null;
	setAuth: (user: any, token: string) => void;
	logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
	user: null,
	token: localStorage.getItem('token'),
	setAuth: (user, token) => {
		localStorage.setItem('token', token);
		set({ user, token });
	},
	logout: () => {
		localStorage.removeItem('token');
		set({ user: null, token: null });
	},
}));