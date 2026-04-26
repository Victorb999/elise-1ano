import { Guest } from '@/lib/types';

export default function DashboardStats({ guests }: { guests: Guest[] }) {
    const confirmed = guests.filter(g => g.confirmed === true);
    const pending = guests.filter(g => g.confirmed === null);
    const declined = guests.filter(g => g.confirmed === false);

    const totalConfirmedAdults = confirmed.reduce((acc: number, g) => acc + 1 + (g.confirmedCompanions?.length || 0), 0);
    const totalConfirmedChildren = confirmed.reduce((acc: number, g) => acc + (g.childrenCount || 0), 0);

    const stats = [
        { label: 'Confirmados ✅', value: confirmed.length, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Pendentes ⏳', value: pending.length, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Recusaram ❌', value: declined.length, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Adultos ✅', value: totalConfirmedAdults, color: 'text-gold-dark', bg: 'bg-primary-50' },
        { label: 'Crianças ✅', value: totalConfirmedChildren, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {stats.map((s) => (
                <div key={s.label} className={`p-6 rounded-3xl shadow-sm border border-white ${s.bg}`}>
                    <div className={`text-sm font-bold uppercase tracking-wider mb-2 ${s.color}`}>{s.label}</div>
                    <div className="text-4xl font-bold text-gray-800">{s.value}</div>
                </div>
            ))}
        </div>
    );
}
