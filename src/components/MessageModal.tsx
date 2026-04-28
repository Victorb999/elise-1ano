'use client';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    guestName: string;
    message: string;
}

export default function MessageModal({ isOpen, onClose, guestName, message }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <header className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Mensagem de Carinho</h2>
                        <p className="text-xs text-gold-dark font-medium uppercase tracking-widest">De: {guestName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <div className="p-8 text-center italic text-gray-700 bg-white relative">
                    <svg className="absolute top-4 left-4 h-12 w-12 text-gold/10 -z-0" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M10 8v8h4v-8h-4zm10 0v8h4v-8h-4z" />
                    </svg>
                    <p className="text-lg leading-relaxed relative z-10">
                        "{message}"
                    </p>
                    <div className="mt-8 flex justify-center">
                        <div className="w-12 h-1 bg-gradient-to-r from-gold/50 to-primary-300/50 rounded-full" />
                    </div>
                </div>

                <footer className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-all shadow-lg overflow-hidden relative group"
                    >
                        <span className="relative z-10">Fechar</span>
                        <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                </footer>
            </div>
        </div>
    );
}
