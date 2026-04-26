import { getGuests } from '@/lib/kv';
import DashboardStats from '@/components/DashboardStats';
import DashboardTable from '@/components/DashboardTable';
import LoginForm from '@/components/LoginForm';

export default async function Dashboard({
    searchParams,
}: {
    searchParams: Promise<{ pw?: string }>;
}) {
    const pw = (await searchParams).pw;
    const correctPw = process.env.DASHBOARD_PASSWORD || 'elise1ano'; // fallback pra dev

    if (pw !== correctPw) {
        return <LoginForm />;
    }

    const guests = await getGuests();

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
            <div className="max-w-7xl mx-auto space-y-10">
                <header className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-serif gold-text">Painel de Convidados</h1>
                        <p className="text-gray-500">Controle de confirmações e acessos</p>
                    </div>
                    <div className="px-6 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm font-bold text-gray-500">
                        Total na Lista: {guests.length} Convites
                    </div>
                </header>

                <DashboardStats guests={guests} />

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <DashboardTable guests={guests} />
                </div>
            </div>
        </div>
    );
}
