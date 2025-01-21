import db from '../../../lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM montamin ');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء جلب المنتمين.' }), { status: 500 });
  }
}