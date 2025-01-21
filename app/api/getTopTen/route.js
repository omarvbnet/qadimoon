import db from '../../../lib/db';

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT id, name, total_count
      FROM montamin
      ORDER BY total_count DESC
      LIMIT 10
    `);

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error fetching top 10.' }), { status: 500 });
  }
}