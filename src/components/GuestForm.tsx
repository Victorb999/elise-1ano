'use client';

import { useState } from 'react';
import { Guest } from '@/lib/types';

interface Props {
    guest: Guest;
    onSuccess: () => void;
}

export default function GuestForm({ guest, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState<boolean | null>(guest.confirmed);
    const [selectedCompanions, setSelectedCompanions] = useState<string[]>(guest.confirmedCompanions || []);
    const [message, setMessage] = useState(guest.message || '');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (confirmed === null) {
            setError('Por favor, selecione se você virá ou não.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/guests/${guest.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    confirmed,
                    confirmedCompanions: selectedCompanions,
                    message,
                    totalConfirmed: (confirmed ? 1 : 0) + selectedCompanions.length,
                    confirmedAt: new Date().toISOString()
                }),
            });

            if (res.ok) {
                onSuccess();
            } else {
                setError('Ops! Algo deu errado ao salvar. Tente novamente.');
            }
        } catch (err) {
            setError('Erro de conexão. Verifique sua internet.');
        } finally {
            setLoading(false);
        }
    };

    const toggleCompanion = (name: string) => {
        setSelectedCompanions(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    return (
        <div className="glass-card p-8 rounded-3xl max-w-2xl mx-auto mt-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold to-primary-300" />

            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Olá, {guest.name}! ✨
            </h2>

            <p className="text-center text-gray-600 mb-8">
                Sua presença tornará este dia mágico! Por favor, confirme se você poderá vir.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        type="button"
                        onClick={() => setConfirmed(true)}
                        className={`flex-1 py-4 px-6 rounded-2xl font-bold transition-all border-2 ${confirmed === true
                            ? 'bg-primary-500 text-white border-primary-500 shadow-lg scale-105'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-primary-200'
                            }`}
                    >
                        ✅ Sim, eu vou!
                    </button>
                    <button
                        type="button"
                        onClick={() => setConfirmed(false)}
                        className={`flex-1 py-4 px-6 rounded-2xl font-bold transition-all border-2 ${confirmed === false
                            ? 'bg-gray-700 text-white border-gray-700 shadow-lg scale-105'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        ❌ Não poderei ir
                    </button>
                </div>

                {guest.companions.length > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="font-bold text-gray-800 text-lg">Acompanhantes liberados:</h3>
                        <p className="text-sm text-gray-500 italic">Selecione quem irá:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {guest.companions.map((comp) => (
                                <button
                                    key={comp}
                                    type="button"
                                    onClick={() => toggleCompanion(comp)}
                                    className={`text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${selectedCompanions.includes(comp)
                                        ? 'border-gold bg-primary-50 text-gold-dark'
                                        : 'border-gray-100 text-gray-600'
                                        }`}
                                >
                                    <span className="font-medium">{comp}</span>
                                    {selectedCompanions.includes(comp) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <label className="block font-bold text-gray-800">Recadinho especial (opcional):</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Deixe uma mensagem para a Elise..."
                        className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-primary-300 outline-none h-32 text-gray-700 bg-white/50"
                    />
                </div>

                {error && <div className="text-primary-500 text-center font-bold">{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-5 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                >
                    {loading ? 'Enviando...' : 'Confirmar Presença ✨'}
                </button>
            </form>
        </div>
    );
}
