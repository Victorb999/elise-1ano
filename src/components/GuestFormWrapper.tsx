'use client';

import { useState } from 'react';
import { Guest } from '@/lib/types';
import GuestForm from './GuestForm';

export default function GuestFormWrapper({ guest }: { guest: Guest }) {
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <div className="glass-card p-12 rounded-3xl max-w-2xl mx-auto mt-12 text-center space-y-6 animate-in zoom-in duration-500">
                <div className="text-6xl animate-bounce">✨</div>
                <h2 className="text-4xl gold-text font-bold">Obrigado!</h2>
                <p className="text-xl text-gray-600">
                    Sua confirmação foi enviada com sucesso. Mal podemos esperar por esse dia mágico!
                </p>
                <div className="pt-6">
                    <div className="inline-block px-8 py-4 bg-primary-100 text-primary-600 rounded-full font-bold">
                        Nos vemos em 16 de Maio! 🏰
                    </div>
                </div>
            </div>
        );
    }

    return <GuestForm guest={guest} onSuccess={() => setSubmitted(true)} />;
}
