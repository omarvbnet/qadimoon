import { NextResponse } from 'next/server';
import db from '../../../lib/db';

// دالة لحساب الدور بناءً على عدد الأبناء والأحفاد
const calculateRole = (totalCount) => {
    let newRole = 'منتمي';
    if (totalCount >= 1000) newRole = 'قائد';
    else if (totalCount >= 100) newRole = 'مشرف';
    else if (totalCount >= 10) newRole = 'عضو';

  return newRole;
};

export async function POST(req) {
  try {
    const { id, totalCount } = await req.json();  // استخدم await للوصول إلى البيانات في POST request

    // التأكد من أن البيانات موجودة في الـ body
    if (!id || totalCount === undefined) {
      return NextResponse.json({ message: 'ID and totalCount are required' }, { status: 400 });
    }

    // حساب الدور بناءً على العدد المرسل
    const updatedRole = calculateRole(totalCount);

    // تحديث الدور في قاعدة البيانات بناءً على memberId
    db.query(
      'UPDATE montamin SET role = ?, total_count = ? WHERE id = ?',
      [updatedRole, totalCount,id],
      (err, result) => {
        if (err) {
          console.error('Error updating role:', err);
          return NextResponse.json({ message: 'Error updating role', error: err }, { status: 500 });
        }

        return NextResponse.json({ message: 'Role updated successfully', id, updatedRole }, { status: 200 });
      }
    );

  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}