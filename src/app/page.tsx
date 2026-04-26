import { getGuests, getGuestById } from '@/lib/kv';
import EventInfo from '@/components/EventInfo';
import GuestSearch from '@/components/GuestSearch';
import GuestFormWrapper from '@/components/GuestFormWrapper';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const guests = await getGuests();
  const guestId = (await searchParams).id;
  const currentGuest = guestId ? await getGuestById(guestId) : null;

  return (
    <main className="min-h-screen py-10 px-4 md:py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-light rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 text-4xl animate-pulse delay-75 opacity-20 select-none">✨</div>
      <div className="absolute top-10 right-20 text-3xl animate-bounce delay-200 opacity-20 select-none">👑</div>
      <div className="absolute bottom-20 left-1/4 text-2xl animate-pulse delay-500 opacity-20 select-none">💖</div>
      <div className="absolute bottom-40 right-10 text-5xl animate-bounce delay-1000 opacity-10 select-none">🏰</div>

      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        {!currentGuest ? (
          <>
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-700">
              <div className="text-6xl mb-4">👑</div>
              <h2 className="text-2xl md:text-3xl text-gray-500 font-serif lowercase italic">O Reino de Elise convida!</h2>
              <h1 className="text-5xl md:text-7xl lg:text-8xl gold-text font-serif leading-tight">
                Elise<br /><span className="text-3xl md:text-5xl">1 Aninho</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-md mx-auto pt-8">
                Para começar, por favor, escreva seu nome para encontrarmos seu convite:
              </p>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <GuestSearch guests={guests} />
            </div>
          </>
        ) : (
          <div className="animate-in fade-in duration-1000">
            <EventInfo />
            <GuestFormWrapper guest={currentGuest} />
            <div className="text-center pt-10">
              <a href="/" className="text-gray-400 hover:text-gold underline text-sm">
                Não é você? Clique aqui para trocar de nome.
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Aesthetic Footer */}
      <footer className="mt-20 text-center text-gray-400 text-sm italic py-10">
        Com amor, Papai e Mamãe! ❤️
      </footer>
    </main>
  );
}
