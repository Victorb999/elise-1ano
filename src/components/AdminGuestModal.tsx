'use client';

import { Guest } from '@/lib/types';
import { useState, useEffect } from 'react';

interface Props {
    guest?: Guest; // If provided, we are editing
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AdminGuestModal({ guest, isOpen, onClose, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<Partial<Guest>>({
        id: '',
        name: '',
        group: 'Amigo',
        hasCompanions: false,
        companionCount: 0,
        childrenCount: 0,
        companions: [],
        confirmed: null,
        confirmedAt: null,
        confirmedCompanions: [],
        totalConfirmed: 0,
        message: ''
    });

    useEffect(() => {
        if (guest) {
            setFormData(guest);
        } else {
            setFormData({
                id: '',
                name: '',
                group: 'Amigo',
                hasCompanions: false,
                companionCount: 0,
                childrenCount: 0,
                companions: [],
                confirmed: null,
                confirmedAt: null,
                confirmedCompanions: [],
                totalConfirmed: 0,
                message: ''
            });
        }
    }, [guest, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const isEditing = !!guest;
        const url = isEditing ? `/api/guests/${guest.id}` : '/api/guests';
        const method = isEditing ? 'PUT' : 'POST';

        // If adding new, generate ID if empty
        let finalData = { ...formData };
        if (!isEditing && !finalData.id) {
            finalData.id = finalData.name?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                setError(data.error || 'Erro ao salvar convidado.');
            }
        } catch (err) {
            setError('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompanionChange = (index: number, value: string) => {
        const newCompanions = [...(formData.companions || [])];
        newCompanions[index] = value;
        setFormData({
            ...formData,
            companions: newCompanions,
            companionCount: newCompanions.length,
            hasCompanions: newCompanions.length > 0
        });
    };

    const addCompanionField = () => {
        const newCompanions = [...(formData.companions || []), ''];
        setFormData({
            ...formData,
            companions: newCompanions,
            companionCount: newCompanions.length,
            hasCompanions: true
        });
    };

    const removeCompanionField = (index: number) => {
        const newCompanions = [...(formData.companions || [])];
        newCompanions.splice(index, 1);
        setFormData({
            ...formData,
            companions: newCompanions,
            companionCount: newCompanions.length,
            hasCompanions: newCompanions.length > 0
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <header className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {guest ? 'Editar Convite' : 'Novo Convite'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600">Nome do Convidado</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold outline-none transition-all"
                                placeholder="Nome Completo"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600">ID Único (opcional)</label>
                            <input
                                type="text"
                                value={formData.id}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold outline-none transition-all"
                                placeholder="Gerado automaticamente se vazio"
                                disabled={!!guest}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600">Grupo</label>
                            <select
                                value={formData.group}
                                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold outline-none transition-all bg-white"
                            >
                                <option value="Família Mãe">Família Mãe</option>
                                <option value="Família Pai">Família Pai</option>
                                <option value="Amigo">Amigo</option>
                                <option value="Trabalho">Trabalho</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600">Crianças</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.childrenCount}
                                onChange={(e) => setFormData({ ...formData, childrenCount: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-t pt-4">
                            <h3 className="font-bold text-gray-800">Acompanhantes ({formData.companions?.length || 0})</h3>
                            <button
                                type="button"
                                onClick={addCompanionField}
                                className="text-sm bg-gold/10 text-gold-dark px-3 py-1 rounded-lg font-bold hover:bg-gold/20 transition-all"
                            >
                                + Adicionar
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.companions?.map((companion, index) => (
                                <div key={index} className="flex gap-2 animate-in slide-in-from-right-4 duration-200">
                                    <input
                                        type="text"
                                        value={companion}
                                        onChange={(e) => handleCompanionChange(index, e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-gold outline-none transition-all"
                                        placeholder={`Acompanhante ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeCompanionField(index)}
                                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            {(!formData.companions || formData.companions.length === 0) && (
                                <p className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded-xl">
                                    Nenhum acompanhante cadastrado.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-primary-50 p-6 rounded-2xl space-y-4 border border-primary-100">
                        <h4 className="text-xs font-bold text-primary-400 uppercase tracking-widest">Status da Confirmação</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500">Presença</label>
                                <select
                                    className="w-full px-4 py-2 rounded-xl border border-gray-100 focus:border-gold outline-none transition-all bg-white text-sm"
                                    value={formData.confirmed === true ? 'true' : formData.confirmed === false ? 'false' : 'null'}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData({
                                            ...formData,
                                            confirmed: val === 'true' ? true : val === 'false' ? false : null
                                        });
                                    }}
                                >
                                    <option value="null">Pendente</option>
                                    <option value="true">Confirmado</option>
                                    <option value="false">Recusou</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500">Check-in</label>
                                <input
                                    type="text"
                                    disabled
                                    value={formData.confirmedAt ? new Date(formData.confirmedAt).toLocaleString('pt-BR') : 'Ainda não realizado'}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-100 bg-gray-100/50 text-gray-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
                </form>

                <footer className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-gold text-white rounded-xl font-bold shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : guest ? 'Atualizar' : 'Criar Convite'}
                    </button>
                </footer>
            </div>
        </div>
    );
}
