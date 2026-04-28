'use client';

import { Guest } from '@/lib/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminGuestModal from './AdminGuestModal';
import MessageModal from './MessageModal';

export default function DashboardTable({ guests }: { guests: Guest[] }) {
    const router = useRouter();
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<Guest | undefined>(undefined);

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

    const handleEdit = (guest: Guest) => {
        setSelectedGuest(guest);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedGuest(undefined);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o convite de ${name}?`)) return;

        try {
            const res = await fetch(`/api/guests/${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
            } else {
                alert('Erro ao excluir convidado.');
            }
        } catch (err) {
            alert('Erro de conexão.');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-gray-50/50">
                <div className="flex gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Buscar convidado..."
                        className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-gold w-full md:w-64"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <button
                        onClick={handleAdd}
                        className="px-6 py-2 bg-gold text-white rounded-xl text-sm font-bold shadow-md hover:bg-gold-dark transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Novo Convite
                    </button>
                </div>
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
                            <tr key={g.id} className="hover:bg-primary-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-gray-800">{g.name}</div>
                                        {g.message && (
                                            <button
                                                onClick={() => { setSelectedGuest(g); setIsMessageModalOpen(true); }}
                                                className="p-1 bg-amber-100 text-amber-600 rounded-md hover:bg-amber-200 transition-colors"
                                                title="Ver mensagem"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400">{g.id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-gray-400 font-bold uppercase mb-1">Liberados:</div>
                                    <div className="text-xs text-gray-600 max-w-[200px] break-words mb-2">
                                        {g.companions && g.companions.length > 0 ? g.companions.join(', ') : <span className="text-gray-300 italic text-[10px]">Nenhum</span>}
                                    </div>
                                    {g.confirmedCompanions && g.confirmedCompanions.length > 0 && (
                                        <>
                                            <div className="text-[10px] text-green-500 font-bold uppercase mb-1">Confirmados:</div>
                                            <div className="text-xs text-green-700 font-medium">
                                                {g.confirmedCompanions.join(', ')}
                                            </div>
                                        </>
                                    )}
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
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {g.message && (
                                            <button
                                                onClick={() => { setSelectedGuest(g); setIsMessageModalOpen(true); }}
                                                className="p-2 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-all"
                                                title="Ver Mensagem"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => copyLink(g.id)}
                                            className="p-2 text-gold hover:bg-gold hover:text-white rounded-lg transition-all"
                                            title="Copiar Link Único"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleEdit(g)}
                                            className="p-2 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                                            title="Editar"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(g.id, g.name)}
                                            className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                            title="Excluir"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
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

            <AdminGuestModal
                isOpen={isModalOpen}
                guest={selectedGuest}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => router.refresh()}
            />

            <MessageModal
                isOpen={isMessageModalOpen}
                guestName={selectedGuest?.name || ''}
                message={selectedGuest?.message || ''}
                onClose={() => setIsMessageModalOpen(false)}
            />
        </div>
    );
}
