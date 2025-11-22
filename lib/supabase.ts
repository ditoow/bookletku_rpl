import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// test connection
async function testConnection() {
    const { data, error } = await supabase.from('menu_items').select('id').limit(1);

    if (error) {
        console.error("❌ Supabase gagal konek:", error.message);
    } else {
        console.log("✅ Supabase berhasil konek");
    }
}

testConnection(); 
