import { NextResponse } from 'next/server';
import { initializeDb } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
        return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    try {
        const db = await initializeDb();
        const pendingBooks = await db.all(
            `SELECT * FROM books WHERE status = ?`,
            [`pending_${jobId}`]
        );

        return NextResponse.json({ books: pendingBooks });
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch pending books' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { books, jobId } = body;

        if (!books || !Array.isArray(books)) {
            return NextResponse.json({ error: 'Invalid books data' }, { status: 400 });
        }

        const db = await initializeDb();

        // Begin transaction conceptually
        for (const book of books) {
            if (book.action === 'delete') {
                await db.run(`DELETE FROM books WHERE id = ?`, [book.id]);
            } else {
                // Check if a book with this title already exists in the active catalog
                const existing = await db.get(
                    `SELECT id FROM books WHERE LOWER(title) = LOWER(?) AND status = 'active'`,
                    [book.title]
                );

                if (existing) {
                    // Duplicate found, discard the pending record
                    await db.run(`DELETE FROM books WHERE id = ?`, [book.id]);
                } else {
                    // Update and set active
                    await db.run(
                        `UPDATE books SET title = ?, author = ?, status = 'active' WHERE id = ?`,
                        [book.title, book.author, book.id]
                    );
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ error: 'Failed to save books' }, { status: 500 });
    }
}
