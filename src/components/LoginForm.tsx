'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const [pw, setPw] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/dashboard?pw=${pw}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-8">
                <div className="text-4xl">🔐</div>
                <h1 className="text-2xl font-bold text-gray-800">Acesso Restrito</h1>
                <p className="text-gray-500">Digite a senha para acessar o painel administrativo.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="password"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        placeholder="Senha"
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:border-gold text-center text-xl tracking-widest"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
                    >
                        Entrar no Painel
                    </button>
                </form>
            </div>
        </div>
    );
}
