import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

// Define the absolute path to the database
const dbPath = path.join(process.cwd(), 'library.sqlite');

export async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

export async function initializeDb() {
  const db = await openDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT,
      isbn TEXT,
      cover_url TEXT,
      publisher TEXT,
      page_count INTEGER,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}
