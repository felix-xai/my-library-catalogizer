import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initializeDb } from '@/lib/db';

export async function POST(request: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not set in environment variables.");
            return NextResponse.json({ error: 'Server API Configuration Error' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
        });

        const formData = await request.formData();
        const file = formData.get('image') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Prompt for Gemini
        const prompt = `
      You are an expert librarian and data extraction AI. Look at this image of books.
      Extract all the book titles and authors you can clearly read from the spines or covers.
      Pay special attention to books in Tamil, as well as English or any other language.
      
      Return ONLY a JSON array of objects with the keys "title" and "author". If you can't read the author, leave it as an empty string.
      Do not include markdown or formatting, just raw JSON.
    `;

        // Process image with Gemini
        const result = await model.generateContent([
            {
                inlineData: {
                    data: buffer.toString("base64"),
                    mimeType: file.type
                }
            },
            prompt
        ]);

        const responseText = result.response.text();
        let booksExtracted: { title: string, author: string }[] = [];

        try {
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            booksExtracted = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse Gemini output:", responseText);
            throw new Error("Invalid output format from Vision AI");
        }

        const jobId = `job_${Date.now()}`;
        const db = await initializeDb();

        // Enhance with Google Books API and insert as pending
        for (const book of booksExtracted) {
            if (!book.title) continue;

            let coverUrl = null;
            let isbn = null;
            let publisher = null;
            let pageCount = null;

            try {
                const query = encodeURIComponent(`intitle:${book.title} inauthor:${book.author}`);
                const gbRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);

                if (gbRes.ok) {
                    const data = await gbRes.json();
                    if (data.items && data.items.length > 0) {
                        const info = data.items[0].volumeInfo;
                        // Attempt to get high-res if available, else thumbnail
                        coverUrl = info.imageLinks?.thumbnail?.replace('http:', 'https:') || null;
                        if (coverUrl) {
                            // Remove zoom to get higher quality
                            coverUrl = coverUrl.replace('&zoom=1', '&zoom=0');
                        }
                        publisher = info.publisher || null;
                        pageCount = info.pageCount || null;

                        const identifiers = info.industryIdentifiers || [];
                        const isbn13 = identifiers.find((i: any) => i.type === 'ISBN_13')?.identifier;
                        const isbn10 = identifiers.find((i: any) => i.type === 'ISBN_10')?.identifier;
                        isbn = isbn13 || isbn10 || null;
                    }
                }
            } catch (e) {
                console.warn('Google Books enrichment failed for', book.title);
            }

            await db.run(
                `INSERT INTO books (title, author, cover_url, isbn, publisher, page_count, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [book.title, book.author, coverUrl, isbn, publisher, pageCount, `pending_${jobId}`]
            );
        }

        return NextResponse.json({ success: true, jobId });

    } catch (error) {
        console.error('Extraction error:', error);
        return NextResponse.json(
            { error: 'Failed to process image' },
            { status: 500 }
        );
    }
}
