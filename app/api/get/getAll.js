import db from '../../../lib/db';

export  async function GET(req, res) {


  try {
    // جلب جميع البيانات من الجدول
    const [rows] = await db.query('SELECT * FROM montamin');

    // إرسال البيانات كهيكل شجري
   // res.status(200).json(tree);
    return new Response(JSON.stringify(rows), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching data', details: error.message }), { status: 500 }); //res.status(500).json({ error: 'Error fetching data', details: error.message });
  } finally {
 //  await db.end(); // إغلاق الاتصال
  }
}

// دالة لبناء الشجرة
