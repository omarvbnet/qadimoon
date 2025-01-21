import db from '../../../lib/db';

export async function GET() {
  try {
    const query = `
      SELECT created_at AS date, COUNT(*) AS count
      FROM montamin
      GROUP BY created_at
      ORDER BY created_at ASC;
    `;

    const [rows] = await db.query(query);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error fetching daily stats.' }), { status: 500 });
  }
}