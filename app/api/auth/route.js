import db from '../../../lib/db'
import bcrypt from 'bcrypt';


export  async function  POST(req) {
  const { username, password } = await req.json();
console.log(username)
  try {
    // البحث عن المستخدم في قاعدة البيانات
    const [rows] = await db.execute(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );

    if (rows.length > 0) {
      console.log('pass', rows[0].password)
      console.log('p', password)
  

// افترض أن `password` هي كلمة المرور التي يريد المستخدم تسجيلها

// توليد السلسلة المشفرة باستخدام bcrypt
const saltRounds = 10;  // عامل تكلفة (عدد الدورات) لتوليد الـ salt
const hashedPassword = await bcrypt.hash(rows[0].password, saltRounds);

// تخزين `hashedPassword` في قاعدة البيانات بدلاً من كلمة المرور الأصلية
// الآن يمكنك تخزين `hashedPassword` في قاعدة البيانات
      // التحقق من صحة كلمة المرور باستخدام bcrypt
      const isPasswordValid = await bcrypt.compare(password,hashedPassword);
      console.log('pass', isPasswordValid)

      if (isPasswordValid) {
        return new Response(JSON.stringify({ success: true,token:'123456', message: 'Authenticated' }), { status: 200 });

      } else {
        return new Response(JSON.stringify({ success: false, message: 'Invalid credentials' }), { status: 401 });

      }
    } else {
      return new Response(JSON.stringify({ success: false, message: 'Invalid username' }), { status: 401 });

    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: 'Invalid ERROR' }), { status: 401 });

  }
}