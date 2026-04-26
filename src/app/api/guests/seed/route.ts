import { NextResponse } from 'next/server';
import { resetGuests } from '@/lib/kv';

export async function POST() {
    try {
        await resetGuests();
        return NextResponse.json({ message: 'KV reset with seed data successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to reset KV' }, { status: 500 });
    }
}
