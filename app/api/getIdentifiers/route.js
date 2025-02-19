import  db  from '../../../lib/db';

export async function GET(req) {
    try {
        console.log('🔍 API Request received:', req.url);

        // استخراج `query` من الـ URL
        const url = new URL(req.url, `http://${req.headers.host}`);
        const query = url.searchParams.get('query');

        if (!query) {
            console.log('⚠️ No query provided, returning empty array');
            return new Response(JSON.stringify([]), { status: 200 });
        }

        console.log('🔍 Searching for:', query);

        // تنفيذ الاستعلام في قاعدة البيانات
        const [results] = await db.query(
            `SELECT id, name FROM montamin WHERE name LIKE ? LIMIT 10`,
            [`%${query}%`]
        );

        console.log('✅ Query results:', results);
        return new Response(JSON.stringify(results), { status: 200 });

    } catch (error) {
        console.error('❌ Error fetching identifiers:', error);
        
        // إرسال تفاصيل الخطأ إلى المتصفح للمساعدة في التحليل
        return new Response(JSON.stringify({ message: 'حدث خطأ أثناء البحث عن المعرفين', error: error.message }), { status: 500 });
    }
}
