import { NextRequest, NextResponse } from 'next/server';
import { updateGuest, deleteGuest } from '@/lib/kv';

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const body = await request.json();

    try {
        const updated = await updateGuest(id, body);

        if (!updated) {
            return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar convidado' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        const deleted = await deleteGuest(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao excluir convidado' }, { status: 500 });
    }
}
