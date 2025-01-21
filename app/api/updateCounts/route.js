import db from '../../../lib/db';

export async function GET() {
  try {
    // تحديث العدد الإجمالي لكل معرف
    const query = `
      UPDATE montamin AS parent
      LEFT JOIN (
        SELECT parent_id, COUNT(*) AS direct_count
        FROM montamin
        WHERE parent_id IS NOT NULL
        GROUP BY parent_id
      ) AS counts
      ON parent.id = counts.parent_id
      SET parent.total_count = IFNULL(counts.direct_count, 0)
    `;

    await db.query(query);

    return new Response(JSON.stringify({ message: 'Counts updated successfully!' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error updating counts.' }), { status: 500 });
  }
}