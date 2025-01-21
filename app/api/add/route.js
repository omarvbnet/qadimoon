import db from '../../../lib/db';

export  async function POST(req, res) {
 
      const {
        name,
    province,
    city,
    phone_number,
    voter_id_number,
    registration_center_name,
    identifier, 
      } = await req.json();

      try {
          // إضافة المنتمي الجديد
          await db.query(
           `
            INSERT INTO montamin (name, governorate, city, phone_number, voter_id, registration_center, referrer_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_DATE)
          `,
              [ name,
                province,
                city,
                phone_number,
                voter_id_number,
                registration_center_name,
                identifier, ]
          );

          // تحديث عدد الإضافات للمعرف
          await db.query(
              `UPDATE montamin 
              SET total_count = total_count + 1 
              WHERE id = ?`,
              [identifier]
          );
         
         

          // جلب العدد المحدث
          const [identifiers] = await db.query(
              `SELECT total_count FROM montamin WHERE id = ?`,
              [identifier]
          );
         

          const addedCount = identifiers[0]?.total_count || 0;
          let newRole = 'منتمي';

          // تحديث الدور بناءً على عدد الإضافات
          if (addedCount >= 1000) newRole = 'قائد';
          else if (addedCount >= 100) newRole = 'مشرف';
          else if (addedCount >= 10) newRole = 'عضو';

          await db.query(
              `UPDATE montamin 
              SET role = ? 
              WHERE id = ?`,
              [newRole, identifier]
          );
         

          return new Response(JSON.stringify({ message: 'تم إضافة المنتمي بنجاح!' }), { status: 201 });
      } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'حدث خطأ أثناء إضافة المنتمي.' }), { status: 500 });
      }
  } 
 