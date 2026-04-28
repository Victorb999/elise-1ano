import { NextRequest, NextResponse } from 'next/server';
import { getGuests, createGuest } from '@/lib/kv';

export async function GET() {
    try {
        const guests = await getGuests();
        return NextResponse.json(guests);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar convidados' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newGuest = await createGuest(body);
        return NextResponse.json(newGuest);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao criar convidado' }, { status: 500 });
    }
}
