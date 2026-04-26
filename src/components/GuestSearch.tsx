'use client';

import { useState, useEffect, useRef } from 'react';
import { Guest } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface Props {
    guests: Guest[];
}

export default function GuestSearch({ guests }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ guest: Guest; matchName: string; isCompanion?: boolean }[]>([]);
    const [showResults, setShowResults] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (query.length < 3) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const searchResults: { guest: Guest; matchName: string; isCompanion?: boolean }[] = [];

        guests.forEach(g => {
            if (g.name.toLowerCase().includes(lowerQuery)) {
                searchResults.push({ guest: g, matchName: g.name });
            }
            g.companions.forEach(c => {
                if (c.toLowerCase().includes(lowerQuery)) {
                    searchResults.push({ guest: g, matchName: c, isCompanion: true });
                }
            });
        });

        setResults(searchResults.slice(0, 6));
    }, [query, guests]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (guest: Guest) => {
        setQuery(guest.name);
        setShowResults(false);
        router.push(`/?id=${guest.id}`);
    };

    return (
        <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    placeholder="Escreva seu nome aqui..."
                    className="w-full px-6 py-4 text-lg rounded-full border-2 border-gold-light focus:border-gold outline-none shadow-lg transition-all bg-white/80"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-primary-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {results.map((r, i) => (
                        <button
                            key={`${r.guest.id}-${i}`}
                            onClick={() => handleSelect(r.guest)}
                            className="w-full text-left px-6 py-4 hover:bg-primary-50 transition-colors border-b last:border-0 border-primary-50"
                        >
                            <div className="font-bold text-gray-800">
                                {r.matchName}
                                {r.isCompanion && (
                                    <span className="ml-2 text-xs font-normal text-gray-400">
                                        (com {r.guest.name})
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-gray-500">{r.guest.group}</div>
                        </button>
                    ))}
                </div>
            )}

            {showResults && query.length >= 3 && results.length === 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white px-6 py-4 rounded-2xl shadow-2xl border border-primary-100 text-gray-500 italic">
                    Não encontramos esse nome. Tente digitar de outra forma.
                </div>
            )}
        </div>
    );
}
