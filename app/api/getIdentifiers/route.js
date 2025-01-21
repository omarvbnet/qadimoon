import db from '../../../lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT id, name FROM montamin');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch identifiers.' }), { status: 500 });
  }
}