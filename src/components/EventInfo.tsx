import { Guest, EventData } from '@/lib/types';
import eventJson from '@/data/event.json';

export default function EventInfo() {
    const event = eventJson as EventData;

    return (
        <div className="space-y-6 text-center">
            <div className="inline-block px-4 py-1 rounded-full bg-primary-100 text-primary-500 font-bold tracking-widest text-xs uppercase mb-2">
                Você é nosso convidado!
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl gold-text mb-4 leading-tight">
                {event.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="glass-card p-6 rounded-3xl princess-border">
                    <div className="text-gold mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="#fff">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="text-sm uppercase text-gray-500 font-bold tracking-wider">Data</div>
                    <div className="text-xl font-bold">{event.date}</div>
                </div>

                <div className="glass-card p-6 rounded-3xl princess-border">
                    <div className="text-gold mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="#fff">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-sm uppercase text-gray-500 font-bold tracking-wider">Horário</div>
                    <div className="text-xl font-bold">{event.time}</div>
                </div>
            </div>

            <div className="glass-card p-8 rounded-3xl princess-border max-w-2xl mx-auto mt-4">
                <div className="text-gold mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="#fff">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div className="text-sm uppercase text-gray-500 font-bold tracking-wider">Local</div>
                <div className="text-xl font-bold mb-1">{event.location}</div>
                <div className="text-sm text-gray-600">{event.address}</div>

                <div className="mt-6 rounded-2xl overflow-hidden shadow-inner border border-primary-100 h-48 w-full">
                    <iframe
                        src={event.googleMapsUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </div>
    );
}
