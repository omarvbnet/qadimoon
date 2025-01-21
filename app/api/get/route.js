import db from '../../../lib/db';

export  async function GET(req, res) {


  try {
    // جلب جميع البيانات من الجدول
    const [rows] = await db.query('SELECT * FROM montamin');
    const tree = buildTree(rows);

    // إرسال البيانات كهيكل شجري
   // res.status(200).json(tree);
    return new Response(JSON.stringify(tree), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching data', details: error.message }), { status: 500 }); //res.status(500).json({ error: 'Error fetching data', details: error.message });
  } finally {
 //  await db.end(); // إغلاق الاتصال
  }
}

// دالة لبناء الشجرة
function buildTree(data, parentId = null) {
    return data
      .filter(item => item.referrer_id === parentId)
      .map(item => {
        const children = buildTree(data, item.id); // استدعاء الدالة للحصول على الأبناء
        const grandchildrenCount = children.reduce(
          (acc, child) => acc + child.children.length, // جمع عدد أبناء الأبناء (الأحفاد)
          0
        );
  
        return {
          ...item,
          children: children,
          children_count: children.length, // عدد الأبناء
          grandchildren_count: grandchildrenCount, // عدد الأحفاد
        };
      });
  }