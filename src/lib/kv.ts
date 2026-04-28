import { kv } from '@vercel/kv';
import { Guest } from './types';
import guestsJson from '@/data/guests.json';

const GUESTS_KEY = 'elise:guests';

export async function getGuests(): Promise<Guest[]> {
    try {
        // Attempt to get from KV
        const data = await kv.get<Guest[]>(GUESTS_KEY);
        if (data) return data;
    } catch (e) {
        console.warn('KV not available, using local file');
    }

    // Dev fallback
    return guestsJson as Guest[];
}

export async function getGuestById(id: string): Promise<Guest | null> {
    const guests = await getGuests();
    return guests.find(g => g.id === id) || null;
}

export async function updateGuest(id: string, updates: Partial<Guest>): Promise<Guest | null> {
    const guests = await getGuests();
    const index = guests.findIndex(g => g.id === id);

    if (index === -1) return null;

    const updatedGuest = { ...guests[index], ...updates };
    guests[index] = updatedGuest;

    try {
        await kv.set(GUESTS_KEY, guests);
    } catch (e) {
        console.warn('Could not save to KV. In local dev, changes are memory-only.');
    }

    return updatedGuest;
}

export async function createGuest(guest: Guest): Promise<Guest> {
    const guests = await getGuests();
    guests.push(guest);

    try {
        await kv.set(GUESTS_KEY, guests);
    } catch (e) {
        console.warn('Could not save to KV');
    }

    return guest;
}

export async function deleteGuest(id: string): Promise<boolean> {
    const guests = await getGuests();
    const index = guests.findIndex(g => g.id === id);

    if (index === -1) return false;

    guests.splice(index, 1);

    try {
        await kv.set(GUESTS_KEY, guests);
        return true;
    } catch (e) {
        console.warn('Could not save to KV');
        return false;
    }
}

export async function resetGuests(): Promise<void> {
    try {
        await kv.set(GUESTS_KEY, guestsJson);
    } catch (e) {
        console.error('Failed to reset KV');
    }
}
