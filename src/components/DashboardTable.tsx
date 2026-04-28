'use client';

import { Guest } from '@/lib/types';
import { useState } from 'react';

export default function DashboardTable({ guests }: { guests: Guest[] }) {
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all');

    const filteredGuests = guests.filter(g => {
        const matchesName = g.name.toLowerCase().includes(filter.toLowerCase()) ||
            (g.companions && g.companions.some(c => c.toLowerCase().includes(filter.toLowerCase())));
        const matchesStatus =
            statusFilter === 'all' ? true :
                statusFilter === 'confirmed' ? (g.confirmed === true || (g.confirmedCompanions && g.confirmedCompanions.length > 0)) :
                    statusFilter === 'pending' ? g.confirmed === null :
                        g.confirmed === false && (!g.confirmedCompanions || g.confirmedCompanions.length === 0);

        return matchesName && matchesStatus;
    });

    const copyLink = (id: string) => {
        const url = `${window.location.origin}/?id=${id}`;
        navigator.clipboard.writeText(url);
        alert('Link copiado!');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-gray-50/50">
                <input
                    type="text"
                    placeholder="Buscar convidado..."
                    className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-gold w-full md:w-64"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <div className="flex gap-2">
                    {['all', 'confirmed', 'pending', 'declined'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === s
                                ? 'bg-gold text-white shadow-md'
                                : 'bg-white text-gray-400 border border-gray-100 hover:border-gold-light'
                                }`}
                        >
                            {s === 'all' ? 'Todos' : s === 'confirmed' ? '✅' : s === 'pending' ? '⏳' : '❌'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest">
                            <th className="px-6 py-4 font-bold">Convidado</th>
                            <th className="px-6 py-4 font-bold">Acompanhantes</th>
                            <th className="px-6 py-4 font-bold">Grupo</th>
                            <th className="px-6 py-4 font-bold text-center">Adultos+Crianças</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold text-center">Check-in</th>
                            <th className="px-6 py-4 font-bold">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredGuests.map((g) => (
                            <tr key={g.id} className="hover:bg-primary-50/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-800">{g.name}</div>
                                    <div className="text-xs text-gray-400">{g.id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-gray-600 max-w-[200px] break-words">
                                        {g.companions && g.companions.length > 0 ? g.companions.join(', ') : <span className="text-gray-300 italic">Nenhum</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-md bg-gray-100 text-[10px] font-bold text-gray-500 uppercase">
                                        {g.group}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="text-sm font-bold text-gray-700">
                                        {g.companionCount + 1}👤 + {g.childrenCount}👶
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {g.confirmed === true || (g.confirmedCompanions && g.confirmedCompanions.length > 0) ? (
                                        <span className="text-green-600 font-bold text-sm">✅ {g.confirmed === false ? 'Acompanhante(s)' : 'Confirmado'}</span>
                                    ) : g.confirmed === false ? (
                                        <span className="text-red-500 font-bold text-sm">❌ Recusou</span>
                                    ) : (
                                        <span className="text-amber-500 font-bold text-sm italic">⏳ Pendente</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="text-xs text-gray-500">
                                        {g.confirmedAt ? new Date(g.confirmedAt).toLocaleDateString('pt-BR') : '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => copyLink(g.id)}
                                        className="p-2 text-gold hover:bg-gold hover:text-white rounded-lg transition-all"
                                        title="Copiar Link Único"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredGuests.length === 0 && (
                    <div className="p-20 text-center text-gray-400 italic">
                        Nenhum convidado encontrado com esses filtros.
                    </div>
                )}
            </div>
        </div>
    );
}
